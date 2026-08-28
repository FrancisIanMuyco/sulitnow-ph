#!/usr/bin/env python3
"""
SulitNow PH — Scrape-Target Security Check
==========================================
Audits the external endpoints/domains that the SulitNow PH scrapers depend on,
so we never pull data from a compromised/malicious/known-vulnerable source.

It runs against a curated registry of every URL the scrapers actually hit:
  * nuclei  -> template-based scan for known CVEs / misconfig / exposed data
  * nikto   -> web server misconfiguration & outdated software scan
  * (sqlmap) -> optional, only if a source exposes a query parameter with a
                likely SQL injection observable (default: guarded, --level 1)

Output:
  public/data/security-report.json  -> findings + per-source verdict

Usage:
  python3 scripts/security/check_sources.py [--only-nuclei] [--skip-nikto]
                                            [--url https://...]
                                            [--domain example.com]
"""

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from recon_helpers import (  # noqa: E402
    TOOL_PATHS, run_tool, check_source, recommend_strategy,
)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Central registry: every external host the scrapers touch.
# This is the single source of truth the security check audits.
# ---------------------------------------------------------------------------
SCRAPE_TARGETS = {
    # financial / APIs
    "open.er-api.com":      "currency API (USD base)",
    "api.exchangerate.host": "currency rate API",
    "pse.com.ph":           "PSE stock listings",
    # promos / telcos
    "smart.com.ph":         "Smart promo pages",
    "tnt.ph":               "TNT promo pages",
    "globe.com.ph":         "Globe promo pages",
    "dito.ph":              "DITO promo pages",
    # e-commerce / deals
    "shopee.ph":            "Shopee flash sale / vouchers",
    "lazada.com.ph":        "Lazada deals",
    "picodi.com":           "Picodi PH vouchers",
    "retailmenot.ph":       "RetailMeNot PH coupons",
    # finance institutions (fees/rates)
    "gcash.com":            "GCash fees",
    "maya.ph":              "Maya fees",
    "sss.gov.ph":           "SSS contributions",
    "philhealth.gov.ph":    "PhilHealth table",
    "pagibigfund.gov.ph":   "Pag-IBIG table",
    "bir.gov.ph":           "BIR tax tables / deadlines",
    "bangko.com.ph":        "bank rates",
    "landbank.com":         "bank rates",
    "bdo.com.ph":           "bank rates",
    # weather / misc
    "api.open-meteo.com":   "weather API",
    "api.twilio.com":       "crypto/gold data APIs",
    "api.gold-api.com":     "gold price API",
    "api.coingecko.com":    "crypto price API",
    "pagasa.dost.gov.ph":   "PAGASA weather",
    "dotr.gov.ph":          "transport fares",
    "lto.gov.ph":           "LTO fees",
}

# Query-param endpoints we should be careful with (potential SQLi surface).
# Format: full URL that the scraper calls with a user-controlled value.
SQLI_CANDIDATES = [
    # "https://example.com/search.php?id="  # add real ones as discovered
]


def clean_host(url_or_host):
    h = url_or_host.strip()
    h = re.sub(r"^https?://", "", h)
    h = h.split("/")[0].split(":")[0]
    return h


def nuclei_scan(targets, timeout=180):
    """Run nuclei against a list of hosts/URLs. Return list of findings."""
    if "nuclei" not in TOOL_PATHS:
        return {"error": "nuclei not installed"}, False
    hostfile = os.path.join(os.path.dirname(__file__), "recon-out", "sec-hosts.txt")
    os.makedirs(os.path.dirname(hostfile), exist_ok=True)
    with open(hostfile, 'w') as f:
        f.write("\n".join(targets))

    findings = []
    res = run_tool("nuclei", ["-l", hostfile, "-silent", "-jsonl", "-timeout", "10",
                              "-severity", "low,medium,high,critical"],
                   timeout=timeout)
    for line in res.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue
        findings.append({
            "template": obj.get("template-id"),
            "name": obj.get("info", {}).get("name"),
            "severity": obj.get("info", {}).get("severity"),
            "type": obj.get("type"),
            "matched": obj.get("matched-at") or obj.get("host"),
            "tags": obj.get("info", {}).get("tags"),
        })
    return findings, True


def nikto_scan(target, timeout=150):
    """Run nikto against a single host/URL."""
    if "nikto" not in TOOL_PATHS:
        return [], False
    res = run_tool("nikto", ["-h", target, "-nointeractive", "-Tuning", "123b"],
                   timeout=timeout)
    issues = []
    for line in res.stdout.splitlines():
        if line.startswith("+ "):
            issues.append(line[2:].strip())
    return issues[:50], True


def sqlmap_probe(urls, timeout=120):
    """Run sqlmap --level 1 --risk 1 on any candidate SQLi endpoints (guarded)."""
    if not urls or "sqlmap" not in TOOL_PATHS:
        return [], False
    findings = []
    for u in urls:
        res = run_tool("sqlmap", ["-u", u, "--batch", "--level", "1",
                                  "--risk", "1", "--smart", "--flush-session"],
                       timeout=timeout)
        if re.search(r"is vulnerable", res.stdout, re.I):
            findings.append({"url": u, "verdict": "VULNERABLE (sqlmap)"})
    return findings, True


def main():
    ap = argparse.ArgumentParser(description="SulitNow PH scrape-target security audit")
    ap.add_argument("--only-nuclei", action="store_true")
    ap.add_argument("--skip-nikto", action="store_true")
    ap.add_argument("--offline", action="store_true",
                    help="skip nuclei/nikto network scans; only reachability/WAF pre-check + report")
    ap.add_argument("--domain", help="extra host(s), comma separated")
    ap.add_argument("--url", help="extra URL(s), comma separated")
    ap.add_argument("--only", help="RESTRICT audit to these host(s) only (comma separated); overrides the full registry")
    ap.add_argument("--sqlmap", action="store_true", help="enable sqlmap probing (slow)")
    args = ap.parse_args()

    start = datetime.now()
    print("=" * 65)
    print("SulitNow PH — Scrape-Target Security Audit")
    print(f"Started: {start.isoformat()}")
    print("=" * 65)

    # Build target list
    if args.only:
        domains = set(clean_host(d) for d in args.only.split(",") if d.strip())
        labels = {d: "user-restricted" for d in domains}
    else:
        domains = set(SCRAPE_TARGETS.keys())
        labels = dict(SCRAPE_TARGETS)
    if args.domain:
        for d in [x.strip() for x in args.domain.split(",") if x.strip()]:
            domains.add(clean_host(d))
            labels.setdefault(clean_host(d), "user-specified")
    if args.url:
        for u in [x.strip() for x in args.url.split(",") if x.strip()]:
            domains.add(clean_host(u))
            labels.setdefault(clean_host(u), f"user URL {u}")

    print(f"\nAuditing {len(domains)} scrape sources...")

    report = {
        "lastUpdated": datetime.now().isoformat(),
        "toolAvailability": {t: t in TOOL_PATHS for t in
                             ["nuclei", "nikto", "sqlmap"]},
        "sources": [],
        "nucleiFindings": [],
        "niktoFindings": [],
        "sqlmapFindings": [],
        "verdict": "PASS",
        "blockedSources": [],
    }

    # 0. Quick reachability + anti-bot classification first (concurrent)
    print("\n[1/3] Reachability & WAF pre-check...", flush=True)

    def _probe(dom):
        chk = check_source(f"https://{dom}", timeout=8)
        return dom, chk

    prechecks = {}
    with ThreadPoolExecutor(max_workers=10) as ex:
        futs = {ex.submit(_probe, d): d for d in sorted(domains)}
        for fut in as_completed(futs):
            dom, chk = fut.result()
            prechecks[dom] = chk
            strat = recommend_strategy(chk)
            status = ("UP" if chk["reachable"] else "DOWN")
            warn = (" + " + chk["waf"] if chk["waf"] else "")
            print(f"    {dom:<24} {status:<5} {strat}{warn}", flush=True)
            if not chk["reachable"]:
                report["blockedSources"].append(dom)
            report["sources"].append({
                "domain": dom, "purpose": labels.get(dom, ""),
                "reachable": chk["reachable"], "status": chk["status"],
                "waf": chk["waf"], "blocked": chk["blocked"],
                "strategy": strat,
            })

    # 1. Nuclei scan
    print("\n[2/3] Running nuclei...", flush=True)
    if args.offline:
        print("    --offline: skipping nuclei/nikto scans")
        nuc_findings = []
    else:
        nuc_findings, _ = nuclei_scan(sorted(domains))
    if isinstance(nuc_findings, dict):
        print("    ⚠️ nuclei not installed")
    else:
        report["nucleiFindings"] = nuc_findings
        for f in nuc_findings[:20]:
            print(f"    [{f.get('severity','?').upper():<9}] {f.get('name')} @ {f.get('matched')}")
        if not nuc_findings:
            print("    (no nuclei findings)")

    # 2. Nikto scan (optional, can be slow) — only on reachable hosts
    if not args.only_nuclei and not args.skip_nikto and not args.offline:
        print("\n[3/3] Running nikto...")
        for dom in sorted(domains):
            if not report["blockedSources"] or dom not in report["blockedSources"]:
                print(f"    scanning {dom} ...")
                issues, _ = nikto_scan(dom)
                for i in issues[:8]:
                    print(f"      {i[:100]}")
                report["niktoFindings"].append({"host": dom, "issues": issues[:50]})
    else:
        report["niktoFindings"] = [{"note": "skipped"}]

    # 3. Optional sqlmap probing
    if args.sqlmap and SQLI_CANDIDATES:
        print("\n[extra] sqlmap on SQLi candidates...")
        findings, _ = sqlmap_probe(SQLI_CANDIDATES)
        report["sqlmapFindings"] = findings

    # Verdict: any high/critical nuclei finding → WARN
    high = [f for f in report["nucleiFindings"]
            if str(f.get("severity", "")).lower() in ("high", "critical")]
    if high:
        report["verdict"] = "REVIEW"

    out_path = os.path.join(OUTPUT_DIR, "security-report.json")
    with open(out_path, 'w') as f:
        json.dump(report, f, indent=2)

    elapsed = (datetime.now() - start).total_seconds()
    print("\n" + "=" * 65)
    print(f"✅ Audit complete in {elapsed:.1f}s")
    print(f"   verdict: {report['verdict']}")
    print(f"   nuclei findings: {len(report['nucleiFindings'])}")
    print(f"   saved: {out_path}")
    print("=" * 65)
    return 0 if report["verdict"] == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())

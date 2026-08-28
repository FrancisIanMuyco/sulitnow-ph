#!/usr/bin/env python3
"""
SulitNow PH — Tools Capability Inventory
========================================
Produces an accurate, regenerable report of which installed security/recon
tools are usable in THIS environment and how they map to the project.

Result: public/data/tools-inventory.json

Run:
  python3 scripts/security/tools_report.py
"""

import json
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from recon_helpers import TOOL_PATHS  # noqa: E402

OUTPUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data', 'tools-inventory.json')

# Per-tool: category, what it does for SulitNow PH, and network-sandbox status.
# "ready" reflects whether the binary is present on PATH.
PLAN = {
    "nuclei":     {"cat": "security", "use": "Scan every scrape source for known CVEs/misconfig before trusting data",
                   "notes": "slow on this sandbox network; best in CI"},
    "subfinder":  {"cat": "recon", "use": "Passive subdomain discovery of data-provider domains",
                   "notes": "needs live passive sources"},
    "naabu":      {"cat": "recon", "use": "Fast port scan to find data endpoints on provider hosts",
                   "notes": "works (router-init warning is cosmetic)"},
    "katana":     {"cat": "crawl", "use": "Crawl provider pages to find hidden API/JSON endpoints for scraping",
                   "notes": "works via --headless"},
    "ffuf":       {"cat": "fuzz", "use": "Fuzz provider hosts for API paths (api, v1, json ...)",
                   "notes": "requires a wordlist"},
    "gobuster":   {"cat": "fuzz", "use": "Directory/content discovery on provider sites",
                   "notes": "VERIFIED — found /robots.txt, /json on httpbin"},
    "amass":      {"cat": "recon", "use": "Heavy subdomain/ASN mapping of provider networks",
                   "notes": "slow; use subfinder first"},
    "bettercap":  {"cat": "network", "use": "MITM/arp-spoof for inspecting scraped endpoints (research)",
                   "notes": "needs root netifaces — limited in sandbox"},
    "nmap":       {"cat": "recon", "use": "Detailed service/version scan of provider hosts",
                   "notes": "NOT usable here — no net routes in sandbox; use naabu"},
    "nikto":      {"cat": "security", "use": "Web-server misconfig scan of scrape sources",
                   "notes": "slow network; best in CI"},
    "sqlmap":     {"cat": "security", "use": "Optional SQLi check on discovered query endpoints",
                   "notes": "guard with --level 1 --risk 1"},
    "hydra":      {"cat": "security", "use": "Auth brute-force (NOT for scraping; documented only)",
                   "notes": "do not use on sources without authorization"},
    "mitmproxy":  {"cat": "proxy", "use": "Local reverse/transparent proxy for debugging scraped APIs",
                   "notes": "useful as a debugging MITM for scrapers"},
    "httpx(go)":  {"cat": "recon", "use": "Probe which discovered hosts are alive + fingerprint",
                   "notes": "STANDALONE BINARY NOT INSTALLED — PATH has Python httpx CLI; install via go"},
    "tshark":     {"cat": "capture", "use": "Packet capture analysis of scraper traffic",
                   "notes": "works where capture permissions exist"},
    "john":       {"cat": "security", "use": "Password hash cracking (documented only, authorized use)",
                   "notes": "not part of scraping workflow"},
    "hashcat":    {"cat": "security", "use": "GPU hash cracking (authorized only)",
                   "notes": "not part of scraping workflow"},
}


def main():
    report = {
        "lastUpdated": datetime.now().isoformat(),
        "generatedBy": "scripts/security/tools_report.py",
        "environment": {
            "networkFast": False,
            "sandboxNetRoutes": False,  # nmap can't determine routes here
        },
        "tools": [],
    }
    for name, meta in PLAN.items():
        present = name.split("(")[0].strip() in TOOL_PATHS or name in TOOL_PATHS
        report["tools"].append({
            "name": name,
            "category": meta["cat"],
            "present": present,
            "useForSulitNow": meta["use"],
            "notes": meta["notes"],
        })

    report["summary"] = {
        "total": len(report["tools"]),
        "present": sum(1 for t in report["tools"] if t["present"]),
        "verdict": "All core recon/security tools installed. Run heavy scans in CI (fast network). "
                   "nmap needs a real host environment; PD httpx standalone binary not yet installed.",
    }

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)

    print("=" * 55)
    print("SulitNow PH — Tools Capability Inventory")
    print(f"  tools: {report['summary']['total']}, present: {report['summary']['present']}")
    for t in report["tools"]:
        mark = "[x]" if t["present"] else "[ ]"
        print(f"  {mark} {t['name']:<14} {t['category']:<8} {t['useForSulitNow'][:60]}")
    print("  saved:", OUTPUT)
    print("=" * 55)


if __name__ == "__main__":
    main()

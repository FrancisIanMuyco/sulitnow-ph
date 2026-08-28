#!/usr/bin/env python3
"""
SulitNow PH — Data-Source Discovery Toolkit
=========================================
Uses the newly installed recon tools to find NEW / hidden data sources
(API endpoints, subdomains, interesting paths) that the scrapers can pull
live data from.

Tools used (each one is optional — the script degrades gracefully):
  * subfinder   -> passive subdomain enumeration of a target domain
  * httpx       -> probe which discovered hosts/URLs are alive & fingerprint them
  * katana      -> crawl a known page and extract internal links/API paths
  * ffuf/gobuster -> fuzz for common API paths (data endpoints) on a host
  * nmap        -> quick service scan to spot open ports serving data

Output:
  public/data/recon-sources.json  -> consolidated report
  public/data/recon-*.txt          -> raw per-tool output

Usage:
  python3 scripts/security/discover_sources.py --domain smart.com.ph
  python3 scripts/security/discover_sources.py --crawl https://www.globe.com.ph
"""

import argparse
import json
import os
import re
import sys
import time
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from recon_helpers import (  # noqa: E402
    run_tool, TOOL_PATHS, require_path, available_tools,
)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)
RAW_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'recon-out')
os.makedirs(RAW_DIR, exist_ok=True)

# Common API-ish paths worth probing when fuzzing a host
API_PATH_WORDS = (
    "api v1 v2 v3 graphql rest search data rates price prices promos promo "
    "offers plans packages json xml feeds subscribe register auth token "
    "currency exchange stock stocks pse weather status health version "
    "latest now products deals"
).split()


def write_raw(name, text):
    if not text:
        return
    path = os.path.join(RAW_DIR, name)
    with open(path, 'w') as f:
        f.write(text if isinstance(text, str) else json.dumps(text, indent=2))
    return path


def discover_subdomains(domain, timeout=90):
    """Enumerate subdomains with subfinder. Returns list of hostnames."""
    if "subfinder" not in TOOL_PATHS:
        print("  [skip] subfinder not installed")
        return []
    print(f"  → subfinder: enumerating {domain}")
    res = run_tool("subfinder", ["-silent", "-d", domain], timeout=timeout)
    subs = [line.strip() for line in res.stdout.splitlines() if line.strip() and not line.startswith("[")]
    write_raw(f"subfinder-{domain}.txt", "\n".join(subs))
    print(f"    found {len(subs)} subdomains")
    return subs


def probe_hosts(hosts, timeout=90):
    """Probe which hosts are alive + capture title/tech with httpx."""
    if "httpx" not in TOOL_PATHS or not hosts:
        return []
    hostfile = os.path.join(RAW_DIR, "hosts-input.txt")
    with open(hostfile, 'w') as f:
        f.write("\n".join(hosts))
    print(f"  → httpx: probing {len(hosts)} hosts")
    res = run_tool("httpx", ["-silent", "-l", hostfile, "-title", "-tech-detect",
                             "-status-code", "-timeout", "5"], timeout=timeout)
    lines = [l.strip() for l in res.stdout.splitlines() if l.strip()]
    write_raw("httpx-alive.txt", "\n".join(lines))
    print(f"    {len(lines)} alive")
    return lines


def crawl_links(url, timeout=120):
    """Crawl a known page with katana and collect internal/API paths."""
    if "katana" not in TOOL_PATHS:
        print("  [skip] katana not installed")
        return []
    print(f"  → katana: crawling {url}")
    res = run_tool("katana", ["-u", url, "-silent", "-timeout", "10",
                              "-headless", "-sc", "-jc", "-d", "2"],
                   timeout=timeout)
    links = [l.strip() for l in res.stdout.splitlines() if l.strip()]
    write_raw(f"katana-{re.sub(r'[^a-z0-9]+', '-', url)[:40]}.txt", "\n".join(links))
    print(f"    collected {len(links)} links")
    return links


def fuzz_paths(host, wordlist=None, timeout=120):
    """Fuzz for API-ish endpoints with gobuster (dictionary of our own path words)."""
    if "gobuster" not in TOOL_PATHS:
        print("  [skip] gobuster not installed")
        return []
    wl = os.path.join(RAW_DIR, "api-words.txt")
    with open(wl, 'w') as f:
        f.write("\n".join(API_PATH_WORDS))
    base = host if host.startswith("http") else f"https://{host}"
    print(f"  → gobuster: fuzzing {base} (in-scope paths only)")
    res = run_tool("gobuster", ["dir", "-u", base, "-w", wl, "-t", "20",
                                "-q", "-s", "200,301,302,401"], timeout=timeout)
    found = [l.strip() for l in res.stdout.splitlines()
             if l.strip() and re.search(r"\(Status: (200|301|302|401)\)", l)]
    write_raw(f"gobuster-{host}.txt", "\n".join(found))
    print(f"    found {len(found)} interesting paths")
    return found


def scan_ports(host, timeout=90):
    """Quick nmap scan of common web/data ports on a host."""
    if "nmap" not in TOOL_PATHS:
        print("  [skip] nmap not installed")
        return []
    base = re.sub(r"^https?://", "", host).split("/")[0].split(":")[0]
    print(f"  → nmap: top-ports scan {base}")
    res = run_tool("nmap", ["-Pn", "--top-ports", "50", "-T4", base], timeout=timeout)
    write_raw(f"nmap-{base}.txt", res.stdout)
    open_ports = re.findall(r"^(\d+)/tcp\s+open", res.stdout, re.M)
    print(f"    open ports: {open_ports or 'none detected'}")
    return open_ports


def main():
    ap = argparse.ArgumentParser(description="SulitNow PH recon/data-source discovery")
    ap.add_argument("--domain", help="Target domain(s), comma separated (e.g. grid,smart.com.ph)")
    ap.add_argument("--crawl", help="A known URL to crawl with katana for API links")
    ap.add_argument("--fuzz", help="Host to fuzz for API paths (e.g. site.com)")
    ap.add_argument("--hosts", help="Comma separated known hosts to probe")
    ap.add_argument("--quick", action="store_true", help="Skip slow steps (no nmap)")
    args = ap.parse_args()

    start = datetime.now()
    print("=" * 60)
    print("SulitNow PH — Data-Source Discovery")
    print(f"Started: {start.isoformat()}")
    print("=" * 60)

    av = available_tools()
    print("\nAvailable recon tools:")
    print("  " + " ".join(f"{k}=✓" if v else f"{k}=✗" for k, v in av.items()))

    report = {
        "lastUpdated": datetime.now().isoformat(),
        "domains": [],
        "subdomains": [],
        "aliveHosts": [],
        "links": [],
        "paths": [],
        "ports": [],
        "notes": [],
    }

    domains = [d.strip() for d in (args.domain or "").split(",") if d.strip()]

    # 1. Subdomain enumeration
    for dom in domains:
        subs = discover_subdomains(dom)
        report["domains"].append(dom)
        if subs:
            report["subdomains"].extend(subs)

    # 2. Host probing (httpx) for discovered subs + user-provided hosts
    probe_targets = list(report["subdomains"])
    if args.hosts:
        probe_targets += [h.strip() for h in args.hosts.split(",") if h.strip()]
    if probe_targets:
        alive = probe_hosts(probe_targets)
        report["aliveHosts"].extend(alive)

    # 3. Crawl a known page for deep/API links
    if args.crawl:
        links = crawl_links(args.crawl)
        report["links"].extend(links)
        # Heuristic: keep only links that look like API/data endpoints
        api_links = [l for l in links if re.search(r"(/api/|/graphql|\?fmt=json|\.json$|/rates?|/prices?|/promos?)", l, re.I)]
        report["paths"].extend(api_links)

    # 4. Fuzz for API paths on a host
    if args.fuzz:
        paths = fuzz_paths(args.fuzz)
        report["paths"].extend(paths)

    # 5. Optional port scan
    if not args.quick:
        if args.fuzz:
            ports = scan_ports(args.fuzz)
            report["ports"].extend(ports)
        elif probe_targets and probe_targets:
            ports = scan_ports(probe_targets[0])
            report["ports"].extend(ports)

    # Consolidate and save
    for key in ("subdomains", "aliveHosts", "links", "paths", "ports"):
        report[key] = list(dict.fromkeys(report[key]))

    out_path = os.path.join(OUTPUT_DIR, "recon-sources.json")
    with open(out_path, 'w') as f:
        json.dump(report, f, indent=2)

    elapsed = (datetime.now() - start).total_seconds()
    print("\n" + "=" * 60)
    print(f"✅ Discovery complete in {elapsed:.1f}s")
    print(f"   subdomains: {len(report['subdomains'])}")
    print(f"   alive hosts: {len(report['aliveHosts'])}")
    print(f"   links: {len(report['links'])}")
    print(f"   api/data paths: {len(report['paths'])}")
    print(f"   saved: {out_path}")
    print("=" * 60)


if __name__ == "__main__":
    main()

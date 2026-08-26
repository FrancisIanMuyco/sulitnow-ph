#!/usr/bin/env python3
"""Health-check PH services using built-in urllib."""

import json
import os
import time
import random
import urllib.request
import urllib.error
import ssl
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

SERVICES = [
    {"id": "smart", "name": "Smart", "category": "Network", "url": "https://www.smart.com.ph"},
    {"id": "tnt", "name": "TNT", "category": "Network", "url": "https://www.smart.com.ph"},
    {"id": "globe", "name": "Globe", "category": "Network", "url": "https://www.globe.com.ph"},
    {"id": "tm", "name": "TM", "category": "Network", "url": "https://www.globe.com.ph/tm"},
    {"id": "dito", "name": "DITO", "category": "Network", "url": "https://dito.ph"},
    {"id": "gcash", "name": "GCash", "category": "E-Wallet", "url": "https://www.gcash.com"},
    {"id": "maya", "name": "Maya", "category": "E-Wallet", "url": "https://www.maya.ph"},
    {"id": "bdo", "name": "BDO", "category": "Bank", "url": "https://www.bdo.com.ph"},
    {"id": "bpi", "name": "BPI", "category": "Bank", "url": "https://www.bpi.com.ph"},
    {"id": "landbank", "name": "Landbank", "category": "Bank", "url": "https://www.landbank.com"},
    {"id": "securitybank", "name": "Security Bank", "category": "Bank", "url": "https://www.securitybank.com"},
    {"id": "metrobank", "name": "Metrobank", "category": "Bank", "url": "https://www.metrobank.com.ph"},
    {"id": "pldt", "name": "PLDT", "category": "Telecom", "url": "https://www.pldt.com"},
    {"id": "converge", "name": "Converge", "category": "Telecom", "url": "https://www.convergeict.com"},
    {"id": "sky", "name": "Sky Internet", "category": "Telecom", "url": "https://www.skybroadband.com.ph"},
    {"id": "shopee", "name": "Shopee", "category": "Shopping", "url": "https://shopee.ph"},
    {"id": "lazada", "name": "Lazada", "category": "Shopping", "url": "https://www.lazada.com.ph"},
    {"id": "grab", "name": "Grab", "category": "Services", "url": "https://www.grab.com/ph/"},
]

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def check_url(url):
    """Check if a URL responds."""
    headers = {"User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36"}
    start = time.time()
    try:
        req = urllib.request.Request(url, headers=headers, method="HEAD")
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        ms = round((time.time() - start) * 1000)
        code = resp.getcode()
        return {"status": "operational" if ms < 5000 else "issues", "responseTime": ms, "statusCode": code}
    except urllib.error.HTTPError as e:
        ms = round((time.time() - start) * 1000)
        code = e.code
        status = "issues" if code < 500 else "major"
        return {"status": status, "responseTime": ms, "statusCode": code}
    except Exception:
        # Try GET as fallback (some servers reject HEAD)
        try:
            start2 = time.time()
            req2 = urllib.request.Request(url, headers=headers)
            resp2 = urllib.request.urlopen(req2, timeout=10, context=ctx)
            ms2 = round((time.time() - start2) * 1000)
            code2 = resp2.getcode()
            return {"status": "operational" if ms2 < 5000 else "issues", "responseTime": ms2, "statusCode": code2}
        except urllib.error.HTTPError as e2:
            ms2 = round((time.time() - start2) * 1000)
            status2 = "issues" if e2.code < 500 else "major"
            return {"status": status2, "responseTime": ms2, "statusCode": e2.code}
        except Exception:
            return {"status": "major", "responseTime": None, "statusCode": None}


def main():
    print("🔍 Checking PH service statuses...")

    results = []
    for svc in SERVICES:
        print(f"  {svc['name']}...", end=" ", flush=True)
        check = check_url(svc["url"])
        icon = {"operational": "🟢", "issues": "🟡", "major": "🔴"}.get(check["status"], "⚪")
        ms = f"{check['responseTime']}ms" if check.get("responseTime") else "?"
        print(f"{icon} {check['status']} ({ms})")

        results.append({
            "id": svc["id"],
            "name": svc["name"],
            "category": svc["category"],
            "url": svc["url"],
            "status": check["status"],
            "responseTime": check.get("responseTime"),
            "statusCode": check.get("statusCode"),
        })
        time.sleep(0.2)

    output = {"lastUpdated": datetime.now().isoformat(), "services": results}
    with open(os.path.join(OUTPUT_DIR, 'service-status.json'), 'w') as f:
        json.dump(output, f, indent=2)

    op = sum(1 for s in results if s["status"] == "operational")
    is_ = sum(1 for s in results if s["status"] == "issues")
    mj = sum(1 for s in results if s["status"] == "major")
    print(f"\n✅ {op} operational, {is_} issues, {mj} major")


if __name__ == "__main__":
    main()

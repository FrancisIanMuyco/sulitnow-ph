#!/usr/bin/env python3
"""
SulitNow PH — Real-time Promo Scraper v2
Uses Playwright (headless Chromium) + proxy rotation
Scrapes Smart, TNT, Globe, TM, DITO promo pages
"""

import json
import re
import time
import random
import sys
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

# ── PROXY LIST ──
PROXIES_RAW = """45.3.35.133:3129:zpdatulg4kam:17wwbjixjro142m
45.3.62.146:3129:zpdatulg4kam:17wwbjixjro142m
216.26.253.214:3129:zpdatulg4kam:17wwbjixjro142m
216.26.251.190:3129:zpdatulg4kam:17wwbjixjro142m
209.50.175.112:3129:zpdatulg4kam:17wwbjixjro142m
209.50.183.156:3129:zpdatulg4kam:17wwbjixjro142m
104.207.38.155:3129:zpdatulg4kam:17wwbjixjro142m
45.3.50.71:3129:zpdatulg4kam:17wwbjixjro142m
216.26.232.99:3129:zpdatulg4kam:17wwbjixjro142m
45.3.42.135:3129:zpdatulg4kam:17wwbjixjro142m
209.50.169.4:3129:zpdatulg4kam:17wwbjixjro142m
209.50.177.64:3129:zpdatulg4kam:17wwbjixjro142m
209.50.188.18:3129:zpdatulg4kam:17wwbjixjro142m
216.26.255.73:3129:zpdatulg4kam:17wwbjixjro142m
104.207.36.218:3129:zpdatulg4kam:17wwbjixjro142m
65.111.15.60:3129:zpdatulg4kam:17wwbjixjro142m
45.3.49.192:3129:zpdatulg4kam:17wwbjixjro142m
209.50.186.243:3129:zpdatulg4kam:17wwbjixjro142m
209.50.190.151:3129:zpdatulg4kam:17wwbjixjro142m
216.26.253.229:3129:zpdatulg4kam:17wwbjixjro142m
65.111.13.183:3129:zpdatulg4kam:17wwbjixjro142m
65.111.1.138:3129:zpdatulg4kam:17wwbjixjro142m
209.50.161.176:3129:zpdatulg4kam:17wwbjixjro142m
65.111.28.16:3129:zpdatulg4kam:17wwbjixjro142m
216.26.239.97:3129:zpdatulg4kam:17wwbjixjro142m"""

def parse_proxies(raw: str) -> list[dict]:
    proxies = []
    for line in raw.strip().split('\n'):
        line = line.strip()
        if not line:
            continue
        parts = line.split(':')
        if len(parts) == 4:
            ip, port, user, pwd = parts
            proxies.append({"server": f"http://{ip}:{port}", "username": user, "password": pwd})
    return proxies

PROXIES = parse_proxies(PROXIES_RAW)


def get_proxy():
    return random.choice(PROXIES)


def extract_promos_from_page(page, network: str, url: str) -> list[dict]:
    """Extract promo data from a rendered page"""
    promos = []
    try:
        page.goto(url, wait_until="networkidle", timeout=30000)
        time.sleep(random.uniform(2, 4))  # Let JS render

        # Get page content after JS rendering
        content = page.content()
        text = page.inner_text("body")

        # Generic extraction: find all elements that look like promo cards
        # Try multiple selector strategies
        selectors = [
            '[class*="promo"]', '[class*="card"]', '[class*="plan"]',
            '[class*="offer"]', '[class*="package"]', '[class*="item"]',
            '[data-promo]', '[data-plan]',
        ]

        seen_texts = set()

        for selector in selectors:
            try:
                elements = page.query_selector_all(selector)
                for el in elements:
                    el_text = el.inner_text().strip()
                    if not el_text or len(el_text) < 10 or el_text in seen_texts:
                        continue
                    seen_texts.add(el_text)

                    # Extract price
                    price_match = re.search(r'₱?\s*(\d{2,4})', el_text)
                    if not price_match:
                        continue
                    price = int(price_match.group(1))
                    if price < 10 or price > 2000:
                        continue

                    # Extract data
                    data_match = re.search(r'(\d+\.?\d*)\s*(GB|MB|TB)', el_text, re.I)
                    data_str = "—"
                    data_gb = 0.0
                    if data_match:
                        val = float(data_match.group(1))
                        unit = data_match.group(2).upper()
                        data_str = f"{val:g}{unit}"
                        if unit == 'GB': data_gb = val
                        elif unit == 'MB': data_gb = val / 1024
                        elif unit == 'TB': data_gb = val * 1024

                    # Extract validity
                    validity_match = re.search(r'(\d+)\s*(?:days?|day)', el_text, re.I)
                    validity = int(validity_match.group(1)) if validity_match else 7

                    # Extract calls
                    calls = "—"
                    if re.search(r'unli(?:mited)?\s*(?:calls?|call)', el_text, re.I):
                        calls = "All networks"
                    elif re.search(r'(smart|tnt|globe|tm|dito)\s*(?:to|calls?)', el_text, re.I):
                        calls = re.search(r'(smart|tnt|globe|tm|dito)', el_text, re.I).group(1).upper() + " only"

                    # Extract texts
                    texts = "—"
                    if re.search(r'unli(?:mited)?\s*(?:texts?|sms)', el_text, re.I):
                        texts = "Unlimited"

                    # Name: first meaningful line
                    name_lines = [l.strip() for l in el_text.split('\n') if l.strip() and len(l.strip()) > 3]
                    name = name_lines[0][:60] if name_lines else f"{network} Promo"

                    promo_id = f"{network.lower()}-{price}-{data_str}".replace(' ', '')
                    promos.append({
                        "id": promo_id,
                        "network": network,
                        "name": name,
                        "price": price,
                        "data": data_str,
                        "dataGB": round(data_gb, 2),
                        "calls": calls,
                        "texts": texts,
                        "validity": validity,
                        "description": el_text[:150].strip(),
                        "costPerGB": round(price / data_gb, 2) if data_gb > 0 else 999,
                        "source": url,
                        "scrapedAt": datetime.now().isoformat(),
                    })
            except Exception:
                continue

        # Fallback: parse full page text for promo-like patterns
        if not promos:
            # Look for patterns like "GigaPro 99 2GB 7 days"
            pattern = re.compile(
                r'((?:Giga|Go\+|Easy|Tropang|Level|Data|Stream|All|DITO|Promo)\S*\s*\d{2,4})\s*.*?'
                r'(\d+\.?\d*\s*(?:GB|MB))\s*.*?'
                r'(?:₱?\s*)?(\d{2,4})\s*(?:\|?\s*)?(\d+)\s*(?:days?|day)',
                re.I | re.S
            )
            for m in pattern.finditer(text):
                name = m.group(1).strip()[:60]
                data_str = m.group(2).strip()
                price = int(m.group(3))
                validity = int(m.group(4))

                data_gb = 0
                dm = re.search(r'(\d+\.?\d*)\s*(GB|MB)', data_str, re.I)
                if dm:
                    val = float(dm.group(1))
                    unit = dm.group(2).upper()
                    data_gb = val if unit == 'GB' else val / 1024

                if 10 <= price <= 2000:
                    promos.append({
                        "id": f"{network.lower()}-{price}-{data_str}".replace(' ', ''),
                        "network": network,
                        "name": name,
                        "price": price,
                        "data": data_str,
                        "dataGB": round(data_gb, 2),
                        "calls": "—",
                        "texts": "—",
                        "validity": validity,
                        "description": f"{name} - {data_str} for {validity} days",
                        "costPerGB": round(price / data_gb, 2) if data_gb > 0 else 999,
                        "source": url,
                        "scrapedAt": datetime.now().isoformat(),
                    })

    except PWTimeout:
        print(f"  Timeout loading {url}", file=sys.stderr)
    except Exception as e:
        print(f"  Error scraping {url}: {e}", file=sys.stderr)

    return promos


def scrape_all():
    """Main scraping function using Playwright"""
    all_promos = []

    targets = [
        ("Smart", ["https://www.smart.com.ph/prepaid/giga", "https://www.smart.com.ph/prepaid/load-promos"]),
        ("TNT", ["https://www.smart.com.ph/prepaid/tnt", "https://www.tnt.ph/promos"]),
        ("Globe", ["https://www.globe.com.ph/prepaid/go", "https://www.globe.com.ph/prepaid/promos"]),
        ("TM", ["https://www.globe.com.ph/prepaid/tm", "https://www.globe.com.ph/prepaid/tm-promos"]),
        ("DITO", ["https://dito.ph/prepaid", "https://dito.ph/promos"]),
    ]

    with sync_playwright() as p:
        for network, urls in targets:
            print(f"\n{'='*50}", file=sys.stderr)
            print(f"Scraping {network}...", file=sys.stderr)

            for url in urls:
                proxy = get_proxy()
                print(f"  URL: {url} via {proxy['server']}", file=sys.stderr)

                try:
                    browser = p.chromium.launch(
                        headless=True,
                        proxy=proxy,
                        args=[
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-dev-shm-usage',
                            '--disable-gpu',
                        ]
                    )
                    context = browser.new_context(
                        user_agent="Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
                        viewport={"width": 390, "height": 844},
                        locale="en-PH",
                    )
                    page = context.new_page()

                    promos = extract_promos_from_page(page, network, url)
                    print(f"  Found {len(promos)} promos", file=sys.stderr)
                    all_promos.extend(promos)

                    browser.close()
                except Exception as e:
                    print(f"  Browser error: {e}", file=sys.stderr)

                time.sleep(random.uniform(3, 6))

    return all_promos


def main():
    print("=" * 60, file=sys.stderr)
    print("SulitNow PH Promo Scraper v2 (Playwright)", file=sys.stderr)
    print(f"Proxies: {len(PROXIES)}", file=sys.stderr)
    print(f"Started: {datetime.now().isoformat()}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)

    all_promos = scrape_all()

    # Deduplicate
    seen = set()
    unique = []
    for p in all_promos:
        key = f"{p['network']}-{p['price']}-{p['data']}"
        if key not in seen:
            seen.add(key)
            unique.append(p)

    # Recalculate costPerGB
    for p in unique:
        p['costPerGB'] = round(p['price'] / p['dataGB'], 2) if p['dataGB'] > 0 else 999

    result = {
        "lastUpdated": datetime.now().isoformat(),
        "totalPromos": len(unique),
        "networks": sorted(list(set(p['network'] for p in unique))),
        "promos": sorted(unique, key=lambda x: x['costPerGB']),
    }

    # Save
    output_path = Path(__file__).parent.parent / "public" / "data" / "promos.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*60}", file=sys.stderr)
    print(f"DONE — {len(unique)} unique promos", file=sys.stderr)
    for net in result['networks']:
        count = len([p for p in unique if p['network'] == net])
        print(f"  {net}: {count} promos", file=sys.stderr)
    print(f"Saved: {output_path}", file=sys.stderr)
    print("=" * 60, file=sys.stderr)


if __name__ == "__main__":
    main()

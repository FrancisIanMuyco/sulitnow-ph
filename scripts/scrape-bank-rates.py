#!/usr/bin/env python3
"""
SulitNow PH — Bank Rates Scraper
Scrapes time deposit and savings rates from Philippine banks.
"""

import json
import os
import re
import random
from datetime import datetime

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

PROXIES = [
    "http://zpdatulg4kam:17wwbjixjro142m@45.3.35.133:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@216.26.253.214:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@209.50.175.112:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@104.207.38.155:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@45.3.50.71:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@216.26.232.99:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@45.3.42.135:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@209.50.169.4:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@209.50.177.64:3129",
    "http://zpdatulg4kam:17wwbjixjro142m@209.50.188.18:3129",
]

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"


def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size = os.path.getsize(path)
    print(f"  ✅ {filename} ({size:,} bytes)")


def get_fallback_rates():
    """Manual/fallback rates in case scraping fails."""
    return [
        {
            "name": "BDO",
            "products": [
                {
                    "name": "Time Deposit",
                    "rates": [
                        {"tenor": "30-59 days", "rate": 0.250, "minDeposit": 10000},
                        {"tenor": "60-89 days", "rate": 0.375, "minDeposit": 10000},
                        {"tenor": "90-179 days", "rate": 0.500, "minDeposit": 10000},
                        {"tenor": "180-359 days", "rate": 0.625, "minDeposit": 10000},
                        {"tenor": "360 days", "rate": 1.000, "minDeposit": 10000},
                    ],
                    "notes": "Rates as of early 2026. Subject to 20% withholding tax on interest.",
                },
            ],
        },
        {
            "name": "BPI",
            "products": [
                {
                    "name": "Time Deposit",
                    "rates": [
                        {"tenor": "30-59 days", "rate": 0.125, "minDeposit": 10000},
                        {"tenor": "60-119 days", "rate": 0.250, "minDeposit": 10000},
                        {"tenor": "120-359 days", "rate": 0.375, "minDeposit": 10000},
                        {"tenor": "360 days", "rate": 0.625, "minDeposit": 10000},
                    ],
                    "notes": "Rates as of early 2026. Subject to 20% withholding tax on interest.",
                },
            ],
        },
        {
            "name": "Maya",
            "products": [
                {
                    "name": "Savings",
                    "rates": [
                        {"tenor": "Up to ₱100,000", "rate": 3.5, "minDeposit": 0},
                        {"tenor": "₱100,001 - ₱200,000", "rate": 2.5, "minDeposit": 0},
                        {"tenor": "Above ₱200,000", "rate": 1.5, "minDeposit": 0},
                    ],
                    "notes": "Tiered interest based on balance. No lock-in period.",
                },
            ],
        },
        {
            "name": "Tonik",
            "products": [
                {
                    "name": "Time Deposit",
                    "rates": [
                        {"tenor": "1 month", "rate": 4.0, "minDeposit": 5000},
                        {"tenor": "3 months", "rate": 5.5, "minDeposit": 5000},
                        {"tenor": "6 months", "rate": 6.0, "minDeposit": 5000},
                    ],
                    "notes": "Lock-in period required. Rates are promotional and may change.",
                },
                {
                    "name": "Stash",
                    "rates": [
                        {"tenor": "Up to ₱100,000", "rate": 4.0, "minDeposit": 0},
                        {"tenor": "₱100,001 - ₱500,000", "rate": 3.0, "minDeposit": 0},
                        {"tenor": "Above ₱500,000", "rate": 2.0, "minDeposit": 0},
                    ],
                    "notes": "No lock-in. Tiered interest based on total balance.",
                },
            ],
        },
        {
            "name": "GoTyme",
            "products": [
                {
                    "name": "Save",
                    "rates": [
                        {"tenor": "Up to ₱50,000", "rate": 5.0, "minDeposit": 0},
                        {"tenor": "₱50,001 - ₱100,000", "rate": 3.5, "minDeposit": 0},
                        {"tenor": "Above ₱100,000", "rate": 2.5, "minDeposit": 0},
                    ],
                    "notes": "No lock-in. Tiered interest based on balance. GSave via GCash also available.",
                },
            ],
        },
    ]


def scrape_bdo(page):
    """Scrape BDO time deposit rates."""
    print("\n🏦 [BDO] Scraping time deposit rates...")
    products = []

    try:
        page.goto("https://www.bdo.com.ph/personal/savings/time-deposit",
                   timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        rates = []
        for i, line in enumerate(lines):
            tenor_match = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*days', line)
            single_match = re.search(r'(\d+)\s*days?', line)
            rate_match = re.search(r'(\d+\.\d{2,4})\s*%', line)

            if tenor_match:
                days_low = int(tenor_match.group(1))
                days_high = int(tenor_match.group(2))
                tenor = f"{days_low}-{days_high} days"
                # Look for rate on same line or nearby
                if rate_match:
                    rates.append({"tenor": tenor, "rate": float(rate_match.group(1)), "minDeposit": 10000})
            elif single_match and rate_match:
                days = int(single_match.group(1))
                rates.append({"tenor": f"{days} days", "rate": float(rate_match.group(1)), "minDeposit": 10000})

        # Fallback: try table-based extraction
        if not rates:
            tables = page.query_selector_all('table')
            for table in tables:
                rows = table.query_selector_all('tr')
                for row in rows:
                    cells = row.query_selector_all('td, th')
                    cell_texts = [c.inner_text().strip() for c in cells]
                    row_text = ' '.join(cell_texts)

                    tenor_m = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*days', row_text)
                    rate_m = re.search(r'(\d+\.\d{2,4})\s*%', row_text)

                    if tenor_m and rate_m:
                        rates.append({
                            "tenor": f"{tenor_m.group(1)}-{tenor_m.group(2)} days",
                            "rate": float(rate_m.group(1)),
                            "minDeposit": 10000,
                        })

        if rates:
            products.append({
                "name": "Time Deposit",
                "rates": rates,
                "notes": "Subject to 20% withholding tax on interest.",
            })
            print(f"  ✅ Found {len(rates)} rate tiers")
        else:
            print("  ⚠️ Could not extract rates, using fallback")

    except Exception as e:
        print(f"  ⚠️ BDO scrape error: {e}")

    return products


def scrape_bpi(page):
    """Scrape BPI time deposit rates."""
    print("\n🏦 [BPI] Scraping time deposit rates...")
    products = []

    try:
        page.goto("https://www.bpi.com.ph/personal/savings/time-deposit",
                   timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        rates = []
        for line in lines:
            tenor_match = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*days', line)
            rate_match = re.search(r'(\d+\.\d{2,4})\s*%', line)

            if tenor_match and rate_match:
                rates.append({
                    "tenor": f"{tenor_match.group(1)}-{tenor_match.group(2)} days",
                    "rate": float(rate_match.group(1)),
                    "minDeposit": 10000,
                })

        # Fallback: try table extraction
        if not rates:
            tables = page.query_selector_all('table')
            for table in tables:
                rows = table.query_selector_all('tr')
                for row in rows:
                    cells = row.query_selector_all('td, th')
                    cell_texts = [c.inner_text().strip() for c in cells]
                    row_text = ' '.join(cell_texts)

                    tenor_m = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*days', row_text)
                    rate_m = re.search(r'(\d+\.\d{2,4})\s*%', row_text)

                    if tenor_m and rate_m:
                        rates.append({
                            "tenor": f"{tenor_m.group(1)}-{tenor_m.group(2)} days",
                            "rate": float(rate_m.group(1)),
                            "minDeposit": 10000,
                        })

        if rates:
            products.append({
                "name": "Time Deposit",
                "rates": rates,
                "notes": "Subject to 20% withholding tax on interest.",
            })
            print(f"  ✅ Found {len(rates)} rate tiers")
        else:
            print("  ⚠️ Could not extract rates, using fallback")

    except Exception as e:
        print(f"  ⚠️ BPI scrape error: {e}")

    return products


def scrape_maya(page):
    """Scrape Maya savings rates."""
    print("\n🏦 [Maya] Scraping savings rates...")
    products = []

    try:
        page.goto("https://www.maya.ph/en/savings",
                   timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        rates = []
        for line in lines:
            # Look for percentage rates with balance tiers
            rate_match = re.search(r'(\d+\.?\d*)\s*%', line)
            if not rate_match:
                continue

            rate_val = float(rate_match.group(1))
            if rate_val < 0.1 or rate_val > 20:
                continue

            # Try to associate with a balance tier
            balance_match = re.search(r'(?:up to|below|under|≤|<=?)\s*₱?\s*([\d,]+[KMB]?)', line, re.IGNORECASE)
            tier_match = re.search(r'₱?\s*([\d,]+[KMB]?)\s*[-–]\s*₱?\s*([\d,]+[KMB]?)', line)

            tenor = line[:60]
            if balance_match:
                tenor = f"Up to ₱{balance_match.group(1)}"
            elif tier_match:
                tenor = f"₱{tier_match.group(1)} - ₱{tier_match.group(2)}"

            rates.append({"tenor": tenor, "rate": rate_val, "minDeposit": 0})

        if rates:
            products.append({
                "name": "Savings",
                "rates": rates,
                "notes": "Tiered interest based on balance. No lock-in period.",
            })
            print(f"  ✅ Found {len(rates)} rate tiers")
        else:
            print("  ⚠️ Could not extract rates, using fallback")

    except Exception as e:
        print(f"  ⚠️ Maya scrape error: {e}")

    return products


def scrape_tonik(page):
    """Scrape Tonik time deposit and stash rates."""
    print("\n🏦 [Tonik] Scraping rates...")
    products = []

    try:
        page.goto("https://www.tonikbank.com/time-deposit",
                   timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        td_rates = []
        stash_rates = []

        for i, line in enumerate(lines):
            rate_match = re.search(r'(\d+\.?\d*)\s*%', line)
            if not rate_match:
                continue

            rate_val = float(rate_match.group(1))
            if rate_val < 0.1 or rate_val > 20:
                continue

            # Check surrounding context for product type and tenor
            context = ' '.join(lines[max(0, i - 2):i + 3]).lower()

            month_match = re.search(r'(\d+)\s*months?', context)
            day_match = re.search(r'(\d+)\s*days?', context)

            tenor = None
            if month_match:
                months = int(month_match.group(1))
                if months == 1:
                    tenor = "1 month"
                elif months == 3:
                    tenor = "3 months"
                elif months == 6:
                    tenor = "6 months"
                else:
                    tenor = f"{months} months"
            elif day_match:
                days = int(day_match.group(1))
                tenor = f"{days} days"

            # Check for stash vs time deposit
            is_stash = 'stash' in context

            if tenor:
                entry = {"tenor": tenor, "rate": rate_val, "minDeposit": 5000 if not is_stash else 0}
                if is_stash:
                    stash_rates.append(entry)
                else:
                    td_rates.append(entry)

        if td_rates:
            products.append({
                "name": "Time Deposit",
                "rates": td_rates,
                "notes": "Lock-in period required. Rates are promotional and may change.",
            })
            print(f"  ✅ Found {len(td_rates)} time deposit tiers")

        if stash_rates:
            products.append({
                "name": "Stash",
                "rates": stash_rates,
                "notes": "No lock-in. Tiered interest based on total balance.",
            })
            print(f"  ✅ Found {len(stash_rates)} stash tiers")

        if not td_rates and not stash_rates:
            print("  ⚠️ Could not extract rates, using fallback")

    except Exception as e:
        print(f"  ⚠️ Tonik scrape error: {e}")

    return products


def scrape_gotyme(page):
    """Scrape GoTyme save rates."""
    print("\n🏦 [GoTyme] Scraping savings rates...")
    products = []

    try:
        page.goto("https://www.gotyme.com.ph/savings",
                   timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)

        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]

        rates = []
        for i, line in enumerate(lines):
            rate_match = re.search(r'(\d+\.?\d*)\s*%', line)
            if not rate_match:
                continue

            rate_val = float(rate_match.group(1))
            if rate_val < 0.1 or rate_val > 20:
                continue

            context = ' '.join(lines[max(0, i - 2):i + 3])

            balance_match = re.search(r'(?:up to|below|under|≤|<=?)\s*₱?\s*([\d,]+[KMB]?)', context, re.IGNORECASE)
            tier_match = re.search(r'₱?\s*([\d,]+[KMB]?)\s*[-–]\s*₱?\s*([\d,]+[KMB]?)', context)

            tenor = line[:60]
            if balance_match:
                tenor = f"Up to ₱{balance_match.group(1)}"
            elif tier_match:
                tenor = f"₱{tier_match.group(1)} - ₱{tier_match.group(2)}"

            rates.append({"tenor": tenor, "rate": rate_val, "minDeposit": 0})

        if rates:
            products.append({
                "name": "Save",
                "rates": rates,
                "notes": "No lock-in. Tiered interest based on balance. GSave via GCash also available.",
            })
            print(f"  ✅ Found {len(rates)} rate tiers")
        else:
            print("  ⚠️ Could not extract rates, using fallback")

    except Exception as e:
        print(f"  ⚠️ GoTyme scrape error: {e}")

    return products


def merge_with_fallback(scraped_banks):
    """Merge scraped data with fallback. Use fallback if scraping yielded nothing."""
    fallback = get_fallback_rates()
    fallback_map = {b["name"]: b for b in fallback}

    merged = []
    for fb in fallback:
        bank_name = fb["name"]
        scraped = scraped_banks.get(bank_name)

        if scraped and scraped.get("products"):
            # Use scraped data if it has products with rates
            valid_products = [p for p in scraped["products"] if p.get("rates")]
            if valid_products:
                merged.append({
                    "name": bank_name,
                    "products": valid_products,
                    "source": "scraped",
                })
                continue

        # Fall back to manual rates
        merged.append({
            "name": bank_name,
            "products": fb["products"],
            "source": "fallback",
        })

    return merged


if __name__ == "__main__":
    from playwright.sync_api import sync_playwright

    start = datetime.now()
    print("=" * 60)
    print("🏦 SulitNow PH — Bank Rates Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    scraped = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])

        ctx = browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1920, "height": 1080},
        )
        page = ctx.new_page()

        scraped["BDO"] = {"products": scrape_bdo(page)}
        scraped["BPI"] = {"products": scrape_bpi(page)}
        scraped["Maya"] = {"products": scrape_maya(page)}
        scraped["Tonik"] = {"products": scrape_tonik(page)}
        scraped["GoTyme"] = {"products": scrape_gotyme(page)}

        ctx.close()
        browser.close()

    # Merge scraped with fallback
    banks = merge_with_fallback(scraped)

    # Count stats
    total_products = sum(len(b["products"]) for b in banks)
    total_rates = sum(len(p["rates"]) for b in banks for p in b["products"])
    scraped_count = sum(1 for b in banks if b.get("source") == "scraped")

    output = {
        "lastUpdated": datetime.now().isoformat(),
        "banks": [
            {"name": b["name"], "products": b["products"]}
            for b in banks
        ],
        "stats": {
            "totalBanks": len(banks),
            "totalProducts": total_products,
            "totalRateTiers": total_rates,
            "scrapedSuccessfully": scraped_count,
            "usedFallback": len(banks) - scraped_count,
        },
    }

    write_json("bank-rates.json", output)

    elapsed = (datetime.now() - start).total_seconds()
    print(f"\n{'=' * 60}")
    print(f"✅ Complete in {elapsed:.1f}s")
    print(f"   🏦 {len(banks)} banks | {total_products} products | {total_rates} rate tiers")
    print(f"   📊 Scraped: {scraped_count} | Fallback: {len(banks) - scraped_count}")
    for b in banks:
        source_icon = "🟢" if b.get("source") == "scraped" else "🟡"
        print(f"      {source_icon} {b['name']}: {len(b['products'])} products")
    print("=" * 60)

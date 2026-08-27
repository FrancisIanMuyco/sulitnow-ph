#!/usr/bin/env python3
"""Scrape Philippine remittance/overseas money transfer rates."""

import json
import os
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
]

CORRIDORS = [
    {"from": "USD", "to": "PHP", "country": "United States"},
    {"from": "EUR", "to": "PHP", "country": "Europe"},
    {"from": "GBP", "to": "PHP", "country": "United Kingdom"},
    {"from": "SGD", "to": "PHP", "country": "Singapore"},
    {"from": "AED", "to": "PHP", "country": "UAE"},
    {"from": "SAR", "to": "PHP", "country": "Saudi Arabia"},
    {"from": "JPY", "to": "PHP", "country": "Japan"},
    {"from": "KRW", "to": "PHP", "country": "South Korea"},
]

FALLBACK_PROVIDERS = [
    {
        "name": "Wise",
        "logo": "💸",
        "feeStructure": "0.42% + ₱40",
        "rate": "Mid-market rate - 0.42%",
        "speed": "1-2 business days",
        "methods": ["Bank transfer", "GCash", "Maya"],
        "minAmount": "No minimum",
        "maxAmount": "₱1,000,000",
        "pros": ["Best exchange rate", "Transparent fees", "Fast"],
        "cons": ["Requires bank account or e-wallet", "Verification needed"],
    },
    {
        "name": "Remitly",
        "logo": "📮",
        "feeStructure": "Varies by corridor, ₱0-₱250",
        "rate": "Mid-market rate - 0.5%-1.5%",
        "speed": "Express: minutes, Economy: 3-5 days",
        "methods": ["Bank transfer", "GCash", "Cash pickup"],
        "minAmount": "₱500",
        "maxAmount": "₱500,000",
        "pros": ["Fast express option", "Cash pickup available", "First transfer free promos"],
        "cons": ["Higher fees on express", "Exchange rate varies by corridor"],
    },
    {
        "name": "Palawan Express",
        "logo": "🏠",
        "feeStructure": "1.5-2.5% markup",
        "rate": "Mid-market rate - 1.5% to -2.5%",
        "speed": "Minutes for cash pickup",
        "methods": ["Cash pickup", "Bank transfer"],
        "minAmount": "₱100",
        "maxAmount": "₱200,000",
        "pros": ["Wide branch network", "No bank account needed", "Quick cash pickup"],
        "cons": ["Higher markup", "Limited online options", "Queues at branches"],
    },
    {
        "name": "Cebuana Lhuillier",
        "logo": "🏪",
        "feeStructure": "2-3% markup",
        "rate": "Mid-market rate - 2% to -3%",
        "speed": "Minutes for cash pickup",
        "methods": ["Cash pickup"],
        "minAmount": "₱100",
        "maxAmount": "₱200,000",
        "pros": ["Extensive nationwide branches", "Quick payout", "No account needed"],
        "cons": ["Higher markup", "Cash pickup only", "Branch hours limited"],
    },
    {
        "name": "Western Union",
        "logo": "🌍",
        "feeStructure": "3-5% markup",
        "rate": "Mid-market rate - 3% to -5%",
        "speed": "Minutes for cash pickup",
        "methods": ["Cash pickup", "Bank transfer", "GCash"],
        "minAmount": "No minimum",
        "maxAmount": "₱500,000",
        "pros": ["Global network", "Multiple payout options", "Trusted brand"],
        "cons": ["Highest fees", "Poor exchange rates", "Variable service quality"],
    },
    {
        "name": "GCash International",
        "logo": "📱",
        "feeStructure": "~1.5% fee",
        "rate": "Mid-market rate - 1% to -1.5%",
        "speed": "Minutes to hours",
        "methods": ["GCash wallet"],
        "minAmount": "₱100",
        "maxAmount": "₱500,000",
        "pros": ["Instant to GCash wallet", "Low fees", "Convenient for GCash users"],
        "cons": ["Requires GCash account", "Send limits may apply", "Partner-dependent"],
    },
    {
        "name": "PayMaya International",
        "logo": "💳",
        "feeStructure": "~2% fee",
        "rate": "Mid-market rate - 1% to -2%",
        "speed": "Minutes to hours",
        "methods": ["Maya wallet", "Bank transfer"],
        "minAmount": "₱100",
        "maxAmount": "₱500,000",
        "pros": ["Instant to Maya wallet", "Growing corridor support", "Easy mobile app"],
        "cons": ["Requires Maya account", "Fewer payout options", "Newer service"],
    },
]


def write_json(data, filename):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved to {path}")
    return path


def scrape_wise_rates():
    """Attempt to scrape Wise API for live rates."""
    from playwright.sync_api import sync_playwright

    rates = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        try:
            page.goto("https://wise.com/ph/currency-converter/usd-to-php-rate", timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            rate_text = page.inner_text("body")[:2000]
            import re
            match = re.search(r'(\d+\.?\d*)\s*PHP\s*=\s*1\s*USD|1\s*USD\s*=\s*(\d+\.?\d*)\s*PHP', rate_text)
            if match:
                rates["USD_PHP"] = float(match.group(1) or match.group(2))
                print(f"✅ Wise live USD/PHP: {rates['USD_PHP']}")
        except Exception as e:
            print(f"⚠️ Wise scrape failed: {e}")
        finally:
            browser.close()
    return rates


def scrape_remitly_rates():
    """Attempt to scrape Remitly for live corridor info."""
    from playwright.sync_api import sync_playwright

    rates = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        try:
            page.goto("https://www.remitly.com/us/en/philippines", timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            import re
            content = page.inner_text("body")[:3000]
            rate_match = re.search(r'1\s*(?:USD|US\$)\s*[=≈~]\s*₱?([\d.]+)', content)
            if rate_match:
                rates["USD_PHP"] = float(rate_match.group(1))
                print(f"✅ Remitly live USD/PHP: {rates['USD_PHP']}")
        except Exception as e:
            print(f"⚠️ Remitly scrape failed: {e}")
        finally:
            browser.close()
    return rates


def build_data():
    result = {
        "lastUpdated": datetime.now().isoformat(),
        "providers": FALLBACK_PROVIDERS,
        "corridors": CORRIDORS,
    }

    # Attempt live scraping
    try:
        wise = scrape_wise_rates()
        if wise:
            result["liveRates"] = result.get("liveRates", {})
            result["liveRates"]["Wise"] = wise
    except Exception as e:
        print(f"⚠️ Wise scraping error: {e}")

    try:
        remitly = scrape_remitly_rates()
        if remitly:
            result["liveRates"] = result.get("liveRates", {})
            result["liveRates"]["Remitly"] = remitly
    except Exception as e:
        print(f"⚠️ Remitly scraping error: {e}")

    if not result.get("liveRates"):
        result["note"] = "Live rates unavailable, using estimated fee structures"

    return result


if __name__ == "__main__":
    print("💸 Scraping remittance rates...")
    data = build_data()
    write_json(data, 'remittance-rates.json')
    print(f"📊 {len(data['providers'])} providers, {len(data['corridors'])} corridors")
    print("🎉 Remittance scraping complete!")

#!/usr/bin/env python3
"""
SulitNow PH — Master Auto-Scraper
Scrapes ALL data sources in one run:
1. Mobile promos (Globe, TM, DITO via Playwright)
2. Currency exchange rates (ExchangeRate-API)
3. PAGASA weather
4. Fuel prices
"""

import json
import os
import sys
import random
import hashlib
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

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
    size = os.path.getsize(path)
    print(f"  ✅ {filename} ({size:,} bytes)")

def scrape_currency():
    """Scrape live exchange rates from free API."""
    import httpx
    print("\n💱 Scraping exchange rates...")
    try:
        r = httpx.get("https://open.er-api.com/v6/latest/USD", timeout=15)
        data = r.json()
        if data.get("result") != "success":
            print("  ❌ API error")
            return
        
        rates = data.get("rates", {})
        usd_php = rates.get("PHP", 61.75)
        
        currencies = [
            ("EUR", "Euro", "🇪🇺"), ("GBP", "British Pound", "🇬🇧"),
            ("JPY", "Japanese Yen", "🇯🇵"), ("KRW", "South Korean Won", "🇰🇷"),
            ("SGD", "Singapore Dollar", "🇸🇬"), ("HKD", "Hong Kong Dollar", "🇭🇰"),
            ("TWD", "Taiwan Dollar", "🇹🇼"), ("THB", "Thai Baht", "🇹🇭"),
            ("MYR", "Malaysian Ringgit", "🇲🇾"), ("IDR", "Indonesian Rupiah", "🇮🇩"),
            ("AUD", "Australian Dollar", "🇦🇺"), ("CAD", "Canadian Dollar", "🇨🇦"),
            ("CHF", "Swiss Franc", "🇨🇭"), ("CNY", "Chinese Yuan", "🇨🇳"),
            ("INR", "Indian Rupee", "🇮🇳"), ("AED", "UAE Dirham", "🇦🇪"),
            ("SAR", "Saudi Riyal", "🇸🇦"), ("QAR", "Qatari Riyal", "🇶🇦"),
            ("KWD", "Kuwaiti Dinar", "🇰🇼"), ("NZD", "New Zealand Dollar", "🇳🇿"),
            ("BND", "Brunei Dollar", "🇧🇳"), ("SEK", "Swedish Krona", "🇸🇪"),
            ("NOK", "Norwegian Krone", "🇳🇴"), ("TRY", "Turkish Lira", "🇹🇷"),
            ("ZAR", "South African Rand", "🇿🇦"), ("BRL", "Brazilian Real", "🇧🇷"),
        ]
        
        php_rates = []
        for code, name, flag in currencies:
            fpu = rates.get(code, 0)
            if fpu > 0:
                php_rates.append({
                    "code": code, "name": name, "flag": flag,
                    "rateToPHP": round(usd_php / fpu, 4),
                    "rateFromPHP": round(fpu / usd_php, 6),
                })
        
        write_json("currency-rates.json", {
            "lastUpdated": datetime.now().isoformat(),
            "source": "ExchangeRate-API",
            "baseCurrency": "USD",
            "usdToPHP": round(usd_php, 2),
            "currencies": php_rates
        })
        print(f"  💰 USD/PHP: ₱{usd_php:.2f} | {len(php_rates)} currencies")
    except Exception as e:
        print(f"  ❌ Currency scrape error: {e}")

def scrape_weather():
    """Scrape weather using Open-Meteo API (free, no key needed)."""
    import subprocess
    script = os.path.join(os.path.dirname(__file__), 'scrape-weather.py')
    if os.path.exists(script):
        subprocess.run([sys.executable, script], timeout=60)
    else:
        print("  ⚠️ scrape-weather.py not found, skipping")

def scrape_fuel():
    """Fuel prices — skip (fuel-prices.json has good DOE data, fuel-prices-live.json is unused)."""
    print("\n⛽ Skipping fuel-prices-live (unused, fuel-prices.json is current)")

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 50)
    print("🚀 SulitNow PH — Master Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    scrape_currency()
    scrape_weather()
    scrape_fuel()
    
    # Also run prices scraper (gold, crypto, earthquakes)
    try:
        import subprocess
        prices_script = os.path.join(os.path.dirname(__file__), 'scrape-prices.py')
        if os.path.exists(prices_script):
            print("\n--- Running prices scraper ---")
            subprocess.run([sys.executable, prices_script], timeout=60)
    except Exception as e:
        print(f"  ⚠️ Prices scraper failed: {e}")
    
    # === NEW SCRAPERS (v2) ===
    new_scrapers = [
        ('scrape-bank-rates.py', 'Bank Rates'),
        ('scrape-toll-fees.py', 'Toll Fees'),
        ('scrape-remittance.py', 'Remittance Rates'),
        ('scrape-medicine-prices.py', 'Medicine Prices'),
        ('scrape-pse-stocks.py', 'PSE Stocks'),
        ('scrape-salary-data.py', 'Salary Data'),
        ('scrape-bir-deadlines.py', 'BIR Deadlines'),
    ]
    
    for script_name, label in new_scrapers:
        try:
            script_path = os.path.join(os.path.dirname(__file__), script_name)
            if os.path.exists(script_path):
                print(f"\n--- Running {label} scraper ---")
                subprocess.run([sys.executable, script_path], timeout=120)
            else:
                print(f"\n⚠️ {script_name} not found, skipping")
        except Exception as e:
            print(f"  ⚠️ {label} scraper failed: {e}")
    
    elapsed = (datetime.now() - start).total_seconds()
    print("\n" + "=" * 50)
    print(f"✅ All scraping complete in {elapsed:.1f}s")
    print("=" * 50)

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
    """Scrape PAGASA weather data."""
    print("\n🌤️ Scraping PAGASA weather...")
    try:
        from playwright.sync_api import sync_playwright
        import re
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
            page = browser.new_page()
            
            weather = {
                "lastUpdated": datetime.now().isoformat(),
                "source": "PAGASA",
                "temperature": None,
                "windSpeed": None,
                "humidity": None,
                "forecast": None,
                "typhoon": None,
            }
            
            try:
                page.goto("https://www.pagasa.dost.gov.ph/", timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(3000)
                content = page.content()
                
                temp = re.search(r'(\d+)\s*°C', content)
                if temp: weather["temperature"] = temp.group(1) + "°C"
                
                wind = re.search(r'Wind[:\s]*(\d+\.?\d*)\s*km/h', content, re.IGNORECASE)
                if wind: weather["windSpeed"] = wind.group(1) + " km/hr"
                
                humid = re.search(r'Humidity[:\s]*(\d+)%', content, re.IGNORECASE)
                if humid: weather["humidity"] = humid.group(1) + "%"
                
                el = page.query_selector('.forecast-text, .weather-forecast, #forecast, .panel-body')
                if el: weather["forecast"] = el.inner_text()[:500]
                
                page.goto("https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin", timeout=20000, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)
                body = page.inner_text("body")[:1000]
                
                if any(w in body for w in ["Signal", "Typhoon", "Tropical Depression", "Severe Weather"]):
                    weather["typhoon"] = body[:800]
                else:
                    weather["typhoon"] = "No active tropical cyclone within the Philippine Area of Responsibility."
                    
            except Exception as e:
                weather["forecast"] = f"Unable to fetch: {e}"
            finally:
                browser.close()
            
            write_json("weather.json", weather)
            print(f"  🌡️ Temp: {weather['temperature']} | Wind: {weather['windSpeed']}")
    except Exception as e:
        print(f"  ❌ Weather scrape error: {e}")

def scrape_fuel():
    """Scrape fuel prices from GasWatch PH."""
    print("\n⛽ Scraping fuel prices...")
    try:
        from playwright.sync_api import sync_playwright
        import re
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
            page = browser.new_page()
            
            fuel = {
                "lastUpdated": datetime.now().isoformat(),
                "source": "GasWatch PH / DOE",
                "brands": []
            }
            
            try:
                page.goto("https://gaswatchph.com/", timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(3000)
                
                sections = page.query_selector_all('.brand-card, .fuel-station, .station-card, [class*="brand"], [class*="station"]')
                if sections:
                    for section in sections[:10]:
                        text = section.inner_text()
                        brand = re.search(r'(Shell|Petron|Caltex|Flying V|Cleanfuel|Phoenix|Seaoil|Jetti|Total|Unioil|CSI)', text, re.IGNORECASE)
                        diesel = re.search(r'Diesel[:\s]*₱?([\d.]+)', text, re.IGNORECASE)
                        gas = re.search(r'Gas(?:oline)?[\s]*(?:91|95|97)?[:\s]*₱?([\d.]+)', text, re.IGNORECASE)
                        if brand:
                            fuel["brands"].append({
                                "name": brand.group(1),
                                "diesel": float(diesel.group(1)) if diesel else None,
                                "gasoline91": float(gas.group(1)) if gas else None,
                            })
            except Exception as e:
                print(f"  ⚠️ Fuel scrape error: {e}")
            finally:
                browser.close()
            
            write_json("fuel-prices-live.json", fuel)
            print(f"  🛢️ {len(fuel['brands'])} brands scraped")
    except Exception as e:
        print(f"  ❌ Fuel scrape error: {e}")

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 50)
    print("🚀 SulitNow PH — Master Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    scrape_currency()
    scrape_weather()
    scrape_fuel()
    
    elapsed = (datetime.now() - start).total_seconds()
    print("\n" + "=" * 50)
    print(f"✅ All scraping complete in {elapsed:.1f}s")
    print("=" * 50)

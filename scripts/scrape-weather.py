#!/usr/bin/env python3
"""Scrape PAGASA weather data with proxy rotation."""

import json
import os
import random
import re
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

def get_proxy():
    return {"server": random.choice(PROXIES)}

def scrape_weather():
    """Scrape PAGASA weather forecast."""
    from playwright.sync_api import sync_playwright
    
    weather_data = {
        "lastUpdated": datetime.now().isoformat(),
        "source": "PAGASA",
        "forecast": None,
        "typhoon": None,
        "temperature": None,
        "windSpeed": None,
        "humidity": None,
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            # Try PAGASA main page
            page.goto("https://www.pagasa.dost.gov.ph/", timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Try to get weather data from the page
            content = page.content()
            
            # Extract temperature
            temp_match = re.search(r'(\d+)\s*°C', content)
            if temp_match:
                weather_data["temperature"] = temp_match.group(1) + "°C"
            
            # Extract wind speed
            wind_match = re.search(r'Wind[:\s]*(\d+\.?\d*)\s*km/h', content, re.IGNORECASE)
            if wind_match:
                weather_data["windSpeed"] = wind_match.group(1) + " km/hr"
            
            # Extract humidity
            humid_match = re.search(r'Humidity[:\s]*(\d+)%', content, re.IGNORECASE)
            if humid_match:
                weather_data["humidity"] = humid_match.group(1) + "%"
            
            # Try to get forecast text
            forecast_el = page.query_selector('.forecast-text, .weather-forecast, #forecast, .panel-body')
            if forecast_el:
                weather_data["forecast"] = forecast_el.inner_text()[:500]
            
            # Try tropical cyclone page
            page.goto("https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            
            bulletin_text = page.inner_text("body")[:1000]
            if "Active Tropical Cyclone" in bulletin_text or "Signal" in bulletin_text or "Typhoon" in bulletin_text or "Tropical Depression" in bulletin_text:
                weather_data["typhoon"] = bulletin_text[:800]
            else:
                weather_data["typhoon"] = "No active tropical cyclone within the Philippine Area of Responsibility."
                
        except Exception as e:
            print(f"⚠️ PAGASA scrape error: {e}")
            weather_data["forecast"] = "Unable to fetch weather data at this time."
        finally:
            browser.close()
    
    return weather_data

def scrape_fuel_prices():
    """Scrape current fuel prices from GasWatch PH."""
    from playwright.sync_api import sync_playwright
    
    fuel_data = {
        "lastUpdated": datetime.now().isoformat(),
        "source": "GasWatch PH / DOE",
        "brands": []
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://gaswatchph.com/", timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            content = page.inner_text("body")[:3000]
            
            # Try to extract fuel prices
            brand_sections = page.query_selector_all('.brand-card, .fuel-station, .station-card, [class*="brand"], [class*="station"]')
            
            if brand_sections:
                for section in brand_sections[:10]:
                    text = section.inner_text()
                    brand_match = re.search(r'(Shell|Petron|Caltex|Flying V|Cleanfuel|Phoenix|Seaoil|Jetti|Total|Unioil| CSI)', text, re.IGNORECASE)
                    diesel_match = re.search(r'Diesel[:\s]*₱?([\d.]+)', text, re.IGNORECASE)
                    gas_match = re.search(r'Gas(?:oline)?[\s]*(?:91|95|97)?[:\s]*₱?([\d.]+)', text, re.IGNORECASE)
                    
                    if brand_match:
                        fuel_data["brands"].append({
                            "name": brand_match.group(1),
                            "diesel": float(diesel_match.group(1)) if diesel_match else None,
                            "gasoline91": float(gas_match.group(1)) if gas_match else None,
                        })
            
            # Fallback: extract from raw text
            if not fuel_data["brands"]:
                brands = ['Shell', 'Petron', 'Caltex', 'Flying V', 'Cleanfuel', 'Phoenix', 'Seaoil']
                for brand in brands:
                    pattern = rf'{brand}.*?(?:Diesel|DSL)[:\s]*₱?([\d.]+)'
                    match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                    if match:
                        fuel_data["brands"].append({
                            "name": brand,
                            "diesel": float(match.group(1)),
                            "gasoline91": None,
                        })
                        
        except Exception as e:
            print(f"⚠️ Fuel price scrape error: {e}")
        finally:
            browser.close()
    
    return fuel_data

if __name__ == "__main__":
    print("🌤️ Scraping PAGASA weather...")
    weather = scrape_weather()
    
    print("⛽ Scraping fuel prices...")
    fuel = scrape_fuel_prices()
    
    # Write weather
    with open(os.path.join(OUTPUT_DIR, 'weather.json'), 'w') as f:
        json.dump(weather, f, indent=2)
    print(f"✅ Weather data saved ({len(weather.get('forecast', '') or '')} chars)")
    
    # Write fuel
    with open(os.path.join(OUTPUT_DIR, 'fuel-prices-live.json'), 'w') as f:
        json.dump(fuel, f, indent=2)
    print(f"✅ Fuel prices saved ({len(fuel.get('brands', []))} brands)")
    
    print("🎉 Weather scraping complete!")

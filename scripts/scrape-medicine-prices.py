#!/usr/bin/env python3
"""Scrape Philippine generic medicine prices (DOH price guide)."""

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

FALLBACK_MEDICINES = [
    {
        "name": "Paracetamol",
        "genericName": "Paracetamol",
        "dosage": "500mg",
        "form": "Tablet",
        "priceRange": {"min": 1, "max": 3, "unit": "per tablet"},
        "brands": ["Biogesic", "Tempra", "Calpol", "Generic"],
        "category": "Pain reliever / Fever reducer",
        "otc": True,
        "notes": "Available without prescription",
    },
    {
        "name": "Ibuprofen",
        "genericName": "Ibuprofen",
        "dosage": "400mg",
        "form": "Tablet",
        "priceRange": {"min": 3, "max": 8, "unit": "per tablet"},
        "brands": ["Advil", "Brufen", "Generic"],
        "category": "NSAID / Anti-inflammatory",
        "otc": True,
        "notes": "Take with food to avoid stomach upset",
    },
    {
        "name": "Amoxicillin",
        "genericName": "Amoxicillin",
        "dosage": "500mg",
        "form": "Capsule",
        "priceRange": {"min": 5, "max": 12, "unit": "per capsule"},
        "brands": ["Amoxil", "Novamox", "Generic"],
        "category": "Antibiotic",
        "otc": False,
        "notes": "Prescription required. Complete full course.",
    },
    {
        "name": "Metformin",
        "genericName": "Metformin Hydrochloride",
        "dosage": "500mg",
        "form": "Tablet",
        "priceRange": {"min": 3, "max": 7, "unit": "per tablet"},
        "brands": ["Glucophage", "Diabetmin", "Generic"],
        "category": "Antidiabetic",
        "otc": False,
        "notes": "Prescription required. For Type 2 diabetes.",
    },
    {
        "name": "Amlodipine",
        "genericName": "Amlodipine Besylate",
        "dosage": "5mg",
        "form": "Tablet",
        "priceRange": {"min": 5, "max": 15, "unit": "per tablet"},
        "brands": ["Norvasc", "Amlodac", "Generic"],
        "category": "Calcium channel blocker / Antihypertensive",
        "otc": False,
        "notes": "Prescription required. For high blood pressure.",
    },
    {
        "name": "Omeprazole",
        "genericName": "Omeprazole",
        "dosage": "20mg",
        "form": "Capsule",
        "priceRange": {"min": 5, "max": 12, "unit": "per capsule"},
        "brands": ["Losec", "Omez", "Generic"],
        "category": "Proton pump inhibitor / Antacid",
        "otc": True,
        "notes": "For acid reflux and stomach ulcers",
    },
    {
        "name": "Losartan",
        "genericName": "Losartan Potassium",
        "dosage": "50mg",
        "form": "Tablet",
        "priceRange": {"min": 5, "max": 12, "unit": "per tablet"},
        "brands": ["Cozaar", "Losartan", "Generic"],
        "category": "ARB / Antihypertensive",
        "otc": False,
        "notes": "Prescription required. For high blood pressure.",
    },
    {
        "name": "Cetirizine",
        "genericName": "Cetirizine Hydrochloride",
        "dosage": "10mg",
        "form": "Tablet",
        "priceRange": {"min": 3, "max": 8, "unit": "per tablet"},
        "brands": ["Zyrtec", "Allerid", "Generic"],
        "category": "Antihistamine",
        "otc": True,
        "notes": "For allergies. Non-drowsy formula.",
    },
    {
        "name": "Salbutamol Inhaler",
        "genericName": "Salbutamol",
        "dosage": "100mcg",
        "form": "Inhaler",
        "priceRange": {"min": 250, "max": 450, "unit": "per inhaler"},
        "brands": ["Ventolin", "Salbutol", "Generic"],
        "category": "Bronchodilator / Asthma",
        "otc": False,
        "notes": "Prescription required. For asthma and COPD.",
    },
    {
        "name": "Mefenamic Acid",
        "genericName": "Mefenamic Acid",
        "dosage": "500mg",
        "form": "Capsule",
        "priceRange": {"min": 4, "max": 10, "unit": "per capsule"},
        "brands": ["Ponstan", "Mefen", "Generic"],
        "category": "NSAID / Pain reliever",
        "otc": True,
        "notes": "For moderate pain. Take with food.",
    },
    {
        "name": "Vitamin C",
        "genericName": "Ascorbic Acid",
        "dosage": "500mg",
        "form": "Tablet",
        "priceRange": {"min": 1, "max": 5, "unit": "per tablet"},
        "brands": ["Celin", "Ascorbic", "Generic"],
        "category": "Vitamin / Supplement",
        "otc": True,
        "notes": "For immune support and vitamin C deficiency",
    },
    {
        "name": "Carbocisteine",
        "genericName": "Carbocisteine",
        "dosage": "500mg",
        "form": "Capsule",
        "priceRange": {"min": 5, "max": 10, "unit": "per capsule"},
        "brands": ["Mucosolvan", "Carbocisteine", "Generic"],
        "category": "Mucolytic / Expectorant",
        "otc": True,
        "notes": "For cough with thick phlegm",
    },
]


def write_json(data, filename):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved to {path}")
    return path


def scrape_doh_prices():
    """Attempt to scrape DOH price guide for live medicine data."""
    from playwright.sync_api import sync_playwright

    scraped = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        try:
            page.goto("https://www.doh.gov.ph/doh-price-monitoring", timeout=30000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)

            content = page.inner_text("body")[:5000]

            # Look for medicine tables or listings
            tables = page.query_selector_all('table')
            for table in tables:
                rows = table.query_selector_all('tr')
                for row in rows:
                    cells = row.query_selector_all('td')
                    if cells and len(cells) >= 3:
                        text = [c.inner_text().strip() for c in cells]
                        price_match = re.search(r'₱?([\d,.]+)', ' '.join(text))
                        if price_match:
                            scraped.append({
                                "raw": text,
                                "price": price_match.group(1),
                            })

            if scraped:
                print(f"✅ DOH scrape: found {len(scraped)} entries")
            else:
                print("⚠️ DOH scrape: no structured data found")

        except Exception as e:
            print(f"⚠️ DOH scrape failed: {e}")
        finally:
            browser.close()

    return scraped


def build_data():
    result = {
        "lastUpdated": datetime.now().isoformat(),
        "source": "DOH Price Guide / Manual Research",
        "medicines": FALLBACK_MEDICINES,
    }

    # Attempt live scraping
    try:
        scraped = scrape_doh_prices()
        if scraped:
            result["liveData"] = scraped
            result["note"] = "Includes live data from DOH; fallback prices used for display"
        else:
            result["note"] = "Live DOH data unavailable, using researched price ranges"
    except Exception as e:
        print(f"⚠️ Scraping error: {e}")
        result["note"] = f"Scraping failed ({e}), using researched price ranges"

    return result


if __name__ == "__main__":
    print("💊 Scraping medicine prices...")
    data = build_data()
    write_json(data, 'medicine-prices.json')
    print(f"📊 {len(data['medicines'])} medicines catalogued")
    print("🎉 Medicine price scraping complete!")

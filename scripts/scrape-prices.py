#!/usr/bin/env python3
"""Scrape live gold, crypto, and commodity prices."""
import urllib.request, json, os, time
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

def fetch_json(url, timeout=15):
    req = urllib.request.Request(url, headers={"User-Agent": "SulitNowPH/1.0"})
    r = urllib.request.urlopen(req, timeout=timeout)
    return json.loads(r.read())

def scrape_all():
    results = {"scraped_at": datetime.utcnow().isoformat() + "Z"}
    errors = []

    # 1. CoinGecko - Crypto prices
    try:
        data = fetch_json("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana,binancecoin,ripple,dogecoin,cardano,tron,litecoin&vs_currencies=php,usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true")
        results["crypto"] = data
        print(f"✅ Crypto: {len(data)} coins")
    except Exception as e:
        errors.append(f"crypto: {e}")
        print(f"❌ Crypto: {e}")

    # 2. Gold price
    try:
        data = fetch_json("https://api.gold-api.com/price/XAU")
        results["gold"] = {
            "price_usd": data.get("price"),
            "symbol": data.get("symbol"),
            "name": data.get("name"),
            "updated": data.get("updatedAt"),
        }
        print(f"✅ Gold: ${data.get('price')}")
    except Exception as e:
        errors.append(f"gold: {e}")
        print(f"❌ Gold: {e}")

    # 3. All precious metals
    for metal in ['XAG', 'XPT', 'XPD']:
        try:
            data = fetch_json(f"https://api.gold-api.com/price/{metal}")
            results["metals"] = results.get("metals", {})
            results["metals"][metal] = {
                "price_usd": data.get("price"),
                "symbol": data.get("symbol"),
                "name": data.get("name"),
            }
            print(f"✅ {data.get('name', metal)}: ${data.get('price')}")
        except Exception as e:
            errors.append(f"{metal}: {e}")
            print(f"❌ {metal}: {e}")

    # 4. USD/PHP exchange rate
    try:
        data = fetch_json("https://open.er-api.com/v6/latest/USD")
        results["exchange"] = {
            "usd_php": data["rates"].get("PHP"),
            "eur_php": round(data["rates"].get("PHP", 0) / data["rates"].get("EUR", 1), 4),
            "gbp_php": round(data["rates"].get("PHP", 0) / data["rates"].get("GBP", 1), 4),
            "jpy_php": round(data["rates"].get("PHP", 0) / data["rates"].get("JPY", 1), 4),
            "cny_php": round(data["rates"].get("PHP", 0) / data["rates"].get("CNY", 1), 4),
            "updated": data.get("time_last_update_utc"),
        }
        print(f"✅ Exchange: 1 USD = ₱{results['exchange']['usd_php']}")
    except Exception as e:
        errors.append(f"exchange: {e}")
        print(f"❌ Exchange: {e}")

    # 5. USGS Earthquakes (Philippines, last 7 days)
    try:
        data = fetch_json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
        ph_quakes = []
        for f in data.get("features", []):
            props = f["properties"]
            coords = f["geometry"]["coordinates"]
            place = props.get("place", "")
            if "Philippines" in place:
                ph_quakes.append({
                    "magnitude": props.get("mag"),
                    "place": place,
                    "time": props.get("time"),
                    "depth": coords[2] if len(coords) > 2 else None,
                    "lat": coords[1] if len(coords) > 1 else None,
                    "lng": coords[0] if len(coords) > 0 else None,
                    "url": props.get("url"),
                    "tsunami": props.get("tsunami", 0),
                    "felt": props.get("felt"),
                    "alert": props.get("alert"),
                })
        results["earthquakes"] = sorted(ph_quakes, key=lambda x: x.get("time", 0), reverse=True)
        print(f"✅ Earthquakes: {len(ph_quakes)} in PH (last 7 days)")
    except Exception as e:
        errors.append(f"earthquakes: {e}")
        print(f"❌ Earthquakes: {e}")

    # 6. PHIVOLCS volcano alerts
    try:
        data = fetch_json("https://www.phivolcs.dost.gov.ph/index.php/volcano-bulletin/fetch-bulletin")
        results["volcanoes"] = {"source": "phivolcs.dost.gov.ph", "note": "scrape needed"}
        print(f"ℹ️ Volcanoes: manual scrape needed")
    except Exception as e:
        errors.append(f"volcanoes: {e}")
        print(f"❌ Volcanoes: {e}")

    # Save
    output_path = os.path.join(DATA_DIR, 'live-prices.json')
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n📁 Saved to {output_path}")
    print(f"📊 Data: {len(results)} categories, {len(errors)} errors")
    return results

if __name__ == '__main__':
    scrape_all()

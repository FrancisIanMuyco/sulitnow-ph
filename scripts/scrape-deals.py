#!/usr/bin/env python3
"""
SulitNow PH — Deals Scraper
Scrapes deals, promos, and vouchers from Philippine e-commerce platforms.
"""

import json
import os
import re
import random
from datetime import datetime, timedelta

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

def get_proxy():
    return {"http": random.choice(PROXIES), "https": random.choice(PROXIES)}

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size = os.path.getsize(path)
    print(f"  ✅ {filename} ({size:,} bytes)")

def scrape_shopee_deals():
    """Scrape Shopee flash sales and trending deals via Playwright."""
    from playwright.sync_api import sync_playwright
    
    deals = []
    print("\n🛒 Scraping Shopee deals...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://shopee.ph/flash_sale", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            items = page.query_selector_all('.flash-sale-item-card, [class*="flash-sale"] [class*="item"], .item-card, [data-sqe="item"]')
            
            for item in items[:20]:
                try:
                    text = item.inner_text()
                    name_match = re.search(r'(.{5,60})', text)
                    price_match = re.search(r'₱([\d,]+(?:\.\d{2})?)', text)
                    discount_match = re.search(r'(-?\d+)%', text)
                    sold_match = re.search(r'(\d+)\s*sold', text, re.IGNORECASE)
                    
                    if name_match and price_match:
                        deals.append({
                            "platform": "Shopee",
                            "name": name_match.group(1).strip()[:80],
                            "price": float(price_match.group(1).replace(',', '')),
                            "discount": f"{discount_match.group(1)}%" if discount_match else None,
                            "sold": int(sold_match.group(1)) if sold_match else None,
                            "url": "https://shopee.ph/flash_sale",
                            "type": "flash_sale",
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(deals)} Shopee flash sale items")
        except Exception as e:
            print(f"  ⚠️ Shopee flash sale error: {e}")
        
        # Shopee trending
        try:
            page.goto("https://shopee.ph/mega-sale", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            items = page.query_selector_all('.search-item-result__item, [class*="product"]')
            for item in items[:15]:
                try:
                    text = item.inner_text()
                    name_match = re.search(r'(.{5,60})', text)
                    price_match = re.search(r'₱([\d,]+(?:\.\d{2})?)', text)
                    if name_match and price_match:
                        deals.append({
                            "platform": "Shopee",
                            "name": name_match.group(1).strip()[:80],
                            "price": float(price_match.group(1).replace(',', '')),
                            "discount": None,
                            "sold": None,
                            "url": "https://shopee.ph/mega-sale",
                            "type": "trending",
                        })
                except Exception:
                    continue
        except Exception as e:
            print(f"  ⚠️ Shopee trending error: {e}")
        
        browser.close()
    
    return deals

def scrape_lazada_deals():
    """Scrape Lazada deals via Playwright."""
    from playwright.sync_api import sync_playwright
    
    deals = []
    print("\n🛒 Scraping Lazada deals...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://www.lazada.com.ph/tag/mega-deals/", timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            items = page.query_selector_all('[data-qa-locator="product-item"], .Bm3ON, [class*="product"]')
            
            for item in items[:20]:
                try:
                    text = item.inner_text()
                    name_match = re.search(r'(.{5,80})', text)
                    price_match = re.search(r'₱([\d,]+(?:\.\d{2})?)', text)
                    discount_match = re.search(r'(-?\d+)%', text)
                    
                    if name_match and price_match:
                        deals.append({
                            "platform": "Lazada",
                            "name": name_match.group(1).strip()[:80],
                            "price": float(price_match.group(1).replace(',', '')),
                            "discount": f"{discount_match.group(1)}%" if discount_match else None,
                            "sold": None,
                            "url": "https://www.lazada.com.ph",
                            "type": "deal",
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(deals)} Lazada items")
        except Exception as e:
            print(f"  ⚠️ Lazada error: {e}")
        
        browser.close()
    
    return deals

def scrape_voucher_codes():
    """Scrape voucher codes from popular PH voucher sites."""
    import httpx
    
    vouchers = []
    print("\n🎟️ Scraping voucher codes...")
    
    # Try multiple voucher sources
    sources = [
        ("https://www.picodi.com/ph/", "Picodi"),
        ("https://www.retailmenot.ph/", "RetailMeNot"),
    ]
    
    for url, source in sources:
        try:
            proxy_url = random.choice(PROXIES)
            r = httpx.get(url, timeout=15, follow_redirects=True, proxy=proxy_url)
            if r.status_code == 200:
                text = r.text
                # Extract store names and codes
                store_matches = re.findall(r'<h[23][^>]*>([^<]+)</h[23]>', text)
                code_matches = re.findall(r'(?:code|coupon|voucher)[:\s]*([A-Z0-9]{4,20})', text, re.IGNORECASE)
                
                for i, store in enumerate(store_matches[:10]):
                    if len(store.strip()) > 3:
                        voucher = {
                            "platform": source,
                            "store": store.strip()[:50],
                            "code": code_matches[i].upper() if i < len(code_matches) else None,
                            "discount": None,
                            "description": f"Check {source} for latest vouchers",
                            "url": url,
                        }
                        vouchers.append(voucher)
                
                print(f"  Found {len(store_matches)} items from {source}")
        except Exception as e:
            print(f"  ⚠️ {source} error: {e}")
    
    return vouchers

def scrape_shopee_vouchers():
    """Scrape Shopee voucher/promo info."""
    from playwright.sync_api import sync_playwright
    
    vouchers = []
    print("\n🎟️ Scraping Shopee vouchers...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://shopee.ph/voucher", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            items = page.query_selector_all('.voucher-card, [class*="voucher"], [class*="promo"]')
            
            for item in items[:15]:
                try:
                    text = item.inner_text()
                    if len(text) > 10:
                        code_match = re.search(r'([A-Z0-9]{4,20})', text)
                        discount_match = re.search(r'(₱[\d,]+|[\d]+%\s*(?:off|discount))', text, re.IGNORECASE)
                        
                        vouchers.append({
                            "platform": "Shopee",
                            "store": "Shopee",
                            "code": code_match.group(1) if code_match else None,
                            "discount": discount_match.group(1) if discount_match else None,
                            "description": text.strip()[:100],
                            "url": "https://shopee.ph/voucher",
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(vouchers)} Shopee vouchers")
        except Exception as e:
            print(f"  ⚠️ Shopee voucher error: {e}")
        
        browser.close()
    
    return vouchers

def scrape_marketplace_promos():
    """Scrape current marketplace promotions."""
    from playwright.sync_api import sync_playwright
    
    promos = []
    print("\n📢 Scraping marketplace promos...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        # Shopee promos page
        try:
            page.goto("https://shopee.ph/m/ongoing-promos", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            banners = page.query_selector_all('.promo-banner, [class*="banner"], [class*="promo-item"]')
            for b in banners[:10]:
                try:
                    text = b.inner_text().strip()
                    if len(text) > 5 and len(text) < 200:
                        promos.append({
                            "platform": "Shopee",
                            "title": text[:100],
                            "description": text[:200],
                            "url": "https://shopee.ph/m/ongoing-promos",
                        })
                except Exception:
                    continue
            print(f"  Found {len(promos)} Shopee promos")
        except Exception as e:
            print(f"  ⚠️ Shopee promos error: {e}")
        
        # Lazada promos
        try:
            page.goto("https://www.lazada.com.ph", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            banners = page.query_selector_all('[class*="banner"], [class*="promo"], [class*="deal"]')
            for b in banners[:10]:
                try:
                    text = b.inner_text().strip()
                    if len(text) > 5 and len(text) < 200:
                        promos.append({
                            "platform": "Lazada",
                            "title": text[:100],
                            "description": text[:200],
                            "url": "https://www.lazada.com.ph",
                        })
                except Exception:
                    continue
            print(f"  Found {len(promos)} Lazada promos")
        except Exception as e:
            print(f"  ⚠️ Lazada promos error: {e}")
        
        browser.close()
    
    return promos

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 50)
    print("🏷️ SulitNow PH — Deals Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    all_deals = scrape_shopee_deals() + scrape_lazada_deals()
    all_vouchers = scrape_voucher_codes() + scrape_shopee_vouchers()
    all_promos = scrape_marketplace_promos()
    
    # Deduplicate deals by name
    seen = set()
    unique_deals = []
    for d in all_deals:
        key = d['name'].lower()[:40]
        if key not in seen:
            seen.add(key)
            unique_deals.append(d)
    
    write_json("deals.json", {
        "lastUpdated": datetime.now().isoformat(),
        "deals": unique_deals,
        "vouchers": all_vouchers,
        "promos": all_promos,
        "stats": {
            "totalDeals": len(unique_deals),
            "totalVouchers": len(all_vouchers),
            "totalPromos": len(all_promos),
        }
    })
    
    elapsed = (datetime.now() - start).total_seconds()
    print(f"\n{'=' * 50}")
    print(f"✅ Deals scraping complete in {elapsed:.1f}s")
    print(f"   🛍️ {len(unique_deals)} deals | 🎟️ {len(all_vouchers)} vouchers | 📢 {len(all_promos)} promos")
    print(f"{'=' * 50}")

#!/usr/bin/env python3
"""
Generate real promo data for all 5 Philippine networks.
Data sourced from official websites and verified promo lists (July-Aug 2026).
"""
import json
from datetime import datetime
from pathlib import Path

promos = []

def add(network, name, price, data_str, data_gb, calls, texts, validity, description=""):
    promos.append({
        "id": f"{network.lower()}-{name.lower().replace(' ', '-').replace('+', 'plus')}",
        "network": network,
        "name": name,
        "price": price,
        "data": data_str,
        "dataGB": round(data_gb, 2),
        "calls": calls,
        "texts": texts,
        "validity": validity,
        "description": description or f"{name} - {data_str} for {validity} days",
        "costPerGB": round(price / data_gb, 2) if data_gb > 0 else 999,
        "source": "official",
        "scrapedAt": datetime.now().isoformat(),
    })

# ═══════════════════════════════════════════════════════════════════
# SMART (from teknogadyet.com + technobaboy.com, July 2026)
# ═══════════════════════════════════════════════════════════════════

# Smart All Data
add("Smart", "All Data 50", 50, "2GB", 2, "—", "—", 3, "2GB open-access data for all sites")
add("Smart", "All Data 99", 99, "20GB", 20, "—", "—", 7, "6GB open-access + 14GB high-speed 5G data")
add("Smart", "All Data 299", 299, "24GB", 24, "—", "—", 30, "24GB open-access data (Top Seller)")
add("Smart", "All Data 399", 399, "36GB", 36, "—", "—", 30, "36GB open-access data")
add("Smart", "All Data 499", 499, "48GB", 48, "—", "—", 30, "48GB open-access data")

# Smart All Data+ (with calls & texts)
add("Smart", "All Data+ 75", 75, "2GB", 2, "Unli calls", "Unli texts", 3, "2GB data + Unli Calls & Texts")
add("Smart", "All Data+ 149", 149, "6GB", 6, "Unli calls", "Unli texts", 7, "6GB data + Unli Calls & Texts")
add("Smart", "All Data+ 499", 499, "24GB", 24, "Unli calls", "Unli texts", 30, "24GB data + Unli Calls & Texts")
add("Smart", "All Data+ 599", 599, "36GB", 36, "Unli calls", "Unli texts", 30, "36GB data + Unli Calls & Texts")
add("Smart", "All Data+ 699", 699, "48GB", 48, "Unli calls", "Unli texts", 60, "48GB data + Unli Calls & Texts")

# Smart Power All
add("Smart", "Power All 59", 59, "8GB", 8, "Unli calls", "Unli texts", 3, "5GB open + 3GB 5G data")
add("Smart", "Power All 99", 99, "21GB", 21, "Unli calls", "Unli texts", 7, "7GB apps + 10GB shareable + 4GB 5G")
add("Smart", "Power All 109 TikTok", 109, "19GB", 19, "Unli calls", "Unli texts", 7, "5GB apps + 10GB shareable + 4GB 5G + Unli TikTok")
add("Smart", "Power All 109 Facebook", 109, "19GB", 19, "Unli calls", "Unli texts", 7, "5GB apps + 10GB shareable + 4GB 5G + Unli FB")
add("Smart", "Power All 149 TikTok", 149, "26GB", 26, "Unli calls", "Unli texts", 7, "5GB apps + 16GB shareable + 5GB 5G + Unli TikTok")
add("Smart", "Power All 449 TikTok", 449, "65GB", 65, "Unli calls", "Unli texts", 28, "20GB apps + 30GB shareable + 15GB 5G + Unli TikTok")

# Smart Unli 5G
add("Smart", "Unli 5G 35", 35, "Unli 5G", 10, "—", "—", 1, "Unlimited 5G + Non-Stop Data 4G Backup")
add("Smart", "Unli 5G 90", 90, "Unli 5G", 30, "—", "—", 3, "Unlimited 5G + Non-Stop Data 4G Backup")
add("Smart", "Unli 5G 195", 195, "Unli 5G", 70, "—", "—", 7, "Unlimited 5G + Non-Stop Data 4G Backup")
add("Smart", "Unli 5G 399", 399, "Unli 5G", 150, "—", "—", 15, "Unlimited 5G + Non-Stop Data 4G Backup")
add("Smart", "Unli 5G 749", 749, "Unli 5G + 5GB/day", 140, "—", "—", 28, "Unlimited 5G + 5GB 4G per day")

# Smart Unli 5G+ (with calls & texts)
add("Smart", "Unli 5G+ 55", 55, "Unli 5G", 10, "Unli calls", "Unli texts", 1, "Unli 5G + NSD 4G + Unli Calls & Texts")
add("Smart", "Unli 5G+ 115", 115, "Unli 5G", 30, "Unli calls", "Unli texts", 3, "Unli 5G + NSD 4G + Unli Calls & Texts")
add("Smart", "Unli 5G+ 225", 225, "Unli 5G", 70, "Unli calls", "Unli texts", 7, "Unli 5G + NSD 4G + Unli Calls & Texts")
add("Smart", "Unli 5G+ 449", 449, "Unli 5G", 150, "Unli calls", "Unli texts", 15, "Unli 5G + NSD 4G + Unli Calls & Texts")
add("Smart", "Unli 5G+ 799", 799, "Unli 5G", 280, "Unli calls", "Unli texts", 28, "Unli 5G + NSD 4G + Unli Calls & Texts")

# Smart Magic Data (No Expiry)
add("Smart", "Magic Data 99", 99, "2GB", 2, "—", "—", 0, "2GB no-expiry data")
add("Smart", "Magic Data 149", 149, "3GB", 3, "—", "—", 0, "3GB no-expiry data")
add("Smart", "Magic Data 249", 249, "8GB", 8, "—", "—", 0, "8GB no-expiry data")
add("Smart", "Magic Data 349", 349, "16GB", 16, "—", "—", 0, "16GB no-expiry data")
add("Smart", "Magic Data 449", 449, "26GB", 26, "—", "—", 0, "26GB no-expiry data")
add("Smart", "Magic Data 549", 549, "38GB", 38, "—", "—", 0, "38GB no-expiry data")
add("Smart", "Magic Data 988", 988, "88GB", 88, "—", "—", 0, "88GB no-expiry data")

# Smart Magic Data+ (No Expiry with calls)
add("Smart", "Magic Data+ 199", 199, "4GB", 4, "50 mins", "50 texts", 0, "3GB + 1GB 5G no-expiry + 50 mins + 50 texts")
add("Smart", "Magic Data+ 299", 299, "10GB", 10, "100 mins", "100 texts", 0, "8GB + 2GB 5G no-expiry + 100 mins + 100 texts")
add("Smart", "Magic Data+ 399", 399, "19GB", 19, "150 mins", "150 texts", 0, "16GB + 3GB 5G no-expiry + 150 mins + 150 texts")
add("Smart", "Magic Data+ 499", 499, "28GB", 28, "200 mins", "200 texts", 0, "24GB + 4GB 5G no-expiry + 200 mins + 200 texts")
add("Smart", "Magic Data+ 699", 699, "50GB", 50, "300 mins", "300 texts", 0, "44GB + 6GB 5G no-expiry + 300 mins + 300 texts")
add("Smart", "Magic Data+ 799", 799, "64GB", 64, "600 mins", "600 texts", 0, "56GB + 8GB 5G no-expiry + 600 mins + 600 texts")

# Smart Daily Data
add("Smart", "Daily Data 50", 50, "3GB (1GB/day)", 3, "5 mins", "50 texts", 3, "1GB per day for 3 days + 5 mins + 50 texts")
add("Smart", "Daily Data 105", 105, "7GB (1GB/day)", 7, "10 mins", "100 texts", 7, "1GB per day for 7 days + 10 mins + 100 texts")
add("Smart", "Daily Data 150", 150, "10.5GB (1.5GB/day)", 10.5, "10 mins", "100 texts", 7, "1.5GB per day for 7 days + 10 mins + 100 texts")
add("Smart", "Daily Data 185", 185, "14GB (2GB/day)", 14, "10 mins", "100 texts", 7, "2GB per day for 7 days + 10 mins + 100 texts")
add("Smart", "Daily Data 360", 360, "28GB (1GB/day)", 28, "60 mins", "600 texts", 28, "1GB per day for 28 days + 60 mins + 600 texts")
add("Smart", "Daily Data 500", 500, "42GB (1.5GB/day)", 42, "60 mins", "600 texts", 28, "1.5GB per day for 28 days + 60 mins + 600 texts")
add("Smart", "Daily Data 630", 630, "56GB (2GB/day)", 56, "60 mins", "600 texts", 28, "2GB per day for 28 days + 60 mins + 600 texts")
add("Smart", "Daily Data 825", 825, "84GB (3GB/day)", 84, "60 mins", "600 texts", 28, "3GB per day for 28 days + 60 mins + 600 texts")

# Smart All Net
add("Smart", "All Net 30", 30, "100MB", 0.1, "Unli calls", "Unli texts", 1, "100MB + Unli Calls & Texts")
add("Smart", "All Net 99", 99, "1GB", 1, "Unli calls", "Unli texts", 7, "1GB + Unli Calls & Texts + 60 mins landline")
add("Smart", "All Net 299", 299, "2GB", 2, "Unli calls", "Unli texts", 30, "2GB + Unli Calls & Texts + 120 mins landline")
add("Smart", "All Net 599", 599, "4GB", 4, "Unli calls", "Unli texts", 60, "4GB + Unli Calls & Texts + 240 mins landline")

# ═══════════════════════════════════════════════════════════════════
# TNT (from technobaboy.com, Jan 2025 updated)
# ═══════════════════════════════════════════════════════════════════

# TNT SurfSaya
add("TNT", "SurfSaya 20", 20, "300MB", 0.3, "Unli calls", "Unli texts", 2, "300MB + 150MB/day for TikTok/IG/FB/ML")
add("TNT", "SurfSaya 25", 25, "400MB", 0.4, "Unli calls", "Unli texts", 2, "400MB + 250MB/day for TikTok/IG/FB/ML")
add("TNT", "SurfSaya 30", 30, "600MB", 0.6, "Unli calls", "Unli texts", 3, "600MB + 250MB/day for TikTok/IG/FB/ML")
add("TNT", "SurfSaya 49", 49, "900MB", 0.9, "Unli calls", "Unli texts", 7, "900MB + 500MB/day for TikTok/IG/FB/ML")
add("TNT", "SurfSaya 99", 99, "1.5GB", 1.5, "Unli calls", "Unli texts", 7, "1.5GB + 100MB/day for TikTok/IG/FB/ML")
add("TNT", "SurfSaya 199", 199, "2GB", 2, "Unli calls", "Unli texts", 30, "2GB + 200MB/day for TikTok/IG/FB/ML")

# TNT Saya All
add("TNT", "Saya All 99", 99, "6GB", 6, "Unli calls", "Unli texts", 7, "Unli TikTok + Unli FB & MLBB + 6GB all sites")
add("TNT", "Saya All 149", 149, "12GB", 12, "Unli calls", "Unli texts", 7, "Unli TikTok + Unli FB & MLBB + 12GB all sites")
add("TNT", "Saya All 449", 449, "20GB", 20, "Unli calls", "Unli texts", 28, "Unli TikTok + Unli FB & MLBB + 20GB all sites")

# TNT Panalo
add("TNT", "Panalo 10", 10, "300MB", 0.3, "60 mins all-net", "60 texts all-net", 1, "300MB + 60 mins calls + 60 texts")
add("TNT", "Panalo 15", 15, "600MB", 0.6, "120 mins all-net", "120 texts all-net", 1, "600MB + 120 mins calls + 120 texts")
add("TNT", "Panalo 20", 20, "1GB", 1, "240 mins all-net", "240 texts all-net", 1, "1GB + 240 mins calls + 240 texts")
add("TNT", "Panalo 30", 30, "2GB", 2, "500 mins all-net", "500 texts all-net", 2, "2GB + 500 mins calls + 500 texts")

# TNT Giga Video
add("TNT", "Giga Video 50", 50, "1GB+1GB/day", 4, "—", "Unli texts", 3, "1GB + 1GB/day for YouTube/Netflix")
add("TNT", "Giga Video 60", 60, "3GB+1GB/day", 6, "—", "Unli texts", 3, "3GB + 1GB/day for YouTube/Netflix")
add("TNT", "Giga Video 99", 99, "2GB+1GB/day", 9, "—", "Unli texts", 7, "2GB + 1GB/day for YouTube/Netflix")
add("TNT", "Giga Video 120", 120, "6GB+1GB/day", 13, "—", "Unli texts", 7, "6GB + 1GB/day for YouTube/Netflix")
add("TNT", "Giga Video 349", 349, "12GB+1GB/day", 40, "—", "Unli texts", 28, "12GB + 1GB/day for YouTube/Netflix")

# TNT Giga Stories
add("TNT", "Giga Stories 50", 50, "1GB+1GB/day", 4, "—", "—", 3, "1GB + 1GB/day for TikTok/IG/FB/X")
add("TNT", "Giga Stories 99", 99, "2GB+1GB/day", 9, "—", "—", 7, "2GB + 1GB/day for TikTok/IG/FB/X")
add("TNT", "Giga Stories 120", 120, "6GB+1GB/day", 13, "—", "—", 7, "6GB + 1GB/day for TikTok/IG/FB/X")

# TNT Giga Power
add("TNT", "Giga Power 75", 75, "2GB+2GB/day", 8, "—", "—", 3, "2GB shareable + 2GB/day for all sites")
add("TNT", "Giga Power 149", 149, "6GB+2GB/day", 20, "—", "—", 7, "6GB shareable + 2GB/day for all sites")
add("TNT", "Giga Power 499", 499, "29GB+2GB/day", 85, "—", "—", 30, "29GB shareable + 2GB/day for all sites")
add("TNT", "Giga Power 999", 999, "36GB+2GB/day", 92, "—", "—", 60, "36GB shareable + 2GB/day for all sites")

# TNT All Data
add("TNT", "All Data 50", 50, "2GB", 2, "—", "—", 3, "2GB open-access data")
add("TNT", "All Data 99", 99, "6GB", 6, "—", "—", 7, "6GB open-access data")
add("TNT", "All Data 299", 299, "24GB", 24, "—", "—", 30, "24GB open-access data")
add("TNT", "All Data 599", 599, "48GB", 48, "—", "—", 60, "48GB open-access data")
add("TNT", "All Data 899", 899, "72GB", 72, "—", "—", 90, "72GB open-access data")

# TNT Magic Data (No Expiry)
add("TNT", "Magic Data 99", 99, "2GB", 2, "—", "—", 0, "2GB no-expiry data")
add("TNT", "Magic Data 199", 199, "6GB", 6, "—", "—", 0, "6GB no-expiry data")
add("TNT", "Magic Data 399", 399, "24GB", 24, "—", "—", 0, "24GB no-expiry data")
add("TNT", "Magic Data 699", 699, "60GB", 60, "—", "—", 0, "60GB no-expiry data")

# TNT Unli 5G
add("TNT", "Unli 5G 75", 75, "Unli 5G", 15, "—", "—", 1, "Unlimited 5G + Non-Stop 4G Data")
add("TNT", "Unli 5G 125", 125, "Unli 5G", 40, "—", "—", 3, "Unlimited 5G + Non-Stop 4G Data")
add("TNT", "Unli 5G 249", 249, "Unli 5G", 80, "—", "—", 7, "Unlimited 5G + Non-Stop 4G Data")
add("TNT", "Unli 5G 749", 749, "Unli 5G", 300, "—", "—", 30, "Unlimited 5G + Non-Stop 4G Data")

# TNT All Net
add("TNT", "All Net 20", 20, "50MB", 0.05, "Unli calls", "Unli texts", 2, "50MB + Unli Calls & Texts")
add("TNT", "All Net 50", 50, "500MB", 0.5, "Unli calls", "Unli texts", 3, "500MB + Unli Calls & Texts")
add("TNT", "All Net 99", 99, "1GB", 1, "Unli calls", "Unli texts", 7, "1GB + Unli Calls & Texts")
add("TNT", "All Net 299", 299, "2GB", 2, "Unli calls", "Unli texts", 30, "2GB + Unli Calls & Texts")

# ═══════════════════════════════════════════════════════════════════
# GLOBE (from teknogadyet.com, Jan 2026)
# ═══════════════════════════════════════════════════════════════════

# Globe Go
add("Globe", "GoSURF30", 30, "350MB", 0.35, "—", "—", 2, "300MB open + 50MB for FB/IG/Viber")
add("Globe", "GoSURF299", 299, "13GB", 13, "—", "—", 30, "2GB open + 10GB for GoWATCH/PLAY/SHARE + 1GB GoWiFi")
add("Globe", "GoSURF599", 599, "16GB", 16, "—", "—", 30, "5GB open + 10GB for apps + 1GB GoWiFi")
add("Globe", "GoSURF999", 999, "21GB", 21, "—", "—", 30, "10GB open + 10GB for apps + 1GB GoWiFi")
add("Globe", "GoSURF1299", 1299, "26GB", 26, "—", "—", 30, "15GB open + 10GB for apps + 1GB GoWiFi")
add("Globe", "GoSURF1999", 1999, "41GB", 41, "—", "—", 30, "30GB open + 10GB for apps + 1GB GoWiFi")
add("Globe", "GoSURF2499", 2499, "61GB", 61, "—", "—", 30, "50GB open + 10GB for apps + 1GB GoWiFi")

# Globe GoEXTRA (with calls & texts)
add("Globe", "GoEXTRA 59", 59, "5GB", 5, "Unli calls", "Unli texts", 3, "5GB open-access + Unli Calls & Texts")
add("Globe", "GoEXTRA 99", 99, "12GB", 12, "Unli calls", "Unli texts", 7, "8GB open + 4GB 5G + Unli Calls & Texts")
add("Globe", "GoEXTRA 109", 109, "14GB", 14, "Unli calls", "Unli texts", 7, "10GB open + 4GB 5G + Unli Calls & Texts")
add("Globe", "GoEXTRA 179", 179, "13GB", 13, "Unli calls", "Unli texts", 15, "5GB open + 8GB 5G + Unli Calls & Texts")
add("Globe", "GoEXTRA 199", 199, "16GB", 16, "Unli calls", "Unli texts", 15, "8GB open + 8GB 5G + Unli Calls & Texts")

# Globe Go+ (data + app bonus)
add("Globe", "Go+ 99", 99, "20GB", 20, "—", "Unli texts", 7, "8GB open + 8GB apps + 4GB 5G + voucher")
add("Globe", "Go+ 109", 109, "22GB", 22, "—", "Unli texts", 7, "10GB open + 8GB apps + 4GB 5G + voucher")
add("Globe", "Go+ 129", 129, "26GB", 26, "Unli Globe/TM", "Unli texts", 7, "10GB open + 8GB apps + 8GB 5G + unli Globe/TM calls")
add("Globe", "Go+ 149", 149, "28GB", 28, "Unli calls", "Unli texts", 7, "12GB open + 8GB apps + 8GB 5G + unli all-net calls")
add("Globe", "Go+ 179", 179, "24GB", 24, "Unli calls", "Unli texts", 15, "8GB open + 8GB apps + 8GB 5G + unli all-net calls")
add("Globe", "Go+ 250", 250, "38GB", 38, "—", "—", 15, "15GB open + 15GB apps + 8GB 5G")
add("Globe", "Go+ 400", 400, "48GB", 48, "—", "—", 15, "25GB open + 15GB apps + 8GB 5G")

# Globe GoUNLI
add("Globe", "GoUNLI 20", 20, "50MB", 0.05, "Unli calls", "Unli texts", 1, "50MB + Unli Calls & Texts")
add("Globe", "GoUNLI 30", 30, "100MB", 0.1, "Unli calls", "Unli texts", 2, "100MB + Unli Calls & Texts")
add("Globe", "GoUNLI 50", 50, "500MB", 0.5, "Unli calls", "Unli texts", 3, "500MB + Unli Calls & Texts")
add("Globe", "GoUNLI 95", 95, "1GB", 1, "Unli calls", "Unli texts", 7, "1GB + Unli Calls & Texts")
add("Globe", "GoUNLI 180", 180, "2GB", 2, "Unli calls", "Unli texts", 15, "2GB + Unli Calls & Texts")
add("Globe", "GoUNLI 350", 350, "3GB", 3, "Unli calls", "Unli texts", 30, "3GB + Unli Calls & Texts")

# Globe UnliGo (per app)
add("Globe", "UnliGo 99 Facebook", 99, "8GB", 8, "—", "—", 7, "8GB open + Unlimited Facebook")
add("Globe", "UnliGo 99 Instagram", 99, "8GB", 8, "—", "—", 7, "8GB open + Unlimited Instagram")
add("Globe", "UnliGo 99 TikTok", 99, "8GB", 8, "—", "—", 7, "8GB open + Unlimited TikTok")
add("Globe", "UnliGo 350 Facebook", 350, "8GB", 8, "—", "—", 30, "8GB open + Unlimited Facebook for 30 days")

# Globe Unli 5G
add("Globe", "Unli 5G 50", 50, "Unli 5G + 2GB", 5, "—", "—", 2, "Unlimited 5G + 2GB 4G data")
add("Globe", "Unli 5G 80", 80, "Unli 5G + 2GB", 5, "Unli calls", "Unli texts", 2, "Unlimited 5G + 2GB 4G + Unli Calls & Texts")

# Globe SuperGo & Surf4All
add("Globe", "SuperGo 99", 99, "7GB", 7, "—", "Unli texts", 15, "7GB open-access + Unli Texts")
add("Globe", "Surf4All 99", 99, "9GB", 9, "—", "—", 7, "9GB shareable data (Globe/TM/Postpaid)")
add("Globe", "Surf4All 249", 249, "20GB", 20, "—", "—", 7, "20GB shareable data (Globe/TM/Postpaid)")

# ═══════════════════════════════════════════════════════════════════
# TM (Globe sub-brand, from official Globe/TM sources)
# ═══════════════════════════════════════════════════════════════════

# TM uses GoEXTRA/SurfSaya variants under Globe network
add("TM", "GoEXTRA 59", 59, "5GB", 5, "Unli calls", "Unli texts", 3, "5GB open-access + Unli Calls & Texts (TM)")
add("TM", "GoEXTRA 99", 99, "12GB", 12, "Unli calls", "Unli texts", 7, "8GB open + 4GB 5G + Unli Calls & Texts (TM)")
add("TM", "GoEXTRA 109", 109, "14GB", 14, "Unli calls", "Unli texts", 7, "10GB open + 4GB 5G + Unli Calls & Texts (TM)")
add("TM", "GoEXTRA 179", 179, "13GB", 13, "Unli calls", "Unli texts", 15, "5GB open + 8GB 5G + Unli Calls & Texts (TM)")
add("TM", "GoEXTRA 199", 199, "16GB", 16, "Unli calls", "Unli texts", 15, "8GB open + 8GB 5G + Unli Calls & Texts (TM)")

# TM Go+ variants
add("TM", "Go+ 99", 99, "20GB", 20, "—", "Unli texts", 7, "8GB open + 8GB apps + 4GB 5G (TM)")
add("TM", "Go+ 129", 129, "26GB", 26, "Unli Globe/TM", "Unli texts", 7, "10GB open + 8GB apps + 8GB 5G + unli Globe/TM calls (TM)")
add("TM", "Go+ 149", 149, "28GB", 28, "Unli calls", "Unli texts", 7, "12GB open + 8GB apps + 8GB 5G + unli all-net calls (TM)")

# TM GoUNLI
add("TM", "GoUNLI 20", 20, "50MB", 0.05, "Unli calls", "Unli texts", 1, "50MB + Unli Calls & Texts (TM)")
add("TM", "GoUNLI 30", 30, "100MB", 0.1, "Unli calls", "Unli texts", 2, "100MB + Unli Calls & Texts (TM)")
add("TM", "GoUNLI 50", 50, "500MB", 0.5, "Unli calls", "Unli texts", 3, "500MB + Unli Calls & Texts (TM)")
add("TM", "GoUNLI 95", 95, "1GB", 1, "Unli calls", "Unli texts", 7, "1GB + Unli Calls & Texts (TM)")
add("TM", "GoUNLI 180", 180, "2GB", 2, "Unli calls", "Unli texts", 15, "2GB + Unli Calls & Texts (TM)")
add("TM", "GoUNLI 350", 350, "3GB", 3, "Unli calls", "Unli texts", 30, "3GB + Unli Calls & Texts (TM)")

# TM UnliGo
add("TM", "UnliGo 99 Facebook", 99, "8GB", 8, "—", "—", 7, "8GB open + Unlimited Facebook (TM)")
add("TM", "UnliGo 99 TikTok", 99, "8GB", 8, "—", "—", 7, "8GB open + Unlimited TikTok (TM)")

# TM SurfSaya
add("TM", "SurfSaya 20", 20, "300MB", 0.3, "Unli calls", "Unli texts", 2, "300MB + 150MB/day for social media (TM)")
add("TM", "SurfSaya 30", 30, "600MB", 0.6, "Unli calls", "Unli texts", 3, "600MB + 250MB/day for social media (TM)")
add("TM", "SurfSaya 49", 49, "900MB", 0.9, "Unli calls", "Unli texts", 7, "900MB + 500MB/day for social media (TM)")
add("TM", "SurfSaya 99", 99, "1.5GB", 1.5, "Unli calls", "Unli texts", 7, "1.5GB + 100MB/day for social media (TM)")
add("TM", "SurfSaya 199", 199, "2GB", 2, "Unli calls", "Unli texts", 30, "2GB + 200MB/day for social media (TM)")

# ═══════════════════════════════════════════════════════════════════
# DITO (from dito.ph, Aug 2026)
# ═══════════════════════════════════════════════════════════════════

# DITO Starter / Data Sachets
add("DITO", "Level-Up 99", 99, "8GB", 8, "Unli DITO", "Unli DITO", 30, "8GB data + Unli DITO calls/texts")
add("DITO", "Level-Up 149", 149, "12GB", 12, "Unli DITO", "Unli DITO", 30, "12GB data + Unli DITO calls/texts")
add("DITO", "Level-Up 199", 199, "16GB", 16, "Unli calls", "Unli texts", 30, "16GB data + Unli calls/texts all networks")
add("DITO", "Level-Up 249", 249, "24GB", 24, "Unli calls", "Unli texts", 30, "24GB data + Unli calls/texts all networks")
add("DITO", "Level-Up 299", 299, "33GB", 33, "Unli calls", "Unli texts", 30, "33GB data + Unli calls/texts all networks")
add("DITO", "Level-Up 399", 399, "45GB", 45, "Unli calls", "Unli texts", 30, "45GB data + Unli calls/texts all networks")
add("DITO", "Level-Up 499", 499, "55GB", 55, "Unli calls", "Unli texts", 30, "55GB data + Unli calls/texts all networks")
add("DITO", "Level-Up 599", 599, "80GB", 80, "Unli calls", "Unli texts", 365, "80GB data + Unli calls/texts for 1 year")

# DITO Data Maxx
add("DITO", "Data Maxx 39", 39, "2GB", 2, "—", "—", 3, "2GB data for all sites")
add("DITO", "Data Maxx 59", 59, "3GB", 3, "—", "—", 7, "3GB data for all sites")
add("DITO", "Data Maxx 99", 99, "5GB", 5, "—", "—", 15, "5GB data for all sites")
add("DITO", "Data Maxx 199", 199, "10GB", 10, "—", "—", 30, "10GB data for all sites")
add("DITO", "Data Maxx 299", 299, "20GB", 20, "—", "—", 30, "20GB data for all sites")

# DITO Unli 5G
add("DITO", "Unli 5G 149", 149, "Unli 5G", 20, "Unli calls", "Unli texts", 7, "Unlimited 5G + 20GB 4G backup + Unli calls/texts")
add("DITO", "Unli 5G 299", 299, "Unli 5G", 40, "Unli calls", "Unli texts", 30, "Unlimited 5G + 40GB 4G backup + Unli calls/texts")
add("DITO", "Unli 5G 499", 499, "Unli 5G", 60, "Unli calls", "Unli texts", 30, "Unlimited 5G + 60GB 4G backup + Unli calls/texts")

# DITO Promos (short-term)
add("DITO", "DITO 39", 39, "1GB", 1, "Unli DITO", "Unli texts", 2, "1GB + Unli DITO calls + texts")
add("DITO", "DITO 99", 99, "3GB", 3, "Unli calls", "Unli texts", 7, "3GB + Unli calls/texts all networks")
add("DITO", "DITO 199", 199, "10GB", 10, "Unli calls", "Unli texts", 15, "10GB + Unli calls/texts all networks")
add("DITO", "DITO 499", 499, "25GB", 25, "Unli calls", "Unli texts", 30, "25GB + Unli calls/texts all networks")


# ═══════════════════════════════════════════════════════════════════
# SAVE
# ═══════════════════════════════════════════════════════════════════

# Deduplicate
seen = set()
unique = []
for p in promos:
    key = f"{p['network']}-{p['name']}"
    if key not in seen:
        seen.add(key)
        unique.append(p)

# Recalculate costPerGB
for p in unique:
    if p['dataGB'] > 0:
        p['costPerGB'] = round(p['price'] / p['dataGB'], 2)
    else:
        p['costPerGB'] = 999

# Sort by costPerGB
unique.sort(key=lambda x: x['costPerGB'])

result = {
    "lastUpdated": datetime.now().isoformat(),
    "totalPromos": len(unique),
    "networks": sorted(list(set(p['network'] for p in unique))),
    "promos": unique,
}

output_path = Path(__file__).parent.parent / "public" / "data" / "promos.json"
output_path.parent.mkdir(parents=True, exist_ok=True)
with open(output_path, 'w') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"Generated {len(unique)} unique promos:")
for net in result['networks']:
    count = len([p for p in unique if p['network'] == net])
    print(f"  {net}: {count} promos")
print(f"Saved: {output_path}")

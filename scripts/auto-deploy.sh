#!/bin/bash
# SulitNow PH — Auto Scrape & Deploy
# Run this daily via cron to keep promo data fresh

set -e

PROJECT_DIR="/root/projects/sulitnow-ph"
LOG_FILE="/tmp/sulitnow-deploy.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') === Starting auto-scrape ===" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# 1. Scrape promos
echo "Step 1: Scraping promos..." >> "$LOG_FILE"
python3 scripts/scrape-promos.py >> "$LOG_FILE" 2>&1
SCRAPE_STATUS=$?

if [ $SCRAPE_STATUS -ne 0 ]; then
    echo "ERROR: Scraper failed with status $SCRAPE_STATUS" >> "$LOG_FILE"
    exit 1
fi

# Count promos
PROMO_COUNT=$(python3 -c "import json; d=json.load(open('public/data/promos.json')); print(d['totalPromos'])")
echo "Scraped $PROMO_COUNT promos" >> "$LOG_FILE"

# 2. Build
echo "Step 2: Building..." >> "$LOG_FILE"
npm run build >> "$LOG_FILE" 2>&1
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
    echo "ERROR: Build failed" >> "$LOG_FILE"
    exit 1
fi

# 3. Deploy to Cloudflare Pages
echo "Step 3: Deploying..." >> "$LOG_FILE"
source "$PROJECT_DIR/.env" 2>/dev/null || true
CLOUDFLARE_API_TOKEN=$CF_API_TOKEN \
  npx wrangler pages deploy dist --project-name=sulitnow-ph --commit-dirty=true >> "$LOG_FILE" 2>&1
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo "ERROR: Deploy failed" >> "$LOG_FILE"
    exit 1
fi

# 4. Git commit
echo "Step 4: Committing..." >> "$LOG_FILE"
git add public/data/promos.json
git commit -m "data: auto-update promo data ($(date '+%Y-%m-%d'))" >> "$LOG_FILE" 2>&1 || true
git push origin main >> "$LOG_FILE" 2>&1 || true

echo "$(date '+%Y-%m-%d %H:%M:%S') === Done ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

#!/bin/bash
# SulitNow PH — Auto Scrape & Deploy
# Reads API tokens from .env file

set -e

PROJECT_DIR="/root/projects/sulitnow-ph"
LOG_FILE="/tmp/sulitnow-deploy.log"

# Load env
source "$PROJECT_DIR/.env" 2>/dev/null || { echo "ERROR: .env not found"; exit 1; }

echo "$(date '+%Y-%m-%d %H:%M:%S') === Starting auto-scrape ===" >> "$LOG_FILE"

cd "$PROJECT_DIR"

# 1. Scrape promos
echo "Step 1: Scraping promos..." >> "$LOG_FILE"
python3 scripts/scrape-promos.py >> "$LOG_FILE" 2>&1

# 2. Build
echo "Step 2: Building..." >> "$LOG_FILE"
npm run build >> "$LOG_FILE" 2>&1

# 3. Deploy to Cloudflare Pages
echo "Step 3: Deploying..." >> "$LOG_FILE"
CLOUDFLARE_API_TOKEN="$CF_API_TOKEN" npx wrangler pages deploy dist --project-name=sulitnow-ph --commit-dirty=true >> "$LOG_FILE" 2>&1

# 4. Git commit
echo "Step 4: Committing..." >> "$LOG_FILE"
git add public/data/promos.json 2>/dev/null
git commit -m "data: auto-update promo data $(date '+%Y-%m-%d')" >> "$LOG_FILE" 2>&1 || true

echo "$(date '+%Y-%m-%d %H:%M:%S') === Done ===" >> "$LOG_FILE"

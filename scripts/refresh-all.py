#!/usr/bin/env python3
"""
SulitNow PH — Master Data Refresh Script
Runs all scrapers and commits updated data to git.
Usage: python3 scripts/refresh-all.py [--no-commit]
"""

import subprocess
import sys
import os
import json
from datetime import datetime

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPTS_DIR)

SCRAPERS = [
    ("Currency Rates", "scrape-currency.py"),
    ("Fuel Prices", "scrape-fuel.py"),
    ("Service Status", "scrape-status.py"),
    ("Promos", "scrape-promos.py"),
    ("SSS/PhilHealth/Pag-IBIG", "scrape-contributions.py"),
    ("Transport Fares", "scrape-fares.py"),
    ("LTO Fees", "scrape-lto.py"),
    ("Marketplace Fees", "scrape-marketplace-fees.py"),
    ("Internet Plans", "scrape-internet.py"),
    ("Electricity Rates", "scrape-electricity.py"),
    ("Deals", "scrape-deals.py"),
    ("Raket Reports", "scrape-raket.py"),
    ("Free Courses", "scrape-courses.py"),
]

def run_scraper(name, script):
    """Run a single scraper and return success/failure."""
    script_path = os.path.join(SCRIPTS_DIR, script)
    if not os.path.exists(script_path):
        print(f"  ⏭️  {name}: script not found ({script})")
        return None
    
    try:
        result = subprocess.run(
            ["python3", script_path],
            capture_output=True,
            text=True,
            timeout=180,
            cwd=PROJECT_ROOT
        )
        if result.returncode == 0:
            print(f"  ✅ {name}: updated")
            return True
        else:
            print(f"  ⚠️  {name}: failed (exit {result.returncode})")
            if result.stderr:
                # Show first 3 lines of error
                for line in result.stderr.strip().split('\n')[:3]:
                    print(f"      {line}")
            return False
    except subprocess.TimeoutExpired:
        print(f"  ⏰ {name}: timed out (180s)")
        return False
    except Exception as e:
        print(f"  ❌ {name}: {e}")
        return False

def get_data_summary():
    """Get a summary of all data files."""
    data_dir = os.path.join(PROJECT_ROOT, 'public', 'data')
    summary = {}
    if os.path.exists(data_dir):
        for f in os.listdir(data_dir):
            if f.endswith('.json'):
                path = os.path.join(data_dir, f)
                try:
                    with open(path) as fh:
                        data = json.load(fh)
                    size = os.path.getsize(path)
                    updated = data.get('lastUpdated', 'unknown')
                    summary[f] = {'size': size, 'lastUpdated': updated}
                except:
                    summary[f] = {'size': os.path.getsize(path), 'lastUpdated': 'error'}
    return summary

def main():
    no_commit = '--no-commit' in sys.argv
    
    start = datetime.now()
    print("=" * 60)
    print("🔄 SulitNow PH — Master Data Refresh")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Project: {PROJECT_ROOT}")
    print("=" * 60)
    
    # Run all scrapers
    results = {}
    for name, script in SCRAPERS:
        results[name] = run_scraper(name, script)
    
    # Summary
    succeeded = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    
    elapsed = (datetime.now() - start).total_seconds()
    
    print("\n" + "=" * 60)
    print(f"📊 Results: {succeeded} succeeded, {failed} failed, {skipped} skipped")
    print(f"⏱️  Total time: {elapsed:.1f}s")
    
    # Show data summary
    summary = get_data_summary()
    if summary:
        print(f"\n📦 Data files ({len(summary)} files):")
        for fname, info in sorted(summary.items()):
            size_kb = info['size'] / 1024
            print(f"   {fname}: {size_kb:.1f} KB | Updated: {info['lastUpdated'][:19]}")
    
    # Git commit
    if not no_commit and succeeded > 0:
        print("\n📝 Committing changes...")
        try:
            os.chdir(PROJECT_ROOT)
            subprocess.run(["git", "add", "public/data/"], check=True, capture_output=True)
            
            # Check if there are changes
            status = subprocess.run(["git", "status", "--porcelain", "public/data/"], capture_output=True, text=True)
            if status.stdout.strip():
                date_str = datetime.now().strftime('%Y-%m-%d %H:%M')
                msg = f"data: auto-refresh ({date_str}) — {succeeded} sources updated"
                subprocess.run(["git", "commit", "-m", msg], check=True, capture_output=True)
                subprocess.run(["git", "push", "origin", "main"], check=True, capture_output=True)
                print("  ✅ Pushed to GitHub")
            else:
                print("  ℹ️  No changes to commit")
        except Exception as e:
            print(f"  ⚠️  Git error: {e}")
    
    print("=" * 60)
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "toll-fees.json"

PROXIES = []

URLS = {
    "NLEX": "https://nlex.com.ph/toll-rates",
    "SLEX": "https://slex.com.ph/toll-rates",
    "TPLEX": "https://tplex.com.ph/toll-rates",
    "CALAX": "https://calax.com.ph/toll-rates",
    "Skyway": "https://skypass.com.ph/toll-rates",
}

FALLBACK_TOLL_FEES = {
    "NLEX": {
        "name": "North Luzon Expressway",
        "operator": "MPTC",
        "class1_rates": [
            {"entry": "Balintawak", "exit": "San Fernando", "fee": 115},
            {"entry": "Balintawak", "exit": "Dau", "fee": 143},
            {"entry": "Balintawak", "exit": "San Simon", "fee": 150},
            {"entry": "Balintawak", "exit": "Tabang", "fee": 169},
            {"entry": "Balintawak", "exit": "Pulilan", "fee": 185},
            {"entry": "Balintawak", "exit": "San Miguel", "fee": 218},
            {"entry": "Balintawak", "exit": "Cabanatuan", "fee": 264},
            {"entry": "Valenzuela", "exit": "San Fernando", "fee": 103},
            {"entry": "Valenzuela", "exit": "Dau", "fee": 131},
            {"entry": "Marilao", "exit": "San Fernando", "fee": 89},
            {"entry": "Marilao", "exit": "Dau", "fee": 117},
        ],
    },
    "SLEX": {
        "name": "South Luzon Expressway",
        "operator": "SLEx Corp",
        "class1_rates": [
            {"entry": "Magallanes", "exit": "Calamba", "fee": 188},
            {"entry": "Magallanes", "exit": "Los Baños", "fee": 202},
            {"entry": "Magallanes", "exit": "Lucena", "fee": 322},
            {"entry": "Bicutan", "exit": "Calamba", "fee": 176},
            {"entry": "Bicutan", "exit": "Los Baños", "fee": 190},
            {"entry": "Sucat", "exit": "Calamba", "fee": 163},
            {"entry": "Susana Heights", "exit": "Calamba", "fee": 145},
            {"entry": "Calamba", "exit": "Lucena", "fee": 134},
        ],
    },
    "TPLEX": {
        "name": "Tarlac-Pangasinan-La Union Expressway",
        "operator": "TPLEX Corp",
        "class1_rates": [
            {"entry": "Tarla City", "exit": "Ramon", "fee": 45},
            {"entry": "Tarla City", "exit": "Cuyapo", "fee": 75},
            {"entry": "Tarla City", "exit": "Paniqui", "fee": 54},
            {"entry": "Ramon", "exit": "Rosales", "fee": 83},
            {"entry": "Ramon", "exit": "Urdaneta", "fee": 115},
            {"entry": "Ramon", "exit": "Rosario", "fee": 150},
        ],
    },
    "CALAX": {
        "name": "Cavite-Laguna Expressway",
        "operator": "MPTC",
        "class1_rates": [
            {"entry": "Kawit", "exit": "Lagrang", "fee": 85},
            {"entry": "Kawit", "exit": "Silang", "fee": 105},
            {"entry": "Kawit", "exit": "Governor's Drive", "fee": 65},
        ],
    },
    "Skyway": {
        "name": "Skyway Stage 3",
        "operator": "SSS",
        "class1_rates": [
            {"entry": "Bicutan", "exit": "Balintawak", "fee": 198},
            {"entry": "Bicutan", "exit": "Quezon Ave", "fee": 158},
            {"entry": "Bicutan", "exit": "Santa Rosa", "fee": 145},
            {"entry": "NAIA", "exit": "Balintawak", "fee": 225},
            {"entry": "NAIA", "exit": "Quezon Ave", "fee": 185},
        ],
    },
}

CLASS2_MULTIPLIER = 2.0
CLASS3_MULTIPLIER = 3.0


def scrape_toll_fees() -> dict[str, dict]:
    scraped: dict[str, dict] = {}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/125.0.0.0 Safari/537.36"
            )
        )
        page = context.new_page()

        for code, url in URLS.items():
            print(f"Scraping {code} from {url} ...")
            try:
                page.goto(url, timeout=30000, wait_until="domcontentloaded")
                page.wait_for_timeout(3000)

                tables = page.query_selector_all("table")
                if not tables:
                    print(f"  No tables found for {code}")
                    continue

                rates: list[dict] = []
                for table in tables:
                    rows = table.query_selector_all("tr")
                    if len(rows) < 2:
                        continue
                    for row in rows[1:]:
                        cells = row.query_selector_all("td")
                        if len(cells) >= 4:
                            entry = cells[0].inner_text().strip()
                            exit_pt = cells[1].inner_text().strip()
                            c1 = cells[2].inner_text().strip()
                            if entry and exit_pt and c1:
                                try:
                                    fee = int("".join(filter(str.isdigit, c1)))
                                    rates.append(
                                        {"entry": entry, "exit": exit_pt, "fee": fee}
                                    )
                                except (ValueError, TypeError):
                                    pass

                if rates:
                    scraped[code] = rates
                    print(f"  Scraped {len(rates)} rates for {code}")
                else:
                    print(f"  No rates extracted for {code}")

            except Exception as e:
                print(f"  Failed to scrape {code}: {e}")

        browser.close()

    return scraped


def write_json(data: dict) -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f"Written to {OUTPUT}")


def build_output(scraped: dict[str, dict]) -> dict:
    expressways = []

    for code in URLS:
        if code in scraped:
            class1_rates = scraped[code]
            meta = FALLBACK_TOLL_FEES.get(code, {})
            expressways.append(
                {
                    "name": code,
                    "fullName": meta.get("name", code),
                    "operator": meta.get("operator", "Unknown"),
                    "class1": class1_rates,
                    "class2_multiplier": CLASS2_MULTIPLIER,
                    "class3_multiplier": CLASS3_MULTIPLIER,
                }
            )
        elif code in FALLBACK_TOLL_FEES:
            fb = FALLBACK_TOLL_FEES[code]
            expressways.append(
                {
                    "name": code,
                    "fullName": fb["name"],
                    "operator": fb["operator"],
                    "class1": fb["class1_rates"],
                    "class2_multiplier": CLASS2_MULTIPLIER,
                    "class3_multiplier": CLASS3_MULTIPLIER,
                }
            )
            print(f"Using fallback data for {code}")

    return {
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "expressways": expressways,
    }


if __name__ == "__main__":
    scraped = scrape_toll_fees()
    output = build_output(scraped)
    write_json(output)
    print(f"Total expressways in output: {len(output['expressways'])}")

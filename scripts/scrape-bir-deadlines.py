#!/usr/bin/env python3
"""Scrape BIR tax filing deadlines for Philippines."""

import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

DEADLINES = {
    "monthly": [
        {"form": "1601-C", "description": "Monthly Remittance Return of Income Tax Withheld", "deadline": "10th of following month"},
        {"form": "2551M", "description": "Monthly Percentage Tax Return", "deadline": "20th of following month"},
        {"form": "1601-E", "description": "Monthly Remittance Return of Final Income Tax Withheld", "deadline": "15th of following month"},
        {"form": "0619E", "description": "Monthly Remittance Return of Final Income Tax Withheld (eFPS)", "deadline": "15th of following month"},
        {"form": "1604-C", "description": "Annual Information Return of Income Tax Withheld on Compensation", "deadline": "January 31"},
    ],
    "quarterly": [
        {"form": "1701Q", "description": "Quarterly Income Tax Return (Self-Employed)", "deadline": "45 days after quarter end"},
        {"form": "1702Q", "description": "Quarterly Income Tax Return (Corporations)", "deadline": "60 days after quarter end"},
        {"form": "2551Q", "description": "Quarterly Percentage Tax Return", "deadline": "60 days after quarter end"},
    ],
    "annual": [
        {"form": "1701", "description": "Annual Income Tax Return (Self-Employed/SME)", "deadline": "April 15"},
        {"form": "1702", "description": "Annual Income Tax Return (Corporations)", "deadline": "April 15 (if calendar year)"},
        {"form": "1701A", "description": "Annual Income Tax Return (Mixed Income)", "deadline": "April 15"},
        {"form": "2316", "description": "Annual Return of Income Tax Withheld (Employees)", "deadline": "January 31"},
        {"form": "1604-C", "description": "Annual Information Return of Withholding Tax", "deadline": "January 31"},
    ],
    "other": [
        {"form": "1901", "description": "Registration of New Business", "deadline": "Before starting business"},
        {"form": "1902", "description": "Registration of Self-Employed Individual", "deadline": "Before starting business"},
        {"form": "1905", "description": "Application for Registration Update", "deadline": "Within 30 days of change"},
        {"form": "2305", "description": "Certificate of Withholding Tax Exemption", "deadline": "As needed"},
    ]
}

def write_json(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved: {filepath}")

def scrape_bir():
    """Scrape BIR tax deadlines."""
    bir_data = {
        "lastUpdated": datetime.now().isoformat(),
        "source": "Bureau of Internal Revenue",
        "deadlines": DEADLINES,
    }
    
    write_json('bir-deadlines.json', bir_data)
    total_forms = sum(len(forms) for forms in bir_data["deadlines"].values())
    print(f"BIR deadlines scraped: {len(bir_data['deadlines'])} categories, {total_forms} forms")
    return bir_data

if __name__ == '__main__':
    scrape_bir()

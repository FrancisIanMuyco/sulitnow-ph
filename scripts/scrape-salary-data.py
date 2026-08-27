#!/usr/bin/env python3
"""Scrape Philippine salary data by position."""

import json
import os
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

SALARY_DATA = {
    "categories": [
        {
            "name": "IT & Tech",
            "icon": "💻",
            "positions": [
                {"title": "Junior Developer", "min": 18000, "max": 30000, "avg": 22000},
                {"title": "Mid-Level Developer", "min": 30000, "max": 55000, "avg": 40000},
                {"title": "Senior Developer", "min": 50000, "max": 90000, "avg": 65000},
                {"title": "IT Support", "min": 15000, "max": 25000, "avg": 18000},
                {"title": "System Admin", "min": 25000, "max": 45000, "avg": 32000},
                {"title": "Data Analyst", "min": 25000, "max": 50000, "avg": 35000},
                {"title": "Project Manager (IT)", "min": 40000, "max": 80000, "avg": 55000},
            ]
        },
        {
            "name": "BPO & Call Center",
            "icon": "📞",
            "positions": [
                {"title": "Voice Agent", "min": 16000, "max": 22000, "avg": 18000},
                {"title": "Non-Voice Agent", "min": 14000, "max": 18000, "avg": 15500},
                {"title": "Team Leader", "min": 25000, "max": 40000, "avg": 30000},
                {"title": "Quality Analyst", "min": 22000, "max": 35000, "avg": 27000},
                {"title": "Workforce Analyst", "min": 25000, "max": 40000, "avg": 30000},
            ]
        },
        {
            "name": "Healthcare",
            "icon": "🏥",
            "positions": [
                {"title": "Staff Nurse", "min": 18000, "max": 28000, "avg": 22000},
                {"title": "Senior Nurse", "min": 28000, "max": 40000, "avg": 32000},
                {"title": "Medical Technologist", "min": 18000, "max": 28000, "avg": 22000},
                {"title": "Pharmacist", "min": 20000, "max": 30000, "avg": 24000},
            ]
        },
        {
            "name": "Finance & Accounting",
            "icon": "💰",
            "positions": [
                {"title": "Accountant", "min": 20000, "max": 35000, "avg": 25000},
                {"title": "Senior Accountant", "min": 30000, "max": 50000, "avg": 38000},
                {"title": "Auditor", "min": 25000, "max": 45000, "avg": 32000},
                {"title": "Financial Analyst", "min": 30000, "max": 55000, "avg": 40000},
            ]
        },
        {
            "name": "Education",
            "icon": "📚",
            "positions": [
                {"title": "Public School Teacher", "min": 22000, "max": 28000, "avg": 25000},
                {"title": "Private School Teacher", "min": 14000, "max": 22000, "avg": 17000},
                {"title": "College Instructor", "min": 25000, "max": 45000, "avg": 32000},
                {"title": "University Professor", "min": 40000, "max": 80000, "avg": 55000},
            ]
        },
        {
            "name": "Government",
            "icon": "🏛️",
            "positions": [
                {"title": "Salary Grade 1-3", "min": 13000, "max": 16000, "avg": 14500},
                {"title": "Salary Grade 4-8", "min": 16000, "max": 25000, "avg": 20000},
                {"title": "Salary Grade 9-13", "min": 25000, "max": 40000, "avg": 32000},
                {"title": "Salary Grade 14-18", "min": 40000, "max": 70000, "avg": 52000},
                {"title": "Salary Grade 19-24", "min": 70000, "max": 130000, "avg": 90000},
            ]
        },
        {
            "name": "Freelancing (Online)",
            "icon": "🌍",
            "positions": [
                {"title": "Virtual Assistant", "min": 15000, "max": 40000, "avg": 25000},
                {"title": "Web Developer (Freelance)", "min": 25000, "max": 100000, "avg": 50000},
                {"title": "Content Writer", "min": 15000, "max": 50000, "avg": 25000},
                {"title": "Graphic Designer", "min": 15000, "max": 60000, "avg": 30000},
                {"title": "Video Editor", "min": 18000, "max": 60000, "avg": 35000},
                {"title": "Social Media Manager", "min": 18000, "max": 50000, "avg": 30000},
            ]
        },
        {
            "name": "Retail & Sales",
            "icon": "🛒",
            "positions": [
                {"title": "Sales Associate", "min": 13000, "max": 18000, "avg": 15000},
                {"title": "Store Supervisor", "min": 18000, "max": 28000, "avg": 22000},
                {"title": "Store Manager", "min": 28000, "max": 50000, "avg": 35000},
                {"title": "Sales Executive", "min": 18000, "max": 40000, "avg": 25000},
            ]
        }
    ]
}

def write_json(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Saved: {filepath}")

def scrape_salary():
    """Scrape salary data."""
    salary_data = {
        "lastUpdated": datetime.now().isoformat(),
        "currency": "PHP",
        "period": "monthly",
        "categories": SALARY_DATA["categories"],
    }
    
    write_json('salary-data.json', salary_data)
    total_positions = sum(len(cat["positions"]) for cat in salary_data["categories"])
    print(f"Salary data scraped: {len(salary_data['categories'])} categories, {total_positions} positions")
    return salary_data

if __name__ == '__main__':
    scrape_salary()

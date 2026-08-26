#!/usr/bin/env python3
"""
SulitNow PH — Free Courses Scraper
Scrapes free courses from Coursera, edX, Khan Academy, and more.
"""

import json
import os
import re
import random
from datetime import datetime

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

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size = os.path.getsize(path)
    print(f"  ✅ {filename} ({size:,} bytes)")

def scrape_coursera():
    """Scrape free courses from Coursera."""
    from playwright.sync_api import sync_playwright
    
    courses = []
    print("\n🎓 Scraping Coursera free courses...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://www.coursera.org/search?query=free&productTypeDescription=Courses&price=Free", 
                      timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            items = page.query_selector_all('[class*="product-card"], [data-testid="product-card"], .cds-ProductCard-gridCard')
            
            for item in items[:25]:
                try:
                    text = item.inner_text()
                    lines = [l.strip() for l in text.split('\n') if l.strip()]
                    
                    if len(lines) >= 2:
                        title = lines[0][:100]
                        partner = lines[1][:60] if len(lines) > 1 else ""
                        
                        rating_match = re.search(r'([\d.]+)\s*\(', text)
                        students_match = re.search(r'([\d,]+)\s*(?: learners?|students?)', text, re.IGNORECASE)
                        
                        courses.append({
                            "platform": "Coursera",
                            "title": title,
                            "provider": partner,
                            "rating": float(rating_match.group(1)) if rating_match else None,
                            "students": students_match.group(1) if students_match else None,
                            "url": "https://www.coursera.org/search?query=free&price=Free",
                            "category": categorize_course(title),
                            "level": extract_level(text),
                            "duration": extract_duration(text),
                            "certificate": "certificate" in text.lower(),
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(courses)} Coursera courses")
        except Exception as e:
            print(f"  ⚠️ Coursera error: {e}")
        
        browser.close()
    
    return courses

def scrape_edx():
    """Scrape free courses from edX."""
    from playwright.sync_api import sync_playwright
    
    courses = []
    print("\n🎓 Scraping edX free courses...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://www.edx.org/search?price=Free&tab=course", 
                      timeout=25000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            items = page.query_selector_all('[class*="product-card"], [class*="course-card"], [data-testid*="course"]')
            
            for item in items[:25]:
                try:
                    text = item.inner_text()
                    lines = [l.strip() for l in text.split('\n') if l.strip()]
                    
                    if len(lines) >= 2:
                        title = lines[0][:100]
                        provider = lines[1][:60] if len(lines) > 1 else ""
                        
                        courses.append({
                            "platform": "edX",
                            "title": title,
                            "provider": provider,
                            "rating": None,
                            "students": None,
                            "url": "https://www.edx.org/search?price=Free&tab=course",
                            "category": categorize_course(title),
                            "level": extract_level(text),
                            "duration": extract_duration(text),
                            "certificate": "certificate" in text.lower(),
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(courses)} edX courses")
        except Exception as e:
            print(f"  ⚠️ edX error: {e}")
        
        browser.close()
    
    return courses

def scrape_khan_academy():
    """Scrape courses from Khan Academy."""
    from playwright.sync_api import sync_playwright
    
    courses = []
    print("\n🎓 Scraping Khan Academy courses...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://www.khanacademy.org", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            
            # Get subject links
            subjects = [
                ("Math", "https://www.khanacademy.org/math"),
                ("Science", "https://www.khanacademy.org/science"),
                ("Computing", "https://www.khanacademy.org/computing"),
                ("Economics", "https://www.khanacademy.org/economics-finance-domain"),
                ("Arts & Humanities", "https://www.khanacademy.org/humanities"),
            ]
            
            for subject_name, url in subjects:
                try:
                    page.goto(url, timeout=15000, wait_until="domcontentloaded")
                    page.wait_for_timeout(1500)
                    
                    links = page.query_selector_all('a[href*="/a/"]')
                    for link in links[:8]:
                        try:
                            title = link.inner_text().strip()
                            href = link.get_attribute('href')
                            if title and len(title) > 3 and len(title) < 80:
                                full_url = f"https://www.khanacademy.org{href}" if href and href.startswith('/') else href
                                courses.append({
                                    "platform": "Khan Academy",
                                    "title": title,
                                    "provider": "Khan Academy",
                                    "rating": None,
                                    "students": None,
                                    "url": full_url or url,
                                    "category": categorize_course(subject_name),
                                    "level": "All Levels",
                                    "duration": "Self-paced",
                                    "certificate": False,
                                })
                        except Exception:
                            continue
                except Exception:
                    continue
            
            print(f"  Found {len(courses)} Khan Academy courses")
        except Exception as e:
            print(f"  ⚠️ Khan Academy error: {e}")
        
        browser.close()
    
    return courses

def scrape_freeCodeCamp():
    """Scrape freeCodeCamp curriculum."""
    from playwright.sync_api import sync_playwright
    
    courses = []
    print("\n🎓 Scraping freeCodeCamp courses...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = browser.new_page()
        
        try:
            page.goto("https://www.freecodecamp.org/learn", timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            
            items = page.query_selector_all('a[class*="block"], [class*="certification"], a[href*="/learn/"]')
            
            for item in items[:20]:
                try:
                    text = item.inner_text().strip()
                    href = item.get_attribute('href')
                    if text and len(text) > 5 and len(text) < 100:
                        full_url = f"https://www.freecodecamp.org{href}" if href and href.startswith('/') else href
                        courses.append({
                            "platform": "freeCodeCamp",
                            "title": text,
                            "provider": "freeCodeCamp",
                            "rating": None,
                            "students": None,
                            "url": full_url or "https://www.freecodecamp.org/learn",
                            "category": categorize_course(text),
                            "level": "Beginner",
                            "duration": "Self-paced",
                            "certificate": True,
                        })
                except Exception:
                    continue
            
            print(f"  Found {len(courses)} freeCodeCamp courses")
        except Exception as e:
            print(f"  ⚠️ freeCodeCamp error: {e}")
        
        browser.close()
    
    return courses

def scrape_youtube_courses():
    """Scrape popular free course playlists from YouTube."""
    from playwright.sync_api import sync_playwright
    
    courses = []
    print("\n🎓 Scraping YouTube free courses...")
    
    playlists = [
        ("Python Tutorial for Beginners", "Programming", "https://www.youtube.com/watch?v=rfscVS0vtbw", "freeCodeCamp", "14 hours"),
        ("JavaScript Full Course", "Programming", "https://www.youtube.com/watch?v=W6NZfCO5SIk", "freeCodeCamp", "8 hours"),
        ("HTML & CSS Full Course", "Web Development", "https://www.youtube.com/watch?v=UB1O30fR-EE", "freeCodeCamp", "11 hours"),
        ("React Tutorial for Beginners", "Web Development", "https://www.youtube.com/watch?v=Ke90Tje7VS0", "Programming with Mosh", "6 hours"),
        ("Node.js Tutorial", "Web Development", "https://www.youtube.com/watch?v=TlB_eWDSMt4", "Traversy Media", "3 hours"),
        ("SQL Tutorial Full Database Course", "Data Science", "https://www.youtube.com/watch?v=HXV3zeQKqGY", "freeCodeCamp", "4 hours"),
        ("Excel Tutorial for Beginners", "Business", "https://www.youtube.com/watch?v=Vl0H7B57v-c", "freeCodeCamp", "3 hours"),
        ("AWS Certified Cloud Practitioner", "Cloud Computing", "https://www.youtube.com/watch?v=SOTamWNgDKc", "freeCodeCamp", "13 hours"),
        ("Figma Tutorial for Beginners", "Design", "https://www.youtube.com/watch?v=FTFaQWZBqQY", "freeCodeCamp", "3 hours"),
        ("Data Science Full Course", "Data Science", "https://www.youtube.com/watch?v=GwIo3gDZCVQ", "freeCodeCamp", "12 hours"),
        ("Digital Marketing Full Course", "Marketing", "https://www.youtube.com/watch?v=lH7uORCzI-c", "Simplilearn", "11 hours"),
        ("Cyber Security Full Course", "IT & Security", "https://www.youtube.com/watch?v=inWWhl5sEAQ", "freeCodeCamp", "8 hours"),
        ("C++ Tutorial for Beginners", "Programming", "https://www.youtube.com/watch?v=87SH2Cn0s9A", "Programming with Mosh", "6 hours"),
        ("Java Full Course", "Programming", "https://www.youtube.com/watch?v=eIrMbAQSUl4", "Bro Code", "12 hours"),
        ("UI/UX Design Tutorial", "Design", "https://www.youtube.com/watch?v=5CxXhyhT6Fc", "freeCodeCamp", "3 hours"),
    ]
    
    for title, category, url, channel, duration in playlists:
        courses.append({
            "platform": "YouTube",
            "title": title,
            "provider": channel,
            "rating": None,
            "students": None,
            "url": url,
            "category": categorize_course(category),
            "level": "Beginner",
            "duration": duration,
            "certificate": False,
        })
    
    print(f"  Added {len(courses)} YouTube courses")
    return courses

def categorize_course(text):
    """Auto-categorize a course based on title text."""
    text_lower = text.lower()
    
    if any(w in text_lower for w in ['python', 'java', 'c++', 'javascript', 'coding', 'programming', 'software', 'developer', 'git', 'react', 'angular', 'vue', 'node']):
        return 'Programming'
    elif any(w in text_lower for w in ['data', 'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'statistics', 'analytics']):
        return 'Data Science & AI'
    elif any(w in text_lower for w in ['design', 'ui', 'ux', 'figma', 'photoshop', 'illustrator', 'canva', 'graphic']):
        return 'Design'
    elif any(w in text_lower for w in ['business', 'marketing', 'entrepreneur', 'startup', 'management', 'leadership', 'finance', 'accounting', 'excel']):
        return 'Business'
    elif any(w in text_lower for w in ['web', 'html', 'css', 'frontend', 'backend', 'full stack', 'website']):
        return 'Web Development'
    elif any(w in text_lower for w in ['math', 'algebra', 'calculus', 'geometry', 'statistics']):
        return 'Math'
    elif any(w in text_lower for w in ['science', 'physics', 'chemistry', 'biology', 'earth']):
        return 'Science'
    elif any(w in text_lower for w in ['security', 'cyber', 'network', 'cloud', 'aws', 'azure']):
        return 'IT & Security'
    elif any(w in text_lower for w in ['language', 'english', 'spanish', 'writing', 'communication']):
        return 'Languages'
    elif any(w in text_lower for w in ['humanities', 'history', 'philosophy', 'art', 'music']):
        return 'Humanities'
    else:
        return 'Other'

def extract_level(text):
    """Extract course level from text."""
    text_lower = text.lower()
    if 'beginner' in text_lower:
        return 'Beginner'
    elif 'intermediate' in text_lower:
        return 'Intermediate'
    elif 'advanced' in text_lower:
        return 'Advanced'
    return 'All Levels'

def extract_duration(text):
    """Extract duration from text."""
    duration_match = re.search(r'(\d+\.?\d*)\s*(?:hours?|hrs?|weeks?|months?)', text, re.IGNORECASE)
    if duration_match:
        return duration_match.group(0)
    return 'Self-paced'

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 50)
    print("📚 SulitNow PH — Free Courses Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    all_courses = []
    all_courses += scrape_coursera()
    all_courses += scrape_edx()
    all_courses += scrape_khan_academy()
    all_courses += scrape_freeCodeCamp()
    all_courses += scrape_youtube_courses()
    
    # Deduplicate by title
    seen = set()
    unique_courses = []
    for c in all_courses:
        key = c['title'].lower().strip()[:50]
        if key not in seen:
            seen.add(key)
            unique_courses.append(c)
    
    # Sort by platform then category
    unique_courses.sort(key=lambda x: (x['platform'], x['category']))
    
    # Count by category
    categories = {}
    for c in unique_courses:
        cat = c['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    write_json("free-courses.json", {
        "lastUpdated": datetime.now().isoformat(),
        "courses": unique_courses,
        "categories": [{"name": k, "count": v} for k, v in sorted(categories.items(), key=lambda x: -x[1])],
        "stats": {
            "totalCourses": len(unique_courses),
            "platforms": len(set(c['platform'] for c in unique_courses)),
            "totalCategories": len(categories),
        }
    })
    
    elapsed = (datetime.now() - start).total_seconds()
    print(f"\n{'=' * 50}")
    print(f"✅ Free courses scraping complete in {elapsed:.1f}s")
    print(f"   📚 {len(unique_courses)} courses | {len(categories)} categories")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"      • {cat}: {count}")
    print(f"{'=' * 50}")

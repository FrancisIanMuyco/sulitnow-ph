#!/usr/bin/env python3
"""
SulitNow PH — Free Courses Deep Scraper
Scrapes detailed course data from Coursera, edX, freeCodeCamp.
Merges with existing curated data (Khan Academy, YouTube).
Stores everything locally on our site.
"""

import json
import os
import re
import random
from datetime import datetime
from playwright.sync_api import sync_playwright

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
    return random.choice(PROXIES)

def load_existing():
    """Load existing free-courses.json to preserve curated data."""
    path = os.path.join(OUTPUT_DIR, 'free-courses.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return {"courses": [], "categories": [], "platforms": [], "stats": {}}

def write_json(filename, data):
    path = os.path.join(OUTPUT_DIR, filename)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    size = os.path.getsize(path)
    print(f"  ✅ {filename} ({size:,} bytes)")

def scrape_coursera(browser):
    """Deep scrape Coursera free courses."""
    courses = []
    print("\n🎓 [Coursera] Scraping free courses...")
    
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    try:
        page.goto("https://www.coursera.org/search?query=&productTypeDescription=Courses&price=Free&sortBy=BEST_MATCH", 
                  timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        
        # Scroll to load more
        for _ in range(3):
            page.evaluate("window.scrollBy(0, 1500)")
            page.wait_for_timeout(2000)
        
        cards = page.query_selector_all('[data-testid="product-card"], .cds-ProductCard-gridCard, [class*="product-card"]')
        print(f"  Found {len(cards)} cards on page")
        
        for card in cards[:40]:
            try:
                text = card.inner_text()
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                
                link_el = card.query_selector('a[href*="/learn/"], a[href*="/specializations/"]')
                href = link_el.get_attribute('href') if link_el else None
                url = f"https://www.coursera.org{href}" if href and href.startswith('/') else (href or "https://www.coursera.org")
                
                title = ""
                for line in lines:
                    if len(line) > 10 and line not in ['New', 'Free', 'Bestseller', 'Popular', 'Part of Google', 'Instructor:', 'Level:', 'Duration:']:
                        title = line[:120]
                        break
                
                if not title or len(title) < 5:
                    continue
                
                provider = ""
                for line in lines:
                    if any(p in line for p in ['Google', 'IBM', 'Meta', 'Amazon', 'Microsoft', 'Stanford', 'Yale', 'Johns Hopkins', 'Duke', 'University', 'DeepLearning.AI', 'Offered by']):
                        provider = line.replace('Offered by ', '').replace('Instructor: ', '').strip()[:60]
                        break
                
                rating = None
                rating_match = re.search(r'(\d\.\d)\s*\(', text)
                if rating_match:
                    rating = float(rating_match.group(1))
                
                students = None
                stud_match = re.search(r'([\d,.]+[KMB]?)\s*(?:learners?|students?|enrolled)', text, re.IGNORECASE)
                if stud_match:
                    students = stud_match.group(1)
                
                level = "All Levels"
                for l in lines:
                    ll = l.lower()
                    if 'beginner' in ll: level = "Beginner"
                    elif 'intermediate' in ll: level = "Intermediate"
                    elif 'advanced' in ll: level = "Advanced"
                
                duration = "Self-paced"
                dur_match = re.search(r'(\d+\s*(?:weeks?|months?|hours?|days?))', text, re.IGNORECASE)
                if dur_match:
                    duration = dur_match.group(1).strip()
                
                skills = []
                for i, line in enumerate(lines):
                    if any(kw in line.lower() for kw in ['skills:', "you'll learn", 'what you']):
                        for sl in lines[i+1:i+6]:
                            if len(sl) > 3 and len(sl) < 50 and sl not in ['Show more', 'Show less', 'Enroll']:
                                skills.append(sl)
                
                has_cert = 'certificate' in text.lower() or 'professional certificate' in text.lower()
                
                courses.append({
                    "id": f"coursera-{len(courses)}",
                    "platform": "Coursera",
                    "title": title,
                    "provider": provider or "Coursera",
                    "description": f"Free course on Coursera by {provider or 'Coursera'}. {duration} duration. {level} level.",
                    "rating": rating,
                    "students": students,
                    "url": url,
                    "category": categorize(title + " " + provider),
                    "level": level,
                    "duration": duration,
                    "certificate": has_cert,
                    "skills": skills[:5],
                    "free": True,
                    "modules": [],
                    "lastVerified": datetime.now().isoformat(),
                })
                
            except Exception:
                continue
        
        print(f"  ✅ Scraped {len(courses)} Coursera courses")
        
    except Exception as e:
        print(f"  ⚠️ Coursera error: {e}")
    
    ctx.close()
    return courses

def scrape_edx(browser):
    """Scrape edX free courses using text-based parsing."""
    courses = []
    print("\n🎓 [edX] Scraping free courses...")
    
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    try:
        page.goto("https://www.edx.org/search?price=Free&tab=course", timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(5000)
        
        # Scroll to load more courses
        for _ in range(8):
            page.evaluate("window.scrollBy(0, 1500)")
            page.wait_for_timeout(2000)
        
        body = page.inner_text("body")
        lines = [l.strip() for l in body.split('\n') if l.strip()]
        
        # Parse courses from text: pattern is Title, Provider, Duration, Level
        i = 0
        while i < len(lines) - 2:
            line = lines[i]
            next_line = lines[i+1] if i+1 < len(lines) else ''
            
            # Skip navigation/promo text
            if any(skip in line.lower() for skip in [
                'register', 'save', 'code', 'close', 'filter', 'result',
                'back to', 'achievement', 'professional cert', 'benefit',
                'financial', 'bachelor', 'master', 'online mba',
                'edx for business', 'get back', 'all filters',
                'learning type', 'course language', 'availability',
            ]):
                i += 1
                continue
            
            # Check if next line looks like a university/provider
            if re.search(r'(University|Institute|College|School|Harvard|MIT|Stanford|IBM|Google|Microsoft|Georgia)', next_line, re.IGNORECASE):
                if len(line) > 10 and len(line) < 120:
                    duration = ""
                    level = ""
                    for j in range(i+2, min(i+5, len(lines))):
                        if re.search(r'\d+\s*(week|month|hour|day)', lines[j], re.IGNORECASE):
                            duration = lines[j]
                        if re.search(r'(beginner|intermediate|advanced|introductory)', lines[j], re.IGNORECASE):
                            level = lines[j]
                    
                    # Create slug for URL
                    slug = re.sub(r'[^a-z0-9]+', '-', line.lower()).strip('-')
                    provider_slug = re.sub(r'[^a-z0-9]+', '-', next_line.lower()).strip('-')
                    url = f"https://www.edx.org/learn/{slug}/{provider_slug}-{slug}"
                    
                    # Normalize level
                    norm_level = "All Levels"
                    if level:
                        ll = level.lower()
                        if 'beginner' in ll or 'introductory' in ll or 'intro' in ll:
                            norm_level = "Beginner"
                        elif 'intermediate' in ll:
                            norm_level = "Intermediate"
                        elif 'advanced' in ll:
                            norm_level = "Advanced"
                    
                    courses.append({
                        "id": f"edx-{len(courses)}",
                        "platform": "edX",
                        "title": line,
                        "provider": next_line,
                        "description": f"Free course on edX by {next_line}. {duration} duration.",
                        "rating": None,
                        "students": None,
                        "url": url,
                        "category": categorize(line + " " + next_line),
                        "level": norm_level,
                        "duration": duration or "Self-paced",
                        "certificate": True,
                        "skills": extract_skills_from_title(line),
                        "free": True,
                        "modules": [],
                        "lastVerified": datetime.now().isoformat(),
                    })
            i += 1
        
        print(f"  ✅ Scraped {len(courses)} edX courses")
    except Exception as e:
        print(f"  ⚠️ edX error: {e}")
    
    ctx.close()
    return courses

def scrape_freecodecamp(browser):
    """Deep scrape freeCodeCamp curriculum."""
    courses = []
    print("\n🎓 [freeCodeCamp] Scraping curriculum...")
    
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    try:
        page.goto("https://www.freecodecamp.org/learn", timeout=25000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        
        links = page.query_selector_all('a[href*="/learn/"]')
        
        for link in links[:30]:
            try:
                title = link.inner_text().strip()
                href = link.get_attribute('href')
                
                if not title or len(title) < 5 or len(title) > 100:
                    continue
                if title in ['Show all', 'View all', 'See more']:
                    continue
                    
                full_url = f"https://www.freecodecamp.org{href}" if href and href.startswith('/') else href
                
                courses.append({
                    "id": f"fcc-{len(courses)}",
                    "platform": "freeCodeCamp",
                    "title": title,
                    "provider": "freeCodeCamp",
                    "description": f"Free coding certification from freeCodeCamp. Hands-on projects and real-world curriculum.",
                    "rating": None,
                    "students": None,
                    "url": full_url or "https://www.freecodecamp.org/learn",
                    "category": categorize(title),
                    "level": "Beginner",
                    "duration": "300+ Hours",
                    "certificate": True,
                    "skills": extract_skills_from_title(title),
                    "free": True,
                    "modules": [],
                    "lastVerified": datetime.now().isoformat(),
                })
            except:
                continue
        
        print(f"  ✅ Scraped {len(courses)} freeCodeCamp courses")
    except Exception as e:
        print(f"  ⚠️ freeCodeCamp error: {e}")
    
    ctx.close()
    return courses

def categorize(text):
    """Auto-categorize based on text content."""
    t = text.lower()
    if any(w in t for w in ['python', 'java', 'c++', 'javascript', 'coding', 'programming', 'software', 'developer', 'git', 'react', 'angular', 'vue', 'node', 'typescript', 'swift', 'kotlin', 'rust', 'go ', 'ruby', 'php', 'django', 'flask', 'spring', 'scratch', 'cybersecurity', 'cyber']):
        return 'Programming'
    elif any(w in t for w in ['data', 'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'statistics', 'analytics', 'neural', 'nlp', 'pandas', 'numpy']):
        return 'Data Science & AI'
    elif any(w in t for w in ['design', 'ui', 'ux', 'figma', 'photoshop', 'illustrator', 'canva', 'graphic', 'sketch', 'adobe']):
        return 'Design'
    elif any(w in t for w in ['business', 'marketing', 'entrepreneur', 'startup', 'management', 'leadership', 'finance', 'accounting', 'excel', 'project management', 'product', 'architecture']):
        return 'Business'
    elif any(w in t for w in ['web', 'html', 'css', 'frontend', 'backend', 'full stack', 'website', 'responsive', 'bootstrap', 'tailwind', 'wordpress']):
        return 'Web Development'
    elif any(w in t for w in ['math', 'algebra', 'calculus', 'geometry', 'statistics', 'probability', 'trigonometry']):
        return 'Math'
    elif any(w in t for w in ['science', 'physics', 'chemistry', 'biology', 'earth', 'astronomy', 'neuroscience']):
        return 'Science'
    elif any(w in t for w in ['security', 'cyber', 'network', 'cloud', 'aws', 'azure', 'devops', 'docker', 'kubernetes', 'linux', 'database', 'sql']):
        return 'IT & Security'
    elif any(w in t for w in ['language', 'english', 'spanish', 'writing', 'communication', 'grammar', 'rhetoric', 'argument']):
        return 'Languages'
    elif any(w in t for w in ['humanities', 'history', 'philosophy', 'art history', 'music', 'literature', 'contract law', 'leadership']):
        return 'Humanities'
    elif any(w in t for w in ['test prep', 'sat', 'gre', 'gmat', 'toefl', 'ielts']):
        return 'Test Prep'
    return 'Other'

def extract_skills_from_title(title):
    """Extract potential skills from course title."""
    skills = []
    t = title.lower()
    skill_map = {
        'python': 'Python', 'javascript': 'JavaScript', 'java': 'Java', 'c++': 'C++',
        'react': 'React', 'node': 'Node.js', 'html': 'HTML', 'css': 'CSS',
        'sql': 'SQL', 'machine learning': 'Machine Learning', 'data science': 'Data Science',
        'web': 'Web Development', 'api': 'APIs', 'git': 'Git', 'linux': 'Linux',
        'docker': 'Docker', 'aws': 'AWS', 'azure': 'Azure', 'figma': 'Figma',
        'photoshop': 'Photoshop', 'excel': 'Excel', 'tableau': 'Tableau',
        'typescript': 'TypeScript', 'vue': 'Vue.js', 'angular': 'Angular',
        'django': 'Django', 'flask': 'Flask', 'swift': 'Swift', 'kotlin': 'Kotlin',
        'rust': 'Rust', 'ruby': 'Ruby', 'php': 'PHP', 'cybersecurity': 'Cybersecurity',
        'neuroscience': 'Neuroscience', 'algorithms': 'Algorithms',
        'rhetoric': 'Rhetoric', 'writing': 'Writing',
    }
    for keyword, skill in skill_map.items():
        if keyword in t:
            skills.append(skill)
    return skills[:5]

def cat_icon(cat):
    icons = {
        'Programming': '💻', 'Web Development': '🌐', 'Data Science & AI': '📊',
        'IT & Security': '🔒', 'Design': '🎨', 'Business': '💼',
        'Math': '🔢', 'Science': '🔬', 'Languages': '🗣️',
        'Humanities': '📚', 'Test Prep': '📝', 'Other': '📖',
    }
    return icons.get(cat, '📚')

def merge_courses(existing_courses, scraped_courses):
    """Merge scraped courses with existing, avoiding duplicates by title similarity."""
    existing_keys = set()
    for c in existing_courses:
        key = c['title'].lower().strip()[:50]
        existing_keys.add(key)
    
    merged = list(existing_courses)
    added = 0
    for c in scraped_courses:
        key = c['title'].lower().strip()[:50]
        # Also check URL match
        url_match = any(c.get('url', '') == ex.get('url', '') for ex in existing_courses if ex.get('url'))
        if key not in existing_keys and not url_match:
            existing_keys.add(key)
            merged.append(c)
            added += 1
    
    print(f"  📊 Merged: {len(existing_courses)} existing + {added} new = {len(merged)} total")
    return merged

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 60)
    print("📚 SulitNow PH — Free Courses Deep Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Load existing curated data
    existing = load_existing()
    existing_courses = existing.get("courses", [])
    print(f"\n📦 Loaded {len(existing_courses)} existing curated courses")
    
    all_scraped = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
        
        all_scraped += scrape_coursera(browser)
        all_scraped += scrape_edx(browser)
        all_scraped += scrape_freecodecamp(browser)
        # Khan Academy & YouTube kept from curated data (SPA/dynamic loading issues)
        
        browser.close()
    
    # Merge scraped with existing
    merged = merge_courses(existing_courses, all_scraped)
    
    # Re-assign IDs
    for i, c in enumerate(merged):
        prefix = c['platform'].lower().replace(' ', '')[:3]
        c['id'] = f"{prefix}-{i+1:03d}"
    
    # Sort by platform, then category, then title
    merged.sort(key=lambda x: (x['platform'], x['category'], x['title']))
    
    # Recalculate stats
    categories = {}
    platforms = {}
    for c in merged:
        cat = c['category']
        plat = c['platform']
        categories[cat] = categories.get(cat, 0) + 1
        platforms[plat] = platforms.get(plat, 0) + 1
    
    output = {
        "lastUpdated": datetime.now().isoformat(),
        "courses": merged,
        "categories": [{"name": k, "count": v, "icon": cat_icon(k)} for k, v in sorted(categories.items(), key=lambda x: -x[1])],
        "platforms": [{"name": k, "count": v} for k, v in sorted(platforms.items(), key=lambda x: -x[1])],
        "stats": {
            "totalCourses": len(merged),
            "platforms": len(platforms),
            "totalCategories": len(categories),
            "withCertificate": sum(1 for c in merged if c.get('certificate')),
        }
    }
    
    write_json("free-courses.json", output)
    
    elapsed = (datetime.now() - start).total_seconds()
    print(f"\n{'=' * 60}")
    print(f"✅ Complete in {elapsed:.1f}s")
    print(f"   📚 {len(merged)} courses | {len(platforms)} platforms | {len(categories)} categories")
    for plat, count in sorted(platforms.items(), key=lambda x: -x[1]):
        print(f"      • {plat}: {count}")
    print(f"{'=' * 60}")

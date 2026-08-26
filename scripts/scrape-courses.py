#!/usr/bin/env python3
"""
SulitNow PH — Free Courses Deep Scraper
Scrapes detailed course data from Coursera, edX, Khan Academy, freeCodeCamp, YouTube.
Stores everything locally on our site.
"""

import json
import os
import re
import time
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
    import random
    return random.choice(PROXIES)

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
        # Search free courses
        page.goto("https://www.coursera.org/search?query=&productTypeDescription=Courses&price=Free&sortBy=BEST_MATCH", 
                  timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        
        # Get all course cards
        cards = page.query_selector_all('[data-testid="product-card"], .cds-ProductCard-gridCard, [class*="product-card"]')
        print(f"  Found {len(cards)} cards on page")
        
        for card in cards[:30]:
            try:
                text = card.inner_text()
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                
                # Extract link
                link_el = card.query_selector('a[href*="/learn/"], a[href*="/specializations/"]')
                href = link_el.get_attribute('href') if link_el else None
                url = f"https://www.coursera.org{href}" if href and href.startswith('/') else (href or "https://www.coursera.org")
                
                # Parse title - usually first meaningful line
                title = ""
                for line in lines:
                    if len(line) > 10 and line not in ['New', 'Free', 'Bestseller', 'Popular', 'Part of Google', 'Instructor:', 'Level:', 'Duration:']:
                        title = line[:120]
                        break
                
                if not title or len(title) < 5:
                    continue
                
                # Extract provider
                provider = ""
                for line in lines:
                    if any(p in line for p in ['Google', 'IBM', 'Meta', 'Amazon', 'Microsoft', 'Stanford', 'Yale', 'Johns Hopkins', 'Duke', 'University', 'DeepLearning.AI', 'Offered by']):
                        provider = line.replace('Offered by ', '').replace('Instructor: ', '').strip()[:60]
                        break
                
                # Extract rating
                rating = None
                rating_match = re.search(r'(\d\.\d)\s*\(', text)
                if rating_match:
                    rating = float(rating_match.group(1))
                
                # Extract students count
                students = None
                stud_match = re.search(r'([\d,.]+[KMB]?)\s*(?:learners?|students?|enrolled)', text, re.IGNORECASE)
                if stud_match:
                    students = stud_match.group(1)
                
                # Extract level
                level = "All Levels"
                for l in lines:
                    ll = l.lower()
                    if 'beginner' in ll: level = "Beginner"
                    elif 'intermediate' in ll: level = "Intermediate"
                    elif 'advanced' in ll: level = "Advanced"
                
                # Extract duration
                duration = "Self-paced"
                dur_match = re.search(r'(\d+\s*(?:weeks?|months?|hours?|days?))', text, re.IGNORECASE)
                if dur_match:
                    duration = dur_match.group(1).strip()
                
                # Extract skills/tags
                skills = []
                for line in lines:
                    if any(kw in line.lower() for kw in ['skills:', 'you\'ll learn', 'what you']):
                        # Next lines are likely skills
                        idx = lines.index(line)
                        for sl in lines[idx+1:idx+6]:
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
                
            except Exception as e:
                continue
        
        print(f"  ✅ Scraped {len(courses)} Coursera courses")
        
    except Exception as e:
        print(f"  ⚠️ Coursera error: {e}")
    
    ctx.close()
    return courses

def scrape_edx(browser):
    """Deep scrape edX free courses."""
    courses = []
    print("\n🎓 [edX] Scraping free courses...")
    
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    try:
        page.goto("https://www.edx.org/search?price=Free&tab=course", timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(4000)
        
        cards = page.query_selector_all('[class*="product-card"], [class*="course-card"], [data-testid*="course"], [class*="search-result"]')
        print(f"  Found {len(cards)} cards on page")
        
        for card in cards[:30]:
            try:
                text = card.inner_text()
                lines = [l.strip() for l in text.split('\n') if l.strip()]
                
                link_el = card.query_selector('a[href*="/course"]')
                href = link_el.get_attribute('href') if link_el else None
                url = f"https://www.edx.org{href}" if href and href.startswith('/') else (href or "https://www.edx.org")
                
                title = ""
                for line in lines:
                    if len(line) > 10 and not any(x in line.lower() for x in ['free', 'new', 'enroll', 'view']):
                        title = line[:120]
                        break
                
                if not title or len(title) < 5:
                    continue
                
                provider = ""
                for line in lines:
                    if any(p in line.lower() for p in ['university', 'institute', 'harvard', 'mit', 'columbia', 'michigan', 'stanford', 'georgia', 'boston', 'offer']):
                        provider = line.replace('Offered by ', '').strip()[:60]
                        break
                
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
                
                courses.append({
                    "id": f"edx-{len(courses)}",
                    "platform": "edX",
                    "title": title,
                    "provider": provider or "edX",
                    "description": f"Free course on edX by {provider or 'edX'}. {duration} duration.",
                    "rating": None,
                    "students": None,
                    "url": url,
                    "category": categorize(title + " " + provider),
                    "level": level,
                    "duration": duration,
                    "certificate": True,
                    "skills": [],
                    "free": True,
                    "modules": [],
                    "lastVerified": datetime.now().isoformat(),
                })
            except:
                continue
        
        print(f"  ✅ Scraped {len(courses)} edX courses")
    except Exception as e:
        print(f"  ⚠️ edX error: {e}")
    
    ctx.close()
    return courses

def scrape_khan_academy(browser):
    """Deep scrape Khan Academy."""
    courses = []
    print("\n🎓 [Khan Academy] Scraping courses...")
    
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    subjects = [
        ("Math", "https://www.khanacademy.org/math", "Math"),
        ("Science", "https://www.khanacademy.org/science", "Science"),
        ("Computing", "https://www.khanacademy.org/computing", "Programming"),
        ("Economics", "https://www.khanacademy.org/economics-finance-domain", "Business"),
        ("Arts & Humanities", "https://www.khanacademy.org/humanities", "Humanities"),
        ("Test Prep", "https://www.khanacademy.org/test-prep", "Test Prep"),
    ]
    
    try:
        for subject_name, url, category in subjects:
            try:
                page.goto(url, timeout=20000, wait_until="domcontentloaded")
                page.wait_for_timeout(2000)
                
                # Get topic links
                links = page.query_selector_all('a[href*="/a/"]')
                for link in links[:12]:
                    try:
                        title = link.inner_text().strip()
                        href = link.get_attribute('href')
                        if title and 5 < len(title) < 80:
                            full_url = f"https://www.khanacademy.org{href}" if href and href.startswith('/') else href
                            courses.append({
                                "id": f"khan-{len(courses)}",
                                "platform": "Khan Academy",
                                "title": title,
                                "provider": "Khan Academy",
                                "description": f"Free {subject_name} course on Khan Academy. Self-paced learning with practice exercises.",
                                "rating": None,
                                "students": None,
                                "url": full_url or url,
                                "category": category,
                                "level": "All Levels",
                                "duration": "Self-paced",
                                "certificate": False,
                                "skills": [],
                                "free": True,
                                "modules": [],
                                "lastVerified": datetime.now().isoformat(),
                            })
                    except:
                        continue
            except:
                continue
        
        print(f"  ✅ Scraped {len(courses)} Khan Academy courses")
    except Exception as e:
        print(f"  ⚠️ Khan Academy error: {e}")
    
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
        
        # Get all certification links
        links = page.query_selector_all('a[href*="/learn/"]')
        
        for link in links[:25]:
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

def scrape_youtube_playlists(browser):
    """Scrape popular free course playlists from YouTube."""
    print("\n🎓 [YouTube] Scraping free course playlists...")
    
    channels = [
        ("freeCodeCamp", "https://www.youtube.com/@freecodecamp/playlists", "View all"),
        ("Programming with Mosh", "https://www.youtube.com/@programmingwithmosh/playlists", "View all"),
        ("Traversy Media", "https://www.youtube.com/@TraversyMedia/playlists", "View all"),
        ("Bro Code", "https://www.youtube.com/@BroCodez/playlists", "View all"),
        ("TechWorld with Nana", "https://www.youtube.com/@TechWorldwithNana/playlists", "View all"),
        ("Fireship", "https://www.youtube.com/@Fireship/playlists", None),
    ]
    
    courses = []
    ctx = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        viewport={"width": 1920, "height": 1080}
    )
    page = ctx.new_page()
    
    for channel_name, url, view_all in channels:
        try:
            page.goto(url, timeout=20000, wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            
            # Get playlist items
            items = page.query_selector_all('ytd-grid-playlist-renderer, ytd-rich-item-renderer, [id="content"] ytd-grid-renderer ytd-rich-grid-row')
            
            for item in items[:15]:
                try:
                    text = item.inner_text()
                    lines = [l.strip() for l in text.split('\n') if l.strip()]
                    
                    title = ""
                    video_count = ""
                    
                    for line in lines:
                        if len(line) > 5 and not any(x in line.lower() for x in ['updated', 'views', 'ago', 'playlist', 'video']):
                            if not title:
                                title = line[:100]
                            elif not video_count and re.search(r'\d+\s*video', line, re.IGNORECASE):
                                vc_match = re.search(r'(\d+)\s*video', line, re.IGNORECASE)
                                if vc_match:
                                    video_count = f"{vc_match.group(1)} videos"
                    
                    if not title or len(title) < 5:
                        continue
                    
                    # Skip non-tutorial playlists
                    skip_words = ['live stream', 'podcast', 'reaction', 'interview', 'vlog', 'day in', 'my life']
                    if any(w in title.lower() for w in skip_words):
                        continue
                    
                    link_el = item.query_selector('a[href*="playlist?list="]')
                    href = link_el.get_attribute('href') if link_el else None
                    url_final = href if href and 'http' in href else f"https://www.youtube.com{href}" if href else f"https://www.youtube.com/results?search_query={title.replace(' ', '+')}"
                    
                    courses.append({
                        "id": f"yt-{len(courses)}",
                        "platform": "YouTube",
                        "title": title,
                        "provider": channel_name,
                        "description": f"Free full course by {channel_name} on YouTube. {video_count} of video content.",
                        "rating": None,
                        "students": None,
                        "url": url_final,
                        "category": categorize(title),
                        "level": "Beginner",
                        "duration": video_count or "Various",
                        "certificate": False,
                        "skills": extract_skills_from_title(title),
                        "free": True,
                        "modules": [],
                        "lastVerified": datetime.now().isoformat(),
                    })
                except:
                    continue
            
            print(f"  📺 {channel_name}: found {sum(1 for c in courses if c['provider'] == channel_name)} playlists")
        except Exception as e:
            print(f"  ⚠️ {channel_name} error: {e}")
    
    ctx.close()
    print(f"  ✅ Scraped {len(courses)} YouTube courses total")
    return courses

def categorize(text):
    """Auto-categorize based on text content."""
    t = text.lower()
    if any(w in t for w in ['python', 'java', 'c++', 'javascript', 'coding', 'programming', 'software', 'developer', 'git', 'react', 'angular', 'vue', 'node', 'typescript', 'swift', 'kotlin', 'rust', 'go ', 'ruby', 'php', 'django', 'flask', 'spring']):
        return 'Programming'
    elif any(w in t for w in ['data', 'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'statistics', 'analytics', 'neural', 'nlp', 'pandas', 'numpy']):
        return 'Data Science & AI'
    elif any(w in t for w in ['design', 'ui', 'ux', 'figma', 'photoshop', 'illustrator', 'canva', 'graphic', 'sketch', 'adobe']):
        return 'Design'
    elif any(w in t for w in ['business', 'marketing', 'entrepreneur', 'startup', 'management', 'leadership', 'finance', 'accounting', 'excel', 'project management', 'product']):
        return 'Business'
    elif any(w in t for w in ['web', 'html', 'css', 'frontend', 'backend', 'full stack', 'website', 'responsive', 'bootstrap', 'tailwind', 'wordpress']):
        return 'Web Development'
    elif any(w in t for w in ['math', 'algebra', 'calculus', 'geometry', 'statistics', 'probability', 'trigonometry']):
        return 'Math'
    elif any(w in t for w in ['science', 'physics', 'chemistry', 'biology', 'earth', 'astronomy']):
        return 'Science'
    elif any(w in t for w in ['security', 'cyber', 'network', 'cloud', 'aws', 'azure', 'devops', 'docker', 'kubernetes', 'linux']):
        return 'IT & Security'
    elif any(w in t for w in ['language', 'english', 'spanish', 'writing', 'communication', 'grammar']):
        return 'Languages'
    elif any(w in t for w in ['humanities', 'history', 'philosophy', 'art history', 'music', 'literature']):
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
        'rust': 'Rust', 'go ': 'Go', 'ruby': 'Ruby', 'php': 'PHP',
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

if __name__ == "__main__":
    start = datetime.now()
    print("=" * 60)
    print("📚 SulitNow PH — Free Courses Deep Scraper")
    print(f"⏰ Started: {start.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    all_courses = []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
        
        all_courses += scrape_coursera(browser)
        all_courses += scrape_edx(browser)
        all_courses += scrape_khan_academy(browser)
        all_courses += scrape_freecodecamp(browser)
        all_courses += scrape_youtube_playlists(browser)
        
        browser.close()
    
    # Deduplicate by title similarity
    seen = set()
    unique = []
    for c in all_courses:
        key = c['title'].lower().strip()[:40]
        if key not in seen:
            seen.add(key)
            unique.append(c)
    
    # Sort
    unique.sort(key=lambda x: (x['platform'], x['category'], x['title']))
    
    # Stats
    categories = {}
    platforms = {}
    for c in unique:
        cat = c['category']
        plat = c['platform']
        categories[cat] = categories.get(cat, 0) + 1
        platforms[plat] = platforms.get(plat, 0) + 1
    
    write_json("free-courses.json", {
        "lastUpdated": datetime.now().isoformat(),
        "courses": unique,
        "categories": [{"name": k, "count": v, "icon": cat_icon(k)} for k, v in sorted(categories.items(), key=lambda x: -x[1])],
        "platforms": [{"name": k, "count": v} for k, v in sorted(platforms.items(), key=lambda x: -x[1])],
        "stats": {
            "totalCourses": len(unique),
            "platforms": len(platforms),
            "totalCategories": len(categories),
            "withCertificate": sum(1 for c in unique if c.get('certificate')),
        }
    })
    
    elapsed = (datetime.now() - start).total_seconds()
    print(f"\n{'=' * 60}")
    print(f"✅ Complete in {elapsed:.1f}s")
    print(f"   📚 {len(unique)} courses | {len(platforms)} platforms | {len(categories)} categories")
    for plat, count in sorted(platforms.items(), key=lambda x: -x[1]):
        print(f"      • {plat}: {count}")
    print(f"{'=' * 60}")

#!/usr/bin/env python3
"""
SulitNow PH — Expand Free Software Alternatives
===============================================
Adds additional verified, legitimate free / open-source alternatives to the
existing curated `free-software.json` directory. No pirated content — every
entry points to the software's own official / reputable source.

Two kinds of changes:
  1. Adds free alternatives to paid software already present in the file.
  2. Adds brand-new software entries (plus their free alternatives) under a
     "System Utilities" category that was missing.

Existing entries are never removed; duplicates are skipped.

Usage:
  python3 scripts/security/expand_free_software.py
"""

import json
import os
import re
from datetime import datetime

OUTPUT = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'data', 'free-software.json')

# --- 1. Extra free alternatives for existing paid software ------------------
ADD_ALTERNATIVES = {
    "Microsoft Office": [
        {"name": "FreeOffice", "url": "https://www.freeoffice.com",
         "description": "Free office suite by SoftMaker with high Microsoft Office file compatibility.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.2},
    ],
    "Adobe Photoshop": [
        {"name": "Glimpse", "url": "https://glimpse-editor.org",
         "description": "Free, open-source image editor based on GIMP with a friendlier default UI.",
         "platforms": ["Windows", "Linux"], "rating": 4.0},
    ],
    "Adobe Premiere Pro": [
        {"name": "LosslessCut", "url": "https://mifi.no/losslesscut/",
         "description": "Free, fast, lossless video trim/cut tool. Perfect for quick edits without re-encoding.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.4},
    ],
    "Adobe Audition": [
        {"name": "Tenacity", "url": "https://tenacityaudio.org",
         "description": "Free, open-source audio editor for recording, editing, and effect processing.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.3},
    ],
    "Norton / McAfee": [
        {"name": "ClamWin", "url": "https://www.clamwin.com",
         "description": "Free, open-source antivirus for Windows with scheduled scanning and virus database updates.",
         "platforms": ["Windows"], "rating": 3.9},
    ],
    "LastPass (Paid)": [
        {"name": "Pass", "url": "https://www.passwordstore.org",
         "description": "The standard Unix password manager — simple, scriptable, and GPG-encrypted.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 3.9},
    ],
    "ChatGPT Plus": [
        {"name": "LocalGPT", "url": "https://github.com/PromtEngineer/localGPT",
         "description": "Open-source tool to chat with your local documents using private, offline LLMs.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.1},
    ],
    "Spotify Premium": [
        {"name": "Navidrome", "url": "https://www.navidrome.org",
         "description": "Free, self-hosted music server and streaming app. Listen to your own collection anywhere.",
         "platforms": ["Web", "Android", "iOS", "Windows", "Mac", "Linux"], "rating": 4.5},
    ],
    "Google One (100GB)": [
        {"name": "Nextcloud", "url": "https://nextcloud.com",
         "description": "Open-source private cloud suite. Files, calendar, contacts, and collaboration on your own server.",
         "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.6},
    ],
    "Slack (Paid Plans)": [
        {"name": "Zulip", "url": "https://zulip.com",
         "description": "Open-source team chat with topic-based threading. Great for large teams and async work.",
         "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.4},
    ],
    "Canva Pro": [
        {"name": "Photopea", "url": "https://www.photopea.com",
         "description": "Free browser-based image editor that supports PSD files. Great for quick graphic design.",
         "platforms": ["Web"], "rating": 4.6},
    ],
    "Adobe Illustrator": [
        {"name": "Inkscape", "url": "https://inkscape.org",
         "description": "Free, open-source vector graphics editor comparable to Illustrator for logos and illustrations.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.5},
    ],
    "Adobe After Effects": [
        {"name": "Natron", "url": "https://natron.fr",
         "description": "Open-source node-based compositing app for VFX and motion graphics, similar to After Effects.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.0},
    ],
    "Zoom Pro": [
        {"name": "Jitsi Meet", "url": "https://jitsi.org/jitsi-meet/",
         "description": "Free, open-source video conferencing that runs in your browser without downloads or time limits.",
         "platforms": ["Web", "Android", "iOS"], "rating": 4.3},
    ],
}

# --- 1b. Extra free alternatives (Batch 2) for existing paid software -------
ADD_ALTERNATIVES_2 = {
    "Microsoft Office": [
        {"name": "LibreOffice", "url": "https://www.libreoffice.org",
         "description": "Powerful free office suite — Writer, Calc, Impress — with strong OOXML compatibility.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.6},
        {"name": "OnlyOffice", "url": "https://www.onlyoffice.com",
         "description": "Free, open-source office suite with excellent Microsoft Office file fidelity and real-time collaboration.",
         "platforms": ["Windows", "Mac", "Linux", "Web"], "rating": 4.5},
    ],
    "Adobe Lightroom": [
        {"name": "darktable", "url": "https://www.darktable.org",
         "description": "Free, open-source raw photo editor and workflow tool, a strong Lightroom alternative.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.5},
        {"name": "RawTherapee", "url": "https://rawtherapee.com",
         "description": "Free, open-source cross-platform raw photo processing program.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.4},
    ],
    "Adobe XD": [
        {"name": "Figma (free tier)", "url": "https://www.figma.com",
         "description": "Free collaborative UI/UX design tool for teams, now owned by Adobe.",
         "platforms": ["Web", "Windows", "Mac"], "rating": 4.6},
        {"name": "Penpot", "url": "https://penpot.app",
         "description": "Free, open-source design and prototyping platform that works in the browser.",
         "platforms": ["Web"], "rating": 4.3},
    ],
    "Adobe Premiere Pro": [
        {"name": "DaVinci Resolve", "url": "https://www.blackmagicdesign.com/products/davinciresolve",
         "description": "Free professional video editing, color grading, and audio post-production suite.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.7},
        {"name": "Shotcut", "url": "https://shotcut.org",
         "description": "Free, open-source video editor with a wide feature set and broad format support.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.4},
    ],
    "Final Cut Pro": [
        {"name": "DaVinci Resolve", "url": "https://www.blackmagicdesign.com/products/davinciresolve",
         "description": "Free professional NLE with color grading used by Hollywood films.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.7},
        {"name": "Kdenlive", "url": "https://kdenlive.org",
         "description": "Free, open-source, non-linear video editor with multi-track timeline.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.3},
    ],
    "Camtasia": [
        {"name": "OBS Studio", "url": "https://obsproject.com",
         "description": "Free, open-source screen recording and live streaming with powerful scene composition.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.7},
    ],
    "Zoom Pro": [
        {"name": "Jitsi Meet", "url": "https://jitsi.org/jitsi-meet/",
         "description": "Free, open-source video conferencing that runs in the browser without downloads or time limits.",
         "platforms": ["Web", "Android", "iOS"], "rating": 4.3},
        {"name": "Google Meet (free)", "url": "https://meet.google.com",
         "description": "Free video meetings with screen share and live captions for personal use.",
         "platforms": ["Web", "Android", "iOS"], "rating": 4.4},
    ],
    "Dropbox Plus": [
        {"name": "MEGA", "url": "https://mega.io",
         "description": "Cloud storage with generous free tier and end-to-end encryption, syncs across devices.",
         "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.3},
        {"name": "Syncthing", "url": "https://syncthing.net",
         "description": "Free, open-source continuous file synchronization between your own devices — no cloud needed.",
         "platforms": ["Windows", "Mac", "Linux", "Android"], "rating": 4.6},
    ],
    "Google One (100GB)": [
        {"name": "Filen", "url": "https://filen.io",
         "description": "End-to-end-encrypted cloud drive with a free storage tier and desktop/mobile apps.",
         "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.2},
    ],
    "Apple Music": [
        {"name": "Jamendo", "url": "https://www.jamendo.com",
         "description": "Legal, free music streaming of Creative-Commons-licensed songs.",
         "platforms": ["Web", "Android", "iOS"], "rating": 4.0},
    ],
    "Norton / McAfee": [
        {"name": "Microsoft Defender", "url": "https://www.microsoft.com/windows/comprehensive-security",
         "description": "Built-in, always-on antivirus on Windows — sufficient for most home users at no extra cost.",
         "platforms": ["Windows"], "rating": 4.5},
    ],
    "ChatGPT Plus": [
        {"name": "Ollama", "url": "https://ollama.com",
         "description": "Run open-source LLMs locally on your own hardware — free and private.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.6},
    ],
    "Sublime Text": [
        {"name": "VS Code", "url": "https://code.visualstudio.com",
         "description": "Free, open-source code editor with an enormous extension ecosystem.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.7},
    ],
    "JetBrains IDEs": [
        {"name": "IntelliJ IDEA Community", "url": "https://www.jetbrains.com/idea/",
         "description": "Free, open-source community edition of JetBrains' flagship Java IDE.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.6},
    ],
    "AutoCAD": [
        {"name": "LibreCAD", "url": "https://librecad.org",
         "description": "Free, open-source 2D CAD application for drafting and technical drawing.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.2},
        {"name": "FreeCAD", "url": "https://www.freecad.org",
         "description": "Free, open-source parametric 3D CAD modeller for real-life product design.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.3},
    ],
    "MATLAB": [
        {"name": "GNU Octave", "url": "https://octave.org",
         "description": "Free, open-source numerical computing environment largely compatible with MATLAB.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.4},
        {"name": "Python + NumPy/SciPy", "url": "https://scipy.org",
         "description": "Free scientific computing stack in Python — the standard modern MATLAB alternative.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.6},
    ],
    "SPSS": [
        {"name": "JASP", "url": "https://jasp-stats.org",
         "description": "Free, open-source statistics program with a friendly point-and-click interface.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.3},
        {"name": "jamovi", "url": "https://www.jamovi.org",
         "description": "Free, open-source statistical software built on R with a modern UI.",
         "platforms": ["Windows", "Mac", "Linux"], "rating": 4.3},
    ],
}

# --- 2. Brand-new software entries (with their free alternatives) -----------
NEW_CATEGORY = {
    "name": "System Utilities",
    "icon": "🛠️",
    "software": [
        {
            "paid": {"name": "WinRAR", "price": "₱1,100 (lifetime)", "icon": "🗜️"},
            "freeAlternatives": [
                {"name": "7-Zip", "url": "https://www.7-zip.org",
                 "description": "Popular open-source archiver. Supports 7z, Zip, RAR (read), and many formats with strong compression.",
                 "platforms": ["Windows", "Linux"], "rating": 4.7},
                {"name": "PeaZip", "url": "https://peazip.github.io",
                 "description": "Free, open-source archiver with a polished interface and RAR read support.",
                 "platforms": ["Windows", "Linux"], "rating": 4.4},
            ],
        },
        {
            "paid": {"name": "WinZip", "price": "₱1,800/year", "icon": "📦"},
            "freeAlternatives": [
                {"name": "7-Zip", "url": "https://www.7-zip.org",
                 "description": "Open-source archive manager covering all the essential formats without the subscription.",
                 "platforms": ["Windows", "Linux"], "rating": 4.7},
                {"name": "NanaZip", "url": "https://github.com/M2Team/NanaZip",
                 "description": "Modern file archiver for Windows, a fork of 7-Zip with Windows 11 modern context menus.",
                 "platforms": ["Windows"], "rating": 4.5},
            ],
        },
        {
            "paid": {"name": "CCleaner", "price": "₱900/year (Pro)", "icon": "🧹"},
            "freeAlternatives": [
                {"name": "BleachBit", "url": "https://www.bleachbit.org",
                 "description": "Free, open-source system cleaner that removes junk files and protects privacy.",
                 "platforms": ["Windows", "Linux"], "rating": 4.3},
                {"name": "Windows Disk Cleanup", "url": "https://support.microsoft.com/en-us/windows",
                 "description": "Built-in Windows tool to free up disk space safely and without extra software.",
                 "platforms": ["Windows"], "rating": 4.0},
            ],
        },
        {
            "paid": {"name": "Ashampoo WinOptimizer", "price": "₱1,200 (one-time)", "icon": "⚡"},
            "freeAlternatives": [
                {"name": "BleachBit", "url": "https://www.bleachbit.org",
                 "description": "Open-source cleaner and privacy tool. Deletes temporary files, caches, and logs.",
                 "platforms": ["Windows", "Linux"], "rating": 4.3},
            ],
        },
    ],
}

# --- 2b. Brand-new software entries (Batch 2)
NEW_CATEGORY_2 = {
    "name": "Media & Entertainment",
    "icon": "🎬",
    "software": [
        {
            "paid": {"name": "Netflix / Disney+ Subscription", "price": "₱1,000+/month", "icon": "📺"},
            "freeAlternatives": [
                {"name": "Stremio + add-ons", "url": "https://www.stremio.com",
                 "description": "Free media center organizing movies and series from official and library sources.",
                 "platforms": ["Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.4},
                {"name": "Plex (with your own library)", "url": "https://www.plex.tv",
                 "description": "Free media server for streaming your own movies, music, and photos to any device.",
                 "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.5},
            ],
        },
        {
            "paid": {"name": "iTunes / Apple Music", "price": "₱129/month", "icon": "🎵"},
            "freeAlternatives": [
                {"name": "Jellyfin", "url": "https://jellyfin.org",
                 "description": "Free, self-hosted media server with apps to stream music and video to any device.",
                 "platforms": ["Web", "Windows", "Mac", "Linux", "Android", "iOS"], "rating": 4.6},
            ],
        },
    ],
}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '', s.lower())


def main():
    with open(OUTPUT, encoding='utf-8') as f:
        data = json.load(f)

    # Index paid software by slug, keeping references so we can update in place
    index = {}
    for cat in data.get('categories', []):
        for sw in cat.get('software', []):
            index.setdefault(slug(sw['paid']['name']), []).append(sw)

    # --- Add free alternatives to existing paid software ---
    added = 0
    updated = 0
    for batch in (ADD_ALTERNATIVES, ADD_ALTERNATIVES_2):
        for paid_name, alts in batch.items():
            targets = index.get(slug(paid_name), [])
            if not targets:
                print(f"  ⏭️  '{paid_name}' not found — skipped")
                continue
            for sw in targets:
                existing = {(a['name'].lower()) for a in sw.get('freeAlternatives', [])}
                for alt in alts:
                    if alt['name'].lower() in existing:
                        continue
                    sw.setdefault('freeAlternatives', []).append(alt)
                    existing.add(alt['name'].lower())
                    added += 1
                updated += 1

    # --- Add new categories if not present ---
    cat_names = [c['name'] for c in data['categories']]
    for cat in (NEW_CATEGORY, NEW_CATEGORY_2):
        if cat['name'] not in cat_names:
            count = sum(1 for s in cat['software'] for _ in s['freeAlternatives'])
            data['categories'].append(cat)
            cat_names.append(cat['name'])
            print(f"  ➕ Added category '{cat['name']}' with "
                  f"{len(cat['software'])} software, {count} free alternatives")
        else:
            print(f"  ℹ️  '{cat['name']}' category already exists — skipped")

    # --- Recompute stats ---
    total_paid = sum(len(c.get('software', [])) for c in data['categories'])
    total_free = sum(
        len(s.get('freeAlternatives', []))
        for c in data['categories'] for s in c.get('software', [])
    )
    data['lastUpdated'] = datetime.now().strftime('%Y-%m-%d')
    data['stats'] = {
        "totalPaidSoftware": total_paid,
        "totalFreeAlternatives": total_free,
        "categories": len(data['categories']),
        "estimatedAnnualSavings": "₱500,000+",
    }

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("=" * 55)
    print(f"✅ Added {added} free alternatives to existing entries")
    print(f"   Total paid software : {total_paid}")
    print(f"   Total free alt      : {total_free}")
    print(f"   Categories          : {len(data['categories'])}")
    print("=" * 55)


if __name__ == "__main__":
    main()

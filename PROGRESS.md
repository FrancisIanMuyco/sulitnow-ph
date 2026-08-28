# SULITNOW PH — Development Progress

## Current Phase: Phase 1 + Phase 2 (Foundation + Local Tools)

---

## ✅ Completed

### Phase 1 — Foundation
- [x] Vite + React + TypeScript project setup
- [x] Tailwind CSS v4 integration
- [x] React Router setup with all routes
- [x] Theme system (light/dark/system)
- [x] Responsive navigation (mobile-first)
- [x] Header with logo, nav links, search, theme toggle
- [x] Footer with category links
- [x] Global tool search with fuzzy matching
- [x] Filipino/English/Bisaya keyword aliases
- [x] Homepage with hero, search, popular tools, categories, CTA
- [x] Tools listing page with category filters
- [x] Tool registry (centralized, 50+ tools defined)
- [x] Consistent tool page layout (ToolLayout component)
- [x] Reusable UI components (Card, Button, Input, ScoreBadge)
- [x] PWA manifest with icons
- [x] Inter font integration
- [x] .env.example created

### Phase 2 — Local Tools (Working Calculators)
- [x] Salary Calculator (with SSS, PhilHealth, Pag-IBIG deductions)
- [x] Daily Wage Calculator
- [x] Overtime Calculator (regular day + rest day)
- [x] Night Differential Calculator
- [x] Holiday Pay Calculator (5 types)
- [x] 13th Month Pay Estimate
- [x] GCash Fee Calculator (GCash-to-GCash, bank, cash-out)
- [x] Maya Fee Calculator
- [x] Loan Calculator (with amortization schedule)
- [x] Installment True Cost Calculator
- [x] Savings Goal Calculator
- [x] Daily Budget Calculator
- [x] Percentage Calculator (4 modes)
- [x] Discount Calculator (with double discount)
- [x] Unit Price Comparator
- [x] Fuel Cost Calculator
- [x] Data Usage Calculator

### Phase 3 — Smart Comparison
- [x] SulitScore calculation engine
- [x] ScoreBadge component
- [x] Transparent scoring with factors
- [x] "How is this calculated?" architecture

### Security & Recon Toolkit (newly installed tools)
- [x] Installed security/recon tools locally: nuclei, subfinder, httpx, naabu, katana, amass, ffuf, gobuster, sqlmap, nikto, nmap, hydra, bettercap, mitmproxy, tshark/termshark, john, hashcat
- [x] `scripts/security/recon_helpers.py` — shared lib: tool registry, source reachability + WAF/anti-bot detection, proxy health check, strategy recommendation
- [x] `scripts/security/check_sources.py` — audits every scrape source with nuclei + nikto; writes `public/data/security-report.json`; `--offline` mode for slow networks
- [x] `scripts/security/discover_sources.py` — recon for new API/data endpoints (subfinder → httpx → katana → gobuster → nmap)
- [x] `scripts/security/run_toolkit.sh` — one-shot orchestrator for security audit + discovery
- [x] Integrated into `refresh-all.py --security` and GitHub Actions `scrape.yml` (installs Go tools + runs audit each run)
- [x] `scripts/security/tools_report.py` — regenerable capability inventory → `public/data/tools-inventory.json` (17 tools)
- [x] Verified PD `httpx` standalone binary installed at `/root/go/bin/httpx` (65MB) for alive-host probing
- [x] Full capability demo: gobuster found `/robots.txt`+`/json` on httpbin, katana crawled pages, naabu found open ports 80/443 (nmap blocked by sandbox, works on real host/CI)

### Reliability-aware scrapers
- [x] `recon_helpers.py::smart_scrape_decision()` — one-shot `SKIP / NEED_PROXY / ROTATE_UA / SCRAPE` decision + live-proxy selection
- [x] `scripts/scrape-all.py --reliability` — pre-checks each data source before running its scraper, skips dead/blocked ones
- [x] Verified live: bir.gov.ph→ROTATE_UA, pse.com.ph→NEED_PROXY, httpbin→SCRAPE
- [x] Wired into CI as a `--reliability` scrape step

### Source Health panel
- [x] Live Status page (`Live.tsx`) now loads `security-report.json` and renders a "Data Source Health" panel: per-source reachability, WAF badge, HTTP status, and scrape strategy (Direct / Rotate UA / Use Proxy / Down)
- [x] Shares the auto-refresh lifecycle with the existing status board

### Free Software Directory (legitimate expansion)
- [x] Expanded `public/data/free-software.json` with verified, legitimate free/open-source alternatives (no pirated content — every link points to official sources)
- [x] Added new alternatives to existing paid entries (Microsoft Office, Adobe, Norton, LastPass, ChatGPT Plus, Spotify, Google One, Slack, Canva Pro)
- [x] Added new `System Utilities` category: WinRAR, WinZip, CCleaner, Ashampoo WinOptimizer with free alternatives (7-Zip, PeaZip, NanaZip, BleachBit)
- [x] Added new `Media & Entertainment` category (Stremio, Plex, Jellyfin)
- [x] Added Batch 2 of alternatives (LibreOffice, OnlyOffice, DaVinci Resolve, Figma, darktable, OBS, GNU Octave, FreeCAD, JASP, and more) — only targeting paid software that exists in the data
- [x] Recalculated stats: now 41 paid software, 136 free alternatives, 12 categories
- [x] `scripts/security/expand_free_software.py` — repeatable + idempotent (re-run adds 0 duplicates), wired into `refresh-all.py` and CI
- [x] Build verified (FreeSoftware page renders new data)

### Pages
- [x] Homepage — premium design
- [x] Tools — filtered listing
- [x] Live Status Center — with status indicators
- [x] Deals — architecture ready
- [x] RaketCheck PH — demo data displayed
- [x] Pricing — FREE/PLUS/PRO/Founders tiers

---

## 🔄 In Progress
- Adding more tool implementations
- Code splitting for performance optimization
- Additional shopping tools (voucher, marketplace fee, etc.)

---

## 📋 Pending

### Phase 4 — Data Architecture
- [ ] Provider/Adaptor interfaces
- [ ] PromoProvider
- [ ] CurrencyProvider
- [ ] StatusProvider
- [ ] DealProvider
- [ ] Demo data sources

### Phase 5 — Live Features
- [ ] Free API connections
- [ ] Network status monitoring
- [ ] Currency exchange rates
- [ ] Load promo data

### Phase 6 — Community
- [ ] Report submission
- [ ] Voting system
- [ ] Real-time features

### Phase 7 — PWA
- [ ] Service worker
- [ ] Offline support
- [ ] Install prompt

### Phase 8 — QA
- [ ] Mobile testing (320px-412px)
- [ ] Tablet testing (768px)
- [ ] Desktop testing
- [ ] Build verification
- [ ] Lighthouse audit
- [ ] Accessibility audit

### Phase 9 — Deployment
- [ ] GitHub repository setup
- [ ] Cloudflare Pages deployment
- [ ] Custom domain setup

---

## 🐛 Known Issues
- Build warning: chunks larger than 500KB (needs code splitting)
- Some tool pages still showing "Coming Soon" placeholders

---

## 📊 Decisions
- Using Tailwind CSS v4 with @tailwindcss/vite plugin
- Inter font from Google Fonts
- Tool registry pattern for scalable navigation
- GenericTool component for placeholder tools
- Demo mode clearly labeled everywhere

---

## 📡 Data Sources
- No external APIs connected yet
- All calculations are local/client-side
- Demo data clearly marked

---

## ⏭ Next Actions
1. Add code splitting (lazy routes) to reduce bundle size
2. Implement remaining tool calculators (electricity, commute, etc.)
3. Add promo data for mobile networks
4. Set up provider interfaces for future API integration
5. Implement service worker for PWA

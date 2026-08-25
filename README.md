# SulitNow PH 🇵🇭

**Your Everyday Decision Toolkit**

> "Before you spend, check SulitNow."

A comprehensive Filipino daily-use multi-tools platform built with modern web technologies. Compare promos, fees, prices, earnings, daily expenses and more — designed for Filipinos.

## Features

### 📱 Mobile & Internet
- Load Promo Finder & Comparator
- Data Usage Calculator
- Cost Per GB Calculator
- Internet Plan Comparator

### 💰 Money Tools
- Salary Calculator (with SSS, PhilHealth, Pag-IBIG)
- Overtime, Night Differential, Holiday Pay Calculators
- 13th Month Pay Estimate
- GCash & Maya Fee Calculators
- Loan Calculator (with amortization)
- Installment True Cost Calculator
- Savings Goal & Daily Budget Calculators

### 🛒 Shopping & Deals
- Discount Calculator (with double discount)
- Unit Price Comparator
- Installment vs Cash Comparator
- Voucher Savings Calculator
- Marketplace Fee Calculator

### 🏠 Daily Life
- Fuel Cost Calculator
- Commute Cost Calculator
- Electricity Usage Estimate
- Monthly Expense Planner
- Subscription Cost Tracker

### 🛡️ Safety Tools
- Suspicious URL Checker
- Website Risk Signals
- Community Scam Reports

### 💼 Raket / Earning
- RaketCheck PH — earning platform reviews

## Technology

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router v7 |
| Deployment | Cloudflare Pages |
| Cost | ₱0/month |

## Local Installation

### Prerequisites
- Node.js 18+ (recommended: v22)
- npm, pnpm, or yarn
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/sulitnow-ph.git
cd sulitnow-ph

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
npx tsc --noEmit     # Type check
```

## Architecture

```
src/
├── components/       # Reusable components
│   ├── common/       # Shared components
│   ├── layout/       # Header, Footer, Search
│   ├── tool/         # Tool-specific components
│   └── ui/           # Base UI components
├── pages/            # Route pages
├── tools/            # Tool implementations
│   ├── mobile/       # Mobile & Internet tools
│   ├── money/        # Financial calculators
│   ├── shopping/     # Shopping & deal tools
│   ├── daily/        # Daily life tools
│   ├── safety/       # Safety tools
│   └── raket/        # Earning platforms
├── data/             # Data providers
├── services/         # API services
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
└── constants/        # App constants & registry
```

## Key Design Decisions

### Tool Registry
All tools are registered in a centralized `toolRegistry` that drives navigation, search, categories, and related tools. Add a new tool by adding an entry to the registry and creating its implementation.

### Provider Architecture
Data providers use a adaptor pattern so APIs can be swapped without changing UI:
```typescript
interface PromoProvider {
  getPromos(network: string): Promise<Promo[]>;
  getLastUpdated(): Date;
}
```

### SulitScore
Every comparison tool can display a transparent SulitScore (1-10) with factor breakdown and explanation.

### Demo Mode
When no backend is connected, tools show clearly labeled "DEMO DATA" badges. The website works fully without any API keys.

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

All environment variables are optional for Phase 1.

## Deployment

### Cloudflare Pages
1. Push to GitHub
2. Connect repository in Cloudflare Pages
3. Build settings:
   - Framework: Vite
   - Build command: `npm run build`
   - Build output: `dist`

### Static Export
```bash
npm run build
# Upload dist/ folder to any static host
```

## Roadmap

- [x] Phase 1: Foundation
- [x] Phase 2: Local Tools
- [x] Phase 3: SulitScore Engine
- [ ] Phase 4: Data Architecture
- [ ] Phase 5: Live Features
- [ ] Phase 6: Community
- [ ] Phase 7: PWA
- [ ] Phase 8: QA
- [ ] Phase 9: Deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run build` to verify
5. Submit a pull request

## License

MIT © 2026 SulitNow PH

---

Built with ❤️ for Filipinos 🇵🇭

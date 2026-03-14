# WW3 Tracker - Agent Documentation

## Project Overview
**Name:** WW3 Tracker  
**Domain:** ww3tracker.live  
**Platform:** Railway (Node.js backend + React frontend)  
**Identity:** Live US-Iran conflict monitoring with satirical/meme elements  

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  React Router│  │  Vite Build  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP /api/*
┌──────────────────────────▼──────────────────────────────────┐
│                      SERVER (Node.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Express    │  │  API Routes  │  │   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐      ┌──────────┐      ┌──────────┐
   │Polymarket│     │RSS Feeds │      │NASA FIRMS│
   └─────────┘      └──────────┘      └──────────┘
```

---

## Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Charts:** D3 (for maps)

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **External APIs:**
  - Polymarket (prediction markets)
  - RSS feeds (BBC, Reuters, Guardian, etc.)
  - NASA FIRMS (satellite fire data)
  - Giphy (meme GIFs)
  - Replicate (AI analysis)

---

## Data Flow

### 1. Game State (HP/Tension)
```
RSS Feeds → Replicate AI Analysis → Game State Service → /api/state → Frontend
```
- **Update frequency:** Every 5 minutes
- **Data stored:** `usHP`, `iranHP`, `tension`, `breakingAlert`
- **Location:** `server/services/gameStateService.js`

### 2. News/Memes
```
RSS Feeds → Analysis → Categorization → /api/memes → MemeFeed Component
```
- **Update frequency:** Every 5 minutes
- **Location:** `server/services/rssService.js`

### 3. Polymarket Data
```
Polymarket API → /api/polymarket → PolymarketWidget
```
- **Update frequency:** Every 60 seconds
- **Location:** `server/services/polymarketService.js`

### 4. NASA FIRMS
```
NASA API → /api/fires → NasaFirmsStrip
```
- **Update frequency:** Every 30 minutes
- **Location:** `server/services/nasaFirmsService.js`

---

## Component Inventory

### Core Dashboard Components

| Component | File | Purpose | Data Source |
|-----------|------|---------|-------------|
| **WW3Counter** | `components/WW3Counter.jsx` | Big probability number | Polymarket + Tension |
| **ConflictMap** | `components/ConflictMap.jsx` | Interactive D3 map | News events |
| **GlobalParticipantsCarousel** | `components/GlobalParticipantsCarousel.jsx` | Trump/Iran/Netanyahu cards | **STATIC/HARDCODED** ⚠️ |
| **HPBar** | `components/HPBar.jsx` | US vs Iran health bars | Game state API |
| **SpicyMeter** | `components/SpicyMeter.jsx` | Tension/war market data | Markets API |
| **PolymarketWidget** | `components/PolymarketWidget.jsx` | Prediction markets | Polymarket API |
| **MemeFeed** | `components/MemeCard.jsx` | Breaking news cards | News API |
| **NasaFirmsStrip** | `components/NasaFirmsStrip.jsx` | Satellite fire data | NASA API |
| **TimelineOfChaos** | `components/TimelineOfChaos.jsx` | Historical timeline | Static data |
| **BreakingAlert** | `components/BreakingAlert.jsx` | Full-screen alerts | Game state |

### Page Components

| Page | File | Route | SEO Priority |
|------|------|-------|--------------|
| **MainDashboard** | `App.jsx` | `/` | High |
| **WW3ProbabilityPage** | `pages/WW3ProbabilityPage.jsx` | `/ww3-probability` | High |
| **UsIranWarTrackerPage** | `pages/UsIranWarTrackerPage.jsx` | `/us-iran-war-tracker` | High |
| **IranConflictLivePage** | `pages/IranConflictLivePage.jsx` | `/iran-conflict-live` | High |
| **TimelinePage** | `pages/TimelinePage.jsx` | `/timeline` | Medium |
| **BlogPage** | `pages/BlogPage.jsx` | `/blog` | Medium |
| **BlogPostPage** | `pages/BlogPostPage.jsx` | `/blog/:slug` | Medium |
| **WW3RiskCalculatorPage** | `pages/WW3RiskCalculatorPage.jsx` | `/ww3-risk-calculator` | Medium |
| **WW3ReadinessGame** | `components/WW3ReadinessGame.jsx` | `/ready` | Low |
| **ShareResultPage** | `pages/ShareResultPage.jsx` | `/share` | Low |
| **IsWW3HappeningPage** | `pages/IsWW3HappeningPage.jsx` | `/is-ww3-happening` | SEO Landing |
| **WorldWar3NewsPage** | `pages/WorldWar3NewsPage.jsx` | `/world-war-3-news` | SEO Landing |
| **IranNuclearDealPage** | `pages/IranNuclearDealPage.jsx` | `/iran-nuclear-deal` | SEO Landing |

---

## Current Issues (Known)

### 🔴 Critical
1. **GlobalParticipantsCarousel shows STATIC DATA**
   - Trump: "500+ Targets" (hardcoded)
   - Iran: "300-500 Missiles" (hardcoded)
   - Never updates from API
   - Location: `components/GlobalParticipantsCarousel.jsx` lines 38-76

2. **Iran card shows "CONTENT NOT AVAILABLE"**
   - Broken Giphy URL
   - Location: `components/GlobalParticipantsCarousel.jsx` line 9

3. **SEO contains "satire"**
   - Description meta tag has "satire tracker"
   - Hurting Google rankings
   - Location: `index.html` line 75

### 🟡 Medium
4. **Tension at 100% in screenshot**
   - Need to verify game state logic
   - May be stuck at max value

5. **Circuit Breaker triggering**
   - Shows "TRADING HALTED" red screen
   - May be triggering too easily

### 🟢 Low
6. **Some GIFs may be rate-limited**
   - Giphy API has limits
   - Should add fallback images

---

## API Endpoints

### Game State
```
GET /api/state
Response: { usHP, iranHP, tension, lastUpdate, breakingAlert }

POST /api/state/refresh
Response: { state, analyzed }
```

### News
```
GET /api/news?limit=10
Response: { items: [...], count, lastUpdated }
```

### Polymarket
```
GET /api/polymarket
Response: { markets: [...], escalation: { probability, isReal } }
```

### NASA FIRMS
```
GET /api/fires
Response: { fires: [...], count, lastUpdated }
```

---

## File Structure

```
├── index.html              # Main HTML template
├── public/                 # Static assets
│   ├── diplomat/          # The Diplomat game (if exists)
│   ├── images/            # Image assets
│   └── _redirects         # SPA routing (Railway)
├── server/                 # Backend
│   ├── server.js          # Express entry point
│   ├── routes/            # API routes
│   └── services/          # Business logic
├── src/
│   ├── App.jsx            # Main app + router
│   ├── main.jsx           # React entry
│   ├── index.css          # Global styles
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── data/              # Static data (blog posts)
│   └── lib/               # Utilities & API clients
├── dist/                  # Build output
└── scripts/               # Build/utility scripts
```

---

## Environment Variables

```
REPLICATE_API_TOKEN=       # AI analysis (optional but recommended)
GIPHY_API_KEY=            # Meme GIFs
NASA_FIRMS_KEY=           # Satellite data
PORT=3001                 # Server port
```

---

## Design System

### Colors
- Background: `#0d0d12` (dark blue-black)
- Primary accent: Blue (`#3b82f6`)
- Secondary accent: Red (`#ef4444`)
- Warning: Yellow/Orange (`#fbbf24`, `#f97316`)
- Success: Green (`#22c55e`)

### Typography
- Headings: `font-heading` (Space Grotesk style)
- Body: `font-body` (Inter)
- Monospace: `font-mono` (JetBrains Mono)

### Key Classes
- `.comic-panel` - Card styling with border
- `.font-heading` - Bold uppercase headings
- `.health-bar-container` - HP bar wrapper
- `.bg-grid` - Subtle grid background

---

## Build Process

```bash
# Development
npm run dev          # Starts Vite dev server + Node backend

# Production build
npm run build        # Creates dist/ folder with prerendered pages

# Production serve
npm start            # Serves built app from dist/
```

---

## Deployment

**Platform:** Railway.app
**Build Command:** `npm run build`
**Start Command:** `npm start`
**Port:** 3001 (or $PORT env var)

---

## Next Steps (Priority)

1. [ ] Fix Iran card broken image
2. [ ] Update GlobalParticipantsCarousel to use live data
3. [ ] Change SEO meta (remove "satire")
4. [ ] Verify game state logic (tension calculation)
5. [ ] Test all API endpoints

---

## Contact/Notes

- Created: 2026-03-14
- Status: Reverted to pre-redesign state
- Current commit: `6a62d5f`

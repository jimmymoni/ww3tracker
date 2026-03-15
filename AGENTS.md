# WW3 Tracker - Agent Documentation

## Project Overview

**Name:** WW3 Tracker (US vs Iran War Tracker)  
**Domain:** ww3tracker.live  
**Platform:** Railway (Node.js backend + React frontend)  
**Purpose:** Live US-Iran conflict monitoring dashboard with real-time data aggregation, AI analysis, prediction market integration, and meme/satirical elements.

**Last Updated:** 2026-03-16

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router DOM | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| D3 + d3-geo | Interactive conflict maps |
| react-markdown + remark-gfm | Blog content rendering |
| react-helmet-async | SEO meta tags |
| Leaflet + react-leaflet | Map visualizations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | Web framework |
| Socket.io | Real-time features (if enabled) |
| node-fetch | HTTP requests |
| xml2js | RSS feed parsing |
| cors | Cross-origin support |
| dotenv | Environment configuration |

### External APIs
| Service | Data Provided | Optional |
|---------|---------------|----------|
| Replicate (Moonshot AI) | AI news analysis | Yes (fallback available) |
| Giphy | Trump reaction GIFs | Yes |
| NASA FIRMS | Satellite fire detection | Yes |
| Polymarket | Prediction market odds | No (has fallback) |
| RSS Feeds (BBC, Reuters, Guardian, Al Jazeera, AP) | News aggregation | No |
| GDELT | OSINT data | Yes |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   React UI   │  │  React Router│  │  Vite Build  │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP /api/*
┌──────────────────────────▼──────────────────────────────────┐
│                      SERVER (Node.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Express    │  │  API Routes  │  │   Services   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐      ┌──────────┐      ┌──────────┐
   │Polymarket│     │RSS Feeds │      │NASA FIRMS│
   └─────────┘      └──────────┘      └──────────┘
```

### Data Flow

1. **Game State (HP/Tension)**
   ```
   RSS Feeds → Replicate AI Analysis → Game State Service → /api/state → Frontend
   ```
   - Update frequency: Every 5 minutes (RSS refresh)
   - Tension decays 2% every 10 minutes to prevent permanent 100%

2. **News/Memes**
   ```
   RSS Feeds + GDELT → Analysis → Categorization → /api/memes → MemeFeed
   ```
   - Update frequency: Every 5 minutes
   - Fallback news always available for instant response

3. **Polymarket Data**
   ```
   Polymarket API → /api/polymarket → PolymarketWidget
   ```
   - Update frequency: Every 60 seconds
   - Cached for 1 minute

4. **NASA FIRMS Fire Data**
   ```
   NASA API → /api/fires → NasaFirmsStrip
   ```
   - Update frequency: Every 30 minutes
   - Mock data fallback if API unavailable

---

## Project Structure

```
├── index.html                 # Main HTML template with inline SEO content
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration with code splitting
├── tailwind.config.js         # Tailwind CSS theme configuration
├── postcss.config.js          # PostCSS setup
├── railway.json               # Railway deployment config
├── .env.example               # Environment variable template
├── .env                       # Local environment (gitignored)
├── README.md                  # Human-readable project docs
├── AGENTS.md                  # This file - AI agent documentation
│
├── server/                    # Backend code
│   ├── server.js              # Express server entry point
│   └── services/              # Business logic modules
│       ├── gameStateService.js    # HP bars, tension, alerts
│       ├── rssService.js          # RSS feed fetching & caching
│       ├── gdeltService.js        # GDELT OSINT integration
│       ├── replicateService.js    # AI analysis via Replicate
│       ├── polymarketService.js   # Prediction market data
│       ├── nasaFirmsService.js    # Satellite fire data
│       ├── giphyService.js        # Trump GIFs
│       ├── marketService.js       # Financial market data
│       ├── attackDetector.js      # Attack detection from news
│       └── kimiService.js         # Legacy Kimi AI service
│
├── src/                       # Frontend source code
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app with routing
│   ├── index.css              # Global styles + Tailwind
│   │
│   ├── components/            # React components
│   │   ├── WW3Counter.jsx         # Main probability display
│   │   ├── ConflictMap.jsx        # D3 interactive map
│   │   ├── GlobalParticipantsCarousel.jsx  # Trump/Iran/Netanyahu cards
│   │   ├── HPBar.jsx              # Fighting game HP bars
│   │   ├── SpicyMeter.jsx         # Tension gauge
│   │   ├── PolymarketWidget.jsx   # Prediction markets
│   │   ├── MemeCard.jsx           # News/meme feed
│   │   ├── NasaFirmsStrip.jsx     # Satellite fire strip
│   │   ├── TimelineOfChaos.jsx    # Historical timeline
│   │   ├── BreakingAlert.jsx      # Full-screen alerts
│   │   ├── FighterCard.jsx        # US vs Iran fighter cards
│   │   ├── ComicTicker.jsx        # News ticker
│   │   ├── WW3ReadinessGame.jsx   # Interactive quiz game
│   │   ├── SEO.jsx                # SEO component wrapper
│   │   ├── StructuredData.jsx     # JSON-LD schema
│   │   ├── Breadcrumbs.jsx        # Navigation breadcrumbs
│   │   ├── PickSideModal.jsx      # US/Iran selector modal
│   │   ├── DisqusComments.jsx     # Comments integration
│   │   ├── DailyPoll.jsx          # User polling
│   │   ├── ConflictGlobe.jsx      # 3D globe visualization
│   │   ├── EliminatedBoard.jsx    # Defeated entities display
│   │   ├── FloatingChat.jsx       # AI chat interface
│   │   ├── GenZAnalyst.jsx        # Gen-Z AI persona
│   │   ├── CentralTweetButton.jsx # Share functionality
│   │   ├── ReadingProgress.jsx    # Blog reading indicator
│   │   ├── TableOfContents.jsx    # Blog TOC
│   │   ├── WarRoomComments.jsx    # Comment system
│   │   └── Blog/                  # Blog-specific components
│   │       ├── ArticleCard.jsx
│   │       ├── BlogContentRenderer.jsx
│   │       ├── ComparisonTable.jsx
│   │       ├── FAQ.jsx
│   │       ├── KeyTakeaway.jsx
│   │       ├── NewsletterSignup.jsx
│   │       ├── PollWidget.jsx
│   │       ├── PullQuote.jsx
│   │       ├── QuickFacts.jsx
│   │       ├── QuoteBlock.jsx
│   │       ├── RelatedConflicts.jsx
│   │       ├── ShareButtons.jsx
│   │       ├── StatCard.jsx
│   │       ├── Timeline.jsx
│   │       ├── TimelineItem.jsx
│   │       └── index.js
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── WW3ProbabilityPage.jsx
│   │   ├── UsIranWarTrackerPage.jsx
│   │   ├── IranConflictLivePage.jsx
│   │   ├── TimelinePage.jsx
│   │   ├── BlogPage.jsx
│   │   ├── BlogPostPage.jsx
│   │   ├── WW3RiskCalculatorPage.jsx
│   │   ├── ShareResultPage.jsx
│   │   ├── IsWW3HappeningPage.jsx      # SEO landing
│   │   ├── WorldWar3NewsPage.jsx       # SEO landing
│   │   └── IranNuclearDealPage.jsx     # SEO landing
│   │
│   ├── lib/                   # Utilities & API clients
│   │   ├── api.js             # Frontend API client with caching
│   │   ├── utils.js           # Utility functions
│   │   └── mockData.js        # Mock/fallback data
│   │
│   └── data/                  # Static data
│       └── blogPosts.js       # Blog post content
│
├── scripts/                   # Build & utility scripts
│   ├── prerender.js           # Prerender static pages
│   ├── verify-prerender.js    # Verify prerender output
│   ├── generate-sitemap.js    # Generate sitemap.xml
│   ├── generate-og-image.js   # Generate OpenGraph images
│   ├── fetch-analytics.js     # Fetch analytics data
│   └── detailed-engagement.js # Engagement analysis
│
├── dist/                      # Production build output
│   ├── index.html             # Built index
│   ├── assets/                # Bundled JS/CSS/images
│   ├── sitemap.xml            # Generated sitemap
│   └── robots.txt             # SEO robots file
│
└── public/                    # Static assets
    ├── favicon.ico
    ├── favicon.svg
    ├── favicon-48x48.png
    ├── og-image.png           # Social sharing image
    └── _redirects             # SPA routing rules
```

---

## Build & Development Commands

### Development
```bash
# Start both frontend and backend concurrently
npm run dev

# Or run separately:
npm run server    # Backend on http://localhost:3001
npm run vite      # Frontend on http://localhost:5173
```

### Production Build
```bash
# Build frontend for production
npm run build

# This runs:
# 1. vite build (creates dist/ folder)
# 2. node scripts/prerender.js (prerenders pages)
# 3. node scripts/verify-prerender.js (verifies output)
# 4. node scripts/generate-sitemap.js (creates sitemap)
```

### Production Serve
```bash
# Serve production build
npm start         # Runs node server/server.js
```

### Vite Proxy Configuration
During development, API requests are proxied:
- `/api/*` → `http://localhost:3001`

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# Replicate API Token (AI analysis)
# Get from: https://replicate.com/account/api-tokens
# Costs ~$0.0001-0.0002 per analysis
REPLICATE_API_TOKEN=your_token_here

# Giphy API Key (for Trump GIFs)
# Get from: https://developers.giphy.com/
GIPHY_API_KEY=your_key_here

# NASA FIRMS API Key (satellite fire data)
# Register free at: https://firms.modaps.eosdis.nasa.gov/
NASA_FIRMS_KEY=your_key_here

# Server Port (default: 3001)
PORT=3001
```

**Note:** The app works without API keys using fallback/mock data, but functionality will be limited.

---

## API Endpoints

| Endpoint | Method | Description | Cache TTL |
|----------|--------|-------------|-----------|
| `/api/health` | GET | Health check + env status | None |
| `/api/news` | GET | Latest news (RSS + GDELT merged) | 5 min |
| `/api/attacks` | GET | Confirmed attacks for map | 1 min |
| `/api/analyze` | POST | Analyze headline with AI | None |
| `/api/chat` | POST | Chat with AI analyst | None |
| `/api/state` | GET | Current game state (HP/tension) | 1 min |
| `/api/state/refresh` | POST | Refresh game state with latest | None |
| `/api/memes` | GET | Analyzed news with memes | 5 min |
| `/api/polymarket` | GET | Prediction market data | 1 min |
| `/api/fires` | GET | NASA FIRMS fire data | 30 min |
| `/api/ticker` | GET | Comic ticker headlines | 5 min |
| `/api/markets` | GET | Financial market data | 1 min |
| `/api/trump-gif` | GET | Trump reaction GIF | 1 min |
| `/api/alert/dismiss` | POST | Clear breaking alert | None |

---

## Code Style Guidelines

### JavaScript/React
- Use ES6+ syntax (project uses ES modules)
- Functional components with hooks
- Async/await for asynchronous operations
- Destructuring for props

### Naming Conventions
- Components: PascalCase (e.g., `WW3Counter.jsx`)
- Utilities/Hooks: camelCase (e.g., `useGameState.js`)
- Constants: UPPER_SNAKE_CASE
- CSS Classes: kebab-case (e.g., `health-bar-container`)

### Tailwind Usage
- Mobile-first responsive design
- Custom classes in `index.css` for complex components
- Use `comic-panel` for card styling
- Use `font-heading` for bold uppercase text
- Use `font-body` for body text
- Use `font-mono` for monospace/code

### File Organization
- One component per file
- Related components can be grouped in subdirectories (e.g., `Blog/`)
- Export from index.js for clean imports

---

## Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Background | `#0d0d12` | Page background |
| Primary | `#3b82f6` (blue) | US side, links |
| Secondary | `#ef4444` (red) | Iran side, danger |
| Warning | `#fbbf24` (amber) | Alerts, highlights |
| Success | `#22c55e` (green) | Positive indicators |
| Panel BG | `rgba(20, 20, 28, 0.8)` | Card backgrounds |

### Typography
- **Headings:** `font-heading` (Space Grotesk) - Bold, uppercase, letter-spacing
- **Body:** `font-body` (Inter) - Regular weight
- **Monospace:** `font-mono` (JetBrains Mono) - Stats, timestamps

### Key CSS Classes
```css
.comic-panel        /* Card with border and backdrop blur */
.bg-grid            /* Subtle grid background pattern */
.health-bar-container  /* HP bar wrapper */
.section-header     /* Consistent section titles */
.hover-lift         /* Subtle hover animation */
.glass              /* Glass morphism effect */
.prose-invert       /* Blog content styling */
```

---

## State Management

### Frontend State
- React hooks (useState, useEffect) for component state
- localStorage for client-side caching (see `src/lib/api.js`)
- No global state library (Redux/Zustand not used)

### Backend State
- In-memory state for game state (HP, tension, alerts)
- No database - all data ephemeral or from external APIs
- RSS cache refreshed every 5 minutes
- Tension decays 2% every 10 minutes automatically

### Caching Strategy
1. **Server-side:** In-memory Map with TTL
2. **Client-side:** localStorage with CACHE_KEYS
3. **Build-time:** Prerendered static pages

---

## Game State Logic

### HP Bar Calculation
```javascript
// From news analysis scores
usScoreDelta += score * 2;      // Positive = US wins
iranScoreDelta += Math.abs(score) * 2;  // Negative = Iran wins

// Applied with dampening (30% of calculated value)
newHP = currentHP + (delta * 0.3)
newHP = clamp(newHP, 10, 100)   // Min 10%, max 100%
```

### Tension Calculation
```javascript
// Based on severity from AI analysis
high severity    → +5% tension
medium severity  → +2% tension
low severity     → +0.5% tension

// Decay over time
Every 10 minutes: tension -= 2% (minimum 35%)
```

### Breaking Alerts
Triggered when `severity === 'high'` in analyzed news.
Auto-dismisses after 30 seconds.

---

## Known Issues & Limitations

### Critical
1. **GlobalParticipantsCarousel shows STATIC DATA** - Lines 38-76 hardcode Trump/Iran stats
2. **Iran card shows "CONTENT NOT AVAILABLE"** - Broken Giphy URL in line 9
3. **Some GIFs may be rate-limited** - Giphy API has limits

### Medium
4. **Circuit Breaker** - May trigger too easily, showing "TRADING HALTED"
5. **Tension can spike to 100%** - Then decays slowly (by design)

### API Dependencies
- Replicate API is **CHEAPER** than Kimi (~$0.0001/request)
- Without API keys, app uses mock data
- NASA FIRMS requires free registration

---

## Deployment

### Platform: Railway.app
**Build Command:** `npm install && npm run build`  
**Start Command:** `node server/server.js`  
**Port:** 3001 (or $PORT env var)

### Build Process
1. `npm install` - Install dependencies
2. `npm run build` - Vite production build
3. `npm run postbuild` - Runs automatically:
   - Prerender static pages
   - Verify prerender output
   - Generate sitemap.xml

### Static Files
- `dist/` folder served by Express
- SPA catch-all route for client-side routing
- Prerendered HTML files for SEO routes

---

## SEO Strategy

### Prerendered Routes
- `/` (homepage)
- `/blog` and `/blog/:slug`
- `/ww3-probability`
- `/us-iran-war-tracker`
- `/iran-conflict-live`
- `/timeline`
- `/ww3-risk-calculator`
- `/is-ww3-happening`
- `/world-war-3-news`
- `/iran-nuclear-deal`

### SEO Components
- `SEO.jsx` - Meta tags, Open Graph, Twitter Cards
- `StructuredData.jsx` - JSON-LD schema markup
- Static content in `index.html` for crawlers
- Canonical URLs with cache-busting query params

### Google Analytics
- Tracking ID: `G-TV2FWQFE2E`
- **Kochi Exclusion:** Analytics blocked for visitors from Kochi, India
- Loaded asynchronously after geolocation check

---

## Testing

Currently, the project does **NOT** have automated tests. Manual testing checklist:

1. **Development:** `npm run dev` - Verify both servers start
2. **API Health:** `curl http://localhost:3001/api/health`
3. **Build:** `npm run build` - No Vite errors
4. **Prerender:** Check `dist/` has all route folders
5. **Production:** `npm start` - App serves correctly

---

## Security Considerations

1. **Environment Variables** - Never commit `.env` to git
2. **CORS** - Enabled for all origins (configured in server.js)
3. **API Keys** - Stored server-side only
4. **User Input** - Bad words filter used on chat/comments (`bad-words` package)
5. **Rate Limiting** - Not currently implemented (relies on Railway/nginx)

---

## Contributing Guidelines

1. **Code Style:** Follow existing patterns in the codebase
2. **Components:** Create in `src/components/`, export in index if in subdirectory
3. **API Routes:** Add to `server/server.js` following existing patterns
4. **Environment:** Copy `.env.example` to `.env` for local development
5. **Build:** Verify `npm run build` succeeds before committing

---

## Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Server won't start:**
- Check if PORT 3001 is available
- Verify `.env` file exists (can be empty)

**API calls failing:**
- Check backend is running: `npm run server`
- Verify Vite proxy in `vite.config.js`

**Tension stuck at 100%:**
- Normal behavior - decays 2% every 10 minutes
- Or restart server to reset

---

## Changelog

- **2026-03-16** - Updated AGENTS.md with comprehensive documentation
- **2026-03-14** - Reverted to pre-redesign state (commit `b80dd0d`)
- **Earlier** - Initial dashboard creation

---

## Contact & Resources

- **Domain:** https://ww3tracker.live
- **Repository:** Private
- **Deployment:** Railway.app

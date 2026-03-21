# WW3 Tracker - Agent Documentation

## Project Overview

**Name:** WW3 Tracker  
**Domain:** ww3tracker.live  
**Platform:** Railway (Node.js backend + React frontend)  
**Purpose:** Educational conflict monitor for the US-Iran war (Mar 17-18, 2026)

**Last Updated:** 2026-03-18 (Brutal Simplification Complete)

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
| react-helmet-async | SEO meta tags |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express.js | Web framework |
| node-fetch | HTTP requests |
| cors | Cross-origin support |
| dotenv | Environment configuration |

### External APIs
| Service | Data Provided | Status |
|---------|---------------|--------|
| NASA FIRMS | Satellite fire detection | Optional (has fallback) |
| Giphy | Reaction GIFs | Optional |
| Telegram Bot API | Admin publishing bot | Required for bot |

### Telegram Bot
| Property | Value |
|----------|-------|
| Username | @ww3tracker_live_bot (configured) |
| Purpose | Admin attack publishing |
| Env Var | `TELEGRAM_BOT_TOKEN` |

**Commands:**
- `/addattack` - Interactive attack entry (step-by-step wizard)
- `/quickadd <data>` - Fast entry (pipe-separated format)
- `/status` - Show publisher status
- `/pending` - List scheduled jobs
- `/cancel <jobId>` - Cancel pending job
- `/help` - Show help

### Data Sources (Verified Manual)
| Source | Type | Update Method |
|--------|------|---------------|
| `server/data/verifiedAttacks.js` | Manually curated attack database | Admin updates |

**Note:** RSS feeds and AI news aggregation have been removed. Only 100% verified data.

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
│  │   Express    │  │  API Routes  │  │  Static Data │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Conflict Map (Verified Attacks)**
   ```
   verifiedAttacks.js → /api/attacks → ConflictMap
   ```
   - Source: `server/data/verifiedAttacks.js` (12 attacks, Mar 17-18, 2026)
   - No expiration - attacks remain permanently

2. **Key Developments Feed**
   ```
   Hardcoded data → KeyDevelopmentsFeed
   ```
   - Shows 3 significant events with "Why This Matters"

3. **NASA FIRMS Fire Data**
   ```
   NASA API → /api/fires → NasaFirmsStrip
   ```
   - Mock data fallback if API unavailable

---

## Project Structure

```
├── index.html                 # Main HTML template with inline SEO
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS theme
├── postcss.config.js          # PostCSS setup
├── railway.json               # Railway deployment config
├── .env.example               # Environment variable template
├── README.md                  # Human-readable docs
├── AGENTS.md                  # This file - AI agent docs
│
├── server/                    # Backend code
│   ├── server.js              # Express server entry point
│   ├── data/                  # Data storage
│   │   ├── verifiedAttacks.js     # 12 verified attacks
│   │   ├── conflictZones.js       # Zone definitions
│   │   └── subscribers.json       # Email subscribers
│   ├── models/
│   │   └── subscriber.js          # Subscriber model
│   └── services/
│       ├── alertService.js        # Email templates
│       ├── attackParser.js        # Parse Claude's structured output
│       ├── autoPublisher.js       # Website publishing + tweet scheduling
│       ├── gameStateService.js    # HP bars, tension (legacy)
│       ├── locationService.js     # Geocoding
│       ├── nasaFirmsService.js    # Satellite data
│       └── telegramBot.js         # Telegram admin bot
│
├── src/                       # Frontend source code
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Main app with routing
│   ├── index.css              # Global styles + Tailwind
│   │
│   ├── components/            # React components
│   │   ├── WW3Counter.jsx         # WW3 probability display
│   │   ├── BreakingAlert.jsx      # Breaking news alert
│   │   ├── ConflictMap.jsx        # D3 interactive map
│   │   ├── KeyDevelopmentsFeed.jsx# Significant events
│   │   ├── HumanImpactDashboard.jsx# Casualties/infrastructure
│   │   ├── ConflictEscalationTimeline.jsx # Causation chain
│   │   ├── NasaFirmsStrip.jsx     # Satellite fire strip
│   │   ├── EmailSignup.jsx        # Compact email signup
│   │   ├── SEO.jsx                # SEO component wrapper
│   │   └── Blog/                  # Blog-specific components
│   │
│   ├── pages/                 # Page components (routes)
│   │   ├── WW3ProbabilityPage.jsx     # (redirected)
│   │   ├── UsIranWarTrackerPage.jsx   # (redirected)
│   │   ├── IranConflictLivePage.jsx   # (redirected)
│   │   ├── BlogPage.jsx               # WW3 News/Blog
│   │   ├── BlogPostPage.jsx           # Individual blog post
│   │   ├── IsWW3HappeningPage.jsx     # SEO landing
│   │   ├── WorldWar3NewsPage.jsx      # SEO landing
│   │   ├── IranNuclearDealPage.jsx    # SEO landing
│   │   ├── IranUSConflictPage.jsx     # Conflict landing
│   │   ├── IsraelHezbollahPage.jsx    # Conflict landing
│   │   └── PakAfghanConflictPage.jsx  # Conflict landing
│   │
│   ├── lib/                   # Utilities & API clients
│   │   ├── api.js             # Frontend API client
│   │   └── utils.js           # Utility functions
│   │
│   └── data/                  # Static data
│       └── blogPosts.js       # Blog post content
│
├── dist/                      # Production build output
└── public/                    # Static assets
    ├── logo/                  # Logo files
    ├── images/                # Blog images
    └── favicon.*              # Favicon files
```

---

## Build & Development

### Development
```bash
npm run dev    # Start both frontend and backend
```

### Production Build
```bash
npm run build  # Build frontend for production
npm start      # Start production server
```

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# Optional - for NASA FIRMS satellite data
NASA_FIRMS_KEY=your_key_here

# Optional - for Trump GIFs
GIPHY_API_KEY=your_key_here

# Optional - for Telegram Bot (admin publishing)
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here

# Server Port (default: 3001)
PORT=3001

# ============================================
# EMAIL ALERT SERVICE (Optional)
# ============================================
# SMTP Provider Settings - Gmail, SendGrid, AWS SES, etc.
# SendGrid free tier: 100 emails/day

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=alerts@ww3tracker.live

# Email batching interval (ms, default: 1 hour = 3600000)
EMAIL_BATCH_INTERVAL=3600000
```

**Note:** The app works without API keys using fallback/mock data.

### Email Alert Service

The email service batches HIGH and MEDIUM severity attacks into hourly digest emails:

- **HIGH severity** → 🔴 Red badge in email
- **MEDIUM severity** → 🟠 Orange badge in email  
- **LOW severity** → No email (site-only)

**SMTP Providers:**
| Provider | Setup | Free Tier |
|----------|-------|-----------|
| SendGrid | `smtp.sendgrid.net` | 100 emails/day |
| Gmail | `smtp.gmail.com` | 500 emails/day |
| AWS SES | `email-smtp.*.amazonaws.com` | 62,000 emails/month |

**API Endpoints:**
```
GET  /api/email/status         - Queue status
POST /api/email/test           - Send test email
POST /api/email/send-batch     - Trigger batch send (admin)
POST /api/email/clear-queue    - Clear pending queue (admin)
POST /api/email/verify-smtp    - Verify SMTP configuration
```

---

## Navigation Structure

### Current Nav (4 Items)
```
Home | Live Map | WW3 News | ☢️ Nuke Sim
```

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Dashboard with map, developments, impact, timeline |
| `/live-map` | LiveMapPage | Full-screen conflict map |
| `/blog` | BlogPage | WW3 News articles |
| `/nuke` | (static) | Nuclear blast calculator |

### Deleted Pages (Redirect to Home)
- `/conflict-tracker` → `/live-map`
- `/live-monitor` → `/live-map`
- `/global-risk-monitor` → `/`
- `/ww3-risk-calculator` → `/`
- `/why-conflicts-happen` → `/blog`
- `/relationships` → `/blog`
- `/multi-conflict-timeline` → `/`

---

## Homepage Sections (Top to Bottom)

1. **WW3 Counter** — Probability percentage display
2. **Conflict Map** — Full-width D3 map with attack markers
3. **Key Developments Feed** — 3 curated events with "Why This Matters"
4. **Human Impact Dashboard** — Casualties, displaced, infrastructure
5. **Conflict Escalation Timeline** — Visual causation chain
6. **Email Signup** — Compact subscribe form
7. **Disclaimer** — Footer with links

---

## Verified Attack Database

### Current Attacks: 12 (Mar 17-18, 2026)

**US-Iran War:**
- Tehran (2 Israeli airstrikes)
- Bandar Abbas (US airstrike)
- Tel Aviv (2 Iranian missile strikes)
- Kuwait City (Iranian missiles)
- Doha (Iranian missile intercepted)
- Baghdad (2 attacks on US Embassy/residential)

**Israel-Hezbollah:**
- Beirut (2 Israeli airstrikes)
- Tyre (Israeli airstrikes)

### Database Location
```
server/data/verifiedAttacks.js
```

### Schema
```javascript
{
  id: '2026-03-17-tehran-leadership',
  headline: 'Israeli precision airstrike on senior Iranian leadership in Tehran',
  description: 'Central govt district / security zone...',
  location: 'Tehran',
  country: 'Iran',
  attackType: 'airstrike',
  severity: 'high',
  date: '2026-03-17T12:00:00Z',
  coordinates: { lat: 35.6892, lng: 51.3890 },
  conflictZone: 'us-iran-war-2026'
}
```

---

## Auto-Publisher Pipeline

**Purpose:** Automated attack publishing from admin confirmation to deployment

**File:** `server/services/autoPublisher.js`

### Pipeline Steps

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTO-PUBLISHER PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│ 1. VALIDATE  → Check required fields, confidence level          │
│ 2. DATABASE  → Add attack, persist to verifiedAttacks.js        │
│ 3. SITEMAP   → Regenerate sitemap.xml with new attack URL       │
│ 4. GIT       → Commit changes, push to origin/main              │
│ 5. RAILWAY   → Auto-deploy triggered by git push                │
│ 6. SCHEDULE  → Queue tweets/emails based on confidence          │
└─────────────────────────────────────────────────────────────────┘
```

### Confidence Levels

| Level | Tweet Timing | Email | Label |
|-------|-------------|-------|-------|
| `HIGH` | 15 minutes | Immediate | Verified |
| `MEDIUM` | 30 minutes | Immediate | Awaiting confirmation |
| `LOW` | No tweet | No email | Unverified (site only) |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/publisher/publish` | Publish new attack (full pipeline) |
| GET | `/api/publisher/status` | Get publisher stats and logs |
| GET | `/api/publisher/jobs` | List pending tweet/email jobs |
| POST | `/api/publisher/jobs/:jobId/cancel` | Cancel scheduled job |

### Telegram Bot Integration

**File:** `server/services/telegramBot.js`

**Commands:**
- `/addattack` - Interactive attack entry (step-by-step)
- `/quickadd <data>` - Fast entry with pipe-separated format
- `/status` - Check publisher status
- `/pending` - List scheduled jobs
- `/cancel <jobId>` - Cancel a pending job
- `/help` - Show all commands

**Quick Add Format:**
```
/quickadd Headline | Location | Country | Lat,Lng | Type | Severity | Confidence

Example:
/quickadd Israeli airstrike on Tehran | Tehran | Iran | 35.6892,51.3890 | airstrike | high | HIGH
```

### Scheduler

**File:** `server/services/scheduler.js`

Simple in-memory scheduler using `setTimeout` for MVP. Supports:
- Delayed tweet posting
- Email alert batching
- Job cancellation
- Stats tracking

---

## Code Style Guidelines

### JavaScript/React
- Use ES6+ syntax (project uses ES modules)
- Functional components with hooks
- Async/await for asynchronous operations

### Naming Conventions
- Components: PascalCase (e.g., `WW3Counter.jsx`)
- Utilities/Hooks: camelCase (e.g., `useGameState.js`)
- Constants: UPPER_SNAKE_CASE

### Tailwind Usage
- Mobile-first responsive design
- Custom classes in `index.css` for complex components
- Use `comic-panel` for card styling (legacy name)

---

## Security Considerations

1. **Environment Variables** - Never commit `.env` to git
2. **CORS** - Enabled for all origins
3. **API Keys** - Stored server-side only
4. **User Input** - Basic validation on email signup

---

## Deployment

### Platform: Railway.app
**Build Command:** `npm install && npm run build`  
**Start Command:** `node server/server.js`  
**Port:** 3001 (or $PORT env var)

### Build Process
1. `npm install` - Install dependencies
2. `npm run build` - Vite production build
3. `npm run postbuild` - Prerender static pages, generate sitemap

---

## Changelog

### 2026-03-20 - Email Alert Service
- **New service:** Hourly batch email alerts for HIGH/MEDIUM severity attacks
- **Files added:**
  - `server/services/emailService.js` - Main email service with nodemailer
  - `server/routes/emailRoutes.js` - API endpoints for email management
- **Features:**
  - Batches multiple attacks into one email (hourly digest)
  - Only HIGH and MEDIUM confidence attacks trigger emails
  - LOW confidence = site-only (no email)
  - Professional HTML email templates with severity badges
  - Queue persistence across server restarts
  - Test email functionality
  - SMTP configuration verification
  - Support for Gmail, SendGrid, AWS SES

### 2026-03-20 - Auto-Publisher Pipeline
- **New system:** Complete attack publishing pipeline from admin confirmation to deployment
- **Files added:**
  - `server/services/autoPublisher.js` - Main pipeline controller
  - `server/services/scheduler.js` - Tweet/email scheduling service
  - `server/services/telegramBot.js` - Telegram bot for admin publishing
- **Pipeline Steps:**
  1. Validate attack data
  2. Update database (verifiedAttacks.js)
  3. Persist to disk
  4. Regenerate sitemap
  5. Git commit and push
  6. Railway auto-deploy
  7. Schedule tweets/emails based on confidence
- **Features:**
  - Interactive `/addattack` command (step-by-step wizard)
  - Fast `/quickadd` command (pipe-separated format)
  - Confidence levels: HIGH (15min), MEDIUM (30min), LOW (no tweet)
  - Duplicate detection (6-hour window)
  - Job management: `/status`, `/pending`, `/cancel`
  - API endpoints for programmatic publishing
  - Comprehensive logging for debugging

### 2026-03-18 - BRUTAL SIMPLIFICATION
- **Deleted 8 pages:** Conflict Tracker, Live Monitor, Global Risk Monitor, WW3 Risk Calculator, Why Conflicts Happen, Relationships, Multi-Conflict Timeline, Data Methodology
- **Simplified nav:** 4 items only (Home, Live Map, WW3 News, Nuke Sim)
- **Removed features:** TimelineOfChaos, Risk Calculator, Relationships diagrams
- **Added redirects:** All deleted pages redirect to home/blog
- **Map improvements:** Bold countries + lighter cities labels
- **Email signup:** Ultra-compact design

### 2026-03-18 - Database Update
- **Reduced attacks:** 22 → 12 (Mar 17-18, 2026 only)
- **Removed:** Pak-Afghan conflict (not part of current war)
- **Added:** Precise location context for each attack

### Earlier Changes
- Header redesign with "More" dropdown
- Full-width conflict map with horizontal cards
- KeyDevelopmentsFeed with "Why This Matters"
- HumanImpactDashboard with data warnings
- ConflictEscalationTimeline with causation chains
- Email Alert System
- Verified manual data system (removed RSS/AI)

---

## Contact

- **Domain:** https://ww3tracker.live
- **Repository:** Private (GitHub)
- **Deployment:** Railway.app

# WW3 Tracker 2.0 - FREE Plan (No Flight Tracking)
## Simplified Zero-Cost Architecture

---

## 💰 NEW COST: $0/month (Down from $250-700)

By removing flight tracking, we eliminate:
- ❌ FlightRadar24 API (€49-499/mo)
- ❌ Airport data complexity
- ❌ NOTAM scraping
- ❌ Airspace restriction layers

**What's left is purely conflict monitoring - which is FREE!**

---

## 🆓 FREE DATA STACK

### 1. Conflict Events (100% FREE)

| Source | Cost | Data | Refresh |
|--------|------|------|---------|
| **GDELT** | Free | Global news events with geo-coordinates | 15 min |
| **ACLED** | Free (academic) | Verified conflict incidents, fatalities | 24 hours |
| **Liveuamap** | Free (scrape) | Crowdsourced conflict events | 30 min |
| **Crisis24 RSS** | Free | Security alerts, incidents | Real-time |
| **NewsAPI** | Free (100 req/day) | Breaking news headlines | 15 min |

**Verification Rule:** Need 2+ sources to show on globe

---

### 2. Visualization (100% FREE)

| Component | Solution | Cost |
|-----------|----------|------|
| **Globe** | D3.js + Natural Earth projection | $0 |
| **Map Tiles** | CartoDB Dark Matter (free tier) | $0 |
| **Markers** | SVG/CSS animated pulses | $0 |
| **Time Scrubber** | HTML5 range slider + D3 transitions | $0 |

---

### 3. Infrastructure (100% FREE)

| Service | Provider | Limits |
|---------|----------|--------|
| **Frontend** | Vercel Free | 100GB bandwidth |
| **Backend** | Railway Free | $5 credit = runs 24/7 |
| **Database** | Supabase Free | 500MB, auto-pause |
| **Caching** | Browser localStorage | Unlimited (client-side) |

---

## 🌍 SIMPLIFIED ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│              FREE CONFLICT TRACKER (No Flights)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   DATA COLLECTION (Every 15 minutes)                            │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│   │    GDELT     │  │ Liveuamap    │  │ Crisis24     │         │
│   │    (Geo)     │  │ (Scrape)     │  │ (RSS)        │         │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│          │                  │                  │                │
│          └──────────────────┼──────────────────┘                │
│                             │                                   │
│                             ▼                                   │
│                  ┌──────────────────────┐                       │
│                  │   MERGE & VERIFY     │                       │
│                  │   (2+ sources req)   │                       │
│                  └──────────┬───────────┘                       │
│                             │                                   │
│                             ▼                                   │
│                  ┌──────────────────────┐                       │
│                  │   Supabase (Free)    │                       │
│                  │   • conflict_events  │                       │
│                  │   • locations        │                       │
│                  │   • 30-day history   │                       │
│                  └──────────┬───────────┘                       │
│                             │                                   │
│                             ▼                                   │
│   FRONTEND                                                    │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  Vercel (Free)                                       │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────────────┐  │     │
│   │  │           🌍 D3.js SPINNING GLOBE              │  │     │
│   │  │                                                  │  │     │
│   │  │     🔴 Red dots = Active conflicts              │  │     │
│   │  │     🟡 Yellow = Last 24 hours                   │  │     │
│   │  │                                                  │  │     │
│   │  │     ◀── Time Slider: NOW vs 7 DAYS ──▶         │  │     │
│   │  │                                                  │  │     │
│   │  └────────────────────────────────────────────────┘  │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────────────┐  │     │
│   │  │  📊 WW3 PROBABILITY: 61%                       │  │     │
│   │  │     [Polymarket + Manual Analysis]             │  │     │
│   │  └────────────────────────────────────────────────┘  │     │
│   │                                                      │     │
│   │  ┌────────────────────────────────────────────────┐  │     │
│   │  │  🔥 BREAKING EVENTS (Last 15 min)              │  │     │
│   │  │  • Explosion reported in Tehran...             │  │     │
│   │  │  • US carrier enters Gulf...                   │  │     │
│   │  └────────────────────────────────────────────────┘  │     │
│   │                                                      │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 VISUAL DESIGN

### Hero Section (Above Fold)
```
┌───────────────────────────────────────────────────────────────┐
│ WW3 LIVE CONFLICT MONITOR                          [LIVE 🔴]  │
│                                                               │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │                                                         │   │
│ │                    🌍 D3 GLOBE                          │   │
│ │              (Spinning, interactive)                    │   │
│ │                                                         │   │
│ │     🔴 Tehran        🔴 Gaza         🟡 Kiev           │   │
│ │     (Explosion)     (Airstrike)    (Shelling)          │   │
│ │                                                         │   │
│ │         ◀────── Time Slider ──────▶                   │   │
│ │              NOW ←────────→ 7 DAYS AGO                  │   │
│ │                                                         │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                               │
│  📍 ACTIVE ZONES:                                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │  🇮🇷 Iran   │ │  🇺🇦 Ukraine│ │  🇮🇱 Israel │               │
│  │  12 events │ │   3 events │ │   8 events │               │
│  │  🔴 Hot    │ │  🟡 Warm   │ │  🔴 Hot    │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│                                                               │
│  📊 WW3 PROBABILITY: 61% ▓▓▓▓▓▓▓▓░░░░  ↑ +3% (24h)          │
│  Based on: Polymarket | News sentiment | Military activity   │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW

### Every 15 Minutes:
```javascript
// 1. Fetch from free sources
const [gdelt, liveuamap, crisis24] = await Promise.all([
  fetchGDELT(),      // Free API
  scrapeLiveuamap(), // Free scrape
  fetchCrisisRSS()   // Free RSS
]);

// 2. Merge and deduplicate
const allEvents = mergeSources([gdelt, liveuamap, crisis24]);

// 3. Verify (need 2+ sources)
const verified = allEvents.filter(e => e.sources.length >= 2);

// 4. Geocode if needed
const withCoords = await geocodeEvents(verified);

// 5. Save to Supabase
await saveToDatabase(withCoords);

// 6. Broadcast to connected clients
broadcastNewEvents(withCoords);
```

---

## 📊 WHAT USERS SEE

### On Page Load:
1. **Spinning globe** centered on Middle East
2. **Red dots** pulsing at active conflict locations
3. **WW3 probability score** (from Polymarket - free API)
4. **Breaking events** list (last 3 events)
5. **Time scrubber** defaulting to "NOW"

### Interactions:
- **Click a red dot** → Show event details, sources, timeline
- **Drag globe** → Rotate to see other regions
- **Time slider** → See conflicts from yesterday/last week
- **Click zone card** → Filter globe to that region

---

## 🛠️ TECH STACK

### Frontend:
```javascript
// D3.js Globe (FREE)
import * as d3 from 'd3';
import { geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

// World topology (free, 200KB)
import worldData from './data/world-110m.json';
```

### Backend:
```javascript
// Node.js + Express (FREE on Railway)
import express from 'express';
import { createClient } from '@supabase/supabase-js';

// GDELT fetch (FREE, no API key)
const fetchGDELT = async () => {
  const res = await fetch('https://api.gdeltproject.org/api/v2/geo/geo?query=iran+conflict&mode=pointdata');
  return res.json();
};
```

### Database:
```sql
-- Supabase Free (PostgreSQL)
CREATE TABLE conflict_events (
  id UUID DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  latitude FLOAT,
  longitude FLOAT,
  severity INT, -- 1-10
  region TEXT, -- 'iran', 'ukraine', 'gaza'
  sources TEXT[], -- ['gdelt', 'liveuamap']
  event_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT false
);
```

---

## ✅ FEATURES INCLUDED (FREE)

| Feature | Status |
|---------|--------|
| 🌍 Interactive conflict globe | ✅ FREE |
| 🔴 Real-time(ish) event markers | ✅ FREE (15-min delay) |
| 🎚️ Time scrubber (7 days) | ✅ FREE |
| 📊 WW3 probability score | ✅ FREE (Polymarket API) |
| 🔥 Breaking news feed | ✅ FREE (GDELT + RSS) |
| 📍 Region filtering | ✅ FREE |
| 📱 Mobile responsive | ✅ FREE |
| 🔄 Auto-refresh | ✅ FREE (SSE) |
| 📈 Historical timeline | ✅ FREE (30 days) |

---

## ❌ FEATURES REMOVED

| Feature | Reason |
|---------|--------|
| ✈️ Airport status | Too complex, requires paid APIs |
| 🛫 Flight tracking | Expensive, not core value |
| 🌐 Airspace maps | Needs aviation-specific data |
| 🏥 Evacuation routes | Requires real-time ground truth |

---

## 🚀 IMPLEMENTATION TIMELINE

### Week 1: Foundation
- [ ] Remove Circuit Breaker, HP bars, War Room Chat
- [ ] Set up Supabase free project
- [ ] Set up Railway free backend
- [ ] Configure UptimeRobot keep-alive

### Week 2: Data Pipeline
- [ ] GDELT integration (free API)
- [ ] Liveuamap scraping
- [ ] Crisis24 RSS feed
- [ ] Event verification logic (2+ sources)

### Week 3: The Globe
- [ ] D3.js spinning globe
- [ ] CartoDB free tiles
- [ ] Event marker rendering
- [ ] Click interactions

### Week 4: Time & Polish
- [ ] Time scrubber component
- [ ] 7-day history playback
- [ ] Breaking events list
- [ ] Mobile optimization

**Total: 4 weeks to launch FREE version**

---

## 🎯 SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Globe load time | < 3 seconds |
| Event latency | < 30 minutes |
| Daily active users | 500+ (free tier limit: 10k) |
| Bounce rate | < 60% |
| Time on site | > 2 minutes |

---

## 💡 WHY THIS WORKS

1. **Focused scope:** Just conflict tracking, nothing else
2. **Proven free data:** GDELT is used by researchers globally
3. **Simple tech:** D3.js is battle-tested, lightweight
4. **No API costs:** All data sources are free or scrapable
5. **Maintainable:** 4-week build, easy to maintain

---

## 🎮 GAMIFICATION ELEMENTS (Still Included)

- ✅ WW3 Probability meter (from Polymarket - free)
- ✅ Hot/Warm/Cold zone indicators
- ✅ Event severity scores (1-10)
- ✅ Time playback (rewind conflicts)
- ✅ Region cards (Iran, Ukraine, Israel)

**Gone:**
- ❌ HP bars (confusing)
- ❌ Circuit Breaker (useless)
- ❌ VS battle mode (too game-like)
- ❌ War Room Chat (unmoderated noise)

---

**Ready to build this?**

Next steps:
1. **Start removing** Circuit Breaker, HP bars, War Room Chat (today)
2. **Set up** Supabase + Railway free tiers (this week)
3. **Build** GDELT data pipeline (next week)
4. **Create** D3.js globe prototype (week 3)

Want me to start with #1 right now?

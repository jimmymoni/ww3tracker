# WW3 Tracker - FREE TIER Implementation Plan
## Zero-Cost Architecture with Tradeoffs

---

## 💰 FREE vs PAID Comparison

| Feature | PAID Cost | FREE Alternative | Tradeoff |
|---------|-----------|------------------|----------|
| **ACLED Data** | $100/mo | Free academic API | 2-hour delay on new data |
| **FlightRadar24** | €49-499/mo | ADS-B Exchange (free) | Slower updates, less coverage |
| **Map Tiles** | $50/mo | OpenStreetMap + Carto | Slower loading, rate limits |
| **Hosting** | $20/mo | Railway/Render Free Tier | Sleeps after inactivity, cold start delay |
| **Database** | $15/mo | Supabase Free Tier | 500MB limit, pauses after 7 days inactivity |
| **Redis** | $15/mo | Upstash Free | 10k requests/day limit |
| **WebSocket** | $10/mo | Server-Sent Events (SSE) | One-way only (server→client) |
| **TOTAL** | **~$250-700/mo** | **$0/mo** | Some latency & limits |

---

## 🆓 FREE ALTERNATIVES BREAKDOWN

### 1. CONFLICT DATA (Replace ACLED)

#### ✅ FREE: GDELT + NewsAPI + Web Scraping
```javascript
// FREE conflict data pipeline
const fetchConflictData = async () => {
  // 1. GDELT (free, 15-min delay acceptable)
  const gdelt = await fetch('https://api.gdeltproject.org/api/v2/geo/geo?query=conflict&mode=pointdata');
  
  // 2. Crisis24/RSS (free)
  const crisis24 = await fetchRssFeed('https://crisis24.garda.com/rss');
  
  // 3. Liveuamap (scraping - free but respect robots.txt)
  const liveuamap = await scrapeLiveuamap();
  
  // Merge & deduplicate
  return mergeSources([gdelt, crisis24, liveuamap]);
};
```

**Tradeoffs:**
- ❌ 15-30 min delay vs real-time
- ❌ Need to build scrapers (maintenance)
- ✅ $0 cost
- ✅ Multiple sources = better verification

---

### 2. AIRPORT STATUS (Replace FlightRadar24)

#### ✅ FREE: OurAirports + NOTAMs + Scraping
```javascript
// FREE airport status sources
const getAirportStatus = async () => {
  // 1. OurAirports API (free, open source)
  const airports = await fetch('https://ourairports-api.appspot.com/airports.json');
  
  // 2. FAA NOTAMs (free API for US, scrape for others)
  const notams = await fetch('https://notams.aim.faa.gov/notamSearch/search');
  
  // 3. FlightAware flight tracking (free widget/embed)
  const cancellations = await scrapeFlightAware();
  
  // 4. Wikipedia airport pages (check for closure notices)
  const wikiStatus = await checkWikipediaAirports();
};
```

**Tradeoffs:**
- ❌ Less accurate than FlightRadar24
- ❌ No real-time aircraft positions
- ❌ Manual verification needed
- ✅ Free forever
- ✅ Still useful for major closures

---

### 3. MAP TILES (Replace Mapbox)

#### ✅ FREE: OpenStreetMap + Leaflet + Self-hosted
```javascript
// FREE map solution
import L from 'leaflet';

// Use free tile providers (respect usage limits!)
const FREE_TILES = {
  cartoDB: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  stamen: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};

// Rotate between them to avoid rate limits
const getTileUrl = () => {
  const providers = Object.values(FREE_TILES);
  return providers[Math.floor(Math.random() * providers.length)];
};
```

**Tradeoffs:**
- ❌ Slower loading (can cache to fix)
- ❌ Rate limits (~1000 req/day per provider)
- ❌ Less customization (no custom styles)
- ✅ $0 cost
- ✅ Works globally

**Hack for unlimited:** 
- Self-host tiles with `tileserver-gl` on free Railway tier
- Download region tiles once, serve forever
- ~10GB storage covers Middle East focus area

---

### 4. GLOBE VISUALIZATION (Replace expensive 3D)

#### ✅ FREE: D3.js + Natural Earth OR Three.js basic
```javascript
// Option A: D3.js geo projection (lightweight)
import * as d3 from 'd3';
import { geoOrthographic } from 'd3-geo';

// Animated spinning globe with SVG
const projection = geoOrthographic()
  .scale(250)
  .translate([width/2, height/2])
  .rotate([rotation, 0]);

// Add conflict markers as circles
const markers = svg.selectAll('circle')
  .data(conflicts)
  .enter()
  .append('circle')
  .attr('cx', d => projection([d.lon, d.lat])[0])
  .attr('cy', d => projection([d.lon, d.lat])[1])
  .attr('r', d => d.severity * 2)
  .attr('fill', 'red')
  .attr('opacity', 0.7);
```

**Tradeoffs:**
- ❌ Not "true" 3D (no zoom into terrain)
- ❌ Simpler visuals
- ✅ Works on mobile
- ✅ $0 cost
- ✅ Faster loading
- ✅ Still interactive (click, rotate, zoom)

#### FREE Three.js Alternative:
```javascript
// Option B: Ultra-light Three.js globe
import * as THREE from 'three';

// Use 2K texture (free NASA Blue Marble)
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/textures/earth-2k.jpg'); // ~2MB

// Low-poly sphere (lower vertex count = faster)
const geometry = new THREE.SphereGeometry(5, 32, 32); // 32 segments vs 128
const material = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(geometry, material);
```

**Tradeoffs:**
- ❌ Lower resolution textures
- ❌ Simpler atmosphere effects
- ✅ Still looks professional
- ✅ <5MB total assets

---

### 5. REAL-TIME UPDATES (Replace WebSocket)

#### ✅ FREE: Server-Sent Events (SSE) OR Polling
```javascript
// Option A: SSE (free, one-way streaming)
// Backend (Node.js)
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send event every 30 seconds
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(getLatestEvents())}\n\n`);
  }, 30000);
  
  req.on('close', () => clearInterval(interval));
});

// Frontend
const eventSource = new EventSource('/events');
eventSource.onmessage = (e) => {
  const event = JSON.parse(e.data);
  updateGlobe(event);
};
```

**Tradeoffs:**
- ❌ One-way only (server→client)
- ❌ Can't do "user clicked X" in real-time
- ✅ Works on free hosting
- ✅ Lower server load than WebSockets
- ✅ Automatic reconnection

#### Option B: Smart Polling (FREE)
```javascript
// Poll every 30 seconds when active
// Every 5 minutes when tab hidden
const pollInterval = document.hidden ? 300000 : 30000;

setInterval(async () => {
  const newEvents = await fetch('/api/events?since=' + lastCheck);
  if (newEvents.length > 0) {
    updateGlobe(newEvents);
    showNotification(newEvents[0]);
  }
}, pollInterval);
```

**Tradeoffs:**
- ❌ 30-second delay vs instant
- ❌ Uses more bandwidth
- ✅ Works everywhere
- ✅ Simpler to implement
- ✅ Can pause when tab inactive

---

### 6. HOSTING & DATABASE (FREE TIER STRATEGY)

#### ✅ FREE: Railway + Supabase + Vercel Combo

```
┌──────────────────────────────────────────────────────────────┐
│                     FREE TIER STACK                          │
├──────────────────────────────────────────────────────────────┤
│  Frontend: Vercel (Free)                                     │
│  • 100GB bandwidth                                           │
│  • 6,000 build minutes/month                                 │
│  • Perfect for React app                                     │
├──────────────────────────────────────────────────────────────┤
│  Backend API: Railway (Free)                                 │
│  • $5 credit/month (runs 24/7 for small app)                 │
│  • OR: Render Free Tier (sleeps after 15 min)                │
│     → Use UptimeRobot to ping every 14 min (keeps awake!)    │
├──────────────────────────────────────────────────────────────┤
│  Database: Supabase (Free Tier)                              │
│  • 500MB storage                                             │
│  • 2GB bandwidth                                             │
│  • Pauses after 7 days inactive (use UptimeRobot)            │
├──────────────────────────────────────────────────────────────┤
│  Caching: Upstash Redis (Free)                               │
│  • 10,000 commands/day                                       │
│  • Good for rate limiting & session cache                    │
└──────────────────────────────────────────────────────────────┘
```

**The "Keep Alive" Hack:**
```javascript
// Use UptimeRobot (free) to ping your services every 14 minutes
// This keeps Railway/Render/Supabase awake 24/7

// UptimeRobot pings:
// 1. https://ww3tracker-api.railway.app/health  (every 14 min)
// 2. https://ww3tracker-db.supabase.co/rest/v1/ (every 14 min)

// Result: Services stay warm, $0 cost
```

---

## 🎯 FREE TIER ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                    FREE DATA PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   GDELT      │    │  Liveuamap   │    │   RSS Feeds  │     │
│   │   (Free)     │    │  (Scrape)    │    │   (Free)     │     │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│          │                   │                   │              │
│          └─────────┬─────────┴─────────┬─────────┘              │
│                    │                   │                        │
│                    ▼                   ▼                        │
│            ┌──────────────────────────────────┐                 │
│            │    Merge & Verify (2+ sources)   │                 │
│            │    Runs every 15 minutes         │                 │
│            └──────────────────┬───────────────┘                 │
│                               │                                 │
│                               ▼                                 │
│            ┌──────────────────────────────────┐                 │
│            │   Supabase (Free DB)             │                 │
│            │   • Events table                 │                 │
│            │   • Airport status               │                 │
│            │   • Historical data (30 days)    │                 │
│            └──────────────────┬───────────────┘                 │
│                               │                                 │
│                               ▼                                 │
│            ┌──────────────────────────────────┐                 │
│            │   Railway API Server (Free)      │                 │
│            │   • REST API endpoints           │                 │
│            │   • SSE streaming                │                 │
│            └──────────────────┬───────────────┘                 │
│                               │                                 │
│                               ▼                                 │
│            ┌──────────────────────────────────┐                 │
│            │   Vercel Frontend (Free)         │                 │
│            │   • D3.js Globe                  │                 │
│            │   • Free map tiles               │                 │
│            └──────────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 FREE vs PAID: Feature Comparison

| Feature | PAID Version | FREE Version | Impact |
|---------|--------------|--------------|--------|
| **Data Latency** | < 2 minutes | 15-30 minutes | Medium |
| **Airport Accuracy** | Real-time | 1-4 hours delay | High for travelers |
| **Globe Quality** | HD 3D textures | SD/2D projection | Low (still functional) |
| **Update Speed** | Instant (WebSocket) | 30 sec (SSE) | Low |
| **Storage** | Unlimited | 500MB (30 days history) | Medium |
| **Uptime** | 99.9% | 99% (with keep-alive) | Low |
| **Cost** | $250-700/mo | **$0** | HUGE! |

---

## 🔧 IMPLEMENTATION PRIORITY (Free Tier)

### Phase 1: Free Foundation (Week 1)
- [ ] Set up Supabase free project
- [ ] Set up Railway free tier
- [ ] Configure UptimeRobot keep-alive
- [ ] Remove Circuit Breaker, HP bars
- [ ] Add data freshness badges

### Phase 2: Free Data Pipeline (Week 2)
- [ ] GDELT integration (free)
- [ ] NewsAPI integration (free tier: 100 req/day)
- [ ] RSS feed aggregation (free)
- [ ] Basic conflict verification (2 sources)

### Phase 3: Free Globe (Week 3-4)
- [ ] D3.js spinning globe (free)
- [ ] OpenStreetMap tiles (free)
- [ ] Event markers from GDELT data
- [ ] Simple time scrubber

### Phase 4: Free Travel Data (Week 5-6)
- [ ] OurAirports integration (free)
- [ ] NOTAM scraping (free)
- [ ] Wikipedia airport status check
- [ ] Manual verification system

---

## 💡 PRO TIPS FOR FREE TIER

### 1. **Cache Aggressively**
```javascript
// Cache everything in localStorage
const cacheKey = `events_${date}`;
const cached = localStorage.getItem(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const fresh = await fetchEvents();
localStorage.setItem(cacheKey, JSON.stringify(fresh));
return fresh;
```

### 2. **Use Service Workers**
```javascript
// Cache map tiles for offline use
// 100MB of cached tiles = fast loading
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
```

### 3. **Lazy Load Heavy Assets**
```javascript
// Only load globe when user scrolls to it
const { ref, inView } = useInView({
  triggerOnce: true,
  rootMargin: '100px'
});

{inView && <Globe3D />}
```

### 4. **Compress Everything**
```javascript
// Use compressed textures for globe
// 2K JPEG instead of 4K PNG
// Saves 80% bandwidth
```

---

## ⚖️ FINAL TRADEOFF SUMMARY

### What You LOSE (Free Tier):
- ⚠️ 15-30 min delay on conflict events (vs real-time)
- ⚠️ Less accurate airport data (1-4h delay)
- ⚠️ Simpler globe visuals (2D vs HD 3D)
- ⚠️ Limited historical data (30 days vs unlimited)
- ⚠️ Manual verification needed more often

### What You KEEP (Free Tier):
- ✅ Fully functional conflict tracker
- ✅ Working globe with event markers
- ✅ Airport status (major closures still caught)
- ✅ WW3 probability score
- ✅ Breaking news feed
- ✅ Time scrubber (last 7 days)
- ✅ Mobile responsive
- ✅ **$0/month**

### Who Should Use Free Tier:
- ✅ MVP/Launch phase
- ✅ Lower traffic (<10k users/day)
- ✅ Proving concept before scaling
- ✅ Personal/non-commercial project

### Who Should Upgrade:
- ❌ High traffic (>100k users/day)
- ❌ Critical real-time needs (embassy use)
- ❌ Commercial product with revenue
- ❌ Need 99.9% uptime SLA

---

## 🚀 RECOMMENDATION

**Start with FREE tier** - it's completely viable!

When you hit:
- 10k+ daily users
- Need <5 min data latency
- Revenue to cover costs

**Then** upgrade selectively:
- ACLED first ($100) for verified data
- Mapbox second ($50) for better maps
- FlightRadar24 last (only if travel feature is critical)

**Total realistic upgrade path:** $150/mo (not $700!)

---

**Want me to start building the FREE tier version?** 
I can begin with:
1. D3.js 2D globe (free, fast)
2. GDELT + RSS data pipeline (free)
3. Supabase + Railway setup (free)

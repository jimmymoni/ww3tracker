# WW3 Tracker 2.0 - Redesign Plan
## Live Conflict Globe + Real-Time Data Architecture

---

## 🎯 Core Philosophy

**"Mission Control for Global Conflict"**
- Gamification layer ON TOP of verified, real-time data
- Every number has a timestamp and source
- Users can verify the data themselves
- Practical features for people in affected regions

---

## 📡 DATA SOURCES & REFRESH RATES

### Tier 1: Real-Time (Updates every 1-5 minutes)
| Source | Data | Refresh | Use Case |
|--------|------|---------|----------|
| **GDELT** | Global news events, conflict mentions | 2 min | Breaking events on globe |
| **NASA FIRMS** | Satellite fire/heat signatures | 5 min | Explosions, fires, strikes |
| **ACLED** (new) | Verified conflict incidents | 5 min | Battle locations, casualties |
| **FlightRadar24 API** | Airport status, flight cancellations | 2 min | Airport closures for evacuations |
| **OpenSky Network** | Airspace restrictions | 5 min | No-fly zones |

### Tier 2: Near Real-Time (Updates every 15-30 minutes)
| Source | Data | Refresh | Use Case |
|--------|------|---------|----------|
| **Polymarket/Kalshi** | Prediction market odds | 15 min | WW3 probability score |
| **News APIs** (RSS + GDELT) | Breaking news aggregation | 10 min | Event timeline |
| **Twitter/X Lists** | Official sources (verified only) | 15 min | Government announcements |
| **USGS** | Seismic activity (nuclear tests) | 15 min | Underground explosions |

### Tier 3: Daily/Hourly (Updates every 1-6 hours)
| Source | Data | Refresh | Use Case |
|--------|------|---------|----------|
| **UN OCHA** | Humanitarian updates | 6 hours | Refugee routes, aid corridors |
| **IATA** | Airline advisories | 4 hours | Flight route changes |
| **Embassy Advisories** | Travel warnings | 6 hours | Evacuation recommendations |

---

## 🌍 THE CONFLICT GLOBE (Hero Section)

### Visual Design
```
┌─────────────────────────────────────────────────────────────────────┐
│  WW3 LIVE CONFLICT MONITOR                           [LIVE 🔴]      │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │              🌍 3D GLOBE / INTERACTIVE MAP                   │   │
│  │                                                             │   │
│  │         • Red pulses = Active conflict zones                │   │
│  │         • Yellow = Recent incidents (last 24h)              │   │
│  │         • Lines = Attack trajectories (missiles, drones)    │   │
│  │         • Icons = Airports (🟢 Open / 🔴 Closed / 🟡 Limited)│   │
│  │                                                             │   │
│  │    ┌──────────────────────────────────────────────────┐     │   │
│  │    │ 🎚️ Time Scrubber: NOW ◀────●────▶ 7 DAYS AGO    │     │   │
│  │    └──────────────────────────────────────────────────┘     │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📍 ACTIVE ZONES (Click to zoom)                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                   │
│  │ 🇮🇷 Iran     │ │ 🇺🇦 Ukraine  │ │ 🇮🇱 Gaza     │                   │
│  │ 🔴 12 events│ │ 🟡 3 events │ │ 🔴 8 events │                   │
│  │ Last: 2m ago│ │ Last: 4h ago│ │ Last: 15m ago│                  │
│  └─────────────┘ └─────────────┘ └─────────────┘                   │
│                                                                     │
│  📊 WW3 PROBABILITY: 61%  [▓▓▓▓▓▓▓▓▓▓░░░░░░]  ↑ +3% (24h)         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Globe Features
1. **3D Rotating Globe** (Three.js/React Three Fiber)
   - Auto-rotates slowly
   - Click and drag to rotate
   - Scroll to zoom
   - Click conflict zone to focus

2. **Event Markers**
   - 🔴 **Red pulse** = Active/ongoing (last 1 hour)
   - 🟠 **Orange** = Recent (last 24 hours)
   - 🟡 **Yellow** = Past 7 days
   - Size = Severity (casualties, impact)
   - Click = Show event details, sources

3. **Attack Vectors**
   - Animated lines showing:
     - Missile trajectories
     - Drone flight paths
     - Troop movements
   - With timestamps: "Launched: 2 hours ago"

4. **Time Scrubber** (Critical feature!)
   - Slider: NOW ← → 7 DAYS AGO
   - Play button: Replay last 7 days
   - Shows how conflicts evolved
   - "See what happened yesterday at 3 PM"

---

## ✈️ EVACUATION & TRAVEL FEATURES

### Airport Status Panel
```
┌─────────────────────────────────────────────┐
│  ✈️ AIRPORT STATUS - EVACUATION ROUTES      │
│                                             │
│  🔍 Search airports...                      │
│                                             │
│  IRAN & REGION:                             │
│  ┌──────────────────────────────────────┐   │
│  │ 🟢 IKA - Tehran Imam Khomeini        │   │
│  │    Operating normally                │   │
│  │    Last update: 5 min ago            │   │
│  ├──────────────────────────────────────┤   │
│  │ 🔴 MHD - Mashhad International       │   │
│  │    CLOSED - Military operations      │   │
│  │    Source: Iran Civil Aviation       │   │
│  ├──────────────────────────────────────┤   │
│  │ 🟡 SYZ - Shiraz                      │   │
│  │    Limited flights - Check airlines  │   │
│  │    Last update: 12 min ago           │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  [View Flight Routes] [Embassy Advisories]  │
└─────────────────────────────────────────────┘
```

### Features for Travelers
1. **Airport Status Map**
   - Real-time open/closed status
   - Flight cancellation data
   - Alternative route suggestions
   - Embassy contact info

2. **Safe Corridor Tracker**
   - Humanitarian corridors (UN verified)
   - Border crossing wait times
   - Refugee camp locations
   - Aid distribution points

3. **Airspace Restrictions**
   - No-fly zones (live from NOTAMs)
   - Commercial airline detours
   - Military air activity warnings

---

## ⏱️ DATA FRESHNESS INDICATORS

Every data point shows:
```
WW3 Probability: 61%
├─ Source: Polymarket + Kalshi aggregation
├─ Last updated: 2 minutes ago
├─ Next update: in 13 minutes
└─ 🔴 Live connection
```

Visual freshness indicators:
- 🟢 **< 5 min old** = Very fresh
- 🟡 **5-30 min old** = Recent
- 🟠 **30 min - 2h old** = Getting stale
- 🔴 **> 2h old** = Data may be outdated

---

## 🎮 GAMIFICATION LAYER (On Top of Real Data)

### Keep These (They add engagement):
1. **WW3 Probability Score** - Big, prominent, with trend arrows
2. **Risk Meter** - Visual gauge that changes color
3. **Conflict Cards** - Trump, Iran leaders with "power levels" based on:
   - Military assets in region
   - Recent rhetoric intensity (NLP analysis)
   - Economic sanctions impact
4. **Prediction Markets** - Real betting odds (real money!)

### Remove These (Don't add value):
1. ❌ Circuit Breaker (as you said)
2. ❌ HP bars (confusing - is it HP? Power? Support?)
3. ❌ War Room Chat (unless heavily moderated + verified users only)
4. ❌ "VS" battle mode (too game-like, reduces credibility)

### Add These (Practical gamification):
1. **Event Verification Game**
   - Users can verify/corroborate events
   - "3 sources confirm: Explosion in Tehran"
   - Accuracy leaderboard (for trust)

2. **Prediction Accuracy**
   - Track how well prediction markets did
   - "Kalshi predicted 65% - actual: escalation occurred"
   - Build trust through transparency

---

## 🔄 REAL-TIME UPDATE ARCHITECTURE

### Frontend (React)
```javascript
// WebSocket connection for live updates
const useLiveEvents = () => {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket('wss://api.ww3tracker.live/live-events');
    
    ws.onmessage = (msg) => {
      const event = JSON.parse(msg.data);
      
      // Add to globe
      addEventToGlobe(event);
      
      // Show notification
      showEventNotification(event);
      
      // Update probability if needed
      if (event.severity > 7) {
        recalculateProbability();
      }
    };
    
    return () => ws.close();
  }, []);
};
```

### Backend (Node.js)
```javascript
// services/liveDataAggregator.js

const startLiveAggregation = () => {
  // Every 2 minutes: GDELT + NASA FIRMS
  setInterval(async () => {
    const [gdeltEvents, fireData] = await Promise.all([
      fetchGDELTRecent(),
      fetchNasaFirmsRecent()
    ]);
    
    const newEvents = mergeAndDeduplicate(gdeltEvents, fireData);
    
    // Verify events (at least 2 sources needed)
    const verifiedEvents = await verifyEvents(newEvents);
    
    // Broadcast to all connected clients
    broadcastToClients(verifiedEvents);
    
    // Update database
    await saveEvents(verifiedEvents);
    
  }, 2 * 60 * 1000);
};
```

### Caching Strategy
- **Redis** for real-time event cache (5 min TTL)
- **PostgreSQL** for historical data
- **CDN** for globe textures/map tiles

---

## 📱 NOTIFICATION SYSTEM

Users can subscribe to:
- **Breaking Events** (missile strike, airport closure)
- **Probability Changes** (>5% shift in WW3 risk)
- **Geographic Alerts** (events within 500km of location)
- **Embassy Updates** (travel advisory changes)

Notification channels:
- Browser push notifications
- Email alerts (configurable)
- Telegram/WhatsApp bot (optional)
- In-app bell icon

---

## 🛠️ IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1-2)
- [ ] Remove Circuit Breaker, War Room Chat, HP bars
- [ ] Implement new data freshness indicators
- [ ] Add source attribution to all data points
- [ ] Set up WebSocket infrastructure
- [ ] Integrate ACLED API for verified conflict data

### Phase 2: The Globe (Week 3-4)
- [ ] Build 3D globe with Three.js
- [ ] Add event markers with real GDELT data
- [ ] Implement time scrubber (last 7 days)
- [ ] Connect NASA FIRMS fire data to globe
- [ ] Mobile-responsive globe view

### Phase 3: Travel Features (Week 5-6)
- [ ] Airport status integration (FlightRadar24)
- [ ] Airspace restriction layer on globe
- [ ] Embassy advisory scraper
- [ ] Safe corridor tracker (UN OCHA)
- [ ] Evacuation route planner

### Phase 4: Polish (Week 7-8)
- [ ] Notification system
- [ ] Event verification game
- [ ] Performance optimization
- [ ] SEO optimization for new keywords
- [ ] Analytics dashboard for you

---

## 💰 COST ESTIMATE

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| ACLED API | Free (academic) or $100 | Conflict data |
| FlightRadar24 API | €49-499 | Airport data |
| Mapbox/Maptiler | $50 | Globe tiles |
| WebSocket server | $20 | Railway/Render |
| Redis Cloud | $15 | Caching |
| **Total** | **~$135-585/month** | |

---

## 🎯 SUCCESS METRICS

1. **Engagement**
   - Time on site > 3 minutes
   - Globe interaction rate > 60%
   - Time scrubber usage > 40%

2. **Trust**
   - Return visitor rate > 30%
   - Bounce rate < 50%
   - Source clicks (people verifying data)

3. **Utility**
   - Airport status page views
   - Notification signups
   - Shares/evacuation guide usage

---

## ⚠️ ETHICAL CONSIDERATIONS

1. **Verification First**
   - Never show unverified events
   - Minimum 2 independent sources required
   - Clear "unverified" label if only 1 source

2. **Life Safety**
   - Airport status must be accurate
   - Clear disclaimers: "Verify with official sources"
   - Emergency contact numbers prominent

3. **Bias Avoidance**
   - Show all sides of conflict
   - Multiple source perspectives
   - No inflammatory language in official alerts

---

**Ready to start?** Which phase should we prioritize? Or want me to:
1. Start coding the globe component?
2. Set up the ACLED + FlightRadar data sources?
3. Remove the Circuit Breaker/HP bars immediately?

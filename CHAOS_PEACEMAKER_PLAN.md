# CHAOS PEACEMAKER - SWIPE DIPLOMACY GAME
## Deploy Today Plan | March 4, 2026

**MISSION:** Build and deploy a Reigns-style swipe diplomacy game in ONE DAY that lets users try to stop WW3 while riding the current Iran-US war news wave.

---

## THE HOOK (Why Now)
- War is LIVE: Aramco Ras Tanura hit, Riyadh embassy strikes, Hormuz blocked
- Kim Jong-un "nukes ready, still no invite" memes are VIRAL right now
- People are doom-scrolling - give them something to DO
- Trending: #USvsIran #WW3 #KimJongUn on X/TikTok

---

## MVP FEATURES (MUST HAVE for Today)

### 1. Game Entry Point
- Hero section replacement: "CHAOS PEACEMAKER - Stop the War"
- Big glowing START button
- Live WW3 meter (use existing Polymarket data)
- Today's headline: "Iran drones hit Riyadh + Aramco under threat"

### 2. Role Selection (4 Cards)
- 🇺🇸 US Diplomat (aggressive options)
- 🌍 Neutral Mediator (balanced)
- 🇮🇷 Iranian Backchannel (defensive)
- 🇰🇵 Kim Jong-un Wildcard (chaos/meme path)

### 3. Core Game Loop (6-8 Rounds)
Each round shows:
- Crisis card with headline (static for MVP, pulled from today's real news)
- 3 swipe choices (left/right/wildcard buttons)
- Instant meter feedback
- Ally relationship updates (visual only)

### 4. Static Scenarios (Today's Real News Based)
SCENARIO 1: "Iran drones hit US Embassy in Riyadh. Aramco refinery smoking."
Choices:
- [Swipe Left] Sanction + NATO pressure → Meter +5%
- [Swipe Right] Backchannel with MBS → Meter -3%
- [Wildcard] Invite Kim → Meme response, chaotic meter change

SCENARIO 2: "Strait of Hormuz closed. Oil prices spiking."
Choices:
- Military escort → Meter +8%
- Diplomatic talks → Meter -2%
- Kim offers missiles as "peace gift" → Meme chaos

SCENARIO 3: "Netanyahu office targeted. Israel retaliating hard."
SCENARIO 4: "Saudi military on full alert after Ras Tanura."
SCENARIO 5: "Russia offers to mediate. Trust them?"
SCENARIO 6: "China stays silent. Pressure them?"
(2 more for randomization)

### 5. Ending System
After 6-8 rounds:
- Score < 30%: "PEACEMAKER - You stopped WW3!" + badge
- Score 30-70%: "STALEMATE - Still tense but breathing"
- Score > 70%: "CHILDREN OF ASH - Kim showed up with snacks and nukes 😂" 

### 6. Share System
- "Tweet My Ending" button
- Pre-written tweet with result + meter screenshot + site link
- Goes viral = organic growth

---

## TECHNICAL ARCHITECTURE (Vibe Code Style)

### Components to Build
1. `ChaosPeacemakerGame.jsx` - Main game container
2. `RoleSelection.jsx` - 4 role cards
3. `CrisisCard.jsx` - Scenario display with swipe buttons
4. `WW3Meter.jsx` - Animated progress bar (reuse existing)
5. `EndingScreen.jsx` - Results + share
6. `GameState.js` - Simple state management

### Data Structure
```javascript
const scenarios = [
  {
    id: 1,
    headline: "Iran drones hit US Embassy in Riyadh",
    context: "Aramco refinery smoking, Hormuz closed",
    choices: [
      { text: "Sanctions + NATO", meterChange: +5, allyEffect: "NATO↑" },
      { text: "Backchannel MBS", meterChange: -3, allyEffect: "Saudi↔" },
      { text: "Invite Kim", meterChange: Math.random() > 0.5 ? -10 : +15, meme: true }
    ]
  },
  // ... 7 more scenarios
];
```

### State Management (Simple)
- currentRole: string
- currentRound: number
- ww3Meter: number (0-100)
- choicesHistory: array
- gameEnded: boolean

---

## UI/UX DESIGN (Copy Reigns)
- Dark theme matching current site
- Card swipes with Tinder-style animations
- Dramatic meter pulsing
- Kim wildcard = glitter/chaos effects
- Mobile-first (most traffic is mobile)

---

## DEPLOYMENT CHECKLIST

### Phase 1: Core Game (2-3 hours)
- [ ] Set up game components structure
- [ ] Build role selection screen
- [ ] Build crisis card with 3 choices
- [ ] Build meter system
- [ ] Wire up scenario data

### Phase 2: Polish (1-2 hours)
- [ ] Add Framer Motion animations
- [ ] Swipe gestures (or button fallback)
- [ ] Ending screens with memes
- [ ] Share on X integration

### Phase 3: Integration (1 hour)
- [ ] Replace hero section with game entry
- [ ] Keep carousel BELOW the game
- [ ] Mobile responsiveness check
- [ ] Deploy to Railway

### Phase 4: Viral Hooks (30 min)
- [ ] Pre-written tweet templates
- [ ] Screenshot-worthy ending cards
- [ ] Kim wildcard meme images/GIFs

---

## CONTENT ASSETS NEEDED

### Kim Wildcard Meme Pool
- Kim with popcorn "nukes ready, still no invite"
- Kim on phone "nobody called"
- Kim with missiles "just here to watch"
- Kim crying "why no facetime?"

### Ending Memes
- Peace: Obama awarding Obama meme
- Stalemate: Confused math lady
- Disaster: This is Fine dog with nukes

---

## POST-LAUNCH (After Today)
- Day 2: Add live RSS pulling
- Day 3: Daily scenario rotation
- Day 4: Leaderboard + streaks
- Week 2: More roles (MBS, Putin, etc)

---

## SUCCESS METRICS
- Dwell time: Target 5+ minutes (vs current 30s)
- Shares: 100+ tweets day 1
- Return visits: 30%+ same-day return
- Viral: 1 Kim meme hits 10k+ impressions

---

## THE PITCH
"While the world watches WW3 unfold, YOU are the chaotic diplomat trying to stop it. Swipe left for sanctions, right for diplomacy, or wildcard Kim Jong-un for pure chaos. Based on today's REAL headlines. Can you lower the meter before it's too late?"

**Deploy by: END OF DAY MARCH 4, 2026**

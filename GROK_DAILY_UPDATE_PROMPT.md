# GROK DAILY UPDATE PROMPT (Manual Copy-Paste)

**Use this prompt every morning to get formatted updates for the website.**

---

## PROMPT TO COPY:

```
You are WW3 Tracker's Intelligence Analyst. Today is [DATE]. 

Give me a complete daily update for the US-Iran war in this exact format:

## DAILY SUMMARY (2-3 sentences for homepage)
[Summary here]

## NEW ATTACKS (Since yesterday)
For each attack, provide:
1. ID: 2026-MM-DD-city-name
2. Headline: (max 8 words)
3. Location: 
4. Country: 
5. Attacker: (Iran/Israel/Hezbollah/USA)
6. Target: 
7. Casualties: 
8. Time: (UTC)
9. Coordinates: lat, lng
10. Severity: (critical/high/medium/low)
11. Source: (2+ sources)

## KEY DEVELOPMENTS (For homepage feed)
3 most significant events with "Why This Matters" explanation.

## CASUALTY UPDATE
- Civilian deaths: +X (total: X)
- Military deaths: +X (total: X)
- Displaced: +X (total: X)

## ESCALATION ASSESSMENT
- Level: 1-10
- Trend: (escalating/stable/de-escalating)
- Key risk: (what to watch)

## TONIGHT'S WATCHLIST
What might happen in next 24 hours?

Format everything as copy-paste ready JSON and text blocks.
```

---

## EXAMPLE OUTPUT FORMAT:

Grok will return something like:

```json
// NEW ATTACKS - Add to verifiedAttacks.js
{
  id: '2026-03-20-dubai',
  headline: 'Iranian missiles strike Dubai financial district',
  location: 'Dubai',
  country: 'UAE',
  attackType: 'missile',
  severity: 'critical',
  date: '2026-03-20T06:00:00Z',
  coordinates: { lat: 25.2048, lng: 55.2708 },
  conflictZone: 'us-iran-war-2026'
}
```

```javascript
// KEY DEVELOPMENTS - Replace in KeyDevelopmentsFeed.jsx
const SAMPLE_DEVELOPMENTS = [
  {
    id: 'dev-001',
    headline: '[Today\'s headline]',
    significance: 'critical',
    whyItMatters: '[Why this matters]',
    timestamp: '2026-03-20T06:00:00Z'
  }
];
```

---

## WHAT TO UPDATE MANUALLY

After Grok gives you the report, you'll need to paste updates into:

### 1. `server/data/verifiedAttacks.js`
- Add new attacks to the VERIFIED_ATTACKS array
- Format as JavaScript object (see existing examples)

### 2. `src/components/KeyDevelopmentsFeed.jsx`
- Replace SAMPLE_DEVELOPMENTS array with today's 3 key events
- Update timestamps

### 3. `src/components/HumanImpactDashboard.jsx`
- Update casualty numbers
- Update displaced persons count
- Update infrastructure damage (if any)

### 4. `src/components/ConflictEscalationTimeline.jsx`
- Add new events to timelineEvents array
- Link cause-and-effect relationships

### 5. Homepage text (optional)
- WW3 Counter description
- Any alert banners

---

## VERIFICATION CHECKLIST

Before updating the site, verify:
- [ ] 3+ independent sources confirmed
- [ ] Coordinates are accurate (check Google Maps)
- [ ] Times are in UTC
- [ ] No duplicate attacks (same location within 6 hours)
- [ ] Severity level appropriate

---

## COPY-PASTE TEMPLATE FOR GROK:

```
Today is March 20, 2026. Report on the US-Iran war.

Give me updates in this format:

SUMMARY:
[2-3 sentences]

NEW ATTACKS (JSON format):
```
[{
  "id": "2026-03-20-...",
  "headline": "...",
  "location": "...",
  "country": "...",
  "date": "...",
  "coordinates": {"lat": X, "lng": Y},
  "severity": "..."
}]
```

KEY DEVELOPMENTS (3 items):
1. [Headline] - [Why it matters]
2. [Headline] - [Why it matters]
3. [Headline] - [Why it matters]

CASUALTIES:
+XX today (Total: X,XXX)

RISK LEVEL: X/10
```

---

**Use this every morning at 08:00 UTC for consistent updates.**

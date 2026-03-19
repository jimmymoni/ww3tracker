# DAILY UPDATE CHECKLIST (Manual)

## EVERY MORNING (08:00 UTC)

### Step 1: Ask Grok
**Copy-paste this to Grok:**
```
Today is [DATE]. Report on US-Iran war. 

Format:
1. SUMMARY (2-3 sentences)
2. NEW ATTACKS (JSON with: id, headline, location, country, coordinates, severity)
3. KEY DEVELOPMENTS (3 items with "why it matters")
4. CASUALTY UPDATE (+X today, total X)
5. RISK LEVEL (1-10)
```

---

### Step 2: Update Files

#### A. Add New Attacks
**File:** `server/data/verifiedAttacks.js`

1. Open file
2. Find the last attack in VERIFIED_ATTACKS array
3. Add new attacks before the closing `];`
4. **Format:**
```javascript
  {
    id: '2026-03-20-dubai',
    headline: 'Iranian missiles strike Dubai',
    description: 'Details here',
    location: 'Dubai',
    country: 'UAE',
    attackType: 'missile',
    severity: 'critical',
    date: '2026-03-20T06:00:00Z',
    source: 'Reuters, BBC',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    conflictZone: 'us-iran-war-2026'
  },
```

#### B. Update Key Developments
**File:** `src/components/KeyDevelopmentsFeed.jsx`

1. Find `SAMPLE_DEVELOPMENTS` array
2. Replace with today's 3 key events:
```javascript
const SAMPLE_DEVELOPMENTS = [
  {
    id: 'dev-001',
    significance: 'critical',
    timestamp: '2026-03-20T06:00:00Z',
    headline: '[Today\'s headline]',
    summary: '[Brief summary]',
    whyItMatters: '[Why this matters]',
    category: 'military',
    location: '[Location]',
    sources: ['Reuters', 'BBC']
  },
  // ... 2 more
];
```

#### C. Update Casualties (if significant)
**File:** `src/components/HumanImpactDashboard.jsx`

1. Find `impactData` object
2. Update numbers:
```javascript
casualties: {
  civilian: { confirmed: XXXX, estimated: XXXX },
  military: { confirmed: XXXX, estimated: XXXX }
}
```

#### D. Update Escalation Timeline (optional)
**File:** `src/components/ConflictEscalationTimeline.jsx`

1. Find `timelineEvents` array
2. Add new event:
```javascript
{
  id: 'evt-XXX',
  date: '2026-03-20T06:00:00Z',
  title: '[Event title]',
  description: '[Description]',
  severity: 'critical',
  triggeredBy: 'evt-XXX', // link to previous event
  consequences: [],
  actors: ['Iran', 'UAE'],
  zone: 'us-iran'
}
```

---

### Step 3: Test Locally
```bash
npm run dev
```
1. Check homepage - new developments showing?
2. Check map - new pins visible?
3. Check /live-map page

---

### Step 4: Commit & Deploy
```bash
git add -A
git commit -m "DATA: Daily update March 20, 2026 - X new attacks"
git push origin master
```

---

### Step 5: Verify Live
- Visit https://ww3tracker.live
- Confirm updates visible
- Check for errors

---

## QUICK REFERENCE: FILE LOCATIONS

| Component | File Path | What to Update |
|-----------|-----------|----------------|
| Attack Database | `server/data/verifiedAttacks.js` | New attacks |
| Key Developments | `src/components/KeyDevelopmentsFeed.jsx` | `SAMPLE_DEVELOPMENTS` array |
| Casualties | `src/components/HumanImpactDashboard.jsx` | `impactData` object |
| Timeline | `src/components/ConflictEscalationTimeline.jsx` | `timelineEvents` array |

---

## TIME ESTIMATE

- **Get Grok report:** 2 minutes
- **Update attacks:** 5 minutes
- **Update developments:** 3 minutes
- **Test & deploy:** 5 minutes

**Total: ~15 minutes per day**

---

## EMERGENCY UPDATES

If CRITICAL event happens (nuclear facility hit, 100+ casualties, etc.):

1. **Immediately** add attack to verifiedAttacks.js
2. **Immediately** commit and push
3. **Don't wait** for full daily update
4. **Post on Twitter/X** with link to site

---

## REMEMBER

- ✅ Verify 3+ sources before adding
- ✅ Use UTC times
- ✅ Check coordinates on Google Maps
- ✅ Keep descriptions factual
- ✅ Don't editorialize - just report

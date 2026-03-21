# WW3 Tracker - Telegram Bot Setup Guide

## Overview
Auto-publish verified military strikes to WW3 Tracker via Telegram bot.

**Bot:** @ww3tracker_live_bot  
**Channel:** WW3 Staging  
**Workflow:** ChatGPT → Grok → Telegram Bot → Website

---

## Bot Commands

| Command | Purpose |
|---------|---------|
| `/batch` | Publish multiple strikes (up to 10) |
| `/publish` | Publish single strike |
| `/status` | Check bot status |
| `/help` | Show help message |

---

## 3-Agent Workflow

### Step 1: ChatGPT (News Fetcher)
**Trigger:** Send date range (e.g., "march 20-21 2026")

**Prompt:**
```
You are the STRIKES FETCHER for WW3 Tracker.

YOUR JOB: Find ALL confirmed military strikes in the given date range.

TRACK:
✅ Airstrikes, missile strikes, drone strikes
✅ Naval strikes, artillery strikes
✅ Leadership assassinations
✅ Energy infrastructure hits
✅ Military base attacks

LOCATIONS:
- Tier 1: Iran, Israel, Lebanon, Syria, Iraq, Gaza, West Bank
- Tier 2: Saudi Arabia, Qatar, Kuwait, UAE, Bahrain
- Tier 3: Turkey, Jordan, Egypt, Yemen, Pakistan
- Tier 4: Russia, China, NATO bases

EXCLUDE:
❌ Troop movements, mobilization, sanctions, politics

OUTPUT FORMAT:
---STRIKES REPORT---
DATE RANGE: [input]

=== TIER 1: CORE WAR ZONE ===
STRIKE 1:
HEADLINE: [Clear headline]
LOCATION: [City, Country]
TIME: [Time or "Unknown"]
TYPE: [airstrike/missile/drone/naval/artillery]
ATTACKER: [Who launched]
TARGET: [What was hit]
SOURCES: [Reuters, AP, etc.]

[Continue for all strikes...]

=== TIER 2: GULF ENERGY STRIKES ===
[same format...]

=== TIER 3: REGIONAL SPILLOVER ===
[same format...]

---END STRIKES REPORT---
```

---

### Step 2: Grok (Verifier)
**Input:** Paste ChatGPT's strikes report

**Prompt:**
```
You are the STRIKES VERIFIER for WW3 Tracker.

YOUR JOB: Verify military strikes only.

FOR EACH STRIKE:
1. Search X/Twitter for confirmation
2. Look for photos/video of damage
3. Check: CONFIRMED HIT vs CLAIMED vs INTERCEPTED

OUTPUT FORMAT:
---STRIKES VERIFICATION---

=== TIER 1 VERIFIED ===
STRIKE 1: [Headline]
STATUS: [CONFIRMED HIT / INTERCEPTED / UNCONFIRMED]
CONFIDENCE: [HIGH / MEDIUM / LOW]

CROSS-CHECK:
✅ Confirmed by: [X accounts, news outlets]
❌ Conflicts with: [Contradictory reports]
⚠️ Uncertain: [Single source, no visuals]

CORRECTED FACTS:
LOCATION: [Verified city]
COUNTRY: [Verified country]
TIME: [Verified time]
TYPE: [Verified]
ATTACKER: [Verified]
TARGET: [Verified]
DAMAGE: [Destroyed / Damaged / Intercepted]

---END STRIKE 1---

[Repeat for each strike...]

=== SUMMARY ===
TOTAL CONFIRMED HITS: [X]

BREAKDOWN:
- Tier 1 (Core): [X] strikes
- Tier 2 (Gulf): [X] strikes
- Tier 3 (Regional): [X] strikes

RECOMMENDED FOR PUBLISHING:
[List HIGH confidence hits only]

FILTER RULES:
✅ INCLUDE: CONFIRMED HITS with HIGH confidence
❌ EXCLUDE: Intercepted/failed strikes
❌ EXCLUDE: LOW confidence strikes
⚠️ MEDIUM: Only if multiple sources
```

---

### Step 3: Telegram Bot (Publisher)
**Input:** Format Grok's verified strikes

**Working Format:**
```
/batch
LOCATION: Tehran
COUNTRY: Iran
TIME: 2026-03-20 00:00 UTC
TYPE: airstrike
SEVERITY: critical
TARGET: IRGC military sites
HEADLINE: Israeli airstrikes devastate Tehran military targets
SOURCE: Reuters, Al Jazeera
NARRATIVE: Israeli airstrikes struck key IRGC infrastructure in Tehran, causing major explosions and significant damage.

---

LOCATION: Beirut
COUNTRY: Lebanon
TIME: 2026-03-21 04:30 UTC
TYPE: airstrike
SEVERITY: high
TARGET: Hezbollah infrastructure
HEADLINE: Israeli strikes hit Hezbollah targets in Beirut suburbs
SOURCE: Multiple sources
NARRATIVE: Israeli airstrikes targeted Hezbollah command in Beirut's southern suburbs at dawn.

---

[Continue for each strike...]
```

**CRITICAL RULES:**
- After EVERY NARRATIVE, type `---` on its own line
- Then start next attack with `LOCATION:`
- NO headers like "--- BATCH 1 ---"
- NO footers like "--- END BATCH 1 ---"
- Max 10 attacks per batch (5 recommended for clean preview)
- Each attack needs ALL 9 fields

---

## Field Definitions

| Field | Format | Example |
|-------|--------|---------|
| LOCATION | City name only | `Tehran` |
| COUNTRY | Country name | `Iran` |
| TIME | YYYY-MM-DD HH:MM UTC | `2026-03-20 14:30 UTC` |
| TYPE | lowercase | `airstrike`, `missile`, `drone`, `naval`, `artillery` |
| SEVERITY | lowercase | `critical`, `high`, `medium`, `low` |
| TARGET | Max 10 words | `IRGC military infrastructure` |
| HEADLINE | Max 80 chars | `Israeli airstrikes devastate Tehran military targets` |
| SOURCE | Comma separated | `Reuters, Al Jazeera` |
| NARRATIVE | 2-3 sentences | Context and damage description |

---

## Severity Guidelines

| Severity | Criteria |
|----------|----------|
| **CRITICAL** | 50+ casualties, major facility destroyed, leadership killed, nuclear facility |
| **HIGH** | 10-49 casualties, significant infrastructure damage, energy facility |
| **MEDIUM** | 1-9 casualties, limited damage, military base |
| **LOW** | No casualties, minimal damage, intercepted/failed |

---

## Complete Example

**ChatGPT Output:**
```
---STRIKES REPORT---
DATE RANGE: march 20-21 2026

=== TIER 1: CORE WAR ZONE ===
STRIKE 1:
HEADLINE: Israeli airstrikes hit Tehran
LOCATION: Tehran, Iran
TIME: March 20
TYPE: airstrike
ATTACKER: Israel
TARGET: Military bases
SOURCES: Reuters, AP

STRIKE 2:
HEADLINE: Iranian missiles hit Qatar LNG
LOCATION: Ras Laffan, Qatar
TIME: March 20
TYPE: missile
ATTACKER: Iran
TARGET: LNG terminal
SOURCES: Reuters, FT
```

**Grok Verifies:** Both CONFIRMED HITS, HIGH confidence

**Telegram Format:**
```
/batch
LOCATION: Tehran
COUNTRY: Iran
TIME: 2026-03-20 06:00 UTC
TYPE: airstrike
SEVERITY: critical
TARGET: Military bases
HEADLINE: Israeli airstrikes hit Tehran military targets
SOURCE: Reuters, AP
NARRATIVE: Israeli airstrikes struck multiple military bases in Tehran causing significant damage and explosions.

---

LOCATION: Ras Laffan
COUNTRY: Qatar
TIME: 2026-03-20 14:00 UTC
TYPE: missile
SEVERITY: critical
TARGET: LNG export terminal
HEADLINE: Iranian missiles hit Qatar Ras Laffan LNG facility
SOURCE: Reuters, FT
NARRATIVE: Iranian missiles struck the Ras Laffan LNG terminal causing fires and disrupting 17% of global gas exports.
```

**Bot Response:**
```
📋 BATCH PREVIEW: 2 ATTACKS

1. Tehran - Israeli airstrikes hit Tehran...
2. Ras Laffan - Iranian missiles hit Qatar...

✅ Publish all 2 attacks?
[YES] [NO]
```

Tap **YES** → Attacks published to ww3tracker.live

---

## Technical Details

**Bot File:** `bot-only.js` (standalone from main server)  
**Database:** `server/data/verifiedAttacks.js`  
**Branch:** `master` (not `main`)  
**Deployment:** Auto-deploy on Railway when pushed to GitHub

**Environment Variables:**
```
TELEGRAM_BOT_TOKEN=8523841644:AAH7Sh9qrIiFuZqf5W5nF11FutBlIbio2MA
TELEGRAM_CHANNEL_ID=-1003877631265
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not responding | Restart: `node bot-only.js` |
| "0 attacks" error | Check `---` separators between attacks |
| Git push failed | Check database file not corrupted |
| Only 1 attack detected | Add `---` after EVERY narrative |
| Preview shows wrong count | Remove headers like "--- BATCH 1 ---" |

---

## Filter Rules Summary

✅ **INCLUDE:**
- Confirmed hits only
- High confidence (multiple sources)
- Actual strikes (not intercepted)

❌ **EXCLUDE:**
- Intercepted/failed strikes
- Low confidence strikes
- Medium confidence (unless special case)
- Political statements, troop movements, sanctions

⚠️ **SPECIAL CASES:**
- West Bank strike: Include if multiple sources (new location = escalation)
- Diego Garcia: Intercepted = skip (blog instead)
- Medium confidence + new country: Consider including

---

*Last Updated: March 21, 2026*

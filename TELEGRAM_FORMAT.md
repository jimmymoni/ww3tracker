# Telegram Bot Message Format

Documentation for the WW3 Tracker Telegram bot message formats.

---

## Single Attack Format (`/publish`)

```
/publish
LOCATION: [city]
COUNTRY: [country]
TIME: [YYYY-MM-DD HH:MM UTC]
TYPE: [airstrike|missile|drone|naval|cyber|artillery]
SEVERITY: [critical|high|medium|low]
TARGET: [what was hit]
HEADLINE: [clear headline]
SOURCE: [news outlets]
NARRATIVE: [context]
```

### Example:
```
/publish
LOCATION: Tehran
COUNTRY: Iran
TIME: 2026-03-21 14:30 UTC
TYPE: airstrike
SEVERITY: high
TARGET: Military command center
HEADLINE: Israeli airstrike hits IRGC facility in Tehran
SOURCE: Reuters, Al Jazeera
NARRATIVE: Strike targeted senior IRGC commanders. Iran vows retaliation. Regional tensions spike.
```

---

## Batch Attack Format (`/batch`)

Use `/batch` to publish multiple attacks at once. Separate each attack with `---` on its own line.

```
/batch
LOCATION: [city 1]
COUNTRY: [country]
TIME: [YYYY-MM-DD HH:MM UTC]
TYPE: [type]
SEVERITY: [severity]
TARGET: [target]
HEADLINE: [headline]
SOURCE: [sources]
NARRATIVE: [context]

---

LOCATION: [city 2]
COUNTRY: [country]
TIME: [YYYY-MM-DD HH:MM UTC]
TYPE: [type]
SEVERITY: [severity]
TARGET: [target]
HEADLINE: [headline]
SOURCE: [sources]
NARRATIVE: [context]

---

[repeat for each attack...]
```

### Example:
```
/batch
LOCATION: Tehran
COUNTRY: Iran
TIME: 2026-03-21 14:30 UTC
TYPE: airstrike
SEVERITY: high
TARGET: IRGC command center
HEADLINE: Israeli strike hits Tehran military facility
SOURCE: Reuters
NARRATIVE: Strike killed two senior IRGC commanders. Iran announces retaliatory measures.

---

LOCATION: Tel Aviv
COUNTRY: Israel
TIME: 2026-03-21 15:45 UTC
TYPE: missile
SEVERITY: high
TARGET: Residential district
HEADLINE: Iranian missiles strike Tel Aviv suburb
SOURCE: Times of Israel
NARRATIVE: Barrage of ballistic missiles hit residential area. Iron Dome intercepted 70%.

---

LOCATION: Beirut
COUNTRY: Lebanon
TIME: 2026-03-21 16:20 UTC
TYPE: airstrike
SEVERITY: critical
TARGET: Hezbollah weapons depot
HEADLINE: Israeli jets target Hezbollah arms cache in Beirut
SOURCE: AP
NARRATIVE: Massive explosion reported at suspected weapons site. Civilian casualties reported.
```

---

## Important Rules

| Field | Rules |
|-------|-------|
| `LOCATION` | City name **only**. No "near", no regions, no "area of". Must be a known city. |
| `COUNTRY` | Full country name (e.g., "Iran", not "IR"). |
| `TIME` | Format: `2026-03-21 14:30 UTC`. Always include timezone. |
| `TYPE` | Must be one of: `airstrike`, `missile`, `drone`, `naval`, `cyber`, `artillery` |
| `SEVERITY` | Must be one of: `critical`, `high`, `medium`, `low` |
| `TARGET` | Brief description of what was hit (building, facility, etc.). |
| `HEADLINE` | Clear, factual headline. Under 100 characters. |
| `SOURCE` | Comma-separated list of news outlets confirming the attack. |
| `NARRATIVE` | 2-3 sentences explaining significance and context. |
| `---` | Use three dashes on their own line between attacks in batch mode. |

### Severity Guidelines:
- **critical**: Mass casualties (50+), strategic facilities destroyed, potential to escalate globally
- **high**: Significant casualties (10-49), military commanders killed, major infrastructure hit
- **medium**: Limited casualties, symbolic targets, minor damage
- **low**: No casualties, warning shots, unconfirmed reports

---

## Grok/Claude Prompt (Copy-Paste Ready)

Use this prompt with Grok, Claude, or any AI assistant to get properly formatted Telegram messages:

```
Format the following attack(s) for the WW3 Tracker Telegram bot.

RULES:
- LOCATION: City name ONLY (no "near", no regions)
- TIME: Use format 2026-03-21 14:30 UTC
- TYPE: Must be airstrike, missile, drone, naval, cyber, or artillery
- SEVERITY: Must be critical, high, medium, or low
- NARRATIVE: 2-3 sentences explaining significance
- For multiple attacks, separate with --- on its own line

FORMAT:
/batch
LOCATION: [city]
COUNTRY: [country]
TIME: [YYYY-MM-DD HH:MM UTC]
TYPE: [type]
SEVERITY: [severity]
TARGET: [what was hit]
HEADLINE: [clear headline]
SOURCE: [outlets]
NARRATIVE: [context]

---

[repeat if multiple attacks]

INPUT:
[paste attack details here]
```

### Example Usage:
```
Format the following attack for the WW3 Tracker Telegram bot.

[ paste the above prompt rules ]

INPUT:
Israeli jets hit a military site in Tehran today at 2:30pm UTC. 
It's a high-severity airstrike on an IRGC command center. 
Confirmed by Reuters and Al Jazeera. 
This kills senior commanders and Iran is vowing revenge.
```

**Expected Output:**
```
/batch
LOCATION: Tehran
COUNTRY: Iran
TIME: 2026-03-21 14:30 UTC
TYPE: airstrike
SEVERITY: high
TARGET: IRGC command center
HEADLINE: Israeli airstrike hits IRGC facility in Tehran
SOURCE: Reuters, Al Jazeera
NARRATIVE: Strike targeted senior IRGC commanders. Iran vows retaliation. Regional tensions spike.
```

---

## Quick Reference Card

```
/batch                    ← Start command
LOCATION: Tehran          ← City only
COUNTRY: Iran             ← Full name
TIME: 2026-03-21 14:30 UTC
TYPE: airstrike           ← airstrike|missile|drone|naval|cyber|artillery
SEVERITY: high            ← critical|high|medium|low
TARGET: Military base
HEADLINE: Brief headline
SOURCE: Reuters, AP
NARRATIVE: 2-3 sentences

---                       ← Separator for next attack

LOCATION: Tel Aviv
[...]
```

---

*Last updated: 2026-03-20*

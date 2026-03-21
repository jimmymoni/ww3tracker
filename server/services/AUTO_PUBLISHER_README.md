# Auto-Publisher Pipeline

Complete attack publishing pipeline from admin confirmation to deployment.

## Overview

When a developer confirms an attack in Telegram, this system:

1. **Validates** attack data (required fields, coordinates, confidence)
2. **Updates database** (adds to verifiedAttacks.js)
3. **Persists changes** (rewrites database file to disk)
4. **Updates sitemap** (regenerates sitemap.xml)
5. **Commits to git** (`git add`, `git commit`, `git push`)
6. **Deploys to Railway** (auto-deploy on git push)
7. **Schedules distribution** (tweets/emails based on confidence)

## Files

| File | Purpose |
|------|---------|
| `autoPublisher.js` | Main pipeline controller |
| `scheduler.js` | Tweet/email scheduling service |
| `telegramBot.js` | Telegram bot for admin publishing |

## API Endpoints

```bash
# Publish new attack (triggers full pipeline)
POST /api/publisher/publish
Content-Type: application/json

{
  "headline": "Israeli airstrike on Tehran military base",
  "location": "Tehran",
  "country": "Iran",
  "coordinates": { "lat": 35.6892, "lng": 51.3890 },
  "attackType": "airstrike",
  "severity": "high",
  "confidence": "HIGH",
  "description": "Military base targeted in precision strike"
}

# Get publisher status
GET /api/publisher/status

# List pending jobs
GET /api/publisher/jobs

# Cancel a job
POST /api/publisher/jobs/:jobId/cancel
```

## Telegram Bot Commands

```
/addattack          - Interactive attack entry (step-by-step)
/quickadd <data>    - Fast entry (pipe format)
/status             - Check publisher status
/pending            - List scheduled jobs
/cancel <jobId>     - Cancel a job
/help               - Show help
```

### Quick Add Format

```
/quickadd Headline | Location | Country | Lat,Lng | Type | Severity | Confidence

Example:
/quickadd Israeli airstrike on Tehran | Tehran | Iran | 35.6892,51.3890 | airstrike | high | HIGH
```

## Confidence Levels

| Level | Tweet | Email | Label |
|-------|-------|-------|-------|
| HIGH | 15 min delay | Immediate | ✅ Verified |
| MEDIUM | 30 min delay | Immediate | ⏳ Awaiting confirmation |
| LOW | No tweet | No email | ⚠️ Unverified (site only) |

## Environment Variables

```bash
# Telegram Bot (get from @BotFather)
TELEGRAM_BOT_TOKEN=your_token_here

# Twitter/X API (optional - for actual tweeting)
TWITTER_API_KEY=your_key
TWITTER_API_SECRET=your_secret
TWITTER_ACCESS_TOKEN=your_token
TWITTER_ACCESS_SECRET=your_secret
```

## Pipeline Response

```json
{
  "success": true,
  "steps": [
    "✅ Data validated",
    "✅ Database updated: 2026-03-20-tehran-airstrike",
    "✅ Sitemap updated",
    "✅ Committed and pushed to git",
    "⏳ Railway deploying... (auto-deploy enabled)",
    "⏳ Tweet scheduled: 15min",
    "✅ Email alerts queued: 42 subscribers"
  ],
  "attackId": "2026-03-20-tehran-airstrike",
  "attack": { ... },
  "distribution": {
    "confidence": "HIGH",
    "tweetDelay": 15,
    "emailBatch": true,
    "confidenceWarning": false
  },
  "duration": "2450ms",
  "timestamp": "2026-03-20T10:30:00.000Z"
}
```

## Error Handling

- **Validation errors**: Returns 400 with missing fields
- **Duplicate attacks**: Rejected if same location within 6 hours
- **Git failures**: Logged but pipeline continues (sitemap/database updated)
- **Schedule failures**: Logged, job marked as failed

## Logs

All operations are logged with timestamps:

```
[AutoPublisher] INFO: Starting auto-publish pipeline { headline: 'Israeli airstrike...' }
[AutoPublisher] INFO: Data validation passed
[AutoPublisher] SUCCESS: Attack added to database { id: '2026-03-20-tehran-airstrike' }
[AutoPublisher] SUCCESS: Database persisted to disk { count: 25 }
[AutoPublisher] SUCCESS: Sitemap regenerated
[AutoPublisher] SUCCESS: Changes committed { message: '🔴 Add attack: Israeli airstrike...' }
[AutoPublisher] SUCCESS: Pushed to origin/main
[Scheduler] INFO: Scheduling tweet for Tehran in 15min
[Scheduler] INFO: Scheduling email alerts for Tehran
```

## Testing

```bash
# Test the API locally
curl -X POST http://localhost:3001/api/publisher/publish \
  -H "Content-Type: application/json" \
  -d '{
    "headline": "Test attack",
    "location": "Test City",
    "country": "Test Country",
    "coordinates": {"lat": 35.0, "lng": 51.0},
    "confidence": "LOW"
  }'

# Check status
curl http://localhost:3001/api/publisher/status

# List jobs
curl http://localhost:3001/api/publisher/jobs
```

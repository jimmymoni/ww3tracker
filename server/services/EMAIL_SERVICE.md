# Email Alert Service

Hourly batch email alerts for WW3 Tracker subscribers.

## Overview

- **Batches** multiple attacks into one email (hourly digest)
- **Filters** by confidence: HIGH/MEDIUM = email, LOW = site-only
- **Persists** queue across server restarts
- **Supports** Gmail, SendGrid, AWS SES

## Configuration

Add to `.env`:

```bash
# SendGrid (Recommended - 100 emails/day free)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM=alerts@ww3tracker.live

# Gmail Alternative
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password

# Batch interval (default: 1 hour)
EMAIL_BATCH_INTERVAL=3600000
```

## API Endpoints

```
GET  /api/email/status         - Queue status
POST /api/email/test           - Send test email  
POST /api/email/send-batch     - Trigger batch now
POST /api/email/clear-queue    - Clear pending queue
POST /api/email/verify-smtp    - Test SMTP config
POST /api/email/queue-attack   - Queue an attack
```

## Usage

### Queue an attack for alerting:

```javascript
import { emailService } from './services/emailService.js';

await emailService.queueAttack({
  id: '2026-03-20-tehran',
  headline: 'Israeli airstrike on Tehran',
  description: 'Details here...',
  location: 'Tehran',
  country: 'Iran',
  attackType: 'airstrike',
  severity: 'high',  // Only high/medium are emailed
  date: '2026-03-20T12:00:00Z',
  conflictZone: 'us-iran-war-2026'
});
```

### Send test email:

```bash
curl -X POST http://localhost:3001/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Check queue status:

```bash
curl http://localhost:3001/api/email/status
```

## Email Templates

- **Subject:** Dynamic based on severity count
- **Header:** WW3 Tracker branding with summary
- **Content:** Attack cards with severity badges
- **Footer:** Unsubscribe link, social links

## Architecture

```
New Attack → queueAttack() → Pending Queue → Hourly Timer → 
sendBatch() → Generate Email → SMTP Send → Subscribers
```

## Data Files

- `server/data/subscribers.json` - Subscriber list
- `server/data/pendingAttacks.json` - Queue persistence

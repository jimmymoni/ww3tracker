# Regional Conflict Tracker API Documentation

## Overview

The Regional Conflict Tracker API provides access to verified conflict data across multiple zones including US-Iran tensions, Pakistan-Afghanistan border conflict, Israel-Hezbollah conflict, and Yemen civil war.

**Base URL:** `http://localhost:3001/api` (production: `https://ww3tracker.live/api`)

---

## Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/attacks` | GET | Get verified attacks (supports zone filtering) |
| `/api/conflict-zones` | GET | List all conflict zones |
| `/api/conflict-zones/:zoneId` | GET | Get detailed zone information |
| `/api/relationships` | GET | Get actor relationships |
| `/api/context/:zoneId` | GET | Get zone context documentation |

---

## 1. GET /api/attacks

Returns verified attacks with optional zone filtering.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `hours` | number | 48 | Time window in hours |
| `zone` | string | 'all' | Filter by zone ID: `us-iran-war-2026`, `pak-afghan-border-conflict`, `israel-hezbollah-conflict`, `all` |

### Response

```json
{
  "attacks": [
    {
      "id": "2026-03-17-tehran-leadership",
      "headline": "Israeli precision airstrike on senior Iranian leadership in Tehran",
      "description": "Precision strike targeting senior Iranian leadership...",
      "pubDate": "2026-03-17T12:00:00Z",
      "source": "Verified reports",
      "coordinates": { "lat": 35.6892, "lng": 51.3890 },
      "conflictZone": "us-iran-war-2026",
      "country": "Iran",
      "mapAnalysis": {
        "isAttack": true,
        "attackType": "airstrike",
        "location": "Tehran",
        "severity": "high",
        "description": "Precision strike targeting senior Iranian leadership..."
      }
    }
  ],
  "count": 19,
  "hoursWindow": 48,
  "zoneFilter": "us-iran-war-2026",
  "totalVerified": 22,
  "zoneStats": {
    "us-iran-war-2026": { "count": 19, "highSeverity": 15, "countries": ["Iran", "Israel", ...] },
    "pak-afghan-border-conflict": { "count": 2, "highSeverity": 2, "countries": ["Afghanistan", "Pakistan"] }
  },
  "lastUpdated": "2026-03-18T12:00:00Z",
  "verified": true,
  "responseTime": 12
}
```

### Example Requests

```bash
# Get all attacks (last 48 hours)
GET /api/attacks

# Get US-Iran zone attacks only
GET /api/attacks?zone=us-iran-war-2026

# Get Pakistan-Afghanistan attacks (last 72 hours)
GET /api/attacks?zone=pak-afghan-border-conflict&hours=72
```

---

## 2. GET /api/conflict-zones

Returns summary of all conflict zones.

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `includeInactive` | boolean | false | Include inactive zones |

### Response

```json
{
  "zones": [
    {
      "id": "us-iran-war-2026",
      "name": "US-Iran War",
      "region": "Middle East / Persian Gulf",
      "active": true,
      "attackCount": 19
    },
    {
      "id": "pak-afghan-border-conflict",
      "name": "Pakistan-Afghanistan Border Conflict",
      "region": "South Asia",
      "active": true,
      "attackCount": 2
    }
  ],
  "count": 2,
  "activeCount": 2,
  "lastUpdated": "2026-03-18T12:00:00Z",
  "responseTime": 5
}
```

---

## 3. GET /api/conflict-zones/:zoneId

Returns detailed information about a specific conflict zone.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `zoneId` | string | Zone identifier (e.g., `us-iran-war-2026`) |

### Response

```json
{
  "zone": {
    "id": "us-iran-war-2026",
    "name": "US-Iran War",
    "region": "Middle East / Persian Gulf",
    "active": true,
    "startedDate": "2026-03-15",
    "rootCauses": [
      {
        "factor": "Nuclear Program Tensions",
        "description": "Escalating tensions over Iran's uranium enrichment...",
        "year": 2025
      }
    ],
    "keyPlayers": [
      {
        "name": "United States",
        "type": "state",
        "role": "Primary adversary",
        "motivation": "Prevent Iranian nuclear weapons...",
        "capabilities": "Superior air/naval power...",
        "losses": { "personnel": "Minimal", "equipment": "Minor", "economic": "Oil surge" }
      }
    ],
    "triggerEvents": [
      { "date": "2026-03-15", "event": "First US airstrikes on Iran", "impact": "War begins" }
    ],
    "currentStatus": {
      "phase": "active-combat",
      "casualties": { "estimated": "500+", "confirmed": "127" },
      "keyDevelopments": ["Israeli leadership strike confirmed", "Oil facilities damaged"]
    }
  },
  "attacks": {
    "count": 19,
    "recent": [...]
  },
  "responseTime": 8
}
```

### Error Response

```json
{
  "error": "Zone not found",
  "availableZones": ["us-iran-war-2026", "pak-afghan-border-conflict", ...]
}
```

---

## 4. GET /api/relationships

Returns actor relationships and conflict network data.

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `actor` | string | Filter by actor ID (e.g., `iran`, `united-states`) |
| `type` | string | Filter by relationship type: `attacking`, `alliance`, `proxy-master`, `rivalry` |

### Response

```json
{
  "actors": [
    {
      "id": "united-states",
      "name": "United States",
      "shortName": "US",
      "type": "nation-state",
      "category": "superpower",
      "flag": "🇺🇸",
      "region": "north-america"
    }
  ],
  "relationships": [
    {
      "id": "rel-us-iran-attacks",
      "source": "united-states",
      "target": "iran",
      "type": "attacking",
      "attackTypes": ["airstrike", "missile", "naval"],
      "intensity": "high",
      "description": "US conducting wide-scale strikes...",
      "since": "2026-03-16"
    }
  ],
  "stats": {
    "totalActors": 20,
    "activeAttacks": 15,
    "activeProxies": 6,
    "nuclearActors": 4,
    "conflictZones": 4,
    "directWarPairs": 5
  },
  "count": 15,
  "responseTime": 10
}
```

---

## 5. GET /api/context/:zoneId

Returns markdown context documentation for a zone, parsed as JSON or raw markdown.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `zoneId` | string | Zone identifier |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `format` | string | 'json' | Output format: `json` or `markdown` |

### JSON Response

```json
{
  "zoneId": "us-iran-war-2026",
  "zoneName": "US-Iran War",
  "format": "json",
  "content": {
    "title": "US-Iran Direct Conflict",
    "sections": [
      {
        "title": "Overview",
        "content": [...]
      }
    ]
  },
  "lastModified": "2026-03-18T10:00:00Z",
  "responseTime": 15
}
```

### Markdown Response

When `format=markdown`, returns raw markdown content:

```markdown
# US-Iran Direct Conflict

## Overview

The US-Iran direct conflict represents the most dangerous escalation...
```

---

## Conflict Zone IDs

| Zone ID | Name | Region | Attacks |
|---------|------|--------|---------|
| `us-iran-war-2026` | US-Iran War | Middle East | 19 |
| `pak-afghan-border-conflict` | Pakistan-Afghanistan Border Conflict | South Asia | 2 |
| `israel-hezbollah-conflict` | Israel-Hezbollah Conflict | Middle East | 4 |
| `yemen-civil-war` | Yemen Civil War | Middle East | 0 (in database) |

---

## Helper Functions (Server-side)

The following helper functions are available for server-side use:

### From `verifiedAttacks.js`

```javascript
import { 
  getAllAttacks,        // Get all attacks sorted by date
  getAttacks,           // Get attacks within time window
  getAttacksByZone,     // Get attacks filtered by zone
  getAttackCount,       // Get total attack count
  getZoneStatistics     // Get stats grouped by zone
} from './data/verifiedAttacks.js';
```

### From `conflictZones.js`

```javascript
import {
  getAllZones,          // Get all zones summary
  getZoneById,          // Get zone details
  getActiveZones,       // Get only active zones
  getZoneStats,         // Get zone statistics
  getRelatedZones       // Get zones involving an actor
} from './data/conflictZones.js';
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Description of error",
  "message": "Detailed message (if available)"
}
```

Common HTTP status codes:
- `200` - Success
- `404` - Zone/Resource not found
- `500` - Server error

---

## Data Updates

- **Attacks**: Manually verified and curated
- **Zones**: Updated when new conflicts emerge
- **Relationships**: Updated based on verified diplomatic/military changes

All data includes `lastUpdated` timestamp for freshness tracking.

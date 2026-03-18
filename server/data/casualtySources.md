# Casualty Data Sources - Accuracy Guide

## Tier 1: Most Reliable (Use These)

### ACLED (Armed Conflict Location & Event Data)
- **URL:** acleddata.com
- **API:** Yes (requires free registration)
- **Coverage:** Real-time conflict events with fatalities
- **Accuracy:** ⭐⭐⭐⭐⭐ Gold standard for conflict data
- **Update:** Daily
- **Cost:** Free for non-commercial use

### UCDP (Uppsala Conflict Data Program)
- **URL:** ucdp.uu.se
- **API:** Yes
- **Coverage:** State-based conflict deaths
- **Accuracy:** ⭐⭐⭐⭐⭐ Academic gold standard
- **Update:** Annual (best for historical), monthly (current)
- **Cost:** Free

### UN OCHA (Office for Coordination of Humanitarian Affairs)
- **URL:** reliefweb.int / data.humdata.org
- **API:** Yes
- **Coverage:** Humanitarian casualties, civilian impact
- **Accuracy:** ⭐⭐⭐⭐⭐ UN verified
- **Update:** Weekly situation reports

## Tier 2: Good for Cross-Reference

### Airwars (Civilian casualties from airstrikes)
- **URL:** airwars.org
- **Focus:** Civilian deaths from US/coalition airstrikes
- **Accuracy:** ⭐⭐⭐⭐ Very thorough verification

### Syria Civil Defence (White Helmets)
- **Focus:** Syria-specific casualty data
- **Accuracy:** ⭐⭐⭐⭐ On-ground sources

### Iraq Body Count
- **URL:** iraqbodycount.org
- **Focus:** Iraq casualties only
- **Accuracy:** ⭐⭐⭐⭐ Media-based but rigorous

## Tier 3: Use with Caution

### Media Reports (Reuters, AP, BBC)
- **Accuracy:** ⭐⭐⭐ Varies by access
- **Best for:** Breaking events, not totals

### Government Statements
- **Accuracy:** ⭐⭐ Often inflated/deflated
- **Best for:** Cross-reference only

## Our Approach

```javascript
// Data confidence levels
const CONFIDENCE = {
  VERIFIED: 'verified',      // Multiple independent sources confirm
  REPORTED: 'reported',      // Single credible source
  ESTIMATED: 'estimated',    // NGOs/UN estimates
  CLAIMED: 'claimed'         // Unverified claims
};

// Display format
{
  civilian: { confirmed: 12847, estimated: 15000, confidence: 'verified' },
  military: { confirmed: 8231, estimated: null, confidence: 'reported' },
  source: 'ACLED + UN OCHA',
  lastUpdated: '2026-03-18T06:00:00Z'
}
```

## Implementation

1. **Primary:** ACLED API for daily updates
2. **Cross-check:** UN OCHA weekly reports
3. **Breaking:** Reuters/AP for real-time
4. **Display:** Always show confidence level

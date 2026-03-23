/**
 * VERIFIED ATTACKS DATABASE
 * Manually curated by admin - 100% verified facts only
 * No RSS, no AI hallucination, no expiration
 * Last updated: 2026-03-23
 * 
 * NEW: Added conflictZone field linking to conflictZones.js
 */

export const VERIFIED_ATTACKS = [
  // ==================== MARCH 22-23, 2026 - LATEST VERIFIED ATTACKS ====================
  // Source: Guardian, Times of Israel, Al Jazeera, Politico, Haaretz, Reuters, WSJ

  // 🇮🇷 Iran → 🇮🇱 Israel - Missile Strikes on Southern Israel
  {
    id: '2026-03-22-dimona',
    headline: 'Iranian missiles hit Dimona & Arad, ~200 injured',
    description: 'Iranian ballistic missiles struck the southern cities of Dimona and Arad after failures in Israeli air defenses. Widespread damage occurred to apartment buildings and residential neighborhoods, with dozens of structures heavily damaged or at risk of collapse. Nearly 200 people were injured, including children in serious condition, with reports of mass casualty events.',
    location: 'Dimona',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-22T20:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Guardian, Times of Israel, Al Jazeera',
    coordinates: { lat: 31.0667, lng: 35.0333 },
    context: 'Residential areas near nuclear facility',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-22-arad',
    headline: 'Iranian strikes devastate Arad, heavy civilian toll',
    description: 'Missiles directly impacted Arad causing extensive destruction across multiple apartment blocks. Rescue operations highlighted collapsed buildings and widespread debris. Over 100 injuries reported in Arad alone, contributing to the total of around 200 wounded from the barrage.',
    location: 'Arad',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-22T20:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Guardian, Politico, Times of Israel',
    coordinates: { lat: 31.25, lng: 35.2167 },
    context: 'Residential neighborhoods',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇱🇧 Hezbollah → 🇮🇱 Israel - Northern Border Attack
  {
    id: '2026-03-22-misgav-am',
    headline: 'Hezbollah rocket kills 60-year-old in Misgav Am',
    description: 'A Hezbollah rocket struck a vehicle in Kibbutz Misgav Am, killing 60-year-old avocado farmer and kibbutz spokesman Ofer Moskovitz. The attack set the car ablaze, resulting in his death at the scene. This marks a confirmed civilian fatality from ongoing northern border rocket fire.',
    location: 'Misgav Am',
    country: 'Israel',
    attackType: 'rocket',
    severity: 'critical',
    date: '2026-03-22T06:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Times of Israel, Haaretz',
    coordinates: { lat: 33.05, lng: 35.45 },
    context: 'Civilian vehicle in kibbutz',
    conflictZone: 'israel-hezbollah-conflict'
  },

  // 🇮🇱 Israel → 🇮🇷 Iran - Airstrikes on Tehran
  {
    id: '2026-03-22-tehran-overnight',
    headline: 'Israeli airstrikes pound Tehran overnight',
    description: 'Israeli (with noted US involvement) airstrikes targeted sites in Tehran including regime-linked and military infrastructure. Heavy bombardment caused explosions and damage to buildings in areas like Damavand Street. Reports confirm ongoing powerful strikes across the capital.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-22T03:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Al Jazeera, Reuters',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    context: 'Military and infrastructure sites',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇮🇱 Israel → 🇵🇸 Palestine - Gaza Operations
  {
    id: '2026-03-22-gaza',
    headline: 'Israeli airstrikes continue across Gaza',
    description: 'Israeli forces intensified airstrikes and artillery throughout the day in Gaza. Strikes focused on Hamas-linked targets amid urban areas. Ongoing bombardment aligns with persistent conflict operations causing repeated damage.',
    location: 'Gaza Strip',
    country: 'Palestine',
    attackType: 'airstrike',
    severity: 'medium',
    date: '2026-03-22T12:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Various regional reports',
    coordinates: { lat: 31.5, lng: 34.4667 },
    context: 'Hamas positions and urban zones',
    conflictZone: 'israel-hamas-gaza-conflict'
  },

  // 🇮🇱 Israel → 🇱🇧 Lebanon - Qasmiyeh Bridge Destruction
  {
    id: '2026-03-22-qasmiyeh-bridge',
    headline: 'Israeli airstrike destroys Qasmiyeh Bridge in southern Lebanon',
    description: 'An Israeli airstrike destroyed the Qasmiyeh Bridge over the Litani River in southern Lebanon, a key transport artery. Visuals confirm the bridge has been completely demolished, severing a critical logistics route in the region.',
    location: 'Qasmiyeh',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-22T14:00:00Z',
    reportedAt: '2026-03-22',
    source: 'Reuters, X/visuals',
    coordinates: { lat: 33.2833, lng: 35.3167 },
    context: 'Key transport bridge over Litani River',
    conflictZone: 'israel-hezbollah-conflict'
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

// Helper: Get all attacks
export function getAllAttacks() {
  return VERIFIED_ATTACKS;
}

// Helper: Get attacks within time window (hours)
export function getAttacks(hours = 8760) {
  const now = new Date();
  const cutoff = new Date(now - hours * 60 * 60 * 1000);
  
  return VERIFIED_ATTACKS.filter(attack => {
    const attackDate = new Date(attack.date);
    return attackDate >= cutoff;
  });
}

// Helper: Get attacks by zone
export function getAttacksByZone(zoneId) {
  return VERIFIED_ATTACKS.filter(attack => attack.conflictZone === zoneId);
}

// Helper: Get zone statistics
export function getZoneStatistics(zoneId) {
  const attacks = getAttacksByZone(zoneId);
  return {
    total: attacks.length,
    highSeverity: attacks.filter(a => a.severity === 'high' || a.severity === 'critical').length,
    byType: attacks.reduce((acc, attack) => {
      acc[attack.attackType] = (acc[attack.attackType] || 0) + 1;
      return acc;
    }, {}),
    locations: [...new Set(attacks.map(a => a.location))]
  };
}

// Helper: Check for duplicate attacks (within 6 hours, same location)
export function attackExists(location, date) {
  return VERIFIED_ATTACKS.some(existing => {
    const sameLocation = existing.location === location;
    const timeDiff = Math.abs(new Date(existing.date) - new Date(date));
    const within6Hours = timeDiff < (6 * 60 * 60 * 1000);
    return sameLocation && within6Hours;
  });
}

// Helper: Get attack count
export function getAttackCount() {
  return VERIFIED_ATTACKS.length;
}

// Helper: Get attack count by zone
export function getAttackCountByZone(zoneId) {
  return VERIFIED_ATTACKS.filter(attack => attack.conflictZone === zoneId).length;
}

// Helper: Get unique locations
export function getAttackLocations() {
  return [...new Set(VERIFIED_ATTACKS.map(a => a.location))];
}

// Helper: Get zone statistics for all zones
export function getAllZoneStatistics() {
  const stats = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!stats[zone]) {
      stats[zone] = { count: 0, highSeverity: 0, countries: new Set() };
    }
    stats[zone].count++;
    if (attack.severity === 'high' || attack.severity === 'critical') {
      stats[zone].highSeverity++;
    }
    stats[zone].countries.add(attack.country);
  });
  
  // Convert Sets to Arrays for JSON serialization
  Object.keys(stats).forEach(zone => {
    stats[zone].countries = [...stats[zone].countries];
  });
  
  return stats;
}

// Helper: Add new attack (for admin use)
export function addAttack(attack) {
  // Check for duplicates
  if (attackExists(attack.location, attack.date)) {
    console.log(`[VerifiedAttacks] Duplicate detected: ${attack.location} at ${attack.date}`);
    return false;
  }
  
  VERIFIED_ATTACKS.push({
    ...attack,
    id: attack.id || `${attack.date}-${attack.location.toLowerCase().replace(/\s+/g, '-')}`
  });
  
  // Sort by date (newest first)
  VERIFIED_ATTACKS.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return true;
}

// Helper: Get latest attack
export function getLatestAttack() {
  return VERIFIED_ATTACKS[0];
}

// Helper: Get attacks by date range
export function getAttacksByDateRange(startDate, endDate) {
  return VERIFIED_ATTACKS.filter(attack => {
    const attackDate = new Date(attack.date);
    return attackDate >= new Date(startDate) && attackDate <= new Date(endDate);
  });
}

// Helper: Get high severity attacks
export function getHighSeverityAttacks() {
  return VERIFIED_ATTACKS.filter(attack => 
    attack.severity === 'high' || attack.severity === 'critical'
  );
}

// Export default for convenience
export default VERIFIED_ATTACKS;

/**
 * VERIFIED ATTACKS DATABASE
 * Manually curated by admin - 100% verified facts only
 * No RSS, no AI hallucination, no expiration
 * Last updated: 2026-03-18
 * 
 * NEW: Added conflictZone field linking to conflictZones.js
 */

export const VERIFIED_ATTACKS = [
  // ⚔️ VERIFIED STRIKES — MAR 17–18, 2026
  // Only confirmed events in this window; specific sites mentioned where reliably reported

  // 🇮🇱 Israel → 🇮🇷 Iran
  {
    id: '2026-03-17-tehran-leadership',
    headline: 'Israeli precision airstrike on senior Iranian leadership in Tehran',
    description: 'Central govt district / security zone. Senior leadership compound targeted. High-level officials killed.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T12:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    context: 'Central government district / security zone',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-tehran-wave',
    headline: 'Wide-scale Israeli strikes on Tehran government & military infrastructure',
    description: 'West & north districts incl. military/admin zones. Govt & IRGC-linked infrastructure targeted.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T04:30:00Z',
    reportedAt: '2026-03-17',
    source: 'IDF announcement, verified reports',
    coordinates: { lat: 35.7219, lng: 51.3347 },
    context: 'West & north districts incl. military/admin zones',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇺🇸 USA → 🇮🇷 Iran
  {
    id: '2026-03-17-hormuz-usa',
    headline: 'US airstrikes on Iranian missile facilities in Strait of Hormuz',
    description: 'Bandar Abbas port + coastal missile belt. Missile storage/launch sites targeted with heavy bunker-buster munitions.',
    location: 'Bandar Abbas',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T14:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 27.1833, lng: 56.2666 },
    context: 'Port + coastal missile belt, Strait of Hormuz',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇮🇷 Iran → 🇮🇱 Israel
  {
    id: '2026-03-17-tel-aviv-barrage',
    headline: 'Iranian missile and drone barrage on Tel Aviv metro',
    description: 'Central district / Gush Dan region. Urban + air defense zones targeted. Multiple interceptions, minor injuries.',
    location: 'Tel Aviv',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T03:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 32.0853, lng: 34.7818 },
    context: 'Central district / Gush Dan region',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-tel-aviv-missile',
    headline: 'Iranian ballistic missile strike on central Tel Aviv',
    description: 'Central urban impact zone. Ballistic missiles targeting civilian/urban area. Explosions confirmed, damage reported.',
    location: 'Tel Aviv',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T02:00:00Z',
    reportedAt: '2026-03-18',
    source: 'Verified reports',
    coordinates: { lat: 32.1098, lng: 34.8555 },
    context: 'Central urban impact zone',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇮🇷 Iran → 🌍 Gulf Region
  {
    id: '2026-03-17-kuwait-oil',
    headline: 'Iranian missile and drone strikes on Gulf oil facilities',
    description: 'Kuwait City oil/port infrastructure zone. Energy facilities targeted. No casualties confirmed.',
    location: 'Kuwait City',
    country: 'Kuwait',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T16:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 29.3759, lng: 47.9774 },
    context: 'Oil/port infrastructure zone',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-doha-intercepted',
    headline: 'Iranian ballistic missile attack on Doha intercepted',
    description: 'Airspace over central Doha. Missile intercepted by air defense. Fire in industrial area from debris. No casualties.',
    location: 'Doha',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T06:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 25.2854, lng: 51.5310 },
    context: 'Airspace over central Doha (intercepted)',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇮🇷-linked groups → 🇺🇸 (Iraq)
  {
    id: '2026-03-17-baghdad-embassy',
    headline: 'Major attack on US Embassy Baghdad - rockets and drones',
    description: 'Green Zone – US Embassy compound. At least 5 drones and rockets launched; one drone hit inside compound. Diplomatic/military site targeted.',
    location: 'Baghdad',
    country: 'Iraq',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-17T01:45:00Z',
    reportedAt: '2026-03-17',
    source: 'Iraqi security sources, Reuters witnesses',
    coordinates: { lat: 33.3128, lng: 44.3615 },
    context: 'Green Zone – US Embassy compound',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-baghdad-residential',
    headline: 'Missile strike on residential building in Baghdad al-Jadriya',
    description: 'Al-Jadriya residential district. Civilian building hit. Injuries reported; Iran-linked personnel casualties.',
    location: 'Baghdad',
    country: 'Iraq',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T05:00:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 33.2854, lng: 44.3848 },
    context: 'Al-Jadriya residential district',
    conflictZone: 'us-iran-war-2026'
  },

  // 🇮🇱 Israel → 🇱🇧 Lebanon
  {
    id: '2026-03-17-beirut-multi',
    headline: 'Israeli airstrikes hit multiple Beirut neighborhoods',
    description: 'Kafaat, Haret Hreik, and Doha Aramoun neighborhoods. Urban/military-linked sites including Hezbollah-linked areas targeted.',
    location: 'Beirut',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T02:30:00Z',
    reportedAt: '2026-03-17',
    source: 'Verified reports',
    coordinates: { lat: 33.8738, lng: 35.5218 },
    context: 'Multiple neighborhoods incl. Hezbollah-linked urban zones',
    conflictZone: 'israel-hezbollah-conflict'
  },
  {
    id: '2026-03-18-beirut-hezbollah',
    headline: 'Israeli airstrike on Hezbollah-linked structure in central Beirut',
    description: 'Central district, targeted building. Hezbollah-linked structure destroyed following warning.',
    location: 'Beirut',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-18T08:00:00Z',
    reportedAt: '2026-03-18',
    source: 'Verified reports',
    coordinates: { lat: 33.8938, lng: 35.5018 },
    context: 'Central district, targeted building',
    conflictZone: 'israel-hezbollah-conflict'
  },
  {
    id: '2026-03-18-tyre',
    headline: 'Israeli airstrikes on Hezbollah rocket launch sites in southern Lebanon',
    description: 'Tyre, South Lebanon coastal launch areas. Rocket launch sites targeted. Multiple Hezbollah sites hit.',
    location: 'Tyre',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'medium',
    date: '2026-03-18T06:00:00Z',
    reportedAt: '2026-03-18',
    source: 'Verified reports',
    coordinates: { lat: 33.2700, lng: 35.2033 },
    context: 'Coastal launch areas',
    conflictZone: 'israel-hezbollah-conflict'
  },

  // ==================== GROK VERIFIED - MAR 18-19, 2026 ====================
  // Source: Cross-checked Reuters, AP, NYT, BBC, Al Jazeera, Bloomberg, ISW
  
  // March 18, 2026
  {
    id: '2026-03-18-ramat-gan',
    headline: 'Iranian ballistic missile strike kills 2 in Ramat Gan suburb',
    description: 'IRGC missiles with cluster munitions hit residential building. Elderly couple Yaron & Ilana Moshe (70s) killed by shrapnel. Rail station damaged.',
    location: 'Ramat Gan',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T04:00:00Z',
    reportedAt: '2026-03-18',
    source: 'NYT, Guardian, Times of Israel, ISW, Al Jazeera',
    coordinates: { lat: 32.07, lng: 34.82 },
    context: 'Predawn strike on civilian area with cluster munitions',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-south-pars',
    headline: 'Israeli airstrikes on South Pars gas field, Iran',
    description: 'World\'s largest gas field (shared with Qatar) hit. Gas storage tanks and petrochemical plants targeted. Production halted.',
    location: 'Asaluyeh',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-18T15:00:00Z',
    reportedAt: '2026-03-18',
    source: 'Bloomberg, AP, Al Jazeera, Jerusalem Post, Reuters',
    coordinates: { lat: 27.5, lng: 52.5 },
    context: 'Major energy infrastructure attack. US informed but did not participate.',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-tehran-khatib',
    headline: 'Israeli airstrike kills Iranian Intelligence Minister Khatib',
    description: 'Precision strike targeting Iranian Intelligence Minister Esmaeil Khatib. Both Iran and Israel confirmed death. Major escalation.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'critical',
    date: '2026-03-18T02:00:00Z',
    reportedAt: '2026-03-18',
    source: 'NYT, Al Jazeera, BBC, DW, Israeli Defense Minister',
    coordinates: { lat: 35.6892, lng: 51.389 },
    context: 'High-level assassination. Critical escalation.',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-beit-awwa',
    headline: 'Iranian missile strike on West Bank - first direct hit',
    description: 'First Iranian missile strike in West Bank. Civilian area in Beit Awwa targeted. 4 killed, 6 injured. Regional expansion of conflict.',
    location: 'Beit Awwa',
    country: 'West Bank',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T08:00:00Z',
    reportedAt: '2026-03-18',
    source: 'NYT live updates, Israeli reports',
    coordinates: { lat: 31.5, lng: 35.0 },
    context: 'First direct Iranian attack in West Bank. Significant regional expansion.',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-hezbollah-rockets',
    headline: 'Hezbollah rocket attacks on northern Israel',
    description: 'Coordinated rocket barrage on Kiryat Shmona and Ashkelon. Part of broader Iranian-backed offensive.',
    location: 'Kiryat Shmona',
    country: 'Israel',
    attackType: 'missile',
    severity: 'medium',
    date: '2026-03-18T12:00:00Z',
    reportedAt: '2026-03-18',
    source: 'ISW Special Report, ILTV',
    coordinates: { lat: 33.2, lng: 35.6 },
    context: 'Hezbollah coordination with Iranian strikes',
    conflictZone: 'israel-hezbollah-conflict'
  },

  // March 19, 2026
  {
    id: '2026-03-19-ras-laffan',
    headline: 'Iranian missiles hit Qatar LNG facility',
    description: '5 ballistic missiles fired at world\'s largest LNG hub. 1 impacted. Extensive fires. No worker injuries. Global energy market impact.',
    location: 'Ras Laffan',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'critical',
    date: '2026-03-19T03:00:00Z',
    reportedAt: '2026-03-19',
    source: 'Al Jazeera, Qatar Ministry, Times of India, Bloomberg',
    coordinates: { lat: 25.9, lng: 51.5 },
    context: 'Major escalation - attack on world\'s largest LNG facility.',
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-19-riyadh-refineries',
    headline: 'Iranian missiles strike Riyadh oil refineries',
    description: 'Multiple ballistic missiles hit oil refineries near Saudi capital. Explosions and fires. Limited casualties due to intercepts.',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-19T04:00:00Z',
    reportedAt: '2026-03-19',
    source: 'Times of India, Al Jazeera, Saudi statements, Reuters',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    context: 'Major Saudi energy infrastructure targeted.',
    conflictZone: 'us-iran-war-2026'
  }
];

// ==================== HELPER FUNCTIONS ====================

// Helper: Get all verified attacks
export function getAllAttacks() {
  return [...VERIFIED_ATTACKS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks within time window (hours)
export function getAttacks(hoursWindow = 48) {
  const cutoff = Date.now() - (hoursWindow * 60 * 60 * 1000);
  return VERIFIED_ATTACKS.filter(attack => {
    return new Date(attack.date).getTime() > cutoff;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks by conflict zone
export function getAttacksByZone(zoneId) {
  return VERIFIED_ATTACKS.filter(attack => attack.conflictZone === zoneId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks grouped by zone
export function getAttacksGroupedByZone() {
  const grouped = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!grouped[zone]) {
      grouped[zone] = [];
    }
    grouped[zone].push(attack);
  });
  return grouped;
}

// Helper: Add new verified attack (prevents duplicates by location+date)
export function addAttack(attackData) {
  // Check for duplicate (same location within 6 hours)
  const isDuplicate = VERIFIED_ATTACKS.some(existing => {
    const sameLocation = existing.location === attackData.location;
    const timeDiff = Math.abs(new Date(existing.date) - new Date(attackData.date));
    const within6Hours = timeDiff < (6 * 60 * 60 * 1000);
    return sameLocation && within6Hours;
  });

  if (isDuplicate) {
    console.log(`[VerifiedDB] Duplicate attack skipped: ${attackData.location}`);
    return null;
  }

  const newAttack = {
    id: `attack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...attackData,
    addedAt: new Date().toISOString()
  };

  VERIFIED_ATTACKS.push(newAttack);
  console.log(`[VerifiedDB] New attack added: ${attackData.headline}`);
  return newAttack;
}

// Helper: Check if attack already exists
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

// Helper: Get zone statistics
export function getZoneStatistics() {
  const stats = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!stats[zone]) {
      stats[zone] = { count: 0, highSeverity: 0, countries: new Set() };
    }
    stats[zone].count++;
    if (attack.severity === 'high') {
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

export default {
  VERIFIED_ATTACKS,
  getAllAttacks,
  getAttacks,
  getAttacksByZone,
  getAttacksGroupedByZone,
  addAttack,
  attackExists,
  getAttackCount,
  getAttackCountByZone,
  getAttackLocations,
  getZoneStatistics
};

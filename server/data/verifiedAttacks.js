/**
 * VERIFIED ATTACKS DATABASE
 * Manually curated by admin - 100% verified facts only
 * No RSS, no AI hallucination, no expiration
 * Last updated: 2026-03-16
 */

export const VERIFIED_ATTACKS = [
  // Major strikes: 14-16 March 2026
  {
    id: '2026-03-16-dubai-airport',
    headline: 'Drone strike on Dubai International Airport fuel tank',
    description: 'Large fire at fuel tank area, temporary flight suspension and diversions. UAE drone strike.',
    location: 'Dubai',
    country: 'UAE',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-16T08:00:00Z',
    reportedAt: '2026-03-16',
    source: 'Verified reports',
    coordinates: { lat: 25.2048, lng: 55.2708 }
  },
  {
    id: '2026-03-15-fujairah-oil',
    headline: 'Drone strike on Fujairah oil infrastructure',
    description: 'Fire reported at Fujairah oil industry zone. Iranian drone suspected.',
    location: 'Fujairah',
    country: 'UAE',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-15T14:00:00Z',
    reportedAt: '2026-03-15',
    source: 'Verified reports',
    coordinates: { lat: 25.1288, lng: 56.3265 }
  },
  {
    id: '2026-03-15-tehran-depots',
    headline: 'Israeli airstrikes on Tehran fuel depots',
    description: 'Explosions reported in capital and fuel depot areas. Multiple locations hit.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-15T18:00:00Z',
    reportedAt: '2026-03-15',
    source: 'Verified reports',
    coordinates: { lat: 35.6892, lng: 51.3890 }
  },
  {
    id: '2026-03-15-markazi',
    headline: 'US-Israeli strikes in Markazi Province',
    description: 'Reported deaths from attacks on facilities in Markazi Province.',
    location: 'Markazi',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-15T12:00:00Z',
    reportedAt: '2026-03-15',
    source: 'Verified reports',
    coordinates: { lat: 34.0917, lng: 49.6892 }
  },
  {
    id: '2026-03-16-chabahar',
    headline: 'US airstrikes on Chabahar Free Trade Zone',
    description: 'Military facilities near Chabahar Free Trade Zone targeted.',
    location: 'Chabahar',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-16T06:00:00Z',
    reportedAt: '2026-03-16',
    source: 'Verified reports',
    coordinates: { lat: 25.2969, lng: 60.6458 }
  },
  {
    id: '2026-03-16-khiam',
    headline: 'Israeli airstrikes on Khiam, southern Lebanon',
    description: 'Multiple strikes reported in Khiam, southern Lebanon.',
    location: 'Khiam',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'medium',
    date: '2026-03-16T10:00:00Z',
    reportedAt: '2026-03-16',
    source: 'Verified reports',
    coordinates: { lat: 33.3333, lng: 35.6167 }
  },
  {
    id: '2026-03-16-doha-missile',
    headline: 'Iranian missile launch toward Doha area',
    description: 'Missile intercepted by Qatari air defense, evacuations triggered.',
    location: 'Doha',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-16T09:00:00Z',
    reportedAt: '2026-03-16',
    source: 'Verified reports',
    coordinates: { lat: 25.2854, lng: 51.5310 }
  },
  {
    id: '2026-03-16-saudi-drones',
    headline: 'Iranian drone waves intercepted by Saudi Arabia',
    description: 'Multiple Iranian drones intercepted over Saudi territory.',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    attackType: 'drone',
    severity: 'medium',
    date: '2026-03-16T11:00:00Z',
    reportedAt: '2026-03-16',
    source: 'Verified reports',
    coordinates: { lat: 24.7136, lng: 46.6753 }
  }
];

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

// Helper: Get unique locations
export function getAttackLocations() {
  return [...new Set(VERIFIED_ATTACKS.map(a => a.location))];
}

export default {
  VERIFIED_ATTACKS,
  getAllAttacks,
  getAttacks,
  addAttack,
  attackExists,
  getAttackCount,
  getAttackLocations
};

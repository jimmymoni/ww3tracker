/**
 * CONFIRMED ATTACKS DATABASE
 * Permanent storage for verified attacks
 * Manually curated + AI-extracted from RSS
 * Never expires - attacks stay on map forever
 */

// Major attacks from March 15-16, 2026 (Dubai, UAE, Iran, etc.)
export const CONFIRMED_ATTACKS = [
  {
    id: 'attack-2026-03-16-dubai-001',
    headline: 'Drone strike on Dubai International Airport fuel tank',
    description: 'Large fire at fuel tank area, temporary flight suspension and diversions',
    location: 'Dubai',
    country: 'UAE',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-16T08:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-15-fujairah-001',
    headline: 'Drone strike on Fujairah oil infrastructure',
    description: 'Fire reported at Fujairah oil industry zone',
    location: 'Fujairah',
    country: 'UAE',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-15T14:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 25.1288, lng: 56.3265 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-15-tehran-001',
    headline: 'Israeli airstrikes on Tehran fuel depots',
    description: 'Explosions reported in capital and fuel depot areas',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-15T18:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-15-markazi-001',
    headline: 'US-Israeli strikes in Markazi Province',
    description: 'Reported deaths from attacks on facilities in the province',
    location: 'Markazi',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-15T12:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 34.0917, lng: 49.6892 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-16-chabahar-001',
    headline: 'US airstrikes on Chabahar Free Trade Zone',
    description: 'Military facilities near Chabahar Free Trade Zone targeted',
    location: 'Chabahar',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-16T06:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 25.2969, lng: 60.6458 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-16-khiam-001',
    headline: 'Israeli airstrikes on Khiam, southern Lebanon',
    description: 'Multiple strikes reported in southern Lebanon',
    location: 'Khiam',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'medium',
    date: '2026-03-16T10:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 33.3333, lng: 35.6167 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-16-doha-001',
    headline: 'Iranian missile launch toward Doha area',
    description: 'Missile intercepted, evacuations triggered',
    location: 'Doha',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-16T09:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 25.2854, lng: 51.5310 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  },
  {
    id: 'attack-2026-03-16-saudi-001',
    headline: 'Iranian drone waves intercepted by Saudi Arabia',
    description: 'Multiple Iranian drones intercepted over Saudi territory',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    attackType: 'drone',
    severity: 'medium',
    date: '2026-03-16T11:00:00Z',
    source: 'Multiple sources',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    verified: true,
    addedBy: 'admin',
    addedAt: '2026-03-16T14:00:00Z'
  }
];

// Function to get attacks within time window
export function getConfirmedAttacks(hoursWindow = 48) {
  const cutoff = Date.now() - (hoursWindow * 60 * 60 * 1000);
  return CONFIRMED_ATTACKS.filter(attack => {
    const attackTime = new Date(attack.date).getTime();
    return attackTime > cutoff;
  });
}

// Function to add new confirmed attack
export function addConfirmedAttack(attackData) {
  const newAttack = {
    id: `attack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...attackData,
    addedAt: new Date().toISOString(),
    verified: true
  };
  CONFIRMED_ATTACKS.push(newAttack);
  return newAttack;
}

// Function to get all attacks (for map display)
export function getAllConfirmedAttacks() {
  return CONFIRMED_ATTACKS.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default {
  CONFIRMED_ATTACKS,
  getConfirmedAttacks,
  addConfirmedAttack,
  getAllConfirmedAttacks
};

/**
 * VERIFIED ATTACKS DATABASE
 * Manually curated by admin - 100% verified facts only
 * No RSS, no AI hallucination, no expiration
 * Last updated: 2026-03-24
 */

export const VERIFIED_ATTACKS = [
  {
    id: "2026-03-24-tel-aviv-missile-0130",
    headline: "Iranian missile and drone barrage partially penetrates Israeli defenses",
    description: "Iran launched a large-scale missile and drone barrage targeting multiple Israeli regions, with confirmed impacts in Tel Aviv. While most projectiles were intercepted, some penetrated defenses, causing localized damage and injuries. Additional harm was reported from falling debris in other regions.",
    location: "Tel Aviv (multiple sites)",
    country: "Israel",
    attackType: "missile/drone",
    severity: "high",
    date: "2026-03-24T01:30:00Z",
    coordinates: { lat: 32.0853, lng: 34.7818 },
    conflictZone: "us-iran-war-2026",
    target: "Multiple urban areas and airspace across Israel",
    source: ["Reuters", "Washington Post", "Haaretz"]
  },
  {
    id: "2026-03-24-tel-aviv-missile-0230",
    headline: "Iranian ballistic missile hits central Tel Aviv, injuring civilians",
    description: "An Iranian ballistic missile struck a residential area in central Tel Aviv, causing visible damage to buildings and vehicles. Multiple verified visuals show debris, blown-out windows, and emergency response teams on site. At least 4–6 people were reported injured, mostly with light wounds.",
    location: "Tel Aviv",
    country: "Israel",
    attackType: "missile",
    severity: "high",
    date: "2026-03-24T02:30:00Z",
    coordinates: { lat: 32.0853, lng: 34.7818 },
    conflictZone: "us-iran-war-2026",
    target: "Urban residential area in central Tel Aviv",
    source: ["Reuters", "AP", "CNN", "The Guardian"]
  }
];

// Helper functions for accessing attack data
export const getAttacks = (hoursBack = null) => {
  if (!hoursBack) return VERIFIED_ATTACKS;
  const cutoff = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
  return VERIFIED_ATTACKS.filter(a => new Date(a.date) >= cutoff);
};

export const getAllAttacks = () => VERIFIED_ATTACKS;

export const getAttacksByZone = (zoneId) => {
  return VERIFIED_ATTACKS.filter(a => a.conflictZone === zoneId);
};

export const getAttackCount = () => VERIFIED_ATTACKS.length;

export const attackExists = (headline, location, hoursWindow = 6) => {
  const cutoff = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);
  return VERIFIED_ATTACKS.some(a => 
    a.headline.toLowerCase() === headline.toLowerCase() &&
    a.location.toLowerCase() === location.toLowerCase() &&
    new Date(a.date) >= cutoff
  );
};

export const getZoneStatistics = () => {
  const stats = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!stats[zone]) {
      stats[zone] = { total: 0, high: 0, critical: 0, locations: new Set() };
    }
    stats[zone].total++;
    if (attack.severity === 'high') stats[zone].high++;
    if (attack.severity === 'critical') stats[zone].critical++;
    stats[zone].locations.add(attack.location);
  });
  
  // Convert Sets to counts
  Object.keys(stats).forEach(zone => {
    stats[zone].locationCount = stats[zone].locations.size;
    delete stats[zone].locations;
  });
  
  return stats;
};

export const getAttackCountByZone = (zoneId) => {
  return VERIFIED_ATTACKS.filter(a => a.conflictZone === zoneId).length;
};

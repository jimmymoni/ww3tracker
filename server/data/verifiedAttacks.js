/**
 * VERIFIED ATTACKS DATABASE
 * Manually curated by admin - 100% verified facts only
 * No RSS, no AI hallucination, no expiration
 * Last updated: 2026-03-23
 * 
 * NOTE: No verified strikes from March 22-23, 2026
 * Database cleared pending new verified attacks
 */

export const VERIFIED_ATTACKS = [
  // No verified attacks at this time
  // All previous entries removed - no confirmed strikes from March 22-23, 2026
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

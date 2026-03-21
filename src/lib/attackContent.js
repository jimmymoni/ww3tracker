/**
 * ATTACK CONTENT ENHANCEMENT LIBRARY
 * 
 * Transforms dry attack data into compelling narrative content.
 * Each function adds storytelling elements, context, and human-readable formats.
 * 
 * @module attackContent
 */

import { VERIFIED_ATTACKS } from '../../server/data/verifiedAttacks';

// ============================================================================
// CONFIGURATION
// ============================================================================

/** 
 * First attack date - used for conflict day calculation 
 * Day 1 = March 17, 2026 (first attack in verified database)
 */
const CONFLICT_START_DATE = '2026-03-17';

/** 
 * Location-specific context templates for "Why This Matters" 
 * Each location has unique strategic/geopolitical significance
 */
const LOCATION_CONTEXT_TEMPLATES = {
  'Tehran': `Strikes on Tehran's government district signal direct escalation into Iran's capital. This moves the conflict from proxy warfare to attacks on sovereign territory and senior leadership — a major escalation that threatens to expand the war beyond the initial theater.`,
  
  'Bandar Abbas': `Bandar Abbas sits at the mouth of the Strait of Hormuz, the chokepoint for 20% of the world's oil. Attacking missile facilities here threatens global energy supplies and risks drawing in Gulf states and international naval forces.`,
  
  'Tel Aviv': `Attacks on Israel's economic capital bring the war home to civilians in one of the Middle East's most populous metro areas. This shifts the conflict from military targets to population centers, raising the stakes dramatically.`,
  
  'Ramat Gan': `Ramat Gan is part of greater Tel Aviv — hitting suburbs with cluster munitions marks a shift toward targeting residential areas. The civilian casualties here represent a dangerous escalation in tactics.`,
  
  'Kuwait City': `Kuwait City oil infrastructure is critical to global energy markets. Attacking facilities here threatens not just Kuwait but worldwide oil supply chains, potentially triggering international economic shockwaves.`,
  
  'Ras Laffan': `Ras Laffan is the world's largest LNG facility — the heart of Qatar's energy exports and a critical node in global natural gas supply. Striking here threatens heating and power for millions across Asia and Europe.`,
  
  'Doha': `Qatar hosts the largest US military base in the Middle East (Al Udeid). An attack on Doha brings the conflict directly to a key US ally and military hub, risking American casualties and direct US military response.`,
  
  'Riyadh': `Saudi Arabia's capital and oil heartland. Attacking refineries here threatens the world's largest oil exporter and risks destabilizing the entire Gulf region — potentially drawing Saudi Arabia fully into the conflict.`,
  
  'Baghdad': `The Green Zone houses the US Embassy and Iraqi government. Attacks here echo the darkest days of the Iraq War and signal that Iran-backed groups are willing to target American diplomatic facilities directly.`,
  
  'Beirut': `Beirut's southern suburbs have long been Hezbollah strongholds. Israeli strikes here risk civilian casualties in one of the Middle East's most densely populated cities, with potential to ignite wider Lebanese involvement.`,
  
  'Tyre': `Southern Lebanon has been a flashpoint for decades. Striking Tyre threatens to reignite the 2006-style conflict and risks Hezbollah opening a full northern front against Israel.`,
  
  'Asaluyeh': `The South Pars gas field is the world's largest, shared between Iran and Qatar. Hitting it threatens regional energy security and demonstrates willingness to target critical civilian infrastructure with global implications.`,
  
  'Beit Awwa': `This is the first Iranian missile strike in the West Bank — a major geographic expansion of the conflict. It signals Iran's willingness to escalate beyond Israel's borders and risks drawing in Palestinian territories.`,
  
  'Kiryat Shmona': `This northern Israeli city has been evacuated since October 2023. Hezbollah attacks here signal they're maintaining pressure on Israel's northern border while coordinating with Iranian strikes elsewhere.`,
  
  'Ashkelon': `Ashkelon lies within standard rocket range from Gaza and Lebanon. Rocket attacks here demonstrate Hezbollah's reach into central Israel and its ability to overwhelm Iron Dome alongside Iranian barrages.`
};

/** 
 * Generic fallback templates when no location-specific context exists 
 */
const FALLBACK_CONTEXT_TEMPLATES = {
  'airstrike': (location, conflictZone) => `The precision airstrike on ${location} represents a significant escalation in the ${getConflictZoneDisplayName(conflictZone)}. Aircraft-delivered munitions signal state-level military commitment beyond proxy forces or irregular warfare.`,
  
  'missile': (location, conflictZone) => `Ballistic missiles launched against ${location} mark a serious escalation in the ${getConflictZoneDisplayName(conflictZone)}. Missile strikes demonstrate both capability and willingness to strike from distance with precision munitions.`,
  
  'drone': (location, conflictZone) => `The drone attack on ${location} shows evolving tactics in the ${getConflictZoneDisplayName(conflictZone)}. UAV swarms and precision strikes represent modern asymmetric warfare capabilities that can bypass traditional defenses.`,
  
  'artillery': (location, conflictZone) => `Artillery fire on ${location} indicates sustained ground operations in the ${getConflictZoneDisplayName(conflictZone)}. Unlike precision strikes, artillery barrages risk wider collateral damage and signal preparation for extended conflict.`,
  
  'default': (attackType, location, conflictZone) => `The ${attackType} on ${location} represents a significant escalation in the ${getConflictZoneDisplayName(conflictZone)}. This attack demonstrates expanding tactical capabilities and willingness to target strategic locations.`
};

/** 
 * Human-readable descriptions for attack types 
 */
const ATTACK_TYPE_DESCRIPTIONS = {
  'missile': 'Ballistic or cruise missiles launched from distance with precision guidance',
  'airstrike': 'Aircraft-delivered munitions including bombs and precision-guided weapons',
  'drone': 'Unmanned aerial vehicle attack, often in swarms or precision strikes',
  'artillery': 'Ground-based heavy weapons fire including rockets and conventional artillery',
  'cyber': 'Digital infrastructure attack targeting communications or critical systems',
  'naval': 'Maritime-based attack from ships or submarines',
  'special-forces': 'Covert ground operation by specialized military units'
};

/** 
 * Verbal descriptions for time of day 
 */
const TIME_DESCRIPTIONS = {
  'early-morning': { start: 4, end: 7, text: 'Early morning' },
  'morning': { start: 7, end: 12, text: 'Morning' },
  'afternoon': { start: 12, end: 17, text: 'Afternoon' },
  'evening': { start: 17, end: 20, text: 'Evening' },
  'night': { start: 20, end: 24, text: 'Night' },
  'late-night': { start: 0, end: 4, text: 'Late night' }
};

// ============================================================================
// CORE CONTENT FUNCTIONS
// ============================================================================

/**
 * Get contextual "Why This Matters" explanation for an attack
 * 
 * Returns location-specific context if available, otherwise generates
 * context based on attack type and location.
 * 
 * @param {Object} attack - The attack object from VERIFIED_ATTACKS
 * @returns {string} Contextual explanation of significance
 * 
 * @example
 * const context = getAttackContext(attack);
 * // Returns: "Strikes on Tehran's government district signal direct escalation..."
 */
export function getAttackContext(attack) {
  // If attack has explicit context field, use it
  if (attack.context && attack.context.length > 20) {
    return attack.context;
  }
  
  // Check for location-specific template
  const locationTemplate = LOCATION_CONTEXT_TEMPLATES[attack.location];
  if (locationTemplate) {
    return locationTemplate;
  }
  
  // Generate based on attack type
  const typeTemplate = FALLBACK_CONTEXT_TEMPLATES[attack.attackType] || FALLBACK_CONTEXT_TEMPLATES.default;
  return typeTemplate(attack.attackType, attack.location, attack.conflictZone);
}

/**
 * Get conflict day number (Day 1, Day 2, etc.)
 * 
 * Calculates how many days since the conflict started (March 17, 2026).
 * First attack = Day 1.
 * 
 * @param {string} attackDate - ISO date string of the attack
 * @returns {number} Day number (1-indexed)
 * 
 * @example
 * const day = getConflictDay('2026-03-18T14:00:00Z');
 * // Returns: 2
 */
export function getConflictDay(attackDate) {
  const firstAttack = new Date(CONFLICT_START_DATE);
  firstAttack.setHours(0, 0, 0, 0);
  
  const thisAttack = new Date(attackDate);
  thisAttack.setHours(0, 0, 0, 0);
  
  const diffMs = thisAttack - firstAttack;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays + 1); // Day 1 minimum
}

/**
 * Format attack time in multiple human-readable formats
 * 
 * Returns an object with full, relative, day-of-week, and narrative formats.
 * 
 * @param {string} dateString - ISO date string
 * @returns {Object} Formatted time object
 * @returns {string} returns.full - Full formatted date/time
 * @returns {string} returns.relative - Relative time (e.g., "3 days ago")
 * @returns {string} returns.dayOfWeek - Day name (e.g., "Tuesday")
 * @returns {string} returns.timeOfDay - Verbal time description (e.g., "Early morning")
 * @returns {string} returns.narrative - Story-style format (e.g., "Early morning on March 18th — 3 AM local time")
 * @returns {string} returns.short - Short format (e.g., "Mar 18, 3:00 AM")
 * 
 * @example
 * const time = formatAttackTime('2026-03-17T04:30:00Z');
 * // Returns: { full: 'March 17, 2026, 4:30 AM UTC', ... }
 */
export function formatAttackTime(dateString) {
  const date = new Date(dateString);
  const now = new Date('2026-03-19T13:31:18+05:30'); // Reference current time
  
  // Full formatted string
  const full = date.toLocaleString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  // Short format
  const short = date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  
  // Relative time
  const relative = getRelativeTime(date, now);
  
  // Day of week
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  
  // Time of day description
  const hour = date.getHours();
  const timeOfDay = getTimeOfDay(hour);
  
  // Narrative/story format
  const narrative = formatNarrativeTime(date, hour, timeOfDay);
  
  return {
    full,
    short,
    relative,
    dayOfWeek,
    timeOfDay,
    narrative,
    iso: dateString,
    timestamp: date.getTime()
  };
}

/**
 * Get human-readable description of attack type
 * 
 * @param {string} attackType - The attack type (missile, airstrike, drone, etc.)
 * @returns {string} Human-readable description
 * 
 * @example
 * const desc = getAttackTypeDescription('missile');
 * // Returns: 'Ballistic or cruise missiles launched from distance...'
 */
export function getAttackTypeDescription(attackType) {
  return ATTACK_TYPE_DESCRIPTIONS[attackType] || 
    `${attackType.charAt(0).toUpperCase() + attackType.slice(1)} attack`;
}

/**
 * Get related attacks grouped by relationship type
 * 
 * Returns attacks that are:
 * - Same day (temporal connection)
 * - Same location (geographic connection)
 * - Same conflict zone (thematic connection)
 * 
 * @param {Object} currentAttack - The attack to find relations for
 * @returns {Object} Grouped related attacks
 * @returns {Array} returns.sameDay - Attacks on the same day
 * @returns {Array} returns.sameLocation - Attacks at the same location
 * @returns {Array} returns.sameZone - Attacks in the same conflict zone
 * 
 * @example
 * const related = getRelatedAttacks(attack);
 * // Returns: { sameDay: [...], sameLocation: [...], sameZone: [...] }
 */
export function getRelatedAttacks(currentAttack) {
  const currentDate = currentAttack.date.split('T')[0];
  
  // Same day attacks (same date, different ID)
  const sameDay = VERIFIED_ATTACKS.filter(a => 
    a.id !== currentAttack.id &&
    a.date.startsWith(currentDate)
  );
  
  // Same location attacks (same location, different ID)
  const sameLocation = VERIFIED_ATTACKS.filter(a =>
    a.id !== currentAttack.id &&
    a.location === currentAttack.location
  );
  
  // Same conflict zone (excluding already captured)
  const sameZone = VERIFIED_ATTACKS.filter(a =>
    a.id !== currentAttack.id &&
    a.conflictZone === currentAttack.conflictZone &&
    !sameDay.includes(a)
  ).slice(0, 3); // Limit to 3 to avoid overwhelming
  
  return { 
    sameDay: sortByDateDesc(sameDay), 
    sameLocation: sortByDateDesc(sameLocation), 
    sameZone: sortByDateDesc(sameZone) 
  };
}

/**
 * Get previous and next attacks for sequential navigation
 * 
 * Attacks are sorted chronologically (newest first).
 * Previous = chronologically newer attack
 * Next = chronologically older attack
 * 
 * @param {string} currentId - ID of the current attack
 * @returns {Object} Navigation targets
 * @returns {Object|null} returns.prev - Previous (newer) attack
 * @returns {Object|null} returns.next - Next (older) attack
 * 
 * @example
 * const nav = getSequentialAttacks('2026-03-17-tehran-leadership');
 * // Returns: { prev: {...}, next: {...} }
 */
export function getSequentialAttacks(currentId) {
  const sorted = [...VERIFIED_ATTACKS].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const index = sorted.findIndex(a => a.id === currentId);
  
  if (index === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: sorted[index - 1] || null, // Chronologically newer
    next: sorted[index + 1] || null  // Chronologically older
  };
}

// ============================================================================
// ENHANCED CONTENT GENERATORS
// ============================================================================

/**
 * Generate a narrative headline for the attack
 * 
 * Creates a more story-like headline than the raw headline.
 * 
 * @param {Object} attack - The attack object
 * @returns {string} Narrative headline
 * 
 * @example
 * const headline = getNarrativeHeadline(attack);
 * // Returns: "March 17: Early morning Israeli airstrike on Tehran"
 */
export function getNarrativeHeadline(attack) {
  const time = formatAttackTime(attack.date);
  const dayNum = getConflictDay(attack.date);
  
  return `Day ${dayNum} — ${time.dayOfWeek}, ${time.timeOfDay}: ${attack.headline}`;
}

/**
 * Generate a story-style opening paragraph
 * 
 * Creates a compelling narrative opening that sets the scene.
 * 
 * @param {Object} attack - The attack object
 * @returns {string} Story opening paragraph
 * 
 * @example
 * const opening = getStoryOpening(attack);
 * // Returns: "Early morning on March 17th — 4:30 AM local time — Israeli forces..."
 */
export function getStoryOpening(attack) {
  const time = formatAttackTime(attack.date);
  const dayNum = getConflictDay(attack.date);
  
  // Extract attacker from headline (basic parsing)
  let attacker = 'Forces';
  if (attack.headline.toLowerCase().includes('israeli')) attacker = 'Israeli forces';
  else if (attack.headline.toLowerCase().includes('iranian')) attacker = 'Iranian forces';
  else if (attack.headline.toLowerCase().includes('us ')) attacker = 'US forces';
  else if (attack.headline.toLowerCase().includes('hezbollah')) attacker = 'Hezbollah';
  
  return `${time.narrative} — Day ${dayNum} of the conflict — ${attacker} carried out a ${attack.attackType} on ${attack.location}. ${attack.description}`;
}

/**
 * Get severity display information
 * 
 * @param {string} severity - Severity level (low, medium, high, critical)
 * @returns {Object} Display information
 * @returns {string} returns.label - Display label
 * @returns {string} returns.color - Tailwind color class
 * @returns {string} returns.icon - Emoji/icon
 * @returns {string} returns.description - Human description
 */
export function getSeverityDisplay(severity) {
  const severityMap = {
    'critical': {
      label: 'Critical Escalation',
      color: 'text-red-600 bg-red-100',
      icon: '🔴',
      description: 'Major escalation with potential for wider war'
    },
    'high': {
      label: 'High Severity',
      color: 'text-orange-600 bg-orange-100',
      icon: '🟠',
      description: 'Significant attack with serious implications'
    },
    'medium': {
      label: 'Medium Severity',
      color: 'text-yellow-600 bg-yellow-100',
      icon: '🟡',
      description: 'Notable attack with moderate impact'
    },
    'low': {
      label: 'Low Severity',
      color: 'text-blue-600 bg-blue-100',
      icon: '🔵',
      description: 'Limited attack with minor impact'
    }
  };
  
  return severityMap[severity] || severityMap.medium;
}

/**
 * Get conflict zone display name
 * 
 * @param {string} zoneId - Conflict zone identifier
 * @returns {string} Human-readable zone name
 */
export function getConflictZoneDisplayName(zoneId) {
  const zoneNames = {
    'us-iran-war-2026': 'US-Iran War',
    'israel-hezbollah-conflict': 'Israel-Hezbollah Conflict',
    'ukraine-russia': 'Ukraine-Russia War',
    'palestine-israel': 'Palestine-Israel Conflict',
    'uncategorized': 'Regional Conflict'
  };
  
  return zoneNames[zoneId] || zoneId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get country flag emoji
 * 
 * @param {string} country - Country name
 * @returns {string} Flag emoji
 */
export function getCountryFlag(country) {
  const flags = {
    'Iran': '🇮🇷',
    'Israel': '🇮🇱',
    'USA': '🇺🇸',
    'United States': '🇺🇸',
    'Iraq': '🇮🇶',
    'Lebanon': '🇱🇧',
    'Kuwait': '🇰🇼',
    'Qatar': '🇶🇦',
    'Saudi Arabia': '🇸🇦',
    'Syria': '🇸🇾',
    'Jordan': '🇯🇴',
    'Egypt': '🇪🇬',
    'Turkey': '🇹🇷',
    'West Bank': '🇵🇸',
    'Palestine': '🇵🇸',
    'Yemen': '🇾🇪',
    'UAE': '🇦🇪',
    'Bahrain': '🇧🇭'
  };
  
  return flags[country] || '🌍';
}

/**
 * Generate a timeline of related events for context
 * 
 * @param {Object} attack - The attack object
 * @param {number} hoursWindow - Hours before/after to include (default: 6)
 * @returns {Array} Timeline of related events
 */
export function getAttackTimelineContext(attack, hoursWindow = 6) {
  const attackTime = new Date(attack.date).getTime();
  const windowMs = hoursWindow * 60 * 60 * 1000;
  
  const nearbyAttacks = VERIFIED_ATTACKS.filter(a => {
    if (a.id === attack.id) return false;
    const aTime = new Date(a.date).getTime();
    const diff = Math.abs(aTime - attackTime);
    return diff <= windowMs;
  });
  
  // Combine current attack with nearby ones and sort
  const timeline = [attack, ...nearbyAttacks].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  return timeline.map((a, index) => ({
    ...a,
    isCurrent: a.id === attack.id,
    sequence: index + 1,
    timeOffset: Math.round((new Date(a.date) - attackTime) / (60 * 60 * 1000)) // hours from current
  }));
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate relative time (e.g., "3 hours ago", "2 days ago")
 * 
 * @param {Date} date - The date to compare
 * @param {Date} now - Reference date (defaults to now)
 * @returns {string} Relative time string
 */
function getRelativeTime(date, now = new Date()) {
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay > 0) {
    return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
  }
  if (diffHour > 0) {
    return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
  }
  if (diffMin > 0) {
    return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
  }
  return 'Just now';
}

/**
 * Get verbal time of day description
 * 
 * @param {number} hour - Hour (0-23)
 * @returns {string} Time description
 */
function getTimeOfDay(hour) {
  for (const [key, value] of Object.entries(TIME_DESCRIPTIONS)) {
    if (hour >= value.start && hour < value.end) {
      return value.text;
    }
  }
  return 'Night';
}

/**
 * Format narrative time string
 * 
 * @param {Date} date - Date object
 * @param {number} hour - Hour (0-23)
 * @param {string} timeOfDay - Time of day description
 * @returns {string} Narrative format
 */
function formatNarrativeTime(date, hour, timeOfDay) {
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const hour12 = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  
  return `${timeOfDay} on ${month} ${day}${getDaySuffix(day)} — ${hour12} ${ampm} local time`;
}

/**
 * Get day suffix (st, nd, rd, th)
 * 
 * @param {number} day - Day of month
 * @returns {string} Suffix
 */
function getDaySuffix(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Sort attacks by date descending (newest first)
 * 
 * @param {Array} attacks - Array of attack objects
 * @returns {Array} Sorted array
 */
function sortByDateDesc(attacks) {
  return [...attacks].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
  getAttackContext,
  getConflictDay,
  formatAttackTime,
  getAttackTypeDescription,
  getRelatedAttacks,
  getSequentialAttacks,
  getNarrativeHeadline,
  getStoryOpening,
  getSeverityDisplay,
  getConflictZoneDisplayName,
  getCountryFlag,
  getAttackTimelineContext
};

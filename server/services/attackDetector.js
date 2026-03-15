/**
 * Simple, predictable attack detection
 * NO AI - just clear rules that humans can verify
 */

// Locations we can map (must be exact matches)
const KNOWN_LOCATIONS = {
  // Iran
  'isfahan': { city: 'Isfahan', country: 'Iran', lat: 32.6539, lng: 51.6660 },
  'natanz': { city: 'Natanz', country: 'Iran', lat: 33.9061, lng: 51.7198 },
  'tehran': { city: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3890 },
  'kharg island': { city: 'Kharg Island', country: 'Iran', lat: 29.25, lng: 50.33 },
  'kashan': { city: 'Kashan', country: 'Iran', lat: 33.9850, lng: 51.4100 },
  'qom': { city: 'Qom', country: 'Iran', lat: 34.6401, lng: 50.8764 },
  'bushehr': { city: 'Bushehr', country: 'Iran', lat: 28.9684, lng: 50.8385 },
  'bandar abbas': { city: 'Bandar Abbas', country: 'Iran', lat: 27.1833, lng: 56.2666 },
  'shiraz': { city: 'Shiraz', country: 'Iran', lat: 29.5926, lng: 52.5836 },
  'tabriz': { city: 'Tabriz', country: 'Iran', lat: 38.0962, lng: 46.2738 },
  'mashhad': { city: 'Mashhad', country: 'Iran', lat: 36.2605, lng: 59.6168 },
  'ahvaz': { city: 'Ahvaz', country: 'Iran', lat: 31.3183, lng: 48.6706 },
  
  // Israel
  'tel aviv': { city: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818 },
  'jerusalem': { city: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137 },
  'haifa': { city: 'Haifa', country: 'Israel', lat: 32.7940, lng: 34.9896 },
  
  // Lebanon  
  'beirut': { city: 'Beirut', country: 'Lebanon', lat: 33.8938, lng: 35.5018 },
  'sidon': { city: 'Sidon', country: 'Lebanon', lat: 33.5606, lng: 35.3755 },
  'tyre': { city: 'Tyre', country: 'Lebanon', lat: 33.2705, lng: 35.2037 },
  'southern lebanon': { city: 'Southern Lebanon', country: 'Lebanon', lat: 33.2, lng: 35.3 },
  
  // Iraq
  'baghdad': { city: 'Baghdad', country: 'Iraq', lat: 33.3152, lng: 44.3661 },
  'basra': { city: 'Basra', country: 'Iraq', lat: 30.5156, lng: 47.7804 },
  'mosul': { city: 'Mosul', country: 'Iraq', lat: 36.3566, lng: 43.1640 },
  'erbil': { city: 'Erbil', country: 'Iraq', lat: 36.1911, lng: 44.0092 },
  
  // Syria
  'damascus': { city: 'Damascus', country: 'Syria', lat: 33.5138, lng: 36.2765 },
  'aleppo': { city: 'Aleppo', country: 'Syria', lat: 36.2021, lng: 37.1343 },
  'homs': { city: 'Homs', country: 'Syria', lat: 34.7308, lng: 36.7094 },
  
  // Gaza/Palestine
  'gaza': { city: 'Gaza', country: 'Gaza Strip', lat: 31.5017, lng: 34.4668 },
  'rafah': { city: 'Rafah', country: 'Gaza Strip', lat: 31.2886, lng: 34.2518 },
  'khan younis': { city: 'Khan Younis', country: 'Gaza Strip', lat: 31.3461, lng: 34.3061 },
  
  // Yemen
  'sanaa': { city: 'Sanaa', country: 'Yemen', lat: 15.3694, lng: 44.1910 },
  'hodeidah': { city: 'Hodeidah', country: 'Yemen', lat: 14.7979, lng: 42.9545 },
  
  // Gulf
  'dubai': { city: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  'abu dhabi': { city: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773 },
  'doha': { city: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.5310 },
  'riyadh': { city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  'jeddah': { city: 'Jeddah', country: 'Saudi Arabia', lat: 21.2854, lng: 39.2376 },
  'kuwait city': { city: 'Kuwait City', country: 'Kuwait', lat: 29.3759, lng: 47.9774 },
};

// Active voice attack verbs (must be in active voice, not "was struck" or "says it struck")
const ATTACK_VERBS = [
  'struck', 'hit', 'bombed', 'destroyed', 'damaged',
  'rocked', 'exploded', 'fired on', 'launched missile', 'launched strike',
  'pounded', 'targeted', 'raided', 'attacked'
];

// NEVER classify as attack if contains these
const EXCLUSIONS = [
  // Analysis/Explainers
  'what is happening', 'what we know', 'explained', 'analysis',
  'why did', 'how will', 'what happens', 'day 16', 'day 15', 'week 3', 'week 2',
  'live updates', 'as it happened', 'crisis live', 'live blog', 'minute by minute',
  'q&a', 'faq', 'podcast', 'video', 'opinion', 'editorial', 'column',
  
  // Statements (not confirmed)
  'says it has', 'claims to have', 'reportedly', 'allegedly',
  'vows to', 'threatens to', 'warns of', 'pledges to', 'promises to',
  'considering', 'planning to', 'may strike', 'might attack', 'could hit',
  
  // Humanitarian/Aftermath (not the attack itself)
  'humanitarian crisis', 'deepening crisis', 'humanitarian',
  'aid workers', 'relief efforts', 'refugees', 'displaced',
  'aftermath', 'cleanup', 'recovery', 'rebuilding', 'funeral', 'mourning',
  'investigation', 'probe into', 'inquiry',
  
  // Diplomatic
  'peace talks', 'negotiations', 'diplomatic', 'ceasefire talks',
  'foreign minister', 'envoy', 'ambassador', 'embassy',
  
  // Sports/Other
  'world cup', 'olympics', 'match postponed', 'tournament',
];

// Attack types
const ATTACK_TYPES = {
  'airstrike': 'airstrike',
  'air strike': 'airstrike',
  'missile': 'missile',
  'rocket': 'missile',
  'drone': 'drone',
  'suicide drone': 'drone',
  'bomb': 'bombing',
  'bombing': 'bombing',
  'shell': 'shelling',
  'artillery': 'shelling',
};

/**
 * Detect if a news item describes a confirmed military attack
 * Returns null if not a confirmed attack
 */
export function detectAttack(headline, description = '') {
  const text = (headline + ' ' + description).toLowerCase();
  
  // Rule 1: Must NOT contain any exclusion keywords
  for (const exclusion of EXCLUSIONS) {
    if (text.includes(exclusion)) {
      return null;
    }
  }
  
  // Rule 2: Must contain a known location
  let location = null;
  for (const [key, loc] of Object.entries(KNOWN_LOCATIONS)) {
    if (text.includes(key)) {
      location = loc;
      break;
    }
  }
  if (!location) {
    return null;
  }
  
  // Rule 3: Must contain active voice attack verb
  let hasAttackVerb = false;
  for (const verb of ATTACK_VERBS) {
    // Check it's not in passive voice ("was struck", "were hit")
    const passivePattern = new RegExp(`(was|were|been|being)\\s+${verb}`);
    if (text.includes(verb) && !passivePattern.test(text)) {
      hasAttackVerb = true;
      break;
    }
  }
  if (!hasAttackVerb) {
    return null;
  }
  
  // Rule 4: Determine attack type
  let attackType = 'strike';
  for (const [keyword, type] of Object.entries(ATTACK_TYPES)) {
    if (text.includes(keyword)) {
      attackType = type;
      break;
    }
  }
  
  // Rule 5: Determine severity
  let severity = 'medium';
  if (text.includes('killed') || text.includes('casualties') || text.includes('destroyed') || text.includes('dead')) {
    severity = 'high';
  } else if (text.includes('injured') || text.includes('wounded')) {
    severity = 'medium';
  } else if (text.includes('damaged') || text.includes('hit')) {
    severity = 'low';
  }
  
  return {
    isAttack: true,
    city: location.city,
    country: location.country,
    lat: location.lat,
    lng: location.lng,
    attackType,
    severity,
    description: headline.slice(0, 200) // Truncate long headlines
  };
}

/**
 * Batch process news items
 */
export function detectAttacksBatch(newsItems) {
  const attacks = [];
  for (const item of newsItems) {
    const detection = detectAttack(item.headline, item.description);
    if (detection) {
      attacks.push({
        ...item,
        mapAnalysis: {
          isAttack: true,
          attackType: detection.attackType,
          location: detection.city,
          severity: detection.severity,
          description: detection.description
        }
      });
    }
  }
  return attacks;
}

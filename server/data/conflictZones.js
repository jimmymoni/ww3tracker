/**
 * CONFLICT ZONES DATABASE
 * Regional Conflict Tracker - Multi-conflict architecture
 * Last updated: 2026-03-18
 */

export const CONFLICT_ZONES = [
  {
    id: 'us-iran-war-2026',
    name: 'US-Iran War',
    subtitle: '2026 Persian Gulf Conflict',
    region: 'Middle East / Persian Gulf',
    active: true,
    startedDate: '2026-03-15',
    intensity: 'critical',
    geography: {
      center: { lat: 29.0, lng: 52.0 },
      zoom: 6,
      bounds: {
        north: 35.0,
        south: 23.0,
        east: 58.0,
        west: 44.0
      }
    },
    rootCauses: [
      {
        factor: 'Nuclear Program Tensions',
        description: 'Escalating tensions over Iran\'s uranium enrichment program and suspected weapons development',
        year: 2025
      },
      {
        factor: 'Proxy Warfare',
        description: 'Iran\'s support for regional militias (Hezbollah, Houthis, Iraqi militias) attacking US and allied interests',
        year: 2024
      },
      {
        factor: 'Strait of Hormuz Control',
        description: 'Strategic chokepoint for 20% of world oil; Iran\'s threats to close it',
        year: 2025
      },
      {
        factor: 'Israeli-Iranian Shadow War',
        description: 'Covert operations, cyberattacks, and targeted assassinations between Israel and Iran',
        year: 2024
      },
      {
        factor: 'Trump Administration Pressure',
        description: 'Maximum pressure campaign 2.0 with severe economic sanctions and military posturing',
        year: 2026
      }
    ],
    keyPlayers: [
      {
        name: 'United States',
        type: 'state',
        role: 'Primary adversary',
        motivation: 'Prevent Iranian nuclear weapons, protect regional allies, secure oil flow',
        capabilities: 'Superior air/naval power, global strike capability, advanced missile defense',
        losses: { personnel: 'Minimal', equipment: 'Minor drone losses', economic: 'Oil price surge' }
      },
      {
        name: 'Iran',
        type: 'state',
        role: 'Primary adversary',
        motivation: 'Sovereignty, nuclear rights, regional influence, regime survival',
        capabilities: 'Ballistic missiles, drone swarms, asymmetric naval warfare, proxy networks',
        losses: { personnel: 'Senior leadership casualties', equipment: 'Major infrastructure damage', economic: 'Critical' }
      },
      {
        name: 'Israel',
        type: 'state',
        role: 'Active combatant',
        motivation: 'Eliminate existential threat, destroy Iranian nuclear facilities',
        capabilities: 'Advanced air force, intelligence, cyber warfare, nuclear deterrent',
        losses: { personnel: 'Civilian casualties', equipment: 'Infrastructure damage', economic: 'War costs' }
      },
      {
        name: 'Saudi Arabia',
        type: 'state',
        role: 'US ally / Target',
        motivation: 'Counter Iranian influence, protect oil infrastructure',
        capabilities: 'Modern air force, missile defense, oil production capacity',
        losses: { personnel: 'Minimal', equipment: 'Drone interceptions', economic: 'Oil facility disruptions' }
      },
      {
        name: 'UAE',
        type: 'state',
        role: 'US ally / Target',
        motivation: 'Economic stability, counter Iranian aggression',
        capabilities: 'Advanced missile defense, strategic air bases',
        losses: { personnel: '1 civilian killed', equipment: 'Airport, oil facilities hit', economic: 'Major disruptions' }
      },
      {
        name: 'Qatar',
        type: 'state',
        role: 'US ally / Target',
        motivation: 'Host US CENTCOM, maintain neutrality',
        capabilities: 'US base at Al Udeid, air defense systems',
        losses: { personnel: 'None', equipment: 'Missile interceptions', economic: 'Industrial damage from debris' }
      },
      {
        name: 'Hezbollah',
        type: 'proxy',
        role: 'Iran proxy / Active combatant',
        motivation: 'Support Iran, strike Israel, maintain Lebanese presence',
        capabilities: 'Rocket arsenal, tunnel networks, urban warfare',
        losses: { personnel: 'Commanders targeted', equipment: 'Launch sites destroyed', economic: 'N/A' }
      },
      {
        name: 'Iraqi Militias',
        type: 'proxy',
        role: 'Iran proxy',
        motivation: 'Expel US forces from Iraq, support Iranian objectives',
        capabilities: 'Rocket attacks, drone strikes, urban insurgency',
        losses: { personnel: 'Key figures assassinated', equipment: 'Bases hit', economic: 'N/A' }
      }
    ],
    triggerEvents: [
      { date: '2025-10-15', event: 'Iran announces 60% uranium enrichment', impact: 'Increased sanctions pressure' },
      { date: '2026-01-20', event: 'Trump reinstates maximum pressure campaign', impact: 'Economic crisis in Iran' },
      { date: '2026-03-10', event: 'Israeli cyberattack on Iranian nuclear facility', impact: 'Retaliation threats from Iran' },
      { date: '2026-03-15', event: 'US drone strike kills Iranian IRGC commander', impact: 'War officially begins' },
      { date: '2026-03-16', event: 'Iranian missile attacks on UAE and Qatar', impact: 'Gulf states enter active conflict' },
      { date: '2026-03-17', event: 'Israeli strikes on Tehran leadership', impact: 'Conflict enters critical phase' }
    ],
    currentStatus: {
      activeTheaters: [
        'Persian Gulf naval operations',
        'Iranian missile strikes on Gulf capitals',
        'Israeli-Iranian exchange of fire',
        'Iraqi militia attacks on US embassy',
        'Strait of Hormuz tensions'
      ],
      statistics: {
        totalAttacks: 20,
        casualties: 'Hundreds confirmed',
        displaced: 'Tens of thousands',
        oilProduction: 'Reduced by 15%',
        globalOilPrice: '$95/barrel (+35%)'
      }
    },
    contextFile: 'us-iran-war.md'
  },
  {
    id: 'pak-afghan-border-conflict',
    name: 'Pakistan-Afghanistan Border Conflict',
    subtitle: 'Post-Taliban Border War',
    region: 'South Asia / Durand Line',
    active: true,
    startedDate: '2026-03-14',
    intensity: 'high',
    geography: {
      center: { lat: 32.5, lng: 69.0 },
      zoom: 7,
      bounds: {
        north: 37.0,
        south: 28.0,
        east: 75.0,
        west: 63.0
      }
    },
    rootCauses: [
      {
        factor: 'Durand Line Dispute',
        description: 'Unrecognized border between Pakistan and Afghanistan dating to British colonial era',
        year: 1893
      },
      {
        factor: 'TTP Safe Havens',
        description: 'Afghan Taliban harboring Tehrik-i-Taliban Pakistan (TTP) militants',
        year: 2021
      },
      {
        factor: 'Pakistani Airstrikes',
        description: 'Pakistan\'s repeated cross-border strikes targeting TTP in Afghanistan',
        year: 2024
      },
      {
        factor: 'Taliban Non-Cooperation',
        description: 'Afghan Taliban\'s refusal to hand over TTP leaders to Pakistan',
        year: 2023
      },
      {
        factor: 'Drone Warfare Escalation',
        description: 'Afghan development of drone capabilities threatening Pakistani cities',
        year: 2025
      }
    ],
    keyPlayers: [
      {
        name: 'Pakistan',
        type: 'state',
        role: 'Aggressor',
        motivation: 'Eliminate TTP threat, secure western border, assert sovereignty',
        capabilities: 'Air force, artillery, nuclear deterrent, intelligence service (ISI)',
        losses: { personnel: 'Soldiers killed in border clashes', equipment: 'Military installations hit', economic: 'Border trade halted' }
      },
      {
        name: 'Afghanistan (Taliban)',
        type: 'state',
        role: 'Defender',
        motivation: 'Sovereignty, support Pashtun solidarity, resist Pakistani dominance',
        capabilities: 'Battle-hardened insurgents, captured US equipment, drone program',
        losses: { personnel: 'Civilian and military casualties', equipment: 'Infrastructure damage', economic: 'Isolation deepens' }
      },
      {
        name: 'TTP (Pakistani Taliban)',
        type: 'proxy',
        role: 'Protagonist',
        motivation: 'Overthrow Pakistani government, establish Islamic emirate',
        capabilities: 'Insurgency, suicide attacks, cross-border raids',
        losses: { personnel: 'Airstrike casualties', equipment: 'Bases destroyed', economic: 'N/A' }
      },
      {
        name: 'China',
        type: 'state',
        role: 'Mediator',
        motivation: 'Protect CPEC investments, maintain regional stability',
        capabilities: 'Economic leverage, diplomatic influence',
        losses: { personnel: 'None', equipment: 'None', economic: 'CPEC delays' }
      }
    ],
    triggerEvents: [
      { date: '2021-08-15', event: 'Taliban takeover of Afghanistan', impact: 'TTP gains safe haven' },
      { date: '2023-11-05', event: 'Major TTP attack on Pakistan military post', impact: 'Pakistan escalates strikes' },
      { date: '2024-12-20', event: 'Pakistani airstrikes on Khost province', impact: 'Diplomatic crisis' },
      { date: '2026-03-10', event: 'Afghan drone attack kills Pakistani soldiers', impact: 'Tensions peak' },
      { date: '2026-03-14', event: 'Pakistan launches Operation Border Shield', impact: 'Open warfare declared' }
    ],
    currentStatus: {
      activeTheaters: [
        'Kandahar region airstrikes',
        'Islamabad defense zone',
        'Tribal areas border clashes',
        'Drone warfare corridor'
      ],
      statistics: {
        totalAttacks: 2,
        casualties: 'Dozens confirmed',
        displaced: 'Border communities evacuated',
        tradeStatus: 'Durand Line closed',
        diplomaticStatus: 'China brokering ceasefire'
      }
    },
    contextFile: 'pak-afghan-conflict.md'
  },
  {
    id: 'israel-hezbollah-conflict',
    name: 'Israel-Hezbollah Conflict',
    subtitle: 'Northern Front War',
    region: 'Levant / Lebanon-Israel Border',
    active: true,
    startedDate: '2026-03-16',
    intensity: 'critical',
    geography: {
      center: { lat: 33.2, lng: 35.5 },
      zoom: 9,
      bounds: {
        north: 34.5,
        south: 32.0,
        east: 36.5,
        west: 34.5
      }
    },
    rootCauses: [
      {
        factor: 'Shebaa Farms Dispute',
        description: 'Territorial dispute over border area claimed by Lebanon, occupied by Israel',
        year: 2000
      },
      {
        factor: '2006 War Legacy',
        description: 'Unfinished business from 2006 Lebanon War; Hezbollah rebuilt stronger',
        year: 2006
      },
      {
        factor: 'Iranian Armament',
        description: 'Hezbollah equipped with 150,000+ rockets via Iranian supply lines through Syria',
        year: 2015
      },
      {
        factor: 'Gaza War Spillover',
        description: 'Hezbollah supporting Hamas creates escalation pressure on northern border',
        year: 2023
      },
      {
        factor: 'US-Iran War Activation',
        description: 'Hezbollah ordered to open northern front against Israel',
        year: 2026
      }
    ],
    keyPlayers: [
      {
        name: 'Israel',
        type: 'state',
        role: 'Active combatant',
        motivation: 'Eliminate Hezbollah threat, secure northern border, retaliate for rocket attacks',
        capabilities: 'Air superiority, intelligence dominance, Iron Dome, precision strikes',
        losses: { personnel: 'Civilian casualties', equipment: 'Building damage', economic: 'War mobilization costs' }
      },
      {
        name: 'Hezbollah',
        type: 'proxy',
        role: 'Active combatant',
        motivation: 'Support Iran, defend Lebanon, attack Israel, prestige in Arab world',
        capabilities: 'Rocket/missile arsenal, tunnel networks, veteran fighters, Iranian support',
        losses: { personnel: 'Commanders assassinated', equipment: 'Launch sites destroyed', economic: 'Beirut infrastructure hit' }
      },
      {
        name: 'Lebanon (State)',
        type: 'state',
        role: 'Affected party',
        motivation: 'Prevent national collapse, limit Israeli damage',
        capabilities: 'Weak military, limited sovereignty over Hezbollah',
        losses: { personnel: 'Civilian casualties', equipment: 'Infrastructure destroyed', economic: 'Crisis deepening' }
      },
      {
        name: 'Iran',
        type: 'state',
        role: 'Hezbollah sponsor',
        motivation: 'Open second front against Israel, maintain deterrent',
        capabilities: 'Weapons supply, funding, strategic guidance',
        losses: { personnel: 'Advisors possibly killed', equipment: 'Supply lines disrupted', economic: 'Support costs' }
      },
      {
        name: 'UNIFIL',
        type: 'international',
        role: 'Peacekeeping',
        motivation: 'Monitor ceasefire, prevent escalation',
        capabilities: 'Observation posts, patrols (limited effectiveness)',
        losses: { personnel: 'None reported', equipment: 'None', economic: 'N/A' }
      }
    ],
    triggerEvents: [
      { date: '2023-10-08', event: 'Hezbollah begins border skirmishes post-Oct 7', impact: 'Northern front activated' },
      { date: '2024-09-17', event: 'Pager attacks decimate Hezbollah communications', impact: 'Hezbollah weakened but vengeful' },
      { date: '2025-11-20', event: 'Ceasefire collapses, full fighting resumes', impact: 'War intensifies' },
      { date: '2026-03-16', event: 'Israel launches major Beirut strikes', impact: 'War enters critical phase' },
      { date: '2026-03-18', event: 'Hezbollah rocket barrages on central Israel', impact: 'Escalation to strategic targets' }
    ],
    currentStatus: {
      activeTheaters: [
        'Southern Lebanon strikes',
        'Beirut airstrikes',
        'Northern Israel rocket attacks',
        'Border infiltration attempts'
      ],
      statistics: {
        totalAttacks: 4,
        casualties: 'Hundreds on both sides',
        displaced: '100,000+ Israelis evacuated north',
        rocketsFired: '4,000+ since Oct 2023',
        buildingsDamaged: 'Extensive in Beirut'
      }
    },
    contextFile: 'israel-hezbollah.md'
  },
  {
    id: 'yemen-civil-war',
    name: 'Yemen Civil War',
    subtitle: 'Saudi-Iran Proxy War',
    region: 'Arabian Peninsula / Yemen',
    active: true,
    startedDate: '2014-09-21',
    intensity: 'high',
    geography: {
      center: { lat: 15.5, lng: 47.5 },
      zoom: 6,
      bounds: {
        north: 19.0,
        south: 12.0,
        east: 55.0,
        west: 42.0
      }
    },
    rootCauses: [
      {
        factor: 'Arab Spring Fallout',
        description: 'Yemeni revolution and subsequent political vacuum',
        year: 2011
      },
      {
        factor: 'Houthi Uprising',
        description: 'Zaidi Shia rebels from north Yemen seized capital Sanaa',
        year: 2014
      },
      {
        factor: 'Saudi Intervention',
        description: 'Saudi-led coalition intervened to restore Hadi government',
        year: 2015
      },
      {
        factor: 'Iranian Support',
        description: 'Iran backing Houthis as regional proxy against Saudi Arabia',
        year: 2015
      },
      {
        factor: 'Humanitarian Crisis',
        description: 'World\'s worst humanitarian crisis creating permanent instability',
        year: 2017
      },
      {
        factor: 'Red Sea Shipping Crisis',
        description: 'Houthi attacks on international shipping disrupting global trade',
        year: 2023
      }
    ],
    keyPlayers: [
      {
        name: 'Houthis (Ansar Allah)',
        type: 'proxy',
        role: 'Iran proxy / De facto ruler',
        motivation: 'Control Yemen, resist Saudi influence, support Palestinian cause',
        capabilities: 'Ballistic missiles, drones, naval mines, mountain warfare',
        losses: { personnel: 'Heavy from airstrikes', equipment: 'Weapons caches hit', economic: 'Blockade effects' }
      },
      {
        name: 'Saudi Arabia',
        type: 'state',
        role: 'Coalition leader',
        motivation: 'Prevent Iranian proxy on border, restore Hadi government',
        capabilities: 'Air force, coalition ground forces, blockade',
        losses: { personnel: 'Soldiers killed', equipment: 'Oil facilities hit', economic: 'War costs, oil disruptions' }
      },
      {
        name: 'Yemen Government (PLC)',
        type: 'state',
        role: 'Saudi ally',
        motivation: 'Restore unified Yemen, defeat Houthis',
        capabilities: 'Limited military, southern separatist allies',
        losses: { personnel: 'Heavy casualties', equipment: 'Capital lost', economic: 'State collapse' }
      },
      {
        name: 'UAE',
        type: 'state',
        role: 'Former coalition member',
        motivation: 'Counter-terrorism, southern Yemen influence',
        capabilities: 'Elite forces, air power (reduced presence)',
        losses: { personnel: 'Limited', equipment: 'Some', economic: 'Withdrawal costs' }
      },
      {
        name: 'Iran',
        type: 'state',
        role: 'Houthi sponsor',
        motivation: 'Bleed Saudi Arabia, control Red Sea chokepoint',
        capabilities: 'Arms smuggling, advisors, funding',
        losses: { personnel: 'Limited', equipment: 'Smuggling interdictions', economic: 'Support costs' }
      },
      {
        name: 'Southern Transitional Council',
        type: 'faction',
        role: 'Separatist',
        motivation: 'Independence for South Yemen',
        capabilities: 'Militia forces, UAE support',
        losses: { personnel: 'Casualties', equipment: 'Limited', economic: 'N/A' }
      },
      {
        name: 'Al-Qaeda in Arabian Peninsula',
        type: 'terrorist',
        role: 'Opportunist',
        motivation: 'Exploit chaos for terrorist operations',
        capabilities: 'Insurgency, terror attacks',
        losses: { personnel: 'Leadership killed', equipment: 'Territory lost', economic: 'N/A' }
      }
    ],
    triggerEvents: [
      { date: '2014-09-21', event: 'Houthis seize Sanaa', impact: 'Civil war begins' },
      { date: '2015-03-26', event: 'Saudi-led intervention begins', impact: 'Regionalizes conflict' },
      { date: '2018-12-13', event: 'Stockholm Agreement (failed)', impact: 'Brief ceasefire' },
      { date: '2022-04-02', event: 'UN-brokered truce', impact: 'Temporary calm' },
      { date: '2023-11-19', event: 'Houthis attack Red Sea shipping', impact: 'Global trade crisis' },
      { date: '2024-01-12', event: 'US/UK airstrikes on Houthi targets', impact: 'Western intervention' },
      { date: '2026-03-17', event: 'Houthis join Iran\'s war against Gulf states', impact: 'Full escalation' }
    ],
    currentStatus: {
      activeTheaters: [
        'Marib front (oil region)',
        'Hodeidah port conflict',
        'Red Sea shipping attacks',
        'Saudi border skirmishes',
        'Sanaa airstrikes'
      ],
      statistics: {
        duration: '11+ years',
        casualties: '377,000+ estimated deaths',
        displaced: '4.5 million internally displaced',
        famineRisk: '17 million facing hunger',
        shippingDisrupted: '15% of global trade affected'
      }
    },
    contextFile: 'yemen-war.md'
  }
];

// Helper: Get all conflict zones
export function getAllZones() {
  return [...CONFLICT_ZONES];
}

// Helper: Get active zones only
export function getActiveZones() {
  return CONFLICT_ZONES.filter(zone => zone.active);
}

// Helper: Get zone by ID
export function getZoneById(zoneId) {
  return CONFLICT_ZONES.find(zone => zone.id === zoneId);
}

// Helper: Get zone by attack country
export function getZoneByCountry(country) {
  const countryZoneMap = {
    // US-Iran War zone
    'Iran': 'us-iran-war-2026',
    'UAE': 'us-iran-war-2026',
    'Qatar': 'us-iran-war-2026',
    'Kuwait': 'us-iran-war-2026',
    'Saudi Arabia': 'us-iran-war-2026',
    'Israel': 'us-iran-war-2026',
    'Iraq': 'us-iran-war-2026',
    // Pakistan-Afghanistan
    'Pakistan': 'pak-afghan-border-conflict',
    'Afghanistan': 'pak-afghan-border-conflict',
    // Israel-Hezbollah
    'Lebanon': 'israel-hezbollah-conflict',
    // Yemen
    'Yemen': 'yemen-civil-war'
  };
  
  const zoneId = countryZoneMap[country];
  return zoneId ? getZoneById(zoneId) : null;
}

// Helper: Get attacks for zone
export function getAttacksForZone(zoneId, attacks) {
  const zone = getZoneById(zoneId);
  if (!zone) return [];
  
  // If attacks array provided, filter by zone
  if (attacks) {
    return attacks.filter(attack => attack.conflictZone === zoneId);
  }
  
  return [];
}

// Helper: Get zone statistics
export function getZoneStats(zoneId) {
  const zone = getZoneById(zoneId);
  if (!zone) return null;
  
  return {
    id: zone.id,
    name: zone.name,
    attackCount: zone.statistics?.totalAttacks || 0,
    casualties: zone.currentStatus?.casualties || { estimated: 'unknown', confirmed: 0 },
    intensity: zone.intensity,
    phase: zone.currentStatus?.phase || 'unknown',
    active: zone.active,
    startedDate: zone.startedDate,
    duration: calculateDuration(zone.startedDate)
  };
}

// Helper: Get related zones for an actor
export function getRelatedZones(actorName) {
  const actorId = actorName.toLowerCase().replace(/\s+/g, '-');
  const actorNameLower = actorName.toLowerCase();
  
  return CONFLICT_ZONES.filter(zone => {
    // Check keyPlayers
    if (zone.keyPlayers?.some(p => 
      p.name?.toLowerCase().includes(actorNameLower) ||
      p.name?.toLowerCase().replace(/\s+/g, '-').includes(actorId)
    )) return true;
    
    // Check if mentioned in description
    if (zone.description?.toLowerCase().includes(actorNameLower)) 
      return true;
    
    return false;
  }).map(zone => ({
    id: zone.id,
    name: zone.name,
    region: zone.region,
    active: zone.active,
    playerRole: zone.keyPlayers?.find(p => 
      p.name?.toLowerCase().includes(actorNameLower)
    )?.role || 'involved'
  }));
}

// Helper: Calculate duration from start date
function calculateDuration(startDate) {
  if (!startDate) return 'unknown';
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Less than 24 hours';
  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
  return `${Math.floor(diffDays / 30)} months`;
}

// Helper: Get total statistics across all zones
export function getGlobalStatistics() {
  const activeZones = getActiveZones();
  return {
    activeConflicts: activeZones.length,
    totalKeyPlayers: activeZones.reduce((sum, z) => sum + z.keyPlayers.length, 0),
    regionsAffected: [...new Set(activeZones.map(z => z.region))],
    highestIntensity: activeZones.reduce((max, z) => 
      z.intensity === 'critical' ? 'critical' : max, 'high'
    )
  };
}

export default {
  CONFLICT_ZONES,
  getAllZones,
  getActiveZones,
  getZoneById,
  getZoneByCountry,
  getAttacksForZone,
  getZoneStats,
  getRelatedZones,
  getGlobalStatistics
};

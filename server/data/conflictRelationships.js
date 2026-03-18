/**
 * MIDDLE EAST / SOUTH ASIA CONFLICT RELATIONSHIP MAP
 * Comprehensive relationship diagram showing all actors, their connections, and stakes
 * Last Updated: 2026-03-17
 * 
 * This data is designed to power visual relationship diagrams, network graphs,
 * and explanatory content about WHY the conflicts are happening.
 */

// ============================================================================
// ACTORS - All parties involved in the conflicts
// ============================================================================

export const ACTORS = {
  // PRIMARY ACTORS - Major nation states
  unitedStates: {
    id: 'united-states',
    name: 'United States',
    shortName: 'US',
    type: 'nation-state',
    category: 'superpower',
    region: 'north-america',
    flag: '🇺🇸',
    militaryBudget: 886000000000, // $886B
    nuclearStatus: 'armed',
    description: 'Global superpower, Israel\'s primary backer, seeks to maintain Middle East dominance and prevent Iranian nuclear weapons.',
    leadership: {
      headOfState: 'President',
      governmentType: 'Democratic Republic'
    },
    interests: ['oil-security', 'israel-security', 'anti-iran', 'regional-dominance', 'nuclear-nonproliferation']
  },

  iran: {
    id: 'iran',
    name: 'Iran',
    shortName: 'Iran',
    type: 'nation-state',
    category: 'regional-power',
    region: 'middle-east',
    flag: '🇮🇷',
    militaryBudget: 25000000000, // $25B
    nuclearStatus: 'threshold',
    description: 'Regional power seeking to dominate Middle East, supports proxy groups across region, pursuing nuclear capability.',
    leadership: {
      headOfState: 'Supreme Leader (deceased as of March 2026)',
      governmentType: 'Islamic Republic (theocratic republic)'
    },
    interests: ['regional-hegemony', 'anti-israel', 'anti-america', 'nuclear-program', 'shia-expansion', 'sanctions-relief']
  },

  israel: {
    id: 'israel',
    name: 'Israel',
    shortName: 'Israel',
    type: 'nation-state',
    category: 'regional-power',
    region: 'middle-east',
    flag: '🇮🇱',
    militaryBudget: 24000000000, // $24B
    nuclearStatus: 'undeclared',
    description: 'Jewish state surrounded by hostile actors, views Iranian nuclear program as existential threat, conducts preemptive strikes.',
    leadership: {
      headOfState: 'Prime Minister',
      governmentType: 'Parliamentary Democracy'
    },
    interests: ['existential-security', 'anti-iran-nukes', 'regional-dominance', 'settlements', 'us-alliance']
  },

  // GULF STATES
  saudiArabia: {
    id: 'saudi-arabia',
    name: 'Saudi Arabia',
    shortName: 'Saudi',
    type: 'nation-state',
    category: 'regional-power',
    region: 'middle-east',
    flag: '🇸🇦',
    militaryBudget: 75000000000, // $75B
    nuclearStatus: 'unarmed',
    description: 'Sunni Islamic kingdom, oil superpower, Iran\'s main regional rival, leads coalition against Iran and proxies.',
    leadership: {
      headOfState: 'King',
      governmentType: 'Absolute Monarchy'
    },
    interests: ['oil-security', 'anti-iran', 'sunni-dominance', 'yemen-war', 'us-alliance', 'economic-reform']
  },

  uae: {
    id: 'uae',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    type: 'nation-state',
    category: 'middle-power',
    region: 'middle-east',
    flag: '🇦🇪',
    militaryBudget: 23000000000, // $23B
    nuclearStatus: 'unarmed',
    description: 'Federation of emirates, major oil producer, financial hub, normalized relations with Israel (Abraham Accords).',
    leadership: {
      headOfState: 'President',
      governmentType: 'Federal Constitutional Monarchy'
    },
    interests: ['oil-security', 'economic-diversification', 'anti-iran', 'israel-normalization', 'trade-routes']
  },

  qatar: {
    id: 'qatar',
    name: 'Qatar',
    shortName: 'Qatar',
    type: 'nation-state',
    category: 'middle-power',
    region: 'middle-east',
    flag: '🇶🇦',
    militaryBudget: 13000000000, // $13B
    nuclearStatus: 'unarmed',
    description: 'Gas-rich peninsula, hosts US military base, mediates conflicts, has complex relationship with Iran.',
    leadership: {
      headOfState: 'Emir',
      governmentType: 'Absolute Monarchy'
    },
    interests: ['gas-exports', 'mediation-role', 'us-base', 'regional-stability', 'independence-from-saudi']
  },

  kuwait: {
    id: 'kuwait',
    name: 'Kuwait',
    shortName: 'Kuwait',
    type: 'nation-state',
    category: 'minor-power',
    region: 'middle-east',
    flag: '🇰🇼',
    militaryBudget: 8000000000, // $8B
    nuclearStatus: 'unarmed',
    description: 'Oil-rich emirate, hosts US bases, historically threatened by Iraq, vulnerable to Iranian missiles.',
    leadership: {
      headOfState: 'Emir',
      governmentType: 'Constitutional Monarchy'
    },
    interests: ['oil-security', 'us-protection', 'sovereignty', 'anti-iran', 'economic-stability']
  },

  // SOUTH ASIA
  pakistan: {
    id: 'pakistan',
    name: 'Pakistan',
    shortName: 'Pakistan',
    type: 'nation-state',
    category: 'regional-power',
    region: 'south-asia',
    flag: '🇵🇰',
    militaryBudget: 7600000000, // $7.6B
    nuclearStatus: 'armed',
    description: 'Nuclear-armed nation, Sunni majority, supports Taliban, in conflict with Afghanistan over border.',
    leadership: {
      headOfState: 'Prime Minister',
      governmentType: 'Federal Parliamentary Republic'
    },
    interests: ['border-security', 'afghan-influence', 'anti-india', 'china-alliance', 'kashmir', 'pashtun-issue']
  },

  afghanistan: {
    id: 'afghanistan',
    name: 'Afghanistan',
    shortName: 'Afghanistan',
    type: 'nation-state',
    category: 'fragile-state',
    region: 'south-asia',
    flag: '🇦🇫',
    militaryBudget: 500000000, // ~$500M (Taliban regime)
    nuclearStatus: 'unarmed',
    description: 'Under Taliban rule since 2021, conflicts with Pakistan over border/Durand Line, hosts terrorist groups.',
    leadership: {
      headOfState: 'Supreme Leader (Taliban)',
      governmentType: 'Islamic Emirate (theocratic)'
    },
    interests: ['border-recognition', 'pashtun-unification', 'islamic-governance', 'sanctions-relief', 'pakistan-conflict']
  },

  // PROXIES - Non-state armed groups
  hezbollah: {
    id: 'hezbollah',
    name: 'Hezbollah',
    shortName: 'Hezbollah',
    type: 'proxy',
    category: 'militant-group',
    region: 'middle-east',
    flag: '🟡',
    militaryBudget: null, // Funded by Iran
    nuclearStatus: 'unarmed',
    description: 'Lebanese Shia Islamist political/military group, Iran\'s strongest proxy, heavily armed with rockets.',
    leadership: {
      headOfState: 'Secretary-General',
      governmentType: 'Islamist Militant Organization'
    },
    interests: ['anti-israel', 'shia-power', 'lebanon-control', 'iran-support', 'resistance-axis']
  },

  hamas: {
    id: 'hamas',
    name: 'Hamas',
    shortName: 'Hamas',
    type: 'proxy',
    category: 'militant-group',
    region: 'middle-east',
    flag: '🟢',
    militaryBudget: null, // Funded by Iran/Qatar
    nuclearStatus: 'unarmed',
    description: 'Palestinian Sunni Islamist group controlling Gaza, receives Iranian funding, fights Israel.',
    leadership: {
      headOfState: 'Political Bureau Chief',
      governmentType: 'Islamist Militant Organization'
    },
    interests: ['destroy-israel', 'gaza-control', 'palestinian-state', 'iran-support', 'sunni-islamism']
  },

  houthis: {
    id: 'houthis',
    name: 'Houthis (Ansar Allah)',
    shortName: 'Houthis',
    type: 'proxy',
    category: 'militant-group',
    region: 'middle-east',
    flag: '🔴',
    militaryBudget: null, // Funded by Iran
    nuclearStatus: 'unarmed',
    description: 'Yemeni Shia rebel group, controls Sana\'a, attacks Saudi Arabia and shipping, Iran-backed.',
    leadership: {
      headOfState: 'Supreme Political Council',
      governmentType: 'Revolutionary Movement'
    },
    interests: ['yemen-control', 'anti-saudi', 'anti-israel', 'iran-support', 'shia-rights', 'red-sea-control']
  },

  talibanPakistan: {
    id: 'ttp',
    name: 'Pakistani Taliban (TTP)',
    shortName: 'TTP',
    type: 'proxy',
    category: 'terrorist-group',
    region: 'south-asia',
    flag: '⚫',
    militaryBudget: null,
    nuclearStatus: 'unarmed',
    description: 'Pakistani militant group, attacks Pakistan military, allegedly supported by Afghan Taliban/Iran.',
    leadership: {
      headOfState: 'Amir',
      governmentType: 'Islamist Militant Organization'
    },
    interests: ['overthrow-pakistan', 'islamic-state', 'pashtun-unity', 'anti-pakistan-military']
  },

  // IRAQ GROUPS
  kataibHezbollah: {
    id: 'kataib-hezbollah',
    name: 'Kataib Hezbollah',
    shortName: 'KH',
    type: 'proxy',
    category: 'militant-group',
    region: 'middle-east',
    flag: '🟤',
    militaryBudget: null, // Iran-funded
    nuclearStatus: 'unarmed',
    description: 'Iraqi Shia paramilitary group, attacks US forces in Iraq, trained/funded by Iran.',
    leadership: {
      headOfState: 'Secretary-General',
      governmentType: 'Militia Organization'
    },
    interests: ['us-expulsion-iraq', 'shia-dominance-iraq', 'iran-support', 'anti-israel']
  },

  asaibAhlHaq: {
    id: 'asaib-ahl-haq',
    name: 'Asaib Ahl al-Haq',
    shortName: 'AAH',
    type: 'proxy',
    category: 'militant-group',
    region: 'middle-east',
    flag: '⚪',
    militaryBudget: null,
    nuclearStatus: 'unarmed',
    description: 'Iraqi Shia militia, splinter from Mahdi Army, attacks US/Coalition forces, Iran-linked.',
    leadership: {
      headOfState: 'Secretary-General',
      governmentType: 'Militia Organization'
    },
    interests: ['us-expulsion', 'iraq-control', 'iran-support', 'shia-power']
  },

  // EXTERNAL POWERS
  russia: {
    id: 'russia',
    name: 'Russia',
    shortName: 'Russia',
    type: 'nation-state',
    category: 'superpower',
    region: 'eurasia',
    flag: '🇷🇺',
    militaryBudget: 86000000000, // $86B
    nuclearStatus: 'armed',
    description: 'Supports Iran diplomatically and militarily, seeks to counter US influence in Middle East.',
    leadership: {
      headOfState: 'President',
      governmentType: 'Authoritarian'
    },
    interests: ['anti-us', 'syria-presence', 'arms-sales', 'regional-influence', 'energy-exports']
  },

  china: {
    id: 'china',
    name: 'China',
    shortName: 'China',
    type: 'nation-state',
    category: 'superpower',
    region: 'east-asia',
    flag: '🇨🇳',
    militaryBudget: 296000000000, // $296B
    nuclearStatus: 'armed',
    description: 'Major oil importer, balancing relationships, investing in infrastructure, avoids direct involvement.',
    leadership: {
      headOfState: 'President/General Secretary',
      governmentType: 'Authoritarian (Communist Party)'
    },
    interests: ['oil-imports', 'economic-ties', 'belt-and-road', 'non-interference', 'regional-stability']
  },

  turkey: {
    id: 'turkey',
    name: 'Turkey',
    shortName: 'Turkey',
    type: 'nation-state',
    category: 'regional-power',
    region: 'middle-east',
    flag: '🇹🇷',
    militaryBudget: 20000000000, // $20B
    nuclearStatus: 'unarmed',
    description: 'NATO member with complicated position, fights PKK, opposes Assad, plays multiple sides.',
    leadership: {
      headOfState: 'President',
      governmentType: 'Presidential Republic (authoritarian)'
    },
    interests: ['kurdish-issue', 'syria-policy', 'neo-ottoman', 'nato-membership', 'regional-influence']
  },

  // IRAQ GOVERNMENT (ambiguous position)
  iraqGovernment: {
    id: 'iraq-government',
    name: 'Iraq Government',
    shortName: 'Iraq',
    type: 'nation-state',
    category: 'fragile-state',
    region: 'middle-east',
    flag: '🇮🇶',
    militaryBudget: 12000000000, // $12B
    nuclearStatus: 'unarmed',
    description: 'Shia-dominated government, hosts US troops but pressured by Iran-linked militias, sovereignty challenged.',
    leadership: {
      headOfState: 'Prime Minister',
      governmentType: 'Parliamentary Republic'
    },
    interests: ['sovereignty', 'balance-us-iran', 'stability', 'oil-exports', 'territorial-integrity']
  }
};

// ============================================================================
// RELATIONSHIPS - Who is connected to whom
// ============================================================================

export const RELATIONSHIPS = [
  // ==================== ATTACK RELATIONSHIPS ====================
  // Format: source -> target with attack types

  // US attacks
  {
    id: 'rel-us-iran-attacks',
    source: 'united-states',
    target: 'iran',
    type: 'attacking',
    attackTypes: ['airstrike', 'missile', 'naval', 'cyber'],
    intensity: 'high',
    description: 'US conducting wide-scale strikes on Iranian nuclear and military facilities, Strait of Hormuz operations',
    since: '2026-03-16',
    examples: [
      'Bunker-buster strikes on missile facilities, Bandar Abbas',
      'Airstrikes on Chabahar Free Trade Zone',
      'Naval operations in Persian Gulf'
    ]
  },

  // Israel attacks
  {
    id: 'rel-israel-iran-attacks',
    source: 'israel',
    target: 'iran',
    type: 'attacking',
    attackTypes: ['airstrike', 'assassination', 'cyber'],
    intensity: 'high',
    description: 'Israel conducting precision strikes on Iranian leadership and facilities, assassinated nuclear scientists',
    since: '2026-03-17',
    examples: [
      'Precision airstrike on senior leadership in Tehran',
      'Wide-scale strikes on government & military infrastructure',
      'Years of assassinating Iranian nuclear scientists'
    ]
  },
  {
    id: 'rel-israel-hezbollah-attacks',
    source: 'israel',
    target: 'hezbollah',
    type: 'attacking',
    attackTypes: ['airstrike', 'artillery'],
    intensity: 'high',
    description: 'Repeated airstrikes on Hezbollah positions in Lebanon',
    since: '2026-03-16',
    examples: [
      'Airstrike on Hezbollah-linked structure in central Beirut',
      'Strikes on rocket launch sites in southern Lebanon'
    ]
  },

  // Iran attacks
  {
    id: 'rel-iran-israel-attacks',
    source: 'iran',
    target: 'israel',
    type: 'attacking',
    attackTypes: ['missile', 'drone'],
    intensity: 'high',
    description: 'Ballistic missile and drone attacks on central Israel',
    since: '2026-03-17',
    examples: [
      'Ballistic missile strike on central Israel (Tel Aviv)',
      'Multiple missile and drone waves targeting central Israel'
    ]
  },
  {
    id: 'rel-iran-uae-attacks',
    source: 'iran',
    target: 'uae',
    type: 'attacking',
    attackTypes: ['missile', 'drone'],
    intensity: 'high',
    description: 'Coordinated strikes on UAE oil facilities and infrastructure',
    since: '2026-03-16',
    examples: [
      'Drone strike on Dubai International Airport fuel tank',
      'Tanker hit near Fujairah oil port',
      'Drone strike on Shah oil field',
      'Missile debris struck civilian vehicle in Abu Dhabi'
    ]
  },
  {
    id: 'rel-iran-saudi-attacks',
    source: 'iran',
    target: 'saudi-arabia',
    type: 'attacking',
    attackTypes: ['drone', 'missile'],
    intensity: 'medium',
    description: 'Drone waves intercepted over Saudi territory',
    since: '2026-03-16',
    examples: [
      'Iranian drone waves intercepted by Saudi air defense'
    ]
  },
  {
    id: 'rel-iran-qatar-attacks',
    source: 'iran',
    target: 'qatar',
    type: 'attacking',
    attackTypes: ['missile'],
    intensity: 'high',
    description: 'Ballistic missile attacks on Doha area',
    since: '2026-03-16',
    examples: [
      'Ballistic missile intercepted near Doha',
      'Fresh ballistic missile attack on Doha intercepted'
    ]
  },
  {
    id: 'rel-iran-kuwait-attacks',
    source: 'iran',
    target: 'kuwait',
    type: 'attacking',
    attackTypes: ['missile'],
    intensity: 'high',
    description: 'Missile strikes on oil facilities as part of Gulf-wide attacks',
    since: '2026-03-17',
    examples: [
      'Coordinated strikes on Gulf oil facilities including Kuwait'
    ]
  },
  {
    id: 'rel-iran-iraq-attacks',
    source: 'iran',
    target: 'united-states', // Via proxies in Iraq
    type: 'attacking',
    attackTypes: ['drone', 'rocket'],
    intensity: 'high',
    description: 'Proxy attacks on US Embassy and personnel in Iraq',
    since: '2026-03-17',
    examples: [
      'Major attack on US Embassy Baghdad – rockets and drones',
      'Missile strike on residential building in Baghdad al-Jadriya'
    ],
    proxyUsed: ['kataib-hezbollah', 'asaib-ahl-haq']
  },

  // Pakistan-Afghanistan conflict
  {
    id: 'rel-pakistan-afghanistan-attacks',
    source: 'pakistan',
    target: 'afghanistan',
    type: 'attacking',
    attackTypes: ['airstrike'],
    intensity: 'high',
    description: 'Cross-border airstrikes on Taliban facilities in response to drone attacks',
    since: '2026-03-14',
    examples: [
      'Pakistan airstrikes on Afghan Taliban facility in Kandahar'
    ]
  },
  {
    id: 'rel-afghanistan-pakistan-attacks',
    source: 'afghanistan',
    target: 'pakistan',
    type: 'attacking',
    attackTypes: ['missile', 'drone'],
    intensity: 'medium',
    description: 'Retaliatory strikes on Pakistani military installations',
    since: '2026-03-14',
    examples: [
      'Afghan Taliban strikes on Pakistani military installations near Islamabad'
    ]
  },

  // Proxy attacks
  {
    id: 'rel-houthis-saudi-attacks',
    source: 'houthis',
    target: 'saudi-arabia',
    type: 'attacking',
    attackTypes: ['missile', 'drone'],
    intensity: 'ongoing',
    description: 'Long-running war with missile/drone attacks on Saudi oil and cities',
    since: '2014',
    examples: ['Aramco facility attacks', 'Riyadh missile strikes']
  },
  {
    id: 'rel-hezbollah-israel-attacks',
    source: 'hezbollah',
    target: 'israel',
    type: 'attacking',
    attackTypes: ['rocket', 'missile'],
    intensity: 'high',
    description: 'Rocket attacks on northern Israel, border skirmishes',
    since: 'ongoing',
    examples: ['Daily rocket barrages', 'Cross-border raids']
  },
  {
    id: 'rel-hamas-israel-attacks',
    source: 'hamas',
    target: 'israel',
    type: 'attacking',
    attackTypes: ['rocket', 'infiltration'],
    intensity: 'ongoing',
    description: 'Rocket attacks from Gaza, ongoing conflict',
    since: 'ongoing',
    examples: ['Gaza rocket barrages']
  },

  // ==================== ALLIANCE RELATIONSHIPS ====================
  
  {
    id: 'rel-us-israel-alliance',
    source: 'united-states',
    target: 'israel',
    type: 'alliance',
    strength: 'strong',
    description: 'Primary alliance - US provides $3.8B annual military aid, diplomatic cover, intelligence sharing',
    since: '1948',
    aspects: ['military-aid', 'intelligence-sharing', 'diplomatic-support', 'arms-sales']
  },
  {
    id: 'rel-us-saudi-alliance',
    source: 'united-states',
    target: 'saudi-arabia',
    type: 'alliance',
    strength: 'moderate',
    description: 'Security alliance based on oil and regional security, arms sales, some tensions over human rights',
    since: '1945',
    aspects: ['arms-sales', 'oil-security', 'regional-security', 'counter-iran']
  },
  {
    id: 'rel-us-uae-alliance',
    source: 'united-states',
    target: 'uae',
    type: 'alliance',
    strength: 'strong',
    description: 'Strategic partnership, F-35 sales (initially), intelligence cooperation',
    since: '1971',
    aspects: ['military-cooperation', 'intelligence-sharing', 'economic-ties']
  },
  {
    id: 'rel-us-uk-alliance',
    source: 'united-states',
    target: 'united-kingdom',
    type: 'alliance',
    strength: 'strong',
    description: 'NATO ally, typically supports US Middle East operations',
    since: 'NATO founding'
  },

  // ==================== PROXY RELATIONSHIPS ====================
  
  // Iran's proxy network (The "Axis of Resistance")
  {
    id: 'rel-iran-hezbollah-proxy',
    source: 'iran',
    target: 'hezbollah',
    type: 'proxy-master',
    strength: 'strong',
    description: 'Iran\'s strongest proxy - provides $700M+ annually, weapons, training. Hezbollah has 150,000+ rockets.',
    supportTypes: ['funding', 'weapons', 'training', 'intelligence'],
    annualFunding: 700000000
  },
  {
    id: 'rel-iran-hamas-proxy',
    source: 'iran',
    target: 'hamas',
    type: 'proxy-master',
    strength: 'moderate',
    description: 'Provides funding, rockets, tunnel technology. Hamas is Sunni but accepts Shia Iran support.',
    supportTypes: ['funding', 'weapons', 'training'],
    annualFunding: 100000000
  },
  {
    id: 'rel-iran-houthis-proxy',
    source: 'iran',
    target: 'houthis',
    type: 'proxy-master',
    strength: 'strong',
    description: 'Provides missiles, drones, training. Houthis attack Saudi Arabia and shipping.',
    supportTypes: ['weapons', 'training', 'funding', 'intelligence'],
    annualFunding: null
  },
  {
    id: 'rel-iran-kataib-hezbollah-proxy',
    source: 'iran',
    target: 'kataibHezbollah',
    type: 'proxy-master',
    strength: 'strong',
    description: 'Created by Iran, attacks US forces in Iraq, part of PMU umbrella.',
    supportTypes: ['funding', 'weapons', 'training', 'command']
  },
  {
    id: 'rel-iran-asaib-ahl-haq-proxy',
    source: 'iran',
    target: 'asaibAhlHaq',
    type: 'proxy-master',
    strength: 'strong',
    description: 'Iran-linked militia, attacks US forces, political party in Iraq.',
    supportTypes: ['funding', 'weapons', 'training']
  },
  {
    id: 'rel-iran-afghan-taliban-proxy',
    source: 'iran',
    target: 'afghanistan',
    type: 'proxy-relationship',
    strength: 'moderate',
    description: 'Complex relationship - Iran hosts Taliban leaders, may support against Pakistan.',
    supportTypes: ['safe-haven', 'possible-funding']
  },
  {
    id: 'rel-afghanistan-ttp-proxy',
    source: 'afghanistan',
    target: 'talibanPakistan',
    type: 'proxy-relationship',
    strength: 'moderate',
    description: 'Afghan Taliban allegedly supports Pakistani Taliban against Pakistan.',
    supportTypes: ['safe-haven', 'possible-arms']
  },

  // ==================== RIVALRY RELATIONSHIPS ====================
  
  {
    id: 'rel-iran-saudi-rivalry',
    source: 'iran',
    target: 'saudi-arabia',
    type: 'rivalry',
    nature: 'sectarian-geopolitical',
    description: 'Regional power struggle - Shia Iran vs Sunni Saudi Arabia, competing for Islamic world leadership',
    aspects: ['sectarian', 'regional-hegemony', 'oil-markets', 'proxy-war-yemen']
  },
  {
    id: 'rel-iran-israel-rivalry',
    source: 'iran',
    target: 'israel',
    type: 'rivalry',
    nature: 'existential',
    description: 'Iran pledges to destroy Israel; Israel sees Iranian nukes as existential threat',
    aspects: ['existential', 'religious', 'nuclear', 'proxy-war']
  },
  {
    id: 'rel-pakistan-afghanistan-rivalry',
    source: 'pakistan',
    target: 'afghanistan',
    type: 'rivalry',
    nature: 'border-ethnic',
    description: 'Border disputes (Durand Line), Pashtun unification aspirations, TTP sanctuary',
    aspects: ['border-dispute', 'ethnic', 'terrorism', 'strategic-depth']
  },

  // ==================== SUPPORTING RELATIONSHIPS ====================
  
  {
    id: 'rel-russia-iran-support',
    source: 'russia',
    target: 'iran',
    type: 'supporting',
    strength: 'moderate',
    description: 'Provides diplomatic cover, weapons (Su-35 jets, air defense), cooperation in Syria',
    supportTypes: ['diplomatic', 'arms-sales', 'syria-coordination']
  },
  {
    id: 'rel-china-iran-support',
    source: 'china',
    target: 'iran',
    type: 'supporting',
    strength: 'moderate',
    description: 'Economic partnership, oil purchases, infrastructure investment, some diplomatic support',
    supportTypes: ['economic', 'oil-imports', 'investment']
  },
  {
    id: 'rel-china-saudi-support',
    source: 'china',
    target: 'saudi-arabia',
    type: 'supporting',
    strength: 'moderate',
    description: 'Major oil customer, economic ties, brokering normalization deals',
    supportTypes: ['economic', 'oil-imports', 'diplomatic-brokering']
  },
  {
    id: 'rel-qatar-hamas-support',
    source: 'qatar',
    target: 'hamas',
    type: 'supporting',
    strength: 'moderate',
    description: 'Provides funding to Hamas, hosts leaders, mediates Gaza conflicts',
    supportTypes: ['funding', 'safe-haven', 'mediation']
  },

  // ==================== HOSTILE RELATIONSHIPS ====================
  
  {
    id: 'rel-saudi-qatar-hostile',
    source: 'saudi-arabia',
    target: 'qatar',
    type: 'hostile',
    nature: 'diplomatic',
    description: 'Past blockade (2017-2021), ongoing tensions over Muslim Brotherhood and Iran ties',
    status: 'improved'
  },

  // ==================== TREATY/AGREEMENT RELATIONSHIPS ====================
  
  {
    id: 'rel-israel-uae-abraham',
    source: 'israel',
    target: 'uae',
    type: 'normalization',
    agreement: 'Abraham Accords',
    since: '2020',
    description: 'Normalized relations, trade, tourism, security cooperation against Iran'
  },
  {
    id: 'rel-israel-saudi-talks',
    source: 'israel',
    target: 'saudi-arabia',
    type: 'normalization-talks',
    status: 'suspended',
    description: 'Negotiations for normalization ongoing but suspended due to Gaza war'
  }
];

// ============================================================================
// WHAT'S AT STAKE - Core interests for each actor
// ============================================================================

export const STAKES = {
  unitedStates: {
    actorId: 'united-states',
    primaryStakes: [
      {
        stake: 'nuclear-nonproliferation',
        priority: 'critical',
        description: 'Prevent Iran from obtaining nuclear weapons - would trigger regional arms race',
        whyItMatters: 'Nuclear Iran = untouchable Iran = loss of regional influence'
      },
      {
        stake: 'israel-security',
        priority: 'critical',
        description: 'Protect Israel, key ally and only democracy in region',
        whyItMatters: 'Domestic politics, Jewish-American voters, strategic asset'
      },
      {
        stake: 'oil-flow',
        priority: 'high',
        description: 'Keep Persian Gulf oil flowing to global markets',
        whyItMatters: 'Global economy, gas prices, re-election concerns'
      },
      {
        stake: 'regional-dominance',
        priority: 'high',
        description: 'Maintain US as primary power broker in Middle East',
        whyItMatters: 'Prestige, counter Russia/China, arms sales'
      },
      {
        stake: 'force-protection',
        priority: 'high',
        description: 'Protect 40,000+ US troops in region',
        whyItMatters: 'Casualties = political disaster at home'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Can accept stalemate but not Iranian nuclear weapons'
  },

  iran: {
    actorId: 'iran',
    primaryStakes: [
      {
        stake: 'regime-survival',
        priority: 'critical',
        description: 'Prevent regime change or collapse',
        whyItMatters: 'Leadership would be killed or imprisoned if regime falls'
      },
      {
        stake: 'nuclear-program',
        priority: 'critical',
        description: 'Maintain nuclear capability as deterrent and prestige',
        whyItMatters: 'Nuclear weapons = insurance against invasion (North Korea model)'
      },
      {
        stake: 'regional-hegemony',
        priority: 'high',
        description: 'Dominate Middle East through proxy network',
        whyItMatters: 'Sphere of influence, export revolution, Shiite crescent'
      },
      {
        stake: 'anti-israel',
        priority: 'high',
        description: 'Destroy Israel - core ideological commitment since 1979',
        whyItMatters: 'Religious ideology, domestic legitimacy, rallying cry'
      },
      {
        stake: 'sanctions-relief',
        priority: 'high',
        description: 'Get sanctions lifted to save economy',
        whyItMatters: 'Economic collapse = domestic unrest = regime threat'
      }
    ],
    existentialRisk: true,
    canAffordToLose: 'Cannot afford regime change - will fight to the end'
  },

  israel: {
    actorId: 'israel',
    primaryStakes: [
      {
        stake: 'existential-survival',
        priority: 'critical',
        description: 'Prevent Iranian nuclear weapons',
        whyItMatters: 'Iran has promised to destroy Israel; nukes could do it'
      },
      {
        stake: 'border-security',
        priority: 'critical',
        description: 'Secure borders from Hezbollah, Hamas, Iranian proxies',
        whyItMatters: 'Daily rocket threats, Oct 7 showed vulnerability'
      },
      {
        stake: 'qualitative-military-edge',
        priority: 'high',
        description: 'Maintain military superiority over all neighbors',
        whyItMatters: 'Surrounded by enemies, must win every war'
      },
      {
        stake: 'us-alliance',
        priority: 'high',
        description: 'Maintain American support and weapons supply',
        whyItMatters: '$3.8B annual aid, veto at UN, political cover'
      }
    ],
    existentialRisk: true,
    canAffordToLose: 'Cannot allow Iranian nuclear weapons - strike first policy'
  },

  saudiArabia: {
    actorId: 'saudi-arabia',
    primaryStakes: [
      {
        stake: 'oil-security',
        priority: 'critical',
        description: 'Protect oil infrastructure and export routes',
        whyItMatters: 'Oil = everything. Attacks = economic catastrophe'
      },
      {
        stake: 'iran-containment',
        priority: 'critical',
        description: 'Prevent Iranian regional dominance',
        whyItMatters: 'Shia vs Sunni, competing for Islamic leadership'
      },
      {
        stake: 'regime-stability',
        priority: 'critical',
        description: 'Maintain royal family rule',
        whyItMatters: 'Saudi Arabia without Saudis = chaos'
      },
      {
        stake: 'yemen-war',
        priority: 'high',
        description: 'Defeat Houthi rebels in Yemen',
        whyItMatters: 'Border security, Iranian proxy on doorstep'
      },
      {
        stake: 'economic-reform',
        priority: 'medium',
        description: 'Vision 2030 - diversify from oil',
        whyItMatters: 'Future survival when oil demand drops'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Can survive setbacks but not regime collapse or Iranian dominance'
  },

  hezbollah: {
    actorId: 'hezbollah',
    primaryStakes: [
      {
        stake: 'organizational-survival',
        priority: 'critical',
        description: 'Survive Israeli military campaign',
        whyItMatters: 'Leadership being targeted, infrastructure being destroyed'
      },
      {
        stake: 'iran-support',
        priority: 'critical',
        description: 'Maintain Iranian funding and weapons',
        whyItMatters: '$700M/year, missiles, salaries - lifeline'
      },
      {
        stake: 'lebanon-control',
        priority: 'high',
        description: 'Maintain political dominance in Lebanon',
        whyItMatters: 'State within a state, provides services to Shiites'
      },
      {
        stake: 'resistance-credibility',
        priority: 'high',
        description: 'Maintain reputation as anti-Israel resistance',
        whyItMatters: 'Legitimacy comes from fighting Israel'
      }
    ],
    existentialRisk: true,
    canAffordToLose: 'Current Israeli campaign is existential threat'
  },

  pakistan: {
    actorId: 'pakistan',
    primaryStakes: [
      {
        stake: 'border-security',
        priority: 'critical',
        description: 'Secure border with Afghanistan, stop TTP attacks',
        whyItMatters: 'TTP killed 100+ soldiers recently, internal pressure'
      },
      {
        stake: 'durand-line',
        priority: 'high',
        description: 'Maintain border as recognized boundary',
        whyItMatters: 'Afghanistan disputes border, Pashtun unification threat'
      },
      {
        stake: 'strategic-depth',
        priority: 'high',
        description: 'Maintain influence over Afghanistan',
        whyItMatters: 'India encirclement fears, security on western border'
      },
      {
        stake: 'nuclear-security',
        priority: 'critical',
        description: 'Secure nuclear arsenal from extremists',
        whyItMatters: 'World\'s fastest growing nuclear stockpile'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Can tolerate instability but not Afghan Taliban victory over Pakistan'
  },

  afghanistan: {
    actorId: 'afghanistan',
    primaryStakes: [
      {
        stake: 'border-recognition',
        priority: 'critical',
        description: 'Get Pakistan/ world to recognize Durand Line',
        whyItMatters: 'Unify Pashtun people, reclaim "lost" territory'
      },
      {
        stake: 'regime-recognition',
        priority: 'critical',
        description: 'Gain international recognition as government',
        whyItMatters: 'Currently isolated, no UN seat, sanctions crippling'
      },
      {
        stake: 'ttp-sanctuary',
        priority: 'medium',
        description: 'Maintain TTP as leverage against Pakistan',
        whyItMatters: 'Retaliation tool for border disputes'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Already survived 20-year war, can survive border tensions'
  },

  russia: {
    actorId: 'russia',
    primaryStakes: [
      {
        stake: 'anti-us',
        priority: 'high',
        description: 'Undermine US influence anywhere possible',
        whyItMatters: 'Great power competition, Ukraine distraction'
      },
      {
        stake: 'syria-presence',
        priority: 'high',
        description: 'Maintain military bases in Syria',
        whyItMatters: 'Only Mediterranean naval base, power projection'
      },
      {
        stake: 'arms-sales',
        priority: 'medium',
        description: 'Sell weapons to Iran and allies',
        whyItMatters: 'Revenue, influence, keep defense industry alive'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Iran is useful pawn, not worth WW3'
  },

  china: {
    actorId: 'china',
    primaryStakes: [
      {
        stake: 'oil-imports',
        priority: 'critical',
        description: 'Secure oil supply from Gulf',
        whyItMatters: 'World\'s largest oil importer, economy depends on it'
      },
      {
        stake: 'regional-stability',
        priority: 'high',
        description: 'Avoid disruption to trade routes',
        whyItMatters: 'Belt and Road, economic growth priority'
      },
      {
        stake: 'iran-ties',
        priority: 'medium',
        description: 'Maintain relationship with Iran',
        whyItMatters: 'Counter US, cheap oil, strategic partner'
      }
    ],
    existentialRisk: false,
    canAffordToLose: 'Will mediate but won\'t fight - economic interests paramount'
  }
};

// ============================================================================
// CONFLICT ZONES - Geographic areas of active conflict
// ============================================================================

export const CONFLICT_ZONES = [
  {
    id: 'zone-persian-gulf',
    name: 'Persait Gulf',
    type: 'maritime-strategic',
    actors: ['united-states', 'iran', 'uae', 'saudi-arabia', 'kuwait', 'qatar'],
    description: 'World\'s most important oil chokepoint, Strait of Hormuz',
    keyStakes: ['20% of world oil', 'shipping lanes', 'naval bases'],
    currentStatus: 'active-combat',
    recentEvents: ['US strikes on Iranian missile facilities', 'Iranian attacks on Gulf oil facilities']
  },
  {
    id: 'zone-iran-israel',
    name: 'Iran-Israel Direct Conflict',
    type: 'direct-state-war',
    actors: ['iran', 'israel'],
    description: 'Direct missile and airstrike exchanges between Iran and Israel',
    keyStakes: ['nuclear program', 'regional dominance', 'survival'],
    currentStatus: 'active-combat',
    recentEvents: ['Israeli precision strikes on Tehran', 'Iranian missile attacks on Israel']
  },
  {
    id: 'zone-lebanon',
    name: 'Lebanon-Israel Border',
    type: 'proxy-war',
    actors: ['israel', 'hezbollah', 'lebanon'],
    description: 'Hezbollah rocket attacks vs Israeli airstrikes',
    keyStakes: ['border security', 'rocket arsenals', 'civilian safety'],
    currentStatus: 'active-combat',
    recentEvents: ['Israeli strikes on Beirut', 'Hezbollah rocket barrages']
  },
  {
    id: 'zone-gaza',
    name: 'Gaza Strip',
    type: 'proxy-war',
    actors: ['israel', 'hamas', 'palestine'],
    description: 'Ongoing Israel-Hamas war, Iran provides support',
    keyStakes: ['Palestinian statehood', 'Israeli security', 'civilian casualties'],
    currentStatus: 'active-combat',
    recentEvents: ['Continued fighting', 'Iranian support for Hamas']
  },
  {
    id: 'zone-yemen',
    name: 'Yemen Civil War',
    type: 'proxy-war',
    actors: ['houthis', 'saudi-arabia', 'uae', 'iran'],
    description: 'Houthi rebels vs Saudi-led coalition, Red Sea shipping attacks',
    keyStakes: ['Yemen control', 'Red Sea shipping', 'Saudi border security'],
    currentStatus: 'active-combat',
    recentEvents: ['Houthi missile attacks on shipping', 'Saudi airstrikes']
  },
  {
    id: 'zone-iraq',
    name: 'Iraq',
    type: 'proxy-war',
    actors: ['iraq-government', 'united-states', 'iran', 'kataib-hezbollah', 'asaib-ahl-haq'],
    description: 'Iranian proxy attacks on US forces, Iraqi sovereignty struggle',
    keyStakes: ['US troop presence', 'Iraqi sovereignty', 'Shia dominance'],
    currentStatus: 'active-combat',
    recentEvents: ['Attack on US Embassy Baghdad', 'Missile strikes on Baghdad']
  },
  {
    id: 'zone-afghan-pakistan',
    name: 'Afghanistan-Pakistan Border',
    type: 'border-conflict',
    actors: ['afghanistan', 'pakistan', 'ttp'],
    description: 'Border disputes, TTP attacks from Afghanistan, airstrikes',
    keyStakes: ['Durand Line', 'border security', 'Pashtun issue'],
    currentStatus: 'active-combat',
    recentEvents: ['Pakistani airstrikes on Kandahar', 'Afghan retaliation on Islamabad']
  },
  {
    id: 'zone-syria',
    name: 'Syria',
    type: 'proxy-war',
    actors: ['russia', 'iran', 'israel', 'turkey', 'united-states'],
    description: 'Multiple overlapping conflicts, Iranian weapons transfers to Hezbollah',
    keyStakes: ['regime survival', 'weapons routes', 'refugee crisis'],
    currentStatus: 'ongoing-tensions',
    recentEvents: ['Israeli airstrikes on Iranian targets', 'Russian presence']
  }
];

// ============================================================================
// KEY DYNAMICS - High-level conflict drivers
// ============================================================================

export const KEY_DYNAMICS = [
  {
    id: 'dynamic-nuclear-race',
    name: 'Nuclear Proliferation Race',
    description: 'If Iran gets nukes, Saudi Arabia and Turkey will want them too',
    riskLevel: 'extreme',
    actors: ['iran', 'israel', 'saudi-arabia', 'turkey'],
    trigger: 'Iran weaponizes nuclear program'
  },
  {
    id: 'dynamic-sectarian',
    name: 'Shia vs Sunni Proxy War',
    description: 'Iran (Shia) vs Saudi Arabia (Sunni) fighting across Middle East',
    riskLevel: 'high',
    actors: ['iran', 'saudi-arabia', 'hezbollah', 'houthis', 'iraq-government'],
    trigger: 'Ongoing - regional power struggle'
  },
  {
    id: 'dynamic-oil-chokepoint',
    name: 'Strait of Hormuz Closure Risk',
    description: 'Iran can block 20% of world oil, crashing global economy',
    riskLevel: 'extreme',
    actors: ['iran', 'united-states', 'china', 'global-economy'],
    trigger: 'Iran desperate or losing badly'
  },
  {
    id: 'dynamic-proxy-escalation',
    name: 'Proxy Group Escalation',
    description: 'Hezbollah, Houthis, Iraqi militias can trigger wider war',
    riskLevel: 'high',
    actors: ['hezbollah', 'houthis', 'kataib-hezbollah', 'iran', 'israel', 'saudi-arabia'],
    trigger: 'Any major proxy attack draws in patrons'
  },
  {
    id: 'dynamic-great-power',
    name: 'Great Power Competition',
    description: 'US vs Russia/China using Middle East as chessboard',
    riskLevel: 'medium',
    actors: ['united-states', 'russia', 'china', 'iran'],
    trigger: 'Direct superpower confrontation'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getActor(actorId) {
  return ACTORS[actorId] || null;
}

export function getAllActors() {
  return Object.values(ACTORS);
}

export function getActorsByType(type) {
  return Object.values(ACTORS).filter(actor => actor.type === type);
}

export function getActorsByCategory(category) {
  return Object.values(ACTORS).filter(actor => actor.category === category);
}

export function getRelationshipsByType(type) {
  return RELATIONSHIPS.filter(rel => rel.type === type);
}

export function getRelationshipsForActor(actorId) {
  return RELATIONSHIPS.filter(
    rel => rel.source === actorId || rel.target === actorId
  );
}

export function getAttacksInvolving(actorId) {
  return RELATIONSHIPS.filter(
    rel => rel.type === 'attacking' && 
    (rel.source === actorId || rel.target === actorId)
  );
}

export function getProxiesFor(masterId) {
  return RELATIONSHIPS
    .filter(rel => rel.source === masterId && rel.type === 'proxy-master')
    .map(rel => ACTORS[rel.target]);
}

export function getMasterFor(proxyId) {
  const rel = RELATIONSHIPS.find(
    rel => rel.target === proxyId && rel.type === 'proxy-master'
  );
  return rel ? ACTORS[rel.source] : null;
}

export function getStakes(actorId) {
  return STAKES[actorId] || null;
}

export function getConflictZonesForActor(actorId) {
  return CONFLICT_ZONES.filter(zone => zone.actors.includes(actorId));
}

// Get all active conflicts
export function getActiveConflicts() {
  return RELATIONSHIPS.filter(
    rel => rel.type === 'attacking' && 
    (rel.intensity === 'high' || rel.since?.startsWith('2026'))
  );
}

// Get the "Axis of Resistance" (Iran and its proxies)
export function getAxisOfResistance() {
  const iran = ACTORS.iran;
  const proxies = getProxiesFor('iran');
  return { master: iran, proxies };
}

// Get the US-led coalition
export function getUSCoalition() {
  const allies = RELATIONSHIPS
    .filter(rel => rel.source === 'united-states' && rel.type === 'alliance')
    .map(rel => ACTORS[rel.target]);
  return { leader: ACTORS.unitedStates, allies };
}

// Get summary statistics
export function getConflictStats() {
  const activeAttacks = RELATIONSHIPS.filter(r => r.type === 'attacking').length;
  const activeProxies = RELATIONSHIPS.filter(r => r.type === 'proxy-master').length;
  const totalActors = Object.keys(ACTORS).length;
  const nuclearActors = Object.values(ACTORS).filter(a => a.nuclearStatus === 'armed').length;
  
  return {
    totalActors,
    activeAttacks,
    activeProxies,
    nuclearActors,
    conflictZones: CONFLICT_ZONES.length,
    directWarPairs: RELATIONSHIPS.filter(r => 
      r.type === 'attacking' && 
      ACTORS[r.source]?.type === 'nation-state' && 
      ACTORS[r.target]?.type === 'nation-state'
    ).length
  };
}

// Default export
export default {
  ACTORS,
  RELATIONSHIPS,
  STAKES,
  CONFLICT_ZONES,
  KEY_DYNAMICS,
  getActor,
  getAllActors,
  getActorsByType,
  getActorsByCategory,
  getRelationshipsByType,
  getRelationshipsForActor,
  getAttacksInvolving,
  getProxiesFor,
  getMasterFor,
  getStakes,
  getConflictZonesForActor,
  getActiveConflicts,
  getAxisOfResistance,
  getUSCoalition,
  getConflictStats
};

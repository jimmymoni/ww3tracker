/**
 * NUCLEAR WARHEAD DATABASE - Educational Resource
 * 
 * Comprehensive data on historical and modern nuclear weapons
 * for educational simulation purposes.
 * 
 * Data sources:
 * - Federation of American Scientists (FAS) Nuclear Notebook
 * - Bulletin of the Atomic Scientists
 * - Arms Control Association
 * - National Resources Defense Council (NRDC)
 * - Historical test records (DOE/NV)
 */

export const WARHEADS = [
  {
    id: 'beirut',
    name: 'Beirut Blast Reference',
    shortName: 'Beirut Blast',
    yield: 1.1,
    yieldDisplay: '1.1 kt',
    yieldNote: 'TNT equivalent',
    country: 'Accidental',
    type: 'Chemical Explosion (Reference)',
    category: 'reference',
    description: '2020 Beirut port explosion - for scale comparison only',
    icon: '⚠️',
    color: '#f59e0b',
    year: 2020,
    status: 'Accident',
    facts: [
      'August 4, 2020 - accidental explosion',
      '2,750 tonnes of ammonium nitrate detonated',
      'Created 4.1 magnitude seismic event',
      '218 deaths, 7,000+ injuries',
      'NOT a nuclear explosion - for comparison only'
    ],
    specifications: {
      explosiveMaterial: 'Ammonium nitrate',
      quantity: '2,750 tonnes',
      craterDiameter: '124 meters',
      seismicEquivalent: '4.1 magnitude'
    },
    history: 'The 2020 Beirut port explosion was one of the largest non-nuclear explosions in history. While devastating, it helps visualize how even a "small" 1.1 kiloton equivalent explosion affects an urban area.',
    comparison: 'If this were a nuclear weapon, the effects would include radiation, EMP, and fallout - none of which occurred in Beirut.'
  },
  {
    id: 'hiroshima',
    name: 'Little Boy',
    shortName: 'Little Boy',
    yield: 15,
    yieldDisplay: '15 kt',
    yieldNote: 'Uranium-235 fission',
    country: 'USA',
    type: 'Gun-type fission weapon',
    category: 'historical',
    description: 'First nuclear weapon used in warfare (Hiroshima, 1945)',
    icon: '☢️',
    color: '#eab308',
    year: 1945,
    status: 'Retired',
    facts: [
      'August 6, 1945 - Hiroshima, Japan',
      'First nuclear weapon used in warfare',
      '~80,000 immediate deaths, ~140,000 total by end of 1945',
      '64 kg of uranium-235 (only 1.38% underwent fission)',
      'Efficiency: Only 0.2% of material actually fissioned'
    ],
    specifications: {
      length: '3.0 meters (9.8 ft)',
      diameter: '71 cm (28 in)',
      weight: '4,400 kg (9,700 lb)',
      fissileMaterial: '64 kg uranium-235',
      deliveryMethod: 'B-29 Superfortress bomber',
      design: 'Gun-type assembly'
    },
    history: 'Little Boy was the codename for the type of atomic bomb dropped on Hiroshima. It used a simple "gun-type" design where one piece of uranium-235 was fired into another to create critical mass. The design was considered so reliable that it was never tested before combat use.',
    effects: {
      fireball: '320 meters diameter',
      blastRadius: '1.6 km total destruction',
      thermalBurns: 'Up to 3.5 km',
      radiation: 'Acute effects within 1.5 km',
      fallout: 'Minimal (airburst)'
    }
  },
  {
    id: 'nagasaki',
    name: 'Fat Man',
    shortName: 'Fat Man',
    yield: 21,
    yieldDisplay: '21 kt',
    yieldNote: 'Plutonium-239 implosion',
    country: 'USA',
    type: 'Implosion-type fission weapon',
    category: 'historical',
    description: 'Second nuclear weapon used in warfare (Nagasaki, 1945)',
    icon: '☢️',
    color: '#eab308',
    year: 1945,
    status: 'Retired',
    facts: [
      'August 9, 1945 - Nagasaki, Japan',
      'More powerful than Little Boy but caused fewer deaths',
      '74,000 deaths by end of 1945',
      'Used plutonium-239 core',
      'Design tested in Trinity test (July 16, 1945)'
    ],
    specifications: {
      length: '3.3 meters (10.8 ft)',
      diameter: '1.5 meters (5 ft)',
      weight: '4,670 kg (10,300 lb)',
      fissileMaterial: '6.2 kg plutonium-239',
      deliveryMethod: 'B-29 Superfortress bomber',
      design: 'Implosion-type'
    },
    history: 'Fat Man used an implosion design, where conventional explosives compressed a plutonium sphere to achieve critical mass. This design was more efficient than Little Boy and became the basis for most subsequent nuclear weapons.',
    effects: {
      fireball: '380 meters diameter',
      blastRadius: '1.8 km total destruction',
      thermalBurns: 'Up to 4 km',
      radiation: 'Acute effects within 1.8 km',
      fallout: 'Light (airburst over industrial area)'
    }
  },
  {
    id: 'b61',
    name: 'B61-12',
    shortName: 'B61-12',
    yield: 340,
    yieldDisplay: '340 kt',
    yieldNote: 'Dial-a-yield: 0.3-340 kt',
    country: 'USA',
    type: 'Thermonuclear tactical weapon',
    category: 'modern',
    description: 'Modern tactical nuclear bomb with precision guidance',
    icon: '🔥',
    color: '#f97316',
    year: 2021,
    status: 'Active deployment',
    facts: [
      'Entered service: 2021 (full production)',
      'Dial-a-yield: selectable from 0.3 to 340 kilotons',
      'First nuclear bomb with precision guidance (GPS/INS)',
      'Can penetrate earth/concrete before detonation',
      'Life-extension program for aging B61 stockpile',
      'Unit cost: ~$28 million (most expensive bomb ever)'
    ],
    specifications: {
      length: '3.56 meters (11.7 ft)',
      diameter: '33 cm (13 in)',
      weight: '320-330 kg (700-725 lb)',
      guidance: 'GPS + Inertial Navigation',
      accuracy: 'CEP <30 meters',
      penetration: 'Can penetrate several meters of concrete',
      platforms: 'F-15E, F-16, F-35A, B-2, B-21, Tornado'
    },
    history: 'The B61-12 is a modernized version of the B61 family that dates back to the 1960s. It consolidates four older B61 variants into one flexible weapon. The addition of precision guidance makes it 2-3 times more effective against hardened targets than the older unguided versions.',
    strategicRole: 'Tactical nuclear weapon for battlefield use, bunker destruction, and tactical targets. Deployed in NATO countries as part of nuclear sharing agreements.',
    effects: {
      fireball: '850 meters diameter',
      blastRadius: '4.5 km heavy damage',
      thermalBurns: 'Up to 12 km',
      radiation: 'Lethal within 3 km',
      craterDepth: 'Up to 60 meters (ground burst)'
    }
  },
  {
    id: 'w88',
    name: 'W88 Trident II',
    shortName: 'W88',
    yield: 475,
    yieldDisplay: '475 kt',
    yieldNote: 'Thermonuclear',
    country: 'USA',
    type: 'Submarine-launched ballistic missile warhead',
    category: 'modern',
    description: 'Most advanced US nuclear warhead, MIRV-capable',
    icon: '🚀',
    color: '#f97316',
    year: 1989,
    status: 'Active',
    facts: [
      'Used on Trident II (D5) submarine-launched missiles',
      'MIRV: Each missile carries 4-8 warheads',
      'Ellipsoidal primary design (more efficient)',
      'Most advanced US warhead ever deployed',
      'Accuracy: ~90-120 meter CEP',
      'Can hit targets 12,000+ km away'
    ],
    specifications: {
      weight: '~360 kg (800 lb)',
      length: '~1.7 meters',
      diameter: '~55 cm',
      reentryVehicle: 'Mark 5 (high ballistic coefficient)',
      platforms: 'Ohio-class submarines (Trident II)',
      yieldToWeightRatio: 'Highest in US arsenal'
    },
    history: 'The W88 represents the peak of US nuclear weapons design. Its unique "peanut" shape (ellipsoidal primary) was discovered through Chinese espionage (allegedly), leading to the Wen Ho Lee case. It provides maximum yield in minimum volume.',
    strategicRole: 'Strategic deterrence. Targets: hardened missile silos, command centers, leadership bunkers. Part of the nuclear triad sea-based leg.',
    effects: {
      fireball: '980 meters diameter',
      blastRadius: '5.2 km heavy damage',
      thermalBurns: 'Up to 14 km',
      radiation: 'Lethal within 3.5 km',
      emp: 'Affects electronics within 8 km'
    }
  },
  {
    id: 'shahab3',
    name: 'Shahab-3 (Estimated)',
    shortName: 'Shahab-3',
    yield: 1000,
    yieldDisplay: '1,000 kt',
    yieldNote: '~1 Megaton (estimated)',
    country: 'Iran',
    type: 'Medium-range ballistic missile',
    category: 'hypothetical',
    description: 'Iran longest-range missile (potential nuclear capability)',
    icon: '🎯',
    color: '#ef4444',
    year: 2003,
    status: 'Operational (conventional)',
    facts: [
      'Range: 1,300 km (can reach Israel, Saudi Arabia, Turkey)',
      'Based on North Korean Nodong-1 design',
      'Currently carries conventional warheads only',
      'Iran primary strategic deterrent',
      'Multiple variants: Shahab-3A, 3B, 3C with improved accuracy'
    ],
    specifications: {
      length: '15.9-16.5 meters',
      diameter: '1.25-1.38 meters',
      weight: '17,410 kg',
      range: '1,300-2,000 km (variant dependent)',
      guidance: 'Inertial (limited accuracy ~500m CEP)',
      payload: '760-987 kg conventional',
      propulsion: 'Liquid fuel (inhibited red fuming nitric acid)'
    },
    history: 'The Shahab-3 ("Meteor" in Persian) is Iran first medium-range ballistic missile. While currently armed with conventional explosives, it represents the delivery vehicle Iran would likely use if it developed nuclear weapons. The missile is reverse-engineered from North Korea Nodong-1.',
    strategicRole: 'Regional deterrence. Targets would include: Israeli cities, Saudi oil facilities, US bases in Gulf states, Turkish NATO installations.',
    note: 'This simulation uses an estimated 1 MT yield for educational purposes. Iran currently has no confirmed nuclear weapons, and all nuclear facilities are under IAEA monitoring.',
    effects: {
      fireball: '1.4 km diameter',
      blastRadius: '7.2 km heavy damage',
      thermalBurns: 'Up to 19 km',
      radiation: 'Lethal within 4.8 km',
      fallout: 'Severe downwind contamination (ground burst)'
    }
  },
  {
    id: 'topol',
    name: 'Topol-M (RS-12M2)',
    shortName: 'Topol-M',
    yield: 800,
    yieldDisplay: '800 kt',
    yieldNote: 'Single warhead (MIRV capable)',
    country: 'Russia',
    type: 'Intercontinental ballistic missile (ICBM)',
    category: 'modern',
    description: 'Russian mobile ICBM with countermeasures',
    icon: '🎯',
    color: '#dc2626',
    year: 1997,
    status: 'Active',
    facts: [
      'Range: 11,000 km (can reach any target on Earth)',
      'Top speed: 7 km/s (Mach 20+)',
      'Can carry 4-6 MIRV warheads',
      'Road-mobile launcher (hard to target)',
      'Countermeasures against missile defense',
      '95% effectiveness rating (Russian claim)'
    ],
    specifications: {
      length: '22.7 meters',
      diameter: '1.9 meters',
      weight: '47,200 kg',
      range: '11,000 km',
      guidance: 'Astro-inertial with GLONASS updates',
      accuracy: '200-350 meters CEP',
      propulsion: '3-stage solid fuel',
      launchPlatforms: 'Silos or MZKT-79221 mobile launcher'
    },
    history: 'The Topol-M (RT-2PM2) was designed to replace aging Soviet-era missiles. It was the first ICBM developed by Russia after the Soviet collapse. Its road-mobile variant can be moved anywhere on Russian territory, making it extremely difficult to target in a first strike.',
    strategicRole: 'Core of Russia nuclear deterrent. Targets: US ICBM silos, command centers, population centers. Can be launched within minutes of warning.',
    effects: {
      fireball: '1.25 km diameter',
      blastRadius: '6.5 km heavy damage',
      thermalBurns: 'Up to 17 km',
      radiation: 'Lethal within 4.3 km',
      emp: 'Disables unshielded electronics within 10 km'
    }
  },
  {
    id: 'sarmat',
    name: 'RS-28 Sarmat',
    shortName: 'Sarmat',
    yield: 800,
    yieldDisplay: '800 kt x 10',
    yieldNote: '10-15 MIRV warheads',
    country: 'Russia',
    type: 'Heavy ICBM (Satan 2)',
    category: 'modern',
    status: 'Entering service',
    description: 'Russia newest heavy ICBM replacing R-36M',
    icon: '☄️',
    color: '#7c3aed',
    year: 2022,
    facts: [
      'Payload: Up to 10 heavy or 15 light MIRV warheads',
      'Range: 18,000 km (can reach targets over South Pole)',
      'Can carry Avangard hypersonic glide vehicles',
      'Designed to replace R-36M "Satan"',
      'Can carry 50+ megatons total yield',
      'Entered service: September 2023'
    ],
    specifications: {
      length: '35.3 meters',
      diameter: '3.0 meters',
      weight: '208,100 kg',
      range: '18,000 km',
      payload: '10 tonnes',
      warheadOptions: '10x 800kt, 15x 150kt, or 24x lighter warheads',
      propulsion: 'Liquid fuel (first stage) + solid fuel (subsequent)'
    },
    history: 'The Sarmat (NATO: SS-X-30 Satan 2) is Russia newest super-heavy ICBM, designed to replace the Soviet-era R-36M. Its enormous payload capacity allows it to carry enough warheads to potentially wipe out an area the size of Texas or France in a single missile.',
    strategicRole: 'Strategic first-strike weapon. Can carry countermeasures, decoys, and hypersonic glide vehicles that can maneuver to avoid missile defense. Can attack over South Pole to bypass northern missile defenses.',
    effects: 'With full MIRV complement, one Sarmat missile can destroy: 10 major cities OR an entire country military infrastructure OR multiple states.',
    note: 'This simulation shows a single 800kt warhead. Actual Sarmat carries 10-15 of these.'
  },
  {
    id: 'tsar',
    name: 'Tsar Bomba (AN602)',
    shortName: 'Tsar Bomba',
    yield: 50000,
    yieldDisplay: '50,000 kt',
    yieldNote: '50 Megatons',
    country: 'USSR',
    type: 'Thermonuclear (hydrogen bomb)',
    category: 'historical',
    description: 'Largest nuclear weapon ever tested',
    icon: '💀',
    color: '#7c3aed',
    year: 1961,
    status: 'One-off test device',
    facts: [
      'Tested October 30, 1961 over Novaya Zemlya',
      'Originally designed for 100 MT (reduced to limit fallout)',
      'Fireball: 4.6 km diameter (visible 1,000 km away)',
      'Mushroom cloud reached 64 km altitude',
      'Shockwave circled Earth three times',
      'Windows broken 900 km away in Finland'
    ],
    specifications: {
      length: '8 meters (26 ft)',
      diameter: '2.1 meters (6.9 ft)',
      weight: '27,000 kg (60,000 lb)',
      designer: 'Sakharov, Khariton, Zernov',
      testLocation: 'Novaya Zemlya, Arctic Ocean',
      deliveryMethod: 'Modified Tu-95 bomber (specially adapted)',
      fissionComponent: 'Fast-fission U-238 tamper (reduced to slow for test)'
    },
    history: 'The Tsar Bomba ("King of Bombs") was the most powerful nuclear weapon ever created and tested. Developed during the Cold War as a demonstration of Soviet power, it was so large that the delivering Tu-95 bomber had to be modified with half its fuel removed just to take off. The bomb parachute gave the crew a 50% chance of survival - they did survive, but were reportedly given a 10-point survival chance rating.',
    strategicRole: 'Demonstration weapon only. Too large for practical military use. Designed to show USSR capability and terrify the West.',
    effects: {
      fireball: '4.6 km diameter',
      blastRadius: '35 km total destruction',
      thermalBurns: 'Third-degree burns at 100 km',
      structuralDamage: 'Houses destroyed 170 km away',
      mushroomCloud: '64 km tall (7 Mount Everests)',
      fallout: 'Global (if ground burst)',
      emp: 'Would disable electronics across a continent'
    },
    context: 'The 50 MT yield is 3,800 times more powerful than Little Boy. A full 100 MT version would have been 7,000 times Hiroshima. The test was reduced to 50 MT specifically to limit fallout - the uranium tamper was replaced with lead.'
  },
  {
    id: 'minuteman',
    name: 'W78 Minuteman III',
    shortName: 'W78',
    yield: 335,
    yieldDisplay: '335 kt',
    yieldNote: 'Thermonuclear',
    country: 'USA',
    type: 'ICBM warhead',
    category: 'modern',
    description: 'US land-based ICBM warhead',
    icon: '🚀',
    color: '#cc1a1a',
    year: 1979,
    status: 'Active',
    facts: [
      'Used on Minuteman III ICBMs',
      'Each missile carries 1-3 warheads (MIRV)',
      'Accuracy: ~120 meters CEP',
      '450 Minuteman III missiles on alert',
      'Launch control centers: 15 locations across US',
      'Can be launched within 30 minutes of order'
    ],
    specifications: {
      weight: '~320 kg',
      length: '~1.7 meters',
      diameter: '~55 cm',
      reentryVehicle: 'Mark 12A',
      platforms: 'Minuteman III missiles in silos',
      range: '13,000 km',
      guidance: 'Astro-inertial with GPS updates'
    },
    history: 'The W78-armed Minuteman III forms the land-based leg of the US nuclear triad. These missiles are in hardened silos across Montana, North Dakota, Colorado, Nebraska, and Wyoming. The system is on continuous alert, with launch crews working 24-hour shifts in underground control centers.',
    strategicRole: 'Counterforce targeting (enemy missiles, bases). Can also target cities. The 450 missiles represent ~800 warheads on alert at any time.',
    effects: {
      fireball: '850 meters diameter',
      blastRadius: '4.5 km heavy damage',
      thermalBurns: 'Up to 12 km',
      radiation: 'Lethal within 3 km',
      crater: '20 meters deep (hardened target burst)'
    }
  },
  {
    id: 'trident',
    name: 'W76-0/1/2',
    shortName: 'W76',
    yield: 100,
    yieldDisplay: '100 kt',
    yieldNote: 'Selectable: 8-100 kt',
    country: 'USA',
    type: 'Submarine-launched ballistic missile warhead',
    category: 'modern',
    description: 'Most numerous US warhead (low-yield option)',
    icon: '⚓',
    color: '#0ea5e9',
    year: 1978,
    status: 'Active',
    facts: [
      'Most numerous warhead in US arsenal (~1,500)',
      'W76-2 variant: 5-7 kt (low-yield option deployed 2020)',
      'Carried on Trident II missiles',
      '14 Ohio-class submarines carry 20 missiles each',
      'Each missile can carry 4-8 W76 warheads',
      'Invulnerable to first strike (stealth at sea)'
    ],
    specifications: {
      weight: '~164 kg',
      length: '~1.0 meter',
      diameter: '~45 cm',
      yieldOptions: '8 kt (tactical) to 100 kt (strategic)',
      reentryVehicle: 'Mark 4',
      platforms: 'Ohio-class submarines',
      guidance: 'Astro-inertial'
    },
    history: 'The W76 is the workhorse of the US nuclear fleet. The low-yield W76-2 variant (deployed 2020) is controversial - critics say it makes nuclear use more "thinkable," proponents say it provides a proportional response option.',
    strategicRole: 'Strategic deterrence. Low-yield version for "limited" nuclear war scenarios. Sea-based invulnerability makes them the most survivable leg of the triad.',
    effects: {
      fireball: '480 meters diameter',
      blastRadius: '2.8 km heavy damage',
      thermalBurns: 'Up to 8 km',
      radiation: 'Lethal within 1.8 km'
    }
  },
  {
    id: 'jericho',
    name: 'Jericho III (Est.)',
    shortName: 'Jericho III',
    yield: 1000,
    yieldDisplay: '1,000 kt',
    yieldNote: '~1 Megaton (estimated)',
    country: 'Israel',
    type: 'Intermediate-range ballistic missile',
    category: 'hypothetical',
    description: 'Israel long-range deterrent (estimated capability)',
    icon: '🛡️',
    color: '#06b6d4',
    year: 2008,
    status: 'Operational (conventional/nuclear ambiguous)',
    facts: [
      'Range: 4,800-6,500 km (can reach all of Middle East, Europe)',
      'Can carry conventional or nuclear warheads',
      'Israel maintains "deliberate ambiguity" on nuclear arsenal',
      'Estimated 90-400 nuclear weapons in Israeli stockpile',
      'Jericho III represents Israel second-strike capability',
      'Can target Iran, Pakistan (if threatened)'
    ],
    specifications: {
      length: '15.5-16.0 meters',
      diameter: '1.56 meters',
      weight: '29,000 kg',
      range: '4,800-6,500 km',
      guidance: 'Inertial + possibly GPS',
      payload: '750-1,300 kg',
      propulsion: '3-stage solid fuel'
    },
    history: 'Israel has never confirmed possessing nuclear weapons, maintaining a policy of "deliberate ambiguity." However, the Jericho missile series is widely believed to have nuclear capability. The Jericho III gives Israel the ability to strike anywhere in the Middle East and potentially Europe.',
    strategicRole: 'Regional deterrence and second-strike capability. Ensures Israel can retaliate even if struck first. Targets would include: Iranian nuclear facilities, Arab capitals, enemy missile sites.',
    note: 'Israel nuclear program is one of the world worst-kept secrets. Estimates suggest 90-400 weapons. This simulation uses 1 MT as an estimated strategic warhead yield.',
    effects: {
      fireball: '1.4 km diameter',
      blastRadius: '7.2 km heavy damage',
      thermalBurns: 'Up to 19 km',
      radiation: 'Lethal within 4.8 km'
    }
  }
];

export const getWarheadById = (id) => WARHEADS.find(w => w.id === id);

export const getDefaultWarhead = () => WARHEADS.find(w => w.id === 'shahab3');

export const getWarheadsByCategory = (category) => WARHEADS.filter(w => w.category === category);

export const CATEGORIES = {
  reference: { label: 'Reference (Non-nuclear)', color: '#f59e0b' },
  historical: { label: 'Historical Weapons', color: '#eab308' },
  modern: { label: 'Modern Arsenal', color: '#cc1a1a' },
  hypothetical: { label: 'Estimated/Regional', color: '#ef4444' }
};

/**
 * Blast radius calculations using standard nuclear scaling laws
 * Formulas based on Glasstone & Dolan "Effects of Nuclear Weapons"
 * 
 * @param {number} yieldKT - Yield in kilotons
 * @returns {Object} Blast radii in kilometers
 */
export const calculateBlastRadii = (yieldKT) => {
  const cubeRoot = Math.pow(yieldKT, 1/3);
  
  return {
    fireball: 0.1 * cubeRoot,
    heavy: 0.45 * cubeRoot,
    moderate: 1.5 * cubeRoot,
    radiation: 1.2 * Math.pow(yieldKT, 0.19),
    thermal: 4.5 * cubeRoot,
    light: 3.3 * cubeRoot
  };
};

/**
 * Calculate estimated casualties based on blast radius and population density
 */
export const calculateCasualties = (yieldKT, populationDensity = 5000) => {
  const radii = calculateBlastRadii(yieldKT);
  
  const fireballArea = Math.PI * Math.pow(radii.fireball, 2);
  const heavyArea = Math.PI * Math.pow(radii.heavy, 2);
  const moderateArea = Math.PI * Math.pow(radii.moderate, 2);
  const lightArea = Math.PI * Math.pow(radii.light, 2);
  
  const fireballFatalities = fireballArea * populationDensity;
  const heavyFatalities = heavyArea * populationDensity * 0.9;
  const moderateFatalities = moderateArea * populationDensity * 0.5;
  
  const totalFatalities = fireballFatalities + heavyFatalities + moderateFatalities;
  
  const moderateInjuries = moderateArea * populationDensity * 0.4;
  const lightInjuries = lightArea * populationDensity * 0.1;
  const totalInjuries = moderateInjuries + lightInjuries;
  
  const affected = Math.round(lightArea * populationDensity);
  
  return {
    fatalities: Math.round(totalFatalities),
    injuries: Math.round(totalInjuries),
    affected: affected,
    zones: {
      fireball: Math.round(fireballArea * populationDensity),
      heavy: Math.round(heavyArea * populationDensity),
      moderate: Math.round(moderateArea * populationDensity),
      light: Math.round(lightArea * populationDensity)
    }
  };
};

export const formatCasualties = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

export const getPopulationDensity = (city) => {
  if (city.population >= 10000000) return 20000;
  if (city.population >= 5000000) return 15000;
  if (city.population >= 1000000) return 10000;
  if (city.population >= 500000) return 7000;
  return 4000;
};

export default WARHEADS;

/**
 * NUCLEAR WARHEAD DATABASE
 * 
 * Weapon 2 - Viral Nuclear Strike Simulator
 * Growth Strategy: "See what a nuke would do to YOUR city"
 * 
 * Data sources:
 * - Yields from public nuclear weapons databases
 * - Blast radii calculated using standard scaling laws
 * - Historical yields from verified records
 */

export const WARHEADS = [
  {
    id: 'beirut',
    name: 'Beirut Blast',
    yield: 1.1,
    yieldDisplay: '1.1 kt',
    country: 'Accidental',
    type: 'Ammonium Nitrate',
    description: '2020 Beirut port explosion - for comparison',
    icon: '💥',
    color: '#f59e0b',
    facts: [
      'August 4, 2020',
      '2,750 tonnes of ammonium nitrate',
      'Damaged 77,000 apartments',
      'Killed 218 people'
    ]
  },
  {
    id: 'hiroshima',
    name: 'Little Boy',
    yield: 15,
    yieldDisplay: '15 kt',
    country: 'USA',
    type: 'Gun-type fission',
    description: 'Hiroshima, 1945 - Historical reference',
    icon: '☢️',
    color: '#eab308',
    facts: [
      'August 6, 1945',
      'Dropped on Hiroshima, Japan',
      'Killed ~80,000 instantly',
      'Uranium-235 core'
    ]
  },
  {
    id: 'b61',
    name: 'B61-12',
    yield: 340,
    yieldDisplay: '340 kt',
    country: 'USA',
    type: 'Thermonuclear',
    description: 'Modern tactical nuke, bunker buster',
    icon: '🔥',
    color: '#f97316',
    facts: [
      'Entered service: 2020s',
      'Dial-a-yield: 0.3-340 kt',
      'Can penetrate earth/concrete',
      'Primary NATO tactical weapon'
    ]
  },
  {
    id: 'shahab3',
    name: 'Shahab-3',
    yield: 1000,
    yieldDisplay: '1,000 kt',
    country: 'Iran',
    type: 'Thermonuclear (est.)',
    description: 'Iran\'s longest-range missile',
    icon: '🚀',
    color: '#ef4444',
    facts: [
      'Range: 1,300 km',
      'Based on North Korean Nodong',
      'Can reach Israel, Turkey, Saudi',
      'Multiple variants exist'
    ]
  },
  {
    id: 'topol',
    name: 'Topol-M',
    yield: 800,
    yieldDisplay: '800 kt',
    country: 'Russia',
    type: 'ICBM',
    description: 'Russian mobile ICBM',
    icon: '🎯',
    color: '#dc2626',
    facts: [
      'Range: 11,000 km',
      'Can reach any target on Earth',
      'MIRV capable',
      'Top speed: 7 km/s'
    ]
  },
  {
    id: 'w88',
    name: 'W88',
    yield: 475,
    yieldDisplay: '475 kt',
    country: 'USA',
    type: 'Thermonuclear',
    description: 'US Trident missile warhead',
    icon: '💣',
    color: '#f97316',
    facts: [
      'Used on Trident II missiles',
      'MIRV: Multiple warheads per missile',
      'Ellipsoidal primary design',
      'Most advanced US warhead'
    ]
  },
  {
    id: 'tsar',
    name: 'Tsar Bomba',
    yield: 50000,
    yieldDisplay: '50,000 kt',
    country: 'USSR',
    type: 'Thermonuclear',
    description: 'Largest nuclear weapon ever tested',
    icon: '💀',
    color: '#7c3aed',
    facts: [
      'Tested October 30, 1961',
      'Originally designed for 100 MT',
      'Fireball visible 1,000 km away',
      'Mushroom cloud reached 64 km'
    ]
  }
];

export const getWarheadById = (id) => WARHEADS.find(w => w.id === id);

export const getDefaultWarhead = () => WARHEADS.find(w => w.id === 'shahab3');

/**
 * Blast radius calculations using standard nuclear scaling laws
 * Formulas based on Glasstone & Dolan "Effects of Nuclear Weapons"
 * 
 * @param {number} yieldKT - Yield in kilotons
 * @returns {Object} Blast radii in kilometers
 */
export const calculateBlastRadii = (yieldKT) => {
  // Cube root scaling for blast effects
  const cubeRoot = Math.pow(yieldKT, 1/3);
  
  return {
    // Fireball: Everything vaporized instantly
    // Formula: ~0.1 * YIELD^(1/3) km
    fireball: 0.1 * cubeRoot,
    
    // Air blast (20 psi): Severe destruction, reinforced concrete buildings destroyed
    // Formula: ~0.45 * YIELD^(1/3) km  
    heavy: 0.45 * cubeRoot,
    
    // Air blast (5 psi): Most residential buildings collapse
    // Formula: ~1.5 * YIELD^(1/3) km
    moderate: 1.5 * cubeRoot,
    
    // Radiation (500 rem): Lethal dose without medical treatment
    // Formula varies but ~1.2 * YIELD^(1/3) km for 500 rem
    radiation: 1.2 * Math.pow(yieldKT, 0.19),
    
    // Thermal radiation (3rd degree burns)
    // Formula: ~4.5 * YIELD^(1/3) km
    thermal: 4.5 * cubeRoot,
    
    // Air blast (1 psi): Light damage, windows break
    // Formula: ~3.3 * YIELD^(1/3) km
    light: 3.3 * cubeRoot
  };
};

/**
 * Calculate estimated casualties based on blast radius and population density
 * Uses simplified models for viral impact (educational purposes)
 * 
 * @param {number} yieldKT - Yield in kilotons
 * @param {number} populationDensity - People per square km
 * @returns {Object} Casualty estimates
 */
export const calculateCasualties = (yieldKT, populationDensity = 5000) => {
  const radii = calculateBlastRadii(yieldKT);
  
  // Calculate affected areas
  const fireballArea = Math.PI * Math.pow(radii.fireball, 2);
  const heavyArea = Math.PI * Math.pow(radii.heavy, 2);
  const moderateArea = Math.PI * Math.pow(radii.moderate, 2);
  const lightArea = Math.PI * Math.pow(radii.light, 2);
  
  // Fatality rates by zone
  // Fireball: 100% fatalities
  // Heavy damage: 90% fatalities  
  // Moderate damage: 50% fatalities
  // Light damage: 10% injuries
  
  const fireballFatalities = fireballArea * populationDensity;
  const heavyFatalities = heavyArea * populationDensity * 0.9;
  const moderateFatalities = moderateArea * populationDensity * 0.5;
  
  const totalFatalities = fireballFatalities + heavyFatalities + moderateFatalities;
  
  // Injuries in moderate and light zones
  const moderateInjuries = moderateArea * populationDensity * 0.4;
  const lightInjuries = lightArea * populationDensity * 0.1;
  const totalInjuries = moderateInjuries + lightInjuries;
  
  // Affected population (light damage zone)
  const affected = Math.round(lightArea * populationDensity);
  
  return {
    fatalities: Math.round(totalFatalities),
    injuries: Math.round(totalInjuries),
    affected: affected,
    // Breakdown by zone
    zones: {
      fireball: Math.round(fireballArea * populationDensity),
      heavy: Math.round(heavyArea * populationDensity),
      moderate: Math.round(moderateArea * populationDensity),
      light: Math.round(lightArea * populationDensity)
    }
  };
};

/**
 * Format large numbers for display
 */
export const formatCasualties = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

/**
 * Get population density based on city type
 */
export const getPopulationDensity = (city) => {
  if (city.population >= 10000000) return 20000; // Mega city
  if (city.population >= 5000000) return 15000;  // Major city
  if (city.population >= 1000000) return 10000;  // Large city
  if (city.population >= 500000) return 7000;    // Medium city
  return 4000; // Small city
};

export default WARHEADS;

/**
 * NUCLEAR BLAST CALCULATIONS
 * 
 * Standard formulas from:
 * - Glasstone & Dolan "Effects of Nuclear Weapons" (1977)
 * - Brode "Blast Wave from a Nuclear Explosion" (1968)
 * 
 * All formulas use yield in kilotons (kt)
 * Distances returned in kilometers
 */

/**
 * Calculate blast radii for all damage zones
 * Uses cube-root scaling law for blast effects
 */
export const calculateBlastRadii = (yieldKT) => {
  // Validate input
  const yield_kt = Math.max(0.001, yieldKT);
  const cubeRoot = Math.pow(yield_kt, 1/3);
  
  return {
    // Fireball radius (everything vaporized)
    // Formula: 0.1 * YIELD^(1/3) km
    fireball: 0.1 * cubeRoot,
    
    // 20 psi overpressure (severe destruction)
    // Reinforced concrete buildings destroyed
    // Formula: 0.45 * YIELD^(1/3) km
    heavy: 0.45 * cubeRoot,
    
    // 5 psi overpressure (moderate destruction)
    // Most residential buildings collapse
    // Formula: 1.5 * YIELD^(1/3) km
    moderate: 1.5 * cubeRoot,
    
    // 1 psi overpressure (light damage)
    // Windows break, some structural damage
    // Formula: 3.3 * YIELD^(1/3) km
    light: 3.3 * cubeRoot,
    
    // Thermal radiation radius (3rd degree burns)
    // Formula: 4.5 * YIELD^(1/3) km
    thermal: 4.5 * cubeRoot,
    
    // Ionizing radiation radius (500 rem, lethal)
    // Formula varies: 1.2 * YIELD^0.19 km
    // Note: For yields > 10kt, blast kills more than radiation
    radiation: 1.2 * Math.pow(yield_kt, 0.19),
    
    // Electromagnetic pulse (EMP) effects
    // High-altitude burst affects much larger area
    // Formula: ~2.5 * YIELD^(1/3) km (line-of-sight limited)
    emp: 2.5 * cubeRoot
  };
};

/**
 * Calculate casualty estimates based on population density
 * Uses simplified models for educational/viral impact
 * 
 * @param {number} yieldKT - Yield in kilotons
 * @param {number} populationDensity - People per square km
 * @returns {Object} Detailed casualty breakdown
 */
export const calculateCasualties = (yieldKT, populationDensity = 5000) => {
  const radii = calculateBlastRadii(yieldKT);
  
  // Calculate zone areas (km²)
  const zones = {
    fireball: Math.PI * Math.pow(radii.fireball, 2),
    heavy: Math.PI * (Math.pow(radii.heavy, 2) - Math.pow(radii.fireball, 2)),
    moderate: Math.PI * (Math.pow(radii.moderate, 2) - Math.pow(radii.heavy, 2)),
    light: Math.PI * (Math.pow(radii.light, 2) - Math.pow(radii.moderate, 2))
  };
  
  // Calculate affected populations by zone
  const populations = {
    fireball: Math.round(zones.fireball * populationDensity),
    heavy: Math.round(zones.heavy * populationDensity),
    moderate: Math.round(zones.moderate * populationDensity),
    light: Math.round(zones.light * populationDensity)
  };
  
  // Fatality rates by zone (based on historical data)
  // Fireball: 100% immediate vaporization
  // Heavy damage (20 psi): 90% fatalities from blast/heat
  // Moderate damage (5 psi): 50% fatalities, 40% injured
  // Light damage (1 psi): 10% injuries
  
  const fatalitiesByZone = {
    fireball: populations.fireball,
    heavy: Math.round(populations.heavy * 0.9),
    moderate: Math.round(populations.moderate * 0.5)
  };
  
  const injuriesByZone = {
    moderate: Math.round(populations.moderate * 0.4),
    light: Math.round(populations.light * 0.1)
  };
  
  const totalFatalities = Object.values(fatalitiesByZone).reduce((a, b) => a + b, 0);
  const totalInjuries = Object.values(injuriesByZone).reduce((a, b) => a + b, 0);
  const totalAffected = Object.values(populations).reduce((a, b) => a + b, 0);
  
  return {
    fatalities: totalFatalities,
    injuries: totalInjuries,
    affected: totalAffected,
    zones: {
      fireball: {
        population: populations.fireball,
        fatalities: fatalitiesByZone.fireball,
        injuries: 0
      },
      heavy: {
        population: populations.heavy,
        fatalities: fatalitiesByZone.heavy,
        injuries: Math.round(populations.heavy * 0.1)
      },
      moderate: {
        population: populations.moderate,
        fatalities: fatalitiesByZone.moderate,
        injuries: injuriesByZone.moderate
      },
      light: {
        population: populations.light,
        fatalities: 0,
        injuries: injuriesByZone.light
      }
    }
  };
};

/**
 * Get descriptive impact text for a casualty count
 */
export const getImpactDescription = (fatalities) => {
  if (fatalities >= 1000000) {
    return "Catastrophic - City essentially destroyed";
  }
  if (fatalities >= 500000) {
    return "Catastrophic - Major city devastated";
  }
  if (fatalities >= 100000) {
    return "Disastrous - Mass casualties, infrastructure destroyed";
  }
  if (fatalities >= 50000) {
    return "Severe - Major destruction, medical system overwhelmed";
  }
  if (fatalities >= 10000) {
    return "Serious - Significant casualties and damage";
  }
  if (fatalities >= 1000) {
    return "Moderate - Localized destruction";
  }
  return "Limited - Targeted destruction";
};

/**
 * Format large numbers for display
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

/**
 * Format number with commas
 */
export const formatWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Get population density based on city size
 * Used for cities where exact density isn't known
 */
export const estimatePopulationDensity = (population) => {
  if (population >= 10000000) return 20000; // Mega city (Tokyo, Delhi)
  if (population >= 5000000) return 15000;  // Major city
  if (population >= 1000000) return 10000;  // Large city
  if (population >= 500000) return 7000;    // Medium city
  if (population >= 100000) return 5000;    // Small city
  return 3000; // Town/small city
};

/**
 * Convert kilometers to miles
 */
export const kmToMiles = (km) => km * 0.621371;

/**
 * Get comparative reference for blast radius
 */
export const getRadiusComparison = (radiusKm) => {
  const comparisons = [
    { threshold: 0.5, text: "Central Park, NYC" },
    { threshold: 1, text: "Manhattan width" },
    { threshold: 2, text: "Disney World" },
    { threshold: 5, text: "San Francisco" },
    { threshold: 10, text: "Greater London" },
    { threshold: 20, text: "New York City" },
    { threshold: 50, text: "Rhode Island" },
    { threshold: 100, text: "Connecticut" }
  ];
  
  for (const comp of comparisons) {
    if (radiusKm <= comp.threshold) {
      return comp.text;
    }
  }
  return "Multiple states";
};

/**
 * Generate share text for social media - Educational framing
 */
export const generateShareText = (warhead, city, casualties) => {
  const yieldText = warhead.yield >= 1000 
    ? `${(warhead.yield / 1000).toFixed(0)} MT` 
    : `${warhead.yield} KT`;
  
  const fatalityText = formatNumber(casualties.fatalities);
  const injuryText = formatNumber(casualties.injuries);
  
  return `Educational simulation: ${warhead.name} (${yieldText}) effects on ${city.name}.

💀 ${fatalityText} estimated fatalities
🏥 ${injuryText} estimated injuries

Nuclear weapons have devastating humanitarian impact. We must prevent nuclear war.

Learn more:`;
};

export default {
  calculateBlastRadii,
  calculateCasualties,
  getImpactDescription,
  formatNumber,
  formatWithCommas,
  estimatePopulationDensity,
  kmToMiles,
  getRadiusComparison,
  generateShareText
};

/**
 * GLOBAL CITIES DATABASE
 * 
 * Weapon 2 - Viral Nuclear Strike Simulator
 * Curated list of major cities for maximum viral potential
 * 
 * Sources: UN World Urbanization Prospects, national statistics
 */

export const CITIES = [
  // United States - Major cities
  { name: 'New York', country: 'USA', population: 8336000, lat: 40.7128, lng: -74.0060, region: 'North America' },
  { name: 'Los Angeles', country: 'USA', population: 3898000, lat: 34.0522, lng: -118.2437, region: 'North America' },
  { name: 'Chicago', country: 'USA', population: 2746000, lat: 41.8781, lng: -87.6298, region: 'North America' },
  { name: 'Houston', country: 'USA', population: 2304000, lat: 29.7604, lng: -95.3698, region: 'North America' },
  { name: 'Phoenix', country: 'USA', population: 1690000, lat: 33.4484, lng: -112.0740, region: 'North America' },
  { name: 'Philadelphia', country: 'USA', population: 1603000, lat: 39.9526, lng: -75.1652, region: 'North America' },
  { name: 'San Antonio', country: 'USA', population: 1547000, lat: 29.4241, lng: -98.4936, region: 'North America' },
  { name: 'San Diego', country: 'USA', population: 1388000, lat: 32.7157, lng: -117.1611, region: 'North America' },
  { name: 'Dallas', country: 'USA', population: 1304000, lat: 32.7767, lng: -96.7970, region: 'North America' },
  { name: 'San Jose', country: 'USA', population: 1035000, lat: 37.3382, lng: -121.8863, region: 'North America' },
  { name: 'Washington DC', country: 'USA', population: 712000, lat: 38.9072, lng: -77.0369, region: 'North America' },
  { name: 'Boston', country: 'USA', population: 675000, lat: 42.3601, lng: -71.0589, region: 'North America' },
  { name: 'Seattle', country: 'USA', population: 737000, lat: 47.6062, lng: -122.3321, region: 'North America' },
  { name: 'Miami', country: 'USA', population: 442000, lat: 25.7617, lng: -80.1918, region: 'North America' },
  { name: 'San Francisco', country: 'USA', population: 875000, lat: 37.7749, lng: -122.4194, region: 'North America' },
  
  // Iran - Conflict focus
  { name: 'Tehran', country: 'Iran', population: 8694000, lat: 35.6892, lng: 51.3890, region: 'Middle East' },
  { name: 'Mashhad', country: 'Iran', population: 3076000, lat: 36.2972, lng: 59.6067, region: 'Middle East' },
  { name: 'Isfahan', country: 'Iran', population: 1961000, lat: 32.6539, lng: 51.6660, region: 'Middle East' },
  { name: 'Karaj', country: 'Iran', population: 1591000, lat: 35.8327, lng: 50.9915, region: 'Middle East' },
  { name: 'Shiraz', country: 'Iran', population: 1565000, lat: 29.5926, lng: 52.5836, region: 'Middle East' },
  { name: 'Tabriz', country: 'Iran', population: 1559000, lat: 38.0962, lng: 46.2738, region: 'Middle East' },
  { name: 'Qom', country: 'Iran', population: 1201000, lat: 34.6399, lng: 50.8759, region: 'Middle East' },
  { name: 'Ahvaz', country: 'Iran', population: 1184000, lat: 31.3183, lng: 48.6706, region: 'Middle East' },
  { name: 'Bandar Abbas', country: 'Iran', population: 527000, lat: 27.1833, lng: 56.2667, region: 'Middle East' },
  
  // Israel - Conflict focus
  { name: 'Tel Aviv', country: 'Israel', population: 460600, lat: 32.0853, lng: 34.7818, region: 'Middle East' },
  { name: 'Jerusalem', country: 'Israel', population: 919400, lat: 31.7683, lng: 35.2137, region: 'Middle East' },
  { name: 'Haifa', country: 'Israel', population: 282800, lat: 32.7940, lng: 34.9896, region: 'Middle East' },
  
  // Middle East
  { name: 'Istanbul', country: 'Turkey', population: 15560000, lat: 41.0082, lng: 28.9784, region: 'Middle East' },
  { name: 'Baghdad', country: 'Iraq', population: 7181000, lat: 33.3152, lng: 44.3661, region: 'Middle East' },
  { name: 'Riyadh', country: 'Saudi Arabia', population: 7466000, lat: 24.7136, lng: 46.6753, region: 'Middle East' },
  { name: 'Dubai', country: 'UAE', population: 3331000, lat: 25.2048, lng: 55.2708, region: 'Middle East' },
  { name: 'Kuwait City', country: 'Kuwait', population: 4200000, lat: 29.3759, lng: 47.9774, region: 'Middle East' },
  { name: 'Doha', country: 'Qatar', population: 1180000, lat: 25.2854, lng: 51.5310, region: 'Middle East' },
  { name: 'Beirut', country: 'Lebanon', population: 361000, lat: 33.8938, lng: 35.5018, region: 'Middle East' },
  { name: 'Amman', country: 'Jordan', population: 4007000, lat: 31.9454, lng: 35.9284, region: 'Middle East' },
  { name: 'Damascus', country: 'Syria', population: 2546000, lat: 33.5138, lng: 36.2765, region: 'Middle East' },
  { name: 'Muscat', country: 'Oman', population: 1421000, lat: 23.5880, lng: 58.3829, region: 'Middle East' },
  { name: 'Sanaa', country: 'Yemen', population: 2957000, lat: 15.3694, lng: 44.1910, region: 'Middle East' },
  { name: 'Abu Dhabi', country: 'UAE', population: 1512000, lat: 24.4539, lng: 54.3773, region: 'Middle East' },
  
  // Europe
  { name: 'London', country: 'UK', population: 8982000, lat: 51.5074, lng: -0.1278, region: 'Europe' },
  { name: 'Paris', country: 'France', population: 2161000, lat: 48.8566, lng: 2.3522, region: 'Europe' },
  { name: 'Berlin', country: 'Germany', population: 3645000, lat: 52.5200, lng: 13.4050, region: 'Europe' },
  { name: 'Madrid', country: 'Spain', population: 3223000, lat: 40.4168, lng: -3.7038, region: 'Europe' },
  { name: 'Rome', country: 'Italy', population: 2873000, lat: 41.9028, lng: 12.4964, region: 'Europe' },
  { name: 'Moscow', country: 'Russia', population: 12538000, lat: 55.7558, lng: 37.6173, region: 'Europe' },
  { name: 'Vienna', country: 'Austria', population: 1911000, lat: 48.2082, lng: 16.3738, region: 'Europe' },
  { name: 'Warsaw', country: 'Poland', population: 1791000, lat: 52.2297, lng: 21.0122, region: 'Europe' },
  { name: 'Kyiv', country: 'Ukraine', population: 2958000, lat: 50.4501, lng: 30.5234, region: 'Europe' },
  { name: 'Brussels', country: 'Belgium', population: 185000, lat: 50.8476, lng: 4.3572, region: 'Europe' },
  { name: 'Amsterdam', country: 'Netherlands', population: 872000, lat: 52.3676, lng: 4.9041, region: 'Europe' },
  { name: 'Stockholm', country: 'Sweden', population: 975000, lat: 59.3293, lng: 18.0686, region: 'Europe' },
  { name: 'Athens', country: 'Greece', population: 664000, lat: 37.9838, lng: 23.7275, region: 'Europe' },
  
  // Asia
  { name: 'Tokyo', country: 'Japan', population: 13960000, lat: 35.6762, lng: 139.6503, region: 'Asia' },
  { name: 'Delhi', country: 'India', population: 32534000, lat: 28.7041, lng: 77.1025, region: 'Asia' },
  { name: 'Shanghai', country: 'China', population: 29210000, lat: 31.2304, lng: 121.4737, region: 'Asia' },
  { name: 'Mumbai', country: 'India', population: 20411000, lat: 19.0760, lng: 72.8777, region: 'Asia' },
  { name: 'Beijing', country: 'China', population: 21540000, lat: 39.9042, lng: 116.4074, region: 'Asia' },
  { name: 'Dhaka', country: 'Bangladesh', population: 23209000, lat: 23.8103, lng: 90.4125, region: 'Asia' },
  { name: 'Osaka', country: 'Japan', population: 19013000, lat: 34.6937, lng: 135.5023, region: 'Asia' },
  { name: 'Karachi', country: 'Pakistan', population: 16051000, lat: 24.8607, lng: 67.0011, region: 'Asia' },
  { name: 'Chongqing', country: 'China', population: 17380000, lat: 29.5630, lng: 106.5516, region: 'Asia' },
  { name: 'Jakarta', country: 'Indonesia', population: 11249000, lat: -6.2088, lng: 106.8456, region: 'Asia' },
  { name: 'Manila', country: 'Philippines', population: 13923000, lat: 14.5995, lng: 120.9842, region: 'Asia' },
  { name: 'Seoul', country: 'South Korea', population: 9963000, lat: 37.5665, lng: 126.9780, region: 'Asia' },
  { name: 'Bangkok', country: 'Thailand', population: 10539000, lat: 13.7563, lng: 100.5018, region: 'Asia' },
  { name: 'Singapore', country: 'Singapore', population: 5850000, lat: 1.3521, lng: 103.8198, region: 'Asia' },
  { name: 'Kuala Lumpur', country: 'Malaysia', population: 8100000, lat: 3.1390, lng: 101.6869, region: 'Asia' },
  { name: 'Hanoi', country: 'Vietnam', population: 5100000, lat: 21.0278, lng: 105.8342, region: 'Asia' },
  { name: 'Taipei', country: 'Taiwan', population: 2640000, lat: 25.0330, lng: 121.5654, region: 'Asia' },
  { name: 'Hong Kong', country: 'China', population: 7482000, lat: 22.3193, lng: 114.1694, region: 'Asia' },
  { name: 'Lahore', country: 'Pakistan', population: 13628000, lat: 31.5204, lng: 74.3587, region: 'Asia' },
  { name: 'Pyongyang', country: 'North Korea', population: 2870000, lat: 39.0392, lng: 125.7625, region: 'Asia' },
  
  // South America
  { name: 'São Paulo', country: 'Brazil', population: 12352000, lat: -23.5505, lng: -46.6333, region: 'South America' },
  { name: 'Lima', country: 'Peru', population: 11045000, lat: -12.0464, lng: -77.0428, region: 'South America' },
  { name: 'Bogotá', country: 'Colombia', population: 11167000, lat: 4.7110, lng: -74.0721, region: 'South America' },
  { name: 'Rio de Janeiro', country: 'Brazil', population: 6751000, lat: -22.9068, lng: -43.1729, region: 'South America' },
  { name: 'Santiago', country: 'Chile', population: 7113000, lat: -33.4489, lng: -70.6693, region: 'South America' },
  { name: 'Buenos Aires', country: 'Argentina', population: 15180000, lat: -34.6037, lng: -58.3816, region: 'South America' },
  { name: 'Caracas', country: 'Venezuela', population: 2891000, lat: 10.4806, lng: -66.9036, region: 'South America' },
  
  // Africa
  { name: 'Cairo', country: 'Egypt', population: 21322000, lat: 30.0444, lng: 31.2357, region: 'Africa' },
  { name: 'Lagos', country: 'Nigeria', population: 14862000, lat: 6.5244, lng: 3.3792, region: 'Africa' },
  { name: 'Kinshasa', country: 'DRC', population: 16317000, lat: -4.4419, lng: 15.2663, region: 'Africa' },
  { name: 'Johannesburg', country: 'South Africa', population: 6058000, lat: -26.2041, lng: 28.0473, region: 'Africa' },
  { name: 'Nairobi', country: 'Kenya', population: 5545000, lat: -1.2921, lng: 36.8219, region: 'Africa' },
  { name: 'Casablanca', country: 'Morocco', population: 3715000, lat: 33.5731, lng: -7.5898, region: 'Africa' },
  { name: 'Cape Town', country: 'South Africa', population: 4710000, lat: -33.9249, lng: 18.4241, region: 'Africa' },
  { name: 'Addis Ababa', country: 'Ethiopia', population: 5080000, lat: 9.1450, lng: 38.7000, region: 'Africa' },
  
  // Oceania
  { name: 'Sydney', country: 'Australia', population: 5312000, lat: -33.8688, lng: 151.2093, region: 'Oceania' },
  { name: 'Melbourne', country: 'Australia', population: 5078000, lat: -37.8136, lng: 144.9631, region: 'Oceania' },
  { name: 'Auckland', country: 'New Zealand', population: 1657000, lat: -36.8485, lng: 174.7633, region: 'Oceania' },
  { name: 'Brisbane', country: 'Australia', population: 2569000, lat: -27.4698, lng: 153.0251, region: 'Oceania' },
];

// Sort by population for "featured" cities
export const FEATURED_CITIES = CITIES
  .sort((a, b) => b.population - a.population)
  .slice(0, 20);

// Cities grouped by region
export const CITIES_BY_REGION = CITIES.reduce((acc, city) => {
  if (!acc[city.region]) acc[city.region] = [];
  acc[city.region].push(city);
  return acc;
}, {});

// Search cities by name
export const searchCities = (query) => {
  const lowerQuery = query.toLowerCase();
  return CITIES.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

// Get city by name
export const getCityByName = (name) => CITIES.find(city => city.name === name);

// Default city
export const getDefaultCity = () => CITIES.find(city => city.name === 'New York');

export default CITIES;

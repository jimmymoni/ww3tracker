/**
 * Location Service - Dynamic geocoding for conflict monitoring
 * Provides coordinates for any location mentioned in news
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache file for discovered locations
const CACHE_FILE = path.join(__dirname, '../data/locations-cache.json');

// Comprehensive Middle East location database
// Coordinates for major cities, bases, and strategic locations
const LOCATION_DATABASE = {
  // Iran - Major cities
  'tehran': { lat: 35.6892, lng: 51.3890, country: 'Iran' },
  'isfahan': { lat: 32.6539, lng: 51.6660, country: 'Iran' },
  'mashhad': { lat: 36.2605, lng: 59.6168, country: 'Iran' },
  'tabriz': { lat: 38.0962, lng: 46.2738, country: 'Iran' },
  'shiraz': { lat: 29.5926, lng: 52.5836, country: 'Iran' },
  'ahvaz': { lat: 31.3183, lng: 48.6706, country: 'Iran' },
  'qom': { lat: 34.6401, lng: 50.8764, country: 'Iran' },
  'kermanshah': { lat: 34.3277, lng: 47.0778, country: 'Iran' },
  'rasht': { lat: 37.2808, lng: 49.5831, country: 'Iran' },
  'zahedan': { lat: 29.4963, lng: 60.8629, country: 'Iran' },
  'kerman': { lat: 30.2839, lng: 57.0834, country: 'Iran' },
  'yazd': { lat: 31.8974, lng: 54.3560, country: 'Iran' },
  'ardabil': { lat: 38.2465, lng: 48.2950, country: 'Iran' },
  'bandar abbas': { lat: 27.1833, lng: 56.2666, country: 'Iran' },
  'arak': { lat: 34.0949, lng: 49.6957, country: 'Iran' },
  'sari': { lat: 36.5633, lng: 53.0601, country: 'Iran' },
  'gorgan': { lat: 36.8416, lng: 54.4433, country: 'Iran' },
  'qazvin': { lat: 36.2797, lng: 50.0049, country: 'Iran' },
  'sanandaj': { lat: 35.3092, lng: 46.9989, country: 'Iran' },
  'ilam': { lat: 33.6367, lng: 46.4227, country: 'Iran' },
  'bushehr': { lat: 28.9684, lng: 50.8385, country: 'Iran' },
  
  // Iran - Strategic locations
  'natanz': { lat: 33.9061, lng: 51.7198, country: 'Iran' },
  'kashan': { lat: 33.9850, lng: 51.4100, country: 'Iran' },
  'hamadan': { lat: 34.7983, lng: 48.5148, country: 'Iran' },
  'hamedan': { lat: 34.7983, lng: 48.5148, country: 'Iran' }, // Alternate spelling
  'chabahar': { lat: 25.2969, lng: 60.6458, country: 'Iran' },
  'kharg island': { lat: 29.2500, lng: 50.3300, country: 'Iran' },
  'bandar-e mahshahr': { lat: 30.5589, lng: 49.1986, country: 'Iran' },
  'assaluyeh': { lat: 27.4761, lng: 52.6075, country: 'Iran' },
  'arak nuclear site': { lat: 34.3667, lng: 49.2333, country: 'Iran' },
  'fordow': { lat: 34.8858, lng: 50.9953, country: 'Iran' },
  'parchin': { lat: 35.5167, lng: 51.6833, country: 'Iran' },
  'karaj': { lat: 35.8327, lng: 50.9915, country: 'Iran' },
  'urmia': { lat: 37.5527, lng: 45.0760, country: 'Iran' },
  
  // Israel & Palestine
  'jerusalem': { lat: 31.7683, lng: 35.2137, country: 'Israel' },
  'tel aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
  'haifa': { lat: 32.7940, lng: 34.9896, country: 'Israel' },
  'beersheba': { lat: 31.2589, lng: 34.7997, country: 'Israel' },
  'gaza': { lat: 31.5017, lng: 34.4668, country: 'Gaza Strip' },
  'gaza strip': { lat: 31.5017, lng: 34.4668, country: 'Gaza Strip' },
  'gaza city': { lat: 31.5017, lng: 34.4668, country: 'Gaza Strip' },
  'rafah': { lat: 31.2968, lng: 34.2456, country: 'Gaza Strip' },
  'khan younis': { lat: 31.3462, lng: 34.3061, country: 'Gaza Strip' },
  'jenin': { lat: 32.4617, lng: 35.3008, country: 'West Bank' },
  'nablus': { lat: 32.2211, lng: 35.2544, country: 'West Bank' },
  'hebron': { lat: 31.5326, lng: 35.0998, country: 'West Bank' },
  'ramallah': { lat: 31.9074, lng: 35.5352, country: 'West Bank' },
  'bethlehem': { lat: 31.7054, lng: 35.2024, country: 'West Bank' },
  'ashkelon': { lat: 31.6695, lng: 34.5715, country: 'Israel' },
  'ashdod': { lat: 31.8014, lng: 34.6435, country: 'Israel' },
  'netanya': { lat: 32.3329, lng: 34.8599, country: 'Israel' },
  'eilat': { lat: 29.5577, lng: 34.9519, country: 'Israel' },
  'dimona': { lat: 31.0667, lng: 35.0333, country: 'Israel' },
  
  // Lebanon
  'beirut': { lat: 33.8938, lng: 35.5018, country: 'Lebanon' },
  'tripoli': { lat: 34.4333, lng: 35.8333, country: 'Lebanon' },
  'sidon': { lat: 33.5611, lng: 35.3750, country: 'Lebanon' },
  'tyre': { lat: 33.2700, lng: 35.2000, country: 'Lebanon' },
  'baalbek': { lat: 34.0047, lng: 36.2110, country: 'Lebanon' },
  'nabatieh': { lat: 33.3667, lng: 35.4833, country: 'Lebanon' },
  'southern lebanon': { lat: 33.2000, lng: 35.3000, country: 'Lebanon' },
  'hermel': { lat: 34.3333, lng: 36.4000, country: 'Lebanon' },
  
  // Syria
  'damascus': { lat: 33.5138, lng: 36.2765, country: 'Syria' },
  'aleppo': { lat: 36.2021, lng: 37.1343, country: 'Syria' },
  'homs': { lat: 34.7308, lng: 36.7094, country: 'Syria' },
  'latakia': { lat: 35.5317, lng: 35.7901, country: 'Syria' },
  'tartus': { lat: 34.9000, lng: 35.8833, country: 'Syria' },
  'hama': { lat: 35.1333, lng: 36.7500, country: 'Syria' },
  'raqqa': { lat: 35.9500, lng: 39.0167, country: 'Syria' },
  'deir ez-zor': { lat: 35.3333, lng: 40.1500, country: 'Syria' },
  'daraa': { lat: 32.6167, lng: 36.1000, country: 'Syria' },
  'idlib': { lat: 35.9333, lng: 36.6333, country: 'Syria' },
  'palmyra': { lat: 34.5500, lng: 38.2667, country: 'Syria' },
  'al-bukamal': { lat: 34.4500, lng: 40.9333, country: 'Syria' },
  'al-hasakah': { lat: 36.5000, lng: 40.7500, country: 'Syria' },
  'qamishli': { lat: 37.0500, lng: 41.2167, country: 'Syria' },
  'tadmur': { lat: 34.5500, lng: 38.2667, country: 'Syria' },
  
  // Iraq
  'baghdad': { lat: 33.3152, lng: 44.3661, country: 'Iraq' },
  'basra': { lat: 30.5156, lng: 47.7804, country: 'Iraq' },
  'mosul': { lat: 36.3566, lng: 43.1642, country: 'Iraq' },
  'erbil': { lat: 36.1911, lng: 44.0092, country: 'Iraq' },
  'kirkuk': { lat: 35.4669, lng: 44.3923, country: 'Iraq' },
  'najaf': { lat: 31.9924, lng: 44.3140, country: 'Iraq' },
  'karbala': { lat: 32.6160, lng: 44.0245, country: 'Iraq' },
  'sulaymaniyah': { lat: 35.5575, lng: 45.4350, country: 'Iraq' },
  'duhok': { lat: 36.8500, lng: 43.0000, country: 'Iraq' },
  'ramadi': { lat: 33.4167, lng: 43.3000, country: 'Iraq' },
  'fallujah': { lat: 33.3500, lng: 43.7833, country: 'Iraq' },
  'tikrit': { lat: 34.6167, lng: 43.6833, country: 'Iraq' },
  'nasiriyah': { lat: 31.0500, lng: 46.2667, country: 'Iraq' },
  'samarra': { lat: 34.2000, lng: 43.8667, country: 'Iraq' },
  'al-anbar': { lat: 32.9000, lng: 41.1000, country: 'Iraq' },
  'anbar': { lat: 32.9000, lng: 41.1000, country: 'Iraq' },
  
  // Jordan
  'amman': { lat: 31.9454, lng: 35.9284, country: 'Jordan' },
  'irbid': { lat: 32.5556, lng: 35.8502, country: 'Jordan' },
  'zarqa': { lat: 32.0728, lng: 36.0880, country: 'Jordan' },
  'aqaba': { lat: 29.5267, lng: 35.0078, country: 'Jordan' },
  'madaba': { lat: 31.7167, lng: 35.8000, country: 'Jordan' },
  'karak': { lat: 31.1833, lng: 35.7000, country: 'Jordan' },
  'mafraq': { lat: 32.3500, lng: 36.2000, country: 'Jordan' },
  'jordan': { lat: 31.0000, lng: 36.0000, country: 'Jordan' }, // Country center
  
  // Saudi Arabia
  'riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
  'jeddah': { lat: 21.2854, lng: 39.2376, country: 'Saudi Arabia' },
  'mecca': { lat: 21.4225, lng: 39.8262, country: 'Saudi Arabia' },
  'medina': { lat: 24.5247, lng: 39.5692, country: 'Saudi Arabia' },
  'dammam': { lat: 26.4208, lng: 50.0888, country: 'Saudi Arabia' },
  'khobar': { lat: 26.2172, lng: 50.1971, country: 'Saudi Arabia' },
  'tabuk': { lat: 28.3835, lng: 36.5662, country: 'Saudi Arabia' },
  'taif': { lat: 21.2703, lng: 40.4158, country: 'Saudi Arabia' },
  'abha': { lat: 18.2164, lng: 42.5053, country: 'Saudi Arabia' },
  'khamis mushait': { lat: 18.3000, lng: 42.7333, country: 'Saudi Arabia' },
  'hail': { lat: 27.5167, lng: 41.6833, country: 'Saudi Arabia' },
  'buraidah': { lat: 26.3333, lng: 43.9667, country: 'Saudi Arabia' },
  'dhahran': { lat: 26.2886, lng: 50.1140, country: 'Saudi Arabia' },
  'ras tanura': { lat: 26.7058, lng: 50.0606, country: 'Saudi Arabia' },
  'yanbu': { lat: 23.8908, lng: 38.3223, country: 'Saudi Arabia' },
  'saudi arabia': { lat: 24.0000, lng: 45.0000, country: 'Saudi Arabia' },
  
  // UAE
  'dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
  'abu dhabi': { lat: 24.4539, lng: 54.3773, country: 'UAE' },
  'sharjah': { lat: 25.3463, lng: 55.4209, country: 'UAE' },
  'al ain': { lat: 24.2075, lng: 55.7447, country: 'UAE' },
  'fujairah': { lat: 25.1288, lng: 56.3265, country: 'UAE' },
  'ras al-khaimah': { lat: 25.7895, lng: 55.9432, country: 'UAE' },
  'ajman': { lat: 25.4052, lng: 55.5136, country: 'UAE' },
  'umm al-quwain': { lat: 25.5653, lng: 55.5552, country: 'UAE' },
  'jebel ali': { lat: 24.9833, lng: 55.0333, country: 'UAE' },
  'uae': { lat: 24.5000, lng: 54.0000, country: 'UAE' },
  'united arab emirates': { lat: 24.5000, lng: 54.0000, country: 'UAE' },
  
  // Qatar
  'doha': { lat: 25.2854, lng: 51.5310, country: 'Qatar' },
  'al wakrah': { lat: 25.1659, lng: 51.5976, country: 'Qatar' },
  'al khor': { lat: 25.6839, lng: 51.5058, country: 'Qatar' },
  'al rayyan': { lat: 25.2854, lng: 51.4204, country: 'Qatar' },
  'lusail': { lat: 25.4797, lng: 51.4925, country: 'Qatar' },
  'qatar': { lat: 25.3000, lng: 51.2000, country: 'Qatar' },
  
  // Kuwait
  'kuwait city': { lat: 29.3759, lng: 47.9774, country: 'Kuwait' },
  'al ahmadi': { lat: 29.0769, lng: 48.0839, country: 'Kuwait' },
  'hawalli': { lat: 29.3333, lng: 48.0333, country: 'Kuwait' },
  'salmiya': { lat: 29.3333, lng: 48.0833, country: 'Kuwait' },
  'al jahra': { lat: 29.3500, lng: 47.6667, country: 'Kuwait' },
  'kuwait': { lat: 29.3000, lng: 47.8000, country: 'Kuwait' },
  
  // Bahrain
  'manama': { lat: 26.2285, lng: 50.5860, country: 'Bahrain' },
  'muharraq': { lat: 26.2572, lng: 50.6119, country: 'Bahrain' },
  'riffa': { lat: 26.1300, lng: 50.5550, country: 'Bahrain' },
  'hamad town': { lat: 26.1153, lng: 50.5075, country: 'Bahrain' },
  'bahrain': { lat: 26.0667, lng: 50.5577, country: 'Bahrain' },
  
  // Oman
  'muscat': { lat: 23.6139, lng: 58.5423, country: 'Oman' },
  'salalah': { lat: 17.0151, lng: 54.0924, country: 'Oman' },
  'sohar': { lat: 24.3643, lng: 56.7468, country: 'Oman' },
  'nizwa': { lat: 22.9333, lng: 57.5333, country: 'Oman' },
  'duqm': { lat: 19.6667, lng: 57.0667, country: 'Oman' },
  'oman': { lat: 21.0000, lng: 57.0000, country: 'Oman' },
  
  // Yemen
  'sanaa': { lat: 15.3694, lng: 44.1910, country: 'Yemen' },
  'aden': { lat: 12.7855, lng: 45.0216, country: 'Yemen' },
  'taiz': { lat: 13.5775, lng: 44.0178, country: 'Yemen' },
  'hodeidah': { lat: 14.7974, lng: 42.9571, country: 'Yemen' },
  'mukalla': { lat: 14.5333, lng: 49.1333, country: 'Yemen' },
  'ibb': { lat: 13.9667, lng: 44.1833, country: 'Yemen' },
  'marib': { lat: 15.4667, lng: 45.3333, country: 'Yemen' },
  'yemen': { lat: 15.5000, lng: 47.5000, country: 'Yemen' },
  
  // Turkey
  'istanbul': { lat: 41.0082, lng: 28.9784, country: 'Turkey' },
  'ankara': { lat: 39.9334, lng: 32.8597, country: 'Turkey' },
  'izmir': { lat: 38.4237, lng: 27.1428, country: 'Turkey' },
  'adana': { lat: 36.9864, lng: 35.3253, country: 'Turkey' },
  'gaziantep': { lat: 37.0662, lng: 37.3833, country: 'Turkey' },
  'diyarbakir': { lat: 37.9143, lng: 40.2306, country: 'Turkey' },
  'sanliurfa': { lat: 37.1591, lng: 38.7969, country: 'Turkey' },
  'turkey': { lat: 39.0000, lng: 35.0000, country: 'Turkey' },
  
  // Egypt
  'cairo': { lat: 30.0444, lng: 31.2357, country: 'Egypt' },
  'alexandria': { lat: 31.2001, lng: 29.9187, country: 'Egypt' },
  'suez': { lat: 29.9737, lng: 32.5263, country: 'Egypt' },
  'port said': { lat: 31.2653, lng: 32.3019, country: 'Egypt' },
  'ismailia': { lat: 30.6048, lng: 32.2723, country: 'Egypt' },
  'egypt': { lat: 26.0000, lng: 30.0000, country: 'Egypt' },
  
  // Strategic waterways
  'strait of hormuz': { lat: 26.5000, lng: 56.5000, country: 'Strait of Hormuz' },
  'hormuz': { lat: 26.5000, lng: 56.5000, country: 'Strait of Hormuz' },
  'persian gulf': { lat: 26.0000, lng: 52.0000, country: 'Persian Gulf' },
  'gulf of oman': { lat: 25.0000, lng: 58.0000, country: 'Gulf of Oman' },
  'red sea': { lat: 20.0000, lng: 38.0000, country: 'Red Sea' },
  'bab el-mandeb': { lat: 12.6000, lng: 43.4000, country: 'Bab el-Mandeb' },
  'suez canal': { lat: 30.5000, lng: 32.3333, country: 'Suez Canal' },
  
  // US Military bases in region
  'al udeid': { lat: 25.1178, lng: 51.3150, country: 'Qatar' },
  'al udeid air base': { lat: 25.1178, lng: 51.3150, country: 'Qatar' },
  'al dhafra': { lat: 24.2482, lng: 54.5477, country: 'UAE' },
  'al dhafra air base': { lat: 24.2482, lng: 54.5477, country: 'UAE' },
  'naval support activity bahrain': { lat: 26.2167, lng: 50.6167, country: 'Bahrain' },
  'camp arifjan': { lat: 28.8736, lng: 47.7978, country: 'Muwait' },
  'camp buehring': { lat: 29.3000, lng: 47.1000, country: 'Kuwait' },
  'ali al salem': { lat: 29.3500, lng: 47.1667, country: 'Kuwait' },
  'prince sultan air base': { lat: 24.0000, lng: 47.5000, country: 'Saudi Arabia' },
  'incirlik': { lat: 37.0022, lng: 35.4258, country: 'Turkey' },
  'incirlik air base': { lat: 37.0022, lng: 35.4258, country: 'Turkey' },
};

// In-memory cache for dynamically discovered locations
let dynamicCache = {};
let cacheLoaded = false;

// Load cache from disk
async function loadCache() {
  if (cacheLoaded) return;
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    dynamicCache = JSON.parse(data);
    cacheLoaded = true;
  } catch {
    dynamicCache = {};
    cacheLoaded = true;
  }
}

// Save cache to disk
async function saveCache() {
  try {
    await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(dynamicCache, null, 2));
  } catch (err) {
    console.log('[LocationService] Cache save failed:', err.message);
  }
}

// Geocode using OpenStreetMap Nominatim (free, no API key needed)
async function geocodeLocation(location) {
  try {
    // Rate limit: 1 request per second
    await new Promise(r => setTimeout(r, 1000));
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location + ', Middle East')}&limit=1`,
      { headers: { 'User-Agent': 'WW3Tracker/1.0' } }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        country: data[0].display_name.split(',').pop().trim()
      };
    }
  } catch (err) {
    console.log('[LocationService] Geocoding failed:', err.message);
  }
  return null;
}

// Main function: Get coordinates for any location
export async function getCoordinates(location) {
  if (!location) return null;
  
  const key = location.toLowerCase().trim();
  
  // Check static database first (fastest)
  if (LOCATION_DATABASE[key]) {
    return LOCATION_DATABASE[key];
  }
  
  // Load dynamic cache if not loaded
  await loadCache();
  
  // Check dynamic cache
  if (dynamicCache[key]) {
    return dynamicCache[key];
  }
  
  // Try fuzzy matching for partial matches
  for (const [dbKey, coords] of Object.entries(LOCATION_DATABASE)) {
    if (key.includes(dbKey) || dbKey.includes(key)) {
      return coords;
    }
  }
  
  // Last resort: geocode dynamically
  const geocoded = await geocodeLocation(location);
  if (geocoded) {
    dynamicCache[key] = geocoded;
    saveCache(); // Don't await, save in background
    return geocoded;
  }
  
  return null;
}

// Extract location from text using common patterns
export function extractLocationFromText(text) {
  if (!text) return null;
  
  const lowerText = text.toLowerCase();
  
  // Check all locations in database
  for (const key of Object.keys(LOCATION_DATABASE)) {
    if (lowerText.includes(key)) {
      return key;
    }
  }
  
  // Check dynamic cache
  for (const key of Object.keys(dynamicCache)) {
    if (lowerText.includes(key)) {
      return key;
    }
  }
  
  return null;
}

// Batch get coordinates for multiple locations
export async function getCoordinatesBatch(locations) {
  const results = {};
  for (const location of locations) {
    results[location] = await getCoordinates(location);
  }
  return results;
}

// Get all locations for a country
export function getLocationsByCountry(country) {
  const results = [];
  for (const [key, coords] of Object.entries(LOCATION_DATABASE)) {
    if (coords.country.toLowerCase() === country.toLowerCase()) {
      results.push({ name: key, ...coords });
    }
  }
  return results;
}

// Get database stats
export function getDatabaseStats() {
  return {
    staticLocations: Object.keys(LOCATION_DATABASE).length,
    dynamicLocations: Object.keys(dynamicCache).length,
    total: Object.keys(LOCATION_DATABASE).length + Object.keys(dynamicCache).length
  };
}

export default {
  getCoordinates,
  extractLocationFromText,
  getCoordinatesBatch,
  getLocationsByCountry,
  getDatabaseStats
};

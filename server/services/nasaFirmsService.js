import fetch from 'node-fetch';

const NASA_FIRMS_URL = 'https://firms.modaps.eosdis.nasa.gov/api/country/csv';
// Read env var at runtime
const getNasaKey = () => process.env.NASA_FIRMS_KEY;

// Cache for fire data
let cachedFires = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour (satellite data doesn't change rapidly)

export const fetchIranFires = async () => {
  const apiKey = getNasaKey();
  // If no API key, return mock data
  if (!apiKey) {
    console.log('[NASA FIRMS] No API key, using mock data');
    return getMockFireData();
  }

  try {
    // Check cache
    if (cachedFires && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      console.log('[NASA FIRMS] Returning cached data');
      return cachedFires;
    }

    console.log('[NASA FIRMS] Fetching satellite data...');
    
    // VIIRS SNPP NRT for Iran (IRN) - last 24 hours
    const url = `${NASA_FIRMS_URL}/${apiKey}/VIIRS_SNPP_NRT/IRN/1`;
    
    const response = await fetch(url, {
      timeout: 20000
    });

    if (!response.ok) {
      console.warn(`[NASA FIRMS] API returned ${response.status}`);
      return getMockFireData();
    }

    const csv = await response.text();
    const lines = csv.split('\n').filter(line => line.trim());
    
    // Skip header, count data rows
    const fireCount = Math.max(0, lines.length - 1);
    
    // Parse some details from CSV
    const fires = lines.slice(1, 6).map(line => {
      const cols = line.split(',');
      return {
        latitude: cols[0],
        longitude: cols[1],
        brightness: cols[2],
        confidence: cols[8],
        date: cols[5],
        time: cols[6]
      };
    });

    const result = {
      count: fireCount,
      fires: fires,
      source: 'NASA FIRMS VIIRS SNPP',
      last24h: true,
      timestamp: new Date().toISOString()
    };

    cachedFires = result;
    lastFetchTime = Date.now();
    
    console.log(`[NASA FIRMS] Detected ${fireCount} fire signatures`);
    return result;
  } catch (error) {
    console.error('[NASA FIRMS] Error:', error.message);
    return getMockFireData();
  }
};

const getMockFireData = () => ({
  count: Math.floor(Math.random() * 20) + 5,
  fires: [],
  source: 'NASA FIRMS (Mock)',
  last24h: true,
  timestamp: new Date().toISOString(),
  mock: true
});

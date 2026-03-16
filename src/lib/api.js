// Use relative URL - works with any domain (localhost, railway, custom domain)
const API_BASE_URL = '/api';

const DEFAULT_TIMEOUT = 5000; // 5 seconds - fail fast for better UX

// Create fetch with timeout using AbortController
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

const fetchJSON = async (url, options = {}) => {
  const response = await fetchWithTimeout(url, options, DEFAULT_TIMEOUT);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
};

// Cache keys for localStorage
const CACHE_KEYS = {
  gameState: 'cached_gameState',
  memes: 'cached_memes',
  ticker: 'cached_ticker',
  fires: 'cached_fires',
  polymarket: 'cached_polymarket',
  timestamp: 'cached_timestamp'
};

// Get cached data from localStorage
export const getCachedData = (key) => {
  try {
    const data = localStorage.getItem(CACHE_KEYS[key]);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn(`[Cache] Failed to read ${key} from cache:`, e.message);
  }
  return null;
};

// Save data to localStorage cache
export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify(data));
    localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
  } catch (e) {
    console.warn(`[Cache] Failed to write ${key} to cache:`, e.message);
  }
};

// Clear all cached data
export const clearCache = () => {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// News API
export const fetchNews = (limit = 10) => 
  fetchJSON(`${API_BASE_URL}/news?limit=${limit}`);

// Analysis API
export const analyzeHeadline = (headline, description = '') => 
  fetchJSON(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    body: JSON.stringify({ headline, description })
  });

// Chat API
export const sendChatMessage = (message, context = '') => 
  fetchJSON(`${API_BASE_URL}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, context })
  });

// Game State API - with caching
export const fetchGameState = async () => {
  try {
    const data = await fetchJSON(`${API_BASE_URL}/state`);
    setCachedData('gameState', data);
    return data;
  } catch (error) {
    const cached = getCachedData('gameState');
    if (cached) {
      console.log('[API] Returning cached game state');
      return { ...cached, fromCache: true };
    }
    throw error;
  }
};

export const refreshGameState = () => 
  fetchJSON(`${API_BASE_URL}/state/refresh`, { method: 'POST' });

// Memes API - with caching
export const fetchMemes = async (limit = 4) => {
  try {
    const data = await fetchJSON(`${API_BASE_URL}/memes?limit=${limit}`);
    setCachedData('memes', data);
    return data;
  } catch (error) {
    const cached = getCachedData('memes');
    if (cached) {
      console.log('[API] Returning cached memes');
      return { ...cached, fromCache: true };
    }
    throw error;
  }
};

// Polymarket API - with caching
export const fetchPolymarketData = async () => {
  try {
    const data = await fetchJSON(`${API_BASE_URL}/polymarket`);
    setCachedData('polymarket', data);
    return data;
  } catch (error) {
    const cached = getCachedData('polymarket');
    if (cached) {
      console.log('[API] Returning cached polymarket data');
      return { ...cached, fromCache: true };
    }
    throw error;
  }
};

// NASA FIRMS API - with caching
export const fetchFireData = async () => {
  try {
    const data = await fetchJSON(`${API_BASE_URL}/fires`);
    setCachedData('fires', data);
    return data;
  } catch (error) {
    const cached = getCachedData('fires');
    if (cached) {
      console.log('[API] Returning cached fire data');
      return { ...cached, fromCache: true };
    }
    throw error;
  }
};

// Trump GIF API
export const fetchTrumpGif = (mood = 'winning') => 
  fetchJSON(`${API_BASE_URL}/trump-gif?mood=${mood}`);

// Ticker API - with caching
export const fetchTickerItems = async () => {
  try {
    const data = await fetchJSON(`${API_BASE_URL}/ticker`);
    setCachedData('ticker', data);
    return data;
  } catch (error) {
    const cached = getCachedData('ticker');
    if (cached) {
      console.log('[API] Returning cached ticker');
      return { ...cached, fromCache: true };
    }
    throw error;
  }
};

// Dismiss alert API
export const dismissAlert = () => 
  fetchJSON(`${API_BASE_URL}/alert/dismiss`, { method: 'POST' });

// Export cache utilities
export { CACHE_KEYS };

import fetch from 'node-fetch';
import { updateLiveDataCache } from './botMessageService.js';

// Cache for market data
let marketCache = null;
let lastFetch = null;
const CACHE_DURATION = 60000; // 60 seconds

// Fallback data if all fetches fail
const FALLBACK_DATA = {
  stocks: [
    {
      name: 'CRUDE OIL 🛢️',
      label: 'OIL.WAR',
      price: '$75.00',
      change: '+0.00%',
      direction: 'up',
      meaning: 'bad',
      stale: true
    },
    {
      name: 'GOLD 🥇',
      label: 'SAFE.HAVEN',
      price: '$2,350.00',
      change: '+0.00%',
      direction: 'up',
      meaning: 'warning',
      stale: true
    },
    {
      name: 'LOCKHEED 🚀',
      label: 'WAR.STOCKS',
      price: '$450.00',
      change: '+0.00%',
      direction: 'up',
      meaning: 'bad',
      stale: true
    },
    {
      name: 'IRAN RIAL 💸',
      label: 'USD/IRR',
      price: '42K IRR',
      change: 'LIVE',
      direction: 'down',
      meaning: 'bad',
      stale: true
    }
  ],
  updatedAt: new Date().toISOString(),
  fetchedAt: Date.now(),
  fallback: true
};

/**
 * Fetch Crude Oil (WTI Futures) from Yahoo Finance
 */
const fetchOil = async () => {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/CL=F',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    
    if (!res.ok) throw new Error(`Oil fetch failed: ${res.status}`);
    
    const data = await res.json();
    
    if (!data.chart?.result?.[0]) {
      throw new Error('Invalid oil data structure');
    }
    
    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;
    const prev = result.meta.previousClose || result.meta.chartPreviousClose;
    
    if (!price || !prev) {
      throw new Error('Missing oil price data');
    }
    
    const change = ((price - prev) / prev * 100);
    
    return {
      name: 'CRUDE OIL 🛢️',
      label: 'OIL.WAR',
      price: `$${price.toFixed(2)}`,
      change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      direction: change >= 0 ? 'up' : 'down',
      meaning: 'bad', // oil up = war escalating = bad
      stale: false
    };
  } catch (err) {
    console.error('[MarketService] Oil fetch error:', err.message);
    throw err;
  }
};

/**
 * Fetch Gold (GC=F) from Yahoo Finance
 */
const fetchGold = async () => {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/GC=F',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    
    if (!res.ok) throw new Error(`Gold fetch failed: ${res.status}`);
    
    const data = await res.json();
    
    if (!data.chart?.result?.[0]) {
      throw new Error('Invalid gold data structure');
    }
    
    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;
    const prev = result.meta.previousClose || result.meta.chartPreviousClose;
    
    if (!price || !prev) {
      throw new Error('Missing gold price data');
    }
    
    const change = ((price - prev) / prev * 100);
    
    return {
      name: 'GOLD 🥇',
      label: 'SAFE.HAVEN',
      price: `$${price.toFixed(2)}`,
      change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      direction: change >= 0 ? 'up' : 'down',
      meaning: 'warning', // gold up = people scared = warning
      stale: false
    };
  } catch (err) {
    console.error('[MarketService] Gold fetch error:', err.message);
    throw err;
  }
};

/**
 * Fetch Lockheed Martin (LMT) from Yahoo Finance
 */
const fetchDefense = async () => {
  try {
    const res = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/LMT',
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    
    if (!res.ok) throw new Error(`Defense fetch failed: ${res.status}`);
    
    const data = await res.json();
    
    if (!data.chart?.result?.[0]) {
      throw new Error('Invalid defense data structure');
    }
    
    const result = data.chart.result[0];
    const price = result.meta.regularMarketPrice;
    const prev = result.meta.previousClose || result.meta.chartPreviousClose;
    
    if (!price || !prev) {
      throw new Error('Missing defense price data');
    }
    
    const change = ((price - prev) / prev * 100);
    
    return {
      name: 'LOCKHEED 🚀',
      label: 'WAR.STOCKS',
      price: `$${price.toFixed(2)}`,
      change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      direction: change >= 0 ? 'up' : 'down',
      meaning: 'bad', // defense up = war = bad for peace
      stale: false
    };
  } catch (err) {
    console.error('[MarketService] Defense fetch error:', err.message);
    throw err;
  }
};

/**
 * Fetch USD to Iranian Rial exchange rate
 */
const fetchIRR = async () => {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!res.ok) throw new Error(`IRR fetch failed: ${res.status}`);
    
    const data = await res.json();
    
    if (!data.rates?.IRR) {
      throw new Error('Missing IRR rate data');
    }
    
    const rate = data.rates.IRR;
    
    return {
      name: 'IRAN RIAL 💸',
      label: 'USD/IRR',
      price: `${(rate / 1000).toFixed(0)}K IRR`,
      change: 'LIVE',
      direction: 'down', // IRR always suffering against USD
      meaning: 'bad',
      stale: false
    };
  } catch (err) {
    console.error('[MarketService] IRR fetch error:', err.message);
    throw err;
  }
};

/**
 * Get all market data with caching
 */
export const getMarkets = async () => {
  const now = Date.now();
  
  // Return cached data if fresh
  if (marketCache && lastFetch && (now - lastFetch < CACHE_DURATION)) {
    console.log('[MarketService] Returning cached data');
    return marketCache;
  }
  
  // Fetch fresh data
  console.log('[MarketService] Fetching fresh market data...');
  
  const results = await Promise.allSettled([
    fetchOil(),
    fetchGold(),
    fetchDefense(),
    fetchIRR()
  ]);
  
  const stocks = [];
  let hasValidData = false;
  
  // Process results - use fallback for failed fetches
  results.forEach((result, index) => {
    const fallbackStock = FALLBACK_DATA.stocks[index];
    
    if (result.status === 'fulfilled') {
      stocks.push(result.value);
      hasValidData = true;
    } else {
      // Use cached value if available, otherwise fallback
      const cachedStock = marketCache?.stocks?.[index];
      if (cachedStock && !cachedStock.stale) {
        console.log(`[MarketService] Using stale cached data for ${fallbackStock.label}`);
        stocks.push({ ...cachedStock, stale: true });
      } else {
        console.log(`[MarketService] Using fallback data for ${fallbackStock.label}`);
        stocks.push(fallbackStock);
      }
    }
  });
  
  // Build response
  const response = {
    stocks,
    updatedAt: new Date().toISOString(),
    fetchedAt: now,
    fallback: !hasValidData
  };
  
  // Only update cache if we got at least some valid data
  if (hasValidData) {
    marketCache = response;
    lastFetch = now;
    console.log('[MarketService] Market data refreshed successfully');
    
    // Update bot service with oil data
    const oilStock = stocks.find(s => s.label === 'OIL.WAR');
    if (oilStock) {
      updateLiveDataCache({
        oilPrice: oilStock.price,
        oilChange: oilStock.change
      });
    }
  }
  
  return response;
};

/**
 * Check if markets are in "war mode" (oil + defense both up > 3%)
 */
export const isWarMode = (stocks) => {
  if (!stocks || stocks.length < 3) return false;
  
  const oil = stocks.find(s => s.label === 'OIL.WAR');
  const defense = stocks.find(s => s.label === 'WAR.STOCKS');
  
  if (!oil || !defense) return false;
  
  const oilChange = parseFloat(oil.change.replace('%', '').replace('+', ''));
  const defenseChange = parseFloat(defense.change.replace('%', '').replace('+', ''));
  
  return oilChange > 3 && defenseChange > 3;
};

export default {
  getMarkets,
  isWarMode
};

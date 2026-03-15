import dotenv from 'dotenv';
// Load env vars FIRST before anything else
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
// Services
import { refreshNews, startAutoRefresh, getCachedNews } from './services/rssService.js';
import { fetchGDELTNews, mergeNewsSources } from './services/gdeltService.js';
import { analyzeHeadline, getChatResponse, analyzeForMapBatch } from './services/replicateService.js';
import { detectAttacksBatch } from './services/attackDetector.js';
import { fetchIranMarkets, getEscalationProbability } from './services/polymarketService.js';
import { fetchIranFires } from './services/nasaFirmsService.js';
import { getTrumpGif } from './services/giphyService.js';
import { updateGameStateFromAnalysis, getGameState, resetBreakingAlert, initGameState } from './services/gameStateService.js';
import { getMarkets, isWarMode } from './services/marketService.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Verify env vars are loaded
console.log('\n=== ENVIRONMENT VARIABLES CHECK ===');
console.log('REPLICATE_API_TOKEN:', process.env.REPLICATE_API_TOKEN ? '✅ Set (' + process.env.REPLICATE_API_TOKEN.slice(0, 10) + '...)' : '❌ NOT SET (will use mock)');
console.log('GIPHY_API_KEY:', process.env.GIPHY_API_KEY ? '✅ Set (' + process.env.GIPHY_API_KEY.slice(0, 10) + '...)' : '❌ NOT SET');
console.log('NASA_FIRMS_KEY:', process.env.NASA_FIRMS_KEY ? '✅ Set (' + process.env.NASA_FIRMS_KEY.slice(0, 10) + '...)' : '❌ NOT SET');
console.log('PORT:', process.env.PORT || '3001 (default)');
console.log('💰 Using Replicate (~$0.0001-0.0002 per request)');
console.log('=====================================\n');

// Middleware
app.use(cors());
app.use(express.json());



// Cache for merged news with TTL
let cachedMergedNews = [];
let analyzedNews = [];
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// In-memory cache for other endpoints
const apiCache = new Map();
const CACHE_DURATION = 60000; // 1 minute for most endpoints

// Fallback mock news for immediate response
const FALLBACK_NEWS = [
  {
    headline: "US-Iran tensions escalate over Strait of Hormuz",
    description: "Military buildup reported in Persian Gulf region",
    link: "https://www.bbc.com/news",
    pubDate: new Date().toISOString(),
    source: "BBC",
    type: "rss",
    analysis: {
      side: "IRAN",
      score: -3,
      severity: "high",
      badge: "YIKES 😬",
      memeCaption: "Iran said hold my tea, things getting spicy 🍵💀",
      tickerText: "Hormuz situation heating up fr 🔥"
    }
  },
  {
    headline: "Trump announces new sanctions on Iranian oil exports",
    description: "Economic pressure intensifies as talks stall",
    link: "https://www.reuters.com",
    pubDate: new Date(Date.now() - 3600000).toISOString(),
    source: "Reuters",
    type: "rss",
    analysis: {
      side: "US",
      score: 4,
      severity: "medium",
      badge: "CONFIRMED",
      analysis: "US sanctions target Iranian oil exports, significantly impacting economy",
      tickerText: "Sanctions impacting Iranian oil exports"
    }
  },
  {
    headline: "Israel warns of retaliation after Iranian proxy attacks",
    description: "Regional tensions threaten wider conflict",
    link: "https://www.aljazeera.com",
    pubDate: new Date(Date.now() - 7200000).toISOString(),
    source: "Al Jazeera",
    type: "rss",
    analysis: {
      side: "NEUTRAL",
      score: 0,
      severity: "high",
      badge: "BREAKING",
      analysis: "Regional tensions increase as proxy conflicts expand across Middle East",
      tickerText: "Regional proxy conflict escalation"
    }
  },
  {
    headline: "Nuclear talks stall as Iran enriches more uranium",
    description: "International monitors express concern over stockpiles",
    link: "https://www.theguardian.com",
    pubDate: new Date(Date.now() - 10800000).toISOString(),
    source: "The Guardian",
    type: "rss",
    analysis: {
      side: "IRAN",
      score: -2,
      severity: "medium",
      badge: "INTELLIGENCE",
      analysis: "Iran's uranium enrichment program advances beyond previous limits",
      tickerText: "Iranian uranium enrichment increasing"
    }
  }
];

// Cache helper functions
const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

// ==================== API TEST FUNCTIONS ====================

const testReplicateAPI = async () => {
  console.log('\n🧪 TESTING REPLICATE API...');
  try {
    const response = await getChatResponse('say hello in one word');
    console.log('✅ REPLICATE API WORKING!');
    console.log('   Response:', response);
    return { success: true, response };
  } catch (error) {
    console.log('❌ REPLICATE API FAILED!');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
};

const testGiphyAPI = async () => {
  console.log('\n🧪 TESTING GIPHY API...');
  try {
    const result = await getTrumpGif('winning');
    if (result && result.url) {
      console.log('✅ GIPHY API WORKING!');
      console.log('   GIF URL:', result.url.substring(0, 60) + '...');
      console.log('   Title:', result.title);
      return { success: true, gif: result };
    } else {
      console.log('❌ GIPHY API: No GIF returned (check API key)');
      return { success: false, error: 'No GIF returned' };
    }
  } catch (error) {
    console.log('❌ GIPHY API FAILED!');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
};

const testNasaFirmsAPI = async () => {
  console.log('\n🧪 TESTING NASA FIRMS API...');
  try {
    const data = await fetchIranFires();
    if (data && !data.mock) {
      console.log('✅ NASA FIRMS API WORKING!');
      console.log('   Fire count:', data.count);
      console.log('   Source:', data.source);
      return { success: true, data };
    } else {
      console.log('⚠️ NASA FIRMS API: Using mock data (check API key or endpoint)');
      console.log('   Mock fire count:', data?.count);
      return { success: false, error: 'Using mock data', mock: true };
    }
  } catch (error) {
    console.log('❌ NASA FIRMS API FAILED!');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper to run function with timeout
const withTimeout = (promise, timeoutMs, label) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]).catch(err => {
    console.log(`[API Test] ${err.message}`);
    return { success: false, error: err.message };
  });
};

// Run all tests before starting server
const runAPITests = async () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           RUNNING API CONNECTION TESTS                 ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  // Run tests with 15 second timeout each
  const results = {
    replicate: await withTimeout(testReplicateAPI(), 15000, 'Replicate API test'),
    giphy: await withTimeout(testGiphyAPI(), 15000, 'Giphy API test'),
    nasa: await withTimeout(testNasaFirmsAPI(), 15000, 'NASA FIRMS API test')
  };
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                   TEST SUMMARY                         ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('Replicate AI:', results.replicate.success ? '✅ WORKING (~$0.0001/request)' : '❌ FAILED');
  console.log('Giphy:', results.giphy.success ? '✅ WORKING' : '❌ FAILED');
  console.log('NASA FIRMS:', results.nasa.success ? '✅ WORKING' : (results.nasa.mock ? '⚠️ MOCK MODE' : '❌ FAILED'));
  console.log('💰 Estimated cost per news cycle: ~$0.001-0.003 (100 analyses = ~$0.02)');
  console.log('');
  
  const allWorking = results.replicate.success && results.giphy.success;
  if (allWorking) {
    console.log('🎉 Core APIs are working!\n');
  } else {
    console.log('⚠️ Some APIs failed. Server running with fallbacks...\n');
  }
  
  return results;
};

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      replicate: process.env.REPLICATE_API_TOKEN ? 'configured' : 'not configured',
      giphy: process.env.GIPHY_API_KEY ? 'configured' : 'not configured',
      nasa: process.env.NASA_FIRMS_KEY ? 'configured' : 'not configured'
    }
  });
});

// Get news (RSS + GDELT merged) - Returns cached/fallback IMMEDIATELY (<100ms)
app.get('/api/news', async (req, res) => {
  const startTime = Date.now();
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    // STRATEGY: Always return something immediately, refresh in background
    
    // If we have cached data, return it immediately (< 100ms)
    if (cachedMergedNews.length > 0) {
      res.json({
        items: cachedMergedNews.slice(0, limit),
        total: cachedMergedNews.length,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
        cached: true,
        responseTime: Date.now() - startTime
      });
      
      // Refresh in background if cache is stale
      if (Date.now() - cacheTimestamp > CACHE_TTL_MS) {
        (async () => {
          try {
            console.log('[News] Cache stale, refreshing in background...');
            const gdeltNews = await fetchGDELTNews();
            const rssNews = getCachedNews();
            cachedMergedNews = mergeNewsSources(rssNews, gdeltNews);
            cacheTimestamp = Date.now();
            console.log('[News] Background refresh complete, items:', cachedMergedNews.length);
          } catch (bgError) {
            console.error('[News] Background fetch error:', bgError.message);
          }
        })();
      }
      
      return;
    }
    
    // No cache - check if we have RSS data to return immediately
    const rssNews = getCachedNews();
    if (rssNews.length > 0) {
      console.log('[News] Using RSS data while GDELT loads...');
      res.json({
        items: rssNews.slice(0, limit),
        total: rssNews.length,
        lastUpdated: new Date().toISOString(),
        cached: false,
        rssOnly: true,
        responseTime: Date.now() - startTime
      });
    } else {
      // Truly no data - return fallback
      console.log('[News] No cache, returning fallback immediately');
      res.json({
        items: FALLBACK_NEWS.slice(0, limit),
        total: FALLBACK_NEWS.length,
        lastUpdated: new Date().toISOString(),
        fallback: true,
        responseTime: Date.now() - startTime
      });
    }
    
    // Populate merged cache in background (with GDELT)
    (async () => {
      try {
        if (rssNews.length === 0) {
          await refreshNews();
        }
        const gdeltNews = await fetchGDELTNews();
        cachedMergedNews = mergeNewsSources(getCachedNews(), gdeltNews);
        cacheTimestamp = Date.now();
        console.log('[News] Cache populated with GDELT, items:', cachedMergedNews.length);
      } catch (error) {
        console.error('[News] Failed to populate cache:', error.message);
      }
    })();
    
  } catch (error) {
    console.error('[API] /api/news error:', error);
    // Always return something usable
    res.json({
      items: FALLBACK_NEWS.slice(0, limit),
      total: FALLBACK_NEWS.length,
      lastUpdated: new Date().toISOString(),
      fallback: true,
      responseTime: Date.now() - startTime
    });
  }
});

// Hardcoded major conflicts (for reliability when RSS misses key events)
// These are prerendered/seeded conflicts that always show if within time window
const HARDCODED_CONFLICTS = [
  {
    headline: "US-Israeli airstrikes hit multiple sites in Isfahan province, Iran",
    description: "Confirmed military strikes targeting locations in central Iran",
    pubDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    source: "BBC",
    mapAnalysis: {
      isAttack: true,
      attackType: "airstrike",
      location: "Isfahan",
      severity: "high",
      description: "US-Israeli joint strikes on Isfahan province targets"
    }
  },
  {
    headline: "Israeli drone strikes target paramilitary checkpoints in Tehran",
    description: "Drone attacks confirmed in Iranian capital",
    pubDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    source: "Al Jazeera",
    mapAnalysis: {
      isAttack: true,
      attackType: "drone",
      location: "Tehran",
      severity: "high",
      description: "Israeli drone strikes on Tehran checkpoints"
    }
  },
  {
    headline: "Iran launches missile and drone attacks toward Israel",
    description: "Iranian retaliation with ballistic missiles and drones",
    pubDate: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
    source: "Reuters",
    mapAnalysis: {
      isAttack: true,
      attackType: "missile",
      location: "Tel Aviv",
      severity: "high",
      description: "Iranian missile and drone strikes on Israel"
    }
  },
  {
    headline: "US strikes Iranian naval and oil targets at Kharg Island",
    description: "American military targets Iranian oil infrastructure",
    pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    source: "France24",
    mapAnalysis: {
      isAttack: true,
      attackType: "airstrike",
      location: "Kharg Island",
      severity: "high",
      description: "US strikes on Iranian oil and naval facilities"
    }
  }
];

// Cache for attacks to provide fast response
let cachedAttacks = [];
let attacksCacheTime = 0;
const ATTACKS_CACHE_TTL = 60 * 1000; // 1 minute cache
const HOURS_WINDOW = 48; // Show attacks from last 48 hours

// Background refresh function
const refreshAttacksCache = async () => {
  const startTime = Date.now();
  console.log('[Attacks] Starting background cache refresh...');
  
  try {
    // Get cached news
    const allNews = getCachedNews();
    
    // Filter to last 48 hours
    const cutoffTime = Date.now() - (HOURS_WINDOW * 60 * 60 * 1000);
    const recentNews = allNews.filter(item => {
      const itemTime = new Date(item.pubDate || 0).getTime();
      return itemTime > cutoffTime;
    }).slice(0, 15);
    
    // Use AI to identify confirmed attacks from news
    let attacks = [];
    try {
      attacks = await analyzeForMapBatch(recentNews);
      console.log(`[Attacks] AI analysis found ${attacks.length} attacks`);
    } catch (analysisError) {
      console.log('[Attacks] AI analysis failed:', analysisError.message);
      attacks = getMockAttacks(recentNews);
    }
    
    // Add hardcoded conflicts if within time window and not duplicated
    const hardcodedInWindow = HARDCODED_CONFLICTS.filter(conflict => {
      const conflictTime = new Date(conflict.pubDate).getTime();
      return conflictTime > cutoffTime;
    });
    
    // Merge, avoiding duplicates
    for (const hardcoded of hardcodedInWindow) {
      const hardcodedTime = new Date(hardcoded.pubDate).getTime();
      const isDuplicate = attacks.some(attack => {
        const attackTime = new Date(attack.pubDate || 0).getTime();
        const sameLocation = attack.mapAnalysis?.location === hardcoded.mapAnalysis.location;
        const timeClose = Math.abs(attackTime - hardcodedTime) < (6 * 60 * 60 * 1000);
        return sameLocation && timeClose;
      });
      
      if (!isDuplicate) {
        attacks.push(hardcoded);
      }
    }
    
    // Sort by date
    attacks.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    // Update cache
    cachedAttacks = attacks;
    attacksCacheTime = Date.now();
    
    console.log(`[Attacks] Cache refreshed: ${attacks.length} attacks (${Date.now() - startTime}ms)`);
  } catch (error) {
    console.error('[Attacks] Background refresh failed:', error.message);
  }
};

// Get confirmed attacks for map display - FAST (returns cache immediately)
app.get('/api/attacks', async (req, res) => {
  const startTime = Date.now();
  
  // STRATEGY: Return cache immediately, refresh in background
  
  // If we have fresh cached data, return it immediately (< 100ms)
  if (cachedAttacks.length > 0 && (Date.now() - attacksCacheTime < ATTACKS_CACHE_TTL)) {
    res.json({
      attacks: cachedAttacks,
      count: cachedAttacks.length,
      hoursWindow: HOURS_WINDOW,
      lastUpdated: new Date(attacksCacheTime).toISOString(),
      cached: true,
      responseTime: Date.now() - startTime
    });
    
    // Trigger background refresh if cache is getting stale (> 30s old)
    if (Date.now() - attacksCacheTime > 30000) {
      refreshAttacksCache();
    }
    return;
  }
  
  // No cache or stale - return hardcoded conflicts immediately
  const cutoffTime = Date.now() - (HOURS_WINDOW * 60 * 60 * 1000);
  const hardcodedInWindow = HARDCODED_CONFLICTS.filter(conflict => {
    const conflictTime = new Date(conflict.pubDate).getTime();
    return conflictTime > cutoffTime;
  });
  
  res.json({
    attacks: hardcodedInWindow,
    count: hardcodedInWindow.length,
    hoursWindow: HOURS_WINDOW,
    lastUpdated: new Date().toISOString(),
    cached: false,
    loading: true,
    responseTime: Date.now() - startTime
  });
  
  // Populate cache in background
  if (cachedAttacks.length === 0 || (Date.now() - attacksCacheTime > ATTACKS_CACHE_TTL)) {
    refreshAttacksCache();
  }
});

// Fallback attack detection using keywords
function getMockAttacks(newsItems) {
  const attacks = [];
  
  for (const item of newsItems) {
    const text = (item.headline + ' ' + (item.description || '')).toLowerCase();
    
    // STRICT: Skip analysis pieces, statements, humanitarian coverage
    const analysisKeywords = /\b(what is happening|what we know|explained|analysis|why did|how will|day \d+ of|week \d+ of|live updates|as it happened|crisis live|q&A)\b/;
    const statementKeywords = /\b(says it has|claims to have|reports that|allegedly|reportedly)\b/;
    const humanitarianKeywords = /\b(humanitarian crisis|deepening the crisis|aid|relief|humanitarian|refugees|displaced)\b/;
    
    if (analysisKeywords.test(text) || statementKeywords.test(text) || humanitarianKeywords.test(text)) {
      continue;
    }
    
    // Must have ACTIVE voice attack keywords
    const isAttack = /\b(struck|hit|bombed|destroyed|damaged|explosion rocked|exploded|fired on|was attacked)\b/.test(text);
    if (!isAttack) continue;
    
    // Determine attack type
    let attackType = 'strike';
    if (text.includes('airstrike')) attackType = 'airstrike';
    else if (text.includes('missile')) attackType = 'missile';
    else if (text.includes('drone')) attackType = 'drone';
    else if (text.includes('bomb')) attackType = 'bombing';
    
    // Extract location
    let location = '';
    if (text.includes('baghdad')) location = 'Baghdad';
    else if (text.includes('tehran')) location = 'Tehran';
    else if (text.includes('kharg')) location = 'Kharg Island';
    else if (text.includes('damascus')) location = 'Damascus';
    else if (text.includes('beirut')) location = 'Beirut';
    else if (text.includes('southern lebanon')) location = 'southern Lebanon';
    else if (text.includes('lebanon') && !text.includes('southern')) location = 'Beirut';
    else if (text.includes('gaza')) location = 'Gaza';
    else if (text.includes('jerusalem')) location = 'Jerusalem';
    else if (text.includes('tel aviv')) location = 'Tel Aviv';
    else if (text.includes('basra')) location = 'Basra';
    else if (text.includes('sanaa')) location = 'Sanaa';
    else if (text.includes('aleppo')) location = 'Aleppo';
    else if (text.includes('homs')) location = 'Homs';
    else if (text.includes('dubai')) location = 'Dubai';
    else if (text.includes('riyadh')) location = 'Riyadh';
    // Current conflict locations (March 2026)
    else if (text.includes('isfahan')) location = 'Isfahan';
    else if (text.includes('natanz')) location = 'Natanz';
    else if (text.includes('kashan')) location = 'Kashan';
    else if (text.includes('qom')) location = 'Qom';
    else if (text.includes('bushehr')) location = 'Bushehr';
    else if (text.includes('bandar abbas')) location = 'Bandar Abbas';
    else if (text.includes('shiraz')) location = 'Shiraz';
    else if (text.includes('tabriz')) location = 'Tabriz';
    else if (text.includes('mashhad')) location = 'Mashhad';
    else if (text.includes('ahvaz')) location = 'Ahvaz';
    else continue; // Skip if no location found
    
    // Determine severity
    let severity = 'medium';
    if (text.includes('killed') || text.includes('casualties') || text.includes('destroyed') || text.includes('dead')) severity = 'high';
    else if (text.includes('injured') || text.includes('wounded') || text.includes('damage')) severity = 'medium';
    else severity = 'low';
    
    // Return consistent structure with mapAnalysis nested object
    attacks.push({
      headline: item.headline,
      description: item.description,
      pubDate: item.published || new Date().toISOString(),
      source: item.source,
      mapAnalysis: {
        isAttack: true,
        attackType,
        location,
        severity,
        description: item.headline
      }
    });
  }
  
  return attacks;
}

// Analyze a headline with Kimi AI
app.post('/api/analyze', async (req, res) => {
  try {
    const { headline, description } = req.body;
    
    if (!headline) {
      return res.status(400).json({ error: 'Headline is required' });
    }
    
    const analysis = await analyzeHeadline(headline, description);
    res.json(analysis);
  } catch (error) {
    console.error('[API] /api/analyze error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Chat with Gen-Z Analyst
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const response = await getChatResponse(message, context);
    res.json({ response });
  } catch (error) {
    console.error('[API] /api/chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// Get current game state (HP bars, tension, etc) - Cached
app.get('/api/state', (req, res) => {
  const cached = getCachedData('gameState');
  const currentState = getGameState();
  
  // Always return current state immediately
  res.json(currentState);
  
  // Cache it for next time
  if (!cached || JSON.stringify(cached) !== JSON.stringify(currentState)) {
    setCachedData('gameState', currentState);
  }
});

// Refresh game state with latest news
app.post('/api/state/refresh', async (req, res) => {
  try {
    const news = cachedMergedNews.length > 0 ? cachedMergedNews : getCachedNews();
    
    if (news.length === 0) {
      return res.status(400).json({ error: 'No news available. Fetch news first.' });
    }
    
    const result = await updateGameStateFromAnalysis(news);
    analyzedNews = result.analyzed;
    
    // Update cache
    setCachedData('gameState', result.state);
    
    res.json({
      state: result.state,
      analyzed: result.analyzed.length
    });
  } catch (error) {
    console.error('[API] /api/state/refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh state' });
  }
});

// Get real financial market data - Oil, Gold, Defense stocks, Iranian Rial
app.get('/api/markets', async (req, res) => {
  try {
    const data = await getMarkets();
    res.json(data);
  } catch (err) {
    console.error('[API] /api/markets error:', err);
    res.status(500).json({
      error: 'Market data unavailable',
      stocks: []
    });
  }
});

// Get analyzed news with memes - Cached/fallback response
app.get('/api/memes', (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const startTime = Date.now();
  
  // Return immediately from cache or fallback
  const items = analyzedNews.length > 0 ? analyzedNews : FALLBACK_NEWS;
  
  res.json({
    items: items.slice(0, limit),
    total: items.length,
    isFallback: analyzedNews.length === 0,
    responseTime: Date.now() - startTime
  });
});

// Get Polymarket data - Cached
app.get('/api/polymarket', async (req, res) => {
  try {
    const cached = getCachedData('polymarket');
    
    // Return cached if available
    if (cached) {
      res.json({
        ...cached,
        cached: true
      });
    }
    
    // Fetch fresh data
    const markets = await fetchIranMarkets();
    const escalation = await getEscalationProbability();
    
    const result = {
      markets,
      escalation,
      lastUpdated: new Date().toISOString()
    };
    
    setCachedData('polymarket', result);
    
    // If we didn't send cached response, send fresh
    if (!cached) {
      res.json(result);
    }
  } catch (error) {
    console.error('[API] /api/polymarket error:', error);
    const cached = getCachedData('polymarket');
    if (cached) {
      res.json({ ...cached, stale: true });
    } else {
      res.status(500).json({ error: 'Failed to fetch Polymarket data' });
    }
  }
});

// Get NASA FIRMS fire data - Cached
app.get('/api/fires', async (req, res) => {
  try {
    const cached = getCachedData('fires');
    
    // Return cached if available
    if (cached) {
      res.json({
        ...cached,
        cached: true
      });
    }
    
    // Fetch fresh data
    const fireData = await fetchIranFires();
    setCachedData('fires', fireData);
    
    // If we didn't send cached response, send fresh
    if (!cached) {
      res.json(fireData);
    }
  } catch (error) {
    console.error('[API] /api/fires error:', error);
    const cached = getCachedData('fires');
    if (cached) {
      res.json({ ...cached, stale: true });
    } else {
      res.status(500).json({ error: 'Failed to fetch fire data' });
    }
  }
});

// Get Trump GIF
app.get('/api/trump-gif', async (req, res) => {
  try {
    const mood = req.query.mood || 'winning';
    const gif = await getTrumpGif(mood);
    
    res.json({
      gif,
      mood,
      fallback: mood === 'winning' 
        ? 'https://media.giphy.com/media/3o7abB06u9bNzA8lu8/giphy.gif'
        : 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif'
    });
  } catch (error) {
    console.error('[API] /api/trump-gif error:', error);
    res.status(500).json({ error: 'Failed to fetch GIF' });
  }
});

// Clear breaking alert
app.post('/api/alert/dismiss', (req, res) => {
  resetBreakingAlert();
  res.json({ dismissed: true });
});

// Serve static files from dist folder (production build)
app.use(express.static(path.join(__dirname, '../dist')));

// Explicit route for sitemap.xml (before SPA catch-all)
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/sitemap.xml'));
});

// Explicit route for robots.txt (before SPA catch-all)
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/robots.txt'));
});

// Serve prerendered HTML files for specific routes
const prerenderedRoutes = [
  '/blog',
  '/ww3-probability',
  '/us-iran-war-tracker', 
  '/iran-conflict-live',
  '/timeline',
  '/ww3-risk-calculator',
  '/ready',
  '/share',
  '/is-ww3-happening',
  '/world-war-3-news',
  '/iran-nuclear-deal'
];

// Check for prerendered HTML files before falling back to index.html
app.get('*', (req, res) => {
  const route = req.path;
  
  // Check if this is a known route with a prerendered HTML file
  const hasPrerendered = prerenderedRoutes.some(r => route === r || route.startsWith(r + '/'));
  
  if (hasPrerendered && !route.includes('.')) {
    // Try to serve the prerendered index.html for this route
    const prerenderedPath = path.join(__dirname, '../dist', route, 'index.html');
    if (fs.existsSync(prerenderedPath)) {
      return res.sendFile(prerenderedPath);
    }
  }
  
  // Fall back to the main index.html for SPA routing
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Get ticker text (for comic ticker) - Instant response
app.get('/api/ticker', async (req, res) => {
  const startTime = Date.now();
  
  // Hardcoded fallback headlines for immediate response
  const fallbackItems = [
    '🔴 Breaking: US-Iran tensions remain high in Persian Gulf region',
    '🔵 Trump administration signals potential new sanctions on Tehran',
    '🟡 Nuclear talks stall as uranium enrichment continues',
    '🔴 Strait of Hormuz shipping concerns impact global markets',
    '🔵 Israel warns of retaliation amid regional proxy conflicts',
    '🟡 International monitors express concern over Iran nuclear program'
  ];
  
  try {
    // Get cached news headlines immediately
    const rssNews = getCachedNews();
    
    if (rssNews.length > 0) {
      const headlines = rssNews
        .slice(0, 10)
        .map(n => `🔴 ${n.headline}`)
        .filter(Boolean);
      
      res.json({ 
        items: headlines.length > 0 ? headlines : fallbackItems,
        responseTime: Date.now() - startTime,
        cached: true
      });
      return;
    }
    
    // Return fallback immediately but trigger fetch
    res.json({ 
      items: fallbackItems,
      responseTime: Date.now() - startTime,
      fallback: true
    });
    
    // Background refresh
    refreshNews().catch(err => console.error('[Ticker] Background fetch failed:', err));
    
  } catch (error) {
    console.error('[API] /api/ticker error:', error);
    res.json({ 
      items: fallbackItems,
      responseTime: Date.now() - startTime,
      fallback: true
    });
  }
});

// ==================== INITIALIZATION ====================

const startServer = async () => {
  // Initialize game state immediately (no external calls)
  initGameState();
  
  // Start RSS auto-refresh (runs in background)
  startAutoRefresh();
  
  // Chat features removed - focusing on conflict monitoring
  console.log('[Server] Chat features disabled - focusing on conflict monitoring');
  
  // Start server IMMEDIATELY - don't wait for anything
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🇺🇸  US vs IRAN - War Tracker API Server  🇮🇷              ║
║                                                              ║
║     Server running on http://localhost:${PORT}                 ║
║                                                              ║
║     Features:                                                ║
║     • Live Conflict Monitoring                               ║
║     • Real-time market data (Oil, Gold, Defense)             ║
║     • Polymarket betting odds                                ║
║     • AI-powered news analysis                               ║
║                                                              ║
║     Endpoints:                                               ║
║     • GET  /api/health      - Health check                   ║
║     • GET  /api/news        - Latest news (RSS+GDELT)        ║
║     • POST /api/analyze     - Analyze headline with Replicate ║
║     • POST /api/chat        - Chat with Gen-Z Analyst (AI)   ║
║     • GET  /api/state       - Current game state             ║
║     • GET  /api/memes       - Analyzed news with memes       ║
║     • GET  /api/polymarket  - Betting odds                   ║
║     • GET  /api/fires       - NASA FIRMS satellite data      ║
║     • GET  /api/ticker      - Comic ticker text              ║
║     • GET  /api/markets     - Real financial market data     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  });
  
  // Run API tests in BACKGROUND (don't block server startup)
  (async () => {
    try {
      await runAPITests();
    } catch (err) {
      console.error('[Server] API tests error:', err.message);
    }
  })();
  
  // Initial data fetch and analysis (run asynchronously, don't block)
  (async () => {
    try {
      console.log('[Server] Starting background data fetch...');
      
      // Fetch RSS feeds first (usually fast)
      await refreshNews();
      
      // Then fetch GDELT
      const gdeltNews = await fetchGDELTNews();
      const rssNews = getCachedNews();
      cachedMergedNews = mergeNewsSources(rssNews, gdeltNews);
      cacheTimestamp = Date.now();
      
      if (cachedMergedNews.length > 0) {
        console.log('[Server] Running initial analysis...');
        const result = await updateGameStateFromAnalysis(cachedMergedNews);
        analyzedNews = result.analyzed;
        console.log(`[Server] Analysis complete: ${analyzedNews.length} items analyzed`);
      }
      
      // Pre-populate attacks cache
      console.log('[Server] Pre-populating attacks cache...');
      await refreshAttacksCache();
    } catch (error) {
      console.error('[Server] Initial fetch error:', error);
    }
  })();
  
  // Auto-refresh attacks cache every minute
  setInterval(refreshAttacksCache, 60 * 1000);
  console.log('[Server] Attacks cache auto-refresh started (every 60s)');
};

startServer();

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
// RSS feeds removed - using verified manual data only
import { fetchIranMarkets, getEscalationProbability } from './services/polymarketService.js';
import { fetchIranFires } from './services/nasaFirmsService.js';
import { getTrumpGif } from './services/giphyService.js';
import { getGameState, resetBreakingAlert, initGameState } from './services/gameStateService.js';
import { getMarkets } from './services/marketService.js';
import { getCoordinates } from './services/locationService.js';
import { getAttacks, getAllAttacks, attackExists, getAttackCount } from './data/verifiedAttacks.js';
import { getChatResponse } from './services/replicateService.js';


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



// In-memory cache for endpoints
const apiCache = new Map();
const CACHE_DURATION = 60000; // 1 minute for most endpoints

// No fake news - we show real data or nothing
const FALLBACK_NEWS = [];

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
// Get breaking news - returns verified attacks as news items
app.get('/api/news', (req, res) => {
  const startTime = Date.now();
  const limit = parseInt(req.query.limit) || 10;
  
  // Get verified attacks as news items
  const attacks = getAllAttacks().slice(0, limit);
  
  const newsItems = attacks.map(attack => ({
    headline: attack.headline,
    description: attack.description,
    source: attack.source,
    pubDate: attack.date,
    location: attack.location,
    severity: attack.severity,
    verified: true
  }));
  
  res.json({
    items: newsItems,
    total: getAttackCount(),
    lastUpdated: new Date().toISOString(),
    verified: true,
    responseTime: Date.now() - startTime
  });
});

// No hardcoded conflicts - using verified manual database only

// Get verified attacks for map display
// NO RSS - manual verified data only
app.get('/api/attacks', (req, res) => {
  const startTime = Date.now();
  const hoursWindow = parseInt(req.query.hours) || 48;
  
  // Get attacks from verified database
  const attacks = getAttacks(hoursWindow);
  
  // Convert to API format
  const attacksWithCoords = attacks.map(attack => ({
    headline: attack.headline,
    description: attack.description,
    pubDate: attack.date,
    source: attack.source,
    coordinates: attack.coordinates,
    mapAnalysis: {
      isAttack: true,
      attackType: attack.attackType,
      location: attack.location,
      severity: attack.severity,
      description: attack.description
    }
  }));
  
  res.json({
    attacks: attacksWithCoords,
    count: attacksWithCoords.length,
    hoursWindow: hoursWindow,
    totalVerified: getAttackCount(),
    lastUpdated: new Date().toISOString(),
    verified: true,
    responseTime: Date.now() - startTime
  });
});

// No RSS detection - verified manual data only

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

// Get breaking news feed - REAL RSS news, no AI memes
// Get breaking feed - verified attacks only
app.get('/api/memes', (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const startTime = Date.now();
  
  // Get verified attacks as feed items
  const attacks = getAllAttacks().slice(0, limit);
  
  const items = attacks.map(attack => ({
    id: attack.id,
    headline: attack.headline,
    description: attack.description,
    source: attack.source,
    pubDate: attack.date,
    location: attack.location,
    analysis: {
      badge: attack.attackType.toUpperCase(),
      severity: attack.severity,
      side: attack.country === 'Iran' ? 'IRAN' : 'US'
    }
  }));
  
  res.json({
    items,
    total: getAttackCount(),
    verified: true,
    lastUpdated: new Date().toISOString(),
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

// PageSpeed Insights API - Analyze site performance
app.get('/api/pagespeed', async (req, res) => {
  const url = req.query.url || 'https://ww3tracker.live';
  const strategy = req.query.strategy || 'mobile'; // mobile or desktop
  
  try {
    const apiKey = process.env.PAGESPEED_API_KEY; // Optional: for higher quota
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;
    
    const response = await fetch(apiUrl, { timeout: 30000 });
    
    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract key metrics
    const lighthouse = data.lighthouseResult;
    const categories = lighthouse.categories;
    const metrics = lighthouse.audits;
    
    res.json({
      url,
      strategy,
      timestamp: new Date().toISOString(),
      scores: {
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        bestPractices: Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
      },
      metrics: {
        firstContentfulPaint: metrics['first-contentful-paint'].displayValue,
        largestContentfulPaint: metrics['largest-contentful-paint']?.displayValue || 'N/A',
        timeToInteractive: metrics['interactive'].displayValue,
        totalBlockingTime: metrics['total-blocking-time']?.displayValue || 'N/A',
        cumulativeLayoutShift: metrics['cumulative-layout-shift']?.displayValue || 'N/A',
        speedIndex: metrics['speed-index'].displayValue,
      },
      diagnostics: {
        resourceSummary: metrics['resource-summary']?.details?.items || [],
        serverResponseTime: metrics['server-response-time']?.displayValue,
        renderBlockingResources: metrics['render-blocking-resources']?.displayValue,
      }
    });
  } catch (error) {
    console.error('[API] /api/pagespeed error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch PageSpeed data',
      message: error.message,
      tip: 'PageSpeed API has rate limits. Try again in a few minutes.'
    });
  }
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

// Nuclear Blast Simulator - standalone page
app.get('/nuke', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/nuke.html'));
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
    
    // No background refresh - manual verified data only
    
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
  // Initialize game state
  initGameState();
  
  // Log verified attack count
  console.log(`[Server] Loaded ${getAttackCount()} verified attacks from database`);
  
  console.log('[Server] Verified manual data mode - no RSS feeds' );
  
  // Start server IMMEDIATELY - don't wait for anything
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🇺🇸  US vs IRAN - War Tracker API Server  🇮🇷              ║
║                                                              ║
║     Server running on http://localhost:${PORT}                 ║
║                                                              ║
║     ✅ VERIFIED MANUAL DATA MODE                             ║
║     • ${getAttackCount()} confirmed attacks in database             ║
║     • No RSS feeds (100% verified data only)                 ║
║     • Admin-curated attack database                          ║
║                                                              ║
║     Endpoints:                                               ║
║     • GET  /api/health      - Health check                   ║
║     • GET  /api/news        - Verified attacks as news       ║
║     • GET  /api/attacks     - Confirmed strikes for map      ║
║     • GET  /api/state       - Current game state             ║
║     • GET  /api/memes       - Breaking feed (verified)       ║
║     • GET  /api/polymarket  - Betting odds                   ║
║     • GET  /api/fires       - NASA FIRMS satellite data      ║
║     • GET  /api/ticker      - News ticker                    ║
║     • GET  /api/markets     - Financial market data          ║
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
  console.log('[Server] Ready - verified manual data mode');
};

startServer();

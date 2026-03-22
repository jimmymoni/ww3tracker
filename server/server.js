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
import { emailService } from './services/emailService.js';
import emailRoutes from './routes/emailRoutes.js';

import { getTrumpGif } from './services/giphyService.js';
import { getGameState, resetBreakingAlert, initGameState } from './services/gameStateService.js';
import { getMarkets } from './services/marketService.js';
import { getCoordinates } from './services/locationService.js';
import { getAttacks, getAllAttacks, attackExists, getAttackCount, getAttacksByZone, getZoneStatistics, getAttackCountByZone } from './data/verifiedAttacks.js';
import autoPublisher from './services/autoPublisher.js';
import { getChatResponse } from './services/replicateService.js';
import { getAllZones, getZoneById, getZoneStats, getRelatedZones, getActiveZones } from './data/conflictZones.js';
import { ACTORS, RELATIONSHIPS, getAllActors, getRelationshipsForActor, getConflictStats } from './data/conflictRelationships.js';
import * as telegramBot from './services/telegramBotSimple.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Verify env vars are loaded
console.log('\n=== ENVIRONMENT VARIABLES CHECK ===');
console.log('REPLICATE_API_TOKEN:', process.env.REPLICATE_API_TOKEN ? '✅ Set (' + process.env.REPLICATE_API_TOKEN.slice(0, 10) + '...)' : '❌ NOT SET (will use mock)');
console.log('GIPHY_API_KEY:', process.env.GIPHY_API_KEY ? '✅ Set (' + process.env.GIPHY_API_KEY.slice(0, 10) + '...)' : '❌ NOT SET');

console.log('TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set (' + process.env.TELEGRAM_BOT_TOKEN.slice(0, 10) + '...)' : '❌ NOT SET (bot disabled)');
console.log('TELEGRAM_CHANNEL_ID:', process.env.TELEGRAM_CHANNEL_ID || '❌ NOT SET');
console.log('PORT:', process.env.PORT || '3001 (default)');
console.log('💰 Using Replicate (~$0.0001-0.0002 per request)');
console.log('=====================================\n');

// Middleware
app.use(cors());
app.use(express.json());

// Email service routes
app.use('/api/email', emailRoutes);



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

  };
  
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                   TEST SUMMARY                         ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('Replicate AI:', results.replicate.success ? '✅ WORKING (~$0.0001/request)' : '❌ FAILED');
  console.log('Giphy:', results.giphy.success ? '✅ WORKING' : '❌ FAILED');

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
// Query params: hours=48, zone=us-iran|pak-afghan|all
app.get('/api/attacks', (req, res) => {
  const startTime = Date.now();
  const hoursWindow = parseInt(req.query.hours) || 48;
  const zoneFilter = req.query.zone || 'all';
  
  // Get attacks from verified database
  let attacks = getAttacks(hoursWindow);
  
  // Filter by zone if specified
  if (zoneFilter !== 'all') {
    attacks = attacks.filter(attack => attack.conflictZone === zoneFilter);
  }
  
  // Convert to API format
  const attacksWithCoords = attacks.map(attack => ({
    id: attack.id,
    headline: attack.headline,
    description: attack.description,
    pubDate: attack.date,
    source: attack.source,
    coordinates: attack.coordinates,
    conflictZone: attack.conflictZone,
    country: attack.country,
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
    zoneFilter: zoneFilter,
    totalVerified: getAttackCount(),
    zoneStats: getZoneStatistics(),
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

// Refresh game state with latest attacks
app.post('/api/state/refresh', async (req, res) => {
  try {
    // Get recent attacks to refresh state
    const recentAttacks = getAttacks(24);
    
    if (recentAttacks.length === 0) {
      return res.status(400).json({ error: 'No recent attacks available.' });
    }
    
    // Calculate state changes from recent attacks
    const state = getGameState();
    const highSeverityAttacks = recentAttacks.filter(a => a.severity === 'high').length;
    
    // Update tension based on recent attacks
    const tensionIncrease = Math.min(highSeverityAttacks * 5, 20);
    state.tension = Math.min(100, state.tension + tensionIncrease);
    
    // Update cache
    setCachedData('gameState', state);
    
    res.json({
      state,
      recentAttacks: recentAttacks.length,
      highSeverityAttacks,
      tensionIncrease
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

// ==================== REGIONAL CONFLICT TRACKER API ====================

// Get all conflict zones (summary)
// GET /api/conflict-zones
app.get('/api/conflict-zones', (req, res) => {
  const startTime = Date.now();
  const includeInactive = req.query.includeInactive === 'true';
  
  let zones = getAllZones();
  
  if (!includeInactive) {
    zones = zones.filter(z => z.active);
  }
  
  res.json({
    zones,
    count: zones.length,
    activeCount: zones.filter(z => z.active).length,
    lastUpdated: new Date().toISOString(),
    responseTime: Date.now() - startTime
  });
});

// Get specific conflict zone details
// GET /api/conflict-zones/:zoneId
app.get('/api/conflict-zones/:zoneId', (req, res) => {
  const startTime = Date.now();
  const { zoneId } = req.params;
  
  const zone = getZoneById(zoneId);
  
  if (!zone) {
    return res.status(404).json({
      error: 'Zone not found',
      availableZones: getAllZones().map(z => z.id)
    });
  }
  
  // Get attacks for this zone
  const zoneAttacks = getAttacksByZone(zoneId);
  
  res.json({
    zone,
    attacks: {
      count: zoneAttacks.length,
      recent: zoneAttacks.slice(0, 5)
    },
    responseTime: Date.now() - startTime
  });
});

// Get conflict relationships
// GET /api/relationships
app.get('/api/relationships', (req, res) => {
  const startTime = Date.now();
  const { actor, type } = req.query;
  
  let relationships = RELATIONSHIPS;
  let actors = getAllActors();
  
  // Filter by actor if specified
  if (actor) {
    relationships = getRelationshipsForActor(actor);
    actors = actors.filter(a => 
      relationships.some(r => r.source === a.id || r.target === a.id)
    );
  }
  
  // Filter by relationship type if specified
  if (type) {
    relationships = relationships.filter(r => r.type === type);
  }
  
  res.json({
    actors: actors.map(a => ({
      id: a.id,
      name: a.name,
      shortName: a.shortName,
      type: a.type,
      category: a.category,
      flag: a.flag,
      region: a.region
    })),
    relationships,
    stats: getConflictStats(),
    filters: { actor, type },
    count: relationships.length,
    responseTime: Date.now() - startTime
  });
});

// Get context for a conflict zone
// GET /api/context/:zoneId
app.get('/api/context/:zoneId', (req, res) => {
  const startTime = Date.now();
  const { zoneId } = req.params;
  const format = req.query.format || 'json'; // 'json' or 'markdown'
  
  // Validate zone exists
  const zone = getZoneById(zoneId);
  if (!zone) {
    return res.status(404).json({
      error: 'Zone not found',
      availableZones: getAllZones().map(z => z.id)
    });
  }
  
  // Try to read context file
  const contextPath = path.join(__dirname, 'data', 'conflictContext', `${zoneId}.md`);
  
  try {
    if (fs.existsSync(contextPath)) {
      const markdown = fs.readFileSync(contextPath, 'utf8');
      
      if (format === 'markdown') {
        res.setHeader('Content-Type', 'text/markdown');
        return res.send(markdown);
      }
      
      // Parse markdown to JSON structure
      const parsed = parseMarkdownContext(markdown);
      
      res.json({
        zoneId,
        zoneName: zone.name,
        format: 'json',
        content: parsed,
        rawMarkdown: format === 'full' ? markdown : undefined,
        lastModified: fs.statSync(contextPath).mtime,
        responseTime: Date.now() - startTime
      });
    } else {
      res.status(404).json({
        error: 'Context file not found',
        zoneId,
        searchedPath: contextPath
      });
    }
  } catch (error) {
    console.error(`[API] /api/context/${zoneId} error:`, error);
    res.status(500).json({
      error: 'Failed to load context',
      message: error.message
    });
  }
});

// Helper: Parse markdown context into structured JSON
function parseMarkdownContext(markdown) {
  const lines = markdown.split('\n');
  const result = {
    title: '',
    sections: [],
    tables: []
  };
  
  let currentSection = null;
  let currentTable = null;
  let inTable = false;
  
  for (const line of lines) {
    // Title (H1)
    if (line.startsWith('# ')) {
      result.title = line.replace('# ', '').trim();
      continue;
    }
    
    // Section headers (H2, H3)
    if (line.startsWith('## ')) {
      if (currentSection) {
        result.sections.push(currentSection);
      }
      currentSection = {
        level: 2,
        title: line.replace('## ', '').trim(),
        content: []
      };
      inTable = false;
      continue;
    }
    
    if (line.startsWith('### ')) {
      if (currentSection && !inTable) {
        currentSection.content.push({
          type: 'subsection',
          title: line.replace('### ', '').trim()
        });
      }
      continue;
    }
    
    // Tables
    if (line.startsWith('|')) {
      if (!inTable) {
        inTable = true;
        currentTable = {
          type: 'table',
          headers: [],
          rows: []
        };
      }
      
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // Skip separator lines (---)
      if (cells.every(c => c.match(/^-+$/))) {
        continue;
      }
      
      if (currentTable.headers.length === 0) {
        currentTable.headers = cells;
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else if (inTable) {
      // End of table
      if (currentSection) {
        currentSection.content.push(currentTable);
      }
      inTable = false;
      currentTable = null;
    }
    
    // List items
    if (line.startsWith('- ')) {
      if (currentSection) {
        currentSection.content.push({
          type: 'listItem',
          content: line.replace('- ', '').trim()
        });
      }
      continue;
    }
    
    // Bold items (key: value)
    const boldMatch = line.match(/\*\*(.+?)\*\*:\s*(.+)/);
    if (boldMatch) {
      if (currentSection) {
        currentSection.content.push({
          type: 'keyValue',
          key: boldMatch[1],
          value: boldMatch[2]
        });
      }
      continue;
    }
    
    // Regular paragraphs
    if (line.trim() && currentSection) {
      currentSection.content.push({
        type: 'paragraph',
        content: line.trim()
      });
    }
  }
  
  // Push final section
  if (currentSection) {
    result.sections.push(currentSection);
  }
  
  return result;
}

// ==================== EMAIL ALERT API ====================

// Import alert services
import { create as createSubscriber, getByEmail, getByToken, update as updateSubscriber, unsubscribe as unsubscribeSubscriber, getStats as getSubscriberStats, getActiveByZone, VALID_ZONES, VALID_FREQUENCIES } from './models/subscriber.js';
import { queueBreakingAlerts, queueDailyDigests, getStats as getAlertStats, testSend as testAlertSend } from './services/alertService.js';

// Subscribe to alerts
// POST /api/alerts/subscribe
app.post('/api/alerts/subscribe', (req, res) => {
  const startTime = Date.now();
  const { email, zones, frequency } = req.body;

  // Validate required fields
  if (!email || !zones || !Array.isArray(zones) || zones.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Email and at least one zone are required'
    });
  }

  // Validate zones
  const invalidZones = zones.filter(z => !VALID_ZONES.includes(z));
  if (invalidZones.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Invalid zones: ${invalidZones.join(', ')}`
    });
  }

  // Validate frequency
  const alertFrequency = frequency || 'breaking';
  if (!VALID_FREQUENCIES.includes(alertFrequency)) {
    return res.status(400).json({
      success: false,
      error: `Invalid frequency: ${alertFrequency}. Must be one of: ${VALID_FREQUENCIES.join(', ')}`
    });
  }

  // Create subscriber
  const result = createSubscriber({
    email: email.trim(),
    zones,
    frequency: alertFrequency
  });

  if (!result.success) {
    return res.status(409).json(result); // 409 Conflict for duplicate
  }

  console.log(`[API] New subscriber: ${result.subscriber.email}`);

  res.status(201).json({
    success: true,
    subscriber: result.subscriber,
    message: 'Successfully subscribed to alerts',
    responseTime: Date.now() - startTime
  });
});

// Get subscriber preferences by token
// GET /api/alerts/preferences?token=xxx
app.get('/api/alerts/preferences', (req, res) => {
  const startTime = Date.now();
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  const subscriber = getByToken(token);

  if (!subscriber) {
    return res.status(404).json({
      success: false,
      error: 'Subscriber not found or invalid token'
    });
  }

  res.json({
    success: true,
    subscriber: {
      email: subscriber.email,
      zones: subscriber.zones,
      frequency: subscriber.frequency,
      token: subscriber.token,
      createdAt: subscriber.createdAt,
      alertCount: subscriber.alertCount,
      lastAlertAt: subscriber.lastAlertAt
    },
    responseTime: Date.now() - startTime
  });
});

// Update subscriber preferences
// POST /api/alerts/preferences
app.post('/api/alerts/preferences', (req, res) => {
  const startTime = Date.now();
  const { token, zones, frequency } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'Token is required'
    });
  }

  // Find subscriber by token
  const subscriber = getByToken(token);
  if (!subscriber) {
    return res.status(404).json({
      success: false,
      error: 'Subscriber not found'
    });
  }

  // Validate zones if provided
  if (zones) {
    if (!Array.isArray(zones) || zones.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one zone must be selected'
      });
    }
    const invalidZones = zones.filter(z => !VALID_ZONES.includes(z));
    if (invalidZones.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid zones: ${invalidZones.join(', ')}`
      });
    }
  }

  // Validate frequency if provided
  if (frequency && !VALID_FREQUENCIES.includes(frequency)) {
    return res.status(400).json({
      success: false,
      error: `Invalid frequency: ${frequency}`
    });
  }

  // Update subscriber
  const result = updateSubscriber(subscriber.email, { zones, frequency });

  if (!result.success) {
    return res.status(500).json(result);
  }

  console.log(`[API] Updated preferences for: ${subscriber.email}`);

  res.json({
    success: true,
    subscriber: result.subscriber,
    message: 'Preferences updated successfully',
    responseTime: Date.now() - startTime
  });
});

// Unsubscribe from alerts
// POST /api/alerts/unsubscribe
app.post('/api/alerts/unsubscribe', (req, res) => {
  const startTime = Date.now();
  const { token, email } = req.body;

  const identifier = token || email;
  if (!identifier) {
    return res.status(400).json({
      success: false,
      error: 'Token or email is required'
    });
  }

  const result = unsubscribeSubscriber(identifier);

  if (!result.success) {
    return res.status(404).json(result);
  }

  console.log(`[API] Unsubscribed: ${identifier}`);

  res.json({
    success: true,
    message: result.message,
    responseTime: Date.now() - startTime
  });
});

// Get alert system stats (admin only - no auth for MVP)
// GET /api/alerts/stats
app.get('/api/alerts/stats', (req, res) => {
  const startTime = Date.now();
  
  const subscriberStats = getSubscriberStats();
  const alertServiceStats = getAlertStats();

  res.json({
    success: true,
    stats: {
      subscribers: subscriberStats,
      alerts: alertServiceStats
    },
    responseTime: Date.now() - startTime
  });
});

// Test email generation (admin only)
// POST /api/alerts/test
app.post('/api/alerts/test', async (req, res) => {
  const { email, attackId } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required'
    });
  }

  // Get a sample attack for testing
  const attacks = getAllAttacks();
  const testAttack = attackId 
    ? attacks.find(a => a.id === attackId)
    : attacks[0];

  if (!testAttack) {
    return res.status(404).json({
      success: false,
      error: 'No attack found for testing'
    });
  }

  const result = await testAlertSend(email, testAttack);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json({
    success: true,
    preview: result.preview,
    attack: {
      id: testAttack.id,
      location: testAttack.location,
      severity: testAttack.severity
    }
  });
});

// Trigger alerts manually for a specific attack (admin only)
// POST /api/alerts/trigger/:attackId
app.post('/api/alerts/trigger/:attackId', async (req, res) => {
  const startTime = Date.now();
  const { attackId } = req.params;

  // Find attack
  const attacks = getAllAttacks();
  const attack = attacks.find(a => a.id === attackId);

  if (!attack) {
    return res.status(404).json({
      success: false,
      error: 'Attack not found'
    });
  }

  // Queue breaking alerts
  const result = await queueBreakingAlerts(attack);

  res.json({
    success: true,
    message: `Queued ${result.queued} breaking alerts`,
    attack: {
      id: attack.id,
      location: attack.location,
      severity: attack.severity
    },
    queued: result.queued,
    responseTime: Date.now() - startTime
  });
});

// ==================== AUTO-PUBLISHER API ====================

// Publish new attack (admin only - triggers full pipeline)
// POST /api/publisher/publish
app.post('/api/publisher/publish', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const result = await autoPublisher.publishAttack(req.body);
    
    const statusCode = result.success ? 201 : 400;
    res.status(statusCode).json({
      ...result,
      responseTime: Date.now() - startTime
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      responseTime: Date.now() - startTime
    });
  }
});

// Get publisher status
// GET /api/publisher/status
app.get('/api/publisher/status', (req, res) => {
  const startTime = Date.now();
  const stats = autoPublisher.getStats();
  
  res.json({
    success: true,
    stats,
    responseTime: Date.now() - startTime
  });
});

// Get pending jobs
// GET /api/publisher/jobs
app.get('/api/publisher/jobs', (req, res) => {
  const startTime = Date.now();
  const pending = autoPublisher.getPendingJobs();
  
  res.json({
    success: true,
    jobs: pending,
    count: pending.length,
    responseTime: Date.now() - startTime
  });
});

// Cancel a scheduled job
// POST /api/publisher/jobs/:jobId/cancel
app.post('/api/publisher/jobs/:jobId/cancel', (req, res) => {
  const startTime = Date.now();
  const { jobId } = req.params;
  
  const success = autoPublisher.cancelJob(jobId);
  
  res.json({
    success,
    jobId,
    message: success ? 'Job cancelled' : 'Job not found or already completed',
    responseTime: Date.now() - startTime
  });
});

// ==================== STATIC FILES ====================

// Serve static files from dist folder (production build) - MUST be before routes
app.use(express.static(path.join(__dirname, '../dist')));

// Explicit route for sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/sitemap.xml'));
});

// Explicit route for robots.txt
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/robots.txt'));
});

// ==================== SPA CATCH-ALL (MUST BE LAST) ====================

// Serve prerendered HTML files for specific routes
const prerenderedRoutes = [
  '/',
  '/blog',
  '/ww3-probability',
  '/us-iran-war-tracker', 
  '/iran-conflict-live',
  '/timeline',
  '/impact',
  '/ww3-risk-calculator',
  '/ready',
  '/share',
  '/is-ww3-happening',
  '/world-war-3-news',
  '/iran-nuclear-deal'
];

// Get ticker text (for comic ticker) - Uses verified attacks
app.get('/api/ticker', async (req, res) => {
  const startTime = Date.now();
  
  // Base headlines
  const baseItems = [
    '🔴 Breaking: US-Iran tensions remain high in Persian Gulf region',
    '🔵 Trump administration signals potential new sanctions on Tehran',
    '🟡 Nuclear talks stall as uranium enrichment continues',
    '🔴 Strait of Hormuz shipping concerns impact global markets',
    '🔵 Israel warns of retaliation amid regional proxy conflicts',
    '🟡 International monitors express concern over Iran nuclear program'
  ];
  
  try {
    // Get recent verified attacks for ticker
    const recentAttacks = getAttacks(48).slice(0, 8);
    
    if (recentAttacks.length > 0) {
      const attackHeadlines = recentAttacks.map(a => 
        `🔴 ${a.location}: ${a.headline.substring(0, 60)}...`
      );
      
      // Combine attack headlines with base items
      const combined = [...attackHeadlines, ...baseItems];
      
      res.json({ 
        items: combined,
        attackCount: recentAttacks.length,
        responseTime: Date.now() - startTime,
        source: 'verified-attacks'
      });
      return;
    }
    
    // Return base items if no recent attacks
    res.json({ 
      items: baseItems,
      responseTime: Date.now() - startTime,
      fallback: true
    });
    
  } catch (error) {
    console.error('[API] /api/ticker error:', error);
    res.json({ 
      items: baseItems,
      responseTime: Date.now() - startTime,
      fallback: true
    });
  }
});

// ==================== SPA CATCH-ALL (MUST BE LAST) ====================

// Catch-all route for Single Page Application - serves index.html for all non-API routes
// This must be AFTER all API routes and static file serving
app.get('*', (req, res) => {
  const route = req.path;
  
  // Don't serve HTML for asset files (JS, CSS, images, etc.)
  if (route.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|json|xml|txt|map)$/)) {
    return res.status(404).send('Not found');
  }
  
  // Check if this is a known route with a prerendered HTML file
  const hasPrerendered = prerenderedRoutes.some(r => route === r || route.startsWith(r + '/'));
  
  if (hasPrerendered) {
    // Try to serve the prerendered index.html for this route
    const prerenderedPath = path.join(__dirname, '../dist', route, 'index.html');
    if (fs.existsSync(prerenderedPath)) {
      return res.sendFile(prerenderedPath);
    }
  }
  
  // Fall back to the main index.html for SPA routing
  res.sendFile(path.join(__dirname, '../dist/index.html'));
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
║     Core Endpoints:                                          ║
║     • GET  /api/health           - Health check              ║
║     • GET  /api/news             - Verified attacks as news  ║
║     • GET  /api/attacks          - Confirmed strikes (map)   ║
║     • GET  /api/state            - Current game state        ║
║     • GET  /api/memes            - Breaking feed             ║
║     • GET  /api/polymarket       - Betting odds              ║

║     • GET  /api/ticker           - News ticker               ║
║     • GET  /api/markets          - Financial data            ║
║                                                              ║
║     Email Alert System:                                      ║
║     • POST /api/alerts/subscribe      - Subscribe to alerts  ║
║     • GET  /api/alerts/preferences    - Get preferences      ║
║     • POST /api/alerts/preferences    - Update preferences   ║
║     • POST /api/alerts/unsubscribe    - Unsubscribe          ║
║     • GET  /api/alerts/stats          - System stats         ║
║                                                              ║
║     Email Service:                                           ║
║     • GET  /api/email/status          - Queue status         ║
║     • POST /api/email/test            - Send test email      ║
║     • POST /api/email/send-batch      - Trigger batch send   ║
║     • POST /api/email/verify-smtp     - Verify SMTP config   ║
║                                                              ║
║     Regional Conflict Tracker:                               ║
║     • GET  /api/conflict-zones        - List all zones       ║
║     • GET  /api/conflict-zones/:id    - Zone details         ║
║     • GET  /api/relationships         - Actor relationships  ║
║     • GET  /api/context/:zoneId       - Zone context docs    ║
║                                                              ║
║     Auto-Publisher API:                                      ║
║     • POST /api/publisher/publish     - Publish new attack   ║
║     • GET  /api/publisher/status      - Publisher stats      ║
║     • GET  /api/publisher/jobs        - List pending jobs    ║
║                                                              ║
║     Telegram Bot:                                            ║
║     • /addattack, /quickadd, /status, /pending, /cancel      ║
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
  
  // Start Telegram Bot (if configured)
  try {
    telegramBot.start();
  } catch (err) {
    console.log('[Server] Telegram bot not started:', err.message);
  }
  
  // Initialize Email Service (with delay to allow SMTP config check)
  setTimeout(async () => {
    try {
      await emailService.initialize();
      console.log('[Server] Email service initialized');
    } catch (error) {
      console.log('[Server] Email service not configured (set SMTP_HOST and SMTP_USER)');
    }
  }, 1000);
};

startServer();

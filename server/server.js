import dotenv from 'dotenv';
// Load env vars FIRST before anything else
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Services
import { fetchAllRSSFeeds, startAutoRefresh, getCachedNews } from './services/rssService.js';
import { fetchGDELTNews, mergeNewsSources } from './services/gdeltService.js';
import { analyzeHeadline, getChatResponse } from './services/replicateService.js';
import { fetchIranMarkets, getEscalationProbability } from './services/polymarketService.js';
import { fetchIranFires } from './services/nasaFirmsService.js';
import { getTrumpGif } from './services/giphyService.js';
import { updateGameStateFromAnalysis, getGameState, resetBreakingAlert, initGameState } from './services/gameStateService.js';
import { getMarkets, isWarMode } from './services/marketService.js';
import { 
  setSocketIO, 
  setAddMessageFn, 
  startBotMessageLoop, 
  sendBotMessage, 
  triggerBotMessage,
  recordUserMessage,
  updateLiveDataCache
} from './services/botMessageService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
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

// ==================== SOCKET.IO LIVE CHAT ====================
const connectedUsers = new Map();
let usWinPercent = 73; // Starting percentage

// Realistic viewer count simulation
let currentViewerCount = 800 + Math.floor(Math.random() * 200); // Start 800-1000
let viewerCountInterval = null;

// Initialize realistic viewer count fluctuations
const startViewerCountSimulation = () => {
  // Update viewer count every 5-15 seconds with small realistic changes
  const updateCount = () => {
    const delay = 5000 + Math.random() * 10000; // 5-15 seconds
    
    setTimeout(() => {
      // Small realistic fluctuation (-15 to +20 viewers)
      const change = Math.floor(Math.random() * 36) - 15;
      currentViewerCount = Math.max(600, Math.min(1500, currentViewerCount + change));
      
      // Broadcast to all clients
      io.emit('viewerUpdate', { count: currentViewerCount });
      
      updateCount();
    }, delay);
  };
  
  updateCount();
};

// Get current viewer count
const getFakeViewerCount = () => currentViewerCount;

// Generate bot usernames (fallback)
const generateBotName = () => {
  const prefixes = ['Chaos', 'Doom', 'War', 'Nuke', 'Shadow', 'Spy', 'Agent', 'Rogue'];
  const suffixes = ['99', '007', '42', 'X', 'Prime', 'Elite', 'Dark', 'Stealth'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}_${Math.floor(Math.random() * 999)}`;
};

// Socket.io connection handling
io.on('connection', (socket) => {
  const userId = socket.id;
  const username = generateBotName();
  const side = Math.random() > 0.5 ? 'us' : 'iran';
  
  connectedUsers.set(userId, { username, side, joinTime: Date.now() });
  
  // Send initial data (with FAKE viewer count)
  socket.emit('init', {
    username,
    viewerCount: getFakeViewerCount(),
    usWinPercent,
    messages: recentMessages.slice(-20)
  });
  
  // Broadcast user joined (with FAKE count)
  io.emit('userJoined', {
    count: getFakeViewerCount(),
    message: `${username} joined the war room`
  });
  
  // Send welcome bot message occasionally (30% chance)
  if (Math.random() < 0.3) {
    setTimeout(() => {
      const welcomeTexts = [
        `yo ${username} just joined, got any hot tips? 🎰`,
        `new trader ${username} in the war room 📈`,
        `${username} pulled up, whats your position? 📊`,
        `welcome ${username}, YOLO or nothing here 🚀`,
      ];
      const text = welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)];
      sendBotMessage('random', text);
    }, 3000);
  }
  
  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const user = connectedUsers.get(userId);
    if (!user) return;
    
    // Rate limiting check (handled client-side too, but double check here)
    const now = Date.now();
    if (user.lastMessage && now - user.lastMessage < 5000) {
      socket.emit('error', { message: 'Rate limit: Wait 5 seconds' });
      return;
    }
    
    // Profanity filter (basic)
    const filtered = data.text
      .replace(/fuck/gi, 'f***')
      .replace(/shit/gi, 's***')
      .replace(/bitch/gi, 'b****')
      .substring(0, 150); // Max 150 chars
    
    const message = {
      id: Date.now(),
      username: user.username,
      side: user.side,
      text: filtered,
      timestamp: now
    };
    
    addMessage(message);
    user.lastMessage = now;
    recordUserMessage(); // Track for bot timing
    
    io.emit('newMessage', message);
    
    // Sometimes respond to user messages (20% chance, after 8 second delay)
    if (Math.random() < 0.2) {
      setTimeout(() => {
        const responses = [
          `${user.username} with the alpha 📈`,
          `^ this guy's DD is solid 👆`,
          `${user.username} speaking the language of gods 💰`,
          `someone follow ${user.username}'s trades 📊`,
          `${user.username} trying to front-run the news 🏃`,
        ];
        const text = responses[Math.floor(Math.random() * responses.length)];
        sendBotMessage('random', text);
      }, 8000);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(userId);
    io.emit('userLeft', { count: getFakeViewerCount() });
  });
});

// Recent messages buffer
const recentMessages = [];
const MAX_MESSAGES = 50;

const addMessage = (msg) => {
  recentMessages.push(msg);
  if (recentMessages.length > MAX_MESSAGES) {
    recentMessages.shift();
  }
};

// Export triggerBotMessage for use by other services
export { triggerBotMessage };

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
      badge: "W 🏆",
      memeCaption: "US hitting them where it hurts - the bag 💰 no cap",
      tickerText: "Sanctions go brrr 📉"
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
      badge: "BREAKING 💥",
      memeCaption: "The whole region is giving main character energy rn 🎭",
      tickerText: "Proxy wars popping off 📢"
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
      badge: "SUS 👀",
      memeCaption: "Nuclear program looking kinda sus ngl 👀☢️",
      tickerText: "Uranium levels rising 📈"
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

// Run all tests before starting server
const runAPITests = async () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║           RUNNING API CONNECTION TESTS                 ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  const results = {
    replicate: await testReplicateAPI(),
    giphy: await testGiphyAPI(),
    nasa: await testNasaFirmsAPI()
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
    console.log('🎉 Core APIs are working! Starting server...\n');
  } else {
    console.log('⚠️ Some APIs failed. Starting server with fallbacks...\n');
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
    
    // No cache - return fallback immediately, then populate cache
    console.log('[News] No cache, returning fallback immediately');
    res.json({
      items: FALLBACK_NEWS.slice(0, limit),
      total: FALLBACK_NEWS.length,
      lastUpdated: new Date().toISOString(),
      fallback: true,
      responseTime: Date.now() - startTime
    });
    
    // Populate cache in background
    (async () => {
      try {
        const rssNews = getCachedNews();
        if (rssNews.length === 0) {
          await fetchAllRSSFeeds();
        }
        const gdeltNews = await fetchGDELTNews();
        cachedMergedNews = mergeNewsSources(getCachedNews(), gdeltNews);
        cacheTimestamp = Date.now();
        console.log('[News] Cache populated, items:', cachedMergedNews.length);
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

// Serve index.html for all other routes (SPA routing)
app.get('*', (req, res) => {
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
    fetchAllRSSFeeds().catch(err => console.error('[Ticker] Background fetch failed:', err));
    
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
  // Run API tests first
  await runAPITests();
  
  // Initialize game state
  initGameState();
  
  // Start RSS auto-refresh
  startAutoRefresh();
  
  // Initialize bot message service
  setSocketIO(io);
  setAddMessageFn(addMessage);
  startBotMessageLoop();
  console.log('[Server] Bot message loop started');
  
  // Start realistic viewer count simulation
  startViewerCountSimulation();
  console.log(`[Server] Viewer count simulation started (${currentViewerCount} viewers)`);
  
  // Start server IMMEDIATELY (don't wait for data fetch)
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🇺🇸  US vs IRAN - War Tracker API Server  🇮🇷              ║
║                                                              ║
║     Server running on http://localhost:${PORT}                 ║
║                                                              ║
║     Features:                                                ║
║     • Live Chat with fake user bots                          ║
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
  
  // Initial data fetch and analysis (run asynchronously, don't block)
  (async () => {
    try {
      console.log('[Server] Starting background data fetch...');
      
      // Fetch RSS feeds first (usually fast)
      await fetchAllRSSFeeds();
      
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
    } catch (error) {
      console.error('[Server] Initial fetch error:', error);
    }
  })();
};

startServer();

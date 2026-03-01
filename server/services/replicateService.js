import fetch from 'node-fetch';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
// Read env var at function call time to ensure it's loaded
const getToken = () => process.env.REPLICATE_API_TOKEN;

// Cheap models on Replicate (under $0.001 per request)
const CHEAP_MODELS = {
  // Llama 3.2 3B - Fast and cheap (~$0.0001 per request)
  llama3: 'meta/meta-llama-3-8b-instruct',
  // Mistral 7B - Good balance (~$0.0002 per request)  
  mistral: 'mistralai/mistral-7b-instruct-v0.2',
  // Llama 2 7B - Cheapest option (~$0.0001 per request)
  llama2: 'meta/llama-2-7b-chat',
};

// Use the cheapest model
const DEFAULT_MODEL = CHEAP_MODELS.llama3;

// Badge selection based on headline keywords
const getBadgeFromHeadline = (headline) => {
  const lower = headline.toLowerCase();
  
  // BREAKING 💥 - violent/attack keywords
  if (/\b(killed|struck|missiles|attack|strikes|bombed|explosion|casualties|death|dead)\b/.test(lower)) {
    return 'BREAKING 💥';
  }
  
  // YIKES 😬 - warning/threat keywords
  if (/\b(warns|threatens|threat|warning|retaliation|revenge|promises|vows)\b/.test(lower)) {
    return 'YIKES 😬';
  }
  
  // SUS 👀 - diplomatic/talks keywords
  if (/\b(talks|diplomatic|diplomacy|negotiations|peace|meeting|discuss|agreement)\b/.test(lower)) {
    return 'SUS 👀';
  }
  
  // Default OOF 💀
  return 'OOF 💀';
};

const BADGES = ['BREAKING 💥', 'YIKES 😬', 'SUS 👀', 'OOF 💀', 'W 🏆', 'L 💀'];

// Rate limiting state
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 11000; // 11 seconds between requests (5.5 req/min to be safe)
let consecutiveErrors = 0;
const MAX_CONSECUTIVE_ERRORS = 3;

// Cache for AI responses to reduce API calls
const responseCache = new Map();
const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

const getHeaders = () => ({
  'Authorization': `Token ${getToken()}`,
  'Content-Type': 'application/json',
});

// Generate cache key from headline
const getCacheKey = (headline) => {
  return headline.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Get cached response if available
const getCachedResponse = (key) => {
  const cached = responseCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log('[Replicate] Cache hit for:', key.substring(0, 50) + '...');
    return cached.data;
  }
  return null;
};

// Cache a response
const setCachedResponse = (key, data) => {
  // Remove oldest entries if cache is full
  if (responseCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, { data, timestamp: Date.now() });
};

// Rate limiter with exponential backoff
const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const delay = Math.max(0, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  
  // Add exponential backoff if we've had errors
  const backoffDelay = Math.min(1000 * Math.pow(2, consecutiveErrors), 60000);
  const totalDelay = delay + backoffDelay;
  
  if (totalDelay > 0) {
    console.log(`[Replicate] Rate limiting: waiting ${Math.round(totalDelay / 1000)}s...`);
    await new Promise(r => setTimeout(r, totalDelay));
  }
  
  lastRequestTime = Date.now();
};

// Poll for prediction result with retry
const waitForPrediction = async (url, maxAttempts = 30, retryCount = 0) => {
  const MAX_RETRIES = 3;
  
  try {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(url, { 
        headers: getHeaders(),
        timeout: 10000
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Check for rate limiting
        if (response.status === 429 || errorText.includes('throttled')) {
          consecutiveErrors++;
          
          if (retryCount < MAX_RETRIES) {
            const retryDelay = Math.min(15000 * Math.pow(2, retryCount), 60000);
            console.log(`[Replicate] Rate limited, retrying in ${retryDelay / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            await new Promise(r => setTimeout(r, retryDelay));
            return waitForPrediction(url, maxAttempts, retryCount + 1);
          }
          
          throw new Error('Rate limited after retries');
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'succeeded') {
        consecutiveErrors = 0; // Reset error count on success
        return result.output;
      }
      if (result.status === 'failed') {
        throw new Error(result.error || 'Prediction failed');
      }
      
      // Wait before next poll
      await new Promise(r => setTimeout(r, 500));
    }
    
    throw new Error('Prediction timed out');
  } catch (error) {
    if (retryCount < MAX_RETRIES && error.message.includes('timeout')) {
      console.log(`[Replicate] Timeout, retrying... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await new Promise(r => setTimeout(r, 5000));
      return waitForPrediction(url, maxAttempts, retryCount + 1);
    }
    throw error;
  }
};

export const analyzeHeadline = async (headline, description = '') => {
  const token = getToken();
  if (!token) {
    console.log('[Replicate] No API token, using mock analysis');
    return getMockAnalysis(headline);
  }

  // Check cache first
  const cacheKey = getCacheKey(headline);
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Apply rate limiting
    await waitForRateLimit();

    const determinedBadge = getBadgeFromHeadline(headline);
    
    const prompt = `You are a Gen-Z war analyst. Analyze this news about US-Iran conflict.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Respond with ONLY a JSON object in this exact format:
{
  "side": "US" or "IRAN" or "NEUTRAL",
  "score": number between -5 and 5 (negative favors Iran, positive favors US),
  "severity": "low" or "medium" or "high",
  "badge": "${determinedBadge}",
  "memeCaption": "funny gen-z reaction",
  "tickerText": "short funny version (max 8 words)"
}

CRITICAL RULES FOR MEME CAPTION:
- Write a UNIQUE funny Gen-Z reaction to THIS specific headline
- NEVER repeat the same caption twice - make it original!
- Max 8 words
- No full sentences
- Use slang: fr fr, no cap, caught an L, slay, bestie, 💀🔥😭
- Be creative and specific to this headline

Rules:
- Use Gen-Z slang: fr fr, no cap, bussin, caught an L, slay, bestie, 💀🔥😭🦅
- Badge is pre-selected as "${determinedBadge}" based on headline keywords
- Be funny but informative
- Return ONLY valid JSON, no markdown`;

    // Create prediction
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        version: DEFAULT_MODEL,
        input: {
          prompt: prompt,
          max_tokens: 300,
          temperature: 0.7,
        }
      }),
      timeout: 30000
    });

    if (!response.ok) {
      const error = await response.text();
      
      // Handle rate limiting
      if (response.status === 429 || error.includes('throttled')) {
        consecutiveErrors++;
        console.warn('[Replicate] Rate limited:', error);
        
        // Return mock analysis but mark it as rate-limited
        const mockAnalysis = getMockAnalysis(headline);
        mockAnalysis._rateLimited = true;
        return mockAnalysis;
      }
      
      console.error('[Replicate] API error:', error);
      return getMockAnalysis(headline);
    }

    const prediction = await response.json();
    
    // Wait for result
    const output = await waitForPrediction(prediction.urls.get);
    
    // Parse the response (Replicate returns array of strings)
    const rawText = Array.isArray(output) ? output.join('') : output;
    
    // Extract JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Replicate] No JSON found:', rawText);
      return getMockAnalysis(headline);
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    const result = {
      side: ['US', 'IRAN', 'NEUTRAL'].includes(analysis.side) ? analysis.side : 'NEUTRAL',
      score: Math.max(-5, Math.min(5, analysis.score || 0)),
      severity: ['low', 'medium', 'high'].includes(analysis.severity) ? analysis.severity : 'medium',
      badge: getBadgeFromHeadline(headline), // Use keyword-based badge selection
      memeCaption: (analysis.memeCaption || 'Bestie something happened fr fr 💀').replace(/[.!?]+$/g, ''),
      tickerText: analysis.tickerText || 'News dropped, no cap 📰'
    };
    
    // Cache the successful response
    setCachedResponse(cacheKey, result);
    consecutiveErrors = 0;
    
    console.log('[Replicate] Analysis cost: ~$0.0001-0.0002');
    
    return result;
  } catch (error) {
    console.error('[Replicate] Analysis error:', error.message);
    consecutiveErrors++;
    return getMockAnalysis(headline);
  }
};

export const getChatResponse = async (userMessage, context = '') => {
  const token = getToken();
  if (!token) {
    console.log('[Replicate] No API token, using mock chat');
    return getMockChatResponse();
  }

  try {
    // Apply rate limiting
    await waitForRateLimit();

    const systemPrompt = `You are a Gen-Z war analyst who speaks only in brainrot slang.
Use: fr fr, no cap, bussin, caught an L, slay, it's giving, bestie, 💀🔥😭🦅, mid, rizz, gyatt, skibidi, sigma
Max 3 sentences. Be funny. Explain Iran/US news in slang only.`;

    const fullPrompt = context 
      ? `${systemPrompt}\n\nContext: ${context}\n\nUser: ${userMessage}`
      : `${systemPrompt}\n\nUser: ${userMessage}`;

    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        version: DEFAULT_MODEL,
        input: {
          prompt: fullPrompt,
          max_tokens: 150,
          temperature: 0.9,
        }
      }),
      timeout: 30000
    });

    if (!response.ok) {
      const error = await response.text();
      
      if (response.status === 429 || error.includes('throttled')) {
        consecutiveErrors++;
        console.warn('[Replicate] Chat rate limited');
        return getMockChatResponse();
      }
      
      console.error('[Replicate] Chat API error:', error);
      return getMockChatResponse();
    }

    const prediction = await response.json();
    const output = await waitForPrediction(prediction.urls.get);
    
    const rawText = Array.isArray(output) ? output.join('') : output;
    
    consecutiveErrors = 0;
    console.log('[Replicate] Chat cost: ~$0.0001');
    
    return rawText.trim() || getMockChatResponse();
  } catch (error) {
    console.error('[Replicate] Chat error:', error.message);
    consecutiveErrors++;
    return getMockChatResponse();
  }
};

// Batch analyze multiple headlines with smart queuing
export const analyzeHeadlinesBatch = async (items) => {
  const results = [];
  let apiCallsMade = 0;
  const MAX_API_CALLS = 5; // Limit API calls per batch
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      // Check cache first
      const cacheKey = getCacheKey(item.headline);
      const cached = getCachedResponse(cacheKey);
      
      if (cached) {
        // Use cached result, doesn't count against rate limit
        results.push({ ...item, analysis: cached });
      } else if (apiCallsMade < MAX_API_CALLS && consecutiveErrors < MAX_CONSECUTIVE_ERRORS) {
        // Make API call
        const analysis = await analyzeHeadline(item.headline, item.description);
        results.push({ ...item, analysis });
        apiCallsMade++;
        
        // Mark if it was rate limited
        if (analysis._rateLimited) {
          console.log(`[Replicate] Item ${i + 1} was rate-limited, using mock`);
        }
      } else {
        // Use mock analysis for remaining items
        const mockAnalysis = getMockAnalysis(item.headline);
        results.push({ ...item, analysis: mockAnalysis });
        
        if (apiCallsMade >= MAX_API_CALLS) {
          mockAnalysis._skipped = true;
        }
      }
    } catch (error) {
      console.error(`[Replicate] Batch error for item ${i}:`, error);
      results.push({ ...item, analysis: getMockAnalysis(item.headline) });
    }
  }
  
  console.log(`[Replicate] Batch complete: ${apiCallsMade} API calls, ${results.length - apiCallsMade} cached/mock`);
  
  return results;
};

// Get rate limit status
export const getRateLimitStatus = () => ({
  consecutiveErrors,
  lastRequestTime,
  cacheSize: responseCache.size,
  isHealthy: consecutiveErrors < MAX_CONSECUTIVE_ERRORS
});

// Mock responses
const getMockAnalysis = (headline) => {
  const lower = headline.toLowerCase();
  
  // Use keyword-based badge selection for mock too
  const badge = getBadgeFromHeadline(headline);
  
  if (lower.includes('trump') || lower.includes('us') || lower.includes('sanction')) {
    return {
      side: 'US',
      score: Math.floor(Math.random() * 3) + 2,
      severity: 'medium',
      badge: badge,
      memeCaption: 'US out here catching dubs fr fr, no cap 🦅💪',
      tickerText: 'US secured the bag 💰',
      _mock: true
    };
  } else if (lower.includes('iran') && (lower.includes('threat') || lower.includes('warn'))) {
    return {
      side: 'IRAN',
      score: -(Math.floor(Math.random() * 3) + 2),
      severity: 'high',
      badge: badge,
      memeCaption: 'Iran really said "hold my tea" and went off 🍵💀',
      tickerText: 'Iran cooking something fr 🔥',
      _mock: true
    };
  }
  
  return {
    side: 'NEUTRAL',
    score: 0,
    severity: 'low',
    badge: badge,
    memeCaption: 'Something sus happening bestie, stay woke 👀',
    tickerText: 'Plot thickening... 🍿',
    _mock: true
  };
};

const MOCK_QUIPS = [
  "bro iran just caught an L fr fr 💀",
  "US said no cap we bussin today 🦅",
  "this ain't it chief 😭",
  "the plot thickens bestie 🍵",
  "iran is literally giving main character energy rn 🎭",
  "yooo did they just hit the griddy on em? 🕺",
  "mid take from the ayatollah ngl 💤",
  "US out here ratioing iran hard 📊",
  "someone's about to get cancelled irl 💥",
  "the way they're beefing rn... unhinged behavior 🎪",
];

const getMockChatResponse = () => {
  return MOCK_QUIPS[Math.floor(Math.random() * MOCK_QUIPS.length)];
};

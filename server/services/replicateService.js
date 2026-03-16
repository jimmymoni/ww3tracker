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
  
  // BREAKING - violent/attack keywords
  if (/\b(killed|struck|missiles|attack|strikes|bombed|explosion|casualties|death|dead)\b/.test(lower)) {
    return 'BREAKING';
  }
  
  // ESCALATION - warning/threat keywords
  if (/\b(warns|threatens|threat|warning|retaliation|revenge|promises|vows)\b/.test(lower)) {
    return 'ESCALATION';
  }
  
  // INTELLIGENCE - diplomatic/talks keywords
  if (/\b(talks|diplomatic|diplomacy|negotiations|peace|meeting|discuss|agreement)\b/.test(lower)) {
    return 'INTELLIGENCE';
  }
  
  // Default
  return 'CONFIRMED';
};

const BADGES = ['BREAKING', 'ESCALATION', 'INTELLIGENCE', 'CASUALTIES', 'CONFIRMED', 'DISPUTED'];

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
    
    const prompt = `You are a military intelligence analyst. Analyze this US-Iran conflict news.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Respond with ONLY a JSON object in this exact format:
{
  "side": "US" or "IRAN" or "NEUTRAL",
  "score": number between -5 and 5 (negative favors Iran, positive favors US),
  "severity": "low" or "medium" or "high",
  "badge": "${determinedBadge}",
  "analysis": "professional military assessment",
  "tickerText": "concise factual summary (max 10 words)"
}

CRITICAL RULES FOR ANALYSIS:
- Write a professional military intelligence assessment
- Focus on tactical and strategic implications
- Maximum 20 words
- No slang or informal language
- Be objective and factual

Examples of professional analysis:
- "Iranian military infrastructure sustaining significant damage from precision strikes"
- "US carrier deployment signals elevated readiness posture in region"
- "Proxy escalation risks drawing in additional regional actors"

Rules:
- Badge is pre-selected as "${determinedBadge}" based on headline keywords
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
      analysis: (analysis.analysis || 'Military development requires monitoring').replace(/[.!?]+$/g, ''),
      tickerText: analysis.tickerText || 'Conflict update'
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

    const systemPrompt = `You are a military intelligence analyst providing brief, factual assessments of US-Iran conflict developments.
Maximum 3 sentences. Objective tone. No speculation. Focus on verified facts and tactical implications.`;

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
      analysis: 'US military or diplomatic advantage gained in region',
      tickerText: 'US operational success reported',
      _mock: true
    };
  } else if (lower.includes('iran') && (lower.includes('threat') || lower.includes('warn'))) {
    return {
      side: 'IRAN',
      score: -(Math.floor(Math.random() * 3) + 2),
      severity: 'high',
      badge: badge,
      analysis: 'Iranian forces conducting offensive operations',
      tickerText: 'Iranian military action confirmed',
      _mock: true
    };
  }
  
  return {
    side: 'NEUTRAL',
    score: 0,
    severity: 'low',
    badge: badge,
    analysis: 'Military development requires monitoring',
    tickerText: 'Conflict situation developing',
    _mock: true
  };
};

const MOCK_QUIPS = [
  "Escalation in the Gulf region continues to concern international observers",
  "Sanctions pressure mounting on Iranian economy with measurable impact",
  "Military posture suggests preparation for extended conflict duration",
  "Diplomatic channels remain technically open but severely strained",
  "Regional allies monitoring situation closely for expansion indicators",
];

const getMockChatResponse = () => {
  return MOCK_QUIPS[Math.floor(Math.random() * MOCK_QUIPS.length)];
};

// ========== MAP ATTACK ANALYSIS ==========

const analyzeForMapPrompt = (headline, description) => `
You are a military intelligence analyst. Determine if this news describes a CONFIRMED military strike/attack/incident that ALREADY HAPPENED.

Headline: "${headline}"
${description ? `Description: "${description}"` : ''}

Respond with ONLY a JSON object:
{
  "isAttack": true | false,
  "attackType": "airstrike" | "missile" | "drone" | "bombing" | "shelling" | "plane" | "none",
  "location": "city or region name",
  "severity": "high" | "medium" | "low",
  "description": "brief factual description"
}

CRITICAL RULES - isAttack MUST be FALSE if:
- Headline starts with "What is happening", "Why did", "How will" (analysis/explainer)
- Contains "says it has", "claims", "reports" (unconfirmed statements)
- Contains "live updates", "crisis live", "as it happened" (rolling coverage)
- Contains "what we know", "explained", "analysis", "Q&A"
- Is about diplomatic talks, negotiations, or political statements
- Is a retrospective/summary piece ("day 16 of", "week 3 of")

isAttack ONLY TRUE if:
- Explicit confirmed strike/incident ALREADY occurred (not planned, not threatened)
- Uses active voice: "struck", "hit", "bombed", "destroyed", "damaged", "crashed", "downed"
- Mentions specific casualties or physical damage
- Reports actual explosions/military action/aircraft incidents, not statements about action

Examples of FALSE (not attacks):
- "What is happening on day 16" - ANALYSIS
- "Israel says it has launched strikes" - STATEMENT/UNCONFIRMED
- "Crisis live: Latest updates" - ROLLING COVERAGE
- "Why did Iran attack?" - EXPLAINER

Examples of TRUE (confirmed attacks/incidents):
- "Missile strikes hit Tehran military base, 12 killed" - CONFIRMED
- "Explosions rock Isfahan nuclear facility" - CONFIRMED
- "US warplanes destroy Iranian radar installations" - CONFIRMED
- "US refuelling plane crashes in Iraq, 6 crew killed" - CONFIRMED (attackType: "plane")
- "Drone shot down over Kuwait" - CONFIRMED (attackType: "drone")

Known locations: Tehran, Isfahan, Kharg Island, Baghdad, Basra, Dubai, Kuwait, Bahrain, Jordan, Tel Aviv, Jerusalem, Beirut, Damascus, Gaza, Riyadh, Doha, Sanaa, Hamadan, Chabahar, etc.

Return ONLY JSON.
`;

export const analyzeForMap = async (headline, description = '') => {
  const token = getToken();
  const lower = (headline + ' ' + description).toLowerCase();
  
  // STRICT pre-filter: Skip analysis, explainers, statements, live blogs, humanitarian
  const analysisKeywords = /\b(what is happening|what we know|explained|analysis|why did|how will|day \d+ of|week \d+ of|live updates|as it happened|crisis live|q&A|podcast|video|opinion|editorial)\b/;
  const statementKeywords = /\b(says it has|claims to have|reports that|allegedly|reportedly)\b/;
  const diplomaticKeywords = /\b(talks|negotiations|diplomatic|peace deal|ceasefire talks|foreign minister|envoy|embassy)\b/;
  const humanitarianKeywords = /\b(humanitarian crisis|deepening the crisis|aid|relief|humanitarian|refugees|displaced|civilians suffer)\b/;
  const aftermathKeywords = /\b(aftermath|cleanup|recovery|rebuilding|funeral|mourning|memorial|probe|investigation)\b/;
  
  if (analysisKeywords.test(lower) || statementKeywords.test(lower) || diplomaticKeywords.test(lower) || 
      humanitarianKeywords.test(lower) || aftermathKeywords.test(lower)) {
    console.log(`[MapAnalysis] Skipped (analysis/statement/humanitarian): "${headline.substring(0, 60)}..."`);
    return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
  }
  
  // Must have concrete attack keywords in active voice (including aircraft incidents)
  const hasActiveAttack = /\b(struck|hit|bombed|destroyed|damaged|explosion|exploded|fired on|launched (missile|strike|attack)|was attacked|crashes|crashed|crash|downed|shot down|emergency landing|wreckage found)\b/i.test(lower);
  if (!hasActiveAttack) {
    console.log(`[MapAnalysis] Skipped (no active attack keywords): "${headline.substring(0, 60)}..."`);
    return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
  }
  
  if (!token) {
    return getMockMapAnalysis(headline, description);
  }

  try {
    await waitForRateLimit();
    
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        version: DEFAULT_MODEL,
        input: {
          prompt: analyzeForMapPrompt(headline, description),
          max_tokens: 200,
          temperature: 0.3,
        }
      }),
      timeout: 30000
    });

    if (!response.ok) {
      console.log(`[MapAnalysis] AI API error ${response.status}, using fallback`);
      return getMockMapAnalysis(headline, description);
    }

    const prediction = await response.json();
    const output = await waitForPrediction(prediction.urls.get);
    
    const rawText = Array.isArray(output) ? output.join('') : output;
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return getMockMapAnalysis(headline, description);
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return {
      isAttack: analysis.isAttack || false,
      attackType: analysis.attackType || 'none',
      location: analysis.location || '',
      severity: analysis.severity || 'low',
      description: analysis.description || ''
    };
  } catch (error) {
    return getMockMapAnalysis(headline, description);
  }
};

const getMockMapAnalysis = (headline, description) => {
  const lower = (headline + ' ' + description).toLowerCase();
  
  // STRICT: Skip analysis pieces, statements, humanitarian coverage
  const analysisKeywords = /\b(what is happening|what we know|explained|analysis|why did|how will|day \d+ of|week \d+ of|live updates|as it happened|crisis live|q&A)\b/;
  const statementKeywords = /\b(says it has|claims to have|reports that|allegedly|reportedly)\b/;
  const humanitarianKeywords = /\b(humanitarian crisis|deepening the crisis|aid|relief|humanitarian|refugees|displaced)\b/;
  
  if (analysisKeywords.test(lower) || statementKeywords.test(lower) || humanitarianKeywords.test(lower)) {
    return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
  }
  
  // Must have ACTIVE voice attack keywords (including aircraft incidents)
  const hasActiveAttack = /\b(struck|hit|bombed|destroyed|damaged|explosion rocked|exploded|fired on|was attacked|crashes|crashed|crash|downed|shot down|emergency landing|wreckage found)\b/i.test(lower);
  
  if (hasActiveAttack) {
    let type = 'strike';
    if (lower.includes('missile')) type = 'missile';
    else if (lower.includes('drone')) type = 'drone';
    else if (lower.includes('bomb')) type = 'bombing';
    else if (lower.includes('airstrike')) type = 'airstrike';
    else if (lower.includes('crash') || lower.includes('crashed') || lower.includes('downed')) type = 'plane';
    else if (lower.includes('aircraft') || lower.includes('tanker') || lower.includes('carrier')) type = 'plane';
    
    let location = '';
    if (lower.includes('baghdad')) location = 'Baghdad';
    else if (lower.includes('basra')) location = 'Basra';
    else if (lower.includes('mosul')) location = 'Mosul';
    else if (lower.includes('erbil')) location = 'Erbil';
    else if (lower.includes('kirkuk')) location = 'Kirkuk';
    else if (lower.includes('tehran')) location = 'Tehran';
    else if (lower.includes('kharg')) location = 'Kharg Island';
    else if (lower.includes('hamadan')) location = 'Hamadan';
    else if (lower.includes('chabahar')) location = 'Chabahar';
    else if (lower.includes('isfahan')) location = 'Isfahan';
    else if (lower.includes('natanz')) location = 'Natanz';
    else if (lower.includes('kashan')) location = 'Kashan';
    else if (lower.includes('qom')) location = 'Qom';
    else if (lower.includes('bushehr')) location = 'Bushehr';
    else if (lower.includes('bandar abbas')) location = 'Bandar Abbas';
    else if (lower.includes('shiraz')) location = 'Shiraz';
    else if (lower.includes('tabriz')) location = 'Tabriz';
    else if (lower.includes('mashhad')) location = 'Mashhad';
    else if (lower.includes('ahvaz')) location = 'Ahvaz';
    else if (lower.includes('jerusalem')) location = 'Jerusalem';
    else if (lower.includes('tel aviv')) location = 'Tel Aviv';
    else if (lower.includes('beirut')) location = 'Beirut';
    else if (lower.includes('southern lebanon')) location = 'southern Lebanon';
    else if (lower.includes('lebanon') && !lower.includes('southern')) location = 'Beirut';
    else if (lower.includes('damascus')) location = 'Damascus';
    else if (lower.includes('gaza')) location = 'Gaza';
    else if (lower.includes('dubai')) location = 'Dubai';
    else if (lower.includes('fujairah')) location = 'Fujairah';
    else if (lower.includes('abu dhabi')) location = 'Abu Dhabi';
    else if (lower.includes('sanaa')) location = 'Sanaa';
    else if (lower.includes('aleppo')) location = 'Aleppo';
    else if (lower.includes('homs')) location = 'Homs';
    else if (lower.includes('kuwait')) location = 'Kuwait';
    else if (lower.includes('bahrain')) location = 'Bahrain';
    else if (lower.includes('jordan')) location = 'Jordan';
    else if (lower.includes('amman')) location = 'Amman';
    else if (lower.includes('qatar') || lower.includes('doha')) location = 'Doha';
    else if (lower.includes('saudi') || lower.includes('riyadh')) location = 'Riyadh';
    else if (lower.includes('yemen')) location = 'Yemen';
    else if (lower.includes('iraq')) location = 'Iraq';
    
    let severity = 'medium';
    if (lower.includes('killed') || lower.includes('casualties') || lower.includes('destroyed') || lower.includes('dead')) severity = 'high';
    else if (lower.includes('injured') || lower.includes('wounded')) severity = 'medium';
    
    if (location) {
      return {
        isAttack: true,
        attackType: type,
        location: location,
        severity: severity,
        description: headline
      };
    }
  }
  
  return { isAttack: false, attackType: 'none', location: '', severity: 'low', description: '' };
};

export const analyzeForMapBatch = async (items) => {
  const results = [];
  const MAX_ITEMS = 15; // Process more items to find all strikes
  let apiCalls = 0;
  const MAX_API_CALLS = 10; // Use AI for up to 10 items (was 3)
  
  for (const item of items.slice(0, MAX_ITEMS)) {
    try {
      // Use mock analysis for most items, only use AI for top 3
      let mapAnalysis;
      if (apiCalls < MAX_API_CALLS && consecutiveErrors < MAX_CONSECUTIVE_ERRORS) {
        mapAnalysis = await analyzeForMap(item.headline, item.description);
        apiCalls++;
      } else {
        // Use fast mock analysis
        mapAnalysis = getMockMapAnalysis(item.headline, item.description);
      }
      
      if (mapAnalysis.isAttack && mapAnalysis.location) {
        results.push({
          ...item,
          mapAnalysis
        });
      }
    } catch (error) {
      console.error('[Replicate] Map analysis error:', error);
    }
  }
  
  console.log(`[MapAnalysis] Processed ${Math.min(items.length, MAX_ITEMS)} items, ${apiCalls} AI calls, found ${results.length} attacks`);
  return results;
};

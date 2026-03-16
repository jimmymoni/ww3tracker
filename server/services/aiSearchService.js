/**
 * AI Search Service - Uses Replicate AI to actively search for attacks
 * Replaces/supplements RSS feeds with AI-powered attack detection
 * Runs every 15-30 minutes
 */

import fetch from 'node-fetch';

const REPLICATE_API_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';
const getToken = () => process.env.REPLICATE_API_TOKEN;

// Model config - use cheap fast model
const SEARCH_MODEL = 'meta/meta-llama-3-8b-instruct';

// Rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 10000; // 10 seconds between calls

// Cache for discovered attacks
let discoveredAttacks = [];
let lastSearchTime = null;

const getHeaders = () => ({
  'Authorization': `Token ${getToken()}`,
  'Content-Type': 'application/json',
});

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const delay = Math.max(0, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  if (delay > 0) {
    await new Promise(r => setTimeout(r, delay));
  }
  lastRequestTime = Date.now();
};

// Build search prompt for attacks
const buildAttackSearchPrompt = () => `
You are a military intelligence monitoring system. Search for and report ALL confirmed US-Iran conflict attacks, strikes, and military incidents from the last 48 hours (March 15-16, 2026).

Focus on these specific types of incidents:
- Airstrikes and bombings (US, Israel, or Iranian)
- Missile attacks
- Drone strikes
- Aircraft crashes (military)
- Naval attacks
- Any military strikes causing casualties or damage

Report ONLY incidents with:
- Specific location (city name)
- Confirmed damage/casualties (not just threats)
- Active voice (already happened, not "might happen")

Areas to monitor:
- Iran: Tehran, Isfahan, Kharg Island, Hamadan, Chabahar, Natanz
- UAE: Dubai, Fujairah, Abu Dhabi
- Israel: Tel Aviv, Jerusalem
- Iraq: Baghdad, Basra
- Kuwait, Bahrain, Jordan, Saudi Arabia
- Any Gulf region military bases

Format your response as a JSON array:
[
  {
    "headline": "brief factual headline",
    "location": "City, Country",
    "attackType": "airstrike|missile|drone|bombing|plane|naval|artillery",
    "severity": "high|medium|low",
    "description": "2-3 sentence factual description",
    "sourceHint": "likely news source based on location",
    "timestamp": "approximate time (morning/evening/night of March 15/16)"
  }
]

If no attacks found in last 48 hours, return empty array: []

CRITICAL: Only report CONFIRMED attacks. Do not report threats, warnings, or speculation.
`;

// Search for attacks using AI
export const searchForAttacks = async () => {
  const token = getToken();
  if (!token) {
    console.log('[AISearch] No API token, skipping');
    return [];
  }

  console.log('[AISearch] Starting AI attack search...');
  
  try {
    await waitForRateLimit();
    
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        version: SEARCH_MODEL,
        input: {
          prompt: buildAttackSearchPrompt(),
          max_tokens: 1500,
          temperature: 0.3, // Lower = more factual
        }
      }),
      timeout: 60000
    });

    if (!response.ok) {
      console.error('[AISearch] API error:', response.status);
      return discoveredAttacks; // Return cached
    }

    const prediction = await response.json();
    
    // Poll for result
    const result = await waitForPrediction(prediction.urls.get);
    const rawText = Array.isArray(result) ? result.join('') : result;
    
    // Extract JSON
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log('[AISearch] No JSON found in response');
      return discoveredAttacks;
    }

    const attacks = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(attacks)) {
      console.log('[AISearch] Invalid response format');
      return discoveredAttacks;
    }

    // Process and validate attacks
    const validatedAttacks = attacks.filter(a => {
      // Must have location and headline
      if (!a.headline || !a.location) return false;
      // Must be attack type
      const validTypes = ['airstrike', 'missile', 'drone', 'bombing', 'plane', 'naval', 'artillery'];
      if (!validTypes.includes(a.attackType)) return false;
      return true;
    }).map(a => ({
      ...a,
      id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      discoveredAt: new Date().toISOString(),
      source: a.sourceHint || 'AI Search',
      type: 'ai-discovered'
    }));

    // Merge with existing, avoid duplicates
    for (const attack of validatedAttacks) {
      const isDuplicate = discoveredAttacks.some(existing => 
        similarHeadline(existing.headline, attack.headline)
      );
      if (!isDuplicate) {
        discoveredAttacks.push(attack);
      }
    }

    // Keep only last 50 attacks
    discoveredAttacks = discoveredAttacks.slice(-50);
    lastSearchTime = new Date().toISOString();
    
    console.log(`[AISearch] Found ${validatedAttacks.length} new attacks, total: ${discoveredAttacks.length}`);
    
    return discoveredAttacks;
    
  } catch (error) {
    console.error('[AISearch] Search error:', error.message);
    return discoveredAttacks;
  }
};

// Check if headlines are similar (avoid duplicates)
const similarHeadline = (a, b) => {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  const normA = normalize(a);
  const normB = normalize(b);
  
  // Exact match
  if (normA === normB) return true;
  
  // 80% similar
  let matches = 0;
  const minLen = Math.min(normA.length, normB.length);
  for (let i = 0; i < minLen; i++) {
    if (normA[i] === normB[i]) matches++;
  }
  return (matches / Math.max(normA.length, normB.length)) > 0.8;
};

// Poll for prediction result
const waitForPrediction = async (url, maxAttempts = 30) => {
  for (let i = 0; i < maxAttempts; i++) {
    const response = await fetch(url, { headers: getHeaders() });
    const result = await response.json();
    
    if (result.status === 'succeeded') {
      return result.output;
    }
    if (result.status === 'failed') {
      throw new Error(result.error || 'Prediction failed');
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error('Prediction timeout');
};

// Get all discovered attacks
export const getDiscoveredAttacks = () => discoveredAttacks;

// Get last search time
export const getLastSearchTime = () => lastSearchTime;

// Convert to conflict map format
export const getAttacksForMap = () => {
  return discoveredAttacks.map(attack => ({
    headline: attack.headline,
    description: attack.description,
    pubDate: attack.discoveredAt,
    source: attack.source,
    type: 'ai',
    mapAnalysis: {
      isAttack: true,
      attackType: attack.attackType,
      location: attack.location.split(',')[0].trim(), // Extract city
      severity: attack.severity,
      description: attack.description
    }
  }));
};

// Auto-search every 15 minutes
export const startAutoSearch = () => {
  console.log('[AISearch] Starting auto-search (every 15 minutes)');
  
  // Initial search
  searchForAttacks();
  
  // Repeat every 15 minutes
  setInterval(searchForAttacks, 15 * 60 * 1000);
};

export default {
  searchForAttacks,
  getDiscoveredAttacks,
  getLastSearchTime,
  getAttacksForMap,
  startAutoSearch
};

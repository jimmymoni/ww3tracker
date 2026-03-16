import fetch from 'node-fetch';
import { getCachedNews } from './rssService.js';

const GDELT_API_URL = 'https://api.gdeltproject.org/api/v2/doc/doc';

const GDELT_QUERIES = [
  'iran US conflict',
  'trump iran sanctions',
  'iran nuclear deal',
  'middle east tensions',
  'iran military',
  'us iran relations',
  // Current conflict queries (March 2026)
  'isfahan strike',
  'iran airstrike',
  'iran missile attack',
  'israel iran strike',
  'kharg island',
  'tehran attack',
  'iran retaliation'
];

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds initial delay
const REQUEST_TIMEOUT = 20000; // 20 seconds

// Fetch a single GDELT query with retry logic
const fetchGDELTQuery = async (query, attempt = 1) => {
  try {
    const params = new URLSearchParams({
      query: query,
      mode: 'artlist',
      maxrecords: '25',
      format: 'json',
      sort: 'DateDesc'
    });
    
    console.log(`[GDELT] Querying: "${query}" (attempt ${attempt})`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(`${GDELT_API_URL}?${params}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || 5;
        console.warn(`[GDELT] Rate limited, waiting ${retryAfter}s...`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
        
        if (attempt < MAX_RETRIES) {
          return fetchGDELTQuery(query, attempt + 1);
        }
      }
      
      console.warn(`[GDELT] Query "${query}" returned ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      return [];
    }
    
    return data.articles.map(article => ({
      headline: article.title || '',
      description: article.seendigest || '',
      link: article.url || '',
      pubDate: article.seendate ? article.seendate.replace(/ /g, 'T') + 'Z' : new Date().toISOString(),
      source: article.domain || 'GDELT',
      type: 'gdelt',
      tone: article.tone || 0
    }));
    
  } catch (error) {
    // Handle timeout specifically
    if (error.name === 'AbortError') {
      console.warn(`[GDELT] Query "${query}" timed out`);
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[GDELT] Retrying "${query}" in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        return fetchGDELTQuery(query, attempt + 1);
      }
      
      console.error(`[GDELT] Query "${query}" failed after ${MAX_RETRIES} attempts`);
      return [];
    }
    
    // Handle network errors (ECONNRESET, ETIMEDOUT, etc.)
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.warn(`[GDELT] Network error for "${query}": ${error.code}`);
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(`[GDELT] Retrying "${query}" in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        return fetchGDELTQuery(query, attempt + 1);
      }
      
      console.error(`[GDELT] Query "${query}" failed after ${MAX_RETRIES} attempts`);
      return [];
    }
    
    console.error(`[GDELT] Error fetching query "${query}":`, error.message);
    return [];
  }
};

const deduplicateItems = (items) => {
  const seen = new Set();
  return items.filter(item => {
    const key = item.headline.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const fetchGDELTNews = async () => {
  console.log('[GDELT] Fetching from GDELT with retry logic...');
  
  // Process queries sequentially to avoid overwhelming the API
  const allItems = [];
  
  for (const query of GDELT_QUERIES) {
    const items = await fetchGDELTQuery(query);
    console.log(`[GDELT] Query "${query}": ${items.length} items`);
    allItems.push(...items);
    
    // Small delay between queries to be polite
    if (query !== GDELT_QUERIES[GDELT_QUERIES.length - 1]) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // Deduplicate
  const unique = deduplicateItems(allItems);
  console.log(`[GDELT] Deduplicated to ${unique.length} unique items`);
  
  // Sort by date (newest first)
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  // If GDELT returned no results, fall back to cached RSS news
  if (unique.length === 0) {
    console.log('[GDELT] No results from GDELT, falling back to RSS cache');
    const rssNews = getCachedNews();
    if (rssNews && rssNews.length > 0) {
      console.log(`[GDELT] Returning ${rssNews.length} items from RSS fallback`);
      return rssNews.slice(0, 25);
    }
  }
  
  return unique.slice(0, 25);
};

// Merge RSS and GDELT data
export const mergeNewsSources = (rssItems, gdeltItems) => {
  const allItems = [...rssItems, ...gdeltItems];
  
  // Deduplicate by headline
  const seen = new Set();
  const unique = allItems.filter(item => {
    const key = item.headline.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // Sort by date
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  return unique.slice(0, 30);
};

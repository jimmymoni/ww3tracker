/**
 * News Service - Fetches real news from GNews API
 * Caches results to stay within free tier limits (100 requests/day)
 */

import fetch from 'node-fetch';

const NEWS_CACHE = {
  items: [],
  lastFetch: 0,
  isFetching: false
};

// Cache for 15 minutes to stay within free tier
const CACHE_TTL = 15 * 60 * 1000;

// Fallback headlines if API fails
const FALLBACK_HEADLINES = [
  { text: "Iran war updates: Tehran denies talks happened after Trump's claims", source: "Al Jazeera", type: "breaking", time: new Date().toISOString() },
  { text: "US-Israel-Iran War: Iran launches 'new wave of missiles' at Israel", source: "Times of India", type: "breaking", time: new Date().toISOString() },
  { text: "Amazon cloud service hit in Bahrain following drone activity", source: "India Today", type: "breaking", time: new Date().toISOString() },
  { text: "From Shock and Awe to Hormuz Trap, US War on Iran Enters Most Dangerous Phase", source: "The Wire", type: "analysis", time: new Date().toISOString() },
  { text: "Trump postponing Iran power plant strikes after 'very good' talks", source: "The Hindu", type: "breaking", time: new Date().toISOString() },
  { text: "Oil back above $100 as conflicting reports emerge on US-Iran talks", source: "BBC", type: "markets", time: new Date().toISOString() },
  { text: "Saudis and UAE Take Steps Toward Joining Iran War", source: "Bloomberg", type: "breaking", time: new Date().toISOString() }
];

/**
 * Fetch news from GNews API
 */
async function fetchFromGNews() {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey || apiKey === 'your_gnews_api_key_here') {
    console.log('[News] No GNews API key configured, using fallback');
    return null;
  }

  try {
    // Search for US-Iran war related news
    const query = encodeURIComponent('US Iran war OR Israel Iran conflict OR Middle East war');
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&apikey=${apiKey}`;
    
    console.log('[News] Fetching from GNews API...');
    const response = await fetch(url, { timeout: 10000 });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`[News] GNews API error: ${response.status}`, error);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      console.log('[News] No articles returned from GNews');
      return null;
    }
    
    return data.articles.map(article => ({
      text: article.title,
      source: article.source?.name || 'News Source',
      type: categorizeHeadline(article.title),
      url: article.url,
      publishedAt: article.publishedAt,
      time: article.publishedAt || new Date().toISOString()
    }));
    
  } catch (error) {
    console.error('[News] Failed to fetch from GNews:', error.message);
    return null;
  }
}

/**
 * Categorize headline based on keywords
 */
function categorizeHeadline(title) {
  const lower = title.toLowerCase();
  
  if (lower.includes('breaking') || lower.includes('alert') || 
      lower.includes('launches') || lower.includes('strike') ||
      lower.includes('attack') || lower.includes('killed') ||
      lower.includes('explosion')) {
    return 'breaking';
  }
  
  if (lower.includes('analysis') || lower.includes('opinion') || 
      lower.includes('editorial') || lower.includes('perspective')) {
    return 'analysis';
  }
  
  if (lower.includes('oil') || lower.includes('market') || 
      lower.includes('price') || lower.includes('economic') ||
      lower.includes('stock')) {
    return 'markets';
  }
  
  return 'news';
}

/**
 * Get cached news or fetch fresh
 */
export async function getNews(limit = 10) {
  const now = Date.now();
  
  // Return cached if fresh
  if (NEWS_CACHE.items.length > 0 && (now - NEWS_CACHE.lastFetch) < CACHE_TTL) {
    console.log('[News] Returning cached news');
    return NEWS_CACHE.items.slice(0, limit);
  }
  
  // Prevent concurrent fetches
  if (NEWS_CACHE.isFetching) {
    console.log('[News] Fetch in progress, returning cached');
    return NEWS_CACHE.items.slice(0, limit);
  }
  
  NEWS_CACHE.isFetching = true;
  
  try {
    // Try GNews first
    let articles = await fetchFromGNews();
    
    // Use fallback if API fails
    if (!articles || articles.length === 0) {
      console.log('[News] Using fallback headlines');
      articles = FALLBACK_HEADLINES;
    }
    
    // Update cache
    NEWS_CACHE.items = articles;
    NEWS_CACHE.lastFetch = now;
    
    console.log(`[News] Fetched ${articles.length} articles`);
    return articles.slice(0, limit);
    
  } finally {
    NEWS_CACHE.isFetching = false;
  }
}

/**
 * Force refresh news cache
 */
export async function refreshNews() {
  NEWS_CACHE.lastFetch = 0;
  return getNews();
}

/**
 * Get news status
 */
export function getNewsStatus() {
  return {
    cached: NEWS_CACHE.items.length,
    lastFetch: NEWS_CACHE.lastFetch ? new Date(NEWS_CACHE.lastFetch).toISOString() : null,
    age: NEWS_CACHE.lastFetch ? Date.now() - NEWS_CACHE.lastFetch : null,
    isFresh: NEWS_CACHE.lastFetch ? (Date.now() - NEWS_CACHE.lastFetch) < CACHE_TTL : false
  };
}

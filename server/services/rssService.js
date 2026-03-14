import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

// RSS Feed sources - ONLY approved sources
const RSS_FEEDS = [
  { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', priority: 1 },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', priority: 2 },
  { name: 'The Guardian', url: 'https://www.theguardian.com/world/iran/rss', priority: 3 },
  { name: 'France24', url: 'https://www.france24.com/en/rss', priority: 4 },
  // Kept but expected to fail:
  { name: 'Reuters', url: 'https://feeds.reuters.com/reuters/worldNews', priority: 5, expectedFail: true },
  { name: 'AP News', url: 'https://rsshub.app/apnews/topics/iran', priority: 6, expectedFail: true },
];

const KEYWORDS = [
  'iran', 'us military', 'sanctions', 'nuclear', 'middle east',
  'trump iran', 'tehran', 'pentagon', 'strike', 'missile',
  'us-iran', 'war', 'conflict', 'qasem', 'soleimani',
  'ayatollah', 'khamenei', 'proxy', 'houthis', 'hezbollah',
  'israel', 'gaza', 'hamas', 'netanyahu', 'hormuz'
];

// Simple language detection - check if text contains non-Latin characters
const isEnglishText = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  // Check for common non-Latin script ranges
  const nonLatinRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0400-\u04FF\u0370-\u03FF\u4E00-\u9FFF\u3400-\u4DBF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF]/;
  
  // If contains non-Latin characters, it's not English
  if (nonLatinRegex.test(text)) return false;
  
  // Check for Chinese/Japanese/Korean specific patterns
  const cjkRegex = /[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}]/u;
  if (cjkRegex.test(text)) return false;
  
  return true;
};

const fetchRSSFeed = async (feed) => {
  try {
    console.log(`[RSS] Fetching ${feed.name}...`);
    
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/'
      },
      timeout: 15000
    });
    
    if (!response.ok) {
      console.warn(`[RSS] ${feed.name} returned ${response.status}`);
      return { feed: feed.name, items: [], error: `HTTP ${response.status}` };
    }
    
    const xml = await response.text();
    
    // Check if response is actually XML
    if (!xml.trim().startsWith('<?xml') && !xml.trim().startsWith('<rss')) {
      console.warn(`[RSS] ${feed.name} returned non-XML content`);
      return { feed: feed.name, items: [], error: 'Invalid content type' };
    }
    
    const parsed = await parseStringPromise(xml);
    
    // Handle different RSS formats
    let items = [];
    if (parsed.rss?.channel?.[0]?.item) {
      // Standard RSS 2.0
      items = parsed.rss.channel[0].item;
    } else if (parsed.feed?.entry) {
      // Atom format
      items = parsed.feed.entry.map(entry => ({
        title: entry.title,
        description: entry.summary || entry.content,
        link: entry.link?.[0]?.$.href || entry.id,
        pubDate: entry.updated || entry.published
      }));
    } else if (parsed['rdf:RDF']?.item) {
      // RDF format (like DW)
      items = parsed['rdf:RDF'].item.map(item => ({
        title: [item.title],
        description: [item.description],
        link: [item.link],
        pubDate: [item['dc:date'] || item.date]
      }));
    }
    
    const processedItems = items.map(item => {
      // Parse date and ensure it's in ISO format
      let pubDate = item.pubDate?.[0] || item.published?.[0] || item.updated?.[0];
      if (pubDate) {
        // Convert to ISO string if possible
        try {
          const dateObj = new Date(pubDate);
          if (!isNaN(dateObj.getTime())) {
            pubDate = dateObj.toISOString();
          }
        } catch (e) {
          // Keep original if parsing fails
        }
      }
      
      // Ensure headline is a string
      let headline = item.title?.[0] || item.title || '';
      if (typeof headline !== 'string') {
        headline = String(headline);
      }
      
      // Ensure description is a string
      let description = item.description?.[0] || item.summary?.[0] || item.description || '';
      if (typeof description !== 'string') {
        description = String(description);
      }
      
      // Ensure link is a string
      let link = item.link?.[0] || item.link?.$?.href || item.link || '';
      if (typeof link !== 'string') {
        link = String(link);
      }
      
      return {
        headline: headline,
        description: description,
        link: link,
        pubDate: pubDate || new Date().toISOString(),
        source: feed.name,
        type: 'rss'
      };
    });
    
    console.log(`[RSS] ${feed.name}: ${processedItems.length} items`);
    return { feed: feed.name, items: processedItems, error: null };
    
  } catch (error) {
    const errorMsg = error.message || 'Unknown error';
    
    // Log expected failures at lower level
    if (feed.expectedFail) {
      console.log(`[RSS] ${feed.name} failed as expected: ${errorMsg}`);
    } else {
      console.error(`[RSS] ${feed.name} error:`, errorMsg);
    }
    
    return { feed: feed.name, items: [], error: errorMsg };
  }
};

const filterByKeywords = (items) => {
  return items.filter(item => {
    // Skip items without valid headlines
    if (!item.headline || typeof item.headline !== 'string') {
      return false;
    }
    
    // Filter non-English articles
    if (!isEnglishText(item.headline) || !isEnglishText(item.description)) {
      return false;
    }
    
    const headline = item.headline || '';
    const description = item.description || '';
    const text = `${headline} ${description}`.toLowerCase();
    return KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()));
  });
};

const deduplicateItems = (items) => {
  const seen = new Set();
  return items.filter(item => {
    // Skip items without valid headlines
    if (!item.headline || typeof item.headline !== 'string') {
      return false;
    }
    const key = item.headline.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const fetchAllRSSFeeds = async () => {
  console.log('[RSS] Fetching all RSS feeds...');
  
  const results = await Promise.allSettled(
    RSS_FEEDS.map(feed => fetchRSSFeed(feed))
  );
  
  // Track which feeds worked
  const feedStats = {
    successful: [],
    failed: []
  };
  
  let allItems = [];
  results.forEach((result, index) => {
    const feedName = RSS_FEEDS[index].name;
    
    if (result.status === 'fulfilled') {
      const { items, error } = result.value;
      
      if (error) {
        feedStats.failed.push({ name: feedName, error });
      } else {
        feedStats.successful.push({ name: feedName, count: items.length });
        allItems = allItems.concat(items);
      }
    } else {
      feedStats.failed.push({ name: feedName, error: result.reason?.message || 'Unknown' });
    }
  });
  
  console.log(`[RSS] Successful feeds: ${feedStats.successful.map(f => `${f.name}(${f.count})`).join(', ')}`);
  if (feedStats.failed.length > 0) {
    console.log(`[RSS] Failed feeds: ${feedStats.failed.map(f => f.name).join(', ')}`);
  }
  
  // Filter by keywords
  const filtered = filterByKeywords(allItems);
  console.log(`[RSS] Filtered to ${filtered.length} keyword-matching items`);
  
  // Deduplicate
  const unique = deduplicateItems(filtered);
  console.log(`[RSS] Deduplicated to ${unique.length} unique items`);
  
  // Sort by date (newest first)
  unique.sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB - dateA;
  });
  
  // Return top 25
  const finalItems = unique.slice(0, 25);
  console.log(`[RSS] Returning ${finalItems.length} items`);
  
  return finalItems;
};

// Cache for RSS data
let cachedNews = [];
let lastFetchTime = null;

export const getCachedNews = () => cachedNews;
export const getLastFetchTime = () => lastFetchTime;

export const refreshNews = async () => {
  try {
    cachedNews = await fetchAllRSSFeeds();
    lastFetchTime = new Date().toISOString();
    return cachedNews;
  } catch (error) {
    console.error('[RSS] Refresh failed:', error.message);
    return cachedNews; // Return cached data on error
  }
};

// Auto-refresh every 5 minutes
export const startAutoRefresh = () => {
  refreshNews(); // Initial fetch
  setInterval(refreshNews, 5 * 60 * 1000); // Every 5 minutes
  console.log('[RSS] Auto-refresh started (5 minutes)');
};

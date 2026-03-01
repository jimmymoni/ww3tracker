import fetch from 'node-fetch';

const GIPHY_API_URL = 'https://api.giphy.com/v1/gifs/search';
// Read env var at runtime
const getGiphyKey = () => process.env.GIPHY_API_KEY;

// Cache for GIFs
const gifCache = {
  trumpWinning: null,
  trumpShocked: null,
  lastFetch: null
};

const fetchGifs = async (query, limit = 5) => {
  const apiKey = getGiphyKey();
  if (!apiKey) {
    console.log('[Giphy] No API key, returning null');
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      q: query,
      limit: limit.toString(),
      rating: 'pg-13',
      lang: 'en'
    });

    const response = await fetch(`${GIPHY_API_URL}?${params}`, {
      timeout: 10000
    });

    if (!response.ok) {
      console.warn(`[Giphy] API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    // Return random GIF from results
    const randomIndex = Math.floor(Math.random() * Math.min(data.data.length, limit));
    return {
      url: data.data[randomIndex].images.fixed_height.url,
      originalUrl: data.data[randomIndex].images.original.url,
      title: data.data[randomIndex].title,
      id: data.data[randomIndex].id
    };
  } catch (error) {
    console.error('[Giphy] Error:', error.message);
    return null;
  }
};

export const getTrumpGif = async (mood = 'winning') => {
  const cacheKey = mood === 'winning' ? 'trumpWinning' : 'trumpShocked';
  
  // Check cache (1 hour)
  if (gifCache[cacheKey] && gifCache.lastFetch && (Date.now() - gifCache.lastFetch < 3600000)) {
    return gifCache[cacheKey];
  }

  const query = mood === 'winning' 
    ? 'trump celebration winning' 
    : 'trump shocked surprised reaction';

  const gif = await fetchGifs(query);
  
  if (gif) {
    gifCache[cacheKey] = gif;
    gifCache.lastFetch = Date.now();
  }
  
  return gif;
};

// Fallback placeholder URLs
export const getTrumpPlaceholder = (mood = 'winning') => {
  if (mood === 'winning') {
    return 'https://media.giphy.com/media/3o7abB06u9bNzA8lu8/giphy.gif'; // Celebration
  }
  return 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif'; // Shocked
};

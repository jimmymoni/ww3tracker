import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchNews } from '../lib/api';
import { blogPosts } from '../data/blogPosts';
import { AlertTriangle, Newspaper, TrendingUp, Globe } from 'lucide-react';

const NewsTicker = () => {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load headlines from API + blog posts
  const loadHeadlines = useCallback(async () => {
    try {
      setLoading(true);
      let items = [];
      
      // Fetch real news from API
      try {
        const newsData = await fetchNews(8);
        if (newsData?.items && newsData.items.length > 0) {
          items = newsData.items.map(item => ({
            text: item.text,
            source: item.source,
            type: item.type || 'news',
            time: item.time || new Date().toISOString(),
            url: item.url
          }));
        }
      } catch (apiError) {
        console.warn('[NewsTicker] API failed, using fallback:', apiError.message);
      }
      
      // If API returned nothing, use fallback headlines
      if (items.length === 0) {
        items = getFallbackHeadlines();
      }
      
      // Add latest blog posts (mix them in)
      const sortedPosts = [...blogPosts].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      sortedPosts.slice(0, 3).forEach(post => {
        items.push({
          text: post.title,
          type: 'article',
          link: `/blog/${post.slug}`,
          time: post.date,
          source: 'WW3 Tracker'
        });
      });
      
      setHeadlines(items);
      setError(null);
    } catch (err) {
      console.error('[NewsTicker] Error:', err);
      setError(err.message);
      setHeadlines(getFallbackHeadlines());
    } finally {
      setLoading(false);
    }
  }, []);

  // Fallback headlines when API fails
  const getFallbackHeadlines = () => [
    { text: "Iran war updates: Tehran denies talks happened after Trump's claims", source: "Al Jazeera", type: "breaking", time: new Date().toISOString() },
    { text: "US-Israel-Iran War: Iran launches 'new wave of missiles' at Israel", source: "Times of India", type: "breaking", time: new Date().toISOString() },
    { text: "Amazon cloud service hit in Bahrain following drone activity", source: "India Today", type: "breaking", time: new Date().toISOString() },
    { text: "From Shock and Awe to Hormuz Trap, US War on Iran Enters Most Dangerous Phase", source: "The Wire", type: "analysis", time: new Date().toISOString() },
    { text: "Trump postponing Iran power plant strikes after 'very good' talks", source: "The Hindu", type: "breaking", time: new Date().toISOString() },
    { text: "Oil back above $100 as conflicting reports emerge on US-Iran talks", source: "BBC", type: "markets", time: new Date().toISOString() }
  ];

  useEffect(() => {
    loadHeadlines();
    // Refresh every 5 minutes
    const interval = setInterval(loadHeadlines, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadHeadlines]);

  // Auto-scroll through main headline - SLOWER (8 seconds instead of 5)
  useEffect(() => {
    if (headlines.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 8000); // Changed from 5000 to 8000ms (8 seconds)
    
    return () => clearInterval(interval);
  }, [headlines.length]);

  const getTypeConfig = (type) => {
    switch (type) {
      case 'breaking':
        return { 
          icon: AlertTriangle, 
          color: '#ef4444', 
          bgColor: 'rgba(239, 68, 68, 0.15)',
          label: 'BREAKING'
        };
      case 'article':
        return { 
          icon: Newspaper, 
          color: '#3b82f6', 
          bgColor: 'rgba(59, 130, 246, 0.15)',
          label: 'ARTICLE'
        };
      case 'markets':
        return { 
          icon: TrendingUp, 
          color: '#22c55e', 
          bgColor: 'rgba(34, 197, 94, 0.15)',
          label: 'MARKETS'
        };
      case 'analysis':
        return { 
          icon: Globe, 
          color: '#a855f7', 
          bgColor: 'rgba(168, 85, 247, 0.15)',
          label: 'ANALYSIS'
        };
      default:
        return { 
          icon: Globe, 
          color: '#9ca3af', 
          bgColor: 'rgba(156, 163, 175, 0.15)',
          label: 'NEWS'
        };
    }
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    
    if (diff < 1) return 'now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  if (loading && headlines.length === 0) {
    return (
      <div className="w-full mb-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-3 h-[56px] flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (headlines.length === 0) return null;

  const currentHeadline = headlines[currentIndex];
  const typeConfig = getTypeConfig(currentHeadline.type);
  const IconComponent = typeConfig.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-3"
    >
      {/* Main News Ticker Bar */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg overflow-hidden">
        
        {/* Top Row: Main Headline Display */}
        <div className="px-3 sm:px-4 py-3 flex items-center gap-3">
          
          {/* LEFT: LIVE Badge + Type Indicator */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="relative flex items-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-20"></span>
              <span className="relative px-2 py-1 rounded text-[10px] font-bold text-white bg-red-600">
                LIVE
              </span>
            </span>
            <span 
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold"
              style={{ 
                color: typeConfig.color,
                backgroundColor: typeConfig.bgColor
              }}
            >
              <IconComponent size={10} />
              {typeConfig.label}
            </span>
          </div>

          {/* CENTER: Animated Headline */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {/* Mobile: Just icon */}
                <IconComponent 
                  size={14} 
                  className="flex-shrink-0 sm:hidden" 
                  style={{ color: typeConfig.color }}
                />
                
                {/* Headline text */}
                {currentHeadline.link ? (
                  <a 
                    href={currentHeadline.link}
                    className="text-[13px] sm:text-[14px] text-gray-200 hover:text-white truncate transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-2"
                  >
                    {currentHeadline.text}
                  </a>
                ) : (
                  <span className="text-[13px] sm:text-[14px] text-gray-200 truncate">
                    {currentHeadline.text}
                  </span>
                )}
                
                {/* Source */}
                {currentHeadline.source && (
                  <span className="hidden sm:inline text-[11px] text-gray-500 flex-shrink-0">
                    — {currentHeadline.source}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Time + Progress */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] text-gray-500 hidden sm:block">
              {getRelativeTime(currentHeadline.time)}
            </span>
            
            {/* Progress Dots */}
            <div className="flex items-center gap-1">
              {headlines.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    idx === currentIndex 
                      ? 'bg-red-500 w-3' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to headline ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Marquee Ticker */}
        <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-2 overflow-hidden">
          <div className="relative">
            <motion.div
              className="flex gap-8 whitespace-nowrap"
              animate={{
                x: [0, -50 * headlines.length * 2]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60, // SLOWER: 60 seconds for full loop (was 30)
                  ease: "linear",
                }
              }}
            >
              {/* First set */}
              {headlines.map((headline, idx) => {
                const config = getTypeConfig(headline.type);
                const MiniIcon = config.icon;
                return (
                  <span key={idx} className="flex items-center gap-2 text-[11px] sm:text-[12px]">
                    <MiniIcon size={10} style={{ color: config.color }} />
                    <span className="text-gray-400">{headline.text}</span>
                    {headline.source && (
                      <span className="text-gray-600 hidden sm:inline">({headline.source})</span>
                    )}
                  </span>
                );
              })}
              {/* Duplicate for seamless loop */}
              {headlines.map((headline, idx) => {
                const config = getTypeConfig(headline.type);
                const MiniIcon = config.icon;
                return (
                  <span key={`dup-${idx}`} className="flex items-center gap-2 text-[11px] sm:text-[12px]">
                    <MiniIcon size={10} style={{ color: config.color }} />
                    <span className="text-gray-400">{headline.text}</span>
                    {headline.source && (
                      <span className="text-gray-600 hidden sm:inline">({headline.source})</span>
                    )}
                  </span>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsTicker;

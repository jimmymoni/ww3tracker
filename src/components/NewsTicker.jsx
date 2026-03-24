import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCachedData } from '../lib/api';
import { blogPosts } from '../data/blogPosts';

const NewsTicker = () => {
  const [headlines, setHeadlines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadHeadlines = () => {
      let items = [];
      
      // Get recent news from cache
      const cachedNews = getCachedData('memes');
      if (cachedNews?.items && cachedNews.items.length > 0) {
        cachedNews.items.slice(0, 5).forEach(item => {
          if (item.headline || item.text) {
            items.push({
              text: item.headline || item.text,
              type: 'breaking',
              time: item.timestamp || new Date().toISOString()
            });
          }
        });
      }
      
      // Add latest blog posts
      const sortedPosts = [...blogPosts].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      sortedPosts.slice(0, 3).forEach(post => {
        items.push({
          text: post.title,
          type: 'article',
          link: `/blog/${post.slug}`,
          time: post.date
        });
      });
      
      // Real headlines from Google News (updated manually)
      // Source: Google News search "us iran" - March 23, 2026
      const realHeadlines = [
        { text: "Iran war updates: Tehran denies talks happened after Trump's claims", source: "Al Jazeera", type: "breaking" },
        { text: "US-Israel-Iran War: Iran launches 'new wave of missiles' at Israel", source: "Times of India", type: "breaking" },
        { text: "Amazon cloud service hit in Bahrain following drone activity", source: "India Today", type: "breaking" },
        { text: "From Shock and Awe to Hormuz Trap, US War on Iran Enters Most Dangerous Phase", source: "The Wire", type: "analysis" },
        { text: "Trump postponing Iran power plant strikes after 'very good' talks", source: "The Hindu", type: "breaking" },
        { text: "Strike in Iraq reportedly kills seven fighters", source: "The Guardian", type: "breaking" },
        { text: "Trump's new red line could set the Iran war on a fateful course", source: "CNN", type: "analysis" },
        { text: "Oil back above $100 as conflicting reports emerge on US-Iran talks", source: "BBC", type: "markets" },
        { text: "Saudis and UAE Take Steps Toward Joining Iran War", source: "Bloomberg", type: "breaking" }
      ];
      
      // Use real headlines if API has no fresh data
      if (items.length === 0) {
        items.push(...realHeadlines);
      } else {
        // Mix real headlines with API data
        items = [...realHeadlines.slice(0, 5), ...items];
      }
      
      setHeadlines(items);
    };

    loadHeadlines();
    // Refresh every 2 minutes
    const interval = setInterval(loadHeadlines, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll through headlines
  useEffect(() => {
    if (headlines.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [headlines.length]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'breaking':
        return '🔴';
      case 'article':
        return '📰';
      default:
        return '•';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'breaking':
        return '#ef4444';
      case 'article':
        return '#3b82f6';
      default:
        return '#9ca3af';
    }
  };

  if (headlines.length === 0) return null;

  const currentHeadline = headlines[currentIndex];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-3"
    >
      {/* Scrolling News Ticker Bar */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2 h-[52px] flex items-center gap-3 overflow-hidden">
        
        {/* LEFT: LIVE Badge */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span 
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white bg-red-600"
          >
            LIVE
          </span>
          <span className="text-[10px] text-[#666] hidden sm:block">TOP NEWS</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#222] flex-shrink-0"></div>

        {/* CENTER: Scrolling Headlines */}
        <div className="flex-1 min-w-0 overflow-hidden relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <span 
              className="text-sm flex-shrink-0"
              style={{ color: getTypeColor(currentHeadline.type) }}
            >
              {getTypeIcon(currentHeadline.type)}
            </span>
            <span className="text-[13px] text-gray-300 truncate">
              {currentHeadline.text}
            </span>
            {currentHeadline.source && (
              <span className="text-[10px] text-gray-500 flex-shrink-0">
                — {currentHeadline.source}
              </span>
            )}
          </motion.div>
        </div>

        {/* RIGHT: Progress dots */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {headlines.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-red-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Marquee scrolling text below */}
      <div className="mt-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 overflow-hidden">
        <div className="flex items-center">
          <span className="text-[10px] text-red-500 font-mono mr-3 flex-shrink-0">BREAKING</span>
          <div className="relative flex-1 overflow-hidden h-5">
            <motion.div
              className="absolute whitespace-nowrap flex gap-8"
              animate={{
                x: ["100%", "-100%"]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                }
              }}
            >
              {headlines.map((headline, idx) => (
                <span key={idx} className="text-[12px] text-gray-400 flex items-center gap-2">
                  <span style={{ color: getTypeColor(headline.type) }}>
                    {getTypeIcon(headline.type)}
                  </span>
                  {headline.text}
                  {headline.source && (
                    <span className="text-gray-600">({headline.source})</span>
                  )}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {headlines.map((headline, idx) => (
                <span key={`dup-${idx}`} className="text-[12px] text-gray-400 flex items-center gap-2">
                  <span style={{ color: getTypeColor(headline.type) }}>
                    {getTypeIcon(headline.type)}
                  </span>
                  {headline.text}
                  {headline.source && (
                    <span className="text-gray-600">({headline.source})</span>
                  )}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default NewsTicker;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchTickerItems, getCachedData } from '../lib/api';
import { Radio, Volume2, VolumeX, Loader2 } from 'lucide-react';

const NewsTicker = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const loadTicker = async () => {
      try {
        // Check for cached data first
        const cached = getCachedData('ticker');
        
        // Fallback items
        const fallbackItems = [
          'Breaking: US-Iran tensions remain high in Persian Gulf region',
          'Trump administration signals potential new sanctions on Tehran',
          'Nuclear talks stall as uranium enrichment continues',
          'Strait of Hormuz shipping concerns impact global markets',
          'Israel warns of retaliation amid regional proxy conflicts',
          'International monitors express concern over Iran nuclear program',
          'Military buildup reported near Iranian borders'
        ];
        
        // If we have cached items, show them immediately
        if (cached?.items && cached.items.length > 0) {
          setItems(cached.items);
          setLoading(false);
          setFetching(true);
        } else {
          // Show fallback immediately
          setItems(fallbackItems);
          setLoading(false);
          setFetching(true);
        }
        
        // Fetch fresh data in background
        const data = await fetchTickerItems();
        if (data?.items && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (error) {
        console.error('Failed to load ticker:', error);
      } finally {
        setFetching(false);
      }
    };

    loadTicker();
    
    // Refresh every minute
    const interval = setInterval(() => {
      setFetching(true);
      loadTicker().then(() => setFetching(false));
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const duplicatedItems = [...items, ...items, ...items];

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 z-40 backdrop-blur-sm h-10">
        <div className="flex items-center justify-center h-full text-gray-500 gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="font-body text-sm">Loading ticker...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 z-40 backdrop-blur-sm">
      {/* Live indicator */}
      <div className="absolute left-0 top-0 bottom-0 w-28 bg-red-600 flex items-center justify-center z-10"
        style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-white rounded-full"
          />
          <span className="font-heading text-white text-sm tracking-wider font-bold">LIVE</span>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap h-10 overflow-hidden flex items-center">
        <motion.div 
          className="ticker flex items-center gap-8 pl-32"
          animate={{ x: [0, -50 * items.length] }}
          transition={{ duration: items.length * 4, repeat: Infinity, ease: "linear" }}
        >
          {duplicatedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 shrink-0">
              <span className="font-body text-gray-400 text-sm whitespace-nowrap">
                {fetching && index === 0 ? 'Fetching updates...' : item}
              </span>
              <span className="text-gray-600">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Alert badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute -top-6 right-4"
      >
        <div className="bg-red-600 text-white font-heading text-xs font-bold px-3 py-1 rounded-t flex items-center gap-1">
          <Radio className="w-3 h-3" />
          UPDATES
        </div>
      </motion.div>
    </div>
  );
};

export default NewsTicker;

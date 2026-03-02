import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Satellite, AlertCircle } from 'lucide-react';
import { fetchFireData, getCachedData } from '../lib/api';

// Default fire data for immediate display
const DEFAULT_FIRE_DATA = {
  count: 12,
  source: 'NASA FIRMS (Demo)',
  mock: true,
  lastUpdated: new Date().toISOString()
};

const NasaFirmsStrip = () => {
  const cached = getCachedData('fires');
  const initialData = cached || DEFAULT_FIRE_DATA;
  
  const [fireData, setFireData] = useState(initialData);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFireData = async () => {
      try {
        if (!cached) setLoading(true);
        
        const data = await fetchFireData();
        setFireData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch fire data:', err);
        // Don't show error, keep showing cached/default data
      } finally {
        setLoading(false);
      }
    };

    loadFireData();
    
    // Refresh every hour
    const interval = setInterval(loadFireData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Show loading state only when no data available
  if (loading && !fireData) {
    return (
      <div className="w-full bg-orange-950/30 border-y border-orange-500/20 py-2 sm:py-3 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-orange-400/50">
          <Satellite className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
          <span className="text-xs sm:text-sm font-body">Connecting to NASA satellites...</span>
        </div>
      </div>
    );
  }

  const { count, source, mock } = fireData;
  
  // Determine alert level
  let alertLevel = 'low';
  if (count > 50) alertLevel = 'high';
  else if (count > 20) alertLevel = 'medium';

  const levelConfig = {
    low: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    high: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  };

  const config = levelConfig[alertLevel];

  // Mobile ticker text
  const tickerText = `🔥 NASA FIRMS: ${count} fire signatures near Iran (24hrs) via ${source}${mock ? ' (Demo)' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${config.bg} border-y ${config.border} py-2 sm:py-3 overflow-hidden`}
    >
      {/* Mobile: Scrolling Ticker */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2 px-2">
          <Satellite className={`w-3 h-3 ${config.color} shrink-0`} />
          <div className="flex-1 overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="whitespace-nowrap"
            >
              <span className={`text-xs ${config.color} font-body`}>
                {tickerText} &nbsp;&nbsp;&nbsp; {tickerText} &nbsp;&nbsp;&nbsp;
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop: Full Layout */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Icon */}
          <div className="flex items-center gap-2">
            <Satellite className={`w-4 h-4 ${config.color}`} />
            <Flame className={`w-4 h-4 ${config.color}`} />
          </div>
          
          {/* Text */}
          <span className={`font-body text-sm ${config.color}`}>
            <span className="font-bold">🔥 Satellite Intel:</span> NASA FIRMS detected{' '}
            <span className="font-bold text-white">{count}</span> active fire signatures 
            near Iran in the last 24hrs
          </span>
          
          {/* Source badge */}
          <span className="text-[10px] text-gray-500 font-mono">
            via {source}{mock ? ' (Demo)' : ''}
          </span>
          
          {/* Alert indicator for high count */}
          {alertLevel === 'high' && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex items-center gap-1 text-red-400"
            >
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs font-mono font-bold">ELEVATED ACTIVITY</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NasaFirmsStrip;

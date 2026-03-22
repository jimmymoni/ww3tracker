import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchPolymarketData, getCachedData } from '../lib/api';

const WW3Counter = ({ tension = 35 }) => {
  const [polymarketProb, setPolymarketProb] = useState(26);
  const [newsProb, setNewsProb] = useState(70);
  const [isReal, setIsReal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate WW3 probability: average of all 3 sources
  const ww3Probability = Math.round((polymarketProb + tension + newsProb) / 3);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Polymarket data
        const polyResult = await fetchPolymarketData();
        if (polyResult.escalation?.probability !== undefined) {
          setPolymarketProb(polyResult.escalation.probability);
          setIsReal(polyResult.escalation.isReal || false);
        }

        // Calculate news sentiment probability from recent headlines
        const cachedNews = getCachedData('memes');
        if (cachedNews?.items && cachedNews.items.length > 0) {
          let totalSeverity = 0;
          let count = 0;
          cachedNews.items.slice(0, 10).forEach(item => {
            if (item.analysis?.severity) {
              const severityScore = item.analysis.severity === 'high' ? 70 : 
                                   item.analysis.severity === 'medium' ? 45 : 20;
              totalSeverity += severityScore;
              count++;
            }
          });
          const avgNewsProb = count > 0 ? Math.round(totalSeverity / count) : 35;
          setNewsProb(avgNewsProb);
        }
      } catch (err) {
        console.error('Failed to fetch data for WW3 counter:', err);
      }
    };

    loadData();
    // Update every 60 seconds per spec
    const interval = setInterval(loadData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get color for probability
  const getColor = (prob) => {
    if (prob >= 70) return '#dc2626';
    if (prob >= 50) return '#f97316';
    if (prob >= 30) return '#fbbf24';
    return '#4ade80';
  };

  const mainColor = getColor(ww3Probability);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Compact Horizontal Strip - Max 52px height */}
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg px-3 py-2 h-[52px] flex items-center justify-between gap-3">
        
        {/* LEFT: CTI Badge + Label + Live */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* CTI Badge */}
          <span 
            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white"
            style={{ backgroundColor: '#cc1a1a' }}
          >
            CTI
          </span>
          
          {/* Label + Live */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#666]">Conflict Tension Index</span>
            <span className="flex items-center gap-1 text-[10px] text-[#444]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#222] flex-shrink-0"></div>

        {/* CENTER: Main Number + Sub Metrics */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Main Number */}
          <span 
            className="text-[24px] font-bold flex-shrink-0"
            style={{ color: mainColor }}
          >
            {ww3Probability}%
          </span>
          
          {/* Sub Metrics */}
          <div className="flex items-center gap-2 text-[11px] text-[#555] flex-wrap">
            <span>
              MARKETS <span style={{ color: getColor(polymarketProb) }}>{polymarketProb}%</span>
            </span>
            <span className="text-[#333]">·</span>
            <span>
              TENSION <span style={{ color: getColor(tension) }}>{tension}%</span>
            </span>
            <span className="text-[#333]">·</span>
            <span>
              NEWS <span style={{ color: getColor(newsProb) }}>{newsProb}%</span>
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-[#222] flex-shrink-0 hidden sm:block"></div>

        {/* RIGHT: Gradient Bar (hidden on small mobile) */}
        <div className="hidden sm:block relative w-[120px] md:w-[160px] h-[6px] rounded-full overflow-hidden flex-shrink-0">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #4ade80 0%, #fbbf24 33%, #f97316 66%, #dc2626 100%)'
            }}
          />
          {/* Position marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            style={{ left: `${ww3Probability}%`, transform: 'translateX(-50%)' }}
          />
        </div>
      </div>

      {/* Attribution - hover only */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          height: isHovered ? 'auto' : 0 
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="text-[10px] text-[#333] px-3 pt-1">
          Based on: Polymarket + Tension + News + Live data
          {isReal ? ' • Live data' : ' • Estimated'}
        </p>
      </motion.div>
    </motion.section>
  );
};

export default WW3Counter;

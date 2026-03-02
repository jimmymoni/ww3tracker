import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Twitter, Download, AlertTriangle } from 'lucide-react';
import { fetchPolymarketData, fetchNews, getCachedData } from '../lib/api';
import html2canvas from 'html2canvas';

const WW3Counter = ({ tension = 65 }) => {
  const [polymarketProb, setPolymarketProb] = useState(28);
  const [newsProb, setNewsProb] = useState(35);
  const [isReal, setIsReal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [lastProbability, setLastProbability] = useState(null);
  const cardRef = useRef(null);

  // Calculate WW3 probability: average of all 3 sources
  const ww3Probability = Math.round((polymarketProb + tension + newsProb) / 3);

  useEffect(() => {
    // Check if we crossed 50% threshold
    if (lastProbability !== null && lastProbability < 50 && ww3Probability >= 50) {
      setShowCriticalAlert(true);
      setTimeout(() => setShowCriticalAlert(false), 5000);
    }
    setLastProbability(ww3Probability);
  }, [ww3Probability, lastProbability]);

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
          // Calculate sentiment score based on recent news analysis
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

  const shareText = `☢️ WW3 is ${ww3Probability}% likely right now\nBased on live Polymarket + news data 😭\nthestandoff.live #WW3 #TheStandoff`;

  const shareToX = () => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText), '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://thestandoff.live');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#450a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `ww3-probability-${date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  // Get color based on probability
  const getColor = (prob) => {
    if (prob >= 70) return '#dc2626'; // Red
    if (prob >= 50) return '#f97316'; // Orange
    if (prob >= 30) return '#fbbf24'; // Yellow
    return '#4ade80'; // Green
  };

  const color = getColor(ww3Probability);
  const isCritical = ww3Probability >= 50;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-6"
      >
        <div 
          ref={cardRef}
          className={`comic-panel rounded-xl p-5 relative overflow-hidden ${isCritical ? 'border-red-500/50 shadow-red-500/20' : ''}`}
          style={{
            boxShadow: isCritical ? '0 0 30px rgba(220, 38, 38, 0.3)' : undefined
          }}
        >
          {/* Critical glow overlay */}
          {isCritical && (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-red-600/10 pointer-events-none"
            />
          )}

          {/* Header - Mobile Optimized */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.div 
                animate={isCritical ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.1, 1] }}
                transition={{ duration: isCritical ? 0.5 : 2, repeat: Infinity }}
                className="text-2xl sm:text-3xl"
              >
                ☢️
              </motion.div>
              <div>
                <h2 className="font-heading font-bold text-base sm:text-xl text-white tracking-wide">
                  WW3 PROBABILITY
                </h2>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-body uppercase tracking-wider">
                  LIVE • Updates every 60s
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareToX}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Share on X"
              >
                <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors relative"
                title="Copy link"
              >
                <Link className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-green-400" />
                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    Copied! ✅
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCard}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
                title="Download card"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hover:text-purple-400" />
              </motion.button>
            </div>
          </div>

          {/* Giant Probability Number */}
          <div className="text-center mb-3 sm:mb-4">
            <motion.div
              key={ww3Probability}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl"
              style={{ 
                color,
                textShadow: isCritical ? `0 0 40px ${color}` : 'none'
              }}
            >
              {ww3Probability}%
            </motion.div>
            <p className="text-gray-400 text-xs sm:text-sm font-body mt-1">
              {isCritical ? '⚠️ CRITICAL THRESHOLD' : 'LIVE RIGHT NOW'}
            </p>
          </div>

          {/* Data Sources Breakdown */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="bg-black/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <span className="text-xs">🎲</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-body uppercase">Markets</span>
              </div>
              <div className="font-mono font-bold text-base sm:text-lg" style={{ color: getColor(polymarketProb) }}>
                {polymarketProb}%
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <span className="text-xs">🌶️</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-body uppercase">Tension</span>
              </div>
              <div className="font-mono font-bold text-base sm:text-lg" style={{ color: getColor(tension) }}>
                {tension}%
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <span className="text-xs">📰</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 font-body uppercase">News</span>
              </div>
              <div className="font-mono font-bold text-base sm:text-lg" style={{ color: getColor(newsProb) }}>
                {newsProb}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, #4ade80 0%, #fbbf24 33%, #f97316 66%, #dc2626 100%)`,
                width: `${ww3Probability}%`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${ww3Probability}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            {/* Glow effect for critical */}
            {isCritical && (
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-y-0 left-0 rounded-full bg-red-500/50 blur-sm"
                style={{ width: `${ww3Probability}%` }}
              />
            )}
            {/* 50% marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/30"
              style={{ left: '50%' }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2 sm:mt-3">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-body">
              Based on: Polymarket + Tension + News
              {isReal ? ' • Live data' : ' • Estimated'}
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-600 font-body hidden sm:block">
              thestandoff.live
            </p>
          </div>
        </div>
      </motion.section>

      {/* Critical Threshold Full Page Flash */}
      <AnimatePresence>
        {showCriticalAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600/90 z-[100] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="text-center p-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                ☢️
              </motion.div>
              <h1 className="font-bangers text-5xl md:text-7xl text-white mb-4">
                ⚠️ CRITICAL
              </h1>
              <p className="font-bangers text-3xl text-yellow-400 mb-2">
                THRESHOLD REACHED
              </p>
              <p className="text-gray-200 font-comic text-lg mb-6">
                WW3 probability just hit {ww3Probability}%
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCriticalAlert(false)}
                className="px-8 py-3 bg-white text-red-600 font-bangers text-xl rounded-lg"
              >
                I UNDERSTAND
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WW3Counter;

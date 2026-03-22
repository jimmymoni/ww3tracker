import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, Twitter, Download, Info } from 'lucide-react';
import { fetchPolymarketData, fetchNews, getCachedData } from '../lib/api';
import html2canvas from 'html2canvas';

const WW3Counter = ({ tension = 65 }) => {
  const [polymarketProb, setPolymarketProb] = useState(28);
  const [newsProb, setNewsProb] = useState(35);
  const [isReal, setIsReal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const cardRef = useRef(null);

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

  const shareText = `Conflict Tension Index: ${ww3Probability}%\nBased on live Polymarket + news data\nww3tracker.live #WW3`;

  const shareToX = () => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText), '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ww3tracker.live');
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
        backgroundColor: '#0d0d12',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `conflict-tension-${date}.png`;
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-4"
    >
      <div 
        ref={cardRef}
        className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-3 sm:p-5 relative overflow-hidden"
      >
        {/* MOBILE: Compact horizontal layout */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Conflict Tension Index</p>
              <p className="font-heading font-bold text-3xl" style={{ color }}>
                {ww3Probability}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={shareToX} className="p-2 rounded-lg hover:bg-white/10">
              <Twitter className="w-4 h-4" style={{ color }} />
            </button>
            <button onClick={copyLink} className="p-2 rounded-lg hover:bg-white/10 relative">
              <Link className="w-4 h-4 text-gray-400" />
              {copied && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded z-10">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP: Full layout */}
        <div className="hidden sm:block">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <span className="font-heading font-bold text-red-400">CTI</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-xl text-white">
                    Conflict Tension Index
                  </h2>
                  <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="What is this?"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 font-body uppercase tracking-wider">
                  LIVE • Updates every 60s
                </p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareToX}
                className="p-2 rounded hover:bg-white/5 transition-colors"
                title="Share on X"
              >
                <Twitter className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyLink}
                className="p-2 rounded hover:bg-white/5 transition-colors relative"
                title="Copy link"
              >
                <Link className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                    Copied!
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadCard}
                className="p-2 rounded hover:bg-white/5 transition-colors"
                title="Download card"
              >
                <Download className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
              </motion.button>
            </div>
          </div>

          {/* Info Tooltip */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-xs text-gray-400">
                <strong className="text-red-400">What is this?</strong> An aggregate measure combining 
                prediction market data (Polymarket), geopolitical tension metrics, and news sentiment analysis. 
                It tracks the perceived risk of major escalation, not a literal probability of World War 3.
              </p>
            </motion.div>
          )}

          {/* Giant Probability Number */}
          <div className="text-center mb-4">
            <motion.div
              key={ww3Probability}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="font-heading font-bold text-6xl md:text-7xl"
              style={{ color }}
            >
              {ww3Probability}%
            </motion.div>
            <p className="text-gray-400 text-sm font-body mt-1">
              Current Escalation Level
            </p>
          </div>

          {/* Data Sources Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[10px] text-gray-500 font-body uppercase">Markets</span>
              </div>
              <div className="font-mono font-bold text-lg" style={{ color: getColor(polymarketProb) }}>
                {polymarketProb}%
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[10px] text-gray-500 font-body uppercase">Tension</span>
              </div>
              <div className="font-mono font-bold text-lg" style={{ color: getColor(tension) }}>
                {tension}%
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[10px] text-gray-500 font-body uppercase">News</span>
              </div>
              <div className="font-mono font-bold text-lg" style={{ color: getColor(newsProb) }}>
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
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/30"
              style={{ left: '50%' }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[10px] text-gray-500 font-body">
              Based on: Polymarket + Tension + News
              {isReal ? ' • Live data' : ' • Estimated'}
            </p>
            <p className="text-[10px] text-gray-600 font-body hidden sm:block">
              ww3tracker.live
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default WW3Counter;

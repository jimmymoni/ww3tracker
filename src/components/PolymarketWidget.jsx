import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Activity, ExternalLink, Twitter, Link as LinkIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchPolymarketData, getCachedData } from '../lib/api';
import DailyPoll from './DailyPoll';

const DEFAULT_POLYMARKET_DATA = {
  markets: [
    {
      id: 'iran-regime-fall-2026',
      question: 'Will the Iranian regime fall by June 30, 2026?',
      probability: 18,
      volume: 2847200,
      endDate: '2026-06-30T23:59:59Z',
      url: 'https://polymarket.com/event/will-the-iranian-regime-fall-by-june-30?r=ww3tracker',
      isReal: true,
      source: 'polymarket'
    },
    {
      id: 'us-invade-iran-2026',
      question: 'Will the U.S. invade Iran by March 31, 2026?',
      probability: 12,
      volume: 5156700,
      endDate: '2026-03-31T23:59:59Z',
      url: 'https://polymarket.com/event/will-the-us-invade-iran-by-march-31?r=ww3tracker',
      isReal: true,
      source: 'polymarket'
    },
    {
      id: 'israel-war-iran-july',
      question: 'Will Israel declare war on Iran before July 2026?',
      probability: 35,
      volume: 2218900,
      endDate: '2026-06-30T23:59:59Z',
      url: 'https://polymarket.com/event/will-israel-declare-war-on-iran-before-july-989?r=ww3tracker',
      isReal: true,
      source: 'polymarket'
    },
    {
      id: 'us-israel-strikes-iran',
      question: 'US/Israel strikes Iran on...?',
      probability: 52,
      volume: 2100000,
      endDate: '2026-06-30T23:59:59Z',
      url: 'https://polymarket.com/event/usisrael-strikes-iran-on?r=ww3tracker',
      isReal: true,
      source: 'polymarket'
    }
  ],
  escalation: {
    probability: 31,
    isReal: true
  }
};

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  }
  return `$${volume}`;
};

const getDaysUntil = (dateString) => {
  const end = new Date(dateString);
  const now = new Date();
  const diff = end - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days > 365) {
    return `${Math.floor(days / 365)} years`;
  } else if (days > 30) {
    return `${Math.floor(days / 30)} months`;
  }
  return `${days} days`;
};

const MarketCard = ({ market }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const yesPercent = market.probability;
  const noPercent = 100 - yesPercent;

  const shareToX = () => {
    const text = `"${market.question.substring(0, 50)}..."\nMarkets say ${yesPercent}% YES — ww3tracker.live\n#Polymarket #USvsIran`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://ww3tracker.live — ${market.question}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const betOnPolymarket = () => {
    if (market?.url) {
      window.open(market.url, '_blank');
    } else {
      window.open('https://polymarket.com?r=ww3tracker', '_blank');
    }
  };

  return (
    <motion.div
      className="comic-panel rounded-xl p-4 relative group flex flex-col h-full"
      onMouseEnter={() => setShowShare(true)}
      onMouseLeave={() => setShowShare(false)}
    >
      {/* Live Badge & Share */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-impact text-red-400 tracking-wider">LIVE</span>
        </div>
        
        <AnimatePresence>
          {showShare && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button onClick={shareToX} className="p-1.5 rounded hover:bg-blue-500/20 transition-colors">
                <Twitter className="w-3.5 h-3.5 text-gray-400 hover:text-blue-400" />
              </button>
              <button onClick={copyLink} className="p-1.5 rounded hover:bg-green-500/20 transition-colors relative">
                <LinkIcon className="w-3.5 h-3.5 text-gray-400 hover:text-green-400" />
                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap">Copied!</span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question */}
      <p className="text-sm font-comic text-white mb-3 leading-relaxed flex-1">
        &ldquo;{market.question}&rdquo;
      </p>

      {/* Probability Bars */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-green-400 font-impact">YES {yesPercent}%</span>
          <span className="text-red-400 font-impact">NO {noPercent}%</span>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-gradient-to-r from-green-600 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${yesPercent}%` }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="h-full bg-gradient-to-l from-red-600 to-red-400"
            initial={{ width: 0 }}
            animate={{ width: `${noPercent}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[10px] text-gray-500 font-comic mb-3">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span>Vol: {formatVolume(market.volume)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Closes: {getDaysUntil(market.endDate)}</span>
        </div>
      </div>

      {/* Action Button */}
      <button onClick={betOnPolymarket} className="w-full py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-impact text-white text-xs tracking-wider transition-all flex items-center justify-center gap-2 group">
        <span>VIEW ON POLYMARKET</span>
        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
};

const PolymarketWidget = () => {
  const cached = getCachedData('polymarket');
  const initialData = cached || DEFAULT_POLYMARKET_DATA;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!cached);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!cached) setLoading(true);
        const result = await fetchPolymarketData();
        if (result.markets && result.markets.length > 0) {
          setData(result);
        }
      } catch (err) {
        console.error('Failed to fetch Polymarket data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const markets = data.markets || [];
  const visibleMarkets = markets.slice(scrollIndex, scrollIndex + 3);
  const canScrollLeft = scrollIndex > 0;
  const canScrollRight = scrollIndex < markets.length - 3;

  const scrollLeft = () => canScrollLeft && setScrollIndex(i => i - 1);
  const scrollRight = () => canScrollRight && setScrollIndex(i => i + 1);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bangers text-xl text-white tracking-wider">PREDICTION MARKETS</h2>
            <p className="text-gray-500 text-xs font-comic">🔴 Live Polymarket data</p>
          </div>
        </div>
        

      </div>

      {/* Markets Grid - Full Width (3 columns on desktop) */}
      <div className="relative">
        {/* Scroll Buttons (mobile) */}
        <button 
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center disabled:opacity-0"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={scrollRight}
          disabled={!canScrollRight}
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center disabled:opacity-0"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Markets Grid */}
        {loading && !data ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 h-32">
            <Activity className="w-5 h-5 animate-pulse" />
            <span className="font-comic">Loading prediction markets...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {visibleMarkets.map((market, index) => (
              <MarketCard
                key={market.id}
                market={market}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll Indicators (mobile) */}
      <div className="flex justify-center gap-1 mt-3 md:hidden">
        {markets.map((_, idx) => (
          <div 
            key={idx}
            className={`w-1.5 h-1.5 rounded-full ${idx >= scrollIndex && idx < scrollIndex + 3 ? 'bg-green-500' : 'bg-gray-700'}`}
          />
        ))}
      </div>

      {/* Daily Poll Widget */}
      <DailyPoll />

      {/* Info Footer */}
      <div className="mt-4 comic-panel rounded-xl p-3">
        <p className="text-xs text-gray-400 font-comic mb-2">
          📊 Markets update every 5 minutes from live Polymarket prediction market data
        </p>
        <p className="text-[10px] text-gray-600 font-comic">
          🔴 Real betting data from Polymarket • Not financial advice
        </p>
      </div>
    </div>
  );
};

export default PolymarketWidget;

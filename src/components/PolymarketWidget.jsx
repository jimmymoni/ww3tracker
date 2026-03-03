import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Activity, Crown, ExternalLink, Twitter, Link as LinkIcon, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
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

// Clout betting system
const getCloutPoints = () => {
  const stored = localStorage.getItem('cloutPoints');
  return stored ? parseInt(stored, 10) : 100;
};

const setCloutPoints = (points) => {
  localStorage.setItem('cloutPoints', Math.max(0, points));
};

const getCloutPredictions = () => {
  const stored = localStorage.getItem('cloutPredictions');
  return stored ? JSON.parse(stored) : {};
};

const setCloutPrediction = (marketId, prediction) => {
  const predictions = getCloutPredictions();
  predictions[marketId] = prediction;
  localStorage.setItem('cloutPredictions', JSON.stringify(predictions));
};

const getLeaderboard = () => {
  const stored = localStorage.getItem('cloutLeaderboard');
  if (stored) return JSON.parse(stored);
  return [
    { name: 'WarWatcher_99', points: 2840 },
    { name: 'ChaosAgent_42', points: 1920 },
    { name: 'DoomScroll_7', points: 1650 },
    { name: 'NuclearWinter', points: 1340 },
    { name: 'BunkerBuilder', points: 980 }
  ];
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

const MarketCard = ({ market, cloutMode, userPoints, onPredict, hasPredicted }) => {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const yesPercent = market.probability;
  const noPercent = 100 - yesPercent;

  const shareToX = () => {
    const text = `I just bet ${hasPredicted?.prediction?.toUpperCase() || 'YES'} on "${market.question.substring(0, 50)}..."\nMarkets say ${yesPercent}% — ww3tracker.live\n#Polymarket #USvsIran #WW3`;
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
      {cloutMode ? (
        <div className="bg-white/5 rounded-lg p-2">
          {hasPredicted ? (
            <div className="text-center">
              <p className="text-xs font-comic text-gray-400">
                You predicted: <span className={hasPredicted.prediction === 'yes' ? 'text-green-400' : 'text-red-400'}>
                  {hasPredicted.prediction.toUpperCase()}
                </span>
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => onPredict(market.id, 'yes')} className="flex-1 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded text-green-400 font-impact text-xs transition-colors">
                PREDICT YES
              </button>
              <button onClick={() => onPredict(market.id, 'no')} className="flex-1 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 font-impact text-xs transition-colors">
                PREDICT NO
              </button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={betOnPolymarket} className="w-full py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-lg font-impact text-white text-xs tracking-wider transition-all flex items-center justify-center gap-2 group">
          <span>BET ON POLYMARKET</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </motion.div>
  );
};

const PolymarketWidget = () => {
  const cached = getCachedData('polymarket');
  const initialData = cached || DEFAULT_POLYMARKET_DATA;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!cached);
  const [cloutMode, setCloutMode] = useState(false);
  const [userPoints, setUserPoints] = useState(getCloutPoints());
  const [predictions, setPredictions] = useState(getCloutPredictions());
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [predictionMsg, setPredictionMsg] = useState(null);
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

  const handlePredict = (marketId, prediction) => {
    const points = getCloutPoints();
    if (points < 50) {
      setPredictionMsg({ type: 'error', text: 'Not enough clout points!' });
      return;
    }

    const newPoints = points - 50;
    setCloutPoints(newPoints);
    setUserPoints(newPoints);
    setCloutPrediction(marketId, { prediction, timestamp: Date.now() });
    setPredictions(getCloutPredictions());
    setPredictionMsg({ type: 'success', text: `Predicted ${prediction.toUpperCase()}! -50 pts` });
    setTimeout(() => setPredictionMsg(null), 3000);
  };

  // Update leaderboard with user
  const displayLeaderboard = [...leaderboard];
  const userPos = displayLeaderboard.findIndex(p => p.name === 'You');
  if (userPos === -1) {
    const userRank = displayLeaderboard.findIndex(p => p.points < userPoints);
    if (userRank !== -1) {
      displayLeaderboard.splice(userRank, 0, { name: 'You', points: userPoints });
      displayLeaderboard.pop();
    }
  } else {
    displayLeaderboard[userPos].points = userPoints;
    displayLeaderboard.sort((a, b) => b.points - a.points);
  }

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
        
        <div className="flex items-center gap-3">
          {/* User Points */}
          <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1.5 rounded-lg border border-yellow-500/30">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="font-impact text-yellow-400 text-sm">{userPoints} pts</span>
          </div>
        </div>
      </div>

      {/* Clout Mode Toggle */}
      <div className="flex items-center justify-between mb-4 bg-white/5 rounded-lg p-2">
        <span className="text-xs font-comic text-gray-400">PREDICT FOR CLOUT 👑</span>
        <button
          onClick={() => setCloutMode(!cloutMode)}
          className={`relative w-12 h-6 rounded-full transition-colors ${cloutMode ? 'bg-yellow-500' : 'bg-gray-600'}`}
        >
          <motion.div animate={{ x: cloutMode ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full" />
        </button>
      </div>

      {/* Prediction Message */}
      <AnimatePresence>
        {predictionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-3 p-2 rounded-lg text-center text-xs font-comic ${predictionMsg.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {predictionMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

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
                cloutMode={cloutMode}
                userPoints={userPoints}
                onPredict={handlePredict}
                hasPredicted={predictions[market.id]}
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

      {/* Leaderboard & Footer */}
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        {/* Leaderboard */}
        <div className="comic-panel rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-yellow-400" />
            <span className="font-impact text-xs text-yellow-400 tracking-wider">TOP CLOUT</span>
          </div>
          <div className="space-y-1">
            {displayLeaderboard.slice(0, 5).map((player, idx) => (
              <div key={player.name} className={`flex items-center justify-between text-xs py-1 px-2 rounded ${player.name === 'You' ? 'bg-yellow-500/10 border border-yellow-500/30' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-impact ${
                    idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className={`font-comic ${player.name === 'You' ? 'text-yellow-400' : 'text-gray-400'}`}>{player.name}</span>
                </div>
                <span className="font-impact text-gray-300">{player.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="comic-panel rounded-xl p-3 flex flex-col justify-center">
          <p className="text-xs text-gray-400 font-comic mb-2">
            📊 Markets update every 5 minutes from live Polymarket data
          </p>
          <p className="text-xs text-gray-500 font-comic">
            💡 Toggle &quot;Predict for Clout&quot; to make free predictions and earn points!
          </p>
          <p className="text-[10px] text-gray-600 font-comic mt-2">
            🔴 Real data from Polymarket • Not financial advice
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolymarketWidget;

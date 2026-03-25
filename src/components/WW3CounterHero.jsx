import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Newspaper } from 'lucide-react';
import { fetchPolymarketData, getCachedData } from '../lib/api';

const WW3CounterHero = ({ tension = 35 }) => {
  const [polymarketProb, setPolymarketProb] = useState(26);
  const [newsProb, setNewsProb] = useState(45);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Polymarket data
        const polyResult = await fetchPolymarketData();
        if (polyResult.escalation?.probability !== undefined) {
          setPolymarketProb(polyResult.escalation.probability);
        }

        // Calculate news sentiment from cached data
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
        
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Failed to fetch WW3 data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate WW3 probability
  const ww3Probability = Math.round((polymarketProb + tension + newsProb) / 3);

  // Get color based on probability
  const getColor = (prob) => {
    if (prob >= 70) return 'text-red-500';
    if (prob >= 50) return 'text-orange-500';
    if (prob >= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBgColor = (prob) => {
    if (prob >= 70) return 'from-red-500/20 to-red-600/10';
    if (prob >= 50) return 'from-orange-500/20 to-orange-600/10';
    if (prob >= 30) return 'from-yellow-500/20 to-yellow-600/10';
    return 'from-green-500/20 to-green-600/10';
  };

  const getBorderColor = (prob) => {
    if (prob >= 70) return 'border-red-500/30';
    if (prob >= 50) return 'border-orange-500/30';
    if (prob >= 30) return 'border-yellow-500/30';
    return 'border-green-500/30';
  };

  return (
    <div className={`bg-gradient-to-br ${getBgColor(ww3Probability)} border ${getBorderColor(ww3Probability)} rounded-2xl p-6 sm:p-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-white/60" />
          <span className="text-sm text-white/60">WW3 Probability Index</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-white/40">Live</span>
        </div>
      </div>

      {/* Main Score */}
      <div className="text-center mb-6">
        <div className={`text-7xl sm:text-8xl font-bold ${getColor(ww3Probability)} mb-2`}>
          {ww3Probability}%
        </div>
        <p className="text-white/40 text-sm">
          Current probability based on market data, news sentiment, and regional tension
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-white/40 mb-1">Markets</p>
          <p className={`text-lg font-semibold ${getColor(polymarketProb)}`}>{polymarketProb}%</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <Activity className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-xs text-white/40 mb-1">Tension</p>
          <p className={`text-lg font-semibold ${getColor(tension)}`}>{tension}%</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3 text-center">
          <Newspaper className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-xs text-white/40 mb-1">News</p>
          <p className={`text-lg font-semibold ${getColor(newsProb)}`}>{newsProb}%</p>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-center text-[10px] text-white/20 mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default WW3CounterHero;

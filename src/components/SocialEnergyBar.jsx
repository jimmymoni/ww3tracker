import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Twitter, TrendingUp, Users, Hash } from 'lucide-react';

const SocialEnergyBar = () => {
  const [sentiment, setSentiment] = useState({ us: 55, iran: 30, neutral: 15 });
  const [trending] = useState([
    { tag: '#WW3', count: '2.4M' },
    { tag: '#Draft', count: '1.8M' },
    { tag: '#Peace', count: '890K' },
    { tag: '#WWIII', count: '756K' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(prev => {
        const usChange = (Math.random() - 0.5) * 6;
        const iranChange = (Math.random() - 0.5) * 6;
        const newUs = Math.max(20, Math.min(70, prev.us + usChange));
        const newIran = Math.max(10, Math.min(50, prev.iran + iranChange));
        const newNeutral = 100 - newUs - newIran;
        return { us: newUs, iran: newIran, neutral: Math.max(0, newNeutral) };
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="comic-panel rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Twitter className="w-4 h-4 text-blue-400" />
          <h3 className="font-bangers text-lg text-white">SOCIAL ENERGY</h3>
        </div>
        <div className="flex items-center gap-1 text-green-400/70 text-xs">
          <TrendingUp className="w-3 h-3" />
          <span className="font-comic">+127%</span>
        </div>
      </div>

      {/* Sentiment Bars */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-blue-400 font-comic">🇺🇸 Pro-US</span>
            <span className="text-gray-400 font-impact">{sentiment.us.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              animate={{ width: `${sentiment.us}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-red-400 font-comic">🇮🇷 Pro-Iran</span>
            <span className="text-gray-400 font-impact">{sentiment.iran.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-500"
              animate={{ width: `${sentiment.iran}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400 font-comic">Neutral</span>
            <span className="text-gray-500 font-impact">{sentiment.neutral.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gray-500"
              animate={{ width: `${sentiment.neutral}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Trending */}
      <div className="border-t border-white/5 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="w-3 h-3 text-yellow-500/70" />
          <span className="text-[10px] text-gray-500 font-comic uppercase">Trending</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trending.map((item) => (
            <div
              key={item.tag}
              className="bg-white/5 hover:bg-white/10 transition-colors px-2 py-1 rounded border border-white/5"
            >
              <span className="text-xs text-gray-300">{item.tag}</span>
              <span className="text-[10px] text-gray-500 ml-1">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span className="font-comic">12.4M discussing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="font-comic">Live</span>
        </div>
      </div>
    </div>
  );
};

export default SocialEnergyBar;

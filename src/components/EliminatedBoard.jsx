import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Calendar, Target } from 'lucide-react';
import { ELIMINATED_OFFICIALS } from '../lib/mockData';
import { playSound } from '../lib/utils';

const EliminatedCard = ({ official, index }) => {
  const [showX, setShowX] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowX(true);
      playSound('fatality');
    }, 300 + (index * 150));

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="comic-panel rounded-lg p-3 hover-lift"
    >
      <div className="flex gap-4">
        {/* Photo with X overlay */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
            <img 
              src={official.image} 
              alt={official.name}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          
          {/* Animated X */}
          <svg 
            className="absolute inset-0 w-16 h-16 pointer-events-none"
            viewBox="0 0 64 64"
          >
            <motion.line
              x1="12" y1="12" x2="52" y2="52"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={showX ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <motion.line
              x1="52" y1="12" x2="12" y2="52"
              stroke="#dc2626"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={showX ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
            />
          </svg>

          {/* RIP */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-xs border border-gray-700">
            🪦
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bangers text-lg text-white tracking-wide truncate">
                {official.name}
              </h3>
              <p className="text-gray-500 text-xs font-comic">{official.title}</p>
            </div>
            <span className="eliminated-stamp shrink-0">ELIMINATED</span>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span className="font-comic">{official.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span className="font-comic">{official.cause}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EliminatedBoard = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon text-red-400">
          <Skull className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bangers text-xl text-white tracking-wider">CASUALTIES</h2>
          <p className="text-gray-500 text-xs font-comic">High-value targets</p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {ELIMINATED_OFFICIALS.map((official, index) => (
            <EliminatedCard key={official.id} official={official} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <p className="text-yellow-500/70 text-xs font-comic text-center">
          ⚠️ This section documents real casualties. The gamification is purely satirical.
        </p>
      </div>
    </div>
  );
};

export default EliminatedBoard;

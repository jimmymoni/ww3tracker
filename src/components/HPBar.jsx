import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMBO_MESSAGES } from '../lib/mockData';
import { getRandomItem } from '../lib/utils';

const HPBar = ({ usHP = 75, iranHP = 60 }) => {
  const [showCombo, setShowCombo] = useState(false);
  const [comboText, setComboText] = useState('');
  const [showFight, setShowFight] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFight(false), 2000);
    
    const comboInterval = setInterval(() => {
      const combo = getRandomItem(COMBO_MESSAGES);
      setComboText(combo);
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 2500);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(comboInterval);
    };
  }, []);

  const usPercent = Math.round(Math.max(0, Math.min(100, usHP)));
  const iranPercent = Math.round(Math.max(0, Math.min(100, iranHP)));

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
      {/* Top Labels - Mobile Optimized - FIXED CENTERING */}
      <div className="grid grid-cols-3 gap-2 items-end mb-2 sm:mb-3">
        {/* US Side */}
        <div className="text-left">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl">🇺🇸</span>
            <span className="font-heading font-bold text-sm sm:text-xl text-blue-400 tracking-wide">UNITED STATES</span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 font-body block mt-0.5">The Dealmaker</span>
        </div>

        {/* Center VS - Properly Centered */}
        <div className="text-center">
          <div className="font-heading text-[10px] sm:text-sm text-gray-500 mb-0.5 sm:mb-1">ROUND 1</div>
          <div className="flex items-center justify-center">
            <span className="font-heading font-bold text-2xl sm:text-4xl text-yellow-500 text-glow">VS</span>
          </div>
        </div>

        {/* Iran Side */}
        <div className="text-right">
          <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
            <span className="font-heading font-bold text-sm sm:text-xl text-red-400 tracking-wide">IRAN</span>
            <span className="text-xl sm:text-2xl">🇮🇷</span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 font-body block mt-0.5">The Shadow</span>
        </div>
      </div>

      {/* Main Health Bars */}
      <div className="relative bg-black/40 rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-white/10">
        <div className="flex items-center gap-2 sm:gap-6">
          {/* US HP Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
              <span className="font-mono font-bold text-blue-400">{usPercent}%</span>
              <span className="text-gray-500 text-[10px] sm:text-xs">HP</span>
            </div>
            <div className="health-bar-container h-4 sm:h-6">
              <motion.div 
                className="health-bar-fill bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${usPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* VS Circle - Smaller on mobile */}
          <motion.div 
            className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center border-2 border-white/20 shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-heading font-bold text-black text-xs sm:text-lg">VS</span>
          </motion.div>

          {/* Iran HP Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
              <span className="text-gray-500 text-[10px] sm:text-xs">HP</span>
              <span className="font-mono font-bold text-red-400">{iranPercent}%</span>
            </div>
            <div className="health-bar-container h-4 sm:h-6">
              <motion.div 
                className="health-bar-fill bg-gradient-to-l from-red-700 via-red-500 to-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${iranPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Center Line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 -translate-x-1/2" />

        {/* FIGHT! Overlay */}
        <AnimatePresence>
          {showFight && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl sm:rounded-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
                className="font-heading font-bold text-4xl sm:text-6xl text-yellow-400"
                style={{ textShadow: '0 0 40px rgba(234, 179, 8, 0.5)' }}
              >
                FIGHT!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Combo Text */}
      <AnimatePresence>
        {showCombo && comboText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mt-4"
          >
            <span className={`combo-text text-xl ${comboText.color || 'text-white'}`}>
              {comboText.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HPBar;

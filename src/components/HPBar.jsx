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
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Top Labels */}
      <div className="flex justify-between items-end mb-3">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇺🇸</span>
            <span className="font-bangers text-xl text-blue-400 tracking-wider">UNITED STATES</span>
          </div>
          <span className="text-xs text-gray-500 font-comic">The Dealmaker</span>
        </div>

        <div className="text-center px-6">
          <div className="font-bangers text-sm text-gray-500 mb-1">ROUND 1</div>
          <div className="vs-divider gap-4">
            <span className="font-bangers text-3xl text-yellow-500 text-glow">VS</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className="font-bangers text-xl text-red-400 tracking-wider">IRAN</span>
            <span className="text-2xl">🇮🇷</span>
          </div>
          <span className="text-xs text-gray-500 font-comic">The Shadow</span>
        </div>
      </div>

      {/* Main Health Bars */}
      <div className="relative bg-black/40 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-6">
          {/* US HP Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-impact text-blue-400">{usPercent}%</span>
              <span className="text-gray-500 text-xs">HP</span>
            </div>
            <div className="health-bar-container h-6">
              <motion.div 
                className="health-bar-fill bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${usPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* VS Circle */}
          <motion.div 
            className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center border-2 border-white/20 shrink-0"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-bangers text-black text-lg">VS</span>
          </motion.div>

          {/* Iran HP Bar */}
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 text-xs">HP</span>
              <span className="font-impact text-red-400">{iranPercent}%</span>
            </div>
            <div className="health-bar-container h-6">
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
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
                className="font-bangers text-6xl text-yellow-400"
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

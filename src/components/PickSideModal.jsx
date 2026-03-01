import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PickSideModal = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Check if user has already picked a side
    const savedSide = localStorage.getItem('userSide');
    if (!savedSide) {
      // Show modal on first visit
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    } else {
      // Already has side, complete immediately
      onComplete?.(savedSide);
    }
  }, [onComplete]);

  const handleSelectSide = (side) => {
    setSelectedSide(side);
    setShowConfirmation(true);
    
    // Save to localStorage
    localStorage.setItem('userSide', side);
    
    // Show confirmation briefly then close
    setTimeout(() => {
      setIsVisible(false);
      onComplete?.(side);
    }, 1500);
  };

  const getSideStyles = (side) => {
    if (side === 'us') {
      return {
        base: 'from-blue-600/20 to-blue-900/20 border-blue-500/30 hover:border-blue-400',
        glow: 'hover:shadow-blue-500/30',
        text: 'text-blue-400',
        bg: 'bg-blue-500/20',
        gradient: 'from-blue-600 to-blue-400'
      };
    }
    return {
      base: 'from-red-600/20 to-red-900/20 border-red-500/30 hover:border-red-400',
      glow: 'hover:shadow-red-500/30',
      text: 'text-red-400',
      bg: 'bg-red-500/20',
      gradient: 'from-red-600 to-red-400'
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ 
                x: [0, -100, 0],
                y: [0, 50, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                ⚔️
              </motion.div>
              <h1 className="font-bangers text-4xl md:text-6xl text-white tracking-wider mb-2">
                CHOOSE YOUR SIDE
              </h1>
              <p className="text-gray-400 font-comic text-lg">
                This changes nothing. It&apos;s just more fun.
              </p>
            </div>

            {/* Side Cards */}
            {!showConfirmation ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* US Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSide('us')}
                  className={`relative group bg-gradient-to-br ${getSideStyles('us').base} border-2 rounded-2xl p-8 transition-all duration-300 ${getSideStyles('us').glow} hover:shadow-2xl`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getSideStyles('us').gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🇺🇸</div>
                    <h2 className={`font-bangers text-3xl ${getSideStyles('us').text} mb-2`}>
                      TEAM USA
                    </h2>
                    <p className="text-gray-400 font-comic text-sm mb-4">
                      The Dealmaker 💰
                    </p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSideStyles('us').bg}`}>
                      <span className="text-2xl">🦅</span>
                      <span className={`font-impact ${getSideStyles('us').text}`}>SELECT</span>
                    </div>
                  </div>
                </motion.button>

                {/* Iran Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSide('iran')}
                  className={`relative group bg-gradient-to-br ${getSideStyles('iran').base} border-2 rounded-2xl p-8 transition-all duration-300 ${getSideStyles('iran').glow} hover:shadow-2xl`}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getSideStyles('iran').gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🇮🇷</div>
                    <h2 className={`font-bangers text-3xl ${getSideStyles('iran').text} mb-2`}>
                      TEAM IRAN
                    </h2>
                    <p className="text-gray-400 font-comic text-sm mb-4">
                      The Shadow 🕶️
                    </p>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getSideStyles('iran').bg}`}>
                      <span className="text-2xl">☠️</span>
                      <span className={`font-impact ${getSideStyles('iran').text}`}>SELECT</span>
                    </div>
                  </div>
                </motion.button>
              </div>
            ) : (
              /* Confirmation Screen */
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  🔥
                </motion.div>
                <h2 className="font-bangers text-3xl text-white mb-2">
                  YOU CHOSE {selectedSide === 'us' ? 'USA' : 'IRAN'}!
                </h2>
                <p className="text-gray-400 font-comic">
                  Loading the chaos...
                </p>
              </motion.div>
            )}

            {/* Skip Option */}
            {!showConfirmation && (
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    localStorage.setItem('userSide', 'neutral');
                    setIsVisible(false);
                    onComplete?.('neutral');
                  }}
                  className="text-gray-500 hover:text-gray-300 font-comic text-sm transition-colors"
                >
                  I&apos;m just watching →
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PickSideModal;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { dismissAlert } from '../lib/api';

const BreakingAlert = ({ alert, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
      
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDismiss = async () => {
    setVisible(false);
    try {
      await dismissAlert();
    } catch (e) {
      // Ignore
    }
    onDismiss?.();
  };

  if (!alert || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-red-950/95 z-[100] flex items-center justify-center"
        >
          {/* Siren animation background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-red-600/20"
            />
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative text-center p-8 max-w-2xl mx-4"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-0 right-0 text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Alert icon */}
            <motion.div
              animate={{ 
                rotate: [-5, 5, -5],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
            </motion.div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600 text-white font-bangers text-lg px-4 py-2 rounded mb-4">
              <span className="animate-pulse">⚠️</span>
              BREAKING ALERT
              <span className="animate-pulse">⚠️</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-bangers text-3xl md:text-4xl text-white mb-4 tracking-wide">
              {alert.headline}
            </h1>
            
            {/* Meme caption */}
            <p className="font-comic text-xl text-red-300 mb-6">
              {alert.caption}
            </p>
            
            {/* Badge */}
            <div className={`inline-block px-4 py-2 rounded-lg border text-lg font-bangers ${
              alert.badge?.includes('BREAKING') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              alert.badge?.includes('YIKES') ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
              alert.badge?.includes('SUS') ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}>
              {alert.badge || 'BREAKING 💥'}
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <div className="mt-8 h-1 bg-red-900/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-red-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreakingAlert;

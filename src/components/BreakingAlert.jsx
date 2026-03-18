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
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative text-center p-8 max-w-2xl mx-4"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-0 right-0 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Alert icon */}
            <div className="text-6xl mb-4">
              <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
            </div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-red-600 text-white font-heading text-sm font-bold px-4 py-2 rounded mb-4">
              <span>⚠️</span>
              ALERT
              <span>⚠️</span>
            </div>
            
            {/* Headline */}
            <h1 className="font-heading text-2xl md:text-3xl text-white mb-4 tracking-wide">
              {alert.headline}
            </h1>
            
            {/* Analysis */}
            <p className="font-body text-lg text-gray-300 mb-6">
              {alert.caption}
            </p>
            
            {/* Badge */}
            <div className={`inline-block px-4 py-2 rounded-lg border text-sm font-heading ${
              alert.badge?.includes('BREAKING') ? 'bg-red-500/20 text-red-400 border-red-500/30' :
              alert.badge?.includes('ESCALATION') ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
              alert.badge?.includes('CONFIRMED') ? 'bg-green-500/20 text-green-400 border-green-500/30' :
              'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}>
              {alert.badge || 'UPDATE'}
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <div className="mt-8 h-1 bg-gray-800 rounded-full overflow-hidden">
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

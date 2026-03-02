import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minus } from 'lucide-react';
import LiveWarRoom from './LiveWarRoom';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate new message notification
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen && Math.random() > 0.7) {
        setHasNewMessages(true);
        setUnreadCount(prev => Math.min(prev + 1, 9));
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessages(false);
      setUnreadCount(0);
    }
  };

  return (
    <>
      {/* Floating Bubble Button - Mobile Optimized */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-12 h-12 sm:w-14 sm:h-14 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center justify-center hover:scale-110 transition-all border border-red-400/50"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            
            {/* Notification Badge */}
            {hasNewMessages && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 text-black text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center animate-bounce border-2 border-black">
                {unreadCount}
              </span>
            )}
            
            {/* Subtle Glow Ring */}
            <span className="absolute inset-0 rounded-full border border-red-400/30 animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm sm:backdrop-blur-md"
            onClick={toggleChat}
          />
        )}
      </AnimatePresence>

      {/* Chat Window - Mobile Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] 
                       w-auto sm:w-[400px] h-[70vh] sm:h-[520px] 
                       bg-[#0a0a0a] border border-red-500/30 sm:border-2 sm:border-red-500/50 
                       rounded-xl sm:rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-heading font-semibold text-sm sm:text-base text-white tracking-wide">WAR ROOM</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={toggleChat}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="h-[calc(100%-48px)] sm:h-[calc(100%-52px)]">
              <LiveWarRoom />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;

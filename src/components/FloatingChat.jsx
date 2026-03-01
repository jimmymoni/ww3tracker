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
      {/* Floating Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-[100] w-16 h-16 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all border-2 border-red-400"
          >
            <span className="text-2xl">💬</span>
            
            {/* Notification Badge */}
            {hasNewMessages && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center animate-bounce border-2 border-black">
                {unreadCount}
              </span>
            )}
            
            {/* Glow Ring */}
            <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-40" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[100] w-[380px] h-[500px] bg-[#0a0a0a] border-2 border-red-500/50 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bangers text-white tracking-wider">WAR ROOM</span>
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
            <div className="h-[calc(100%-52px)]">
              <LiveWarRoom />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;

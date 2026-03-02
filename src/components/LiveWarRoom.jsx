import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Send, Users, Flame, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin;

const LiveWarRoom = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [viewerCount, setViewerCount] = useState(847);
  const [usWinPercent, setUsWinPercent] = useState(73);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [rateLimitWarning, setRateLimitWarning] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Connect to socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('init', (data) => {
      setUsername(data.username);
      setViewerCount(data.viewerCount);
      setUsWinPercent(data.usWinPercent);
      if (data.messages) {
        setMessages(data.messages);
      }
    });

    newSocket.on('newMessage', (message) => {
      setMessages(prev => {
        const newMessages = [...prev, message];
        return newMessages.slice(-50); // Keep last 50
      });
    });

    newSocket.on('userJoined', (data) => {
      setViewerCount(data.count);
      if (data.message) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          username: 'System',
          side: 'neutral',
          text: data.message,
          timestamp: Date.now(),
          isSystem: true
        }]);
      }
    });

    newSocket.on('userLeft', (data) => {
      setViewerCount(data.count);
    });

    // Handle viewer count updates (realistic simulation)
    newSocket.on('viewerUpdate', (data) => {
      setViewerCount(data.count);
    });

    newSocket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    // Handle typing indicator from bots
    newSocket.on('typing', (data) => {
      setIsTyping(data.isTyping);
      if (data.isTyping) {
        // Pick a random fake user name for typing indicator
        const fakeUserNames = ['DegenerateGambler', 'AllInOnIran', 'PolymarketWhale', 'TehranTendies', 'YOLO_America', 'HedgeFundHassan', 'PutItAllOnRed', 'IRAN_to_the_MOON'];
        setTypingUser(fakeUserNames[Math.floor(Math.random() * fakeUserNames.length)]);
        
        // Clear typing after 4 seconds max
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 4000);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Rate limit check
  const canSendMessage = () => {
    const now = Date.now();
    return now - lastMessageTime >= 5000; // 5 seconds
  };

  const handleSend = () => {
    if (!inputText.trim() || !socket || !canSendMessage()) {
      if (!canSendMessage()) {
        setRateLimitWarning(true);
        setTimeout(() => setRateLimitWarning(false), 2000);
      }
      return;
    }

    socket.emit('chatMessage', { text: inputText.trim() });
    setInputText('');
    setLastMessageTime(Date.now());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFlag = (side) => {
    if (side === 'us') return '🇺🇸';
    if (side === 'iran') return '🇮🇷';
    return '⚪';
  };

  const getMessageStyle = (msg) => {
    if (msg.isSystem) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    if (msg.isBot) return 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30';
    if (msg.side === 'us') return 'bg-blue-500/10 border-blue-500/30';
    if (msg.side === 'iran') return 'bg-red-500/10 border-red-500/30';
    return 'bg-white/5 border-white/10';
  };
  
  const isFakeUser = (username) => {
    const fakeUserNames = ['DegenerateGambler', 'AllInOnIran', 'PolymarketWhale', 'TehranTendies', 'YOLO_America', 'HedgeFundHassan', 'PutItAllOnRed', 'IRAN_to_the_MOON'];
    return fakeUserNames.includes(username);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-0 pt-1 sm:pt-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="font-heading font-semibold text-sm sm:text-xl text-white tracking-wide truncate">LIVE WAR ROOM</h2>
              <div className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-medium shrink-0 ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-gray-500 font-body">
              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{viewerCount} watching</span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="text-blue-400 hidden sm:inline">{usWinPercent}% US win</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="comic-panel rounded-lg sm:rounded-xl flex-1 flex flex-col overflow-hidden border border-white/10">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 scrollbar-hide">
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 font-body px-1"
              >
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="truncate">{typingUser} typing</span>
                <span className="flex gap-0.5">
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  >.</motion.span>
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  >.</motion.span>
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  >.</motion.span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                <p className="font-comic text-sm">Welcome to the War Room 🎖️</p>
                <p className="text-xs mt-1">Drop your takes bestie...</p>
              </motion.div>
            )}
            
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border ${getMessageStyle(msg)}`}
              >
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <span className="text-sm shrink-0">{getFlag(msg.side)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                      <span className={`text-[10px] font-mono font-medium truncate max-w-[100px] sm:max-w-none ${
                        msg.isSystem ? 'text-yellow-400' :
                        msg.isBot || isFakeUser(msg.username) ? 'text-purple-400' :
                        msg.side === 'us' ? 'text-blue-400' :
                        msg.side === 'iran' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {msg.username}
                        {(msg.isBot || isFakeUser(msg.username)) && (
                          <span className="ml-0.5 text-[8px] opacity-60">🤖</span>
                        )}
                      </span>
                      <span className="text-[9px] text-gray-600 shrink-0">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-body text-gray-300 break-words leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-2 sm:p-3 border-t border-white/10 bg-black/20">
          {/* Rate Limit Warning */}
          <AnimatePresence>
            {rateLimitWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-1.5 sm:mb-2 text-[9px] sm:text-[10px] text-red-400 font-body text-center"
              >
                Slow down! Wait 5 seconds 💀
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-1.5 sm:gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Drop your take..."
                maxLength={150}
                disabled={!isConnected}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-body text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors disabled:opacity-50"
              />
              <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] ${
                inputText.length >= 140 ? 'text-red-400' : 'text-gray-600'
              }`}>
                {inputText.length}
              </span>
            </div>
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || !isConnected || !canSendMessage()}
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 rounded-lg px-2.5 sm:px-3 py-2 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shrink-0"
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          <p className="mt-1.5 sm:mt-2 text-[8px] sm:text-[9px] text-gray-600 text-center font-body">
            {isConnected 
              ? `1 msg / 5 sec • Auto-filter on`
              : 'Connecting...'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveWarRoom;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2 } from 'lucide-react';
import { sendChatMessage, fetchNews } from '../lib/api';

const GenZAnalyst = () => {
  const [quips, setQuips] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLive, setIsLive] = useState(true);
  const messagesEndRef = useRef(null);
  const hasWelcomed = useRef(false);

  // Auto-commentary on latest news
  useEffect(() => {
    const generateCommentary = async () => {
      if (!isLive) return;
      
      setIsTyping(true);
      try {
        // Get latest news for context
        const news = await fetchNews(1);
        const context = news.items?.[0]?.headline || 'US-Iran tensions';
        
        // Get AI response
        const response = await sendChatMessage('React to the latest news', context);
        
        addQuip(response.response || 'Bestie, the tea is hot today ☕️🔥');
      } catch (error) {
        console.error('Chat error:', error);
        // Fallback quips
        const fallbacks = [
          "bro iran just caught an L fr fr 💀",
          "US said no cap we bussin today 🦅",
          "this ain't it chief 😭",
          "the plot thickens bestie 🍵",
          "iran is literally giving main character energy rn 🎭",
        ];
        addQuip(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
      } finally {
        setIsTyping(false);
      }
    };

    // Initial greeting (only once)
    if (!hasWelcomed.current) {
      hasWelcomed.current = true;
      addQuip("yo bestie, welcome to the chaos! AI analyst here, no cap 👋🤖");
    }
    
    // Generate commentary every 15 seconds
    const interval = setInterval(generateCommentary, 15000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [quips, isTyping]);

  const addQuip = (text, isUser = false) => {
    setQuips(prev => {
      const newQuips = [...prev, { id: Date.now(), text, isUser }];
      return newQuips.slice(-10); // Keep last 10
    });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    addQuip(inputValue, true);
    setInputValue('');
    setIsTyping(true);
    setIsLive(false); // Pause auto-commentary
    
    try {
      const news = await fetchNews(1);
      const context = news.items?.[0]?.headline;
      const response = await sendChatMessage(inputValue, context);
      
      setTimeout(() => {
        addQuip(response.response);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      setTimeout(() => {
        addQuip("bestie my brain is lagging rn, try again? 💀");
        setIsTyping(false);
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon text-pink-400">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-bangers text-xl text-white tracking-wider">GEN-Z ANALYST</h2>
          <p className="text-gray-500 text-xs font-comic">
            {isLive ? 'AI-powered commentary' : 'Chat mode (auto-paused)'}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
          <span className="text-[10px] text-gray-500 font-comic">{isLive ? 'LIVE' : 'CHAT'}</span>
        </div>
      </div>

      {/* Chat */}
      <div className="comic-panel rounded-xl p-4">
        <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar-hide mb-3">
          <AnimatePresence mode="popLayout">
            {quips.map((quip, index) => (
              <motion.div
                key={quip.id}
                initial={{ opacity: 0, x: quip.isUser ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${quip.isUser ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border shrink-0 ${
                  quip.isUser 
                    ? 'bg-blue-500/20 border-blue-500/30' 
                    : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-white/10'
                }`}>
                  {quip.isUser ? '👤' : '🤖'}
                </div>
                <div className={`rounded-xl px-3 py-2 max-w-[80%] ${
                  quip.isUser
                    ? 'bg-blue-500/20 border border-blue-500/30 rounded-tr-sm'
                    : 'genz-bubble rounded-tl-sm'
                }`}>
                  <p className={`font-comic text-sm leading-relaxed ${
                    quip.isUser ? 'text-blue-200' : 'text-gray-300'
                  }`}>
                    {quip.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-sm border border-white/10 shrink-0">
                🤖
              </div>
              <div className="bg-white/5 rounded-xl rounded-tl-sm px-3 py-2">
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 pt-3 border-t border-white/5">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the analyst..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-comic text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 rounded-lg px-3 py-2 hover:bg-pink-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Note */}
      <p className="mt-2 text-center text-[10px] text-gray-600 font-comic">
        * Powered by Moonshot AI (Kimi) • Responses are AI-generated
      </p>
    </div>
  );
};

export default GenZAnalyst;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, TrendingUp, Send, Flame, Skull, Zap, Crown } from 'lucide-react';

const WarRoomComments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [selectedSide, setSelectedSide] = useState('neutral');
  const commentsEndRef = useRef(null);

  // Load comments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('warroom_comments');
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      // Seed with some initial comments
      const seedComments = [
        { id: 1, user: 'DoomScroll_99', text: 'US at 100% HP? Nah that bar gonna drop quick if Iran activates proxies 🔥', side: 'iran', timestamp: Date.now() - 3600000, likes: 45 },
        { id: 2, user: 'TrumpTrain2025', text: 'Sanctions already working. Iran economy in shambles 💰', side: 'us', timestamp: Date.now() - 7200000, likes: 32 },
        { id: 3, user: 'NeutralObserver', text: 'Both sides playing chicken. Who blinks first? 👀', side: 'neutral', timestamp: Date.now() - 10800000, likes: 28 },
        { id: 4, user: 'BunkerBuilder', text: 'Yall sleeping on that 65% WW3 probability ☢️', side: 'neutral', timestamp: Date.now() - 14400000, likes: 67 },
      ];
      setComments(seedComments);
      localStorage.setItem('warroom_comments', JSON.stringify(seedComments));
    }

    const savedUser = localStorage.getItem('warroom_username');
    if (savedUser) {
      setUsername(savedUser);
    } else {
      setShowUsernameInput(true);
    }
  }, []);

  // Save comments when they change
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem('warroom_comments', JSON.stringify(comments));
    }
  }, [comments]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !username) return;

    const comment = {
      id: Date.now(),
      user: username,
      text: newComment.trim(),
      side: selectedSide,
      timestamp: Date.now(),
      likes: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleLike = (id) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getSideColor = (side) => {
    switch(side) {
      case 'us': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      case 'iran': return 'text-red-400 border-red-500/30 bg-red-500/10';
      default: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    }
  };

  const getSideIcon = (side) => {
    switch(side) {
      case 'us': return <Crown className="w-3 h-3" />;
      case 'iran': return <Skull className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const hotTopics = [
    { topic: "Who drops first?", votes: 234, trending: true },
    { topic: "Is the 65% WW3 prob accurate?", votes: 189, trending: true },
    { topic: "Trump vs Supreme Leader Round 1", votes: 156, trending: false },
    { topic: "Sanctions actually working?", votes: 98, trending: false },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
          <MessageSquare className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base sm:text-lg text-white tracking-wide">WAR ROOM DEBATES</h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-[10px] rounded border border-yellow-500/30 font-mono">
              <TrendingUp className="w-3 h-3" />
              LIVE
            </span>
          </div>
          <p className="text-gray-500 text-[10px] sm:text-xs">Join {comments.length + 2400} fighters in the chaos</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span className="font-mono">{(comments.length + 2400).toLocaleString()} debating</span>
        </div>
      </div>

      {/* Hot Topics Bar */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {hotTopics.map((topic, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                topic.trending 
                  ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-xs text-gray-300 whitespace-nowrap">{topic.topic}</p>
              <div className="flex items-center gap-1 mt-1">
                {topic.trending && <TrendingUp className="w-3 h-3 text-yellow-400" />}
                <span className="text-[10px] text-gray-500">{topic.votes} votes</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comments Container */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
        {/* Comments List */}
        <div className="max-h-[400px] overflow-y-auto p-3 space-y-3">
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${getSideColor(comment.side)}`}>
                  {getSideIcon(comment.side)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-300 truncate">{comment.user}</span>
                    <span className="text-[10px] text-gray-600">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-yellow-400 transition-colors"
                    >
                      <Flame className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={commentsEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-3 bg-white/5">
          {showUsernameInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Choose your codename..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && username && setShowUsernameInput(false)}
                className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
              />
              <button
                onClick={() => username && setShowUsernameInput(false)}
                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-400 text-xs font-bold transition-colors"
              >
                ENTER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Side Selector */}
              <div className="flex gap-2">
                {[
                  { id: 'us', label: '🇺🇸 US', color: 'blue' },
                  { id: 'iran', label: '🇮🇷 Iran', color: 'red' },
                  { id: 'neutral', label: '👀 Neutral', color: 'yellow' }
                ].map(side => (
                  <button
                    key={side.id}
                    type="button"
                    onClick={() => setSelectedSide(side.id)}
                    className={`px-2 py-1 rounded text-[10px] border transition-colors ${
                      selectedSide === side.id
                        ? side.color === 'blue' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
                          side.color === 'red' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                          'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                        : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                    }`}
                  >
                    {side.label}
                  </button>
                ))}
              </div>

              {/* Comment Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Drop your hot take..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-black/50 border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-500/30 rounded-lg text-yellow-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Mobile Comment Count */}
      <div className="sm:hidden flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs">
        <Users className="w-3.5 h-3.5" />
        <span className="font-mono">{(comments.length + 2400).toLocaleString()} debating</span>
      </div>

      {/* Engagement Prompt */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-gradient-to-r from-red-500/10 via-transparent to-yellow-500/10 rounded-lg border border-white/10"
      >
        <p className="text-xs text-gray-400 text-center font-comic">
          💬 <span className="text-yellow-400">Hot take?</span> Drop it below. Best comments get featured in the feed.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default WarRoomComments;

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ChevronLeft, ChevronRight, Zap, AlertTriangle, Radio } from 'lucide-react';

// GIF URLs for each leader - using reliable direct links with fallbacks
const LEADER_GIFS = {
  trump: 'https://media.giphy.com/media/xTiTnHXbRoaZ1B1Mo8/giphy.gif',
  netanyahu: 'https://media.giphy.com/media/4cLPinc3th5o8ScXS6/giphy.gif',
  iran: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmtxcm5ma2hrd2Jta3hxYWMwbnEwc3FtNjFmZ25pcXA1dGw2M2dpZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J0jhIOGDFZEhK6CC1C/giphy.gif',  // Ayatollah Mojtaba Khamenei
  mbs: 'https://media.giphy.com/media/gk18coJsC7DqIX8rez/giphy.gif',
  kim: 'https://media.giphy.com/media/wUTUBrRYwxMVW/giphy.gif'
};

const SITE_URL = 'https://ww3tracker.live';

// Status types for dynamic updates
const STATUS_TYPES = {
  STRIKING: { label: 'STRIKING', color: 'blue', icon: '⚡' },
  UNDER_FIRE: { label: 'UNDER FIRE', color: 'red', icon: '🔥' },
  ACTIVE: { label: 'ACTIVE OPS', color: 'indigo', icon: '🎯' },
  RETALIATING: { label: 'RETALIATING', color: 'orange', icon: '🚀' },
  WILDCARD: { label: 'WILDCARD', color: 'purple', icon: '🎲' },
  HIT: { label: 'INFRASTRUCTURE HIT', color: 'yellow', icon: '💥' },
  MONITORING: { label: 'MONITORING', color: 'emerald', icon: '👁️' }
};

// Fetch live stats from API
const fetchLiveStats = async () => {
  try {
    const response = await fetch('/api/state');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[GlobalParticipants] Could not fetch live stats:', err);
    return null;
  }
};

// Key participants - dynamically updated from live API data
const getInitialLeadersData = (liveData = null) => {
  // Get real values from API or use defaults
  const usHP = liveData?.usHP ?? 75;
  const iranHP = liveData?.iranHP ?? 60;
  const tension = liveData?.tension ?? 45;
  
  // Determine status based on actual HP values
  const getUSStatus = () => {
    if (usHP > 80) return STATUS_TYPES.STRIKING;
    if (usHP > 50) return STATUS_TYPES.ACTIVE;
    return STATUS_TYPES.UNDER_FIRE;
  };
  
  const getIranStatus = () => {
    if (iranHP > 70) return STATUS_TYPES.RETALIATING;
    if (iranHP > 40) return STATUS_TYPES.ACTIVE;
    return STATUS_TYPES.UNDER_FIRE;
  };
  
  const getTensionLabel = () => {
    if (tension > 75) return 'Critical';
    if (tension > 50) return 'Elevated';
    if (tension > 30) return 'Tense';
    return 'Stable';
  };
  
  return [
    {
      id: 'trump',
      name: 'DONALD TRUMP',
      country: 'United States',
      flag: '🇺🇸',
      nickname: 'US PRESIDENT',
      gifUrl: LEADER_GIFS.trump,
      accentColor: 'blue',
      status: getUSStatus(),
      stats: [
        { emoji: '❤️', label: 'Strength', value: `${Math.round(usHP)}%` },
        { emoji: '📊', label: 'Tension', value: getTensionLabel() },
        { emoji: '🎯', label: 'Posture', value: usHP > 60 ? 'Offensive' : 'Defensive' }
      ],
      lastUpdate: Date.now(),
      shareText: `🇺🇸 US Position:\n❤️ Strength: ${Math.round(usHP)}%\n📊 Tension: ${getTensionLabel()}\n🎯 Posture: ${usHP > 60 ? 'Offensive' : 'Defensive'}\n\nLive updates: ${SITE_URL}\n\n#USvsIran`
    },
    {
      id: 'iran',
      name: 'AYATOLLAH MOJTABA KHAMENEI',
      country: 'Iran',
      flag: '🇮🇷',
      nickname: 'SUPREME LEADER',
      gifUrl: LEADER_GIFS.iran,
      accentColor: 'red',
      status: getIranStatus(),
      stats: [
        { emoji: '❤️', label: 'Strength', value: `${Math.round(iranHP)}%` },
        { emoji: '📊', label: 'Tension', value: getTensionLabel() },
        { emoji: '🚀', label: 'Posture', value: iranHP > 50 ? 'Retaliating' : 'Defensive' }
      ],
      lastUpdate: Date.now(),
      shareText: `🇮🇷 Iran Position:\n❤️ Strength: ${Math.round(iranHP)}%\n📊 Tension: ${getTensionLabel()}\n🚀 Posture: ${iranHP > 50 ? 'Retaliating' : 'Defensive'}\n\nLive updates: ${SITE_URL}\n\n#USvsIran`
    },
    {
      id: 'netanyahu',
      name: 'BIBI NETANYAHU',
      country: 'Israel',
      flag: '🇮🇱',
      nickname: 'ISRAELI PM',
      gifUrl: LEADER_GIFS.netanyahu,
      accentColor: 'indigo',
      status: tension > 60 ? STATUS_TYPES.ACTIVE : STATUS_TYPES.MONITORING,
      stats: [
        { emoji: '🎯', label: 'Operation', value: 'Active' },
        { emoji: '📊', label: 'Tension', value: getTensionLabel() },
        { emoji: '🛡️', label: 'Status', value: tension > 70 ? 'High Alert' : 'Watch' }
      ],
      lastUpdate: Date.now(),
      shareText: `🇮🇱 Israel Position:\n🎯 Operation: Active\n📊 Tension: ${getTensionLabel()}\n🛡️ Status: ${tension > 70 ? 'High Alert' : 'Watch'}\n\nActive partner 👇\n${SITE_URL}\n\n#USvsIran`
    }
  ];
};

const getAccentClasses = (color) => {
  const classes = {
    blue: { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', bar: 'bg-blue-500', glow: 'shadow-blue-500/20', pulse: 'animate-pulse-blue' },
    indigo: { text: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', bar: 'bg-indigo-500', glow: 'shadow-indigo-500/20', pulse: 'animate-pulse-indigo' },
    red: { text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', bar: 'bg-red-500', glow: 'shadow-red-500/20', pulse: 'animate-pulse-red' },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', glow: 'shadow-emerald-500/20', pulse: 'animate-pulse-emerald' },
    purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', bar: 'bg-purple-500', glow: 'shadow-purple-500/20', pulse: 'animate-pulse-purple' },
    orange: { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', bar: 'bg-orange-500', glow: 'shadow-orange-500/20', pulse: 'animate-pulse-orange' },
    yellow: { text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', bar: 'bg-yellow-500', glow: 'shadow-yellow-500/20', pulse: 'animate-pulse-yellow' }
  };
  return classes[color] || classes.blue;
};

// Format time ago
const getTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
};

const LeaderCardDesktop = ({ leader, isNewAlert }) => {
  const [gifLoaded, setGifLoaded] = useState(false);
  const accent = getAccentClasses(leader.accentColor);
  const statusColor = getAccentClasses(leader.status.color);

  const handleShare = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(leader.shareText)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`comic-panel rounded-xl overflow-hidden h-full border ${accent.border} ${accent.glow} shadow-lg relative`}>
        {/* New Alert Flash */}
        <AnimatePresence>
          {isNewAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="absolute inset-0 bg-red-500/20 z-20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Status Badge - Bottom Right */}
        <div className="absolute bottom-20 right-3 z-10">
          <motion.div 
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-body bg-black/90 backdrop-blur-md ${statusColor.text} border ${statusColor.border} flex items-center gap-1 shadow-xl`}
            animate={leader.status.color === 'red' || leader.status.color === 'orange' ? {
              boxShadow: ['0 0 0px rgba(239, 68, 68, 0)', '0 0 12px rgba(239, 68, 68, 0.5)', '0 0 0px rgba(239, 68, 68, 0)']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span>{leader.status.icon}</span>
            <span className="tracking-wide">{leader.status.label}</span>
          </motion.div>
        </div>

        {/* GIF Header - Taller on desktop */}
        <div className="relative">
          <div className={`relative w-full h-52 overflow-hidden border-b-2 ${accent.border}`}>
            <img
              src={leader.gifUrl}
              alt={`${leader.name} - Animated GIF`}
              className={`w-full h-full ${leader.id === 'iran' ? 'object-contain bg-black' : 'object-cover object-top'}`}
              onLoad={() => setGifLoaded(true)}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Flag overlay */}
            <div className="absolute top-3 right-3">
              <span className="text-3xl drop-shadow-lg">{leader.flag}</span>
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-20 p-4">
              <h3 className={`font-heading font-bold text-lg ${accent.text} tracking-wide drop-shadow-lg truncate`}>
                {leader.name}
              </h3>
              <p className="text-gray-300 text-sm font-body truncate">{leader.nickname}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {leader.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className={`${accent.bg} px-2 py-3 rounded-lg border ${accent.border} text-center`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl mb-1">{stat.emoji}</div>
                <div className="text-[10px] text-gray-500 font-body uppercase truncate">{stat.label}</div>
                <div className="font-mono font-bold text-white text-sm truncate">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Last Updated & Share */}
        <div className="px-4 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Radio className="w-3 h-3" />
              <span>{getTimeAgo(leader.lastUpdate)}</span>
            </div>
            {leader.status.color === 'red' || leader.status.color === 'orange' ? (
              <div className="flex items-center gap-1 text-xs text-red-400">
                <Zap className="w-3 h-3 animate-pulse" />
                <span className="animate-pulse">LIVE</span>
              </div>
            ) : null}
          </div>
          
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-body text-sm transition-all bg-black border ${accent.border} hover:${accent.bg} text-white`}
          >
            <Share2 className="w-4 h-4" />
            <span>Share on X</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const LeaderCard = ({ leader, isNewAlert }) => {
  const [gifLoaded, setGifLoaded] = useState(false);
  const accent = getAccentClasses(leader.accentColor);
  const statusColor = getAccentClasses(leader.status.color);

  const handleShare = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(leader.shareText)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  };

  return (
    <motion.div
      className="flex-shrink-0 w-[280px] sm:w-[320px] snap-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`comic-panel rounded-xl overflow-hidden h-full border ${accent.border} ${accent.glow} shadow-lg relative`}>
        {/* New Alert Flash */}
        <AnimatePresence>
          {isNewAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: 3 }}
              className="absolute inset-0 bg-red-500/20 z-20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Status Badge - Bottom Right (doesn't block faces) */}
        <div className="absolute bottom-16 right-3 z-10">
          <motion.div 
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-body bg-black/90 backdrop-blur-md ${statusColor.text} border ${statusColor.border} flex items-center gap-1 shadow-xl`}
            animate={leader.status.color === 'red' || leader.status.color === 'orange' || leader.status.color === 'yellow' ? {
              boxShadow: ['0 0 0px rgba(239, 68, 68, 0)', '0 0 12px rgba(239, 68, 68, 0.5)', '0 0 0px rgba(239, 68, 68, 0)']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span>{leader.status.icon}</span>
            <span className="tracking-wide">{leader.status.label}</span>
          </motion.div>
        </div>

        {/* GIF Header */}
        <div className="relative">
          <div className={`relative w-full h-44 sm:h-52 overflow-hidden border-b-2 ${accent.border}`}>
            <img
              src={leader.gifUrl}
              alt={`${leader.name} - Animated GIF`}
              className={`w-full h-full ${leader.id === 'iran' ? 'object-contain bg-black' : 'object-cover object-top'}`}
              onLoad={() => setGifLoaded(true)}
              loading="lazy"
              decoding="async"
            />
            {/* Gradient from bottom for text readability only */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {/* Flag overlay */}
            <div className="absolute top-2 right-2">
              <span className="text-2xl sm:text-3xl drop-shadow-lg">{leader.flag}</span>
            </div>

            {/* Name overlay - positioned left to avoid badge */}
            <div className="absolute bottom-0 left-0 right-20 p-3">
              <h3 className={`font-heading font-bold text-sm sm:text-lg ${accent.text} tracking-wide drop-shadow-lg truncate`}>
                {leader.name}
              </h3>
              <p className="text-gray-300 text-xs font-body truncate">{leader.nickname}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {leader.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className={`${accent.bg} px-2 py-2 rounded border ${accent.border} text-center`}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-lg mb-0.5">{stat.emoji}</div>
                <div className="text-[9px] text-gray-500 font-body uppercase truncate">{stat.label}</div>
                <div className="font-mono font-bold text-white text-xs truncate">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Last Updated & Share */}
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Radio className="w-3 h-3" />
              <span>{getTimeAgo(leader.lastUpdate)}</span>
            </div>
            {leader.status.color === 'red' || leader.status.color === 'orange' ? (
              <div className="flex items-center gap-1 text-[10px] text-red-400">
                <Zap className="w-3 h-3 animate-pulse" />
                <span className="animate-pulse">LIVE</span>
              </div>
            ) : null}
          </div>
          
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-body text-sm transition-all bg-black border ${accent.border} hover:${accent.bg} text-white`}
          >
            <Share2 className="w-4 h-4" />
            <span>Share on X</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const GlobalParticipantsCarousel = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [leaders, setLeaders] = useState(getInitialLeadersData());
  const [lastGlobalUpdate, setLastGlobalUpdate] = useState(Date.now());
  const [newAlertId, setNewAlertId] = useState(null);

  // Fetch live data on mount
  useEffect(() => {
    const loadLiveData = async () => {
      const liveData = await fetchLiveStats();
      if (liveData) {
        setLeaders(getInitialLeadersData(liveData));
      }
    };
    loadLiveData();
  }, []);

  // Fetch real-time updates from API
  const simulateLiveUpdates = useCallback(async () => {
    // Fetch fresh data from API
    const liveData = await fetchLiveStats();
    
    if (liveData) {
      setLeaders(prevLeaders => {
        const freshData = getInitialLeadersData(liveData);
        return freshData.map((leader, idx) => ({
          ...leader,
          lastUpdate: Date.now()
        }));
      });
      setLastGlobalUpdate(Date.now());
      
      // Show alert if tension is critically high
      if (liveData.tension > 80) {
        setNewAlertId('iran');
        setTimeout(() => setNewAlertId(null), 3000);
      }
    }
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(simulateLiveUpdates, 60000);
    return () => clearInterval(interval);
  }, [simulateLiveUpdates]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    simulateLiveUpdates();
  };

  return (
    <section className="mb-6">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <h2 className="font-heading font-bold text-lg sm:text-xl text-white flex items-center gap-2">
              <span>⚔️</span>
              <span>MAIN COMBATANTS</span>
            </h2>
            {/* Live pulse dot */}
            <div className="absolute -top-1 -right-3 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">
            <Radio className="w-3 h-3" />
            <span>Updated {getTimeAgo(lastGlobalUpdate)}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-all"
            title="Refresh now"
          >
            <Zap className="w-4 h-4" />
          </motion.button>
          
          {/* Desktop arrows */}
          <motion.button
            onClick={() => scroll('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={!canScrollLeft}
            className={`hidden sm:flex p-2 rounded-full border border-white/20 transition-all ${
              canScrollLeft 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-transparent text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={!canScrollRight}
            className={`hidden sm:flex p-2 rounded-full border border-white/20 transition-all ${
              canScrollRight 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-transparent text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Subtitle - minimal */}
      <p className="text-gray-500 text-xs font-body mb-3 px-2">
        Swipe to see all • Updates every 60s
      </p>

      {/* Breaking Alert Banner */}
      <AnimatePresence>
        {newAlertId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-2 mb-3"
          >
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-body">
                ⚡ FLASH: New infrastructure damage reported! Status updated.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Grid Layout | Mobile: Horizontal Scroll */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 px-2">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LeaderCardDesktop 
              leader={leader} 
              isNewAlert={newAlertId === leader.id}
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile: Horizontal Scroll Carousel */}
      <div className="md:hidden relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LeaderCard 
                leader={leader} 
                isNewAlert={newAlertId === leader.id}
              />
            </motion.div>
          ))}
          
          {/* End spacer */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* Mobile swipe indicator */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {leaders.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === 0 ? 'bg-white w-4' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlobalParticipantsCarousel;

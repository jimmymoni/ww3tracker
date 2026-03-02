import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';

// Hardcoded GIF URLs as requested by user
const TRUMP_GIF_URL = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXJvdm5mMnZoNHVuYmt5ZDFyMDJzY3M4bjdtaXJqMDZrN3V5OXkzNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiTnHXbRoaZ1B1Mo8/giphy.gif';
const IRAN_GIF_URL = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3Q1eGJhODQyNzdqdGs3NDByb3FzNjNpOWt1cHdjYTg3NmtieGh0MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KdxduNi5eiR7f6DI68/giphy.gif';

// Website URL - change this to your actual domain when deployed
const SITE_URL = 'https://ww3tracker.live';

const FighterCard = ({ 
  side = 'us', 
  name, 
  nickname, 
  stats, 
  hp, 
  maxHp = 100,
  color,
  borderColor,
  opponentHp = 50
}) => {
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [gifLoaded, setGifLoaded] = useState(false);

  const isUS = side === 'us';
  const accentClass = isUS ? 'text-blue-400 border-blue-500/30' : 'text-red-400 border-red-500/30';
  const bgClass = isUS ? 'bg-blue-500/5' : 'bg-red-500/5';
  const gifUrl = isUS ? TRUMP_GIF_URL : IRAN_GIF_URL;

  // Random quote animation
  useEffect(() => {
    if (!isUS) return;

    const quotes = [
      "We have the best missiles, everybody says so 🚀",
      "Iran? Never heard of her 💅",
      "WINNING. As always. 🏆",
      "My button is bigger than theirs, believe me 🔴",
      "Nobody knows more about geopolitics than me 🧠",
      "Tremendous sanctions, the best sanctions 📈",
      "Fake news! All of it! 📰❌",
      "Beautiful, beautiful military equipment 🎖️",
      "Stable genius moves only ♟️",
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setShowQuote(true);
        setTimeout(() => setShowQuote(false), 4000);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isUS]);

  // Simple text share to X
  const handleShare = () => {
    const shareText = isUS 
      ? `🇺🇸 TRUMP CARD STATS:\n💰 Sanctions: MAXED\n🌶️ Aggression: ${stats.aggression || '87/100'}\n📉 Iran HP: ${Math.round(opponentHp)}%\n\nWho's winning? 👇\n${SITE_URL}\n\n#USvsIran`
      : `🇮🇷 IRAN CARD STATS:\n☢️ Nuke Status: Almost™\n🕵️ Proxies: Active 🔥\n😤 Patience: Running Out\n\nWho's winning? 👇\n${SITE_URL}\n\n#USvsIran`;
    
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(xUrl, '_blank', 'width=550,height=420');
  };

  const StatItem = ({ label, value, emoji, shortLabel }) => (
    <div className={`flex items-center gap-1 sm:gap-2 ${bgClass} px-1 sm:px-2 py-0.5 sm:py-1.5 rounded border ${accentClass}`}>
      <span className="text-xs sm:text-base shrink-0">{emoji}</span>
      <div className="min-w-0 overflow-hidden">
        <div className="text-[7px] sm:text-[9px] text-gray-500 font-body uppercase truncate">
          <span className="sm:hidden">{shortLabel || label}</span>
          <span className="hidden sm:inline">{label}</span>
        </div>
        <div className="font-mono font-bold text-white text-[9px] sm:text-sm leading-tight">
          <span className="sm:hidden">{value.replace('Running Out', 'Low').replace('MAXED OUT', 'MAX')}</span>
          <span className="hidden sm:inline">{value}</span>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className={`comic-panel rounded-xl overflow-hidden ${isAnimating ? (isUS ? 'glow-blue' : 'glow-red') : ''}`}
      animate={isAnimating ? {
        x: isUS ? [0, 3, -3, 3, 0] : [0, -3, 3, -3, 0],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* BIG GIF HEADER - Taller to show more of the GIFs */}
      <div className="relative">
        <motion.div 
          className={`relative w-full h-36 sm:h-44 md:h-56 overflow-hidden border-b-2 ${isUS ? 'border-blue-500/50' : 'border-red-500/50'}`}
          animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        >
          <img 
            src={gifUrl}
            alt={isUS ? 'Trump GIF - Animated image of Donald Trump' : 'Iran Supreme Leader GIF - Animated image of the Supreme Leader'}
            className="w-full h-full object-cover object-center"
            onLoad={() => setGifLoaded(true)}
            loading="lazy"
            decoding="async"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-4">
            <div className="flex items-end justify-between">
              <div className="min-w-0 flex-1">
                <h2 className={`font-heading font-bold text-[11px] sm:text-3xl ${isUS ? 'text-blue-400' : 'text-red-400'} tracking-wide drop-shadow-lg leading-tight truncate`}>
                  {isUS ? 'TRUMP' : 'IRAN'}
                </h2>
              </div>
              <span className="text-lg sm:text-4xl drop-shadow-lg shrink-0 ml-1">{isUS ? '🇺🇸' : '🇮🇷'}</span>
            </div>
          </div>
          
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3">
            <div className={`px-1 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-body font-medium ${isUS ? 'bg-blue-500/80' : 'bg-red-500/80'} text-white backdrop-blur-sm`}>
              GIF
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showQuote && isUS && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-2 left-2 right-12 sm:top-3 sm:left-3 sm:right-16 z-10"
            >
              <div className="speech-bubble bg-black/90 backdrop-blur-sm border-2 border-blue-500/50">
                <p className="font-body text-[10px] sm:text-sm text-white leading-relaxed">{currentQuote}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Grid - Always 2 cols, compact on mobile */}
      <div className="p-1 sm:p-3">
        <div className="grid grid-cols-2 gap-1 sm:gap-2">
          {isUS ? (
            <>
              <StatItem emoji="💰" label="Sanctions" shortLabel="Sanc." value={stats.sanctions || 'MAXED'} />
              <StatItem emoji="🌶️" label="Aggression" shortLabel="Aggro" value={stats.aggression || '87/100'} />
              <StatItem emoji="🤝" label="Allies" shortLabel="Allies" value={stats.allies || 'NATO'} />
              <StatItem emoji="📉" label="Iran's HP" shortLabel="vs HP" value={`${Math.round(opponentHp)}%`} />
            </>
          ) : (
            <>
              <StatItem emoji="☢️" label="Nuke Status" shortLabel="Nukes" value={stats.nukes || 'Soon™'} />
              <StatItem emoji="🕵️" label="Proxies" shortLabel="Proxy" value={stats.proxies || 'Active'} />
              <StatItem emoji="😤" label="Patience" shortLabel="Rage" value={stats.patience || 'Low'} />
              <StatItem emoji="🌍" label="World Sympathy" shortLabel="Symp." value={stats.sympathy || '34%'} />
            </>
          )}
        </div>
      </div>

      {/* HP Bar */}
      <div className="px-1.5 sm:px-3 pb-1.5 sm:pb-2">
        <div className="flex justify-between text-[8px] sm:text-[10px] text-gray-500 mb-0.5 sm:mb-1">
          <span className="font-body">{isUS ? 'US HP' : 'IRAN HP'}</span>
          <span className="font-mono font-medium">{Math.round(hp)}%</span>
        </div>
        <div className="health-bar-container h-1.5 sm:h-3">
          <motion.div 
            className={`health-bar-fill ${isUS ? 'bg-blue-500' : 'bg-red-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${(hp / maxHp) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Share Button - Icon only on mobile */}
      <div className="px-1.5 sm:px-3 pb-1.5 sm:pb-3">
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-1 sm:gap-2 py-1 sm:py-2 rounded-lg font-body text-xs sm:text-sm transition-all ${
            isUS 
              ? 'bg-black border border-blue-500/30 hover:bg-blue-500/10 text-white' 
              : 'bg-black border border-red-500/30 hover:bg-red-500/10 text-white'
          }`}
        >
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Share on X</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FighterCard;

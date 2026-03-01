import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';

// Hardcoded GIF URLs as requested by user
const TRUMP_GIF_URL = 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXJvdm5mMnZoNHVuYmt5ZDFyMDJzY3M4bjdtaXJqMDZrN3V5OXkzNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xTiTnHXbRoaZ1B1Mo8/giphy.gif';
const IRAN_GIF_URL = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3Q1eGJhODQyNzdqdGs3NDByb3FzNjNpOWt1cHdjYTg3NmtieGh0MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KdxduNi5eiR7f6DI68/giphy.gif';

// Website URL - change this to your actual domain when deployed
const SITE_URL = 'https://thestandoff.live';

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

  const StatItem = ({ label, value, emoji }) => (
    <div className={`flex items-center gap-2 ${bgClass} px-2 py-1.5 rounded border ${accentClass}`}>
      <span className="text-base">{emoji}</span>
      <div>
        <div className="text-[9px] text-gray-500 font-comic uppercase">{label}</div>
        <div className="font-impact text-white text-sm">{value}</div>
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
      {/* BIG GIF HEADER */}
      <div className="relative">
        <motion.div 
          className={`relative w-full h-48 sm:h-56 overflow-hidden border-b-2 ${isUS ? 'border-blue-500/50' : 'border-red-500/50'}`}
          animate={isAnimating ? { scale: [1, 1.02, 1] } : {}}
        >
          <img 
            src={gifUrl}
            alt={isUS ? 'Trump' : 'Supreme Leader'}
            className="w-full h-full object-cover object-center"
            onLoad={() => setGifLoaded(true)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className={`font-bangers text-3xl sm:text-4xl ${isUS ? 'text-blue-400' : 'text-red-400'} tracking-wider drop-shadow-lg`}>
                  {name}
                </h2>
                <div className={`inline-block text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border ${accentClass} mt-1`}>
                  {nickname}
                </div>
              </div>
              <span className="text-4xl sm:text-5xl drop-shadow-lg">{isUS ? '🇺🇸' : '🇮🇷'}</span>
            </div>
          </div>
          
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-[10px] font-comic font-bold ${isUS ? 'bg-blue-500/80' : 'bg-red-500/80'} text-white backdrop-blur-sm`}>
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
              className="absolute top-3 left-3 right-16 z-10"
            >
              <div className="speech-bubble bg-black/90 backdrop-blur-sm border-2 border-blue-500/50">
                <p className="font-comic text-sm text-white leading-relaxed">{currentQuote}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {isUS ? (
            <>
              <StatItem emoji="💰" label="Sanctions" value={stats.sanctions || 'MAXED OUT'} />
              <StatItem emoji="🌶️" label="Aggression" value={stats.aggression || '87/100'} />
              <StatItem emoji="🤝" label="Allies" value={stats.allies || 'NATO + 🤷'} />
              <StatItem emoji="📉" label="Iran's HP" value={`${Math.round(opponentHp)}%`} />
            </>
          ) : (
            <>
              <StatItem emoji="☢️" label="Nuke Status" value={stats.nukes || 'Almost™'} />
              <StatItem emoji="🕵️" label="Proxies" value={stats.proxies || 'Active 🔥'} />
              <StatItem emoji="😤" label="Patience" value={stats.patience || 'Running Out'} />
              <StatItem emoji="🌍" label="World Sympathy" value={stats.sympathy || '34%'} />
            </>
          )}
        </div>
      </div>

      {/* HP Bar */}
      <div className="px-3 pb-2">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
          <span className="font-comic">Health</span>
          <span className="font-impact">{Math.round(hp)}/{maxHp}</span>
        </div>
        <div className="health-bar-container h-3">
          <motion.div 
            className={`health-bar-fill ${isUS ? 'bg-blue-500' : 'bg-red-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${(hp / maxHp) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Share Button */}
      <div className="px-3 pb-3">
        <motion.button
          onClick={handleShare}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-comic text-sm transition-all ${
            isUS 
              ? 'bg-black border border-blue-500/30 hover:bg-blue-500/10 text-white' 
              : 'bg-black border border-red-500/30 hover:bg-red-500/10 text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Share on X</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FighterCard;

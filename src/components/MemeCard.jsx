import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Twitter, Link, Download, MessageCircle } from 'lucide-react';
// html2canvas is loaded dynamically only when needed for downloads
import { fetchMemes, getCachedData } from '../lib/api';

// Default news items for fallback
const DEFAULT_NEWS_ITEMS = [
  {
    id: '1',
    headline: "US-Iran tensions escalate over Strait of Hormuz",
    source: "BBC",
    pubDate: new Date().toISOString(),
    analysis: {
      side: "IRAN",
      badge: "OOF 💀",
      analysis: "Iranian forces escalate presence in Strait of Hormuz amid rising tensions"
    }
  },
  {
    id: '2',
    headline: "Trump announces new sanctions on Iranian oil exports",
    source: "Reuters",
    pubDate: new Date(Date.now() - 3600000).toISOString(),
    analysis: {
      side: "US",
      badge: "OOF 💀",
      analysis: "US sanctions target Iranian oil exports, significantly impacting economy"
    }
  },
  {
    id: '3',
    headline: "Israel warns of retaliation after Iranian proxy attacks",
    source: "Al Jazeera",
    pubDate: new Date(Date.now() - 7200000).toISOString(),
    analysis: {
      side: "NEUTRAL",
      badge: "YIKES 😬",
      analysis: "Regional tensions increase as proxy conflicts expand across Middle East"
    }
  },
  {
    id: '4',
    headline: "Nuclear talks stall as Iran enriches more uranium",
    source: "The Guardian",
    pubDate: new Date(Date.now() - 10800000).toISOString(),
    analysis: {
      side: "IRAN",
      badge: "SUS 👀",
      analysis: "Iran's uranium enrichment program advances beyond previous limits"
    }
  }
];

const ShareButtons = ({ meme, cardRef, isWW3 = false, ww3Data = null }) => {
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const getShareText = () => {
    if (meme?.analysis?.analysis) {
      return `${meme.analysis.badge}: ${meme.analysis.analysis}\n\nLive US-Iran conflict updates | ww3tracker.live`;
    }
    return `☢️ WW3: ${ww3Data?.probability || 50}% likely right now ww3tracker.live #WW3 #TheStandoff`;
  };

  const shareToX = () => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(getShareText()), '_blank');
  };

  const shareToReddit = () => {
    const title = meme?.analysis?.analysis 
      ? `${meme.analysis.analysis} | ww3tracker.live`
      : `WW3 Probability: ${ww3Data?.probability || 50}% - Live Tracker`;
    window.open(`https://reddit.com/submit?url=${encodeURIComponent('https://ww3tracker.live')}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ww3tracker.live');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    try {
      // Dynamically import html2canvas only when needed
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });

      // Add watermark
      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText('ww3tracker.live', canvas.width - 10, canvas.height - 10);

      // For WW3 counter, add dramatic overlay
      if (isWW3 && ww3Data) {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`☢️ WW3: ${ww3Data.probability || 50}% likely`, canvas.width / 2, canvas.height / 2);
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText('right now', canvas.width / 2, canvas.height / 2 + 30);
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText('ww3tracker.live', canvas.width / 2, canvas.height / 2 + 55);
      }

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `standoff-${date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const buttons = [
    { id: 'x', icon: Twitter, action: shareToX, color: 'hover:text-blue-400', label: 'Share on X' },
    { id: 'reddit', icon: MessageCircle, action: shareToReddit, color: 'hover:text-orange-400', label: 'Share on Reddit' },
    { id: 'copy', icon: Link, action: copyLink, color: 'hover:text-green-400', label: 'Copy link' },
    { id: 'download', icon: Download, action: downloadCard, color: 'hover:text-purple-400', label: 'Download card' },
  ];

  return (
    <div className="flex items-center gap-1">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={btn.action}
          onMouseEnter={() => setTooltip(btn.id)}
          onMouseLeave={() => setTooltip(null)}
          className={`p-1.5 rounded transition-all duration-200 ${btn.color}`}
        >
          <btn.icon className="w-3.5 h-3.5 text-gray-400" />
          {tooltip === btn.id && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-gray-800 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-20">
              {btn.label}
            </span>
          )}
          {btn.id === 'copy' && copied && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded whitespace-nowrap z-20">
              Copied! ✅
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Skeleton loader for meme cards
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="comic-panel rounded-lg p-2.5 sm:p-3 relative animate-pulse"
  >
    {/* Header skeleton */}
    <div className="flex justify-between items-start mb-1.5 sm:mb-2">
      <div className="h-3 sm:h-4 w-14 sm:w-16 bg-white/10 rounded"></div>
      <div className="w-2 h-2 rounded-full bg-white/10"></div>
    </div>

    {/* Headline skeleton */}
    <div className="h-2.5 sm:h-3 bg-white/10 rounded mb-1.5 sm:mb-2 w-full"></div>
    <div className="h-2.5 sm:h-3 bg-white/10 rounded mb-1.5 sm:mb-2 w-3/4"></div>

    {/* Caption skeleton */}
    <div className="h-2 bg-white/10 rounded mb-1.5 sm:mb-2 w-full"></div>

    {/* Source skeleton */}
    <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/5">
      <div className="h-2 w-10 sm:w-12 bg-white/10 rounded"></div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-white/10"></div>
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-white/10"></div>
        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-white/10"></div>
      </div>
    </div>
  </motion.div>
);

const Card = ({ meme, index }) => {
  const cardRef = useRef(null);
  const badgeColors = {
    'BREAKING': 'bg-red-500/20 text-red-400 border-red-500/30',
    'ESCALATION': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'INTELLIGENCE': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'CASUALTIES': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'CONFIRMED': 'bg-green-500/20 text-green-400 border-green-500/30',
    'DISPUTED': 'bg-red-700/20 text-red-500 border-red-700/30',
  };

  const badge = meme.analysis?.badge || 'INTELLIGENCE';
  const side = meme.analysis?.side || 'NEUTRAL';
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="comic-panel rounded-lg p-2.5 sm:p-3 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
        <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded border ${badgeColors[badge] || badgeColors['SUS 👀']}`}>
          {badge}
        </span>
        <span className={`w-2 h-2 rounded-full ${
          side === 'US' ? 'bg-blue-400' : side === 'IRAN' ? 'bg-red-400' : 'bg-gray-400'
        }`} />
      </div>

      {/* Headline */}
      <p className="text-[11px] sm:text-xs text-gray-300 font-body mb-1.5 sm:mb-2 line-clamp-2 leading-relaxed">
        {meme.headline}
      </p>

      {/* Caption */}
      <p className="text-[10px] text-gray-400 font-body mb-1.5 sm:mb-2 italic leading-relaxed">
        {meme.analysis?.analysis}
      </p>

      {/* Source & Share Buttons */}
      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/5">
        <span className="text-[8px] sm:text-[9px] text-gray-500">via {meme.source}</span>
        <ShareButtons meme={meme} cardRef={cardRef} />
      </div>
    </motion.div>
  );
};

const MemeFeed = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemes = async () => {
      try {
        setLoading(true);
        
        // First, try to get cached data for instant display
        const cached = getCachedData('memes');
        if (cached?.items) {
          setMemes(cached.items);
          setLoading(false); // Show cached data immediately
        }
        
        // Then fetch fresh data
        const data = await fetchMemes(4);
        if (data?.items) {
          setMemes(data.items);
        }
      } catch (error) {
        console.error('Failed to load memes:', error);
        // If we don't have any memes yet (no cache), use defaults
        if (memes.length === 0) {
          setMemes(DEFAULT_NEWS_ITEMS);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMemes();
    
    // Refresh every 2 minutes
    const interval = setInterval(loadMemes, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header">
        <div className="section-icon text-purple-400 w-8 h-8 sm:w-9 sm:h-9">
          <span className="text-base sm:text-lg">🎭</span>
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">BREAKING FEED</h2>
          <p className="text-gray-500 text-[10px] sm:text-xs font-body">Live updates as they happen</p>
        </div>
      </div>

      {/* 4 Cards Grid - show skeletons when loading, cards when ready */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {loading && memes.length === 0 ? (
          // Show skeleton loaders when loading and no cached data
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} index={index} />
          ))
        ) : (
          // Show actual memes (from cache or API)
          memes.map((meme, index) => (
            <Card key={meme.id || index} meme={meme} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default MemeFeed;
export { ShareButtons };

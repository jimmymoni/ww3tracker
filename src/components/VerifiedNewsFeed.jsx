import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Twitter, Link, Download, MessageCircle } from 'lucide-react';
import { fetchMemes, getCachedData } from '../lib/api';

// No fake news - we show real data or empty state
const DEFAULT_NEWS_ITEMS = [];

const ShareButtons = ({ news, cardRef, isWW3 = false, ww3Data = null }) => {
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  const getShareText = () => {
    if (news?.analysis?.analysis) {
      return `${news.analysis.badge}: ${news.analysis.analysis}\n\nLive US-Iran conflict updates | ww3tracker.live`;
    }
    return `WW3 Risk Assessment: ${ww3Data?.probability || 50}% - Live Tracker ww3tracker.live`;
  };

  const shareToX = () => {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(getShareText()), '_blank');
  };

  const shareToReddit = () => {
    const title = news?.analysis?.analysis 
      ? `${news.analysis.analysis} | ww3tracker.live`
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
      const { default: html2canvas } = await import('html2canvas');
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        logging: false
      });

      const ctx = canvas.getContext('2d');
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'right';
      ctx.fillText('ww3tracker.live', canvas.width - 10, canvas.height - 10);

      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `news-${date}.png`;
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
              Copied!
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Skeleton loader for news cards
const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-[#14141c] border border-white/10 rounded-lg p-2.5 sm:p-3 relative animate-pulse"
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

const Card = ({ news, index }) => {
  const cardRef = useRef(null);
  const badgeColors = {
    'BREAKING': 'bg-red-500/20 text-red-400 border-red-500/30',
    'ESCALATION': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'INTELLIGENCE': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'CASUALTIES': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    'CONFIRMED': 'bg-green-500/20 text-green-400 border-green-500/30',
    'DISPUTED': 'bg-red-700/20 text-red-500 border-red-700/30',
    'ATTACK': 'bg-red-600/20 text-red-500 border-red-600/30',
    'DIPLOMACY': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'MILITARY': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'UPDATE': 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  };

  const badge = news.analysis?.badge || 'UPDATE';
  const side = news.analysis?.side || 'NEUTRAL';
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#14141c] border border-white/10 rounded-lg p-2.5 sm:p-3 relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-1.5 sm:mb-2">
        <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded border ${badgeColors[badge] || badgeColors['UPDATE']}`}>
          {badge}
        </span>
        <span className={`w-2 h-2 rounded-full ${
          side === 'US' ? 'bg-blue-400' : side === 'IRAN' ? 'bg-red-400' : 'bg-gray-400'
        }`} />
      </div>

      {/* Headline */}
      <p className="text-[11px] sm:text-xs text-gray-300 font-body mb-1.5 sm:mb-2 line-clamp-2 leading-relaxed">
        {news.headline}
      </p>

      {/* Analysis */}
      <p className="text-[10px] text-gray-400 font-body mb-1.5 sm:mb-2 italic leading-relaxed">
        {news.analysis?.analysis}
      </p>

      {/* Source & Share Buttons */}
      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-white/5">
        <span className="text-[8px] sm:text-[9px] text-gray-500">via {news.source}</span>
        <ShareButtons news={news} cardRef={cardRef} />
      </div>
    </motion.div>
  );
};

const VerifiedNewsFeed = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        
        // First, try to get cached data for instant display
        const cached = getCachedData('memes');
        if (cached?.items) {
          setNewsItems(cached.items);
          setLoading(false);
        }
        
        // Then fetch fresh data
        const data = await fetchMemes(4);
        if (data?.items) {
          setNewsItems(data.items);
        }
      } catch (error) {
        console.error('Failed to load news:', error);
        if (newsItems.length === 0) {
          setNewsItems(DEFAULT_NEWS_ITEMS);
        }
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    
    // Refresh every 2 minutes
    const interval = setInterval(loadNews, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <ExternalLink className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">VERIFIED NEWS</h2>
          <p className="text-gray-500 text-[10px] sm:text-xs font-body">Confirmed updates from verified sources</p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        {loading && newsItems.length === 0 ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} index={index} />
          ))
        ) : newsItems.length === 0 ? (
          <div className="col-span-2 md:col-span-4 p-8 text-center border border-white/10 rounded-lg bg-white/5">
            <p className="text-gray-500 text-sm">No verified news at this moment</p>
            <p className="text-gray-600 text-xs mt-1">Feed updates every 2 minutes</p>
          </div>
        ) : (
          newsItems.map((news, index) => (
            <Card key={news.id || index} news={news} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default VerifiedNewsFeed;
export { ShareButtons };

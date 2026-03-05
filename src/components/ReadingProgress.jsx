import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Link2, Check } from 'lucide-react';

const ReadingProgress = ({ post, readingTime }) => {
  const [progress, setProgress] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    const shareUrl = `https://ww3tracker.live/blog/${post.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-red-600 to-orange-500"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Floating Share Buttons (Desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-2 z-40"
      >
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl">
          <div className="flex flex-col gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all relative"
            >
              {showShareTooltip ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
              {showShareTooltip && (
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{readingTime}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="relative w-10 h-10 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray={`${progress}, 100`}
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-4 py-3 z-40"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Reading</p>
              <p className="text-sm font-medium text-white">{Math.round(progress)}% complete</p>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-colors"
          >
            {showShareTooltip ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default ReadingProgress;

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, TrendingUp, AlertCircle } from 'lucide-react';

const DisqusComments = () => {
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadDisqus = () => {
      if (window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.identifier = 'ww3tracker-home';
            this.page.url = 'https://ww3tracker.live/';
            this.page.title = 'WW3 Tracker - Live Conflict Monitor';
          }
        });
        setIsLoading(false);
        return;
      }

      window.disqus_config = function () {
        this.page.identifier = 'ww3tracker-home';
        this.page.url = 'https://ww3tracker.live/';
        this.page.title = 'WW3 Tracker - Live Conflict Monitor';
      };

      const script = document.createElement('script');
      script.src = 'https://ww3tracker.disqus.com/embed.js';
      script.setAttribute('data-timestamp', Date.now().toString());
      script.async = true;
      
      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = () => {
        console.error('Failed to load Disqus');
        setLoadError(true);
        setIsLoading(false);
      };

      // Timeout fallback
      setTimeout(() => {
        if (isLoading) {
          setLoadError(true);
          setIsLoading(false);
        }
      }, 5000);

      document.body.appendChild(script);
    };

    const timeout = setTimeout(loadDisqus, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
      {/* Header - Theme Matched */}
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
          <p className="text-gray-500 text-[10px] sm:text-xs">Join the chaos. No account needed.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs">
          <Users className="w-3.5 h-3.5" />
          <span className="font-mono">{commentCount > 0 ? commentCount : '2.4k'} debating</span>
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

      {/* Disqus Embed Container - Dark Theme Styled */}
      <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-gray-700 border-t-yellow-500 rounded-full"
            />
            <span className="font-comic text-sm">Loading debates...</span>
          </div>
        )}

        {/* Error State */}
        {loadError && (
          <div className="text-center py-12 px-4">
            <AlertCircle className="w-8 h-8 text-yellow-500/50 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-comic mb-2">
              Comments coming soon
            </p>
            <p className="text-gray-600 text-xs max-w-sm mx-auto">
              We&apos;re setting up the War Room discussion board. Check back later to drop your hot takes!
            </p>
          </div>
        )}

        {/* Disqus Thread */}
        <div id="disqus_thread" className={`min-h-[400px] ${loadError ? 'hidden' : ''}`} />
      </div>

      {/* Mobile Comment Count */}
      <div className="sm:hidden flex items-center justify-center gap-2 mt-3 text-gray-400 text-xs">
        <Users className="w-3.5 h-3.5" />
        <span className="font-mono">{commentCount > 0 ? commentCount : '2.4k'} debating</span>
      </div>

      {/* Engagement Prompt - Theme Matched */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-gradient-to-r from-red-500/10 via-transparent to-yellow-500/10 rounded-lg border border-white/10"
      >
        <p className="text-xs text-gray-400 text-center font-comic">
          💬 <span className="text-yellow-400">Hot take?</span> Drop it below. Best comments get featured.
        </p>
      </motion.div>
    </motion.section>
  );
};

export default DisqusComments;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Clock, Users, Trophy, TrendingUp, Share2, Twitter, Check } from 'lucide-react';

const DailyPoll = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [totalVotes, setTotalVotes] = useState(2847);
  const [copied, setCopied] = useState(false);

  const poll = {
    question: "Who drops first in Round 1? 🥊",
    options: [
      { id: 'us', label: '🇺🇸 US Sanctions Break Iran', votes: 1245, color: 'bg-blue-500', emoji: '💰' },
      { id: 'iran', label: '🇮🇷 Iran Escalates via Proxies', votes: 892, color: 'bg-red-500', emoji: '🔥' },
      { id: 'neither', label: '🤝 Neither - They Negotiate', votes: 456, color: 'bg-green-500', emoji: '🕊️' },
      { id: 'both', label: '☢️ Both - WW3 Incoming', votes: 254, color: 'bg-yellow-500', emoji: '💀' },
    ]
  };

  useEffect(() => {
    const lastVote = localStorage.getItem('ww3_poll_vote');
    const lastVoteDate = localStorage.getItem('ww3_poll_date');
    const today = new Date().toDateString();

    if (lastVote && lastVoteDate === today) {
      setHasVoted(true);
      setSelectedOption(lastVote);
      setShowResults(true);
    }

    const updateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleVote = (optionId) => {
    if (hasVoted) return;

    setSelectedOption(optionId);
    setTotalVotes(prev => prev + 1);
    
    poll.options.find(o => o.id === optionId).votes += 1;
    
    localStorage.setItem('ww3_poll_vote', optionId);
    localStorage.setItem('ww3_poll_date', new Date().toDateString());
    
    setTimeout(() => {
      setHasVoted(true);
      setShowResults(true);
    }, 400);
  };

  const sharePoll = () => {
    const text = `I voted "${poll.options.find(o => o.id === selectedOption)?.label}" on the WW3 Daily Poll ☢️\n\n${totalVotes.toLocaleString()} people are voting. Cast yours 👇\n\nww3tracker.live #WW3 #DailyPoll`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank');
  };

  const copyPollLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ww3tracker.live — Daily Poll: ' + poll.question);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getPercentage = (votes) => {
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full bg-[#0a0a0a] rounded-xl p-4 sm:p-5 mb-4 border border-white/10"
    >
      {/* Header - Theme Matched */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
            <BarChart3 className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">DAILY POLL</h3>
            <p className="text-[10px] text-gray-500">New question every day</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-mono">{timeLeft}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded border border-white/10">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-mono">{totalVotes.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <h4 className="font-heading text-sm sm:text-base text-white text-center">
          {poll.question}
        </h4>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes);
          const isSelected = selectedOption === option.id;
          
          return (
            <motion.button
              key={option.id}
              onClick={() => !hasVoted && handleVote(option.id)}
              disabled={hasVoted}
              whileHover={!hasVoted ? { scale: 1.01 } : {}}
              whileTap={!hasVoted ? { scale: 0.99 } : {}}
              className={`w-full relative overflow-hidden rounded-lg transition-all ${
                hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-white/5'
              } ${isSelected ? 'ring-1 ring-yellow-500/50' : ''}`}
            >
              {/* Background Progress Bar */}
              {showResults && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`absolute inset-y-0 left-0 ${option.color} opacity-20`}
                />
              )}

              {/* Content */}
              <div className="relative flex items-center justify-between p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-base">{option.emoji}</span>
                  <span className={`text-xs sm:text-sm font-comic ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {option.label}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-yellow-400" />}
                </div>
                
                {showResults && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-impact text-gray-300">{percentage}%</span>
                    <span className="text-[10px] text-gray-600 font-mono hidden sm:inline">({option.votes.toLocaleString()})</span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Results Summary */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            {/* Winner Badge */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">
                Leading: <span className="text-yellow-400 font-bold">
                  {poll.options.reduce((a, b) => a.votes > b.votes ? a : b).label}
                </span>
              </span>
            </div>

            {/* Share Results */}
            <div className="flex items-center justify-center gap-2">
              <motion.button
                onClick={sharePoll}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded text-yellow-400 text-xs transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Share My Vote</span>
              </motion.button>

              <motion.button
                onClick={copyPollLink}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-400 hover:text-white text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
            </div>

            <p className="text-[10px] text-gray-600 text-center mt-3">
              Come back tomorrow • Results reset at midnight
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Not Voted Yet Prompt */}
      {!hasVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 p-2 bg-yellow-500/10 rounded border border-yellow-500/20"
        >
          <p className="text-[10px] text-yellow-400/80 text-center font-comic">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {totalVotes.toLocaleString()} people voted today • Vote to see results
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyPoll;

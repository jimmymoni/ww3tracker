import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users } from 'lucide-react';

const PollWidget = ({ question, options }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [votes, setVotes] = useState(options);

  const handleVote = (index) => {
    if (hasVoted) return;
    setSelectedOption(index);
    setVotes(prev => prev.map((opt, i) => 
      i === index ? { ...opt, votes: opt.votes + 1 } : opt
    ));
    setHasVoted(true);
  };

  const totalVotes = votes.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden"
    >
      <div className="p-5 border-b border-zinc-800">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-zinc-400" />
          Live Poll
        </h3>
      </div>

      <div className="p-5">
        <p className="text-white font-medium mb-4 text-sm">{question}</p>

        <div className="space-y-2">
          {votes.map((option, index) => {
            const percentage = Math.round((option.votes / totalVotes) * 100);
            const isSelected = selectedOption === index;

            return (
              <button
                key={index}
                onClick={() => handleVote(index)}
                disabled={hasVoted}
                className={`w-full relative overflow-hidden rounded-lg transition-all ${
                  hasVoted ? 'cursor-default' : 'cursor-pointer hover:bg-zinc-800'
                }`}
              >
                {hasVoted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`absolute inset-0 ${
                      isSelected ? 'bg-red-500/20' : 'bg-zinc-800/50'
                    }`}
                  />
                )}

                <div className={`relative p-3 flex items-center justify-between border ${
                  hasVoted ? 'border-transparent' : 'border-zinc-800'
                } rounded-lg`}>
                  <span className={`text-sm ${
                    hasVoted && isSelected ? 'text-red-400' : 'text-zinc-300'
                  }`}>
                    {option.label}
                  </span>

                  {hasVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm">{percentage}%</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {totalVotes.toLocaleString()} votes
          </span>
          <span>Live</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PollWidget;

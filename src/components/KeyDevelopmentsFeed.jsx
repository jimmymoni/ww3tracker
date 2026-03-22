import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ChevronDown, Clock, MapPin, Radio, Info } from 'lucide-react';

// Sample data - compact version showing only top developments
const SAMPLE_DEVELOPMENTS = [
  {
    id: 'dev-001',
    significance: 'critical',
    timestamp: '2026-03-18T02:00:00Z',
    headline: 'Iran Launches Ballistic Missile Strike on Central Israel',
    summary: 'Iranian missiles targeted Tel Aviv area. First direct strike on population center.',
    whyItMatters: 'Major escalation — first direct missile strike on Israel\'s population center.',
    category: 'military',
    location: 'Tel Aviv, Israel',
    sources: ['Reuters', 'IDF']
  },
  {
    id: 'dev-002',
    significance: 'significant',
    timestamp: '2026-03-17T22:30:00Z',
    headline: 'US Deploys Additional THAAD Battery to Saudi Arabia',
    summary: 'Pentagon deploys missile defense to protect oil infrastructure.',
    whyItMatters: 'Signals US commitment to regional defense.',
    category: 'military',
    location: 'Saudi Arabia',
    sources: ['Reuters']
  },
  {
    id: 'dev-003',
    significance: 'development',
    timestamp: '2026-03-17T18:15:00Z',
    headline: 'Oman Hosts Back-Channel Diplomatic Talks',
    summary: 'US, Iran, and European diplomats met in Muscat for de-escalation discussions.',
    whyItMatters: 'Both sides seeking off-ramps despite public rhetoric.',
    category: 'diplomatic',
    location: 'Muscat, Oman',
    sources: ['FT', 'AP']
  }
];

// Icon mapping - use functions to avoid TDZ issues with lazy loading
const getIconComponent = (significance) => {
  switch (significance) {
    case 'critical':
    case 'significant':
      return AlertTriangle;
    case 'development':
    default:
      return Info;
  }
};

const SIGNIFICANCE_CONFIG = {
  critical: { 
    label: 'CRITICAL', 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  significant: { 
    label: 'SIGNIFICANT', 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  development: { 
    label: 'DEVELOPMENT', 
    color: 'text-gray-400', 
    bg: 'bg-white/5',
    border: 'border-white/10'
  }
};

const CATEGORY_CONFIG = {
  military: { label: 'MILITARY', color: 'text-red-400', bg: 'bg-red-500/10' },
  diplomatic: { label: 'DIPLOMATIC', color: 'text-gray-400', bg: 'bg-white/5' }
};

// Format relative time
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const hours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const DevelopmentCard = ({ development, isExpanded, onToggle }) => {
  const sigConfig = SIGNIFICANCE_CONFIG[development.significance];
  const catConfig = CATEGORY_CONFIG[development.category];
  const SigIcon = getIconComponent(development.significance);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden hover:border-[#3a3a3a] transition-colors"
    >
      <div className="p-3">
        {/* Compact Header Row */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${sigConfig.bg} ${sigConfig.border} ${sigConfig.color}`}>
            <SigIcon className="w-3 h-3" />
            {sigConfig.label}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${catConfig.bg} ${catConfig.color}`}>
            {catConfig.label}
          </span>
          <span className="ml-auto text-[10px] text-gray-500 font-mono">
            {formatTime(development.timestamp)}
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-sm font-heading font-bold text-white mb-1 leading-snug">
          {development.headline}
        </h3>

        {/* Summary - single line */}
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
          {development.summary}
        </p>

        {/* Location & Sources - inline */}
        <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {development.location}
          </span>
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3" />
            {development.sources.join(', ')}
          </span>
        </div>

        {/* Expand Button */}
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-1 py-1.5 text-[11px] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
        >
          <span>Why This Matters</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-3 h-3" />
          </motion.span>
        </button>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10"
          >
            <div className="p-3 bg-white/5">
              <p className="text-xs text-gray-300 leading-relaxed">
                {development.whyItMatters}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const KeyDevelopmentsFeed = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filteredDevelopments = SAMPLE_DEVELOPMENTS.filter(dev => 
    filter === 'all' || dev.category === filter
  );

  return (
    <section className="w-full">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-400" />
              Key Developments
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Significant events shaping the conflict
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'military', label: 'Military' },
              { key: 'diplomatic', label: 'Diplomatic' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                  filter === tab.key 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Developments List - Compact */}
        <div className="space-y-2">
          {filteredDevelopments.map((development, index) => (
            <DevelopmentCard
              key={development.id}
              development={development}
              isExpanded={expandedId === development.id}
              onToggle={() => setExpandedId(
                expandedId === development.id ? null : development.id
              )}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Verified events from Mar 17–18, 2026
          </p>
        </div>
      </div>
    </section>
  );
};

export default KeyDevelopmentsFeed;

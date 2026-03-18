import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Clock, Activity, ChevronRight } from 'lucide-react';

const TABS = [
  { id: 'why', label: 'Why Here?', icon: MapPin },
  { id: 'players', label: 'Key Players', icon: Users },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'status', label: 'Status', icon: Activity },
];

const ConflictContextPanel = ({ isOpen, onClose, zone }) => {
  const [activeTab, setActiveTab] = useState('why');

  if (!zone) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'why':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-red-400">⚠️</span> Root Cause
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {zone.rootCause || 'Strategic location with high-value targets including infrastructure and military installations.'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-heading font-bold text-white mb-2 flex items-center gap-2">
                <span className="text-blue-400">🎯</span> Strategic Value
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                {zone.strategicValue?.map((value, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    {value}
                  </li>
                )) || (
                  <>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      Critical supply route and logistics hub
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                      Proximity to border regions
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        );
      case 'players':
        return (
          <div className="space-y-3">
            {zone.keyPlayers?.map((player, index) => (
              <motion.div
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center gap-3"
              >
                <span className="text-2xl">{player.flag}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-bold text-white text-sm truncate">{player.name}</h4>
                  <p className="text-xs text-gray-400">{player.role}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  player.side === 'aggressor' ? 'bg-red-500/20 text-red-400' :
                  player.side === 'defender' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {player.side === 'aggressor' ? 'Aggressor' : player.side === 'defender' ? 'Defender' : 'Neutral'}
                </span>
              </motion.div>
            )) || (
              <div className="p-4 text-center text-gray-500">
                No key players data available for this zone.
              </div>
            )}
          </div>
        );
      case 'timeline':
        return (
          <div className="space-y-0">
            {zone.timeline?.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-6 pb-4 border-l border-white/10 last:border-0"
              >
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-red-500 -translate-x-[5px]" />
                <span className="text-xs text-gray-500 font-mono">{event.date}</span>
                <p className="text-sm text-gray-300 mt-1">{event.event}</p>
              </motion.div>
            )) || (
              <div className="p-4 text-center text-gray-500">
                No timeline events recorded for this zone.
              </div>
            )}
          </div>
        );
      case 'status':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-red-400">{zone.attackCount || 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Attacks</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                <div className="text-2xl font-bold text-orange-400">{zone.casualties || 'N/A'}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Casualties</div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="font-heading font-bold text-white mb-3">Current Threat Level</h4>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  zone.threatLevel === 'critical' ? 'bg-red-500' :
                  zone.threatLevel === 'high' ? 'bg-orange-500' :
                  zone.threatLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`} />
                <span className="text-sm font-medium text-white capitalize">{zone.threatLevel || 'Unknown'}</span>
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.threatPercent || 50}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    zone.threatLevel === 'critical' ? 'bg-red-500' :
                    zone.threatLevel === 'high' ? 'bg-orange-500' :
                    zone.threatLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          />
          
          {/* Panel - Bottom sheet on mobile, right panel on desktop */}
          <motion.div
            initial={{ x: '100%', y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: '100%', y: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed z-[100] bg-[#0d0d12] border-l border-white/10
              inset-x-0 bottom-0 h-[70vh] rounded-t-2xl
              lg:inset-y-0 lg:right-0 lg:left-auto lg:w-[400px] lg:h-auto lg:rounded-none"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10 p-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{zone.flag || '🌍'}</span>
                  <div>
                    <h2 className="font-heading font-bold text-lg text-white">{zone.name}</h2>
                    <p className="text-xs text-gray-500">{zone.country || 'Conflict Zone'}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto h-[calc(100%-140px)] lg:h-[calc(100%-120px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConflictContextPanel;

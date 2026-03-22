import { motion } from 'framer-motion';
import { ArrowRight, Crosshair, AlertTriangle } from 'lucide-react';

const CONFLICT_TYPES = {
  active: {
    border: 'border-red-500/50',
    glow: 'shadow-red-500/20',
    badge: 'bg-red-500/20 text-red-400',
    indicator: 'bg-red-500 animate-pulse-red',
  },
  proxy: {
    border: 'border-orange-500/50',
    glow: 'shadow-orange-500/20',
    badge: 'bg-orange-500/20 text-orange-400',
    indicator: 'bg-orange-500 animate-pulse-orange',
  },
  diplomatic: {
    border: 'border-red-700/50',
    glow: 'shadow-red-500/20',
    badge: 'bg-red-700/20 text-red-400',
    indicator: 'bg-red-500 animate-pulse-blue',
  },
  frozen: {
    border: 'border-gray-500/50',
    glow: 'shadow-gray-500/20',
    badge: 'bg-gray-500/20 text-gray-400',
    indicator: 'bg-gray-500',
  },
  emerging: {
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/20',
    badge: 'bg-purple-500/20 text-purple-400',
    indicator: 'bg-purple-500 animate-pulse-purple',
  },
};

const ConflictZoneCard = ({ zone, onExplore, index = 0 }) => {
  const styles = CONFLICT_TYPES[zone.type] || CONFLICT_TYPES.active;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`comic-panel rounded-xl p-4 relative overflow-hidden group cursor-pointer
        border-2 ${styles.border} ${styles.glow} hover:shadow-xl transition-all duration-300`}
      onClick={() => onExplore?.(zone)}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${styles.glow}`} 
        style={{ boxShadow: 'inset 0 0 60px rgba(239, 68, 68, 0.1)' }} 
      />

      {/* Status indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${styles.indicator}`} />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{zone.flag || '🌍'}</span>
          <div>
            <h3 className="font-heading font-bold text-white text-sm sm:text-base tracking-wide">
              {zone.name}
            </h3>
            <p className="text-xs text-gray-500">{zone.country}</p>
          </div>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded font-medium uppercase tracking-wider ${styles.badge}`}>
          {zone.type || 'Active'}
        </span>
      </div>

      {/* Attack Count Badge */}
      <div className="relative flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-red-400" />
          <span className="text-sm font-mono font-bold text-white">{zone.attackCount || 0}</span>
          <span className="text-xs text-gray-500">attacks</span>
        </div>
        {zone.casualties && (
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-gray-400">{zone.casualties} casualties</span>
          </div>
        )}
      </div>

      {/* Root Cause Summary */}
      <div className="relative mb-4">
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {zone.summary || zone.rootCause || 'Strategic conflict zone with ongoing military operations and geopolitical tensions.'}
        </p>
      </div>

      {/* Key Players Preview */}
      {zone.keyPlayers && zone.keyPlayers.length > 0 && (
        <div className="relative flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Key actors:</span>
          <div className="flex -space-x-2">
            {zone.keyPlayers.slice(0, 3).map((player, i) => (
              <span 
                key={i} 
                className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs"
                title={player.name}
              >
                {player.flag}
              </span>
            ))}
            {zone.keyPlayers.length > 3 && (
              <span className="w-6 h-6 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-[10px] text-gray-500">
                +{zone.keyPlayers.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Explore Button */}
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full flex items-center justify-center gap-2 py-2.5 rounded-lg 
          bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 
          transition-all duration-200 group/btn"
      >
        <span className="text-xs font-medium text-gray-300 group-hover/btn:text-white">
          Explore Conflict
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-white transition-colors" />
      </motion.button>
    </motion.div>
  );
};

export default ConflictZoneCard;

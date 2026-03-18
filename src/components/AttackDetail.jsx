import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Crosshair, AlertTriangle, ExternalLink, Info } from 'lucide-react';

const ATTACK_TYPE_BADGES = {
  airstrike: { label: 'AIRSTRIKE', bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-600/30', icon: '✈️' },
  missile: { label: 'MISSILE', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: '🚀' },
  drone: { label: 'DRONE', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: '🛸' },
  bombing: { label: 'BOMBING', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '💥' },
  naval: { label: 'NAVAL', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: '⚓' },
  cyber: { label: 'CYBER', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: '💻' },
  ground: { label: 'GROUND', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '🪖' },
};

const SEVERITY_BADGES = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', indicator: 'bg-red-500' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', indicator: 'bg-orange-500' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', indicator: 'bg-yellow-500' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10', indicator: 'bg-blue-500' },
};

const AttackDetail = ({ isOpen, onClose, attack, onOpenContext }) => {
  if (!attack) return null;

  const typeBadge = ATTACK_TYPE_BADGES[attack.type] || ATTACK_TYPE_BADGES.bombing;
  const severityBadge = SEVERITY_BADGES[attack.severity] || SEVERITY_BADGES.medium;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now - date) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 
              sm:w-full sm:max-w-lg max-h-[90vh] overflow-hidden z-[120]
              bg-[#0d0d12] border border-white/10 rounded-2xl shadow-2xl"
          >
            {/* Header with severity indicator */}
            <div className="relative">
              <div className={`h-1 w-full ${severityBadge.indicator}`} />
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
                        <span>{typeBadge.icon}</span>
                        {typeBadge.label}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium ${severityBadge.bg} ${severityBadge.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${severityBadge.indicator} ${attack.severity === 'critical' || attack.severity === 'high' ? 'animate-pulse' : ''}`} />
                        {attack.severity?.toUpperCase() || 'MEDIUM'} SEVERITY
                      </span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-heading font-bold text-lg sm:text-xl text-white leading-tight">
                      {attack.headline}
                    </h2>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-5">
              {/* Location and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Location
                  </div>
                  <div className="font-medium text-white text-sm">
                    {attack.location || 'Unknown'}
                  </div>
                  {attack.country && (
                    <div className="text-xs text-gray-500 mt-0.5">{attack.country}</div>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Time
                  </div>
                  <div className="font-medium text-white text-sm">
                    {formatDate(attack.date)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{timeAgo(attack.date)}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {attack.description || 'No detailed description available for this attack.'}
                </p>
              </div>

              {/* Attack Details Grid */}
              {(attack.casualties || attack.damage || attack.perpetrator) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {attack.casualties && (
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                      <div className="flex items-center gap-1.5 text-red-400 text-xs mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Casualties
                      </div>
                      <div className="font-bold text-white">{attack.casualties}</div>
                    </div>
                  )}
                  {attack.damage && (
                    <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                      <div className="flex items-center gap-1.5 text-orange-400 text-xs mb-1">
                        <Crosshair className="w-3.5 h-3.5" />
                        Damage
                      </div>
                      <div className="font-bold text-white">{attack.damage}</div>
                    </div>
                  )}
                  {attack.perpetrator && (
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                      <div className="flex items-center gap-1.5 text-purple-400 text-xs mb-1">
                        <span className="text-sm">⚔️</span>
                        Attacker
                      </div>
                      <div className="font-bold text-white">{attack.perpetrator}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Source */}
              {attack.source && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-xs text-gray-500">Source: {attack.source}</span>
                  {attack.sourceUrl && (
                    <a
                      href={attack.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Verify <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Context Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  onClose();
                  onOpenContext?.(attack);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl 
                  bg-gradient-to-r from-red-600/20 to-orange-600/20 
                  border border-red-500/30 hover:border-red-500/50
                  transition-all duration-200 group"
              >
                <Info className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                <span className="font-medium text-white">Why is this happening?</span>
                <span className="text-gray-400">→</span>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AttackDetail;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Target, Shield, Zap, Skull, TrendingUp, Users } from 'lucide-react';

const ROLE_BADGES = {
  'Primary Aggressor': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: Target },
  'Defender': { bg: 'bg-red-700/20', text: 'text-red-400', border: 'border-red-700/30', icon: Shield },
  'Proxy Force': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: Zap },
  'Regional Power': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: TrendingUp },
  'Superpower': { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: TrendingUp },
  'Non-State Actor': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: Users },
  'Mediator': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: Users },
};

const CAPABILITY_ICONS = {
  'Military': Target,
  'Economic': TrendingUp,
  'Diplomatic': Users,
  'Cyber': Zap,
  'Nuclear': Skull,
  'Intelligence': Shield,
};

const ActorProfile = ({ actor, index = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!actor) return null;

  const roleStyle = ROLE_BADGES[actor.role] || ROLE_BADGES['Regional Power'];
  const RoleIcon = roleStyle.icon;

  const losses = actor.losses || {};
  const totalLosses = losses.personnel + losses.equipment + losses.infrastructure;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`comic-panel rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-white/20' : 'hover:border-white/15'
      }`}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        {/* Flag */}
        <div className="relative">
          <span className="text-4xl">{actor.flag || '🏳️'}</span>
          {actor.isActive && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d12] animate-pulse" />
          )}
        </div>

        {/* Name and Role */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-white text-base truncate">
            {actor.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
              <RoleIcon className="w-3 h-3" />
              {actor.role}
            </span>
            {actor.alliance && (
              <span className="text-[10px] text-gray-500">
                Ally of {actor.alliance}
              </span>
            )}
          </div>
        </div>

        {/* Expand icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Divider */}
              <div className="h-px bg-white/10" />

              {/* Motivation */}
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Motivation
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {actor.motivation || 'Strategic interests in regional stability and influence.'}
                </p>
              </div>

              {/* Capabilities */}
              {actor.capabilities && actor.capabilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Key Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {actor.capabilities.map((cap, i) => {
                      const Icon = CAPABILITY_ICONS[cap] || Zap;
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                        >
                          <Icon className="w-3 h-3 text-red-400" />
                          {cap}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Losses Counter */}
              {totalLosses > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Confirmed Losses
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                      <div className="text-lg font-bold text-red-400">{losses.personnel || 0}</div>
                      <div className="text-[10px] text-gray-500">Personnel</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                      <div className="text-lg font-bold text-orange-400">{losses.equipment || 0}</div>
                      <div className="text-[10px] text-gray-500">Equipment</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                      <div className="text-lg font-bold text-yellow-400">{losses.infrastructure || 0}</div>
                      <div className="text-[10px] text-gray-500">Infrastructure</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              {actor.recentActivity && (
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Recent Activity
                  </h4>
                  <p className="text-sm text-gray-300">{actor.recentActivity}</p>
                </div>
              )}

              {/* Stance indicator */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">Conflict Stance:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-6 h-1.5 rounded-sm ${
                          level <= (actor.aggressionLevel || 3)
                            ? level <= 2 ? 'bg-green-500' : level <= 3 ? 'bg-yellow-500' : level <= 4 ? 'bg-orange-500' : 'bg-red-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">
                    {actor.aggressionLevel <= 2 ? 'Defensive' : actor.aggressionLevel <= 3 ? 'Cautious' : actor.aggressionLevel <= 4 ? 'Assertive' : 'Aggressive'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActorProfile;

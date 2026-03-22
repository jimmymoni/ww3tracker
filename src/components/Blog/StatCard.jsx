import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ label, value, subtext, trend, trendValue, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
    red: 'from-red-500/20 to-orange-500/20 border-red-500/30 text-red-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    yellow: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400',
  };

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const TrendIcon = trend ? trendIcons[trend] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 ${colorClasses[color]}`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-slate-900/50`}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          {trend && trendValue && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {TrendIcon && <TrendIcon className="w-3 h-3" />}
              {trendValue}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-400">{label}</p>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;

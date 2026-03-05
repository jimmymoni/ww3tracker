import { motion } from 'framer-motion';
import { Zap, AlertTriangle, Target, TrendingUp } from 'lucide-react';

const QuickFacts = ({ facts, variant = 'default' }) => {
  const icons = [Zap, AlertTriangle, Target, TrendingUp];
  
  const variants = {
    default: 'bg-zinc-900/50 border-zinc-800',
    warning: 'bg-orange-500/5 border-orange-500/20',
    success: 'bg-green-500/5 border-green-500/20',
    danger: 'bg-red-500/5 border-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-xl border p-5 ${variants[variant]}`}
    >
      <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-orange-500" />
        Quick Facts
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {facts.map((fact, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-zinc-950/50 rounded-lg"
            >
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 uppercase tracking-wider truncate">{fact.label}</p>
                <p className="text-white font-medium text-sm">{fact.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuickFacts;

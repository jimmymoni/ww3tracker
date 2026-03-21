/**
 * Warhead Selector Component
 * 
 * Features:
 * - Visual warhead cards with color coding
 * - Yield comparison
 * - Country flag indicators
 * - Responsive grid layout
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { WARHEADS } from '../../data/warheads';

// Country flag emojis
const FLAGS = {
  'USA': '🇺🇸',
  'Iran': '🇮🇷',
  'Russia': '🇷🇺',
  'USSR': '🇷🇺',
  'NATO': '🇪🇺',
  'Accidental': '⚠️'
};

export default function WarheadSelector({ selectedWarhead, onSelect }) {
  const [expandedWarhead, setExpandedWarhead] = useState(null);

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
      {WARHEADS.map((warhead, index) => (
        <motion.div
          key={warhead.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <button
            onClick={() => onSelect(warhead)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              selectedWarhead.id === warhead.id
                ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {/* Icon */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: `${warhead.color}20` }}
            >
              {warhead.icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-bold ${
                  selectedWarhead.id === warhead.id ? 'text-red-400' : 'text-white'
                }`}>
                  {warhead.name}
                </span>
                <span className="text-lg">{FLAGS[warhead.country]}</span>
              </div>
              <div className="text-gray-500 text-xs truncate">
                {warhead.description}
              </div>
            </div>

            {/* Yield */}
            <div className="text-right flex-shrink-0">
              <div 
                className="font-mono font-bold text-lg"
                style={{ color: warhead.color }}
              >
                {warhead.yieldDisplay.replace(' ', '')}
              </div>
              <div className="text-gray-600 text-[10px] uppercase">Yield</div>
            </div>

            {/* Expand button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpandedWarhead(expandedWarhead === warhead.id ? null : warhead.id);
              }}
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              {expandedWarhead === warhead.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </button>

          {/* Expanded Details */}
          {expandedWarhead === warhead.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-14 p-3 bg-black/30 rounded-lg border border-white/5"
            >
              <ul className="space-y-1.5">
                {warhead.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    {fact}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Yield Comparison Bar */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
          <Info className="w-3 h-3" />
          <span>Yield comparison (log scale)</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
          {WARHEADS.map((warhead) => (
            <div
              key={warhead.id}
              className="h-full transition-all duration-300"
              style={{
                width: `${Math.log10(warhead.yield) / Math.log10(50000) * 100}%`,
                backgroundColor: warhead.color,
                opacity: selectedWarhead.id === warhead.id ? 1 : 0.3
              }}
              title={`${warhead.name}: ${warhead.yieldDisplay}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-600">
          <span>1 KT</span>
          <span>100 KT</span>
          <span>1 MT</span>
          <span>50 MT</span>
        </div>
      </div>
    </div>
  );
}

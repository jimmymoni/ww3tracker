/**
 * Warhead Selector Component - Educational
 * 
 * Features:
 * - Category grouping (Historical, Modern, Reference, Hypothetical)
 * - Visual warhead cards with color coding
 * - Detailed yield comparison
 * - Country indicators
 * - Quick info expand
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Info, ChevronDown, ChevronUp, BookOpen, AlertTriangle } from 'lucide-react';
import { WARHEADS, CATEGORIES, getWarheadsByCategory } from '../../data/warheads';

// Country flag emojis
const FLAGS = {
  'USA': '🇺🇸',
  'Iran': '🇮🇷',
  'Russia': '🇷🇺',
  'USSR': '🇷🇺',
  'NATO': '🇪🇺',
  'Accidental': '⚠️',
  'Israel': '🇮🇱'
};

// Category labels
const CATEGORY_LABELS = {
  reference: 'Reference (Non-nuclear)',
  historical: 'Historical Weapons',
  modern: 'Modern Arsenal',
  hypothetical: 'Regional Estimates'
};

export default function WarheadSelector({ selectedWarhead, onSelect, onShowDetail }) {
  const [expandedWarhead, setExpandedWarhead] = useState(null);

  // Group warheads by category
  const warheadsByCategory = {
    reference: getWarheadsByCategory('reference'),
    historical: getWarheadsByCategory('historical'),
    modern: getWarheadsByCategory('modern'),
    hypothetical: getWarheadsByCategory('hypothetical')
  };

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
      {Object.entries(warheadsByCategory).map(([category, warheads]) => (
        warheads.length > 0 && (
          <div key={category} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center gap-2 py-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CATEGORIES[category]?.color || '#666' }}
              />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {CATEGORY_LABELS[category]}
              </span>
            </div>
            
            {/* Warheads in this category */}
            {warheads.map((warhead, index) => (
              <motion.div
                key={warhead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <button
                  onClick={() => onSelect(warhead)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${
                    selectedWarhead.id === warhead.id
                      ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Icon */}
                  <div 
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: `${warhead.color}20` }}
                  >
                    {warhead.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold truncate ${
                        selectedWarhead.id === warhead.id ? 'text-blue-400' : 'text-white'
                      }`}>
                        {warhead.shortName || warhead.name}
                      </span>
                      <span className="text-base flex-shrink-0">{FLAGS[warhead.country]}</span>
                    </div>
                    <div className="text-gray-500 text-xs truncate">
                      {warhead.description}
                    </div>
                  </div>

                  {/* Yield */}
                  <div className="text-right flex-shrink-0">
                    <div 
                      className="font-mono font-bold text-sm"
                      style={{ color: warhead.color }}
                    >
                      {warhead.yieldDisplay.replace(' ', '')}
                    </div>
                    <div className="text-gray-600 text-[9px] uppercase">Yield</div>
                  </div>
                </button>

                {/* Expanded Quick Details */}
                {selectedWarhead.id === warhead.id && warhead.facts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 mx-2 p-3 bg-black/30 rounded-lg border border-white/5"
                  >
                    <ul className="space-y-1">
                      {warhead.facts.slice(0, 3).map((fact, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                          <Zap className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{fact}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => onShowDetail && onShowDetail(true)}
                      className="w-full mt-2 py-1.5 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 bg-blue-500/10 rounded transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      View Full Details
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )
      ))}

      {/* Yield Comparison Bar */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3 h-3 text-gray-500" />
          <span className="text-xs text-gray-500">Yield comparison (log scale)</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
          {WARHEADS.filter(w => w.category !== 'reference').map((warhead) => (
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
        <div className="flex justify-between mt-1 text-[9px] text-gray-600">
          <span>15 KT</span>
          <span>100 KT</span>
          <span>1 MT</span>
          <span>50 MT</span>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
        <AlertTriangle className="w-3 h-3 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-yellow-600/80">
          Warhead specifications are based on open-source estimates. Actual capabilities may vary. 
          Regional weapons (Shahab-3, Jericho III) show estimated yields for educational purposes.
        </p>
      </div>
    </div>
  );
}

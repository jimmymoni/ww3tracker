/**
 * Warhead Detail Modal
 * 
 * Shows comprehensive information about a nuclear weapon including:
 * - Specifications
 * - History
 * - Strategic role
 * - Effects data
 * - Educational context
 */

import { motion } from 'framer-motion';
import { X, Zap, Calendar, Shield, Globe, Radio, Info, BookOpen, Target, Skull } from 'lucide-react';

// Country names mapping
const COUNTRY_NAMES = {
  'USA': 'United States',
  'USSR': 'Soviet Union',
  'Russia': 'Russia',
  'Iran': 'Iran',
  'Israel': 'Israel',
  'NATO': 'NATO',
  'Accidental': 'N/A - Chemical Accident'
};

export default function WarheadDetailModal({ warhead, onClose }) {
  if (!warhead) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="sticky top-0 z-10 p-5 border-b border-white/10"
          style={{ backgroundColor: `${warhead.color}10` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: `${warhead.color}30`, border: `1px solid ${warhead.color}50` }}
              >
                {warhead.icon}
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold text-white">
                  {warhead.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{COUNTRY_NAMES[warhead.country] || warhead.country}</span>
                  <span>•</span>
                  <span style={{ color: warhead.color }}>{warhead.type}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Quick Stats Row */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: warhead.color }} />
              <span className="text-sm">
                <span className="text-gray-500">Yield: </span>
                <span className="font-mono font-bold" style={{ color: warhead.color }}>
                  {warhead.yieldDisplay}
                </span>
                {warhead.yieldNote && (
                  <span className="text-gray-600 text-xs ml-1">({warhead.yieldNote})</span>
                )}
              </span>
            </div>
            {warhead.year && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  <span className="text-gray-500">Introduced: </span>
                  <span className="text-white">{warhead.year}</span>
                </span>
              </div>
            )}
            {warhead.status && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  <span className="text-gray-500">Status: </span>
                  <span className="text-white">{warhead.status}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Warning for Reference */}
          {warhead.category === 'reference' && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-400/90">
                  <strong>Non-nuclear reference:</strong> {warhead.comparison}
                </p>
              </div>
            </div>
          )}

          {/* Warning for Hypothetical */}
          {warhead.category === 'hypothetical' && (
            <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-400/90">
                  <strong>Estimated capability:</strong> {warhead.note}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {warhead.description}
            </p>
          </div>

          {/* History */}
          {warhead.history && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Historical Context
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {warhead.history}
              </p>
            </div>
          )}

          {/* Specifications */}
          {warhead.specifications && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(warhead.specifications).map(([key, value]) => (
                  <div key={key} className="p-2.5 bg-white/5 rounded-lg">
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strategic Role */}
          {warhead.strategicRole && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Strategic Role
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {warhead.strategicRole}
              </p>
            </div>
          )}

          {/* Effects */}
          {warhead.effects && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Skull className="w-4 h-4" />
                Weapons Effects (Single Warhead)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(warhead.effects).map(([key, value]) => (
                  <div key={key} className="p-2.5 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="text-[10px] text-red-400/70 uppercase tracking-wider mb-0.5">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-300">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Facts */}
          {warhead.facts && warhead.facts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Key Facts
              </h3>
              <ul className="space-y-1.5">
                {warhead.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-gray-500 mt-1">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Context */}
          {warhead.context && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-blue-300/80">
                <strong>Context:</strong> {warhead.context}
              </p>
            </div>
          )}

          {/* Effects Note */}
          {warhead.note && warhead.category !== 'hypothetical' && (
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-400">
                {warhead.note}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-white/10 bg-[#0f0f14]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

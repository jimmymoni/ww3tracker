/**
 * Blast Visualization Component - Educational
 * 
 * Shows the pre-detonation preview with:
 * - Location on map visualization
 * - Selected warhead info
 * - Educational instructions
 * - Context about effects
 */

import { motion } from 'framer-motion';
import { MapPin, Zap, Globe, AlertTriangle, Flame, BookOpen, Info } from 'lucide-react';

// Simple world map SVG background
const WorldMapBackground = () => (
  <svg 
    viewBox="0 0 1000 500" 
    className="absolute inset-0 w-full h-full opacity-20"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    {/* Simplified world representation */}
    <g fill="rgba(204, 26, 26, 0.1)" stroke="rgba(204, 26, 26, 0.2)" strokeWidth="1">
      {/* North America rough shape */}
      <path d="M 150 120 Q 200 80 280 100 L 320 150 L 280 250 L 200 280 L 120 200 Z" />
      {/* South America */}
      <path d="M 280 300 L 320 320 L 300 420 L 260 400 Z" />
      {/* Europe */}
      <path d="M 480 100 L 540 90 L 560 140 L 520 160 L 480 140 Z" />
      {/* Africa */}
      <path d="M 480 180 L 540 170 L 560 280 L 520 320 L 480 280 Z" />
      {/* Asia */}
      <path d="M 580 80 L 750 90 L 800 180 L 720 220 L 600 200 L 560 140 Z" />
      {/* Australia */}
      <path d="M 750 320 L 850 320 L 840 380 L 760 370 Z" />
    </g>
  </svg>
);

export default function BlastVisualization({ city, warhead }) {
  return (
    <div className="h-full min-h-[450px] bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 relative overflow-hidden">
      {/* Background */}
      <WorldMapBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        {/* Location Marker */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-6"
        >
          {/* Pulsing rings - representing blast wave */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-2 border-red-500/20"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="w-32 h-32 rounded-full border-2 border-orange-500/20"
            />
          </div>
          
          {/* Center marker */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 flex items-center justify-center">
            <Globe className="w-8 h-8 text-red-400" />
          </div>
          
          {/* Coordinates */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-mono text-gray-500">
              {city.lat.toFixed(4)}°N, {Math.abs(city.lng).toFixed(4)}°{city.lng > 0 ? 'E' : 'W'}
            </span>
          </div>
        </motion.div>

        {/* Location Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
            {city.name}
          </h2>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {city.country}
            </span>
            <span>•</span>
            <span>Population: {(city.population / 1000000).toFixed(1)}M</span>
          </div>
        </motion.div>

        {/* Warhead Preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl px-6 py-4 border border-white/10 max-w-sm"
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${warhead.color}20` }}
            >
              {warhead.icon}
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500">Selected Warhead</div>
              <div className="font-bold text-white">{warhead.name}</div>
              <div className="text-sm" style={{ color: warhead.color }}>
                {warhead.yieldDisplay}
                {warhead.yieldNote && (
                  <span className="text-gray-500 text-xs ml-1">{warhead.yieldNote}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center gap-3 text-gray-500"
        >
          <BookOpen className="w-4 h-4 text-red-400" />
          <span className="text-sm">Click SIMULATE EFFECTS to see the humanitarian impact</span>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-6 right-6 flex items-start gap-2 text-xs text-gray-500 bg-black/40 rounded-lg px-4 py-3"
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            This is an educational simulation based on standard nuclear weapons effects data. 
            Real-world effects vary based on altitude, weather, and building construction.
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Blast Visualization Component
 * 
 * Shows the pre-detonation preview with:
 * - City location on map
 * - Selected warhead info
 * - Instructions
 */

import { motion } from 'framer-motion';
import { MapPin, Zap, Target, AlertTriangle, Flame } from 'lucide-react';

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
    
    {/* Simplified continents - dots */}
    {Array.from({ length: 50 }).map((_, i) => (
      <circle
        key={i}
        cx={100 + Math.random() * 800}
        cy={50 + Math.random() * 400}
        r={1 + Math.random() * 2}
        fill="rgba(255,255,255,0.1)"
      />
    ))}
  </svg>
);

export default function BlastVisualization({ city, warhead }) {
  return (
    <div className="h-full min-h-[500px] comic-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
      {/* Background */}
      <WorldMapBackground />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        {/* Target Marker */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-full border-2 border-red-500/30"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="w-32 h-32 rounded-full border-2 border-orange-500/30"
            />
          </div>
          
          {/* Center marker */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/50 flex items-center justify-center">
            <Target className="w-10 h-10 text-red-400" />
          </div>
          
          {/* Coordinates */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-mono text-gray-500">
              {city.lat.toFixed(4)}°N, {Math.abs(city.lng).toFixed(4)}°{city.lng > 0 ? 'E' : 'W'}
            </span>
          </div>
        </motion.div>

        {/* City Info */}
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
          className="bg-white/5 rounded-xl px-6 py-4 border border-white/10"
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
          <Flame className="w-5 h-5 text-orange-400" />
          <span>Click DETONATE to see the impact</span>
        </motion.div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-6 right-6 flex items-center gap-2 text-xs text-gray-600 bg-black/30 rounded-lg px-4 py-3"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>This is an educational simulation. Real-world effects may vary based on altitude, weather, and other factors.</span>
        </motion.div>
      </div>
    </div>
  );
}

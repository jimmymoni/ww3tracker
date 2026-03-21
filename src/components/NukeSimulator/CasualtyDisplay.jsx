/**
 * Casualty Display Component
 * 
 * Shows post-detonation results:
 * - Blast zone visualization
 * - Casualty statistics
 * - Zone-by-zone breakdown
 * - Impact description
 */

import { motion } from 'framer-motion';
import { 
  Skull, 
  Users, 
  Wind, 
  Thermometer, 
  Radio, 
  Flame,
  AlertTriangle,
  Info
} from 'lucide-react';
import { formatNumber, formatWithCommas, getImpactDescription } from '../../utils/nuke';

// Zone configuration
const ZONES = [
  {
    key: 'fireball',
    name: 'Fireball',
    icon: Flame,
    color: '#dc2626',
    bgColor: 'bg-red-500',
    description: 'Everything vaporized instantly',
    fatalityRate: '100%'
  },
  {
    key: 'heavy',
    name: 'Heavy Damage',
    icon: AlertTriangle,
    color: '#ea580c',
    bgColor: 'bg-orange-500',
    description: 'Reinforced concrete destroyed',
    fatalityRate: '90%'
  },
  {
    key: 'moderate',
    name: 'Moderate Damage',
    icon: Wind,
    color: '#ca8a04',
    bgColor: 'bg-yellow-500',
    description: 'Residential buildings collapse',
    fatalityRate: '50%'
  },
  {
    key: 'light',
    name: 'Light Damage',
    icon: Info,
    color: '#65a30d',
    bgColor: 'bg-lime-500',
    description: 'Windows break, injuries',
    fatalityRate: '<5%'
  }
];

export default function CasualtyDisplay({ city, warhead, casualties, blastRadii, onShare }) {
  const impactDescription = getImpactDescription(casualties.fatalities);
  
  // Get the largest radius for scaling
  const maxRadius = Math.max(...Object.values(blastRadii));
  
  // Scale factor for visualization (max 200px radius)
  const scaleFactor = 200 / maxRadius;
  
  return (
    <div className="comic-panel rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white">
            Impact Results: {city.name}
          </h2>
          <p className="text-gray-500 text-sm">
            {warhead.name} ({warhead.yieldDisplay}) detonation
          </p>
        </div>
        <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
          <span className="text-red-400 font-medium text-sm">{impactDescription}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left - Blast Visualization */}
        <div className="relative">
          <div className="aspect-square max-w-[400px] mx-auto relative">
            {/* Blast zones - concentric circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Light damage - outer */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0 }}
                className="absolute rounded-full border-2 border-lime-500/30 bg-lime-500/5"
                style={{
                  width: blastRadii.light * scaleFactor * 2,
                  height: blastRadii.light * scaleFactor * 2
                }}
              />
              
              {/* Moderate damage */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute rounded-full border-2 border-yellow-500/40 bg-yellow-500/10"
                style={{
                  width: blastRadii.moderate * scaleFactor * 2,
                  height: blastRadii.moderate * scaleFactor * 2
                }}
              />
              
              {/* Heavy damage */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute rounded-full border-2 border-orange-500/50 bg-orange-500/15"
                style={{
                  width: blastRadii.heavy * scaleFactor * 2,
                  height: blastRadii.heavy * scaleFactor * 2
                }}
              />
              
              {/* Fireball - inner */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute rounded-full bg-gradient-to-br from-white via-yellow-400 to-red-500 shadow-2xl"
                style={{
                  width: Math.max(blastRadii.fireball * scaleFactor * 2, 40),
                  height: Math.max(blastRadii.fireball * scaleFactor * 2, 40),
                  boxShadow: '0 0 60px rgba(239, 68, 68, 0.5)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </motion.div>

              {/* Ground zero marker */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute text-center"
                style={{ bottom: '10%' }}
              >
                <div className="text-xs text-gray-500 font-mono">{city.name}</div>
              </motion.div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {ZONES.map((zone) => (
              <div key={zone.key} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: zone.color, opacity: 0.7 }}
                />
                <span className="text-gray-400">{zone.name}</span>
                <span className="text-gray-600 font-mono">
                  {blastRadii[zone.key].toFixed(1)} km
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Statistics */}
        <div className="space-y-4">
          {/* Main casualty cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center"
            >
              <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-bold text-red-400 font-mono">
                {formatNumber(casualties.fatalities)}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                Estimated Fatalities
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center"
            >
              <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl sm:text-4xl font-bold text-orange-400 font-mono">
                {formatNumber(casualties.injuries)}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                Estimated Injuries
              </div>
            </motion.div>
          </div>

          {/* Zone breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/30 rounded-xl p-4"
          >
            <h3 className="text-sm font-bold text-gray-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Casualties by Zone
            </h3>
            <div className="space-y-2">
              {ZONES.map((zone, index) => {
                const zoneData = casualties.zones[zone.key];
                if (!zoneData || zoneData.fatalities === 0) return null;
                
                return (
                  <motion.div
                    key={zone.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-sm text-gray-400">{zone.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono text-sm">
                        {formatWithCommas(zoneData.fatalities)}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {blastRadii[zone.key].toFixed(1)} km
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Additional effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-gray-500">Thermal Radius</span>
              </div>
              <div className="text-lg font-mono text-white">
                {blastRadii.thermal.toFixed(1)} km
              </div>
              <div className="text-xs text-gray-600">3rd degree burns</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-500">Radiation Radius</span>
              </div>
              <div className="text-lg font-mono text-white">
                {blastRadii.radiation.toFixed(1)} km
              </div>
              <div className="text-xs text-gray-600">500 rem lethal dose</div>
            </div>
          </motion.div>

          {/* Total affected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total Affected Population</span>
              <span className="text-2xl font-bold text-blue-400 font-mono">
                {formatNumber(casualties.affected)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

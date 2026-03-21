/**
 * ☢️ NUCLEAR STRIKE SIMULATOR - VIRAL WEAPON 2
 * 
 * Growth Strategy: "See what a nuke would do to YOUR city"
 * 
 * REDDIT LAUNCH PLAN:
 * Target: r/interestingasfuck, r/dataisbeautiful, r/MapPorn, r/mildlyinteresting
 * Title: "I built a nuclear strike simulator that shows what different warheads 
 *        would do to any city"
 * 
 * Why this goes viral:
 * - Personalization: Users search for THEIR city
 * - Comparison: Multiple warheads drive repeat usage
 * - Shock value: Casualty numbers are shareable
 * - Shareable: OG images + watermark = free marketing
 * 
 * Features:
 * ✓ City search with autocomplete
 * ✓ 7 warheads (Iranian Shahab-3, US B61, Tsar Bomba, etc.)
 * ✓ Interactive blast zone visualization
 * ✓ Casualty estimates by zone
 * ✓ Share functionality with pre-populated text
 * ✓ Link to blog for traffic conversion
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Users, 
  Radio, 
  Flame, 
  Share2, 
  Search, 
  AlertTriangle,
  Info,
  ExternalLink,
  RotateCcw,
  Crosshair,
  Thermometer,
  Wind,
  Skull
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { WARHEADS, getDefaultWarhead } from '../../data/warheads';
import { CITIES, searchCities, getDefaultCity, FEATURED_CITIES } from '../../data/cities';
import { 
  calculateBlastRadii, 
  calculateCasualties,
  formatNumber,
  formatWithCommas,
  estimatePopulationDensity,
  generateShareText,
  getImpactDescription
} from '../../utils/nuke';

import CitySearch from './CitySearch';
import WarheadSelector from './WarheadSelector';
import BlastVisualization from './BlastVisualization';
import CasualtyDisplay from './CasualtyDisplay';
import SharePanel from './SharePanel';

// Default state
const DEFAULT_CITY = getDefaultCity();
const DEFAULT_WARHEAD = getDefaultWarhead();

export default function NukeSimulator() {
  // State
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [selectedWarhead, setSelectedWarhead] = useState(DEFAULT_WARHEAD);
  const [isDetonated, setIsDetonated] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [casualties, setCasualties] = useState(null);
  const [blastRadii, setBlastRadii] = useState(null);
  
  // Calculate blast data when detonated
  useEffect(() => {
    if (isDetonated) {
      const radii = calculateBlastRadii(selectedWarhead.yield);
      const density = estimatePopulationDensity(selectedCity.population);
      const casualtyData = calculateCasualties(selectedWarhead.yield, density);
      
      setBlastRadii(radii);
      setCasualties(casualtyData);
      
      // Analytics
      if (window.gtag) {
        window.gtag('event', 'nuke_sim_detonate', {
          city: selectedCity.name,
          warhead: selectedWarhead.name,
          yield: selectedWarhead.yield,
          fatalities: casualtyData.fatalities
        });
      }
    }
  }, [isDetonated, selectedCity, selectedWarhead]);
  
  // Handle detonate
  const handleDetonate = useCallback(() => {
    setIsDetonated(true);
    setShowShare(false);
  }, []);
  
  // Handle reset
  const handleReset = useCallback(() => {
    setIsDetonated(false);
    setShowShare(false);
    setCasualties(null);
    setBlastRadii(null);
  }, []);
  
  // Handle share
  const handleShare = useCallback(() => {
    setShowShare(true);
    if (window.gtag) {
      window.gtag('event', 'nuke_sim_share', {
        city: selectedCity.name,
        warhead: selectedWarhead.name
      });
    }
  }, [selectedCity, selectedWarhead]);
  
  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/30 to-orange-600/30 border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Zap className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Nuclear Strike Simulator
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                See what different warheads would do to any city
              </p>
            </div>
          </div>
          
          {/* Educational Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Info className="w-3 h-3" />
            <span>Educational simulation based on standard nuclear weapons effects data</span>
          </div>
        </motion.div>
        
        {/* Main Simulator Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Panel - Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* City Search */}
            <div className="comic-panel rounded-2xl p-4 sm:p-5">
              <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                Select Target City
              </h2>
              <CitySearch 
                selectedCity={selectedCity}
                onSelect={(city) => {
                  setSelectedCity(city);
                  handleReset();
                }}
              />
            </div>
            
            {/* Warhead Selector */}
            <div className="comic-panel rounded-2xl p-4 sm:p-5">
              <h2 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-400" />
                Select Warhead
              </h2>
              <WarheadSelector 
                selectedWarhead={selectedWarhead}
                onSelect={(warhead) => {
                  setSelectedWarhead(warhead);
                  handleReset();
                }}
              />
            </div>
            
            {/* Current Selection Summary */}
            <div className="comic-panel rounded-2xl p-4 sm:p-5">
              <h3 className="font-heading text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Current Selection
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Target:</span>
                  <span className="text-white font-medium">{selectedCity.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Population:</span>
                  <span className="text-white font-medium">{formatNumber(selectedCity.population)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Warhead:</span>
                  <span className="text-white font-medium">{selectedWarhead.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Yield:</span>
                  <span className="text-red-400 font-mono font-bold">{selectedWarhead.yieldDisplay}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            {!isDetonated ? (
              <motion.button
                onClick={handleDetonate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5" />
                DETONATE
              </motion.button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>
            )}
          </motion.div>
          
          {/* Center/Right Panel - Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {!isDetonated ? (
                <BlastVisualization 
                  key="preview"
                  city={selectedCity}
                  warhead={selectedWarhead}
                />
              ) : (
                <CasualtyDisplay 
                  key="results"
                  city={selectedCity}
                  warhead={selectedWarhead}
                  casualties={casualties}
                  blastRadii={blastRadii}
                  onShare={handleShare}
                />
              )}
            </AnimatePresence>
            
            {/* Share Panel */}
            <AnimatePresence>
              {showShare && isDetonated && (
                <SharePanel 
                  city={selectedCity}
                  warhead={selectedWarhead}
                  casualties={casualties}
                  onClose={() => setShowShare(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Bottom Section - Context & Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="comic-panel rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  This is what we&apos;re tracking in real-time
                </h3>
                <p className="text-gray-400 text-sm">
                  The US-Iran conflict has the potential to escalate to nuclear use. 
                  We&apos;re monitoring the situation 24/7.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/live-map"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-xl font-medium transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  View Live War Map
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 rounded-xl font-medium transition-all"
                >
                  Read Latest Updates
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Methodology Note */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-500 hover:text-gray-400 text-xs flex items-center justify-center gap-1 mx-auto"
            >
              <Info className="w-3 h-3" />
              How are these numbers calculated?
            </button>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white/5 rounded-xl text-left max-w-2xl mx-auto"
                >
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <strong className="text-gray-300">Methodology:</strong> Blast radii calculated using standard 
                    nuclear weapons scaling laws (Glasstone & Dolan). Casualty estimates based on population density 
                    and historical bombing data. Fireball zone = 100% fatalities; Heavy damage (20 psi) = 90% fatalities; 
                    Moderate damage (5 psi) = 50% fatalities. These are estimates for educational purposes and do not 
                    account for fallout, weather, or emergency response.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors">Home</Link>
            <Link to="/live-map" className="text-gray-500 hover:text-white transition-colors">Live Map</Link>
            <Link to="/blog" className="text-gray-500 hover:text-white transition-colors">WW3 News</Link>
          </div>
          <p className="text-gray-600 text-xs">
            Built for educational purposes • Data from verified public sources
          </p>
        </footer>
      </div>
    </div>
  );
}

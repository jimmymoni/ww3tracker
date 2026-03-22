/**
 * NUCLEAR WEAPONS EFFECTS SIMULATOR - Educational Component
 * 
 * Purpose: Educational tool for understanding the humanitarian impact
 * of nuclear weapons. Part of peace education and conflict awareness.
 * 
 * REDESIGNED with educational framing:
 * - "Location" instead of "Target"
 * - "Effects Simulation" instead of "Strike"
 * - Comprehensive warhead information
 * - Context about nuclear non-proliferation
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Users, 
  Info,
  Share2, 
  Search, 
  AlertTriangle,
  ExternalLink,
  RotateCcw,
  Globe,
  BookOpen,
  Flame,
  Shield,
  Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { WARHEADS, getDefaultWarhead, CATEGORIES, getWarheadsByCategory, getPopulationDensity } from '../../data/warheads';
import { getDefaultCity } from '../../data/cities';
import { 
  calculateBlastRadii, 
  calculateCasualties,
  formatNumber
} from '../../utils/nuke';

import CitySearch from './CitySearch';
import WarheadSelector from './WarheadSelector';
import BlastVisualization from './BlastVisualization';
import CasualtyDisplay from './CasualtyDisplay';
import SharePanel from './SharePanel';
import WarheadDetailModal from './WarheadDetailModal';

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
  const [showWarheadDetail, setShowWarheadDetail] = useState(false);
  const [casualties, setCasualties] = useState(null);
  const [blastRadii, setBlastRadii] = useState(null);
  
  // Calculate blast data when detonated
  useEffect(() => {
    if (isDetonated) {
      const radii = calculateBlastRadii(selectedWarhead.yield);
      const density = getPopulationDensity(selectedCity);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(204, 26, 26, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(204, 26, 26, 0.2) 0%, transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-red-400" />
            </div>
            <div className="text-left">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Nuclear Weapons Effects Simulator
              </h1>
              <p className="text-gray-400 text-sm">
                Educational tool for understanding nuclear weapons humanitarian impact
              </p>
            </div>
          </div>
          
          {/* Educational Disclaimer */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
            <Info className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-300">
              Educational simulation based on Glasstone & Dolan &quot;Effects of Nuclear Weapons&quot;
            </span>
          </div>
        </motion.div>
        
        {/* Main Simulator Interface */}
        <div className="grid lg:grid-cols-3 gap-4">
          
          {/* Left Panel - Controls */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-3"
          >
            {/* Location Search */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4">
              <h2 className="font-heading text-base font-bold text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-400" />
                Select Location
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
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4">
              <h2 className="font-heading text-base font-bold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-400" />
                Select Warhead
              </h2>
              <WarheadSelector 
                selectedWarhead={selectedWarhead}
                onSelect={(warhead) => {
                  setSelectedWarhead(warhead);
                  handleReset();
                }}
                onShowDetail={setShowWarheadDetail}
              />
            </div>
            
            {/* Current Selection Summary */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-4">
              <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Simulation Parameters
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-white font-medium">{selectedCity.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Population:</span>
                  <span className="text-white font-medium">{formatNumber(selectedCity.population)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Warhead:</span>
                  <span className="text-white font-medium">{selectedWarhead.shortName || selectedWarhead.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Yield:</span>
                  <span className="text-orange-400 font-mono font-bold">{selectedWarhead.yieldDisplay}</span>
                </div>
                {selectedWarhead.year && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Introduced:</span>
                    <span className="text-gray-400">{selectedWarhead.year}</span>
                  </div>
                )}
              </div>
              
              {/* Show Detail Button */}
              <button
                onClick={() => setShowWarheadDetail(true)}
                className="w-full mt-3 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                View Full Warhead Information
              </button>
            </div>
            
            {/* Action Buttons */}
            {!isDetonated ? (
              <motion.button
                onClick={handleDetonate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-transparent border border-[#cc1a1a] hover:bg-[#cc1a1a] text-white font-semibold py-3 rounded text-base transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                SIMULATE EFFECTS
              </motion.button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent border border-[#cc1a1a] hover:bg-[#cc1a1a] text-white font-medium py-3 rounded transition-all flex items-center justify-center gap-2"
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
        
        {/* Warhead Detail Modal */}
        <AnimatePresence>
          {showWarheadDetail && (
            <WarheadDetailModal 
              warhead={selectedWarhead}
              onClose={() => setShowWarheadDetail(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Bottom Section - Context & Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="font-heading text-base font-bold text-white mb-1">
                  Why we built this educational tool
                </h3>
                <p className="text-gray-400 text-sm max-w-xl">
                  Understanding the devastating humanitarian impact of nuclear weapons is essential 
                  for peace education. This simulator uses established physics to show why nuclear 
                  war must never happen. We track the US-Iran conflict to help prevent escalation.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/live-map"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all text-sm"
                >
                  <MapPin className="w-4 h-4" />
                  View Live War Map
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg font-medium transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Updates
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Methodology & Sources */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="text-gray-500 hover:text-gray-400 text-xs flex items-center justify-center gap-1 mx-auto"
            >
              <Info className="w-3 h-3" />
              How are these numbers calculated? View sources & methodology
            </button>
            
            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white/5 rounded-xl text-left max-w-3xl mx-auto"
                >
                  <h4 className="font-bold text-gray-300 text-sm mb-2">Methodology & Data Sources</h4>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    <strong className="text-gray-300">Physics:</strong> Blast radii calculated using standard 
                    nuclear weapons scaling laws from <em>"The Effects of Nuclear Weapons"</em> by Glasstone & Dolan (1977), 
                    the authoritative reference published by the U.S. Department of Defense.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    <strong className="text-gray-300">Casualty Model:</strong> Based on population density and historical 
                    bombing data. Fireball zone = 100% fatalities; Heavy damage (20 psi) = 90% fatalities; 
                    Moderate damage (5 psi) = 50% fatalities. These are estimates for educational purposes.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">
                    <strong className="text-gray-300">Warhead Data:</strong> Yields and specifications from 
                    Federation of American Scientists (FAS) Nuclear Notebook, Bulletin of the Atomic Scientists, 
                    Arms Control Association, and official government sources.
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    <strong className="text-gray-300">Limitations:</strong> This simulation does not account for 
                    fallout patterns (dependent on weather), emergency response effectiveness, building shielding, 
                    or medical care availability. Real-world effects would vary significantly based on burst altitude, 
                    weather conditions, and population preparedness.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-3 text-xs">
            <Link to="/" className="text-gray-500 hover:text-white transition-colors">Home</Link>
            <Link to="/live-map" className="text-gray-500 hover:text-white transition-colors">Live Map</Link>
            <Link to="/blog" className="text-gray-500 hover:text-white transition-colors">WW3 News</Link>
          </div>
          <p className="text-gray-600 text-xs">
            Built for educational purposes • Data from verified public sources • 
            <a href="https://fas.org/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 ml-1">
              FAS Nuclear Notebook
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Users, Radio, Flame, Share2, ExternalLink, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Weapon presets
const WEAPONS = [
  { id: 'tactical', name: 'Tactical', yield: 5, country: 'Low Yield', desc: '5 KT - Battlefield use' },
  { id: 'hiroshima', name: 'Little Boy', yield: 15, country: 'USA', desc: '15 KT - Hiroshima, 1945' },
  { id: 'b61', name: 'B61-12', yield: 50, country: 'NATO', desc: '50 KT - Modern tactical' },
  { id: 'w88', name: 'W88', yield: 475, country: 'USA', desc: '475 KT - Trident missile' },
  { id: 'sarmat', name: 'RS-28', yield: 800, country: 'Russia', desc: '800 KT - Satan II' },
  { id: 'tsar', name: 'Tsar Bomba', yield: 50000, country: 'Russia', desc: '50 MT - Largest ever tested' },
];

// Popular cities
const POPULAR_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA', pop: '8.3M' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'USA', pop: '3.9M' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', pop: '8.9M' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', pop: '2.1M' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', pop: '13.9M' },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', pop: '460K' },
  { name: 'Tehran', lat: 35.6892, lng: 51.389, country: 'Iran', pop: '8.7M' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', pop: '20M' },
];

// Calculate blast radii using standard scaling laws
const calculateBlastRadii = (yieldKT) => {
  return {
    fireball: 0.07 * Math.pow(yieldKT, 0.40), // km
    heavy: 0.44 * Math.pow(yieldKT, 0.33), // 20 psi
    radiation: 0.72 * Math.pow(yieldKT, 0.19), // 500 rem
    thermal: 1.6 * Math.pow(yieldKT, 0.41), // 3rd degree burns
    light: 3.3 * Math.pow(yieldKT, 0.33), // 1 psi
  };
};

// Estimate casualties based on population density and blast radius
const calculateCasualties = (yieldKT, cityPop) => {
  const radii = calculateBlastRadii(yieldKT);
  const affectedArea = Math.PI * Math.pow(radii.light, 2); // sq km
  
  // Population density varies by city size
  const density = cityPop > 10000000 ? 20000 : 
                  cityPop > 5000000 ? 15000 : 
                  cityPop > 1000000 ? 10000 : 5000;
  
  const affectedPop = affectedArea * density;
  const fatalityRate = yieldKT > 1000 ? 0.7 : yieldKT > 100 ? 0.5 : 0.3;
  const injuredRate = 0.4;
  
  return {
    fatalities: Math.round(affectedPop * fatalityRate),
    injured: Math.round(affectedPop * injuredRate),
  };
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

export default function NukeSimHero() {
  const [selectedCity, setSelectedCity] = useState(POPULAR_CITIES[0]);
  const [customCity, setCustomCity] = useState('');
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPONS[3]); // W88 default
  const [isDetonated, setIsDetonated] = useState(false);
  const [results, setResults] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const handleDetonate = useCallback(() => {
    const radii = calculateBlastRadii(selectedWeapon.yield);
    const casualties = calculateCasualties(selectedWeapon.yield, selectedCity.pop.replace(/[^0-9.]/g, '') * 1000000);
    
    setResults({ radii, casualties });
    setIsDetonated(true);
    
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'nuke_sim_detonate', {
        city: selectedCity.name,
        weapon: selectedWeapon.name,
        yield: selectedWeapon.yield
      });
    }
  }, [selectedCity, selectedWeapon]);

  const handleReset = () => {
    setIsDetonated(false);
    setResults(null);
    setShowShare(false);
  };

  const handleShare = () => {
    const text = `I simulated a ${selectedWeapon.name} (${selectedWeapon.yield >= 1000 ? (selectedWeapon.yield/1000).toFixed(0) + ' MT' : selectedWeapon.yield + ' KT'}) on ${selectedCity.name}.\n\nEstimated impact:\n💀 ${formatNumber(results.casualties.fatalities)} fatalities\n🏥 ${formatNumber(results.casualties.injured)} injured\n\nSee what would happen in your city:`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Nuclear Blast Simulator - WW3 Tracker',
        text: text,
        url: 'https://ww3tracker.live'
      });
    } else {
      navigator.clipboard.writeText(text + '\nhttps://ww3tracker.live');
      setShowShare(true);
      setTimeout(() => setShowShare(false), 2000);
    }
  };

  // Visual blast radius in pixels (scaled for display)
  const getRadiusPx = (km) => Math.min(Math.max(km * 3, 20), 300);

  return (
    <section className="w-full">
      <div className="bg-gradient-to-b from-[#0d0d12] via-[#14141c] to-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white font-bold">
                Nuclear Blast Simulator
              </h2>
              <p className="text-gray-400 text-sm">
                Understand the stakes. See what&apos;s at risk in the US-Iran conflict.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Controls */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
            {/* City Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <MapPin className="w-4 h-4 inline mr-1" />
                Select Target City
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => { setSelectedCity(city); handleReset(); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedCity.name === city.name
                        ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="Or type any city..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Weapon Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Radio className="w-4 h-4 inline mr-1" />
                Select Weapon Yield
              </label>
              <div className="space-y-2">
                {WEAPONS.map((weapon) => (
                  <button
                    key={weapon.id}
                    onClick={() => { setSelectedWeapon(weapon); handleReset(); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                      selectedWeapon.id === weapon.id
                        ? 'bg-red-500/20 border border-red-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className={`font-bold ${selectedWeapon.id === weapon.id ? 'text-red-400' : 'text-white'}`}>
                        {weapon.name}
                      </div>
                      <div className="text-gray-500 text-xs">{weapon.desc}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-mono font-bold ${selectedWeapon.id === weapon.id ? 'text-red-400' : 'text-white'}`}>
                        {weapon.yield >= 1000 ? `${(weapon.yield/1000).toFixed(0)}MT` : `${weapon.yield}KT`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detonate Button */}
            {!isDetonated ? (
              <motion.button
                onClick={handleDetonate}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-red-500/25 transition-all"
              >
                💥 DETONATE
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-xl transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  {showShare ? 'Copied!' : 'Share'}
                </button>
              </div>
            )}

            {/* Context Link */}
            <div className="mt-4 text-center">
              <Link 
                to="/live-map" 
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors inline-flex items-center gap-1"
              >
                Track the real conflict 
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Visualization */}
          <div className="p-6 md:p-8 bg-black/30 relative overflow-hidden min-h-[400px] flex items-center justify-center">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            <AnimatePresence mode="wait">
              {!isDetonated ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center z-10"
                >
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-4 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedCity.name}</h3>
                  <p className="text-gray-400">Population: {selectedCity.pop}</p>
                  <p className="text-gray-500 text-sm mt-4">Select weapon and click DETONATE</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full z-10"
                >
                  {/* Blast Visualization */}
                  <div className="relative h-64 mb-6 flex items-center justify-center">
                    {/* Light damage */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0 }}
                      className="absolute rounded-full border-2 border-yellow-500/30 bg-yellow-500/5"
                      style={{ width: getRadiusPx(results.radii.light) * 2, height: getRadiusPx(results.radii.light) * 2 }}
                    />
                    {/* Thermal */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="absolute rounded-full border-2 border-orange-500/40 bg-orange-500/10"
                      style={{ width: getRadiusPx(results.radii.thermal) * 2, height: getRadiusPx(results.radii.thermal) * 2 }}
                    />
                    {/* Heavy damage */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="absolute rounded-full border-2 border-red-500/50 bg-red-500/15"
                      style={{ width: getRadiusPx(results.radii.heavy) * 2, height: getRadiusPx(results.radii.heavy) * 2 }}
                    />
                    {/* Fireball */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="absolute rounded-full bg-gradient-to-br from-white via-yellow-400 to-red-500 shadow-2xl"
                      style={{ 
                        width: Math.max(getRadiusPx(results.radii.fireball) * 2, 40), 
                        height: Math.max(getRadiusPx(results.radii.fireball) * 2, 40),
                        boxShadow: '0 0 60px rgba(239, 68, 68, 0.6)'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center gap-4 mb-6 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-white to-red-500" />
                      <span className="text-gray-400">Fireball</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border border-red-500/50 bg-red-500/15" />
                      <span className="text-gray-400">Heavy Damage</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border border-yellow-500/30 bg-yellow-500/5" />
                      <span className="text-gray-400">Light Damage</span>
                    </div>
                  </div>

                  {/* Casualties */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                      <Users className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-400 font-mono">
                        {formatNumber(results.casualties.fatalities)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Fatalities</div>
                    </div>
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400 font-mono">
                        {formatNumber(results.casualties.injured)}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Injured</div>
                    </div>
                  </div>

                  {/* Blast radii details */}
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white font-mono">{results.radii.fireball.toFixed(1)} km</div>
                      <div className="text-gray-500">Fireball</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white font-mono">{results.radii.heavy.toFixed(1)} km</div>
                      <div className="text-gray-500">Heavy Damage</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2">
                      <div className="text-white font-mono">{results.radii.light.toFixed(1)} km</div>
                      <div className="text-gray-500">Light Damage</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer - Context */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              This simulation uses standard blast scaling laws for educational purposes.
              <br />
              <span className="text-gray-500">Based on current US-Iran tensions. Track the real conflict below.</span>
            </p>
            <Link
              to="/live-map"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all whitespace-nowrap"
            >
              View Live War Map
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

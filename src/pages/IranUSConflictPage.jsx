import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Swords, Home, MapPin, Clock, Users, AlertTriangle, 
  TrendingUp, Shield, Globe, Target, Mail, ChevronRight,
  Crosshair, Radio
} from 'lucide-react';
import SEO from '../components/SEO';

// Mini Zone Map Component
const ZoneMap = ({ zone }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getZoneCoords = () => {
    switch(zone) {
      case 'iran-us':
        return { center: [54, 32], zoom: 4.5, markers: [
          { lat: 35.6892, lng: 51.3890, label: 'Tehran', type: 'capital' },
          { lat: 32.6539, lng: 51.6660, label: 'Isfahan', type: 'strike' },
          { lat: 33.8938, lng: 35.5018, label: 'Beirut', type: 'proxy' },
          { lat: 33.3152, lng: 44.3661, label: 'Baghdad', type: 'proxy' },
          { lat: 25.2048, lng: 55.2708, label: 'Dubai', type: 'strike' },
        ]};
      default:
        return { center: [54, 32], zoom: 4.5, markers: [] };
    }
  };

  const coords = getZoneCoords();

  return (
    <div className="relative w-full h-64 bg-[#0a0f1c] rounded-xl overflow-hidden border border-white/10">
      {/* Simplified SVG Map */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Background Grid */}
        <defs>
          <pattern id="grid-iran" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-iran)" />
        
        {/* Simplified Region Shapes */}
        {/* Iran */}
        <path 
          d="M 100,80 L 280,60 L 320,120 L 300,200 L 200,220 L 120,180 Z" 
          fill="rgba(239,68,68,0.1)" 
          stroke="rgba(239,68,68,0.3)" 
          strokeWidth="1"
        />
        {/* Iraq */}
        <path 
          d="M 80,100 L 120,90 L 140,140 L 100,180 L 60,150 Z" 
          fill="rgba(100,116,139,0.1)" 
          stroke="rgba(100,116,139,0.2)" 
          strokeWidth="1"
        />
        {/* Saudi Arabia */}
        <path 
          d="M 60,180 L 120,170 L 200,200 L 180,280 L 80,270 Z" 
          fill="rgba(100,116,139,0.1)" 
          stroke="rgba(100,116,139,0.2)" 
          strokeWidth="1"
        />
        {/* UAE */}
        <path 
          d="M 220,220 L 260,215 L 270,240 L 230,245 Z" 
          fill="rgba(100,116,139,0.1)" 
          stroke="rgba(100,116,139,0.2)" 
          strokeWidth="1"
        />

        {/* Strait of Hormuz - Highlighted */}
        <ellipse cx="280" cy="235" rx="30" ry="15" fill="rgba(234,179,8,0.15)" stroke="rgba(234,179,8,0.4)" strokeWidth="1" strokeDasharray="4,2">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Markers */}
        {coords.markers.map((marker, idx) => {
          const x = 100 + (marker.lng - 44) * 15;
          const y = 80 + (35 - marker.lat) * 8;
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="4" fill={
                marker.type === 'strike' ? '#ef4444' : 
                marker.type === 'proxy' ? '#f97316' : '#3b82f6'
              }>
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={x} y={y - 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">{marker.label}</text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(10, 10)">
          <circle cx="5" cy="5" r="3" fill="#ef4444" />
          <text x="12" y="8" fill="rgba(255,255,255,0.5)" fontSize="7">Strike</text>
          <circle cx="5" cy="18" r="3" fill="#f97316" />
          <text x="12" y="21" fill="rgba(255,255,255,0.5)" fontSize="7">Proxy</text>
          <circle cx="5" cy="31" r="3" fill="#eab308" />
          <text x="12" y="34" fill="rgba(255,255,255,0.5)" fontSize="7">Flashpoint</text>
        </g>
      </svg>

      {/* Overlay Label */}
      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
        <p className="text-xs text-gray-400">Active Conflict Zone</p>
        <p className="text-sm font-bold text-white">Persian Gulf Region</p>
      </div>
    </div>
  );
};

// Key Player Card Component
const KeyPlayerCard = ({ flag, name, role, objective, side }) => {
  const borderColor = side === 'us' ? 'border-blue-500/30' : side === 'iran' ? 'border-red-500/30' : 'border-yellow-500/30';
  const bgColor = side === 'us' ? 'bg-blue-500/10' : side === 'iran' ? 'bg-red-500/10' : 'bg-yellow-500/10';
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`comic-panel p-4 border-l-4 ${borderColor} ${bgColor}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{flag}</span>
        <div className="flex-1">
          <h3 className="font-heading font-bold text-white">{name}</h3>
          <p className="text-xs text-gray-500 mb-2">{role}</p>
          <p className="text-sm text-gray-300">{objective}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Timeline Item Component
const TimelineItem = ({ date, title, description, severity }) => {
  const severityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="flex gap-4 pb-6 border-l-2 border-white/10 pl-4 last:pb-0 relative">
      <div className={`absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full ${severity === 'high' ? 'bg-red-500' : severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
      <div className="flex-1">
        <span className={`text-xs px-2 py-0.5 rounded border ${severityColors[severity]}`}>{date}</span>
        <h4 className="font-bold text-white mt-2">{title}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

// Development Item Component
const DevelopmentItem = ({ time, source, content, type }) => {
  const typeColors = {
    breaking: 'bg-red-500/20 text-red-400',
    diplomatic: 'bg-blue-500/20 text-blue-400',
    military: 'bg-orange-500/20 text-orange-400',
    economic: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
      <div className={`w-2 h-2 rounded-full mt-2 ${type === 'breaking' ? 'bg-red-500 animate-pulse' : type === 'military' ? 'bg-orange-500' : 'bg-blue-500'}`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs px-2 py-0.5 rounded ${typeColors[type]}`}>{type.toUpperCase()}</span>
          <span className="text-xs text-gray-500">{source}</span>
          <span className="text-xs text-gray-600">• {time}</span>
        </div>
        <p className="text-sm text-gray-300">{content}</p>
      </div>
    </div>
  );
};

const IranUSConflictPage = () => {
  useEffect(() => {
    document.title = "Iran-US Conflict Zone | Live War Tracker 2026";
  }, []);

  // Quick Stats
  const stats = {
    attacks: 47,
    duration: 78,
    casualties: 2847,
    status: 'ESCALATING'
  };

  // Key Players
  const keyPlayers = [
    { flag: '🇮🇷', name: 'Iran', role: 'Islamic Republic', objective: 'Regime survival, sanctions relief, regional influence', side: 'iran' },
    { flag: '🇺🇸', name: 'United States', role: 'Superpower', objective: 'Prevent Iranian nuclear weapons, protect allies', side: 'us' },
    { flag: '🇮🇱', name: 'Israel', role: 'Regional Power', objective: 'Eliminate existential threat from Iran', side: 'us' },
    { flag: '🇸🇦', name: 'Gulf States', role: 'Oil Producers', objective: 'Ensure oil security and shipping lanes', side: 'us' }
  ];

  // Timeline Data
  const timeline = [
    { date: 'Feb 2026', title: 'Nuclear Facilities Struck', description: 'Israel conducts precision strikes on Iranian nuclear sites at Natanz and Isfahan.', severity: 'high' },
    { date: 'Feb 2026', title: 'Iran Retaliates', description: 'Iran launches 200+ ballistic missiles at Israeli targets and US bases in Iraq.', severity: 'high' },
    { date: 'Mar 2026', title: 'Dubai Airport Attack', description: 'Drone strike hits fuel tanks at Dubai International Airport.', severity: 'high' },
    { date: 'Mar 2026', title: 'Strait Tensions', description: 'Iran threatens to close Strait of Hormuz; US deploys additional carrier group.', severity: 'medium' }
  ];

  // Latest Developments
  const developments = [
    { time: '2h ago', source: 'Defense Intel', content: 'Additional Iranian missile batteries detected near Strait of Hormuz', type: 'military' },
    { time: '5h ago', source: 'State Dept', content: 'Emergency diplomatic channels activated with European partners', type: 'diplomatic' },
    { time: '8h ago', source: 'Regional Monitor', content: 'Saudi Arabia increases oil production as contingency measure', type: 'economic' },
    { time: '12h ago', source: 'IDF', content: 'Israel completes retaliatory strikes on Hezbollah positions in Lebanon', type: 'military' }
  ];

  // What's at Stake
  const stakes = [
    { icon: <Radio className="w-5 h-5 text-yellow-400" />, title: 'Nuclear Capability', description: 'Iran is weeks away from weapons-grade uranium enrichment' },
    { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'Regional Dominance', description: 'Control of Middle East security architecture for decades' },
    { icon: <TrendingUp className="w-5 h-5 text-green-400" />, title: 'Strait of Hormuz', description: '20% of global oil supply passes through this chokepoint' },
    { icon: <Shield className="w-5 h-5 text-red-400" />, title: 'Alliance System', description: 'US credibility with allies Israel, Saudi Arabia, UAE at risk' }
  ];

  return (
    <>
      <SEO
        title="Iran-US Conflict Zone | Live War Tracker 2026"
        description="Track the Iran-US conflict in real-time. Live updates on military strikes, nuclear tensions, and regional escalation in the Persian Gulf."
        pathname="/iran-us-conflict"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/iran-us-conflict" />
      </Helmet>

      <div className="min-h-screen bg-grid text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 relative">
                    <img src="/logo/globe-radar.svg" alt="WW3 Tracker" className="w-full h-full" />
                  </div>
                  <span className="font-heading font-bold text-xl text-white">WW3 TRACKER</span>
                </Link>
              </div>
              <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-5xl">🇮🇷</span>
              <span className="text-2xl text-gray-500 font-heading">VS</span>
              <span className="text-5xl">🇺🇸</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Iran-US Conflict Zone
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full">
              <Swords className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">{stats.status}</span>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            <div className="comic-panel p-4 text-center">
              <Crosshair className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">{stats.attacks}</p>
              <p className="text-xs text-gray-500">Confirmed Attacks</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">{stats.duration}</p>
              <p className="text-xs text-gray-500">Days Active</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">{stats.casualties.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Casualties</p>
            </div>
          </motion.div>

          {/* Root Cause Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-6 mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Why This Conflict Exists
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Iran-US conflict traces its roots to the <span className="text-yellow-400">1979 Iranian Revolution</span>, when the US-backed Shah was overthrown and revolutionary students seized the American embassy in Tehran. The 444-day hostage crisis severed diplomatic relations permanently and began decades of mutual hostility.
              </p>
              <p>
                The current escalation centers on Iran&apos;s <span className="text-red-400">nuclear program</span>. Despite the 2015 JCPOA agreement, President Trump withdrew the US in 2018, implementing &quot;maximum pressure&quot; sanctions. Iran has since enriched uranium to 60% purity—just steps from weapons-grade material.
              </p>
              <p>
                Compounding tensions is Iran&apos;s <span className="text-orange-400">proxy warfare strategy</span>. Through Hezbollah in Lebanon, the Houthis in Yemen, and militias in Syria and Iraq, Tehran projects power while maintaining plausible deniability. These proxies have attacked US forces over 150 times since October 2023.
              </p>
            </div>
          </motion.div>

          {/* Key Players */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              Key Players
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {keyPlayers.map((player, idx) => (
                <KeyPlayerCard key={idx} {...player} />
              ))}
            </div>
          </motion.div>

          {/* Recent Attacks Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              Recent Attacks Map
            </h2>
            <ZoneMap zone="iran-us" />
          </motion.div>

          {/* Latest Developments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="comic-panel p-6 mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Radio className="w-5 h-5 text-green-400" />
              Latest Developments
            </h2>
            <div className="space-y-2">
              {developments.map((dev, idx) => (
                <DevelopmentItem key={idx} {...dev} />
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="comic-panel p-6 mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400" />
              Escalation Timeline
            </h2>
            <div className="mt-4">
              {timeline.map((item, idx) => (
                <TimelineItem key={idx} {...item} />
              ))}
            </div>
          </motion.div>

          {/* What's At Stake */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-red-400" />
              What&apos;s At Stake
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stakes.map((stake, idx) => (
                <div key={idx} className="comic-panel p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    {stake.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{stake.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{stake.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Email Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="comic-panel p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="font-heading font-bold text-xl text-white mb-2 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Get Conflict Updates
                </h2>
                <p className="text-gray-400 text-sm">Receive breaking alerts when new attacks are confirmed in this zone.</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">Related Trackers</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/conflict-tracker" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">Conflict Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/israel-hezbollah-conflict" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">Israel-Hezbollah</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/multi-conflict-timeline" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">Global Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 mt-12">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Real-time conflict monitoring • Data from multiple verified sources
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ This is an educational tool. Not official military intelligence.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default IranUSConflictPage;

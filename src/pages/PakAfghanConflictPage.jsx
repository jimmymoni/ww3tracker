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

  return (
    <div className="relative w-full h-64 bg-[#0a0f1c] rounded-xl overflow-hidden border border-white/10">
      {/* Simplified SVG Map - Pakistan-Afghanistan Border Region */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <pattern id="grid-afghan" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-afghan)" />
        
        {/* Afghanistan */}
        <path 
          d="M 80,40 L 280,30 L 320,100 L 280,200 L 180,220 L 100,180 Z" 
          fill="rgba(100,116,139,0.15)" 
          stroke="rgba(100,116,139,0.3)" 
          strokeWidth="1"
        />
        {/* Pakistan */}
        <path 
          d="M 180,220 L 280,200 L 340,250 L 280,290 L 120,280 L 100,180 Z" 
          fill="rgba(34,197,94,0.1)" 
          stroke="rgba(34,197,94,0.3)" 
          strokeWidth="1"
        />
        {/* Iran (West) */}
        <path 
          d="M 20,60 L 80,40 L 100,180 L 60,200 L 10,150 Z" 
          fill="rgba(100,116,139,0.05)" 
          stroke="rgba(100,116,139,0.15)" 
          strokeWidth="1"
        />

        {/* Durand Line - Disputed Border */}
        <line x1="100" y1="180" x2="280" y2="200" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3">
          <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
        </line>
        <text x="180" y="185" fill="#ef4444" fontSize="8" textAnchor="middle">Durand Line (Disputed)</text>

        {/* TTP Activity Zone */}
        <ellipse cx="180" cy="180" rx="50" ry="30" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" strokeDasharray="4,2" />

        {/* Key Markers */}
        {/* Kabul */}
        <g>
          <circle cx="200" cy="100" r="4" fill="#3b82f6" />
          <text x="200" y="90" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Kabul</text>
        </g>
        {/* Islamabad */}
        <g>
          <circle cx="220" cy="240" r="4" fill="#22c55e" />
          <text x="220" y="255" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Islamabad</text>
        </g>
        {/* Kandahar */}
        <g>
          <circle cx="150" cy="160" r="3" fill="#f97316">
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="150" y="175" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Kandahar</text>
        </g>
        {/* Peshawar */}
        <g>
          <circle cx="200" cy="210" r="3" fill="#eab308" />
          <text x="200" y="200" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Peshawar</text>
        </g>
        {/* Torkham Border */}
        <g>
          <circle cx="190" cy="200" r="3" fill="#ef4444" />
          <text x="210" y="200" fill="rgba(239,68,68,0.8)" fontSize="7">Torkham</text>
        </g>

        {/* Legend */}
        <g transform="translate(10, 10)">
          <circle cx="5" cy="5" r="3" fill="#ef4444" />
          <text x="12" y="8" fill="rgba(255,255,255,0.5)" fontSize="7">TTP Activity</text>
          <circle cx="5" cy="18" r="3" fill="#3b82f6" />
          <text x="12" y="21" fill="rgba(255,255,255,0.5)" fontSize="7">Afghanistan</text>
          <circle cx="5" cy="31" r="3" fill="#22c55e" />
          <text x="12" y="34" fill="rgba(255,255,255,0.5)" fontSize="7">Pakistan</text>
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
        <p className="text-xs text-gray-400">Active Conflict Zone</p>
        <p className="text-sm font-bold text-white">Durand Line Region</p>
      </div>
    </div>
  );
};

// Key Player Card Component
const KeyPlayerCard = ({ flag, name, role, objective, side }) => {
  const borderColor = side === 'pakistan' ? 'border-green-500/30' : side === 'afghanistan' ? 'border-blue-500/30' : side === 'ttp' ? 'border-red-500/30' : 'border-yellow-500/30';
  const bgColor = side === 'pakistan' ? 'bg-green-500/10' : side === 'afghanistan' ? 'bg-blue-500/10' : side === 'ttp' ? 'bg-red-500/10' : 'bg-yellow-500/10';
  
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
    border: 'bg-yellow-500/20 text-yellow-400'
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

const PakAfghanConflictPage = () => {
  useEffect(() => {
    document.title = "Pakistan-Afghanistan Conflict Zone | Border War Tracker 2026";
  }, []);

  // Quick Stats
  const stats = {
    attacks: 342,
    duration: 1825,
    casualties: 8921,
    status: 'ESCALATING'
  };

  // Key Players
  const keyPlayers = [
    { flag: '🇵🇰', name: 'Pakistan', role: 'Nation State', objective: 'Eliminate TTP safe havens, secure western border', side: 'pakistan' },
    { flag: '🇦🇫', name: 'Afghan Taliban', role: 'Ruling Regime', objective: 'Resist Pakistani pressure, maintain sovereignty', side: 'afghanistan' },
    { flag: '⚔️', name: 'TTP', role: 'Militant Group', objective: 'Overthrow Pakistan government, establish Islamic state', side: 'ttp' },
    { flag: '🇨🇳', name: 'China', role: 'Regional Power', objective: 'Protect CPEC investments, mediate stability', side: 'neutral' }
  ];

  // Timeline Data
  const timeline = [
    { date: 'Aug 2021', title: 'Taliban Return', description: 'US withdrawal; Taliban seize Kabul. TTP gains safe haven in Afghanistan.', severity: 'high' },
    { date: 'Nov 2022', title: 'TTP Resurgence', description: 'TTP ends ceasefire; attacks surge across Pakistan, especially in Khyber Pakhtunkhwa.', severity: 'high' },
    { date: 'Mar 2024', title: 'Border Clashes', description: 'Pakistani airstrikes target TTP camps in Afghan border regions; Taliban return fire.', severity: 'high' },
    { date: 'Dec 2024', title: 'Diplomatic Freeze', description: 'Afghanistan recalls ambassador; Pakistan threatens &quot;hot pursuit&quot; operations.', severity: 'medium' },
    { date: 'Mar 2026', title: 'Cross-Border Raid', description: 'Pakistani special forces conduct deep strike into Afghanistan targeting TTP leadership.', severity: 'high' }
  ];

  // Latest Developments
  const developments = [
    { time: '30m ago', source: 'Pakistan Army', content: 'Artillery exchange reported at Torkham border crossing; crossing temporarily closed', type: 'border' },
    { time: '2h ago', source: 'Regional Monitor', content: 'China hosts emergency talks between Pakistani and Taliban representatives', type: 'diplomatic' },
    { time: '5h ago', source: 'Local Sources', content: 'TTP claims responsibility for attack on military convoy in North Waziristan', type: 'military' },
    { time: '12h ago', source: 'Afghan Ministry', content: 'Taliban denies sheltering militants; accuses Pakistan of &quot;baseless aggression&quot;', type: 'diplomatic' }
  ];

  // What's at Stake
  const stakes = [
    { icon: <Shield className="w-5 h-5 text-green-400" />, title: 'Pakistan Border Security', description: 'TTP insurgency threatens Pakistan&apos;s stability and economic corridor' },
    { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'Afghan Sovereignty', description: 'Taliban legitimacy depends on resisting foreign military operations' },
    { icon: <TrendingUp className="w-5 h-5 text-red-400" />, title: 'China-Pakistan Corridor', description: '$60B CPEC investments at risk from regional instability' },
    { icon: <Users className="w-5 h-5 text-yellow-400" />, title: 'Humanitarian Crisis', description: 'Border communities face displacement and infrastructure destruction' }
  ];

  return (
    <>
      <SEO
        title="Pakistan-Afghanistan Conflict Zone | Border War Tracker 2026"
        description="Track the Pakistan-Afghanistan border conflict. Live updates on TTP insurgency, Taliban tensions, and Durand Line disputes."
        pathname="/pak-afghan-conflict"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/pak-afghan-conflict" />
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
              <span className="text-5xl">🇵🇰</span>
              <span className="text-2xl text-gray-500 font-heading">VS</span>
              <span className="text-5xl">🇦🇫</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Pakistan-Afghanistan Conflict Zone
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-full">
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
              <p className="text-xs text-gray-500">TTP Attacks (2024)</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">5+</p>
              <p className="text-xs text-gray-500">Years of TTP Insurgency</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <Users className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">{stats.casualties.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Total Casualties</p>
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
                The Pakistan-Afghanistan conflict centers on the <span className="text-yellow-400">Durand Line</span>, a 2,640km border drawn by British colonialists in 1893 that divides Pashtun tribal lands. Afghanistan has never recognized this boundary, claiming Pashtun regions of Pakistan as rightfully Afghan territory.
              </p>
              <p>
                The immediate crisis involves the <span className="text-red-400">Tehrik-e-Taliban Pakistan (TTP)</span>, an alliance of militant groups seeking to overthrow the Pakistani state. After the Afghan Taliban&apos;s 2021 return to power, TTP regrouped in Afghanistan and launched its most intense insurgency against Pakistan since 2014.
              </p>
              <p>
                Pakistan accuses the Taliban of providing <span className="text-orange-400">safe haven</span> to TTP fighters who cross the porous border to attack Pakistani military and civilian targets. The Taliban denies this, claiming they control their territory and seek only friendly relations—a claim Islamabad views as dishonest given the TTP&apos;s visible presence in eastern Afghanistan.
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
              Border Conflict Map
            </h2>
            <ZoneMap zone="pak-afghan" />
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
              <Link to="/iran-us-conflict" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">Iran-US Conflict</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/israel-hezbollah-conflict" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">Israel-Hezbollah</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/conflict-tracker" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">All Conflicts</span>
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

export default PakAfghanConflictPage;

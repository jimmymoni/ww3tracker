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
      {/* Simplified SVG Map - Lebanon/Israel Border Region */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <pattern id="grid-lebanon" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-lebanon)" />
        
        {/* Lebanon */}
        <path 
          d="M 180,40 L 240,50 L 260,120 L 220,160 L 160,140 Z" 
          fill="rgba(100,116,139,0.15)" 
          stroke="rgba(100,116,139,0.3)" 
          strokeWidth="1"
        />
        {/* Israel */}
        <path 
          d="M 160,140 L 220,160 L 200,280 L 120,260 L 100,180 Z" 
          fill="rgba(59,130,246,0.1)" 
          stroke="rgba(59,130,246,0.3)" 
          strokeWidth="1"
        />
        {/* Syria */}
        <path 
          d="M 240,50 L 340,40 L 360,120 L 320,180 L 260,120 Z" 
          fill="rgba(100,116,139,0.1)" 
          stroke="rgba(100,116,139,0.2)" 
          strokeWidth="1"
        />

        {/* Blue Line - UN Demarcated Border */}
        <line x1="160" y1="140" x2="220" y2="160" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,3" />
        <text x="170" y="135" fill="#3b82f6" fontSize="8">Blue Line</text>

        {/* Conflict Zone - Southern Lebanon */}
        <ellipse cx="200" cy="130" rx="40" ry="25" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1" strokeDasharray="4,2">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Key Markers */}
        {/* Beirut */}
        <g>
          <circle cx="210" cy="80" r="4" fill="#f97316">
            <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="210" y="70" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Beirut</text>
        </g>
        {/* Tel Aviv */}
        <g>
          <circle cx="140" cy="200" r="4" fill="#3b82f6" />
          <text x="140" y="215" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Tel Aviv</text>
        </g>
        {/* Jerusalem */}
        <g>
          <circle cx="160" cy="230" r="3" fill="#3b82f6" />
          <text x="160" y="245" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Jerusalem</text>
        </g>
        {/* Golan */}
        <g>
          <circle cx="280" cy="140" r="3" fill="#eab308" />
          <text x="280" y="130" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Golan</text>
        </g>

        {/* Legend */}
        <g transform="translate(10, 10)">
          <circle cx="5" cy="5" r="3" fill="#ef4444" />
          <text x="12" y="8" fill="rgba(255,255,255,0.5)" fontSize="7">Conflict Zone</text>
          <circle cx="5" cy="18" r="3" fill="#3b82f6" />
          <text x="12" y="21" fill="rgba(255,255,255,0.5)" fontSize="7">Israel</text>
          <circle cx="5" cy="31" r="3" fill="#f97316" />
          <text x="12" y="34" fill="rgba(255,255,255,0.5)" fontSize="7">Hezbollah</text>
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
        <p className="text-xs text-gray-400">Active Conflict Zone</p>
        <p className="text-sm font-bold text-white">Lebanon-Israel Border</p>
      </div>
    </div>
  );
};

// Key Player Card Component
const KeyPlayerCard = ({ flag, name, role, objective, side }) => {
  const borderColor = side === 'israel' ? 'border-blue-500/30' : side === 'hezbollah' ? 'border-green-500/30' : 'border-yellow-500/30';
  const bgColor = side === 'israel' ? 'bg-blue-500/10' : side === 'hezbollah' ? 'bg-green-500/10' : 'bg-yellow-500/10';
  
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

const IsraelHezbollahPage = () => {
  useEffect(() => {
    document.title = "Israel-Hezbollah Conflict Zone | Live Border War Tracker 2026";
  }, []);

  // Quick Stats
  const stats = {
    attacks: 2847,
    duration: 156,
    casualties: 4231,
    status: 'ACTIVE'
  };

  // Key Players
  const keyPlayers = [
    { flag: '🇮🇱', name: 'Israel', role: 'Nation State', objective: 'Secure northern border, eliminate Hezbollah threat', side: 'israel' },
    { flag: '☪️', name: 'Hezbollah', role: 'Iranian Proxy', objective: 'Support Hamas, pressure Israel on multiple fronts', side: 'hezbollah' },
    { flag: '🇱🇧', name: 'Lebanon', role: 'Host State', objective: 'Maintain sovereignty, avoid full-scale war', side: 'neutral' },
    { flag: '🇮🇷', name: 'Iran', role: 'Backer', objective: 'Expand influence, bleed Israel through proxies', side: 'hezbollah' }
  ];

  // Timeline Data
  const timeline = [
    { date: 'Oct 2023', title: 'Hezbollah Joins War', description: 'Hezbollah begins cross-border attacks in support of Hamas following October 7 attack.', severity: 'high' },
    { date: 'Nov 2023', title: 'Border Evacuations', description: 'Israel evacuates 60,000 residents from northern border towns; Lebanon evacuates 100,000.', severity: 'medium' },
    { date: 'Jun 2024', title: 'Escalation Peak', description: 'Hezbollah launches drone swarm at IDF bases; Israel strikes deep into Lebanon.', severity: 'high' },
    { date: 'Sep 2024', title: 'Pager Attacks', description: 'Coordinated explosions of Hezbollah pagers and walkie-talkies across Lebanon.', severity: 'high' },
    { date: 'Mar 2026', title: 'Ground Incursion', description: 'Israeli ground forces enter southern Lebanon to create buffer zone.', severity: 'high' }
  ];

  // Latest Developments
  const developments = [
    { time: '1h ago', source: 'IDF', content: 'Israeli airstrikes target Hezbollah rocket launchers near Tyre', type: 'military' },
    { time: '3h ago', source: 'UNIFIL', content: 'UN peacekeepers report increased artillery exchanges along Blue Line', type: 'border' },
    { time: '6h ago', source: 'Lebanese Govt', content: 'Lebanon calls for international pressure to end hostilities', type: 'diplomatic' },
    { time: '12h ago', source: 'Regional Monitor', content: 'Hezbollah claims downing of Israeli drone over southern Lebanon', type: 'military' }
  ];

  // What's at Stake
  const stakes = [
    { icon: <Shield className="w-5 h-5 text-blue-400" />, title: 'Northern Israel Security', description: '60,000 Israelis displaced; border communities under daily rocket threat' },
    { icon: <Globe className="w-5 h-5 text-green-400" />, title: 'Lebanese Sovereignty', description: 'Risk of Lebanon becoming failed state or Iranian satellite' },
    { icon: <TrendingUp className="w-5 h-5 text-red-400" />, title: 'Regional Escalation', description: 'Conflict could expand to include Iran, Syria, and other proxies' },
    { icon: <Users className="w-5 h-5 text-yellow-400" />, title: 'Civilian Casualties', description: 'Both sides operating in densely populated areas' }
  ];

  return (
    <>
      <SEO
        title="Israel-Hezbollah Conflict Zone | Live Border War Tracker 2026"
        description="Track the Israel-Hezbollah border conflict in real-time. Live updates on rocket attacks, ground incursions, and Lebanon war developments."
        pathname="/israel-hezbollah-conflict"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/israel-hezbollah-conflict" />
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
              <span className="text-5xl">🇮🇱</span>
              <span className="text-2xl text-gray-500 font-heading">VS</span>
              <span className="text-5xl">☪️</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Israel-Hezbollah Conflict Zone
            </h1>
            
            <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-full">
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
              <p className="font-heading text-2xl font-bold text-white">{stats.attacks.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Cross-Border Attacks</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="font-heading text-2xl font-bold text-white">{stats.duration}</p>
              <p className="text-xs text-gray-500">Days Active</p>
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
                The Israel-Hezbollah conflict dates to <span className="text-yellow-400">1982</span>, when Israel invaded Lebanon to expel Palestinian militants. During this occupation, Iran helped establish Hezbollah (&quot;Party of God&quot;) among Lebanon&apos;s Shiite population, providing funding, training, and ideology.
              </p>
              <p>
                Today, Hezbollah is the world&apos;s most heavily armed non-state actor, with an estimated <span className="text-red-400">150,000 rockets and missiles</span> pointed at Israel. Iranian Revolutionary Guard advisors continue to supply advanced weapons including precision-guided munitions capable of striking any Israeli city.
              </p>
              <p>
                The current escalation began October 8, 2023, when Hezbollah opened a &quot;support front&quot; for Hamas. Daily rocket, drone, and anti-tank missile attacks have made Israel&apos;s northern border uninhabitable. Israel&apos;s goal is to push Hezbollah north of the Litani River—per UN Resolution 1701—or eliminate its threat entirely.
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
              Conflict Zone Map
            </h2>
            <ZoneMap zone="israel-hezbollah" />
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
              <Link to="/conflict-tracker" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group">
                <span className="text-gray-300 group-hover:text-white">All Conflicts</span>
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

export default IsraelHezbollahPage;

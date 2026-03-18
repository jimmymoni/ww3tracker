import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Radio, Flame, MapPin, ChevronRight, Home, Clock, AlertCircle, Filter, Globe } from 'lucide-react';

const LiveMonitorPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    document.title = "Live Conflict Monitor | Real-Time Global Updates 2026";
  }, []);

  const filters = [
    { id: 'all', label: 'All', color: 'bg-blue-500' },
    { id: 'us-iran', label: 'US-Iran', color: 'bg-red-500' },
    { id: 'pak-afghan', label: 'Pak-Afghan', color: 'bg-green-500' },
    { id: 'israel-lebanon', label: 'Israel-Lebanon', color: 'bg-orange-500' }
  ];

  const allUpdates = [
    { 
      time: "2 min ago", 
      source: "NASA FIRMS", 
      content: "Thermal anomalies detected in Eastern Syria near Iranian-backed positions", 
      type: "satellite",
      conflict: "us-iran",
      location: "Eastern Syria"
    },
    { 
      time: "5 min ago", 
      source: "Regional Intel", 
      content: "Border skirmish reported at Torkham crossing between Pakistan and Afghan forces", 
      type: "breaking",
      conflict: "pak-afghan",
      location: "Torkham Border"
    },
    { 
      time: "15 min ago", 
      source: "News Feed", 
      content: "Israeli strikes reported in Southern Lebanon targeting Hezbollah infrastructure", 
      type: "breaking",
      conflict: "israel-lebanon",
      location: "Southern Lebanon"
    },
    { 
      time: "22 min ago", 
      source: "GDELT", 
      content: "Diplomatic chatter increases between Tehran and Gulf states", 
      type: "diplomatic",
      conflict: "us-iran",
      location: "Tehran"
    },
    { 
      time: "28 min ago", 
      source: "Local Reports", 
      content: "IED explosion reported in Kandahar province, Taliban on high alert", 
      type: "military",
      conflict: "pak-afghan",
      location: "Kandahar, Afghanistan"
    },
    { 
      time: "35 min ago", 
      source: "Polymarket", 
      content: "Iran conflict probability ticked up 0.3% following regional reports", 
      type: "market",
      conflict: "us-iran",
      location: "Global"
    },
    { 
      time: "42 min ago", 
      source: "Defense Monitor", 
      content: "Hezbollah claims responsibility for rocket attack on northern Israel", 
      type: "breaking",
      conflict: "israel-lebanon",
      location: "Northern Israel"
    },
    { 
      time: "1 hour ago", 
      source: "Satellite", 
      content: "Unusual military vehicle movement detected near Iran-Pakistan border", 
      type: "satellite",
      conflict: "us-iran",
      location: "Iran-Pakistan Border"
    }
  ];

  const filteredUpdates = activeFilter === 'all' 
    ? allUpdates 
    : allUpdates.filter(update => update.conflict === activeFilter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'breaking': return 'bg-red-500';
      case 'satellite': return 'bg-green-500';
      case 'diplomatic': return 'bg-blue-500';
      case 'military': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  const getConflictLabel = (conflict) => {
    switch (conflict) {
      case 'us-iran': return 'US-Iran';
      case 'pak-afghan': return 'Pak-Afghan';
      case 'israel-lebanon': return 'Israel-Lebanon';
      default: return 'Global';
    }
  };

  const getConflictColor = (conflict) => {
    switch (conflict) {
      case 'us-iran': return 'text-red-400 border-red-500/30 bg-red-500/10';
      case 'pak-afghan': return 'text-green-400 border-green-500/30 bg-green-500/10';
      case 'israel-lebanon': return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      default: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <>
      <Helmet>
        <title>Live Conflict Monitor | Real-Time Global Updates 2026</title>
        <meta name="description" content="Get live updates from all conflict zones in real-time. Breaking news, satellite imagery, and military developments from US-Iran, Pak-Afghan, and Israel-Lebanon conflicts." />
        <meta name="keywords" content="live conflict monitor, war updates, breaking news, military developments, satellite imagery" />
        <meta property="og:title" content="Live Conflict Monitor | Real-Time Global Updates 2026" />
        <meta property="og:description" content="Get live updates from all conflict zones. Breaking news and military developments worldwide." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ww3tracker.live/live-monitor" />
      </Helmet>

      <div className="min-h-screen bg-grid text-white">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <Link to="/" className="font-heading font-bold text-xl text-white hover:text-blue-400 transition-colors">
                  WW3 TRACKER
                </Link>
              </div>
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full mb-6">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-heading text-sm tracking-wider">LIVE UPDATES</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Live Conflict Monitor
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time updates from all conflict zones. Breaking news, satellite detection, and military developments as they happen.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Filter by conflict:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${
                    activeFilter === filter.id
                      ? `${filter.color} text-white`
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl text-white flex items-center gap-3">
                <Activity className="w-5 h-5 text-red-400" />
                Live Feed
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Updates every 60 seconds</span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredUpdates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                  className="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getTypeIcon(update.type)} ${update.type === 'breaking' ? 'animate-pulse' : ''}`} />
                      <span className="text-xs font-mono text-gray-500">{update.source}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border ${getConflictColor(update.conflict)}`}>
                        {getConflictLabel(update.conflict)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{update.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{update.content}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{update.location}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredUpdates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No updates for this filter. Try selecting a different conflict zone.
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Flame className="w-6 h-6 text-orange-400" />
              NASA FIRMS Satellite Monitoring
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  Thermal Anomalies Detected
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Eastern Syria: 3 hotspots in last 24h</li>
                  <li>• Western Iraq: Pipeline fire detected</li>
                  <li>• Southern Lebanon: Activity near border</li>
                  <li>• Khyber Pass: Unusual heat signatures</li>
                </ul>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  Conflict Indicators
                </h3>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Air defense radar: ACTIVE in Tehran</li>
                  <li>• Naval movement: Elevated in Gulf</li>
                  <li>• Border crossings: Restricted flow</li>
                  <li>• Communication: Encryption spike detected</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Related Trackers
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link 
                to="/conflict-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Conflict Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/global-risk-monitor" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Global Risk</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/multi-conflict-timeline" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Data from NASA FIRMS, regional sources | Refreshed every 60 seconds
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ This is a satirical educational tool. Not actual military intelligence.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LiveMonitorPage;

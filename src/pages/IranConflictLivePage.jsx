import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Radio, Flame, MapPin, ChevronRight, Home, Clock, AlertCircle } from 'lucide-react';

const IranConflictLivePage = () => {
  useEffect(() => {
    document.title = "Iran Conflict Live | Real-Time Iran War Updates 2026";
  }, []);

  // Simulated live updates
  const liveUpdates = [
    { time: "2 min ago", source: "NASA FIRMS", content: "Thermal anomalies detected in Eastern Syria near Iranian-backed positions", type: "satellite" },
    { time: "15 min ago", source: "News Feed", content: "Israeli strikes reported in Southern Lebanon targeting Hezbollah infrastructure", type: "breaking" },
    { time: "32 min ago", source: "GDELT", content: "Diplomatic chatter increases between Tehran and Gulf states", type: "diplomatic" },
    { time: "1 hour ago", source: "Polymarket", content: "Iran conflict probability ticked up 0.3% following regional reports", type: "market" },
  ];

  return (
    <>
      <Helmet>
        <title>Iran Conflict Live | Real-Time Iran War Updates 2026</title>
        <meta name="description" content="Get live Iran conflict updates in real-time. Breaking news, satellite imagery, and military developments from the Iran war zone. Updated every minute." />
        <meta name="keywords" content="Iran conflict live, Iran war updates, live Iran news, Iran military action, Tehran news live" />
        <meta property="og:title" content="Iran Conflict Live | Real-Time Iran War Updates 2026" />
        <meta property="og:description" content="Get live Iran conflict updates. Breaking news, satellite imagery, and military developments from the Iran war zone." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ww3tracker.live/iran-conflict-live" />
      </Helmet>

      <div className="min-h-screen bg-grid text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center text-xl">
                  <span>🦅</span>
                  <span className="text-gray-600 mx-1">vs</span>
                  <span>☠️</span>
                </div>
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
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full mb-6">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-heading text-sm tracking-wider">LIVE UPDATES</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Iran Conflict Live
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time updates from the Iran conflict zone. Breaking news, satellite detection, and military developments as they happen.
            </p>
          </motion.div>

          {/* Live Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-6 mb-12"
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
              {liveUpdates.map((update, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1) }}
                  className="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        update.type === 'breaking' ? 'bg-red-500 animate-pulse' :
                        update.type === 'satellite' ? 'bg-green-500' :
                        update.type === 'diplomatic' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="text-xs font-mono text-gray-500">{update.source}</span>
                    </div>
                    <span className="text-xs text-gray-600">{update.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{update.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Satellite Monitoring */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-8 mb-12"
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
                  <li>• Persian Gulf: Normal shipping patterns</li>
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

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              About Iran Conflict Live Updates
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Iran Conflict Live provides real-time updates on military activities, diplomatic movements, and breaking news from the Iran conflict zone. Our monitoring systems scan thousands of data sources including satellite imagery, news feeds, and social media signals.
              </p>
              <p>
                The tracker focuses on developments between Iran and its adversaries including the United States, Israel, and regional rivals. Key areas of monitoring include proxy militia activities in Syria, Lebanon, Yemen, and Iraq, as well as Iran's nuclear program developments.
              </p>
              <p>
                NASA's FIRMS (Fire Information for Resource Management System) provides satellite-based thermal anomaly detection, helping identify fires, explosions, and other heat signatures that may indicate military activity.
              </p>
            </div>
          </motion.div>

          {/* Related Links */}
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
                to="/ww3-probability" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">WW3 Probability</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/us-iran-war-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">US vs Iran War</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/timeline" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Conflict Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Data from NASA FIRMS, GDELT, News APIs | Refreshed every 60 seconds
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

export default IranConflictLivePage;

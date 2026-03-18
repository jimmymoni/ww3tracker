import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Globe, Target, ChevronRight, Home, Crosshair, Users, BookOpen, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { BreadcrumbSchema, FAQSchema } from '../components/StructuredData';

const ConflictTrackerPage = () => {
  useEffect(() => {
    document.title = "Regional Conflict Tracker | Global Security Monitor 2026";
  }, []);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Conflict Tracker", url: "/conflict-tracker" }
  ];

  const faqs = [
    {
      question: "What conflicts are currently being tracked?",
      answer: "We monitor major active conflicts including US-Iran tensions, Pakistan-Afghanistan border disputes, Israel-Lebanon hostilities, and other regional flashpoints affecting global security."
    },
    {
      question: "How are conflict zones determined?",
      answer: "Conflict zones are identified through verified reports from multiple sources including satellite data, ground reporting, and official statements from involved parties."
    },
    {
      question: "What is the difference between a proxy war and direct conflict?",
      answer: "Direct conflict involves nations engaging their own military forces against each other. Proxy wars occur when nations support opposing sides in a conflict without directly engaging each other's forces."
    }
  ];

  const conflictZones = [
    {
      id: 'us-iran',
      name: 'US-Iran Theater',
      region: 'Middle East',
      status: 'active',
      riskLevel: 'high',
      description: 'Nuclear program tensions, proxy conflicts in Syria and Yemen, Strait of Hormuz flashpoints.',
      actors: ['United States', 'Iran', 'Israel', 'Saudi Arabia'],
      recentEvents: 12
    },
    {
      id: 'pak-afghan',
      name: 'Pakistan-Afghanistan Border',
      region: 'South Asia',
      status: 'active',
      riskLevel: 'elevated',
      description: 'Border clashes, militant activity, refugee crisis, Taliban-Pakistan tensions.',
      actors: ['Pakistan', 'Afghanistan', 'TTP', 'ISIS-K'],
      recentEvents: 8
    },
    {
      id: 'israel-lebanon',
      name: 'Israel-Lebanon Front',
      region: 'Levant',
      status: 'active',
      riskLevel: 'high',
      description: 'Hezbollah rocket attacks, Israeli airstrikes, civilian displacement.',
      actors: ['Israel', 'Hezbollah', 'Lebanon', 'Iran'],
      recentEvents: 15
    }
  ];

  const keyPlayers = [
    {
      name: 'United States',
      role: 'Global Power',
      interests: ['Nuclear non-proliferation', 'Regional stability', 'Israeli security'],
      involvement: 'Direct military presence, sanctions enforcement, diplomatic leadership'
    },
    {
      name: 'Iran',
      role: 'Regional Power',
      interests: ['Nuclear program', 'Regional influence', 'Sanctions relief'],
      involvement: 'Proxy networks, direct threats, asymmetric warfare capabilities'
    },
    {
      name: 'Russia',
      role: 'External Actor',
      interests: ['Counter US influence', 'Mediterranean access', 'Arms sales'],
      involvement: 'Diplomatic support, military cooperation, economic ties'
    },
    {
      name: 'China',
      role: 'Economic Power',
      interests: ['Energy security', 'Belt and Road Initiative', 'US containment'],
      involvement: 'Oil imports, economic partnerships, diplomatic positioning'
    }
  ];

  const rootCauses = [
    {
      title: 'Resource Competition',
      description: 'Control over oil, gas, and strategic waterways drives many regional conflicts.',
      icon: Target
    },
    {
      title: 'Ideological Divide',
      description: 'Religious and political differences fuel proxy conflicts and recruitment.',
      icon: AlertCircle
    },
    {
      title: 'Colonial Legacy',
      description: 'Arbitrary borders and historical grievances create lasting instability.',
      icon: BookOpen
    },
    {
      title: 'Power Vacuum',
      description: 'Failed states and weak governance enable militant group expansion.',
      icon: Shield
    }
  ];

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'elevated': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <>
      <SEO
        title="Regional Conflict Tracker | Global Security Monitor 2026"
        description="Track active conflicts worldwide. Real-time monitoring of US-Iran tensions, Pakistan-Afghanistan border disputes, Israel-Lebanon hostilities, and regional security threats."
        pathname="/conflict-tracker"
        ogImage="/og-image.png"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/conflict-tracker" />
      </Helmet>
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />

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
          <nav className="py-4 text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>/</li>
              <li className="text-white">Conflict Tracker</li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
              <Globe className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">GLOBAL MONITOR</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Regional Conflict Tracker
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Monitor active conflicts and security threats worldwide. Real-time tracking of military activities, diplomatic movements, and regional stability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Crosshair className="w-6 h-6 text-red-400" />
              Active Conflict Zones
            </h2>
            
            <div className="space-y-4">
              {conflictZones.map((zone) => (
                <Link 
                  key={zone.id}
                  to={`/conflict/${zone.id}`}
                  className="block bg-white/5 p-4 rounded-lg border-l-4 border-red-500 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{zone.name}</h3>
                      <p className="text-sm text-gray-400">{zone.region}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${getRiskColor(zone.riskLevel)}`}>
                      {zone.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{zone.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500">
                      <Users className="w-3 h-3 inline mr-1" />
                      {zone.actors.length} actors
                    </span>
                    <span className="text-gray-500">
                      {zone.recentEvents} recent events
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-yellow-400" />
              Why Conflicts Happen
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {rootCauses.map((cause, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <cause.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">{cause.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{cause.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                to="/why-conflicts-happen"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Learn more about root causes</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              Key Players
            </h2>
            
            <div className="space-y-4">
              {keyPlayers.map((player, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white">{player.name}</h3>
                      <span className="text-xs text-purple-400">{player.role}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{player.involvement}</p>
                  <div className="flex flex-wrap gap-2">
                    {player.interests.map((interest, i) => (
                      <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 pb-6 last:border-0">
                  <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Related Trackers
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link 
                to="/global-risk-monitor" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Global Risk Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/live-monitor" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Live Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/multi-conflict-timeline" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Conflict Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Real-time data from multiple intelligence sources | Updated continuously
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

export default ConflictTrackerPage;

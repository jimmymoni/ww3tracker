import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Swords, Globe, Target, ChevronRight, Home, Crosshair } from 'lucide-react';
import SEO from '../components/SEO';
import { BreadcrumbSchema, FAQSchema } from '../components/StructuredData';

const UsIranWarTrackerPage = () => {
  useEffect(() => {
    document.title = "US vs Iran War Tracker | Live Conflict Monitor 2026";
  }, []);

  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "US vs Iran War Tracker", url: "/us-iran-war-tracker" }
  ];

  // FAQ data for rich snippets
  const faqs = [
    {
      question: "Why is the US fighting Iran?",
      answer: "The US-Iran conflict stems from decades of tensions dating back to the 1979 Iranian Revolution and hostage crisis. Current conflict escalated in February 2026 over Iran's nuclear program and regional proxy activities."
    },
    {
      question: "Who would win in a war between US and Iran?",
      answer: "In conventional warfare, the US has overwhelming military superiority with an $886B budget vs Iran's $25B. However, Iran's geographic advantages, proxy networks, and asymmetric warfare capabilities make occupation extremely difficult."
    },
    {
      question: "Is the US at war with Iran right now?",
      answer: "As of March 2026, active military conflict exists between US-backed forces and Iran. Israel, supported by the US, has launched strikes on Iranian nuclear facilities, and Iran has retaliated with missile attacks."
    },
    {
      question: "What is Iran's military strength?",
      answer: "Iran's military includes 580,000 active personnel, 3,000+ ballistic missiles, and extensive proxy forces (Hezbollah, Houthis, Iraqi militias) totaling 200,000+ fighters. Their strength lies in asymmetric warfare and the ability to close the Strait of Hormuz."
    }
  ];

  return (
    <>
      <SEO
        title="US vs Iran War Tracker | Live Conflict Monitor 2026"
        description="Track the US vs Iran conflict in real-time. Live war tracker showing military positions, sanctions impact, and escalation risks between USA and Iran."
        pathname="/us-iran-war-tracker"
        ogImage="/og-image.png"
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />

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
          {/* Breadcrumbs */}
          <nav className="py-4 text-sm text-gray-500">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li>/</li>
              <li className="text-white">US vs Iran War Tracker</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
              <Swords className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">ACTIVE CONFLICT</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              US vs Iran War Tracker
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Live monitoring of tensions between the United States and Iran. Track military movements, sanctions, and proxy conflicts in real-time.
            </p>
          </motion.div>

          {/* Fighter Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="comic-panel p-6 border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🇺🇸</div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">United States</h2>
                  <p className="text-blue-400 text-sm">NATO Alliance Leader</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Military Strength</span>
                  <span className="text-white font-mono">75/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sanctions Imposed</span>
                  <span className="text-yellow-400 font-mono">MAXIMUM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Regional Bases</span>
                  <span className="text-white font-mono">Active</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="comic-panel p-6 border-l-4 border-red-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">🇮🇷</div>
                <div>
                  <h2 className="font-heading font-bold text-xl text-white">Iran</h2>
                  <p className="text-red-400 text-sm">Islamic Republic</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Military Strength</span>
                  <span className="text-white font-mono">60/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Proxy Networks</span>
                  <span className="text-red-400 font-mono">ACTIVE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Nuclear Program</span>
                  <span className="text-yellow-400 font-mono">Advanced</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Conflict Zones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Crosshair className="w-6 h-6 text-red-400" />
              Active Conflict Zones
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">Strait of Hormuz</h3>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">HIGH RISK</span>
                </div>
                <p className="text-sm text-gray-400">
                  Critical oil shipping lane. Iranian naval activity and US patrol presence create flashpoint potential.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">Iraq & Syria</h3>
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">PROXY ACTIVE</span>
                </div>
                <p className="text-sm text-gray-400">
                  Iranian-backed militias conduct attacks on US bases. Retaliatory strikes ongoing.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">Eastern Mediterranean</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">MONITORING</span>
                </div>
                <p className="text-sm text-gray-400">
                  US carrier groups positioned for rapid response. Hezbollah tensions spillover risk.
                </p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section - Critical for SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
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

          {/* Latest Developments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Latest Developments
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The US vs Iran conflict tracker monitors the ongoing tensions that have defined Middle East geopolitics for decades. From the 1979 revolution to current proxy wars, this relationship remains one of the world's most volatile.
              </p>
              <p>
                Current flashpoints include Iran's advancing nuclear program, regional proxy militias targeting US interests, and the ever-present risk of miscalculation in the Persian Gulf. Sanctions continue to squeeze the Iranian economy while proxy forces test American resolve across the region.
              </p>
            </div>
          </motion.div>

          {/* Related Links */}
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
                to="/ww3-probability" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">WW3 Probability</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/iran-conflict-live" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Iran Conflict Live</span>
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

export default UsIranWarTrackerPage;

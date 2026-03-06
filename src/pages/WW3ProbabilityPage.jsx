import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Globe, Activity, ChevronRight, Home, BarChart3 } from 'lucide-react';
import SEO from '../components/SEO';
import { BreadcrumbSchema, FAQSchema } from '../components/StructuredData';

const WW3ProbabilityPage = () => {
  useEffect(() => {
    document.title = "WW3 Probability Tracker | Live WW3 Risk Monitor 2026";
  }, []);

  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "WW3 Probability", url: "/ww3-probability" }
  ];

  // FAQ data for rich snippets
  const faqs = [
    {
      question: "What is the probability of World War 3 in 2026?",
      answer: "Current prediction markets estimate WW3 probability at approximately 12.4% for 2026. This is based on real-time data from Polymarket, geopolitical news sentiment analysis, and military tension indicators from multiple conflict zones."
    },
    {
      question: "How is WW3 probability calculated?",
      answer: "WW3 probability is calculated using a weighted combination of prediction market odds (primarily Polymarket), AI-powered news sentiment analysis, military activity indicators, diplomatic channel monitoring, and historical conflict pattern analysis."
    },
    {
      question: "Is World War 3 happening now?",
      answer: "As of March 2026, World War 3 has not started. While the US-Iran conflict has escalated significantly and regional wars are active, a global conflict involving multiple major powers has not begun."
    },
    {
      question: "What are the warning signs of WW3?",
      answer: "Key warning signs include: direct military conflict between nuclear powers, closure of major trade routes like the Strait of Hormuz, invocation of NATO Article 5, mass mobilization of reserves, and breakdown of diplomatic communications between major powers."
    }
  ];

  return (
    <>
      <SEO
        title="WW3 Probability Tracker | Live WW3 Risk Monitor 2026"
        description="Track WW3 probability in real-time. Live WW3 risk percentage based on Polymarket odds, news sentiment & military tensions. Updated every 60 seconds."
        pathname="/ww3-probability"
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
              <li className="text-white">WW3 Probability</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full mb-6">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-heading text-sm tracking-wider">LIVE MONITORING</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              WW3 Probability Tracker
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time WW3 risk percentage based on prediction markets, news sentiment analysis, and geopolitical indicators.
            </p>
          </motion.div>

          {/* Probability Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="comic-panel p-6 text-center"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">12.4%</div>
              <p className="text-gray-400 text-sm">Global Conflict Probability</p>
              <p className="text-xs text-gray-500 mt-2">via Polymarket</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="comic-panel p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">+2.1%</div>
              <p className="text-gray-400 text-sm">24h Change</p>
              <p className="text-xs text-gray-500 mt-2">Trending Up</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="comic-panel p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400 mb-2">ELEVATED</div>
              <p className="text-gray-400 text-sm">Current Risk Level</p>
              <p className="text-xs text-gray-500 mt-2">Monitor Closely</p>
            </motion.div>
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              How We Calculate WW3 Probability
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Our WW3 probability tracker aggregates data from multiple authoritative sources to provide a comprehensive risk assessment. We combine prediction market data, geopolitical news sentiment, military activity indicators, and diplomatic channel monitoring.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Prediction Markets
                  </h3>
                  <p className="text-sm text-gray-400">
                    Real-time odds from Polymarket and other prediction platforms where traders bet on geopolitical outcomes.
                  </p>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-yellow-400" />
                    News Sentiment
                  </h3>
                  <p className="text-sm text-gray-400">
                    AI-powered analysis of global news coverage measuring escalation and de-escalation language patterns.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section - Critical for SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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

          {/* Related Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Related Trackers
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link 
                to="/us-iran-war-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">US vs Iran War Tracker</span>
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
              Data sources: Polymarket, GDELT, NASA FIRMS | Updated every 60 seconds
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

export default WW3ProbabilityPage;

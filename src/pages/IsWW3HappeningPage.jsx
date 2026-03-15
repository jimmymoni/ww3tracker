import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Globe, Activity, Calendar, ArrowRight, CheckCircle, XCircle, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { FAQSchema, BreadcrumbSchema, ClaimReviewSchema } from '../components/StructuredData';

const IsWW3HappeningPage = () => {
  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Is WW3 Happening", url: "/is-ww3-happening" }
  ];

  // FAQ data for rich snippets - optimized for voice search
  const faqs = [
    {
      question: "Is World War 3 happening right now?",
      answer: "As of March 2026, World War 3 has not started. While the US-Iran conflict has escalated into direct military action, it remains a regional conflict. WW3 would require direct military engagement between multiple major world powers (US, Russia, China, NATO) simultaneously."
    },
    {
      question: "How close are we to WW3?",
      answer: "Current prediction markets estimate a 12.4% probability of WW3 in 2026. This is elevated compared to peaceful periods (1-3%) but lower than the Cuban Missile Crisis (40-50%). The US-Iran war increases risk, but global conflict is not inevitable."
    },
    {
      question: "What would count as WW3 starting?",
      answer: "World War 3 would officially be considered started if: (1) Multiple major powers engage in direct military conflict, (2) NATO invokes Article 5 for collective defense, (3) Nuclear weapons are used between nations, or (4) A global military alliance system activates across multiple continents."
    },
    {
      question: "Are we in WW3 now in 2026?",
      answer: "No, we are not in WW3 as of March 2026. The current conflict is a regional war between the US, Israel, and Iran. While dangerous and potentially escalating, it has not yet drawn in Russia, China, or NATO in direct military engagement."
    },
    {
      question: "What are the chances of WW3 happening?",
      answer: "Based on prediction markets, expert analysis, and geopolitical indicators, the probability of WW3 in 2026 is approximately 12.4%. This is concerning but means an 87.6% chance it will NOT happen."
    }
  ];

  // Current status indicators
  const statusIndicators = [
    {
      label: "Direct US-Iran Conflict",
      status: "active",
      description: "Active military engagement since February 2026"
    },
    {
      label: "NATO Article 5 Invoked",
      status: "inactive",
      description: "No collective defense activation"
    },
    {
      label: "Russia Direct Involvement",
      status: "partial",
      description: "Weapons and intelligence support only"
    },
    {
      label: "China Military Engagement",
      status: "inactive",
      description: "No direct military participation"
    },
    {
      label: "Nuclear Weapons Used",
      status: "inactive",
      description: "No nuclear deployment"
    },
    {
      label: "Global Alliance War",
      status: "inactive",
      description: "Regional conflict only"
    }
  ];

  return (
    <>
      <SEO
        title="Is WW3 Happening Right Now? | Live Status 2026"
        description="Is World War 3 happening? Current status: NO. Track real-time WW3 probability, warning signs, and what would trigger global conflict. Updated March 2026."
        pathname="/is-ww3-happening"
        ogImage="/og-image.png"
      />
      
      {/* Canonical URL for this page */}
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/is-ww3-happening" />
      </Helmet>
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />
      <ClaimReviewSchema 
        claim="Is WW3 happening now?"
        reviewRating={{ value: "12.4", best: "100", worst: "0", label: "Unlikely" }}
      />

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
                <span>Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="py-4 text-sm text-gray-500">
            <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link to="/" itemProp="item" className="hover:text-white">
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" className="text-white">Is WW3 Happening</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* Hero Section - Direct Answer for AEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-green-600/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-full mb-6">
              <CheckCircle className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">LIVE STATUS CHECK</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
              Is WW3 Happening?
            </h1>
            
            {/* Direct Answer Box - Critical for Featured Snippets */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 mb-8">
              <div className="text-6xl md:text-8xl font-bold text-green-400 mb-4">NO</div>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                World War 3 has not started as of March 2026
              </p>
              <p className="text-gray-400 max-w-2xl mx-auto">
                While the US-Iran conflict is active, it remains a regional war. 
                WW3 would require direct military engagement between multiple major powers.
              </p>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last updated: March 6, 2026</span>
              <span className="mx-2">•</span>
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Monitoring Active</span>
            </div>
          </motion.div>

          {/* WW3 Probability Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-400" />
              Current WW3 Probability
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-4xl font-bold text-blue-400 mb-2">12.4%</div>
                <p className="text-gray-400 text-sm">WW3 Probability</p>
                <p className="text-xs text-gray-500 mt-1">via Polymarket</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-4xl font-bold text-yellow-400 mb-2">ELEVATED</div>
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-xs text-gray-500 mt-1">Above normal (1-3%)</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-xl">
                <div className="text-4xl font-bold text-green-400 mb-2">87.6%</div>
                <p className="text-gray-400 text-sm">Chance of NO WW3</p>
                <p className="text-xs text-gray-500 mt-1">Stay informed, don't panic</p>
              </div>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              WW3 Trigger Indicators
            </h2>
            
            <div className="space-y-4">
              {statusIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {indicator.status === 'active' && (
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {indicator.status === 'partial' && (
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    )}
                    {indicator.status === 'inactive' && (
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    )}
                    <div>
                      <p className="text-white font-medium">{indicator.label}</p>
                      <p className="text-sm text-gray-500">{indicator.description}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    indicator.status === 'active' ? 'bg-red-500/20 text-red-400' :
                    indicator.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {indicator.status === 'active' ? 'ACTIVE' :
                     indicator.status === 'partial' ? 'PARTIAL' : 'NOT ACTIVE'}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What Would Trigger WW3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              What Would Trigger WW3?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">Red Line Events</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Russia directly attacks US military forces</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">China enters the Iran conflict militarily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">NATO invokes Article 5 (collective defense)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">Nuclear weapons used in combat</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Current Status</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">No direct Russia-US military engagement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">China remains on sidelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">NATO not activated</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">No nuclear weapons used</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section - Critical for SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-8"
            id="faq"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-white/10 pb-6 last:border-0">
                  <h3 className="font-bold text-white mb-2 text-lg">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
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
            <div className="grid sm:grid-cols-2 gap-4">
              <Link 
                to="/ww3-probability" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">WW3 Probability Tracker</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/us-iran-war-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">US-Iran War Status</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/blog/what-happens-next" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">What Happens Next?</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/world-war-3-news" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">World War 3 News</span>
                <ArrowRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Data sources: Polymarket, GDELT, Expert Analysis | Updated every hour
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ This is an educational tracker. Not official military intelligence.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default IsWW3HappeningPage;

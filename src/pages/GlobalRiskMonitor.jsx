import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Globe, Activity, ChevronRight, Home, BarChart3, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import { BreadcrumbSchema, FAQSchema } from '../components/StructuredData';

const GlobalRiskMonitor = () => {
  useEffect(() => {
    document.title = "Global Risk Monitor | Multi-Conflict Dashboard 2026";
  }, []);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Global Risk Monitor", url: "/global-risk-monitor" }
  ];

  const faqs = [
    {
      question: "What is the Global Risk Monitor?",
      answer: "The Global Risk Monitor tracks escalation risks across multiple active conflict zones, providing a combined regional stability index and individual risk assessments for each conflict."
    },
    {
      question: "How is the Regional Stability Index calculated?",
      answer: "The index combines prediction market data, military activity indicators, diplomatic channel status, and economic impact assessments from all tracked conflicts into a single 0-100 scale."
    },
    {
      question: "Which conflicts are monitored?",
      answer: "We currently monitor US-Iran tensions, Pakistan-Afghanistan border disputes, Israel-Lebanon hostilities, and other emerging regional flashpoints."
    }
  ];

  const conflictRisks = [
    {
      id: 'us-iran',
      name: 'US-Iran Theater',
      riskScore: 78,
      riskLevel: 'Critical',
      trend: 'up',
      indicators: ['Nuclear program advances', 'Proxy attacks increasing', 'Sanctions tightening'],
      lastUpdated: '2 min ago'
    },
    {
      id: 'pak-afghan',
      name: 'Pak-Afghan Border',
      riskScore: 62,
      riskLevel: 'High',
      trend: 'stable',
      indicators: ['Border skirmishes ongoing', 'Refugee flows', 'Militant activity'],
      lastUpdated: '15 min ago'
    },
    {
      id: 'israel-lebanon',
      name: 'Israel-Lebanon Front',
      riskScore: 71,
      riskLevel: 'High',
      trend: 'up',
      indicators: ['Daily rocket exchanges', 'Civilian displacement', 'Regional escalation risk'],
      lastUpdated: '5 min ago'
    }
  ];

  const stabilityIndex = 42;
  const globalRiskLevel = stabilityIndex < 30 ? 'Critical' : stabilityIndex < 50 ? 'High' : stabilityIndex < 70 ? 'Elevated' : 'Moderate';

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBg = (score) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <>
      <SEO
        title="Global Risk Monitor | Multi-Conflict Dashboard 2026"
        description="Track global conflict risks in real-time. Multi-conflict dashboard with regional stability index, risk meters for US-Iran, Pak-Afghan, Israel-Lebanon conflicts."
        pathname="/global-risk-monitor"
        ogImage="/og-image.png"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/global-risk-monitor" />
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
              <li className="text-white">Global Risk Monitor</li>
            </ol>
          </nav>

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
              Global Risk Monitor
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Multi-conflict risk dashboard tracking escalation across all active conflict zones.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="font-heading font-bold text-xl text-white mb-2 flex items-center justify-center gap-3">
                <Shield className="w-6 h-6 text-blue-400" />
                Regional Stability Index
              </h2>
              <p className="text-gray-400 text-sm">Combined stability score across all monitored regions</p>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="8" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${stabilityIndex * 2.83} 283`}
                    className={getRiskColor(100 - stabilityIndex)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getRiskColor(100 - stabilityIndex)}`}>{stabilityIndex}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRiskColor(100 - stabilityIndex).replace('text-', 'bg-').replace('500', '500/20')} ${getRiskColor(100 - stabilityIndex)} border-current`}>
                  <AlertTriangle className="w-4 h-4" />
                  {globalRiskLevel} Risk
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-400">3</div>
                <p className="text-sm text-gray-400">Active Conflicts</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">12</div>
                <p className="text-sm text-gray-400">Flashpoint Events (24h)</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400">8</div>
                <p className="text-sm text-gray-400">Key Actors Involved</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
              Individual Conflict Risk Meters
            </h2>

            <div className="space-y-4">
              {conflictRisks.map((conflict, index) => (
                <motion.div
                  key={conflict.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1) }}
                  className="comic-panel p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">{conflict.name}</h3>
                      <p className="text-sm text-gray-400">Updated {conflict.lastUpdated}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getRiskColor(conflict.riskScore)}`}>
                        {conflict.riskScore}%
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getRiskBg(conflict.riskScore)} bg-opacity-20 text-white`}>
                        {conflict.riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${conflict.riskScore}%` }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.8 }}
                        className={`h-full ${getRiskBg(conflict.riskScore)}`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {conflict.indicators.map((indicator, i) => (
                      <span key={i} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {indicator}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Trend: <span className={conflict.trend === 'up' ? 'text-red-400' : 'text-yellow-400'}>
                        {conflict.trend === 'up' ? 'Escalating' : 'Stable'}
                      </span>
                    </span>
                    <Link 
                      to={`/conflict/${conflict.id}`}
                      className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-8 mb-8"
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
                to="/conflict-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Conflict Tracker</span>
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
                <span className="text-gray-300 group-hover:text-white">Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Data sources: Multiple regional intelligence feeds | Updated every 60 seconds
            </p>
            <p className="text-gray-600 text-xs mt-2">
              This is a satirical educational tool. Not actual military intelligence.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default GlobalRiskMonitor;

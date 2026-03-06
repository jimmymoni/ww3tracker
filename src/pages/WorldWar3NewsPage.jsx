import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Newspaper, Globe, Clock, TrendingUp, AlertTriangle, 
  ChevronRight, Filter, Radio, Calendar
} from 'lucide-react';
import SEO from '../components/SEO';
import { FAQSchema, BreadcrumbSchema, WebsiteSchema } from '../components/StructuredData';

// Mock news data - in production this would come from your API
const ww3NewsData = [
  {
    id: 1,
    headline: "US-Iran Conflict Enters Fourth Week: No Sign of De-escalation",
    summary: "Military operations continue across the Persian Gulf region as diplomatic channels remain stalled. Oil prices stabilize at $130/barrel.",
    category: "Breaking",
    source: "WW3 Tracker",
    timestamp: "2 hours ago",
    severity: "high",
    tags: ["US-Iran", "Oil", "Military"]
  },
  {
    id: 2,
    headline: "Russia Increases Military Aid to Iran: Satellite Imagery Confirms",
    summary: "Intelligence reports indicate expanded Russian air defense systems and satellite intelligence sharing with Tehran.",
    category: "Geopolitics",
    source: "Defense Analysis",
    timestamp: "4 hours ago",
    severity: "high",
    tags: ["Russia", "Iran", "Escalation"]
  },
  {
    id: 3,
    headline: "Strait of Hormuz: 60% Reduction in Commercial Shipping",
    summary: "Insurance costs skyrocket as major shipping companies reroute vessels around Africa, adding 2-3 weeks to delivery times.",
    category: "Economic",
    source: "Maritime Watch",
    timestamp: "6 hours ago",
    severity: "medium",
    tags: ["Hormuz", "Shipping", "Economy"]
  },
  {
    id: 4,
    headline: "China Calls for 'Restraint' But Blames US for Conflict",
    summary: "Beijing's official statement urges de-escalation while accusing Washington of provoking Iran. No indication of military involvement.",
    category: "Diplomacy",
    source: "Global Affairs",
    timestamp: "8 hours ago",
    severity: "low",
    tags: ["China", "Diplomacy", "US"]
  },
  {
    id: 5,
    headline: "NATO Emergency Session Ends Without Article 5 Discussion",
    summary: "Alliance members reaffirm support for US actions but stop short of collective military commitment. Focus remains on regional defense.",
    category: "NATO",
    source: "Alliance Watch",
    timestamp: "12 hours ago",
    severity: "medium",
    tags: ["NATO", "Europe", "Alliance"]
  },
  {
    id: 6,
    headline: "Iran Nuclear Facilities: Damage Assessment Suggests 40% Degraded Capacity",
    summary: "International monitors estimate significant setbacks to Iranian enrichment program, though underground facilities remain operational.",
    category: "Nuclear",
    source: "Nuclear Watch",
    timestamp: "14 hours ago",
    severity: "medium",
    tags: ["Nuclear", "Iran", "Israel"]
  }
];

const WorldWar3NewsPage = () => {
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "World War 3 News", url: "/world-war-3-news" }
  ];

  // FAQ data for rich snippets
  const faqs = [
    {
      question: "What is the latest World War 3 news?",
      answer: "As of March 6, 2026, the US-Iran conflict continues into its fourth week with no sign of de-escalation. Russia has increased military aid to Iran, the Strait of Hormuz sees 60% reduced shipping, and NATO has not invoked Article 5. WW3 has not started, but regional tensions remain high."
    },
    {
      question: "Is there any World War 3 news today?",
      answer: "Today's WW3-related news includes: continued US-Iran military operations, Russia expanding air defense support to Iran, 60% reduction in Hormuz shipping traffic, and China calling for restraint while blaming the US. No new countries have entered the conflict."
    },
    {
      question: "Where can I get reliable WW3 news?",
      answer: "Reliable sources for WW3 and geopolitical news include: official government statements, established international media (BBC, Reuters, AP), defense analysis publications, prediction markets like Polymarket for crowd-sourced forecasting, and academic geopolitical research centers."
    }
  ];

  const filteredNews = filter === 'all' 
    ? ww3NewsData 
    : ww3NewsData.filter(news => news.severity === filter);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <SEO
        title="World War 3 News | Latest WW3 Updates & Analysis 2026"
        description="Latest World War 3 news and updates. Track the US-Iran conflict, geopolitical tensions, and WW3 probability. Real-time breaking news and analysis."
        pathname="/world-war-3-news"
        ogImage="/og-image.png"
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />
      <WebsiteSchema />

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
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-green-400 text-sm">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>LIVE UPDATES</span>
                </div>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
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
                <span itemProp="name" className="text-white">World War 3 News</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full mb-6">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="font-heading text-sm tracking-wider">BREAKING NEWS</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              World War 3 News
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
              Latest updates on global tensions, the US-Iran conflict, and WW3 probability. 
              Real-time breaking news and geopolitical analysis.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Updated: {currentTime.toLocaleTimeString()} UTC</span>
              <span className="mx-2">•</span>
              <Globe className="w-4 h-4" />
              <span>Global Coverage</span>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="comic-panel p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">12.4%</div>
              <p className="text-xs text-gray-500">WW3 Probability</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <div className="text-2xl font-bold text-red-400">ACTIVE</div>
              <p className="text-xs text-gray-500">US-Iran War</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">60%</div>
              <p className="text-xs text-gray-500">Hormuz Shipping↓</p>
            </div>
            <div className="comic-panel p-4 text-center">
              <div className="text-2xl font-bold text-green-400">NO</div>
              <p className="text-xs text-gray-500">NATO Article 5</p>
            </div>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-2 mb-8"
          >
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-500 text-sm mr-2">Filter:</span>
            {['all', 'high', 'medium', 'low'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === filterType
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === 'high' && ' Priority'}
              </button>
            ))}
          </motion.div>

          {/* News Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-400" />
              Latest Updates
            </h2>

            {filteredNews.map((news, index) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="comic-panel p-6 hover:border-white/20 transition-all cursor-pointer group"
                itemScope
                itemType="https://schema.org/NewsArticle"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(news.severity)}`}>
                      {news.category}
                    </span>
                    <span className="text-gray-500 text-sm" itemProp="datePublished">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {news.timestamp}
                    </span>
                  </div>
                  {news.severity === 'high' && (
                    <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                  )}
                </div>

                <h3 
                  className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors"
                  itemProp="headline"
                >
                  {news.headline}
                </h3>

                <p className="text-gray-400 mb-4" itemProp="description">
                  {news.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Source:</span>
                    <span className="text-sm text-blue-400" itemProp="author">
                      {news.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {news.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Quick Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="comic-panel p-8 mt-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              WW3 News Summary
            </h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">
                As of March 2026, the world is experiencing heightened geopolitical tensions centered around 
                the US-Iran conflict, but <strong className="text-white">World War 3 has not begun</strong>. 
                The current situation involves:
              </p>
              
              <ul className="space-y-2 text-gray-300 mt-4">
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>Active military conflict between US/Israel and Iran (regional, not global)</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Russian support for Iran through weapons and intelligence (indirect involvement)</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>Major disruption to global oil markets through Strait of Hormuz</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>China and NATO powers not directly involved militarily</span>
                </li>
              </ul>

              <p className="text-gray-300 mt-4">
                WW3 probability remains at approximately 12.4% according to prediction markets. 
                While concerning, this means an 87.6% chance that World War 3 will NOT occur. 
                The situation requires continued monitoring but does not constitute a global war at this time.
              </p>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="comic-panel p-8 mt-8"
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
            transition={{ delay: 0.7 }}
            className="comic-panel p-6 mt-8"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Related Trackers
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/is-ww3-happening" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">Is WW3 Happening?</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/ww3-probability" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">WW3 Probability</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/us-iran-war-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">War Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/iran-conflict-live" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white text-sm">Live Updates</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 mt-12">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Data sources: Multiple international media, prediction markets, official statements | Updated hourly
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ This is an educational news aggregator. Verify critical information with official sources.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default WorldWar3NewsPage;

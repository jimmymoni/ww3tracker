import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Calendar, Flag, Skull, ChevronRight, Home, AlertTriangle } from 'lucide-react';

const TimelinePage = () => {
  useEffect(() => {
    document.title = "US-Iran Conflict Timeline | Historical Tensions & Events 2026";
  }, []);

  // Timeline events
  const timelineEvents = [
    {
      year: "1953",
      title: "Operation Ajax",
      description: "CIA-backed coup overthrows Iranian Prime Minister Mossadegh, installing the Shah.",
      type: "covert",
      us: "blue",
      iran: "red"
    },
    {
      year: "1979",
      title: "Iranian Revolution",
      description: "Islamic Revolution overthrows the Shah. US Embassy hostage crisis begins.",
      type: "revolution",
      us: "blue",
      iran: "red"
    },
    {
      year: "1980",
      title: "Hostage Crisis Ends",
      description: "52 American hostages released after 444 days. US severs diplomatic ties.",
      type: "diplomatic",
      us: "blue",
      iran: "red"
    },
    {
      year: "1988",
      title: "Iran Air Flight 655",
      description: "US Navy shoots down Iranian civilian airliner, killing 290 people.",
      type: "tragedy",
      us: "blue",
      iran: "red"
    },
    {
      year: "2002",
      title: "Axis of Evil",
      description: "President Bush includes Iran in 'Axis of Evil' speech. Tensions escalate.",
      type: "political",
      us: "blue",
      iran: "red"
    },
    {
      year: "2015",
      title: "Iran Nuclear Deal",
      description: "JCPOA signed. Iran agrees to limit nuclear program in exchange for sanctions relief.",
      type: "diplomatic",
      us: "blue",
      iran: "red"
    },
    {
      year: "2018",
      title: "US Withdraws from JCPOA",
      description: "Trump administration withdraws from nuclear deal, reimposes sanctions.",
      type: "political",
      us: "blue",
      iran: "red"
    },
    {
      year: "2020",
      title: "Soleimani Assassination",
      description: "US drone strike kills Iranian General Qasem Soleimani in Baghdad.",
      type: "military",
      us: "blue",
      iran: "red"
    },
    {
      year: "2024",
      title: "Regional Escalation",
      description: "Iran-backed Houthis attack Red Sea shipping. Israel-Gaza conflict expands.",
      type: "conflict",
      us: "blue",
      iran: "red"
    },
    {
      year: "2025",
      title: "Direct Exchange",
      description: "Iran launches missile strikes on Israel. US responds with regional strikes.",
      type: "military",
      us: "blue",
      iran: "red"
    },
    {
      year: "2026",
      title: "Current Crisis",
      description: "Peak tensions. Nuclear program advances. Regional proxy wars intensify.",
      type: "ongoing",
      us: "blue",
      iran: "red"
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'military': return <Skull className="w-4 h-4" />;
      case 'tragedy': return <AlertTriangle className="w-4 h-4" />;
      case 'diplomatic': return <Flag className="w-4 h-4" />;
      case 'revolution': return <History className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'military': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'tragedy': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'diplomatic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'revolution': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ongoing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <Helmet>
        <title>US-Iran Conflict Timeline | Historical Tensions & Events 2026</title>
        <meta name="description" content="Complete US-Iran conflict timeline from 1953 to 2026. Track the historical tensions, key events, and diplomatic breakdowns between America and Iran." />
        <meta name="keywords" content="US Iran timeline, Iran conflict history, US Iran relations, Middle East history, Iran nuclear timeline" />
        <meta property="og:title" content="US-Iran Conflict Timeline | Historical Tensions & Events 2026" />
        <meta property="og:description" content="Complete US-Iran conflict timeline from 1953 to 2026. Track the historical tensions between America and Iran." />
        <meta property="og:type" content="website" />
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
            <div className="inline-flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <History className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">HISTORICAL RECORD</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              US-Iran Conflict Timeline
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From the 1953 coup to present day tensions. Track over 70 years of conflict between the United States and Iran.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500" />

            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex items-start gap-6 mb-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-gray-900 z-10" />

                {/* Content Card */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'
                }`}>
                  <div className="comic-panel p-5 hover:border-white/20 transition-colors">
                    <div className={`flex items-center gap-2 mb-3 ${
                      index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                    }`}>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${getTypeColor(event.type)}`}>
                        {getTypeIcon(event.type)}
                        {event.type.toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold text-white">{event.year}</span>
                    </div>
                    
                    <h3 className="font-heading font-bold text-lg text-white mb-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="comic-panel p-8 mt-12 mb-12"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              Understanding the Conflict
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The US-Iran conflict timeline reveals a relationship defined by intervention, revolution, and enduring mutual suspicion. What began with Cold War-era CIA operations in 1953 has evolved into one of the most consequential geopolitical rivalries of the modern era.
              </p>
              <p>
                The 1979 Islamic Revolution marked a fundamental break in relations, replacing a US-aligned monarchy with a theocratic republic openly hostile to American influence. The hostage crisis that followed poisoned diplomatic channels for decades.
              </p>
              <p>
                Today's tensions center on Iran's nuclear program, its support for proxy militias across the Middle East, and the shadow war playing out from Syria to Yemen. Each escalation on this timeline has added new layers of complexity to a relationship that seems perpetually on the brink.
              </p>
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
                to="/iran-conflict-live" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Iran Conflict Live</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Historical data compiled from multiple academic and journalistic sources
            </p>
            <p className="text-gray-600 text-xs mt-2">
              ⚠️ This is a satirical educational tool. Not an official historical archive.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default TimelinePage;

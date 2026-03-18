import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Calendar, Flag, Skull, ChevronRight, Home, AlertTriangle, Filter, Globe } from 'lucide-react';

const MultiConflictTimeline = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    document.title = 'Multi-Conflict Timeline | Global Security History 2026';
  }, []);

  const filters = [
    { id: 'all', label: 'All Conflicts', color: 'bg-purple-500' },
    { id: 'us-iran', label: 'US-Iran', color: 'bg-red-500' },
    { id: 'pak-afghan', label: 'Pak-Afghan', color: 'bg-green-500' },
    { id: 'israel-lebanon', label: 'Israel-Lebanon', color: 'bg-orange-500' }
  ];

  const allEvents = [
    { year: '1953', title: 'Operation Ajax', description: 'CIA-backed coup overthrows Iranian Prime Minister Mossadegh.', type: 'covert', conflict: 'us-iran' },
    { year: '1979', title: 'Iranian Revolution', description: 'Islamic Revolution overthrows the Shah. US Embassy hostage crisis begins.', type: 'revolution', conflict: 'us-iran' },
    { year: '1979', title: 'Soviet Invasion of Afghanistan', description: 'USSR invades Afghanistan, beginning decade-long proxy conflict.', type: 'military', conflict: 'pak-afghan' },
    { year: '1982', title: 'First Lebanon War', description: 'Israel invades Lebanon to combat PLO. Beginning of prolonged Israeli presence.', type: 'military', conflict: 'israel-lebanon' },
    { year: '2001', title: 'War on Terror Begins', description: 'US invasion of Afghanistan. Pakistan becomes key ally.', type: 'military', conflict: 'pak-afghan' },
    { year: '2006', title: 'Second Lebanon War', description: 'Hezbollah captures Israeli soldiers. Month-long conflict kills over 1,000.', type: 'military', conflict: 'israel-lebanon' },
    { year: '2015', title: 'Iran Nuclear Deal', description: 'JCPOA signed. Iran agrees to limit nuclear program for sanctions relief.', type: 'diplomatic', conflict: 'us-iran' },
    { year: '2020', title: 'Soleimani Assassination', description: 'US drone strike kills Iranian General Qasem Soleimani in Baghdad.', type: 'military', conflict: 'us-iran' },
    { year: '2021', title: 'Afghanistan Withdrawal', description: 'US withdraws from Afghanistan. Taliban rapidly retakes control.', type: 'military', conflict: 'pak-afghan' },
    { year: '2023', title: 'Gaza Conflict Expansion', description: 'Hamas attack on Israel. Hezbollah joins hostilities.', type: 'military', conflict: 'israel-lebanon' },
    { year: '2026', title: 'Current Crisis', description: 'Multiple active conflicts. Peak tensions across all regions.', type: 'ongoing', conflict: 'all' }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? allEvents 
    : allEvents.filter(event => event.conflict === activeFilter || event.conflict === 'all');

  const getTypeIcon = (type) => {
    switch (type) {
      case 'military': return <Skull className="w-4 h-4" />;
      case 'diplomatic': return <Flag className="w-4 h-4" />;
      case 'revolution': return <History className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'military': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'diplomatic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'revolution': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ongoing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConflictColor = (conflict) => {
    switch (conflict) {
      case 'us-iran': return 'border-l-red-500';
      case 'pak-afghan': return 'border-l-green-500';
      case 'israel-lebanon': return 'border-l-orange-500';
      default: return 'border-l-purple-500';
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

  return (
    <>
      <Helmet>
        <title>Multi-Conflict Timeline | Global Security History 2026</title>
        <meta name="description" content="Complete timeline of global conflicts from 1953 to 2026." />
      </Helmet>

      <div className="min-h-screen bg-grid text-white">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-400" />
                <Link to="/" className="font-heading font-bold text-xl text-white hover:text-blue-400">
                  WW3 TRACKER
                </Link>
              </div>
              <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <History className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">HISTORICAL RECORD</span>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">Multi-Conflict Timeline</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Unified timeline showing major conflicts worldwide. Color-coded by region.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
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
                    activeFilter === filter.id ? `${filter.color} text-white` : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500" />
            {filteredEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex items-start gap-6 mb-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-white border-4 border-gray-900 z-10" />
                <div className={`ml-12 md:ml-0 md:w-[45%] ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <div className={`comic-panel p-5 border-l-4 ${getConflictColor(event.conflict)}`}>
                    <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${getTypeColor(event.type)}`}>
                        {getTypeIcon(event.type)}
                        {event.type.toUpperCase()}
                      </span>
                      <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">{getConflictLabel(event.conflict)}</span>
                      <span className="text-2xl font-bold text-white">{event.year}</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="comic-panel p-6 mt-12">
            <h3 className="font-heading font-bold text-lg text-white mb-4">Related Trackers</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/global-risk-monitor" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10">
                <span className="text-gray-300">Global Risk Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/conflict-tracker" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10">
                <span className="text-gray-300">Conflict Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link to="/live-monitor" className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10">
                <span className="text-gray-300">Live Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4 text-center">
          <p className="text-gray-500 text-sm">Historical data compiled from multiple sources</p>
          <p className="text-gray-600 text-xs mt-2">This is a satirical educational tool.</p>
        </footer>
      </div>
    </>
  );
};

export default MultiConflictTimeline;

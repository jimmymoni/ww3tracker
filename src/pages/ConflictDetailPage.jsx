import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Target, Users, Calendar, MapPin, AlertTriangle, 
  TrendingUp, Shield, Globe, ChevronRight, Flame, Activity 
} from 'lucide-react';

const ConflictDetailPage = () => {
  const { zoneId } = useParams();

  useEffect(() => {
    document.title = `${getConflictData(zoneId)?.name || 'Conflict'} Details | Regional Tracker`;
  }, [zoneId]);

  const getConflictData = (id) => {
    const conflicts = {
      'us-iran': {
        name: 'US-Iran Theater',
        region: 'Middle East',
        status: 'active',
        riskLevel: 'critical',
        description: 'Long-running tensions between the United States and Iran over nuclear proliferation, regional influence, and proxy conflicts.',
        rootCauses: [
          'Nuclear program development and non-proliferation concerns',
          'Regional hegemony competition with Saudi Arabia and Israel',
          'Historical grievances from 1953 coup and 1979 revolution',
          'Proxy warfare in Syria, Yemen, Lebanon, and Iraq'
        ],
        keyActors: [
          { name: 'United States', role: 'Primary adversary', stance: 'Opposing nuclear program' },
          { name: 'Iran', role: 'Defiant power', stance: 'Advancing nuclear capabilities' },
          { name: 'Israel', role: 'Regional ally', stance: 'Preventive action threatened' },
          { name: 'Saudi Arabia', role: 'Regional rival', stance: 'Supporting opposition' },
          { name: 'Russia', role: 'External supporter', stance: 'Diplomatic backing' },
          { name: 'China', role: 'Economic partner', stance: 'Buying sanctioned oil' }
        ],
        recentAttacks: [
          { date: '2026-03-15', type: 'Missile Strike', location: 'Tehran suburbs', description: 'Retaliatory strike on military facility' },
          { date: '2026-03-14', type: 'Drone Attack', location: 'Strait of Hormuz', description: 'Naval vessel targeted' },
          { date: '2026-03-12', type: 'Cyber Attack', location: 'Nuclear facility', description: 'Infrastructure disruption reported' },
          { date: '2026-03-10', type: 'Proxy Strike', location: 'Eastern Syria', description: 'Militia attack on US base' }
        ],
        timeline: [
          { year: '1953', event: 'Operation Ajax - CIA-backed coup in Iran' },
          { year: '1979', event: 'Iranian Revolution and hostage crisis' },
          { year: '2015', event: 'JCPOA nuclear deal signed' },
          { year: '2018', event: 'US withdraws from nuclear deal' },
          { year: '2020', event: 'Soleimani assassination' },
          { year: '2025', event: 'Direct military exchanges begin' }
        ]
      },
      'pak-afghan': {
        name: 'Pakistan-Afghanistan Border',
        region: 'South Asia',
        status: 'active',
        riskLevel: 'high',
        description: 'Border tensions, militant activity, and refugee flows following the Taliban takeover of Afghanistan.',
        rootCauses: [
          'Border disputes dating to colonial Durand Line',
          'Taliban resurgence and governance challenges',
          'TTP and other militant groups operating across border',
          'Refugee crisis and resource competition'
        ],
        keyActors: [
          { name: 'Pakistan', role: 'Border guardian', stance: 'Fencing border, strikes militants' },
          { name: 'Afghanistan', role: 'Taliban government', stance: 'Rejecting border claims' },
          { name: 'TTP', role: 'Militant group', stance: 'Attacking Pakistani targets' },
          { name: 'ISIS-K', role: 'Terrorist organization', stance: 'Regional destabilization' }
        ],
        recentAttacks: [
          { date: '2026-03-16', type: 'Border Clash', location: 'Torkham crossing', description: 'Exchange of fire between border guards' },
          { date: '2026-03-14', type: 'IED Attack', location: 'Khyber Pass', description: 'Convoy ambush' },
          { date: '2026-03-11', type: 'Air Strike', location: 'Kunar Province', description: 'Pakistani cross-border operation' }
        ],
        timeline: [
          { year: '1893', event: 'Durand Line established' },
          { year: '1947', event: 'Pakistan independence, border disputes begin' },
          { year: '2001', event: 'US invasion of Afghanistan' },
          { year: '2021', event: 'Taliban takeover, US withdrawal' },
          { year: '2024', event: 'Escalating border tensions' }
        ]
      },
      'israel-lebanon': {
        name: 'Israel-Lebanon Front',
        region: 'Levant',
        status: 'active',
        riskLevel: 'high',
        description: 'Ongoing hostilities between Israel and Hezbollah, with spillover from the Gaza conflict.',
        rootCauses: [
          'Hezbollah presence and rocket capabilities',
          ' spillover from Gaza conflict',
          'Historical conflicts including 1982 and 2006 wars',
          'Iranian support for Hezbollah'
        ],
        keyActors: [
          { name: 'Israel', role: 'Military power', stance: 'Degrading Hezbollah capabilities' },
          { name: 'Hezbollah', role: 'Militant group', stance: 'Supporting Gaza, attacking Israel' },
          { name: 'Lebanon', role: 'Host state', stance: 'Limited control of territory' },
          { name: 'Iran', role: 'Backer', stance: 'Funding and arming Hezbollah' }
        ],
        recentAttacks: [
          { date: '2026-03-17', type: 'Rocket Barrage', location: 'Northern Israel', description: 'Dozens of rockets fired' },
          { date: '2026-03-16', type: 'Air Strike', location: 'Southern Lebanon', description: 'Infrastructure targeted' },
          { date: '2026-03-15', type: 'Ground Raid', location: 'Lebanese border', description: 'Special forces operation' }
        ],
        timeline: [
          { year: '1982', event: 'First Lebanon War' },
          { year: '2000', event: 'Israel withdraws from South Lebanon' },
          { year: '2006', event: 'Second Lebanon War' },
          { year: '2023', event: 'Gaza conflict spillover begins' },
          { year: '2026', event: 'Escalated daily exchanges' }
        ]
      }
    };
    return conflicts[id];
  };

  const conflict = getConflictData(zoneId);

  if (!conflict) {
    return (
      <div className="min-h-screen bg-grid text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Conflict Not Found</h1>
          <Link to="/conflict-tracker" className="text-red-400 hover:text-red-300">
            Return to Conflict Tracker
          </Link>
        </div>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'elevated': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <>
      <Helmet>
        <title>{conflict.name} Details | Regional Conflict Tracker</title>
        <meta name="description" content={`Deep dive into ${conflict.name}. Root causes, key players, timeline, and recent attacks.`} />
      </Helmet>

      <div className="min-h-screen bg-grid text-white">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-red-400" />
                <Link to="/" className="font-heading font-bold text-xl text-white hover:text-red-400 transition-colors">
                  WW3 TRACKER
                </Link>
              </div>
              <Link 
                to="/conflict-tracker" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Tracker</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{conflict.region}</span>
              <span className={`px-2 py-1 rounded text-xs border ${getRiskColor(conflict.riskLevel)}`}>
                {conflict.riskLevel.toUpperCase()}
              </span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl text-white mb-4">{conflict.name}</h1>
            <p className="text-xl text-gray-400">{conflict.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-6 mb-8"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Target className="w-5 h-5 text-yellow-400" />
              Root Causes
            </h2>
            <ul className="space-y-3">
              {conflict.rootCauses.map((cause, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <span className="text-yellow-400 mt-1">•</span>
                  {cause}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-6 mb-8"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-red-400" />
              Key Players
            </h2>
            <div className="space-y-4">
              {conflict.keyActors.map((actor, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white">{actor.name}</h3>
                    <span className="text-xs text-red-400">{actor.role}</span>
                  </div>
                  <p className="text-sm text-gray-400">{actor.stance}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-6 mb-8"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Flame className="w-5 h-5 text-red-400" />
              Recent Attacks
            </h2>
            <div className="space-y-3">
              {conflict.recentAttacks.map((attack, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{attack.date}</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">{attack.type}</span>
                  </div>
                  <h4 className="font-bold text-white mb-1">{attack.location}</h4>
                  <p className="text-sm text-gray-400">{attack.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-6 mb-8"
          >
            <h2 className="font-heading font-bold text-xl text-white mb-4 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-purple-400" />
              Conflict Timeline
            </h2>
            <div className="space-y-4">
              {conflict.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 text-right">
                    <span className="font-bold text-white">{item.year}</span>
                  </div>
                  <div className="flex-1 pb-4 border-l-2 border-white/20 pl-4 relative">
                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-purple-400" />
                    <p className="text-gray-300">{item.event}</p>
                  </div>
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
              Related Pages
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link 
                to="/live-monitor" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300">Live Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/multi-conflict-timeline" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300">Full Timeline</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4 text-center">
          <p className="text-gray-500 text-sm">Regional Conflict Tracker | Educational Tool</p>
        </footer>
      </div>
    </>
  );
};

export default ConflictDetailPage;

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Share2, ChevronRight, Home, Users, Swords, Handshake, 
  AlertTriangle, Droplets, Target, Globe, X, Filter, Network 
} from 'lucide-react';
import SEO from '../components/SEO';

const RelationshipExplorerPage = () => {
  const [selectedActor, setSelectedActor] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    document.title = "Relationship Explorer | Global Actor Network";
  }, []);

  const relationshipTypes = [
    { id: 'all', label: 'All', icon: Network },
    { id: 'allied', label: 'Allied', icon: Handshake },
    { id: 'hostile', label: 'Hostile', icon: Swords },
    { id: 'proxy', label: 'Proxy', icon: Target },
    { id: 'economic', label: 'Economic', icon: Droplets }
  ];

  const actors = [
    {
      id: 'us',
      name: 'United States',
      type: 'superpower',
      flag: '🇺🇸',
      relationships: [
        { target: 'iran', type: 'hostile', strength: 'critical', description: 'Nuclear dispute, sanctions, proxy opposition' },
        { target: 'israel', type: 'allied', strength: 'strong', description: 'Strategic ally, military support' },
        { target: 'saudi', type: 'allied', strength: 'strong', description: 'Regional partnership, arms sales' },
        { target: 'pakistan', type: 'complicated', strength: 'moderate', description: 'Counter-terror cooperation with tensions' }
      ]
    },
    {
      id: 'iran',
      name: 'Iran',
      type: 'regional_power',
      flag: '🇮🇷',
      relationships: [
        { target: 'us', type: 'hostile', strength: 'critical', description: 'Nuclear dispute, sanctions, regional competition' },
        { target: 'hezbollah', type: 'proxy', strength: 'strong', description: 'Funding, arms, training, ideological support' },
        { target: 'russia', type: 'allied', strength: 'moderate', description: 'Diplomatic support, military cooperation' },
        { target: 'china', type: 'economic', strength: 'strong', description: 'Oil purchases, Belt and Road participation' },
        { target: 'houthis', type: 'proxy', strength: 'moderate', description: 'Arms, support in Yemen conflict' }
      ]
    },
    {
      id: 'israel',
      name: 'Israel',
      type: 'regional_power',
      flag: '🇮🇱',
      relationships: [
        { target: 'us', type: 'allied', strength: 'critical', description: 'Primary ally, military aid, intelligence sharing' },
        { target: 'hezbollah', type: 'hostile', strength: 'critical', description: 'Direct military conflict, existential threat' },
        { target: 'iran', type: 'hostile', strength: 'critical', description: 'Nuclear threat, proxy attacks' }
      ]
    },
    {
      id: 'hezbollah',
      name: 'Hezbollah',
      type: 'militant_group',
      flag: '⚔️',
      relationships: [
        { target: 'iran', type: 'proxy', strength: 'critical', description: 'Primary backer and ideological sponsor' },
        { target: 'israel', type: 'hostile', strength: 'critical', description: 'Ongoing military conflict' },
        { target: 'lebanon', type: 'complicated', strength: 'strong', description: 'Political party and armed militia within state' }
      ]
    },
    {
      id: 'pakistan',
      name: 'Pakistan',
      type: 'regional_power',
      flag: '🇵🇰',
      relationships: [
        { target: 'afghanistan', type: 'hostile', strength: 'high', description: 'Border disputes, Taliban support allegations' },
        { target: 'us', type: 'complicated', strength: 'moderate', description: 'Historical ally with growing tensions' },
        { target: 'china', type: 'allied', strength: 'critical', description: 'All-weather ally, CPEC investment' },
        { target: 'ttp', type: 'hostile', strength: 'critical', description: 'Domestic insurgency threat' }
      ]
    },
    {
      id: 'afghanistan',
      name: 'Afghanistan',
      type: 'state',
      flag: '🇦🇫',
      relationships: [
        { target: 'pakistan', type: 'hostile', strength: 'high', description: 'Border disputes, TTP sanctuary allegations' },
        { target: 'taliban', type: 'internal', strength: 'critical', description: 'Ruling government (internationally unrecognized)' }
      ]
    },
    {
      id: 'china',
      name: 'China',
      type: 'superpower',
      flag: '🇨🇳',
      relationships: [
        { target: 'iran', type: 'economic', strength: 'strong', description: 'Oil imports, strategic partnership' },
        { target: 'pakistan', type: 'allied', strength: 'critical', description: 'CPEC, strategic encirclement of India' },
        { target: 'us', type: 'competitive', strength: 'high', description: 'Great power competition' }
      ]
    },
    {
      id: 'russia',
      name: 'Russia',
      type: 'great_power',
      flag: '🇷🇺',
      relationships: [
        { target: 'iran', type: 'allied', strength: 'moderate', description: 'Syria cooperation, sanctions evasion' },
        { target: 'us', type: 'hostile', strength: 'high', description: 'Strategic competition, proxy conflicts' }
      ]
    },
    {
      id: 'saudi',
      name: 'Saudi Arabia',
      type: 'regional_power',
      flag: '🇸🇦',
      relationships: [
        { target: 'us', type: 'allied', strength: 'strong', description: 'Security guarantee, oil partnership' },
        { target: 'iran', type: 'hostile', strength: 'critical', description: 'Sectarian rivalry, regional competition' },
        { target: 'houthis', type: 'hostile', strength: 'high', description: 'Yemen war opponent' }
      ]
    },
    {
      id: 'ttp',
      name: 'TTP',
      type: 'terrorist_group',
      flag: '☠️',
      relationships: [
        { target: 'pakistan', type: 'hostile', strength: 'critical', description: 'Domestic insurgency' },
        { target: 'afghanistan', type: 'sanctuary', strength: 'strong', description: 'Safe haven allegations' }
      ]
    },
    {
      id: 'houthis',
      name: 'Houthis',
      type: 'militant_group',
      flag: '⚔️',
      relationships: [
        { target: 'iran', type: 'proxy', strength: 'moderate', description: 'Suspected arms and funding' },
        { target: 'saudi', type: 'hostile', strength: 'critical', description: 'Yemen war, cross-border attacks' }
      ]
    }
  ];

  const getRelationshipColor = (type) => {
    switch (type) {
      case 'allied': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'hostile': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'proxy': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'economic': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'complicated': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStrengthIndicator = (strength) => {
    const dots = { weak: 1, moderate: 2, strong: 3, critical: 4 };
    const count = dots[strength] || 1;
    return (
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full ${i < count ? 'bg-blue-400' : 'bg-white/10'}`}
          />
        ))}
      </div>
    );
  };

  const selectedActorData = actors.find(a => a.id === selectedActor);

  const filteredRelationships = selectedActorData 
    ? selectedActorData.relationships.filter(r => 
        filterType === 'all' || r.type === filterType
      )
    : [];

  return (
    <>
      <SEO
        title="Relationship Explorer | Global Actor Network"
        description="Interactive relationship web showing connections between global actors. Explore alliances, hostilities, proxy relationships, and economic ties."
        pathname="/relationships"
        ogImage="/og-image.png"
      />

      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/relationships" />
      </Helmet>

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

        <main className="max-w-6xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <Network className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">INTERACTIVE WEB</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Relationship Explorer
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore the complex web of relationships between global actors. Click any actor to see their connections.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="comic-panel p-6">
                <h2 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  Select an Actor
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {actors.map((actor) => (
                    <motion.button
                      key={actor.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedActor(actor.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedActor === actor.id
                          ? 'bg-blue-500/20 border border-blue-500/50'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{actor.flag}</span>
                        <div>
                          <h3 className="font-bold text-white text-sm">{actor.name}</h3>
                          <span className="text-xs text-gray-500 capitalize">{actor.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {relationshipTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFilterType(type.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-all ${
                        filterType === type.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      <type.icon className="w-3 h-3" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="comic-panel p-6 h-full">
                {selectedActorData ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{selectedActorData.flag}</span>
                        <div>
                          <h2 className="font-bold text-white">{selectedActorData.name}</h2>
                          <span className="text-xs text-gray-400 capitalize">{selectedActorData.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedActor(null)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-gray-400 mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Relationships ({filteredRelationships.length})
                    </h3>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {filteredRelationships.map((rel, index) => {
                        const targetActor = actors.find(a => a.id === rel.target);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 p-3 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span>{targetActor?.flag}</span>
                                <span className="font-medium text-white text-sm">{targetActor?.name}</span>
                              </div>
                              {getStrengthIndicator(rel.strength)}
                            </div>
                            <span className={`inline-block text-xs px-2 py-0.5 rounded border mb-2 ${getRelationshipColor(rel.type)}`}>
                              {rel.type.toUpperCase()}
                            </span>
                            <p className="text-xs text-gray-400">{rel.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                    <Network className="w-12 h-12 mb-4 opacity-50" />
                    <p>Select an actor from the left<br />to view their relationships</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-6 mt-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Learn More
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link 
                to="/why-conflicts-happen" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300">Why Conflicts Happen</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/conflict-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300">Conflict Tracker</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/global-risk-monitor" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-gray-300">Risk Monitor</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
            </div>
          </motion.div>
        </main>

        <footer className="border-t border-white/10 py-8 px-4 text-center">
          <p className="text-gray-500 text-sm">Interactive Relationship Explorer | Educational Tool</p>
        </footer>
      </div>
    </>
  );
};

export default RelationshipExplorerPage;

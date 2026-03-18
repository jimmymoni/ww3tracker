import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, ChevronRight, Home, Target, Droplets, Users, 
  Scale, Building2, Globe, ArrowRight, Lightbulb, AlertCircle 
} from 'lucide-react';
import SEO from '../components/SEO';

const WhyConflictsHappenPage = () => {
  const [selectedPattern, setSelectedPattern] = useState(null);

  useEffect(() => {
    document.title = "Why Conflicts Happen | Understanding Root Causes";
  }, []);

  const rootCausePatterns = [
    {
      id: 'resources',
      title: 'Resource Competition',
      icon: Droplets,
      description: 'Wars fought over control of essential resources like oil, water, and strategic waterways.',
      examples: [
        { conflict: 'US-Iran', detail: 'Strait of Hormuz control, oil exports' },
        { conflict: 'Various', detail: 'Water rights in arid regions' }
      ],
      indicators: ['Resource scarcity', 'Strategic location', 'Economic sanctions']
    },
    {
      id: 'proxy',
      title: 'Proxy Wars',
      icon: Users,
      description: 'Major powers supporting opposing sides to avoid direct confrontation.',
      examples: [
        { conflict: 'US-Iran', detail: 'Iran supports Hezbollah, Houthis; US supports regional allies' },
        { conflict: 'Historical', detail: 'Cold War pattern repeated in Middle East' }
      ],
      indicators: ['Foreign funding', 'Arms transfers', 'Adviser presence']
    },
    {
      id: 'ideology',
      title: 'Ideological Divide',
      icon: Scale,
      description: 'Religious, political, and cultural differences fueling recruitment and motivation.',
      examples: [
        { conflict: 'Israel-Lebanon', detail: 'Religious-nationalist narratives' },
        { conflict: 'Pak-Afghan', detail: 'Islamist governance models vs secular authority' }
      ],
      indicators: ['Religious rhetoric', 'Identity politics', 'Extremist mobilization']
    },
    {
      id: 'colonial',
      title: 'Colonial Legacy',
      icon: Building2,
      description: 'Arbitrary borders and unresolved historical grievances from imperial era.',
      examples: [
        { conflict: 'Pak-Afghan', detail: 'Durand Line dispute from British colonial era' },
        { conflict: 'Middle East', detail: 'Sykes-Picot agreements creating artificial states' }
      ],
      indicators: ['Border disputes', 'Ethnic divisions', 'Historical grievances']
    },
    {
      id: 'power',
      title: 'Power Vacuum',
      icon: AlertCircle,
      description: 'Failed states and weak governance enabling militant group expansion.',
      examples: [
        { conflict: 'Afghanistan', detail: 'Post-withdrawal Taliban governance challenges' },
        { conflict: 'Syria/Lebanon', detail: 'State fragmentation creating militant safe havens' }
      ],
      indicators: ['Weak institutions', 'Corruption', 'Security gaps']
    },
    {
      id: 'security',
      title: 'Security Dilemma',
      icon: Target,
      description: 'Defensive actions by one side perceived as threatening by others, triggering arms races.',
      examples: [
        { conflict: 'US-Iran', detail: 'Nuclear program development triggering sanctions' },
        { conflict: 'Israel-Lebanon', detail: 'Missile buildup on both sides' }
      ],
      indicators: ['Arms buildup', 'Preventive strikes', 'Alliance formation']
    }
  ];

  const conflictComparisons = [
    {
      aspect: 'Primary Driver',
      usIran: 'Nuclear proliferation + regional influence',
      pakAfghan: 'Border sovereignty + militant safe havens',
      israelLebanon: 'Territorial security + ideological conflict'
    },
    {
      aspect: 'Proxy Elements',
      usIran: 'High - Multiple proxy militias',
      pakAfghan: 'Medium - State vs non-state actors',
      israelLebanon: 'High - Iranian-backed Hezbollah'
    },
    {
      aspect: 'Economic Factor',
      usIran: 'Critical - Oil, sanctions',
      pakAfghan: 'Moderate - Trade routes',
      israelLebanon: 'Low - Strategic position'
    },
    {
      aspect: 'Historical Depth',
      usIran: 'Decades - Since 1979 revolution',
      pakAfghan: 'Centuries - Colonial borders',
      israelLebanon: 'Decades - Since 1982'
    }
  ];

  return (
    <>
      <SEO
        title="Why Conflicts Happen | Understanding Root Causes"
        description="Educational hub explaining the root causes of modern conflicts. Compare proxy wars, resource conflicts, and common patterns across US-Iran, Pak-Afghan, and Israel-Lebanon."
        pathname="/why-conflicts-happen"
        ogImage="/og-image.png"
      />

      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/why-conflicts-happen" />
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

        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              <span className="font-heading text-sm tracking-wider">EDUCATIONAL HUB</span>
            </div>
            
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              Why Conflicts Happen
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Understanding the root causes behind modern conflicts. Compare patterns, analyze drivers, and learn why wars start.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              Common Conflict Patterns
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {rootCausePatterns.map((pattern) => (
                <motion.div
                  key={pattern.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedPattern === pattern.id 
                      ? 'bg-white/10 border border-blue-500/50' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <pattern.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">{pattern.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{pattern.description}</p>
                  
                  {selectedPattern === pattern.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <h4 className="font-bold text-sm text-white mb-2">Examples:</h4>
                      <ul className="space-y-2 mb-4">
                        {pattern.examples.map((ex, i) => (
                          <li key={i} className="text-sm text-gray-400">
                            <span className="text-blue-400">{ex.conflict}:</span> {ex.detail}
                          </li>
                        ))}
                      </ul>
                      <h4 className="font-bold text-sm text-white mb-2">Key Indicators:</h4>
                      <div className="flex flex-wrap gap-2">
                        {pattern.indicators.map((ind, i) => (
                          <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6 text-purple-400" />
              Compare Conflicts Side-by-Side
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-normal">Aspect</th>
                    <th className="text-left py-3 px-4 text-red-400 font-bold">US-Iran</th>
                    <th className="text-left py-3 px-4 text-green-400 font-bold">Pak-Afghan</th>
                    <th className="text-left py-3 px-4 text-orange-400 font-bold">Israel-Lebanon</th>
                  </tr>
                </thead>
                <tbody>
                  {conflictComparisons.map((row, index) => (
                    <tr key={index} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white font-medium">{row.aspect}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{row.usIran}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{row.pakAfghan}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">{row.israelLebanon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="comic-panel p-8 mb-8"
          >
            <h2 className="font-heading font-bold text-2xl text-white mb-6">
              The Escalation Spiral
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-white">Grievance Accumulation</h4>
                  <p className="text-sm text-gray-400">Historical wounds, perceived injustices, and unmet demands build over time.</p>
                </div>
              </div>
              <ArrowRight className="ml-4 text-gray-600" />
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-white">Polarization</h4>
                  <p className="text-sm text-gray-400">Societies divide into camps, moderate voices silenced, extremism rises.</p>
                </div>
              </div>
              <ArrowRight className="ml-4 text-gray-600" />
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-white">Trigger Event</h4>
                  <p className="text-sm text-gray-400">A specific incident sparks open hostilities - often seemingly small.</p>
                </div>
              </div>
              <ArrowRight className="ml-4 text-gray-600" />
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-white">Sustained Conflict</h4>
                  <p className="text-sm text-gray-400">Cycles of retaliation, civilian suffering, and entrenchment of positions.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="comic-panel p-6"
          >
            <h3 className="font-heading font-bold text-lg text-white mb-4">
              Explore Further
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link 
                to="/relationships" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Relationship Explorer</span>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </Link>
              <Link 
                to="/conflict-tracker" 
                className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Conflict Tracker</span>
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

        <footer className="border-t border-white/10 py-8 px-4 text-center">
          <p className="text-gray-500 text-sm">Educational Resource | Understanding Global Conflicts</p>
        </footer>
      </div>
    </>
  );
};

export default WhyConflictsHappenPage;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown } from 'lucide-react';

// Complete US-Iran conflict history with detailed info
const CONFLICT_HISTORY = [
  {
    year: '1953',
    title: 'CIA OVERTHROWS IRAN',
    subtitle: 'Operation Ajax',
    description: 'US & UK intelligence orchestrate a coup to overthrow democratically elected Prime Minister Mohammad Mossadegh after he nationalizes Iran\'s oil industry. The Shah (Mohammad Reza Pahlavi) is installed as a puppet ruler, backed by Western powers. This becomes the foundational trauma in Iranian collective memory - "the West will never let us be independent."',
    details: 'Mossadegh was Time Magazine\'s Man of the Year in 1951. The coup cost taxpayers $19 million ($200M today). Iranians never forgave this foreign interference.',
    impact: 'Iranians never forgot foreign interference',
    side: 'us',
    icon: '🕵️'
  },
  {
    year: '1979',
    title: 'IRANIAN REVOLUTION',
    subtitle: 'Hostage Crisis',
    description: 'The Shah is overthrown by Islamic revolutionaries led by Ayatollah Khomeini. In November, Iranian students storm the US Embassy in Tehran, taking 52 Americans hostage for 444 days. The US cuts diplomatic ties permanently and begins decades of sanctions.',
    details: 'The crisis dominated US news for over a year. Operation Eagle Claw rescue mission failed spectacularly in the desert. US-Iran relations severed forever.',
    impact: 'Diplomatic relations severed permanently',
    side: 'iran',
    icon: '☪️'
  },
  {
    year: '1988',
    title: 'US SHOOTS DOWN IRAN AIRLINER',
    subtitle: 'Flight 655',
    description: 'USS Vincennes, a US Navy guided missile cruiser, shoots down Iran Air Flight 655 over the Persian Gulf, killing all 290 passengers including 66 children. The US claims it mistook the Airbus A300 for an attacking fighter jet. President Reagan calls it a "proper defensive action."',
    details: 'The US never formally apologized. Iran took the case to the International Court of Justice. US paid $131.8 million in compensation but admitted no wrongdoing.',
    impact: 'Deep resentment in Iranian public memory',
    side: 'us',
    icon: '✈️'
  },
  {
    year: '2002',
    title: '"AXIS OF EVIL"',
    subtitle: 'Bush Declaration',
    description: 'In his State of the Union address, President George W. Bush labels Iran part of the "Axis of Evil" alongside Iraq and North Korea. This comes right after Iran had cooperated with US in Afghanistan post-9/11. Iranian moderates lose power; hardliners gain strength.',
    details: 'The speech shocked Iranian reformists who had been reaching out. Iran accelerated its nuclear program, seeing US invasion as imminent after Iraq (2003) and Afghanistan (2001).',
    impact: 'Iran accelerates nuclear program for protection',
    side: 'us',
    icon: '🎤'
  },
  {
    year: '2015',
    title: 'NUCLEAR DEAL SIGNED',
    subtitle: 'JCPOA Agreement',
    description: 'After years of negotiations, Iran agrees to limit its nuclear program in exchange for sanctions relief. The deal (JCPOA) is signed by Iran, US, UK, France, Russia, China, Germany. Iran ships out 98% of enriched uranium, dismantles centrifuges.',
    details: 'The deal was working - IAEA confirmed Iran compliance 11 times. Iran\'s economy began recovering. First major diplomatic breakthrough in decades.',
    impact: 'Brief period of diplomacy',
    side: 'neutral',
    icon: '✍️'
  },
  {
    year: '2018',
    title: 'TRUMP PULLS OUT',
    subtitle: 'Maximum Pressure Campaign',
    description: 'President Trump unilaterally withdraws US from JCPOA despite Iran\'s full compliance. Implements "maximum pressure" sanctions that cripple Iran\'s economy - oil exports drop 80%, currency crashes, inflation hits 40%. Iranian hardliners gain complete control.',
    details: 'European allies tried to save the deal but US sanctions blocked their companies. Iran waited a year before starting to enrich uranium again. Trust completely broken.',
    impact: 'Iran resumes uranium enrichment',
    side: 'us',
    icon: '💥'
  },
  {
    year: '2020',
    title: 'SOLEIMANI ASSASSINATED',
    subtitle: 'Drone Strike in Baghdad',
    description: 'Trump orders a drone strike at Baghdad airport killing Qasem Soleimani, Iran\'s most powerful military commander and architect of its regional influence. Iran retaliates with missile strikes on US bases in Iraq (injuring 110 US troops). World braces for war.',
    details: 'Soleimani was second-most powerful person in Iran. The attack violated Iraqi sovereignty. Iran shot down Ukrainian airliner by mistake during tensions, killing 176.',
    impact: 'Brink of war. Iran vows revenge.',
    side: 'us',
    icon: '🎯'
  },
  {
    year: '2024',
    title: 'REGIONAL PROXY WAR EXPLODES',
    subtitle: 'Gaza, Lebanon, Yemen',
    description: 'Hamas attacks Israel October 7. Iran-backed Hezbollah joins from Lebanon. Houthis attack Red Sea shipping. US strikes Iranian proxies across Syria and Iraq. Iran funds and arms all these groups - the "Axis of Resistance" - keeping pressure on Israel/US without direct war.',
    details: 'Iran spends ~$1B/year arming proxies. Hezbollah has 150,000 rockets. Houthis disrupt global shipping. Israel assassinates Hamas and Hezbollah leaders in Beirut and Tehran.',
    impact: 'Direct US-Iran conflict becomes likely',
    side: 'iran',
    icon: '🔥'
  },
  {
    year: '2025',
    title: 'ISRAEL STRIKES IRAN DIRECTLY',
    subtitle: 'Escalation to State-on-State',
    description: 'Israel conducts multiple air strikes on Iranian nuclear facilities and military sites, killing Iranian scientists and Revolutionary Guard commanders. Iran launches hundreds of ballistic missiles at Israel in retaliation. The shadow war becomes open warfare.',
    details: 'Israel\'s actions have US backing (intelligence/logistics). Iran\'s missiles breach Israeli air defenses. Both sides threaten existential retaliation.',
    impact: 'First direct state-to-state strikes',
    side: 'us',
    icon: '⚔️'
  },
  {
    year: '2026',
    title: 'TRUMP RETURNS - WAR LOOMS',
    subtitle: 'Maximum Pressure 2.0',
    description: 'Trump returns to White House promising to "make Iran great again" by forcing total capitulation. US military buildup in Gulf. Israel threatens to strike Iran\'s nuclear program before summer. Iran warns any attack will trigger all-out regional war including oil blockade of Strait of Hormuz.',
    details: 'The world watches as the 70-year conflict reaches its boiling point. Nuclear talks are dead. Economic sanctions are total. Military confrontation seems inevitable.',
    impact: 'World braces for potential WW3 trigger',
    side: 'neutral',
    icon: '☢️'
  }
];

const TimelineCard = ({ event, index, isExpanded, onToggle }) => {
  const sideColors = {
    us: 'border-l-red-500',
    iran: 'border-l-blue-500',
    neutral: 'border-l-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="relative pl-4 sm:pl-5 pb-1.5 sm:pb-2 last:pb-0"
    >
      {/* Timeline Line */}
      <div className="absolute left-[5px] sm:left-[7px] top-3 sm:top-4 bottom-0 w-px bg-white/10" />
      
      {/* Year Dot */}
      <div className="absolute left-0 top-1 sm:top-1.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center">
        <span className="text-[5px] sm:text-[6px] font-bold text-white/40">{event.year.slice(-2)}</span>
      </div>

      {/* Card */}
      <div 
        onClick={onToggle}
        className={`comic-panel rounded border-l-2 ${sideColors[event.side]} bg-white/[0.02] cursor-pointer hover:bg-white/[0.05] transition-all ${isExpanded ? 'ring-1 ring-white/10' : ''}`}
      >
        <div className="p-1.5 sm:p-2">
          {/* Header Row */}
          <div className="flex items-start gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg shrink-0">{event.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[8px] sm:text-[9px] font-mono font-medium text-gray-500">{event.year}</span>
                <h3 className="font-heading font-semibold text-xs sm:text-sm text-white tracking-wide truncate">
                  {event.title}
                </h3>
              </div>
              <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{event.subtitle}</p>
              
              {/* Always visible summary */}
              <p className="text-[10px] sm:text-[11px] text-gray-300 font-body mt-0.5 sm:mt-1 leading-snug">
                {event.description.substring(0, 100)}...
              </p>
              
              <p className="text-[8px] sm:text-[9px] text-yellow-400/70 font-body mt-0.5 sm:mt-1">
                → {event.impact}
              </p>
            </div>
            <ChevronDown 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform shrink-0 mt-0.5 sm:mt-1 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </div>

          {/* Expandable Content (extra details) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-body mt-1.5 sm:mt-2 leading-relaxed border-t border-white/5 pt-1.5 sm:pt-2">
                  {event.details}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-300 font-body mt-1 sm:mt-1.5">
                  {event.description.substring(100)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineOfChaos = () => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-white tracking-wide">WHY WE'RE HERE</h2>
          <p className="text-gray-500 text-[9px] sm:text-[10px] font-body">The 70-year grudge (1953-2026)</p>
        </div>
      </div>

      {/* Intro */}
      <div className="comic-panel rounded p-1.5 sm:p-2 mb-2 bg-gradient-to-r from-red-500/10 to-blue-500/10 border border-white/10">
        <p className="text-[9px] sm:text-[10px] text-gray-300 font-body text-center leading-tight">
          🇺🇸 vs 🇮🇷 Started <span className="text-yellow-400">1953</span> • Escalating <span className="text-red-400">2026</span>
        </p>
      </div>

      {/* Timeline */}
      <div className="max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-1 scrollbar-hide">
        {CONFLICT_HISTORY.map((event, index) => (
          <TimelineCard
            key={event.year}
            event={event}
            index={index}
            isExpanded={expandedId === index}
            onToggle={() => setExpandedId(expandedId === index ? null : index)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-1 text-center">
        <p className="text-[8px] text-gray-500 font-body">
          Tap cards for full story
        </p>
      </div>
    </div>
  );
};

export default TimelineOfChaos;

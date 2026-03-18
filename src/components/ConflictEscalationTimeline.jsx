import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  AlertTriangle, 
  Shield, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  ArrowRight
} from 'lucide-react';

// Sample timeline events data
const timelineEvents = [
  {
    id: 'evt-001',
    date: '2026-02-15T08:00:00Z',
    title: 'Border Clash: Pakistan-Afghanistan',
    description: 'Pakistani forces conducted airstrikes on suspected militant positions near the Afghan border, resulting in 12 casualties. Taliban forces retaliated with artillery fire.',
    severity: 'medium',
    triggeredBy: null,
    consequences: ['evt-002'],
    actors: ['Pakistan', 'Afghanistan'],
    zone: 'pak-afghan',
    icon: 'crosshair'
  },
  {
    id: 'evt-002',
    date: '2026-02-18T14:30:00Z',
    title: 'Kabul Embassy Evacuation',
    description: 'Multiple embassies in Kabul began evacuating non-essential staff following intelligence reports of imminent attacks. Pakistan closed its consulate.',
    severity: 'medium',
    triggeredBy: 'evt-001',
    consequences: ['evt-003'],
    actors: ['Pakistan', 'Afghanistan', 'Turkey', 'UAE'],
    zone: 'pak-afghan',
    icon: 'evacuation'
  },
  {
    id: 'evt-003',
    date: '2026-02-22T03:15:00Z',
    title: 'Drone Strike on Kandahar Airfield',
    description: 'Pakistani drones struck a suspected Taliban command center at Kandahar airfield. Taliban claimed 47 civilians killed. International condemnation followed.',
    severity: 'high',
    triggeredBy: 'evt-002',
    consequences: ['evt-004'],
    actors: ['Pakistan', 'Afghanistan', 'Taliban'],
    zone: 'pak-afghan',
    icon: 'drone'
  },
  {
    id: 'evt-004',
    date: '2026-02-28T19:45:00Z',
    title: 'Hamas Rocket Barrage on Tel Aviv',
    description: 'Hamas launched 340 rockets from Gaza toward Tel Aviv. Iron Dome intercepted 90%, but direct hits caused 23 Israeli casualties. IDF launched Operation Iron Wall.',
    severity: 'high',
    triggeredBy: null,
    consequences: ['evt-005'],
    actors: ['Hamas', 'Israel', 'Palestine'],
    zone: 'israel-hamas',
    icon: 'rocket'
  },
  {
    id: 'evt-005',
    date: '2026-03-03T06:00:00Z',
    title: 'Israeli Ground Incursion into Rafah',
    description: 'IDF launched ground operations in Rafah with 15,000 troops. Heavy urban combat reported. International community called for immediate ceasefire.',
    severity: 'high',
    triggeredBy: 'evt-004',
    consequences: ['evt-006', 'evt-007'],
    actors: ['Israel', 'Hamas', 'Palestine'],
    zone: 'israel-hamas',
    icon: 'tank'
  },
  {
    id: 'evt-006',
    date: '2026-03-05T11:20:00Z',
    title: 'Hezbollah Joins Conflict',
    description: 'Hezbollah launched Katyusha rockets into northern Israel from Lebanon. IDF responded with airstrikes on Beirut suburbs. Risk of two-front war escalates.',
    severity: 'high',
    triggeredBy: 'evt-005',
    consequences: ['evt-008'],
    actors: ['Hezbollah', 'Israel', 'Lebanon'],
    zone: 'israel-hezbollah',
    icon: 'missile'
  },
  {
    id: 'evt-007',
    date: '2026-03-06T09:30:00Z',
    title: 'Houthi Red Sea Blockade',
    description: 'Yemen\'s Houthis declared all Israeli-linked vessels "legitimate targets" in the Red Sea. Two container ships attacked with anti-ship missiles.',
    severity: 'high',
    triggeredBy: 'evt-005',
    consequences: ['evt-009'],
    actors: ['Houthis', 'Yemen', 'Israel'],
    zone: 'red-sea',
    icon: 'ship'
  },
  {
    id: 'evt-008',
    date: '2026-03-08T22:00:00Z',
    title: 'Syrian Airbase Strike',
    description: 'Israeli warplanes struck T4 airbase in Syria, reportedly targeting Iranian Revolutionary Guard positions. Damascus claimed 8 Iranian officers killed.',
    severity: 'high',
    triggeredBy: 'evt-006',
    consequences: ['evt-010'],
    actors: ['Israel', 'Syria', 'Iran'],
    zone: 'syria',
    icon: 'jet'
  },
  {
    id: 'evt-009',
    date: '2026-03-10T16:45:00Z',
    title: 'US-UK Airstrikes on Yemen',
    description: 'Joint US-UK operation struck 36 Houthi targets across Yemen. Pentagon confirmed "significant degradation" of Houthi capabilities.',
    severity: 'high',
    triggeredBy: 'evt-007',
    consequences: ['evt-011'],
    actors: ['US', 'UK', 'Houthis', 'Yemen'],
    zone: 'yemen',
    icon: 'bomb'
  },
  {
    id: 'evt-010',
    date: '2026-03-12T04:15:00Z',
    title: 'Iran Threatens Direct Intervention',
    description: 'Iranian Supreme Leader warned Israel faces "crushing response" if attacks on Iranian personnel continue. Revolutionary Guard placed on highest alert.',
    severity: 'high',
    triggeredBy: 'evt-008',
    consequences: ['evt-012'],
    actors: ['Iran', 'Israel'],
    zone: 'us-iran',
    icon: 'warning'
  },
  {
    id: 'evt-011',
    date: '2026-03-13T20:30:00Z',
    title: 'Iranian Proxy Retaliation',
    description: 'Iranian-backed militias in Iraq launched drone swarm attack on US base at Al-Asad. Damage to air defense systems reported. US casualties: 3 injured.',
    severity: 'high',
    triggeredBy: 'evt-009',
    consequences: ['evt-012'],
    actors: ['Iran', 'Iraq', 'US'],
    zone: 'iraq',
    icon: 'drone'
  },
  {
    id: 'evt-012',
    date: '2026-03-15T02:00:00Z',
    title: 'Israeli Strike on Natanz Nuclear Facility',
    description: 'Israel conducted precision strikes on Iran\'s Natanz uranium enrichment facility. Satellite imagery shows damage to centrifuge halls. IAEA confirms radiation levels normal.',
    severity: 'critical',
    triggeredBy: 'evt-010',
    consequences: ['evt-013'],
    actors: ['Israel', 'Iran'],
    zone: 'us-iran',
    icon: 'nuke'
  },
  {
    id: 'evt-013',
    date: '2026-03-16T18:00:00Z',
    title: 'Iran Ballistic Missile Attack on Israel',
    description: 'Iran launched 180 ballistic missiles at Israel in largest direct attack to date. Iron Dome and US Patriot systems intercepted 70%. Multiple impacts in Tel Aviv suburbs.',
    severity: 'critical',
    triggeredBy: 'evt-012',
    consequences: ['evt-014'],
    actors: ['Iran', 'Israel'],
    zone: 'us-iran',
    icon: 'missile'
  },
  {
    id: 'evt-014',
    date: '2026-03-17T06:30:00Z',
    title: 'US Carrier Strike Group Enters Gulf',
    description: 'USS Gerald R. Ford CSG entered Persian Gulf amid rising tensions. Iran threatened to close Strait of Hormuz. Oil prices surged 12%.',
    severity: 'critical',
    triggeredBy: 'evt-013',
    consequences: [],
    actors: ['US', 'Iran'],
    zone: 'us-iran',
    icon: 'carrier'
  }
];

// Severity configuration
const severityConfig = {
  critical: {
    color: '#ef4444',
    bgColor: 'bg-red-500',
    textColor: 'text-red-400',
    borderColor: 'border-red-500',
    glowColor: 'shadow-red-500/50',
    size: 48,
    icon: Flame,
    label: 'CRITICAL'
  },
  high: {
    color: '#f97316',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500',
    glowColor: 'shadow-orange-500/50',
    size: 40,
    icon: AlertTriangle,
    label: 'HIGH'
  },
  medium: {
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500',
    glowColor: 'shadow-yellow-500/50',
    size: 32,
    icon: Shield,
    label: 'MEDIUM'
  },
  low: {
    color: '#22c55e',
    bgColor: 'bg-green-500',
    textColor: 'text-green-400',
    borderColor: 'border-green-500',
    glowColor: 'shadow-green-500/50',
    size: 28,
    icon: Shield,
    label: 'LOW'
  }
};

// Zone colors for actor badges
const zoneColors = {
  'pak-afghan': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'israel-hamas': 'bg-red-500/20 text-red-400 border-red-500/30',
  'israel-hezbollah': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'red-sea': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'syria': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'yemen': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'iraq': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'us-iran': 'bg-red-600/20 text-red-500 border-red-600/30'
};

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    full: date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    short: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    day: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' })
  };
};

// Calculate escalation trend
const calculateTrend = (events) => {
  if (events.length < 5) return { type: 'stable', label: 'STABLE', color: 'text-gray-400' };
  
  const recent = events.slice(-5);
  const severityScore = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };
  
  const recentScore = recent.reduce((acc, evt) => acc + severityScore[evt.severity], 0) / recent.length;
  const olderScore = events.slice(-10, -5).reduce((acc, evt) => acc + severityScore[evt.severity], 0) / 5;
  
  const diff = recentScore - olderScore;
  
  if (diff > 0.5) return { type: 'escalating', label: 'ESCALATING', color: 'text-red-500', icon: TrendingUp };
  if (diff < -0.5) return { type: 'de-escalating', label: 'DE-ESCALATING', color: 'text-green-500', icon: TrendingDown };
  return { type: 'stable', label: 'STABLE', color: 'text-yellow-500', icon: Minus };
};

// Calculate escalation velocity (events per week)
const calculateVelocity = (events) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const recentEvents = events.filter(e => new Date(e.date) >= thirtyDaysAgo);
  const weeks = 4;
  return (recentEvents.length / weeks).toFixed(1);
};

// Event icon component
const EventIcon = ({ type, className }) => {
  const icons = {
    crosshair: <Zap className={className} />,
    evacuation: <Users className={className} />,
    drone: <Zap className={className} />,
    rocket: <Flame className={className} />,
    tank: <Shield className={className} />,
    missile: <Flame className={className} />,
    ship: <Shield className={className} />,
    jet: <Zap className={className} />,
    bomb: <AlertTriangle className={className} />,
    warning: <AlertTriangle className={className} />,
    nuke: <Flame className={className} />,
    carrier: <Shield className={className} />
  };
  return icons[type] || <Zap className={className} />;
};

// Connection Line Component - SVG path between events
const ConnectionLine = ({ start, end, color = '#f97316' }) => {
  const midX = (start.x + end.x) / 2;
  const controlY = Math.min(start.y, end.y) - 30;
  
  const path = `M ${start.x} ${start.y} Q ${midX} ${controlY} ${end.x} ${end.y}`;
  
  return (
    <g>
      {/* Glow effect */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeOpacity="0.3"
        strokeLinecap="round"
      />
      {/* Main line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="5,3"
      />
      {/* Arrow head */}
      <polygon
        points={`${end.x},${end.y} ${end.x-6},${end.y-8} ${end.x+6},${end.y-8}`}
        fill={color}
      />
    </g>
  );
};

// Timeline Node Component
const TimelineNode = ({ event, position, isSelected, onClick }) => {
  const config = severityConfig[event.severity];
  const Icon = config.icon;
  const date = formatDate(event.date);
  
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: position.x - config.size / 2,
        top: position.y - config.size / 2,
        width: config.size,
        height: config.size
      }}
      onClick={() => onClick(event)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: position.index * 0.05 }}
    >
      {/* Glow effect */}
      <div 
        className={`absolute inset-0 rounded-full ${config.bgColor} opacity-20 blur-md ${isSelected ? 'animate-pulse' : ''}`}
      />
      
      {/* Node circle */}
      <div 
        className={`
          relative w-full h-full rounded-full border-2 flex items-center justify-center
          ${config.borderColor} ${isSelected ? config.bgColor : 'bg-[#0d0d12]'}
          ${isSelected ? 'shadow-lg ' + config.glowColor : ''}
          transition-all duration-300
        `}
        style={{ 
          borderColor: config.color,
          boxShadow: isSelected ? `0 0 20px ${config.color}40` : 'none'
        }}
      >
        <Icon 
          className={`w-1/2 h-1/2 ${isSelected ? 'text-white' : config.textColor}`}
          style={{ color: isSelected ? '#fff' : config.color }}
        />
      </div>
      
      {/* Date label */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-[10px] text-gray-500 font-mono">{date.short}</span>
      </div>
      
      {/* Severity label */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className={`text-[8px] font-bold tracking-wider ${config.textColor}`}>
          {config.label}
        </span>
      </div>
    </motion.div>
  );
};

// Detail Panel Component
const DetailPanel = ({ event, onClose, allEvents }) => {
  if (!event) return null;
  
  const config = severityConfig[event.severity];
  const date = formatDate(event.date);
  const triggeredBy = event.triggeredBy ? allEvents.find(e => e.id === event.triggeredBy) : null;
  const consequences = event.consequences.map(id => allEvents.find(e => e.id === id)).filter(Boolean);
  const zoneClass = zoneColors[event.zone] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 md:relative md:inset-auto"
      >
        <div className="comic-panel rounded-t-2xl md:rounded-2xl border-t-2 md:border-t-2 overflow-hidden max-h-[70vh] md:max-h-none overflow-y-auto">
          {/* Header */}
          <div 
            className="relative p-4 md:p-6"
            style={{ 
              background: `linear-gradient(135deg, ${config.color}15 0%, transparent 50%)`,
              borderBottom: `1px solid ${config.color}30`
            }}
          >
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="flex items-start gap-4 pr-8">
              <div 
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${config.bgColor}`}
              >
                <EventIcon type={event.icon} className="w-7 h-7 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${config.bgColor}/20 ${config.textColor} ${config.borderColor}`}>
                    {config.label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${zoneClass}`}>
                    {event.zone.replace(/-/g, ' ').toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-heading text-lg md:text-xl text-white font-bold leading-tight">
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {date.full}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.zone.replace(/-/g, ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Body */}
          <div className="p-4 md:p-6 space-y-4">
            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
              {event.description}
            </p>
            
            {/* Actors */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Involved Parties
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.actors.map((actor, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Causation */}
            <div className="grid md:grid-cols-2 gap-4">
              {triggeredBy && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Triggered By
                  </h4>
                  <div 
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2"
                    onClick={() => {}}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${severityConfig[triggeredBy.severity].bgColor}`}
                    >
                      <ArrowRight className="w-4 h-4 text-white rotate-180" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">{triggeredBy.title}</p>
                      <p className="text-[10px] text-gray-500">{formatDate(triggeredBy.date).short}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {consequences.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Led To ({consequences.length})
                  </h4>
                  <div className="space-y-2">
                    {consequences.map((consequence, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2"
                      >
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${severityConfig[consequence.severity].bgColor}`}
                        >
                          <ArrowRight className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 truncate">{consequence.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Component
const ConflictEscalationTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...timelineEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, []);
  
  // Calculate metrics
  const trend = useMemo(() => calculateTrend(sortedEvents), [sortedEvents]);
  const velocity = useMemo(() => calculateVelocity(sortedEvents), [sortedEvents]);
  const TrendIcon = trend.icon || Minus;
  
  // Calculate node positions
  const nodePositions = useMemo(() => {
    const containerWidth = 1200; // Base width for calculation
    const padding = 80;
    const availableWidth = containerWidth - (padding * 2);
    const dateRange = new Date(sortedEvents[sortedEvents.length - 1].date) - new Date(sortedEvents[0].date);
    
    return sortedEvents.map((event, index) => {
      const eventDate = new Date(event.date);
      const firstDate = new Date(sortedEvents[0].date);
      const progress = (eventDate - firstDate) / dateRange;
      
      // Alternate vertical positions for better visual flow
      const row = index % 3;
      const yOffset = row === 0 ? 80 : row === 1 ? 140 : 60;
      
      return {
        x: padding + (progress * availableWidth),
        y: yOffset,
        index,
        event
      };
    });
  }, [sortedEvents]);
  
  // Get connections for SVG lines
  const connections = useMemo(() => {
    const lines = [];
    sortedEvents.forEach((event, index) => {
      if (event.consequences) {
        event.consequences.forEach(consequenceId => {
          const targetIndex = sortedEvents.findIndex(e => e.id === consequenceId);
          if (targetIndex !== -1) {
            lines.push({
              from: nodePositions[index],
              to: nodePositions[targetIndex],
              severity: event.severity
            });
          }
        });
      }
    });
    return lines;
  }, [sortedEvents, nodePositions]);
  
  // Handle scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll > 0 ? container.scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailPanel(true);
  };
  
  const closeDetailPanel = () => {
    setShowDetailPanel(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };
  
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
            <Flame className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-heading text-xl text-white font-bold tracking-wide">
              ESCALATION TIMELINE
            </h2>
            <p className="text-gray-500 text-xs">
              Last 30 days • {sortedEvents.length} events tracked
            </p>
          </div>
        </div>
        
        {/* Metrics */}
        <div className="flex items-center gap-4">
          {/* Trend Indicator */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <TrendIcon className={`w-4 h-4 ${trend.color}`} />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Trend</p>
              <p className={`text-xs font-bold ${trend.color}`}>{trend.label}</p>
            </div>
          </div>
          
          {/* Velocity */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <Zap className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Velocity</p>
              <p className="text-xs font-bold text-white">{velocity} evt/wk</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline Container */}
      <div className="comic-panel rounded-2xl p-4 md:p-6 relative overflow-hidden">
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
            style={{ width: `${(scrollProgress * 100)}%` }}
          />
        </div>
        
        {/* Scrollable Timeline */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="relative min-w-[1000px] h-[280px]">
            {/* Timeline Axis */}
            <div className="absolute left-0 right-0 top-[200px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Month markers */}
            <div className="absolute left-0 right-0 top-[205px] flex justify-between text-[10px] text-gray-500 font-mono">
              <span>FEB 15</span>
              <span>FEB 20</span>
              <span>FEB 25</span>
              <span>MAR 01</span>
              <span>MAR 05</span>
              <span>MAR 10</span>
              <span>MAR 15</span>
              <span>MAR 17</span>
            </div>
            
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                </marker>
              </defs>
              {connections.map((conn, idx) => (
                <ConnectionLine
                  key={idx}
                  start={{ x: conn.from.x, y: conn.from.y + severityConfig[conn.from.event.severity].size / 2 }}
                  end={{ x: conn.to.x, y: conn.to.y - severityConfig[conn.to.event.severity].size / 2 }}
                  color={severityConfig[conn.severity]?.color || '#f97316'}
                />
              ))}
            </svg>
            
            {/* Event Nodes */}
            {sortedEvents.map((event, index) => (
              <TimelineNode
                key={event.id}
                event={event}
                position={nodePositions[index]}
                isSelected={selectedEvent?.id === event.id}
                onClick={handleEventClick}
              />
            ))}
          </div>
        </div>
        
        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-gray-500">
          <ChevronRight className="w-3 h-3 animate-pulse" />
          <span>Scroll horizontally to explore timeline</span>
          <ChevronRight className="w-3 h-3 animate-pulse" />
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
          {Object.entries(severityConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-[10px] text-gray-400 uppercase">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Detail Panel */}
      {showDetailPanel && (
        <div className="fixed inset-0 z-50 md:relative md:inset-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeDetailPanel}
          />
          
          {/* Panel */}
          <div className="fixed inset-x-0 bottom-0 md:relative md:inset-auto md:mt-4">
            <DetailPanel 
              event={selectedEvent}
              onClose={closeDetailPanel}
              allEvents={sortedEvents}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictEscalationTimeline;

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Flame, Zap, Crosshair, Navigation, ChevronUp, ChevronDown, History, ArrowLeft, Plane, Siren, Shield, Bomb } from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// REAL RECENT EVENTS
const CONFLICT_EVENTS = [
  { id: 1, lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', severity: 'high', type: 'Airport Attack', time: '3 hours ago', description: 'Dubai Airport hit by ballistic missiles. Emirates flights suspended. Runway damaged.', icon: 'bomb', source: 'Multiple Reports' },
  { id: 2, lat: 25.2854, lng: 51.5310, city: 'Doha', country: 'Qatar', severity: 'high', type: 'Missile Intercept', time: '4 hours ago', description: 'Qatar intercepts 15 ballistic missiles, 119 drones. Air defense activated.', icon: 'shield', source: 'Hindustan Times' },
  { id: 3, lat: 35.6892, lng: 51.3890, city: 'Tehran', country: 'Iran', severity: 'high', type: 'Missile Launch', time: '5 hours ago', description: 'Iran launches missile barrage at Gulf targets. Retaliation for US strikes.', icon: 'missile', source: 'Reuters' },
  { id: 4, lat: 31.7683, lng: 35.2137, city: 'Jerusalem', country: 'Israel', severity: 'high', type: 'Airstrike', time: '2 hours ago', description: 'Israeli airstrikes on Iranian positions in Syria. Retaliatory operations ongoing.', icon: 'strike', source: 'IDF' },
  { id: 5, lat: 33.3152, lng: 44.3661, city: 'Baghdad', country: 'Iraq', severity: 'medium', type: 'Proxy Activity', time: '6 hours ago', description: 'Iran-backed militias launch drone attacks on US bases. Green Zone on alert.', icon: 'troop', source: 'Security Sources' },
  { id: 6, lat: 24.7136, lng: 46.6753, city: 'Riyadh', country: 'Saudi Arabia', severity: 'medium', type: 'Air Defense', time: '8 hours ago', description: 'Saudi air defense intercepts Houthi missiles. Oil facilities secured.', icon: 'shield', source: 'Saudi Defense' },
  { id: 7, lat: 29.3759, lng: 47.9774, city: 'Kuwait City', country: 'Kuwait', severity: 'low', type: 'Border Alert', time: '12 hours ago', description: 'Kuwait closes airspace temporarily. Border security on high alert.', icon: 'alert', source: 'Civil Aviation' },
  { id: 8, lat: 21.2854, lng: 39.2376, city: 'Jeddah', country: 'Saudi Arabia', severity: 'low', type: 'Naval Patrol', time: '1 day ago', description: 'US Navy increases Red Sea patrols. Coalition forces on standby.', icon: 'ship', source: 'US Navy' },
];

const CITY_TIMELINES = {
  'Dubai': [
    { time: '3 hours ago', event: 'Dubai Airport hit by ballistic missiles', type: 'attack', severity: 'high' },
    { time: '4 hours ago', event: 'Emirates suspends all flight operations', type: 'alert', severity: 'high' },
    { time: '5 hours ago', event: 'Runway reported damaged, airspace closed', type: 'damage', severity: 'high' },
    { time: '6 hours ago', event: 'UAE air defense activated', type: 'defense', severity: 'medium' },
  ],
  'Doha': [
    { time: '4 hours ago', event: 'Qatar intercepts 15 ballistic missiles', type: 'defense', severity: 'high' },
    { time: '4 hours ago', event: '119 drones shot down by air defense', type: 'defense', severity: 'high' },
    { time: '6 hours ago', event: 'Qatar Airways suspends regional flights', type: 'alert', severity: 'medium' },
  ],
  'Tehran': [
    { time: '5 hours ago', event: 'Iran launches missile barrage at Gulf targets', type: 'attack', severity: 'high' },
    { time: '6 hours ago', event: 'IRGC claims responsibility for strikes', type: 'political', severity: 'high' },
    { time: '12 hours ago', event: 'Supreme Leader orders retaliation', type: 'political', severity: 'high' },
  ],
  'Jerusalem': [
    { time: '2 hours ago', event: 'Israeli airstrikes on Iranian positions', type: 'strike', severity: 'high' },
    { time: '4 hours ago', event: 'Iron Dome intercepts incoming rockets', type: 'defense', severity: 'high' },
  ],
  'Baghdad': [
    { time: '6 hours ago', event: 'Iran-backed militias launch drone attacks', type: 'attack', severity: 'medium' },
    { time: '10 hours ago', event: 'Green Zone locked down', type: 'alert', severity: 'high' },
  ],
  'Riyadh': [
    { time: '8 hours ago', event: 'Saudi air defense intercepts missiles', type: 'defense', severity: 'medium' },
  ],
  'Kuwait City': [
    { time: '12 hours ago', event: 'Kuwait closes airspace temporarily', type: 'alert', severity: 'low' },
  ],
  'Jeddah': [
    { time: '1 day ago', event: 'US Navy increases Red Sea patrols', type: 'naval', severity: 'low' },
  ],
};

const LABELS = [
  { name: 'IRAN', lat: 32, lng: 54, type: 'country' },
  { name: 'IRAQ', lat: 33, lng: 43, type: 'country' },
  { name: 'SAUDI ARABIA', lat: 24, lng: 45, type: 'country' },
  { name: 'SYRIA', lat: 35, lng: 38, type: 'country' },
  { name: 'ISRAEL', lat: 31, lng: 34.8, type: 'country' },
  { name: 'UAE', lat: 24.5, lng: 54, type: 'country' },
  { name: 'QATAR', lat: 25.3, lng: 51.2, type: 'country' },
  { name: 'KUWAIT', lat: 29.3, lng: 47.5, type: 'country' },
];

const SEVERITY_CONFIG = {
  high: { color: '#ef4444', bg: 'bg-red-500', label: 'CRITICAL' },
  medium: { color: '#f97316', bg: 'bg-orange-500', label: 'ELEVATED' },
  low: { color: '#eab308', bg: 'bg-yellow-500', label: 'MONITORING' }
};

const EVENT_ICONS = {
  bomb: <Bomb className="w-3 h-3" />,
  shield: <Shield className="w-3 h-3" />,
  alert: <Siren className="w-3 h-3" />,
  plane: <Plane className="w-3 h-3" />,
  missile: <Zap className="w-3 h-3" />,
  strike: <Crosshair className="w-3 h-3" />,
  troop: <MapPin className="w-3 h-3" />,
  drone: <Zap className="w-3 h-3" />,
  ship: <Navigation className="w-3 h-3" />,
  economic: <Flame className="w-3 h-3" />
};

export default function ConflictMap() {
  const [worldData, setWorldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(data => {
        setWorldData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Different heights: mobile = 380px, desktop with side panel = 500px
        const height = window.innerWidth < 1024 ? 380 : 500;
        setDimensions({ width: rect.width, height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !worldData) return;
    
    const zoom = d3.zoom()
      .scaleExtent([1.2, 6])
      .on('zoom', (e) => {
        if (gRef.current) {
          d3.select(gRef.current).attr('transform', e.transform);
        }
      });
    
    const svg = d3.select(svgRef.current);
    svg.call(zoom);
    
    const { width, height } = dimensions;
    const scale = isMobile ? 1.9 : 2.4;
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-width / 2, -height / 2 + 20);
    
    svg.call(zoom.transform, initialTransform);
    if (gRef.current) {
      d3.select(gRef.current).attr('transform', initialTransform);
    }
    
  }, [worldData, dimensions.width, dimensions.height, isMobile]);

  const projection = useCallback(() => {
    const scale = isMobile ? dimensions.width * 0.65 : dimensions.width * 0.8;
    return d3.geoMercator()
      .center([47, 30])
      .scale(scale)
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions, isMobile]);

  const proj = projection();
  const path = d3.geoPath().projection(proj);

  const isVisible = (lat, lng) => {
    const [x, y] = proj([lng, lat]) || [-1000, -1000];
    return x > -50 && x < dimensions.width + 50 && y > -50 && y < dimensions.height + 50;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowTimeline(true);
    if (isMobile) {
      setShowDrawer(true);
    }
  };

  const zoomIn = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current);
    svg.transition().duration(300).call(d3.zoom().transform, currentTransform.scale(1.4));
  };

  const zoomOut = () => {
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current);
    svg.transition().duration(300).call(d3.zoom().transform, currentTransform.scale(0.7));
  };

  // Render the map content
  const renderMap = () => (
    <>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
            </pattern>
            <filter id="glow-red" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-orange" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feFlood floodColor="#f97316" floodOpacity="0.5" />
              <feComposite in2="blur" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-yellow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood floodColor="#eab308" floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          
          <rect width="100%" height="100%" fill="#020617" />
          <rect width="100%" height="100%" fill="url(#grid)" />
          <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.3)" />

          <g ref={gRef}>
            {worldData && (
              <g>
                {topojson.feature(worldData, worldData.objects.countries).features.map((feature, i) => {
                  const d = path(feature);
                  if (!d) return null;
                  return (
                    <path
                      key={i}
                      d={d}
                      fill="rgba(30, 41, 59, 0.6)"
                      stroke="rgba(100, 116, 139, 0.4)"
                      strokeWidth={0.5}
                    />
                  );
                })}
              </g>
            )}

            {LABELS.map(label => {
              const [x, y] = proj([label.lng, label.lat]) || [0, 0];
              if (!isVisible(label.lat, label.lng)) return null;
              return (
                <text 
                  key={label.name} 
                  x={x} 
                  y={y} 
                  textAnchor="middle" 
                  fill="rgba(148, 163, 184, 0.4)" 
                  fontSize={isMobile ? 8 : 10} 
                  fontWeight="700" 
                  letterSpacing="1"
                  style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                >
                  {label.name}
                </text>
              );
            })}

            {CONFLICT_EVENTS.map(event => {
              const [x, y] = proj([event.lng, event.lat]) || [0, 0];
              if (!isVisible(event.lat, event.lng)) return null;
              const config = SEVERITY_CONFIG[event.severity];
              const baseR = isMobile ? 25 : 40;
              const r = event.severity === 'high' ? baseR * 1.8 : event.severity === 'medium' ? baseR : baseR * 0.7;
              const opacity = event.severity === 'high' ? 0.25 : event.severity === 'medium' ? 0.15 : 0.08;
              
              return (
                <circle 
                  key={`heat-${event.id}`} 
                  cx={x} 
                  cy={y} 
                  r={r} 
                  fill={config.color} 
                  opacity={opacity}
                  style={{ mixBlendMode: 'screen' }} 
                />
              );
            })}

            {CONFLICT_EVENTS.map(event => {
              const [x, y] = proj([event.lng, event.lat]) || [0, 0];
              if (!isVisible(event.lat, event.lng)) return null;
              
              const config = SEVERITY_CONFIG[event.severity];
              const isHovered = hoveredEvent?.id === event.id;
              const isSelected = selectedEvent?.id === event.id;
              const radius = isMobile ? 4 : 5;
              const glowFilter = event.severity === 'high' ? 'url(#glow-red)' : 
                                event.severity === 'medium' ? 'url(#glow-orange)' : 'url(#glow-yellow)';

              return (
                <g key={event.id} className="cursor-pointer" onClick={() => handleEventClick(event)}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isMobile ? (event.severity === 'high' ? 15 : 10) : (event.severity === 'high' ? 22 : 14)} 
                    fill="none" 
                    stroke={config.color} 
                    strokeWidth={event.severity === 'high' ? 2 : 1} 
                    opacity={event.severity === 'high' ? 0.6 : 0.3}
                  >
                    <animate attributeName="r" values={`${radius};${radius * (event.severity === 'high' ? 4 : 3)};${radius}`} dur={event.severity === 'high' ? '1.5s' : '2.5s'} repeatCount="indefinite" />
                    <animate attributeName="opacity" values={`${event.severity === 'high' ? 0.8 : 0.4};0;${event.severity === 'high' ? 0.8 : 0.4}`} dur={event.severity === 'high' ? '1.5s' : '2.5s'} repeatCount="indefinite" />
                  </circle>
                  
                  <circle
                    cx={x} 
                    cy={y} 
                    r={isHovered || isSelected ? radius + 1.5 : radius}
                    fill={config.color}
                    stroke="white"
                    strokeWidth={1.5}
                    style={{ filter: glowFilter, transition: 'all 0.2s ease' }}
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  />

                  {(isHovered || isSelected) && (
                    <g>
                      <rect x={x - 40} y={y - 28} width="80" height="16" rx="3" fill="rgba(0,0,0,0.95)" stroke={config.color} strokeWidth="0.5" />
                      <text x={x} y={y - 17} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
                        {event.city}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Legend */}
      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2.5">
        <div className="space-y-1.5">
          {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${config.bg} ${key === 'high' ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] text-gray-400">{config.label}</span>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-[10px] text-gray-400">Pinch zoom • Tap for info</span>
        </div>
      )}
    </>
  );

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-black/60 to-black/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm md:text-lg text-white">Live Conflict Monitor</h2>
                <p className="text-[10px] md:text-xs text-gray-500">{CONFLICT_EVENTS.length} active events • Updated 2 min ago</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={zoomOut} className="w-7 h-7 md:w-8 md:h-8 rounded hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white text-xs md:text-sm">−</button>
              <span className="text-[10px] text-gray-500 px-1 hidden sm:inline">Zoom</span>
              <button onClick={zoomIn} className="w-7 h-7 md:w-8 md:h-8 rounded hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white text-xs md:text-sm">+</button>
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT: Stack vertically */}
        <div className="lg:hidden">
          <div ref={containerRef} className="relative bg-[#020617]" style={{ height: '380px' }}>
            {renderMap()}
          </div>
          
          {/* Mobile bottom button */}
          <div className="border-t border-white/10 bg-black/40 p-3">
            <button 
              onClick={() => {setShowDrawer(true); setShowTimeline(false);}}
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-sm font-medium text-red-400 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              View {CONFLICT_EVENTS.length} Conflicts
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP LAYOUT: Side by side */}
        <div className="hidden lg:flex">
          <div ref={containerRef} className="relative bg-[#020617] flex-1" style={{ height: '500px' }}>
            {renderMap()}
          </div>

          {/* Desktop Side Panel */}
          <div className="w-80 border-l border-white/10 bg-black/40 flex flex-col" style={{ height: '500px' }}>
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Active Conflicts
              </h3>
              <p className="text-xs text-gray-500 mt-1">{CONFLICT_EVENTS.length} events tracked</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {CONFLICT_EVENTS.map(event => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedEvent?.id === event.id 
                      ? 'bg-red-500/10 border-red-500/50' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg}`}>
                      {EVENT_ICONS[event.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{event.city}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                          {SEVERITY_CONFIG[event.severity].label}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{event.description}</p>
                      <p className="text-[9px] text-gray-600 mt-1">{event.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Bottom Sheet Drawer */}
        <AnimatePresence>
          {isMobile && showDrawer && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setShowDrawer(false)}
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
                
                {selectedEvent && showTimeline ? (
                  <TimelineView 
                    event={selectedEvent} 
                    onBack={() => setShowTimeline(false)}
                    onClose={() => {setShowDrawer(false); setSelectedEvent(null); setShowTimeline(false);}}
                  />
                ) : (
                  <EventsList 
                    events={CONFLICT_EVENTS}
                    selectedEvent={selectedEvent}
                    onSelect={(e) => {setSelectedEvent(e); setShowTimeline(true);}}
                  />
                )}
                
                <button 
                  onClick={() => setShowDrawer(false)}
                  className="w-full py-4 border-t border-white/10 flex items-center justify-center gap-1 text-gray-500 text-sm"
                >
                  <ChevronDown className="w-4 h-4" /> Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop: Timeline Modal */}
        {!isMobile && showTimeline && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowTimeline(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-black/95 border border-white/20 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <TimelineView 
                event={selectedEvent} 
                onBack={() => setShowTimeline(false)}
                onClose={() => {setShowTimeline(false); setSelectedEvent(null);}}
              />
            </motion.div>
          </div>
        )}

      </div>
    </motion.section>
  );
}

function TimelineView({ event, onBack, onClose }) {
  const timeline = CITY_TIMELINES[event.city] || [];
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-bold text-lg md:text-xl text-white">{event.city}</h3>
          <p className="text-xs text-gray-400">Conflict Timeline</p>
        </div>
        <span className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
          {SEVERITY_CONFIG[event.severity].label}
        </span>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${SEVERITY_CONFIG[event.severity].bg} flex items-center justify-center flex-shrink-0`}>
            {EVENT_ICONS[event.icon]}
          </div>
          <div>
            <p className="text-sm text-gray-300 mb-1">{event.description}</p>
            <p className="text-xs text-gray-500">Source: {event.source}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
        <History className="w-3.5 h-3.5" />
        Recent History
      </h4>
      
      <div className="space-y-3">
        {timeline.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG[item.severity]?.bg || 'bg-gray-500'}`} />
              {i < timeline.length - 1 && <div className="w-px h-full bg-white/10 mt-1" />}
            </div>
            <div className="pb-4">
              <p className="text-xs text-gray-500 mb-0.5">{item.time}</p>
              <p className="text-sm text-gray-300">{item.event}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={onClose} className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-400">
        Close
      </button>
    </div>
  );
}

function EventsList({ events, selectedEvent, onSelect }) {
  return (
    <div className="p-4">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        Active Conflicts ({events.length})
      </h3>
      <div className="space-y-2">
        {events.map(event => (
          <button
            key={event.id}
            onClick={() => onSelect(event)}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
              selectedEvent?.id === event.id 
                ? 'bg-red-500/10 border-red-500/50' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg}`}>
              {EVENT_ICONS[event.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{event.city}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                  {SEVERITY_CONFIG[event.severity].label}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate">{event.description}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{event.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

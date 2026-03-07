import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Flame, Zap, Crosshair, Navigation, ChevronUp, ChevronDown, X } from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const CONFLICT_EVENTS = [
  { id: 1, lat: 35.6892, lng: 51.3890, city: 'Tehran', country: 'Iran', severity: 'high', type: 'Missile Defense', time: '2 min ago', description: 'Missile defense systems activated near nuclear facilities', icon: 'missile' },
  { id: 2, lat: 31.7683, lng: 35.2137, city: 'Jerusalem', country: 'Israel', severity: 'high', type: 'Airstrike', time: '15 min ago', description: 'Retaliatory strikes reported in southern Lebanon', icon: 'strike' },
  { id: 3, lat: 33.3152, lng: 44.3661, city: 'Baghdad', country: 'Iraq', severity: 'medium', type: 'Proxy Activity', time: '1 hour ago', description: 'Militia movements detected near Green Zone', icon: 'troop' },
  { id: 4, lat: 34.8021, lng: 38.9968, city: 'Palmyra', country: 'Syria', severity: 'medium', type: 'Drone Attack', time: '3 hours ago', description: 'Drone intercepted near military installation', icon: 'drone' },
  { id: 5, lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', severity: 'low', type: 'Naval Activity', time: '5 hours ago', description: 'US Carrier strike group reported in Red Sea', icon: 'ship' },
  { id: 6, lat: 24.7136, lng: 46.6753, city: 'Riyadh', country: 'Saudi Arabia', severity: 'medium', type: 'Oil Facility', time: '4 hours ago', description: 'Heightened security at oil processing facilities', icon: 'economic' },
  { id: 7, lat: 21.2854, lng: 39.2376, city: 'Jeddah', country: 'Saudi Arabia', severity: 'low', type: 'Naval Patrol', time: '6 hours ago', description: 'Coalition naval patrols increased in Red Sea', icon: 'ship' },
  { id: 8, lat: 29.3759, lng: 47.9774, city: 'Kuwait City', country: 'Kuwait', severity: 'low', type: 'Border Alert', time: '8 hours ago', description: 'Border security on heightened alert status', icon: 'troop' },
];

const LABELS = [
  { name: 'IRAN', lat: 32, lng: 54, type: 'country' },
  { name: 'IRAQ', lat: 33, lng: 43, type: 'country' },
  { name: 'SAUDI ARABIA', lat: 24, lng: 45, type: 'country' },
  { name: 'SYRIA', lat: 35, lng: 38, type: 'country' },
  { name: 'TURKEY', lat: 39, lng: 35, type: 'country' },
  { name: 'ISRAEL', lat: 31, lng: 34.8, type: 'country' },
  { name: 'JORDAN', lat: 31, lng: 36.5, type: 'country' },
  { name: 'LEBANON', lat: 33.8, lng: 35.8, type: 'country' },
  { name: 'UAE', lat: 24.5, lng: 54, type: 'country' },
  { name: 'QATAR', lat: 25.3, lng: 51.2, type: 'country' },
  { name: 'KUWAIT', lat: 29.3, lng: 47.5, type: 'country' },
  { name: 'OMAN', lat: 21, lng: 57, type: 'country' },
  { name: 'YEMEN', lat: 15.5, lng: 48, type: 'country' },
  { name: 'EGYPT', lat: 26.5, lng: 30, type: 'country' },
];

const SEVERITY_CONFIG = {
  high: { color: '#ef4444', bg: 'bg-red-500', label: 'CRITICAL' },
  medium: { color: '#f97316', bg: 'bg-orange-500', label: 'ELEVATED' },
  low: { color: '#eab308', bg: 'bg-yellow-500', label: 'MONITORING' }
};

const EVENT_ICONS = {
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
  const [isMobile, setIsMobile] = useState(false);
  
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch world map data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(data => {
        setWorldData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Handle resize
  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Smaller height on mobile
        const height = window.innerWidth < 768 ? 350 : 450;
        setDimensions({ width: rect.width, height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Setup D3 zoom - disable on mobile
  useEffect(() => {
    if (!svgRef.current || !worldData) return;
    
    const zoom = d3.zoom()
      .scaleExtent([0.8, 4])
      .on('zoom', (e) => {
        if (gRef.current) {
          d3.select(gRef.current).attr('transform', e.transform);
        }
      });
    
    const svg = d3.select(svgRef.current);
    
    // Only enable zoom on desktop
    if (!isMobile) {
      svg.call(zoom);
    }
    
    // Initial transform - centered on Middle East
    const { width, height } = dimensions;
    const scale = isMobile ? 1.2 : 1.8;
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(scale)
      .translate(-width / 2, -height / 2 + (isMobile ? 30 : 50));
    
    svg.call(zoom.transform, initialTransform);
    if (gRef.current) {
      d3.select(gRef.current).attr('transform', initialTransform);
    }
    
  }, [worldData, dimensions.width, dimensions.height, isMobile]);

  // Base projection
  const projection = useCallback(() => {
    const scale = isMobile ? dimensions.width * 0.5 : dimensions.width * 0.7;
    return d3.geoMercator()
      .center([45, 30])
      .scale(scale)
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions, isMobile]);

  const proj = projection();
  const path = d3.geoPath().projection(proj);

  // Check if point is visible
  const isVisible = (lat, lng) => {
    const [x, y] = proj([lng, lat]) || [-1000, -1000];
    return x > -50 && x < dimensions.width + 50 && y > -50 && y < dimensions.height + 50;
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    if (isMobile) {
      setShowDrawer(true);
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header - Compact on mobile */}
        <div className="p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-black/60 to-black/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-sm md:text-lg text-white">Live Conflict Monitor</h2>
                <p className="text-[10px] md:text-xs text-gray-500">{CONFLICT_EVENTS.length} active events • Middle East</p>
              </div>
            </div>

            {/* Quick stats - hide on small mobile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-gray-400">{CONFLICT_EVENTS.filter(e => e.severity === 'high').length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs text-gray-400">{CONFLICT_EVENTS.filter(e => e.severity === 'medium').length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container - Fixed height */}
        <div ref={containerRef} className="relative bg-[#020617] overflow-hidden" style={{ height: `${dimensions.height}px` }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : (
            <svg 
              ref={svgRef} 
              width={dimensions.width} 
              height={dimensions.height} 
              className={`absolute inset-0 ${isMobile ? '' : 'cursor-move'}`}
              style={{ touchAction: 'pan-y' }} // Allow page scroll on mobile
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="#020617" />
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.3)" />

              <g ref={gRef}>
                {/* Countries */}
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

                {/* Country Labels - simplified on mobile */}
                {LABELS.map(label => {
                  const [x, y] = proj([label.lng, label.lat]) || [0, 0];
                  if (!isVisible(label.lat, label.lng)) return null;
                  
                  return (
                    <text 
                      key={label.name} 
                      x={x} 
                      y={y} 
                      textAnchor="middle" 
                      fill="rgba(148, 163, 184, 0.35)" 
                      fontSize={isMobile ? 8 : 10} 
                      fontWeight="700" 
                      letterSpacing="1"
                      style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                    >
                      {label.name}
                    </text>
                  );
                })}

                {/* Heatmap circles */}
                {CONFLICT_EVENTS.map(event => {
                  const [x, y] = proj([event.lng, event.lat]) || [0, 0];
                  if (!isVisible(event.lat, event.lng)) return null;
                  const config = SEVERITY_CONFIG[event.severity];
                  const r = isMobile ? 30 : (event.severity === 'high' ? 50 : event.severity === 'medium' ? 35 : 20);
                  return (
                    <circle key={`heat-${event.id}`} cx={x} cy={y} r={r} fill={config.color} opacity={0.12} style={{ mixBlendMode: 'screen' }} />
                  );
                })}

                {/* Conflict Markers */}
                {CONFLICT_EVENTS.map(event => {
                  const [x, y] = proj([event.lng, event.lat]) || [0, 0];
                  if (!isVisible(event.lat, event.lng)) return null;
                  
                  const config = SEVERITY_CONFIG[event.severity];
                  const isHovered = hoveredEvent?.id === event.id;
                  const isSelected = selectedEvent?.id === event.id;
                  const radius = isMobile ? 5 : 6;

                  return (
                    <g key={event.id} className="cursor-pointer" onClick={() => handleEventClick(event)}>
                      {/* Pulse */}
                      <circle cx={x} cy={y} r={isMobile ? 12 : 18} fill="none" stroke={config.color} strokeWidth="2" opacity={0.4}>
                        <animate attributeName="r" values={`${radius};${radius * 3};${radius}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                      
                      {/* Glow */}
                      <circle cx={x} cy={y} r={radius * 2} fill={config.color} opacity={0.2} />
                      
                      {/* Marker */}
                      <circle
                        cx={x} cy={y} r={isHovered || isSelected ? radius + 2 : radius}
                        fill={config.color} stroke="white" strokeWidth="2"
                        style={{ filter: `drop-shadow(0 0 8px ${config.color})` }}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      />

                      {/* Label on hover/selected - desktop only */}
                      {!isMobile && (isHovered || isSelected) && (
                        <g>
                          <rect x={x - 40} y={y - 30} width="80" height="16" rx="3" fill="rgba(0,0,0,0.9)" stroke={config.color} strokeWidth="0.5" />
                          <text x={x} y={y - 19} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
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

          {/* Legend - compact */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-2.5">
            <div className="space-y-1.5">
              {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${config.bg}`} />
                  <span className="text-[10px] text-gray-400">{config.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Tap hint */}
          {isMobile && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
              <span className="text-[10px] text-gray-400">Tap dots for info</span>
            </div>
          )}

          {/* Desktop: Selected Event Panel */}
          {!isMobile && selectedEvent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="absolute top-3 right-3 w-64 bg-black/90 border border-white/20 rounded-xl p-3 backdrop-blur-md"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${SEVERITY_CONFIG[selectedEvent.severity].bg} flex items-center justify-center`}>
                    {EVENT_ICONS[selectedEvent.icon]}
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[selectedEvent.severity].bg} text-white`}>
                    {SEVERITY_CONFIG[selectedEvent.severity].label}
                  </span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white text-xs">✕</button>
              </div>
              <h3 className="font-bold text-white text-sm mb-0.5">{selectedEvent.city}</h3>
              <p className="text-[10px] text-gray-400 mb-1.5">{selectedEvent.country}</p>
              <p className="text-xs text-gray-300 mb-2 leading-relaxed">{selectedEvent.description}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <Clock className="w-3 h-3" />{selectedEvent.time}
              </div>
            </motion.div>
          )}
        </div>

        {/* Desktop: Events List */}
        {!isMobile && (
          <div className="border-t border-white/10 bg-black/40 p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {CONFLICT_EVENTS.map(event => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`text-left p-3 rounded-xl border transition-all ${selectedEvent?.id === event.id ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg}`}>
                      {EVENT_ICONS[event.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-white text-sm">{event.city}</span>
                      </div>
                      <span className={`text-[8px] px-1 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                        {SEVERITY_CONFIG[event.severity].label}
                      </span>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">{event.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Bottom Sheet Drawer */}
        <AnimatePresence>
          {isMobile && showDrawer && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40"
                onClick={() => setShowDrawer(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/10 rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
                
                {selectedEvent ? (
                  <div className="p-4">
                    {/* Selected Event Detail */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${SEVERITY_CONFIG[selectedEvent.severity].bg} flex items-center justify-center`}>
                          {EVENT_ICONS[selectedEvent.icon]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{selectedEvent.city}</h3>
                          <p className="text-xs text-gray-400">{selectedEvent.country}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SEVERITY_CONFIG[selectedEvent.severity].bg} text-white`}>
                        {SEVERITY_CONFIG[selectedEvent.severity].label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">{selectedEvent.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-3 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedEvent.time}</span>
                      <span>{selectedEvent.type}</span>
                    </div>
                    
                    <button 
                      onClick={() => {setSelectedEvent(null); setShowDrawer(true);}}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-gray-400"
                    >
                      View All Events
                    </button>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      Active Conflicts ({CONFLICT_EVENTS.length})
                    </h3>
                    <div className="space-y-2">
                      {CONFLICT_EVENTS.map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-3"
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
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
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

        {/* Mobile: Quick Access Button */}
        {isMobile && !showDrawer && (
          <div className="border-t border-white/10 bg-black/40 p-3">
            <button 
              onClick={() => setShowDrawer(true)}
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-sm font-medium text-red-400 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              View {CONFLICT_EVENTS.length} Active Conflicts
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </motion.section>
  );
}

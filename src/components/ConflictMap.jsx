import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Flame, Zap, Crosshair, Navigation, Plus, Minus, RotateCcw, Globe } from 'lucide-react';
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
  { name: 'Tehran', lat: 35.6892, lng: 51.3890, type: 'city' },
  { name: 'Baghdad', lat: 33.3152, lng: 44.3661, type: 'city' },
  { name: 'Jerusalem', lat: 31.7683, lng: 35.2137, type: 'city' },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, type: 'city' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, type: 'city' },
  { name: 'Damascus', lat: 33.5138, lng: 36.2765, type: 'city' },
  { name: 'Beirut', lat: 33.8938, lng: 35.5018, type: 'city' },
  { name: 'Amman', lat: 31.9454, lng: 35.9284, type: 'city' },
  { name: 'Kuwait City', lat: 29.3759, lng: 47.9774, type: 'city' },
  { name: 'Doha', lat: 25.2854, lng: 51.5310, type: 'city' },
  { name: 'Muscat', lat: 23.5859, lng: 58.4059, type: 'city' },
  { name: 'Sanaa', lat: 15.3694, lng: 44.1910, type: 'city' },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, type: 'city' },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597, type: 'city' },
  { name: 'Mediterranean Sea', lat: 34, lng: 32, type: 'water' },
  { name: 'Persian Gulf', lat: 26.5, lng: 52, type: 'water' },
  { name: 'Red Sea', lat: 20, lng: 38, type: 'water' },
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
  const [showLabels, setShowLabels] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 550 });

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
        setDimensions({ width: rect.width, height: 550 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Setup D3 zoom
  useEffect(() => {
    if (!svgRef.current || !worldData) return;
    
    const zoom = d3.zoom()
      .scaleExtent([0.8, 8])
      .on('zoom', (e) => {
        setZoomLevel(e.transform.k);
        if (gRef.current) {
          d3.select(gRef.current).attr('transform', e.transform);
        }
      });
    
    const svg = d3.select(svgRef.current);
    svg.call(zoom);
    
    // Initial transform - centered on Middle East
    const { width, height } = dimensions;
    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1.8)
      .translate(-width / 2, -height / 2 + 50);
    
    svg.call(zoom.transform, initialTransform);
    
  }, [worldData, dimensions.width, dimensions.height]);

  // Base projection
  const projection = useCallback(() => {
    return d3.geoMercator()
      .center([45, 30])
      .scale(dimensions.width * 0.7 * zoomLevel)
      .translate([
        dimensions.width / 2, 
        dimensions.height / 2
      ]);
  }, [dimensions, zoomLevel]);

  const proj = projection();
  const path = d3.geoPath().projection(proj);

  // Zoom controls
  const zoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom().transform, 
        d3.zoomIdentity.scale(zoomLevel * 1.5)
      );
    }
  };

  const zoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom().transform, 
        d3.zoomIdentity.scale(zoomLevel / 1.5)
      );
    }
  };

  const resetZoom = () => {
    if (svgRef.current) {
      const { width, height } = dimensions;
      const svg = d3.select(svgRef.current);
      const t = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(1.8)
        .translate(-width / 2, -height / 2 + 50);
      
      svg.transition().duration(500).call(d3.zoom().transform, t);
    }
  };

  // Check if point is visible
  const isVisible = (lat, lng) => {
    const [x, y] = proj([lng, lat]) || [-1000, -1000];
    return x > -100 && x < dimensions.width + 100 && y > -100 && y < dimensions.height + 100;
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black/60 to-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-white">Live Conflict Monitor</h2>
                <p className="text-xs text-gray-500">Middle East • {CONFLICT_EVENTS.length} active events</p>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end gap-2">
              <button onClick={() => setShowLabels(!showLabels)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${showLabels ? 'bg-purple-500/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}>
                Labels
              </button>
              <button onClick={() => setShowHeatmap(!showHeatmap)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${showHeatmap ? 'bg-orange-500/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}>
                Heatmap
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button onClick={zoomOut} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={resetZoom} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
              <button onClick={zoomIn} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div ref={containerRef} className="relative bg-[#020617]" style={{ height: '550px' }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : (
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="absolute inset-0 cursor-move">
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
                          strokeWidth={0.5 / zoomLevel}
                        />
                      );
                    })}
                  </g>
                )}

                {/* Heatmap */}
                {showHeatmap && CONFLICT_EVENTS.map(event => {
                  const [x, y] = proj([event.lng, event.lat]) || [0, 0];
                  if (!isVisible(event.lat, event.lng)) return null;
                  const config = SEVERITY_CONFIG[event.severity];
                  const r = event.severity === 'high' ? 50 : event.severity === 'medium' ? 35 : 20;
                  return (
                    <circle key={`heat-${event.id}`} cx={x} cy={y} r={r} fill={config.color} opacity={0.15} style={{ mixBlendMode: 'screen' }} />
                  );
                })}

                {/* Labels */}
                {showLabels && LABELS.map(label => {
                  const [x, y] = proj([label.lng, label.lat]) || [0, 0];
                  if (!isVisible(label.lat, label.lng)) return null;
                  
                  if (label.type === 'country') {
                    return (
                      <text key={label.name} x={x} y={y} textAnchor="middle" fill="rgba(148, 163, 184, 0.4)" fontSize={11} fontWeight="700" letterSpacing="1" style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>
                        {label.name}
                      </text>
                    );
                  }
                  if (label.type === 'city') {
                    const hasConflict = CONFLICT_EVENTS.some(e => e.city === label.name);
                    return (
                      <g key={label.name}>
                        <circle cx={x} cy={y} r={2} fill={hasConflict ? 'rgba(255,255,255,0.8)' : 'rgba(148,163,184,0.3)'} />
                        <text x={x + 5} y={y + 3} fill={hasConflict ? 'rgba(255,255,255,0.9)' : 'rgba(148,163,184,0.5)'} fontSize={9} fontWeight={hasConflict ? '600' : '400'}>
                          {label.name}
                        </text>
                      </g>
                    );
                  }
                  if (label.type === 'water') {
                    return (
                      <text key={label.name} x={x} y={y} textAnchor="middle" fill="rgba(59, 130, 246, 0.3)" fontSize={12} fontStyle="italic">
                        {label.name}
                      </text>
                    );
                  }
                  return null;
                })}

                {/* Conflict Markers */}
                {CONFLICT_EVENTS.map(event => {
                  const [x, y] = proj([event.lng, event.lat]) || [0, 0];
                  if (!isVisible(event.lat, event.lng)) return null;
                  
                  const config = SEVERITY_CONFIG[event.severity];
                  const isHovered = hoveredEvent?.id === event.id;
                  const isSelected = selectedEvent?.id === event.id;

                  return (
                    <g key={event.id} className="cursor-pointer" onClick={() => setSelectedEvent(event)}>
                      <circle cx={x} cy={y} r={isHovered ? 25 : 18} fill="none" stroke={config.color} strokeWidth="2" opacity={0.4}>
                        <animate attributeName="r" values="10;30;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={x} cy={y} r={12} fill={config.color} opacity={0.3} />
                      <circle
                        cx={x} cy={y} r={isHovered || isSelected ? 8 : 6}
                        fill={config.color} stroke="white" strokeWidth="2"
                        style={{ filter: `drop-shadow(0 0 10px ${config.color})` }}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                      />
                      {(isHovered || isSelected || event.severity === 'high') && (
                        <g>
                          <rect x={x - 45} y={y + 12} width="90" height="16" rx="3" fill="rgba(0,0,0,0.9)" stroke={config.color} strokeWidth="0.5" />
                          <text x={x} y={y + 23} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
                            {event.city} • {config.label}
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
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4">
            <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              Threat Level
            </h4>
            <div className="space-y-2">
              {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${config.bg}`} />
                  <span className="text-[11px] text-gray-400">{config.label}</span>
                  <span className="text-[10px] text-gray-600 ml-auto">{CONFLICT_EVENTS.filter(e => e.severity === key).length}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3 pt-2 border-t border-white/10">Scroll to zoom • Drag to pan</p>
          </div>

          {/* Stats */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{CONFLICT_EVENTS.filter(e => e.severity === 'high').length}</div>
                <div className="text-[9px] text-gray-500 uppercase">Critical</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xl font-bold text-orange-400">{CONFLICT_EVENTS.filter(e => e.severity === 'medium').length}</div>
                <div className="text-[9px] text-gray-500 uppercase">Elevated</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="text-xl font-bold text-white">{CONFLICT_EVENTS.length}</div>
                <div className="text-[9px] text-gray-500 uppercase">Total</div>
              </div>
            </div>
          </div>

          {/* Selected Event Panel */}
          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-4 right-4 w-72 bg-black/90 border border-white/20 rounded-xl p-4 backdrop-blur-md shadow-2xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg ${SEVERITY_CONFIG[selectedEvent.severity].bg} flex items-center justify-center`}>
                      {EVENT_ICONS[selectedEvent.icon]}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${SEVERITY_CONFIG[selectedEvent.severity].bg} text-white`}>
                      {SEVERITY_CONFIG[selectedEvent.severity].label}
                    </span>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white">✕</button>
                </div>
                <h3 className="font-bold text-lg text-white mb-1">{selectedEvent.city}</h3>
                <p className="text-xs text-gray-400 mb-2">{selectedEvent.country}</p>
                <p className="text-sm text-gray-300 mb-3">{selectedEvent.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedEvent.time}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Events List */}
        <div className="border-t border-white/10 bg-black/40">
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Recent Events</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CONFLICT_EVENTS.map(event => (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`text-left p-3 rounded-xl border transition-all ${selectedEvent?.id === event.id ? 'bg-red-500/10 border-red-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg}`}>
                      {EVENT_ICONS[event.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{event.city}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>{SEVERITY_CONFIG[event.severity].label}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate">{event.description}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{event.time}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
}

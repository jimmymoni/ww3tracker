import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Flame, Zap, Crosshair, Navigation, ChevronUp, ChevronDown, History, ArrowLeft, Plane, Siren, Shield, Bomb } from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { getCachedData } from '../lib/api';

// DEFAULT EVENTS - Loading state while real news fetches
const DEFAULT_EVENTS = [
  { id: 1, lat: 25.2048, lng: 55.2708, city: 'Dubai', country: 'UAE', severity: 'low', type: 'Loading', time: '...', description: 'Loading latest news...', icon: 'alert', source: 'Loading' },
  { id: 2, lat: 35.6892, lng: 51.3890, city: 'Tehran', country: 'Iran', severity: 'medium', type: 'Loading', time: '...', description: 'Loading latest news...', icon: 'alert', source: 'Loading' },
  { id: 3, lat: 31.7683, lng: 35.2137, city: 'Jerusalem', country: 'Israel', severity: 'medium', type: 'Loading', time: '...', description: 'Loading latest news...', icon: 'shield', source: 'Loading' },
  { id: 4, lat: 33.3152, lng: 44.3661, city: 'Baghdad', country: 'Iraq', severity: 'low', type: 'Loading', time: '...', description: 'Loading latest news...', icon: 'troop', source: 'Loading' },
];

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

export default function ConflictMap({ mobile = false }) {
  const [worldData, setWorldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const [lastUpdated, setLastUpdated] = useState('Loading...');
  const [isLoadingRealData, setIsLoadingRealData] = useState(true);
  
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);
  const mobileContainerRef = useRef(null);
  const desktopContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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

  // Update dimensions based on active container
  useEffect(() => {
    const update = () => {
      const container = isMobile ? mobileContainerRef.current : desktopContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const height = isMobile ? (mobile ? 200 : 320) : 500;
        const newDimensions = { width: Math.max(rect.width, 300), height };
        setDimensions(newDimensions);
      }
    };
    update();
    setTimeout(update, 200);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile, mobile]);

  // Fetch real news and convert to map events
  useEffect(() => {
    const fetchRealEvents = async (isRetry = false) => {
      try {
        // Try cached data first
        const cachedNews = getCachedData('memes');
        if (cachedNews?.items && cachedNews.items.length > 0 && !cachedNews.isFallback) {
          const mapEvents = convertNewsToEvents(cachedNews.items);
          if (mapEvents.length > 0) {
            setEvents(mapEvents);
            setLastUpdated('Just now');
            setIsLoadingRealData(false);
          }
        }

        // Fetch from API
        const response = await fetch('/api/news');
        if (response.ok) {
          const data = await response.json();
          console.log('[ConflictMap] API response:', { fallback: data.fallback, items: data.items?.length });
          
          if (data.items && data.items.length > 0) {
            const mapEvents = convertNewsToEvents(data.items);
            if (mapEvents.length > 0) {
              setEvents(mapEvents);
              setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              
              if (data.fallback) {
                // Using fallback data - will retry for real data
                setIsLoadingRealData(true);
                if (!isRetry) {
                  console.log('[ConflictMap] Using fallback data, retrying in 3s...');
                  setTimeout(() => fetchRealEvents(true), 3000);
                }
              } else {
                // Got real data!
                setIsLoadingRealData(false);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch real events:', err);
        setIsLoadingRealData(false);
      }
    };

    fetchRealEvents();
    const interval = setInterval(fetchRealEvents, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert news items to map events
  const convertNewsToEvents = (newsItems) => {
    const cityMapping = {
      'dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
      'abu dhabi': { lat: 24.4539, lng: 54.3773, country: 'UAE' },
      'tehran': { lat: 35.6892, lng: 51.3890, country: 'Iran' },
      'jerusalem': { lat: 31.7683, lng: 35.2137, country: 'Israel' },
      'tel aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
      'baghdad': { lat: 33.3152, lng: 44.3661, country: 'Iraq' },
      'basra': { lat: 30.5156, lng: 47.7804, country: 'Iraq' },
      'riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
      'jeddah': { lat: 21.2854, lng: 39.2376, country: 'Saudi Arabia' },
      'doha': { lat: 25.2854, lng: 51.5310, country: 'Qatar' },
      'kuwait city': { lat: 29.3759, lng: 47.9774, country: 'Kuwait' },
      'damascus': { lat: 33.5138, lng: 36.2765, country: 'Syria' },
      'beirut': { lat: 33.8938, lng: 35.5018, country: 'Lebanon' },
      'sanaa': { lat: 15.3694, lng: 44.1910, country: 'Yemen' },
      'gaza': { lat: 31.5017, lng: 34.4668, country: 'Palestine' },
      'washington': { lat: 38.9072, lng: -77.0369, country: 'USA' },
      'iran': { lat: 32.0, lng: 53.0, country: 'Iran' },
      'israel': { lat: 31.0, lng: 34.8, country: 'Israel' },
      'iraq': { lat: 33.0, lng: 43.0, country: 'Iraq' },
      'saudi': { lat: 24.0, lng: 45.0, country: 'Saudi Arabia' },
      'uae': { lat: 24.5, lng: 54.0, country: 'UAE' },
      'qatar': { lat: 25.3, lng: 51.2, country: 'Qatar' },
      'kuwait': { lat: 29.3, lng: 47.5, country: 'Kuwait' },
      'syria': { lat: 35.0, lng: 38.0, country: 'Syria' },
      'lebanon': { lat: 33.8, lng: 35.5, country: 'Lebanon' },
      'yemen': { lat: 15.5, lng: 47.5, country: 'Yemen' },
      'gulf': { lat: 26.0, lng: 52.0, country: 'Persian Gulf' },
      'hormuz': { lat: 26.5, lng: 56.5, country: 'Strait of Hormuz' },
    };

    const events = [];
    let id = 1;

    for (const item of newsItems.slice(0, 8)) {
      const title = (item.title || item.headline || '').toLowerCase();
      const desc = (item.description || item.summary || '').toLowerCase();
      const text = title + ' ' + desc;

      let matched = false;
      for (const [placeName, coords] of Object.entries(cityMapping)) {
        if (text.includes(placeName)) {
          let severity = 'low';
          if (text.includes('strike') || text.includes('attack') || text.includes('hit') || text.includes('missile') || text.includes('war') || text.includes('kill')) {
            severity = 'high';
          } else if (text.includes('tension') || text.includes('threat') || text.includes('warning') || text.includes('sanction') || text.includes('escalate')) {
            severity = 'medium';
          }

          let icon = 'alert';
          if (text.includes('missile') || text.includes('rocket')) icon = 'missile';
          else if (text.includes('strike') || text.includes('bomb')) icon = 'bomb';
          else if (text.includes('shield') || text.includes('defense') || text.includes('intercept')) icon = 'shield';
          else if (text.includes('ship') || text.includes('naval')) icon = 'ship';
          else if (text.includes('drone')) icon = 'drone';
          else if (text.includes('troop') || text.includes('force')) icon = 'troop';

          events.push({
            id: id++,
            lat: coords.lat,
            lng: coords.lng,
            city: placeName.charAt(0).toUpperCase() + placeName.slice(1),
            country: coords.country,
            severity,
            type: severity === 'high' ? 'Breaking' : severity === 'medium' ? 'Tensions' : 'Monitoring',
            time: item.timestamp || item.pubDate ? new Date(item.timestamp || item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            description: item.title || item.headline || item.description || 'Breaking news',
            icon,
            source: item.source || 'News'
          });
          matched = true;
          break;
        }
      }
      
      if (!matched && (text.includes('trump') || text.includes('nuclear') || text.includes('deal'))) {
        events.push({
          id: id++,
          lat: 35.6892,
          lng: 51.3890,
          city: 'Tehran',
          country: 'Iran',
          severity: 'medium',
          type: 'Political',
          time: item.timestamp || item.pubDate ? new Date(item.timestamp || item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          description: item.title || item.headline || item.description || 'Political update',
          icon: 'alert',
          source: item.source || 'News'
        });
      }
    }

    return events.length > 0 ? events : DEFAULT_EVENTS;
  };

  // Setup D3 zoom - enable touch for mobile pinch
  useEffect(() => {
    if (!svgRef.current || !worldData) return;
    
    const svg = d3.select(svgRef.current);
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 8])
      .extent([[0, 0], [dimensions.width, dimensions.height]])
      .translateExtent([[-dimensions.width, -dimensions.height], [dimensions.width * 2, dimensions.height * 2]])
      .on('zoom', (event) => {
        if (gRef.current) {
          d3.select(gRef.current).attr('transform', event.transform);
        }
      });
    
    zoomRef.current = zoom;
    svg.call(zoom);
    
    const { width, height } = dimensions;
    const scale = isMobile ? 3.2 : 2.4;
    const centerX = width / 2;
    const centerY = height / 2;
    const initialTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(scale)
      .translate(-width / 2 + (isMobile ? 0 : 0), -height / 2 + (isMobile ? -30 : 20));
    
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
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.transform, currentTransform.scale(1.4));
  };

  const zoomOut = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    const currentTransform = d3.zoomTransform(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.transform, currentTransform.scale(0.7));
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
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
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

            {events.map(event => {
              const [x, y] = proj([event.lng, event.lat]) || [0, 0];
              if (!isVisible(event.lat, event.lng)) return null;
              const config = SEVERITY_CONFIG[event.severity];
              const baseR = isMobile ? 8 : 12;
              const r = event.severity === 'high' ? baseR * 2 : event.severity === 'medium' ? baseR * 1.5 : baseR;
              const opacity = event.severity === 'high' ? 0.3 : event.severity === 'medium' ? 0.2 : 0.1;
              
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

            {events.map(event => {
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
                    r={isMobile ? (event.severity === 'high' ? 8 : 5) : (event.severity === 'high' ? 12 : 8)} 
                    fill="none" 
                    stroke={config.color} 
                    strokeWidth={event.severity === 'high' ? 2 : 1} 
                    opacity={event.severity === 'high' ? 0.6 : 0.3}
                  >
                    <animate attributeName="r" values={`${radius};${radius * (event.severity === 'high' ? 2.5 : 2)};${radius}`} dur={event.severity === 'high' ? '1.5s' : '2.5s'} repeatCount="indefinite" />
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
          <span className="text-[10px] text-gray-400">Tap markers for details</span>
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
                <p className="text-[10px] md:text-xs text-gray-500">
                  {events.length} active events
                  {isLoadingRealData ? (
                    <span className="text-yellow-500 ml-1">• Loading real news...</span>
                  ) : (
                    <span className="text-green-500 ml-1">• Live data</span>
                  )}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button 
                onClick={zoomOut} 
                className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white text-sm"
              >−</button>
              <span className="text-[10px] text-gray-500 px-1">Zoom</span>
              <button 
                onClick={zoomIn} 
                className="w-8 h-8 rounded hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white text-sm"
              >+</button>
            </div>
          </div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="lg:hidden">
          <div 
            ref={mobileContainerRef} 
            className="relative bg-[#020617] w-full overflow-hidden rounded-t-xl" 
            style={{ height: mobile ? '200px' : '320px', touchAction: 'none' }}
          >
            {renderMap()}
          </div>
          
          {/* MOBILE: Show top 2 conflicts immediately */}
          <div className="relative z-10 border-t border-white/10 bg-black/40 p-3">
            <div className="space-y-2 mb-3">
              {events.slice(0, 2).map(event => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="w-full text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-3"
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
            
            <button 
              onClick={() => {setShowDrawer(true); setShowTimeline(false);}}
              className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-sm font-medium text-red-400 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              View All {events.length} Conflicts
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden lg:flex">
          <div ref={desktopContainerRef} className="relative bg-[#020617] flex-1" style={{ height: '500px' }}>
            {renderMap()}
          </div>

          <div className="w-80 border-l border-white/10 bg-black/40 flex flex-col" style={{ height: '500px' }}>
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Active Conflicts
              </h3>
              <p className="text-xs text-gray-500 mt-1">{events.length} events tracked</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {events.map(event => (
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

        {/* MOBILE: Bottom Sheet */}
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
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black to-gray-900 border-t border-white/20 rounded-t-3xl z-50 flex flex-col shadow-2xl"
                style={{ height: '90vh', maxHeight: '90vh' }}
              >
                {/* Handle Bar */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
                
                {/* Fixed Header - Always visible at top */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/50 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Active Conflicts</h3>
                      <p className="text-sm text-gray-500">{events.length} events tracked</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowDrawer(false)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
                  {selectedEvent && showTimeline ? (
                    <TimelineView 
                      event={selectedEvent} 
                      allEvents={events}
                      onBack={() => setShowTimeline(false)}
                      onClose={() => {setShowDrawer(false); setSelectedEvent(null); setShowTimeline(false);}}
                    />
                  ) : (
                    <EventsList 
                      events={events}
                      selectedEvent={selectedEvent}
                      onSelect={(e) => {setSelectedEvent(e); setShowTimeline(true);}}
                    />
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* DESKTOP: Timeline Modal */}
        {!isMobile && showTimeline && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setShowTimeline(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-black/95 border border-white/20 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <TimelineView 
                event={selectedEvent} 
                allEvents={events}
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

function TimelineView({ event, onBack, onClose, allEvents = [] }) {
  const timeline = allEvents
    .filter(e => e.city === event.city)
    .map(e => ({
      time: e.time,
      event: e.description,
      type: e.severity === 'high' ? 'attack' : 'alert',
      severity: e.severity
    }));
  
  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header - Desktop Style */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-bold text-xl text-white">{event.city}</h3>
            <p className="text-xs text-gray-400">Conflict Timeline</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
          {SEVERITY_CONFIG[event.severity].label}
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {/* Main Event Card - Styled like desktop */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 mb-5 shadow-lg">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${SEVERITY_CONFIG[event.severity].bg} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {EVENT_ICONS[event.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium leading-relaxed mb-2">{event.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>Source: {event.source}</span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent History Section */}
        <div className="mb-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <History className="w-4 h-4" />
            Recent History
          </h4>
          
          <div className="space-y-4">
            {timeline.length > 0 ? timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${SEVERITY_CONFIG[item.severity]?.bg || 'bg-gray-500'} ring-4 ring-black`} />
                  {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-white/20 to-transparent mt-2" />}
                </div>
                <div className="pb-2 flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-mono">{item.time}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.event}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">No recent history available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom padding for scroll */}
        <div className="h-4" />
      </div>
    </div>
  );
}

function EventsList({ events, selectedEvent, onSelect }) {
  return (
    <div className="h-full">
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
          <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No active conflicts</p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => onSelect(event)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                selectedEvent?.id === event.id 
                  ? 'bg-red-500/10 border-red-500/50' 
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${SEVERITY_CONFIG[event.severity].bg}`}>
                {EVENT_ICONS[event.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-white">{event.city}</span>
                  <span className={`text-[9px] px-2 py-1 rounded-full ${SEVERITY_CONFIG[event.severity].bg} text-white font-medium`}>
                    {SEVERITY_CONFIG[event.severity].label}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{event.description}</p>
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {event.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

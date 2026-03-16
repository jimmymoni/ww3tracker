import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, Flame, Zap, Crosshair, Navigation, ChevronUp, ChevronDown, History, ArrowLeft, Plane, Siren, Shield, Bomb, X } from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { getCachedData } from '../lib/api';

// No default events - only show real confirmed strikes
const DEFAULT_EVENTS = [];

const LABELS = [
  { name: 'IRAN', lat: 32, lng: 54, type: 'country' },
  { name: 'IRAQ', lat: 33, lng: 43, type: 'country' },
  { name: 'SAUDI ARABIA', lat: 24, lng: 45, type: 'country' },
  { name: 'SYRIA', lat: 35, lng: 38, type: 'country' },
  { name: 'ISRAEL', lat: 31, lng: 34.8, type: 'country' },
  { name: 'UAE', lat: 24.5, lng: 54, type: 'country' },
  { name: 'QATAR', lat: 25.3, lng: 51.2, type: 'country' },
  { name: 'KUWAIT', lat: 29.3, lng: 47.5, type: 'country' },
  { name: 'JORDAN', lat: 31, lng: 36, type: 'country' },
  { name: 'BAHRAIN', lat: 26.1, lng: 50.55, type: 'country' },
  // Current conflict hotspots (March 2026)
  { name: 'ISFAHAN', lat: 32.65, lng: 51.67, type: 'city' },
  { name: 'NATANZ', lat: 33.91, lng: 51.72, type: 'city' },
  { name: 'TEHRAN', lat: 35.69, lng: 51.39, type: 'city' },
  { name: 'HAMADAN', lat: 34.80, lng: 48.51, type: 'city' },
  { name: 'CHABAHAR', lat: 25.30, lng: 60.65, type: 'city' },
];

const SEVERITY_CONFIG = {
  high: { color: '#ef4444', bg: 'bg-red-500', label: 'CRITICAL' },
  medium: { color: '#f97316', bg: 'bg-orange-500', label: 'ELEVATED' },
  low: { color: '#eab308', bg: 'bg-yellow-500', label: 'MONITORING' }
};

// Time window config
const HOURS_WINDOW = 48;
const NEW_THRESHOLD_HOURS = 6;  // Show "NEW" badge
const RECENT_THRESHOLD_HOURS = 12; // Pulsing animation

// Helper to format relative time
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

// Check if attack is very recent
const isNewAttack = (dateString) => {
  const hoursAgo = (Date.now() - new Date(dateString).getTime()) / 3600000;
  return hoursAgo < NEW_THRESHOLD_HOURS;
};

const isRecentAttack = (dateString) => {
  const hoursAgo = (Date.now() - new Date(dateString).getTime()) / 3600000;
  return hoursAgo < RECENT_THRESHOLD_HOURS;
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');
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
        const height = isMobile ? (mobile ? 240 : 360) : 500;
        const newDimensions = { width: Math.max(rect.width, 300), height };
        setDimensions(newDimensions);
      }
    };
    update();
    setTimeout(update, 200);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isMobile, mobile]);

  // Fetch AI-analyzed attacks from API
  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        setIsLoadingRealData(true);
        const response = await fetch('/api/attacks');
        if (response.ok) {
          const data = await response.json();
          console.log('[ConflictMap] Attacks received:', data.count, data.loading ? '(loading fresh data)' : '(cached)');
          
          if (data.attacks && data.attacks.length > 0) {
            // Convert AI-analyzed attacks to map events
            const mapEvents = data.attacks.map((item, idx) => {
              // Backend now provides coordinates - use them directly
              const coords = item.coordinates || getLocationCoords(item.mapAnalysis.location);
              return {
                id: idx + 1,
                lat: coords.lat,
                lng: coords.lng,
                city: item.mapAnalysis.location || 'Unknown',
                country: coords.country,
                severity: item.mapAnalysis.severity,
                type: item.mapAnalysis.attackType.toUpperCase(),
                time: new Date(item.pubDate || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                relativeTime: getRelativeTime(item.pubDate),
                isNew: isNewAttack(item.pubDate),
                isRecent: isRecentAttack(item.pubDate),
                pubDate: item.pubDate,
                description: item.headline,
                icon: item.mapAnalysis.attackType,
                source: item.source
              };
            });
            setEvents(mapEvents);
            setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          } else {
            setEvents([]);
          }
          
          // If server is still loading fresh data, keep loading indicator for a bit
          if (data.loading) {
            setTimeout(() => setIsLoadingRealData(false), 2000);
          } else {
            setIsLoadingRealData(false);
          }
        }
      } catch (err) {
        console.error('[ConflictMap] Failed to fetch attacks:', err);
        setIsLoadingRealData(false);
      }
    };

    fetchAttacks();
    const interval = setInterval(fetchAttacks, 60 * 1000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);
  
  // Fallback coordinates for locations (backend should provide these)
  // This is only used if backend doesn't include coordinates
  const getLocationCoords = (location) => {
    const coords = {
      'Tehran': { lat: 35.6892, lng: 51.3890, country: 'Iran' },
      'Isfahan': { lat: 32.6539, lng: 51.6660, country: 'Iran' },
      'Kharg Island': { lat: 29.25, lng: 50.33, country: 'Iran' },
      'Hamadan': { lat: 34.7983, lng: 48.5148, country: 'Iran' },
      'Chabahar': { lat: 25.2969, lng: 60.6458, country: 'Iran' },
      'Tel Aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel' },
      'Jerusalem': { lat: 31.7683, lng: 35.2137, country: 'Israel' },
      'Baghdad': { lat: 33.3152, lng: 44.3661, country: 'Iraq' },
      'Kuwait': { lat: 29.3000, lng: 47.8000, country: 'Kuwait' },
      'Bahrain': { lat: 26.0667, lng: 50.5577, country: 'Bahrain' },
      'Jordan': { lat: 31.0000, lng: 36.0000, country: 'Jordan' },
      'Dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
      'Fujairah': { lat: 25.1288, lng: 56.3265, country: 'UAE' },
      'Beirut': { lat: 33.8938, lng: 35.5018, country: 'Lebanon' },
      'Damascus': { lat: 33.5138, lng: 36.2765, country: 'Syria' },
      'Riyadh': { lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia' },
      'Doha': { lat: 25.2854, lng: 51.5310, country: 'Qatar' },
      'Sanaa': { lat: 15.3694, lng: 44.1910, country: 'Yemen' },
      'Gaza': { lat: 31.5017, lng: 34.4668, country: 'Gaza Strip' },
    };
    return coords[location] || { lat: 32.0, lng: 53.0, country: 'Unknown' };
  };

  // Trust AI analysis from backend - minimal client-side filtering
  // Only filter out obvious non-conflict content
  const EXCLUDE_KEYWORDS = [
    'opinion', 'editorial', 'column', 'essay', 'podcast', 'video'
  ];

  // Convert news items to map events - ATTACKS ONLY
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
      // Current conflict locations (March 2026)
      'isfahan': { lat: 32.6539, lng: 51.6660, country: 'Iran' },
      'natanz': { lat: 33.9061, lng: 51.7198, country: 'Iran' },
      'kashan': { lat: 33.9850, lng: 51.4100, country: 'Iran' },
      'qom': { lat: 34.6401, lng: 50.8764, country: 'Iran' },
      'bushehr': { lat: 28.9684, lng: 50.8385, country: 'Iran' },
      'bandar abbas': { lat: 27.1833, lng: 56.2666, country: 'Iran' },
      'shiraz': { lat: 29.5926, lng: 52.5836, country: 'Iran' },
      'tabriz': { lat: 38.0962, lng: 46.2738, country: 'Iran' },
      'mashhad': { lat: 36.2605, lng: 59.6168, country: 'Iran' },
      'ahvaz': { lat: 31.3183, lng: 48.6706, country: 'Iran' },
    };

    const events = [];
    let id = 1;

    for (const item of newsItems.slice(0, 8)) {
      const title = (item.title || item.headline || '').toLowerCase();
      const desc = (item.description || item.summary || '').toLowerCase();
      const text = title + ' ' + desc;

      // Trust AI analysis - minimal filtering
      const hasExcludeKeyword = EXCLUDE_KEYWORDS.some(keyword => text.includes(keyword));
      if (hasExcludeKeyword) {
        continue;
      }

      let matched = false;
      for (const [placeName, coords] of Object.entries(cityMapping)) {
        if (text.includes(placeName)) {
          // Severity based on actual damage reported
          let severity = 'medium'; // Default to medium for attacks
          if (text.includes('killed') || text.includes('casualties') || text.includes('death toll') || text.includes('destroyed')) {
            severity = 'high';
          } else if (text.includes('damaged') || text.includes('hit') || text.includes('struck')) {
            severity = 'medium';
          }

          let icon = 'strike';
          if (text.includes('missile') || text.includes('rocket')) icon = 'missile';
          else if (text.includes('bomb') || text.includes('explosion')) icon = 'bomb';
          else if (text.includes('drone')) icon = 'drone';
          else if (text.includes('shell') || text.includes('artillery')) icon = 'bomb';

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
      
      // Only add unmatched items if they mention Iran attacks
      if (!matched && text.includes('iran') && (text.includes('strike') || text.includes('attack') || text.includes('hit'))) {
        events.push({
          id: id++,
          lat: 35.6892,
          lng: 51.3890,
          city: 'Tehran',
          country: 'Iran',
          severity: 'medium',
          type: 'Confirmed Strike',
          time: item.timestamp || item.pubDate ? new Date(item.timestamp || item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          description: item.title || item.headline || item.description || 'Attack reported',
          icon: 'strike',
          source: item.source || 'News'
        });
        matched = true;
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
    const scale = isMobile ? 3.0 : 2.4;
    const centerX = width / 2;
    const centerY = height / 2;
    const initialTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(scale)
      .translate(-width / 2 + (isMobile ? 0 : 0), -height / 2 + (isMobile ? 10 : 20));
    
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
              // Subtle glow - smaller and less opaque
              const r = isMobile ? 10 : 12;
              const opacity = event.severity === 'high' ? 0.25 : event.severity === 'medium' ? 0.15 : 0.1;
              
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
              
              // Simple dot sizing - consistent by severity
              const baseRadius = isMobile ? 5 : 6;
              const radius = baseRadius;
              const glowFilter = event.severity === 'high' ? 'url(#glow-red)' : 
                                event.severity === 'medium' ? 'url(#glow-orange)' : 'url(#glow-yellow)';
              
              // Subtle pulse only for recent attacks
              const shouldPulse = event.isNew || event.isRecent;
              const pulseRadius = radius * 2.2;
              const pulseDuration = event.isNew ? '1.2s' : '1.8s';
              const pulseOpacity = event.isNew ? 0.6 : 0.4;

              return (
                <g key={event.id} className="cursor-pointer" onClick={() => handleEventClick(event)}>
                  {/* Subtle pulse ring - only for recent attacks */}
                  {shouldPulse && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={radius * 1.5}
                      fill="none" 
                      stroke={config.color}
                      strokeWidth={1.5}
                      opacity={pulseOpacity}
                    >
                      <animate attributeName="r" values={`${radius * 1.5};${pulseRadius};${radius * 1.5}`} dur={pulseDuration} repeatCount="indefinite" />
                      <animate attributeName="opacity" values={`${pulseOpacity};0;${pulseOpacity}`} dur={pulseDuration} repeatCount="indefinite" />
                    </circle>
                  )}
                  
                  {/* Core dot - simple colored dot matching legend */}
                  <circle
                    cx={x} 
                    cy={y} 
                    r={isHovered || isSelected ? radius + 1.5 : radius}
                    fill={config.color}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth={1}
                    style={{ filter: glowFilter, transition: 'all 0.15s ease' }}
                    onMouseEnter={() => setHoveredEvent(event)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  />

                  {/* Tooltip on hover */}
                  {(isHovered || isSelected) && (
                    <g>
                      <rect x={x - 45} y={y - 32} width="90" height="20" rx="3" fill="rgba(0,0,0,0.95)" stroke={config.color} strokeWidth="0.5" />
                      <text x={x} y={y - 22} textAnchor="middle" fill="white" fontSize="8" fontWeight="600">
                        {event.city}
                      </text>
                      <text x={x} y={y - 12} textAnchor="middle" fill={event.isNew ? '#ef4444' : '#9ca3af'} fontSize="7">
                        {event.relativeTime}
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
              <span className={`w-2 h-2 rounded-full ${config.bg}`} />
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
                <h2 className="font-heading font-bold text-sm md:text-lg text-white">Confirmed Military Strikes</h2>
                <p className="text-[10px] md:text-xs text-gray-500">
                  {events.length === 0 ? `No confirmed strikes in last ${HOURS_WINDOW}h` : `${events.length} verified attacks in last ${HOURS_WINDOW}h`}
                  {isLoadingRealData ? (
                    <span className="text-yellow-500 ml-1">• Updating...</span>
                  ) : (
                    <span className="text-green-500 ml-1">• Live</span>
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

        {/* MOBILE LAYOUT - Horizontal Scrolling Cards */}
        <div className="lg:hidden">
          <div 
            ref={mobileContainerRef} 
            className="relative bg-[#020617] w-full overflow-hidden rounded-t-xl" 
            style={{ height: mobile ? '240px' : '360px', touchAction: 'none' }}
          >
            {renderMap()}
          </div>
          
          {/* MOBILE: Horizontal scrolling strike cards */}
          <div className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-sm">
            {events.length === 0 ? (
              <div className="text-center py-4">
                <AlertTriangle className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No confirmed strikes</p>
                <p className="text-xs text-gray-600 mt-1">Verified attacks appear here</p>
              </div>
            ) : (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed Strikes</span>
                  <span className="text-xs text-gray-500">{events.length} attacks</span>
                </div>
                
                {/* Horizontal scroll container */}
                <div 
                  className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {events.map(event => (
                    <button
                      key={event.id}
                      onClick={() => {setSelectedEvent(event); setShowDetailModal(true);}}
                      className={`flex-shrink-0 w-[280px] snap-start text-left p-3 rounded-xl border transition-all ${
                        event.isNew 
                          ? 'border-red-500/50 bg-red-500/5' 
                          : event.isRecent 
                            ? 'border-orange-500/30 bg-orange-500/5' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg} ${event.isRecent ? 'animate-pulse' : ''}`}>
                          {EVENT_ICONS[event.icon]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm flex items-center gap-2">
                              {event.city}
                              {event.isNew && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
                              )}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                              {SEVERITY_CONFIG[event.severity].label}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">{event.description}</p>
                          <p className={`text-[10px] mt-1 ${event.isNew ? 'text-red-400 font-medium' : event.isRecent ? 'text-orange-400' : 'text-gray-600'}`}>
                            {event.relativeTime}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                Confirmed Strikes
              </h3>
              <p className="text-xs text-gray-500 mt-1">{events.length} attacks verified</p>
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
                      : event.isNew 
                        ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                        : event.isRecent 
                          ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg} ${event.isRecent ? 'animate-pulse' : ''}`}>
                      {EVENT_ICONS[event.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm flex items-center gap-2">
                          {event.city}
                          {event.isNew && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
                          )}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                          {SEVERITY_CONFIG[event.severity].label}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{event.description}</p>
                      <p className={`text-[9px] mt-1 ${event.isNew ? 'text-red-400 font-medium' : event.isRecent ? 'text-orange-400' : 'text-gray-600'}`}>
                        {event.relativeTime}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE: Strike Detail Modal */}
        <AnimatePresence>
          {isMobile && showDetailModal && selectedEvent && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-40"
                onClick={() => setShowDetailModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-x-4 top-[10vh] bottom-[10vh] bg-black/95 border border-white/10 rounded-2xl z-50 overflow-hidden"
              >
                {/* Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/95">
                  <h3 className="font-bold text-white">Strike Details</h3>
                  <button 
                    onClick={() => {setShowDetailModal(false); setSelectedEvent(null);}}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Scrollable Content */}
                <div className="overflow-y-auto p-4" style={{ height: 'calc(80vh - 70px)', WebkitOverflowScrolling: 'touch' }}>
                  {/* Location Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-14 h-14 rounded-xl ${SEVERITY_CONFIG[selectedEvent.severity].bg} flex items-center justify-center flex-shrink-0 ${selectedEvent.isRecent ? 'animate-pulse' : ''}`}>
                      {EVENT_ICONS[selectedEvent.icon]}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-bold text-2xl text-white flex items-center gap-2">
                        {selectedEvent.city}
                        {selectedEvent.isNew && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
                        )}
                      </h2>
                      <p className="text-sm text-gray-400">{selectedEvent.country}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${SEVERITY_CONFIG[selectedEvent.severity].bg} text-white`}>
                      {SEVERITY_CONFIG[selectedEvent.severity].label}
                    </span>
                  </div>

                  {/* Main Event Card */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Incident Details</h4>
                    <p className="text-base text-gray-200 mb-4 leading-relaxed">{selectedEvent.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Source: {selectedEvent.source}</span>
                      <div className={`flex items-center gap-1 ${selectedEvent.isNew ? 'text-red-400 font-medium' : selectedEvent.isRecent ? 'text-orange-400' : 'text-gray-400'}`}>
                        <Clock className="w-4 h-4" />
                        {selectedEvent.relativeTime}
                      </div>
                    </div>
                  </div>
                  
                  {/* Close button at bottom */}
                  <button 
                    onClick={() => {setShowDetailModal(false); setSelectedEvent(null);}}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium"
                  >
                    Close
                  </button>
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
  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Location Header */}
      <div className="flex items-center gap-3 mb-5" style={{ marginTop: '8px' }}>
        <div className={`w-14 h-14 rounded-xl ${SEVERITY_CONFIG[event.severity].bg} flex items-center justify-center flex-shrink-0 ${event.isRecent ? 'animate-pulse' : ''}`}>
          {EVENT_ICONS[event.icon]}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-2xl text-white flex items-center gap-2">
            {event.city}
            {event.isNew && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
            )}
          </h3>
          <p className="text-sm text-gray-400">{event.country}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
          {SEVERITY_CONFIG[event.severity].label}
        </span>
      </div>

      {/* Main Event Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Latest Incident</h4>
        <p className="text-base text-gray-200 mb-4 leading-relaxed">{event.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Source: {event.source}</span>
          <div className={`flex items-center gap-1 ${event.isNew ? 'text-red-400 font-medium' : event.isRecent ? 'text-orange-400' : 'text-gray-400'}`}>
            <Clock className="w-4 h-4" />
            {event.relativeTime || event.time}
          </div>
        </div>
      </div>
      
      {/* Back to Map hint */}
      <div className="bg-white/5 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-400">Tap "Close" to return to the map</p>
      </div>
    </div>
  );
}

function EventsList({ events, selectedEvent, onSelect }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500 py-12 text-center">
        <AlertTriangle className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm">No confirmed military strikes</p>
        <p className="text-xs text-gray-600 mt-1">Verified attacks appear here</p>
      </div>
    );
  }
  
  return (
    <div style={{ paddingBottom: '40px' }}>
      {events.map((event, index) => (
        <button
          key={event.id}
          onClick={() => onSelect(event)}
          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 mb-3 ${
            selectedEvent?.id === event.id 
              ? 'bg-red-500/10 border-red-500/50' 
              : event.isNew 
                ? 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                : event.isRecent 
                  ? 'bg-orange-500/5 border-orange-500/20 hover:bg-orange-500/10'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
          }`}
          style={{ marginTop: index === 0 ? '0' : '0' }}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${SEVERITY_CONFIG[event.severity].bg} ${event.isRecent ? 'animate-pulse' : ''}`}>
            {EVENT_ICONS[event.icon]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white text-base flex items-center gap-2">
                {event.city}
                {event.isNew && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 text-white animate-pulse">NEW</span>
                )}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded ${SEVERITY_CONFIG[event.severity].bg} text-white`}>
                {SEVERITY_CONFIG[event.severity].label}
              </span>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{event.description}</p>
            <p className={`text-[11px] mt-2 ${event.isNew ? 'text-red-400 font-medium' : event.isRecent ? 'text-orange-400' : 'text-gray-600'}`}>
              {event.relativeTime || event.time}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

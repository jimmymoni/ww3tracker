/**
 * Regional Conflict Tracker - Homepage
 * 
 * A professional, educational-focused dashboard for understanding
 * ongoing conflicts across multiple regions. Features:
 * - Interactive multi-conflict map
 * - Active conflict zone cards
 * - Relationship visualization
 * - Recent escalation timeline
 * 
 * Design: Clean, professional, educational tone
 * No gamification elements
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  MapPin, 
  Clock, 
  ArrowRight, 
  AlertTriangle,
  Target,
  TrendingUp,
  Info,
  ExternalLink,
  Database,
  FileText,
  Code
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ============================================
// DATA STRUCTURES
// ============================================

/**
 * Conflict Zones Configuration
 * Each zone represents an active conflict region
 */
const CONFLICT_ZONES = [
  {
    id: 'us-iran',
    name: 'US-Iran',
    region: 'Middle East',
    flag1: '🇺🇸',
    flag2: '🇮🇷',
    attackCount: 14,
    rootCause: 'Nuclear program tensions & proxy warfare escalation',
    description: 'Long-standing tensions over Iran\'s nuclear program have escalated into direct military confrontations involving missile strikes, drone attacks, and naval incidents across the Persian Gulf.',
    color: 'blue',
    hexColor: '#cc1a1a',
    lastEscalation: '2026-03-18T02:00:00Z',
    keyActors: ['United States', 'Iran', 'Israel', 'UAE', 'Saudi Arabia'],
    link: '/us-iran-war-tracker'
  },
  {
    id: 'pak-afghan',
    name: 'Pakistan-Afghanistan',
    region: 'South Asia',
    flag1: '🇵🇰',
    flag2: '🇦🇫',
    attackCount: 4,
    rootCause: 'Border disputes & militant safe havens',
    description: 'Pakistan accuses Afghanistan of harboring Pakistani Taliban militants conducting cross-border attacks. Recent airstrikes mark significant escalation in bilateral tensions.',
    color: 'amber',
    hexColor: '#f59e0b',
    lastEscalation: '2026-03-14T18:00:00Z',
    keyActors: ['Pakistan', 'Afghanistan', 'TTP', 'China (mediator)'],
    link: '/pakistan-afghanistan-conflict'
  },
  {
    id: 'israel-hezbollah',
    name: 'Israel-Hezbollah',
    region: 'Levant',
    flag1: '🇮🇱',
    flag2: '🇱🇧',
    attackCount: 4,
    rootCause: 'Northern border security & Iranian support',
    description: 'Ongoing conflict between Israel and Hezbollah in Lebanon, characterized by cross-border rocket fire, airstrikes, and military operations in southern Lebanon.',
    color: 'red',
    hexColor: '#ef4444',
    lastEscalation: '2026-03-18T08:00:00Z',
    keyActors: ['Israel', 'Hezbollah', 'Lebanon', 'Iran'],
    link: '/israel-hezbollah-conflict'
  }
];

/**
 * Recent Escalations Data
 * Last 7 attacks across all conflict zones
 */
const RECENT_ESCALATIONS = [
  {
    id: 'esc-001',
    timestamp: '2026-03-18T08:00:00Z',
    attacker: 'Israel',
    target: 'Hezbollah',
    location: 'Beirut, Lebanon',
    description: 'Airstrike destroyed Hezbollah-linked building following warning',
    zoneId: 'israel-hezbollah',
    contextLink: '/context/beirut-strike-march-18'
  },
  {
    id: 'esc-002',
    timestamp: '2026-03-18T06:00:00Z',
    attacker: 'Israel',
    target: 'Hezbollah',
    location: 'Tyre, Lebanon',
    description: 'Airstrikes targeted rocket launch sites in southern Lebanon',
    zoneId: 'israel-hezbollah',
    contextLink: '/context/tyre-strikes-march-18'
  },
  {
    id: 'esc-003',
    timestamp: '2026-03-18T02:00:00Z',
    attacker: 'Iran',
    target: 'Israel',
    location: 'Tel Aviv, Israel',
    description: 'Ballistic missile strike on central Israel, explosions confirmed',
    zoneId: 'us-iran',
    contextLink: '/context/iran-missile-tel-aviv'
  },
  {
    id: 'esc-004',
    timestamp: '2026-03-17T14:00:00Z',
    attacker: 'United States',
    target: 'Iran',
    location: 'Bandar Abbas, Iran',
    description: 'Bunker-buster munitions used on missile facilities at Strait of Hormuz',
    zoneId: 'us-iran',
    contextLink: '/context/us-strikes-hormuz'
  },
  {
    id: 'esc-005',
    timestamp: '2026-03-17T12:00:00Z',
    attacker: 'Israel',
    target: 'Iran',
    location: 'Tehran, Iran',
    description: 'Precision airstrike targeted senior Iranian leadership',
    zoneId: 'us-iran',
    contextLink: '/context/tehran-leadership-strike'
  },
  {
    id: 'esc-006',
    timestamp: '2026-03-17T06:00:00Z',
    attacker: 'Iran',
    target: 'Qatar',
    location: 'Doha, Qatar',
    description: 'Ballistic missile intercepted, industrial area fire from debris',
    zoneId: 'us-iran',
    contextLink: '/context/doha-missile-intercepted'
  },
  {
    id: 'esc-007',
    timestamp: '2026-03-14T18:00:00Z',
    attacker: 'Pakistan',
    target: 'Afghanistan',
    location: 'Kandahar, Afghanistan',
    description: 'Airstrikes on Taliban facility used to launch drones into Pakistan',
    zoneId: 'pak-afghan',
    contextLink: '/context/pakistan-kandahar-strike'
  }
];

/**
 * Relationship Web Data
 * Key actors and their conflict relationships
 */
const RELATIONSHIP_ACTORS = [
  { id: 'us', name: 'United States', type: 'superpower', region: 'North America', x: 20, y: 30 },
  { id: 'iran', name: 'Iran', type: 'regional', region: 'Middle East', x: 50, y: 50 },
  { id: 'israel', name: 'Israel', type: 'regional', region: 'Middle East', x: 45, y: 35 },
  { id: 'pakistan', name: 'Pakistan', type: 'regional', region: 'South Asia', x: 70, y: 40 },
  { id: 'afghanistan', name: 'Afghanistan', type: 'regional', region: 'South Asia', x: 65, y: 30 },
  { id: 'hezbollah', name: 'Hezbollah', type: 'militant', region: 'Levant', x: 40, y: 40 },
  { id: 'uae', name: 'UAE', type: 'regional', region: 'Middle East', x: 60, y: 55 },
  { id: 'saudi', name: 'Saudi Arabia', type: 'regional', region: 'Middle East', x: 45, y: 60 },
];

const RELATIONSHIP_LINKS = [
  { source: 'us', target: 'iran', type: 'direct-conflict', intensity: 'high' },
  { source: 'us', target: 'israel', type: 'alliance', intensity: 'strong' },
  { source: 'us', target: 'uae', type: 'alliance', intensity: 'strong' },
  { source: 'us', target: 'saudi', type: 'alliance', intensity: 'medium' },
  { source: 'iran', target: 'israel', type: 'direct-conflict', intensity: 'high' },
  { source: 'iran', target: 'hezbollah', type: 'support', intensity: 'strong' },
  { source: 'iran', target: 'uae', type: 'direct-conflict', intensity: 'high' },
  { source: 'iran', target: 'saudi', type: 'proxy-conflict', intensity: 'medium' },
  { source: 'israel', target: 'hezbollah', type: 'direct-conflict', intensity: 'high' },
  { source: 'pakistan', target: 'afghanistan', type: 'direct-conflict', intensity: 'high' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format timestamp to relative time
 */
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

/**
 * Get color classes based on conflict zone color
 */
const getZoneColorClasses = (color) => {
  const colorMap = {
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300',
      dot: 'bg-red-500'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300',
      dot: 'bg-amber-500'
    },
    red: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      badge: 'bg-red-500/20 text-red-300',
      dot: 'bg-red-500'
    }
  };
  return colorMap[color] || colorMap.blue;
};

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Hero Section with Interactive Map
 * Displays all 22 attacks color-coded by conflict zone
 */
const HeroMapSection = ({ selectedZone, onZoneSelect }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative">
      {/* Section Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
              Regional Conflict Tracker
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Understanding <span className="text-white font-medium">why</span> wars are happening across active conflict zones
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Live tracking 22 verified attacks</span>
          </div>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Map Header with Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="text-white font-medium">Interactive Conflict Map</span>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4">
            {CONFLICT_ZONES.map(zone => {
              const colors = getZoneColorClasses(zone.color);
              const isActive = selectedZone === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => onZoneSelect(isActive ? null : zone.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                    isActive 
                      ? `${colors.bg} ${colors.border} ${colors.text} border` 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span>{zone.name}</span>
                  <span className="text-xs opacity-60">({zone.attackCount})</span>
                </button>
              );
            })}
            {selectedZone && (
              <button
                onClick={() => onZoneSelect(null)}
                className="text-xs text-gray-500 hover:text-white underline"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Map Visualization Area */}
        <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                <span className="text-gray-500 text-sm">Loading conflict data...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Simplified Map Background - Grid Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* World Map Silhouette (SVG) */}
              <svg 
                viewBox="0 0 1000 500" 
                className="absolute inset-0 w-full h-full opacity-30"
                preserveAspectRatio="xMidYMid slice"
              >
                {/* Simplified continents as paths */}
                <path 
                  d="M200,150 Q250,100 350,120 T500,150 T650,120 T800,150" 
                  fill="none" 
                  stroke="rgba(100,116,139,0.4)" 
                  strokeWidth="1"
                />
                {/* Africa/Middle East region */}
                <ellipse cx="520" cy="280" rx="80" ry="120" fill="rgba(30,41,59,0.4)" />
                {/* Asia region */}
                <ellipse cx="750" cy="200" rx="150" ry="100" fill="rgba(30,41,59,0.4)" />
              </svg>

              {/* Attack Markers */}
              {RECENT_ESCALATIONS.map((attack, index) => {
                const zone = CONFLICT_ZONES.find(z => z.id === attack.zoneId);
                if (!zone) return null;
                
                // Calculate position based on location (simplified)
                const positions = {
                  'Tehran, Iran': { x: 58, y: 35 },
                  'Bandar Abbas, Iran': { x: 60, y: 42 },
                  'Tel Aviv, Israel': { x: 50, y: 38 },
                  'Beirut, Lebanon': { x: 48, y: 36 },
                  'Tyre, Lebanon': { x: 47, y: 37 },
                  'Doha, Qatar': { x: 62, y: 45 },
                  'Kandahar, Afghanistan': { x: 68, y: 38 },
                };
                const pos = positions[attack.location] || { x: 50 + (index * 3), y: 40 };
                
                const isFiltered = selectedZone && selectedZone !== attack.zoneId;
                const colors = getZoneColorClasses(zone.color);
                
                return (
                  <motion.div
                    key={attack.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: isFiltered ? 0.5 : 1, 
                      opacity: isFiltered ? 0.2 : 1 
                    }}
                    transition={{ delay: index * 0.05 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    {/* Pulse Animation */}
                    <div className={`absolute inset-0 rounded-full ${colors.dot} opacity-30 animate-ping`} 
                         style={{ width: '20px', height: '20px', margin: '-6px' }} />
                    
                    {/* Marker Dot */}
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} relative z-10`} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="bg-black/90 border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-white">{attack.location}</div>
                        <div className="text-[10px] text-gray-400">{attack.description.slice(0, 40)}...</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Zone Labels */}
              <div className="absolute top-[35%] left-[55%] text-xs font-medium text-gray-500">IRAN</div>
              <div className="absolute top-[38%] left-[48%] text-xs font-medium text-gray-500">ISRAEL</div>
              <div className="absolute top-[38%] left-[68%] text-xs font-medium text-gray-500">AFGHANISTAN</div>
              <div className="absolute top-[36%] left-[46%] text-xs font-medium text-gray-500">LEBANON</div>
            </>
          )}
        </div>

        {/* Map Footer Stats */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">
                <span className="text-white font-medium">22</span> verified attacks tracked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-400">
                Last updated: <span className="text-white">{getRelativeTime('2026-03-18T08:00:00Z')}</span>
              </span>
            </div>
          </div>
          <Link 
            to="/methodology" 
            className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Info className="w-4 h-4" />
            Data methodology
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Active Conflict Zones Grid
 * 3-column grid showing each conflict zone card
 */
const ConflictZonesSection = ({ onZoneSelect }) => {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Active Conflict Zones</h2>
            <p className="text-gray-500 text-sm mt-1">Three major regional conflicts with ongoing military activity</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="w-4 h-4" />
            <span>Sorted by recent activity</span>
          </div>
        </div>

        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONFLICT_ZONES.map((zone, index) => {
            const colors = getZoneColorClasses(zone.color);
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`group relative bg-black/40 border ${colors.border} rounded-xl p-5 hover:bg-black/60 transition-all cursor-pointer`}
                onClick={() => onZoneSelect(zone.id)}
              >
                {/* Zone Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-2xl">
                      <span>{zone.flag1}</span>
                      <span className="text-gray-600 mx-1 text-sm">vs</span>
                      <span>{zone.flag2}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{zone.name}</h3>
                      <span className="text-xs text-gray-500">{zone.region}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                    {zone.attackCount} attacks
                  </div>
                </div>

                {/* Root Cause */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Root Cause</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{zone.rootCause}</p>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{zone.description}</p>

                {/* Key Actors */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {zone.keyActors.slice(0, 3).map(actor => (
                    <span key={actor} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                      {actor}
                    </span>
                  ))}
                  {zone.keyActors.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">
                      +{zone.keyActors.length - 3}
                    </span>
                  )}
                </div>

                {/* Explore Link */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className={`text-xs ${colors.text}`}>
                    Last escalation: {getRelativeTime(zone.lastEscalation)}
                  </span>
                  <Link 
                    to={zone.link}
                    className={`flex items-center gap-1 text-sm font-medium ${colors.text} hover:opacity-80 transition-opacity`}
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Relationship Web Section
 * Simplified visualization of key actors and their relationships
 */
const RelationshipWebSection = () => {
  const [hoveredActor, setHoveredActor] = useState(null);
  
  return (
    <section className="py-12 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Relationship Web</h2>
          <p className="text-gray-500">Visualizing who's fighting whom across regional conflicts</p>
        </div>

        {/* Relationship Visualization */}
        <div className="relative bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[400px]">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {RELATIONSHIP_LINKS.map((link, index) => {
              const source = RELATIONSHIP_ACTORS.find(a => a.id === link.source);
              const target = RELATIONSHIP_ACTORS.find(a => a.id === link.target);
              if (!source || !target) return null;
              
              const isHighlighted = hoveredActor === link.source || hoveredActor === link.target;
              const isConflict = link.type.includes('conflict');
              
              return (
                <motion.line
                  key={index}
                  x1={`${source.x}%`}
                  y1={`${source.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={isConflict ? '#ef4444' : '#cc1a1a'}
                  strokeWidth={isHighlighted ? 3 : isConflict ? 2 : 1}
                  strokeOpacity={isHighlighted ? 1 : 0.3}
                  strokeDasharray={link.type === 'support' ? '5,5' : link.type === 'proxy-conflict' ? '10,5' : '0'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                />
              );
            })}
          </svg>

          {/* Actor Nodes */}
          {RELATIONSHIP_ACTORS.map((actor, index) => {
            const isHovered = hoveredActor === actor.id;
            const hasConflict = RELATIONSHIP_LINKS.some(l => 
              (l.source === actor.id || l.target === actor.id) && l.type.includes('conflict')
            );
            
            return (
              <motion.div
                key={actor.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${actor.x}%`, top: `${actor.y}%` }}
                onMouseEnter={() => setHoveredActor(actor.id)}
                onMouseLeave={() => setHoveredActor(null)}
              >
                <div className={`
                  relative px-3 py-2 rounded-lg border text-sm font-medium transition-all
                  ${isHovered 
                    ? 'bg-white/10 border-white/30 text-white scale-110' 
                    : hasConflict
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }
                `}>
                  {actor.name}
                  
                  {/* Type indicator */}
                  <div className={`
                    absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black
                    ${actor.type === 'superpower' ? 'bg-purple-500' : 
                      actor.type === 'militant' ? 'bg-orange-500' : 'bg-gray-500'}
                  `} />
                </div>
              </motion.div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" />
              <span className="text-gray-400">Direct Conflict</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" style={{ background: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 5px, transparent 5px, transparent 10px)' }} />
              <span className="text-gray-400">Proxy Conflict</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" />
              <span className="text-gray-400">Alliance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-500" style={{ background: 'repeating-linear-gradient(90deg, #cc1a1a, #cc1a1a 3px, transparent 3px, transparent 6px)' }} />
              <span className="text-gray-400">Support</span>
            </div>
          </div>

          {/* Actor Types Legend */}
          <div className="absolute bottom-4 right-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-gray-400">Superpower</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              <span className="text-gray-400">Regional State</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-gray-400">Militant Group</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Recent Escalations Timeline Strip
 * Shows last 5-7 attacks with context links
 */
const RecentEscalationsSection = () => {
  return (
    <section className="py-12 border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Recent Escalations</h2>
            <p className="text-gray-500 text-sm mt-1">Latest military actions across all tracked conflicts</p>
          </div>
          <Link 
            to="/timeline"
            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View full timeline
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Escalations List */}
        <div className="space-y-3">
          {RECENT_ESCALATIONS.map((escalation, index) => {
            const zone = CONFLICT_ZONES.find(z => z.id === escalation.zoneId);
            const colors = getZoneColorClasses(zone?.color || 'blue');
            
            return (
              <motion.div
                key={escalation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="group flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 hover:bg-black/50 transition-all"
              >
                {/* Timestamp */}
                <div className="flex items-center gap-2 min-w-[120px]">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{getRelativeTime(escalation.timestamp)}</span>
                </div>

                {/* Zone Badge */}
                <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.badge} text-xs font-medium`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {zone?.name}
                </div>

                {/* Attacker → Target */}
                <div className="flex items-center gap-2 min-w-[180px]">
                  <span className="text-white font-medium">{escalation.attacker}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600" />
                  <span className="text-gray-400">{escalation.target}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500 md:min-w-[140px]">
                  <MapPin className="w-3.5 h-3.5" />
                  {escalation.location}
                </div>

                {/* Description */}
                <p className="flex-1 text-sm text-gray-400 line-clamp-1">
                  {escalation.description}
                </p>

                {/* Why Button */}
                <Link
                  to={escalation.contextLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white text-sm transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  Why?
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Context Note */}
        <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-300 mb-1">Understanding the Context</h4>
              <p className="text-sm text-gray-400">
                Each escalation has historical and political context. Click "Why?" to understand the background, 
                root causes, and potential implications of each military action.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/**
 * Footer Component
 * Data sources, About, API links
 */
const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Data Sources */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-gray-500" />
            <h4 className="text-white font-medium">Data Sources</h4>
          </div>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Verified news reports from Reuters, AP, BBC</li>
            <li>Government and military official statements</li>
            <li>NASA FIRMS satellite fire detection</li>
            <li>ACLED conflict data</li>
          </ul>
        </div>

        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-gray-500" />
            <h4 className="text-white font-medium">About</h4>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Regional Conflict Tracker provides verified, educational information about ongoing 
            conflicts. We focus on accuracy and context to help you understand why wars are happening.
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-red-400 hover:text-red-300">About us</Link>
            <Link to="/methodology" className="text-sm text-red-400 hover:text-red-300">Methodology</Link>
            <Link to="/contact" className="text-sm text-red-400 hover:text-red-300">Contact</Link>
          </div>
        </div>

        {/* API & Resources */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-gray-500" />
            <h4 className="text-white font-medium">API & Resources</h4>
          </div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/api/docs" className="text-gray-500 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                API Documentation
              </Link>
            </li>
            <li>
              <Link to="/data/export" className="text-gray-500 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Data Export (JSON/CSV)
              </Link>
            </li>
            <li>
              <Link to="/embed" className="text-gray-500 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Embed Widgets
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600">
          © 2026 Regional Conflict Tracker. Data verified by human analysts.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <Link to="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gray-400">Terms of Use</Link>
          <Link to="/disclaimer" className="hover:text-gray-400">Disclaimer</Link>
        </div>
      </div>
    </footer>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RegionalConflictTracker() {
  const [selectedZone, setSelectedZone] = useState(null);

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Map Section */}
        <HeroMapSection 
          selectedZone={selectedZone} 
          onZoneSelect={setSelectedZone} 
        />

        {/* Active Conflict Zones */}
        <ConflictZonesSection 
          onZoneSelect={setSelectedZone} 
        />

        {/* Relationship Web */}
        <RelationshipWebSection />

        {/* Recent Escalations */}
        <RecentEscalationsSection />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

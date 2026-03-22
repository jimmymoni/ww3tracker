import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, AlertTriangle, Clock,
  Target, Globe, ExternalLink, ChevronRight, ChevronLeft,
  Shuffle, Shield, Zap, Plane, Bomb, Siren, Crosshair,
  Navigation, Share2, Info, CheckCircle, ChevronDown
} from 'lucide-react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { VERIFIED_ATTACKS } from '../../server/data/verifiedAttacks';

// ============================================================================
// MINI MAP COMPONENT - Focused on single attack
// ============================================================================

function MiniAttackMap({ attack, height = 300 }) {
  const [worldData, setWorldData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const svgRef = useState(null);
  
  const { lat, lng } = attack.coordinates;
  
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(data => {
        setWorldData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const projection = useMemo(() => {
    return d3.geoMercator()
      .center([lng, lat])
      .scale(1800)
      .translate([400, height / 2]);
  }, [lat, lng, height]);

  const path = d3.geoPath().projection(projection);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      default: return '#eab308';
    }
  };

  const [x, y] = projection([lng, lat]) || [400, height / 2];
  const color = getSeverityColor(attack.severity);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#020617] border border-white/10" style={{ height }}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <svg width="100%" height={height} className="absolute inset-0">
          <defs>
            <filter id="glow-red" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feFlood floodColor={color} floodOpacity="0.8" />
              <feComposite in2="blur" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <pattern id="grid-mini" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          
          <rect width="100%" height="100%" fill="#020617" />
          <rect width="100%" height="100%" fill="url(#grid-mini)" />
          <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.3)" />

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

          {/* Target location pulse */}
          <circle cx={x} cy={y} r={20} fill={color} opacity={0.1}>
            <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Target location marker */}
          <circle cx={x} cy={y} r={12} fill={color} opacity={0.3} />
          <circle cx={x} cy={y} r={6} fill={color} stroke="rgba(0,0,0,0.5)" strokeWidth={1} style={{ filter: 'url(#glow-red)' }} />
          
          {/* Location label */}
          <g>
            <rect x={x - 50} y={y + 15} width="100" height="22" rx="4" fill="rgba(0,0,0,0.9)" stroke={color} strokeWidth="0.5" />
            <text x={x} y={y + 30} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
              {attack.location}
            </text>
          </g>
        </svg>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            {attack.severity === 'high' ? 'Critical Strike' : attack.severity === 'medium' ? 'Elevated' : 'Monitoring'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ATTACK ICON COMPONENT
// ============================================================================

function AttackIcon({ type, severity }) {
  const iconClass = "w-5 h-5";
  
  const icons = {
    airstrike: <Plane className={iconClass} />,
    missile: <Zap className={iconClass} />,
    drone: <Crosshair className={iconClass} />,
    bomb: <Bomb className={iconClass} />,
    strike: <Siren className={iconClass} />,
    default: <Target className={iconClass} />
  };

  const bgColors = {
    high: 'bg-red-500/20 border-red-500/30',
    medium: 'bg-orange-500/20 border-orange-500/30',
    low: 'bg-yellow-500/20 border-yellow-500/30'
  };

  const iconColors = {
    high: 'text-red-400',
    medium: 'text-orange-400',
    low: 'text-yellow-400'
  };

  return (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${bgColors[severity] || bgColors.medium}`}>
      <span className={iconColors[severity] || iconColors.medium}>
        {icons[type] || icons.default}
      </span>
    </div>
  );
}

// ============================================================================
// DETAIL CARD COMPONENT
// ============================================================================

function DetailCard({ icon, label, value, subvalue }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-semibold text-white">{value}</div>
      {subvalue && <div className="text-xs text-gray-500 mt-1">{subvalue}</div>}
    </div>
  );
}

// ============================================================================
// RELATED ATTACK CARD
// ============================================================================

function RelatedAttackCard({ attack, isActive }) {
  const severityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-orange-500/30 bg-orange-500/5',
    low: 'border-yellow-500/30 bg-yellow-500/5'
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <Link 
      to={`/attack/${attack.id}`}
      className={`flex-shrink-0 w-[260px] snap-start p-4 rounded-xl border transition-all hover:scale-[1.02] ${
        isActive 
          ? 'border-red-500/50 bg-red-500/10' 
          : severityColors[attack.severity]
      }`}
    >
      <div className="flex items-start gap-3">
        <AttackIcon type={attack.attackType} severity={attack.severity} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-white text-sm truncate">{attack.location}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
              attack.severity === 'high' ? 'bg-red-500 text-white' :
              attack.severity === 'medium' ? 'bg-orange-500 text-white' :
              'bg-yellow-500 text-black'
            }`}>
              {attack.severity}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{attack.headline}</p>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatTime(attack.date)} UTC</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// NAVIGATION BUTTON
// ============================================================================

function NavButton({ attack, direction, onRandom }) {
  if (!attack && !onRandom) return null;

  if (onRandom) {
    return (
      <button
        onClick={onRandom}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Shuffle className="w-5 h-5 text-gray-400" />
        <div className="text-left">
          <div className="text-xs text-gray-500 uppercase tracking-wider">Random</div>
          <div className="text-sm text-white font-medium">Surprise me</div>
        </div>
      </button>
    );
  }

  return (
    <Link
      to={`/attack/${attack.id}`}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors ${
        direction === 'next' ? 'flex-row-reverse text-right' : ''
      }`}
    >
      {direction === 'prev' ? (
        <ChevronLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      <div className="min-w-0">
        <div className={`text-xs text-gray-500 uppercase tracking-wider ${direction === 'next' ? 'text-right' : ''}`}>
          {direction === 'prev' ? 'Previous' : 'Next'}
        </div>
        <div className={`text-sm text-white font-medium truncate max-w-[150px] ${direction === 'next' ? 'text-right' : ''}`}>
          {attack.location}
        </div>
      </div>
    </Link>
  );
}

// ============================================================================
// SHARE BUTTON
// ============================================================================

function ShareButton({ attack }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/attack/${attack.id}`;
    const text = `${attack.headline} - WW3 Tracker`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
    >
      {copied ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">Share</span>
        </>
      )}
    </button>
  );
}

// ============================================================================
// MAIN ATTACK PAGE COMPONENT
// ============================================================================

export default function AttackPage() {
  const { id } = useParams();
  const [showSources, setShowSources] = useState(false);
  const [randomAttack, setRandomAttack] = useState(null);
  
  const attack = useMemo(() => 
    VERIFIED_ATTACKS.find(a => a.id === id),
    [id]
  );

  // Calculate "Day X of Conflict" - based on first attack date (March 17, 2026)
  const dayOfConflict = useMemo(() => {
    if (!attack) return 1;
    const firstAttackDate = new Date('2026-03-17');
    const attackDate = new Date(attack.date);
    const diffTime = attackDate - firstAttackDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }, [attack]);

  // Get attacks from same date for "What else happened"
  const sameDayAttacks = useMemo(() => {
    if (!attack) return [];
    const attackDate = new Date(attack.date).toDateString();
    return VERIFIED_ATTACKS
      .filter(a => 
        new Date(a.date).toDateString() === attackDate && 
        a.id !== attack.id
      )
      .slice(0, 3);
  }, [attack]);

  // Get other attacks in same country
  const otherLocationAttacks = useMemo(() => {
    if (!attack) return [];
    return VERIFIED_ATTACKS
      .filter(a => 
        a.country === attack.country && 
        a.id !== attack.id
      )
      .slice(0, 2);
  }, [attack]);

  // Get prev/next attacks chronologically
  const { prevAttack, nextAttack } = useMemo(() => {
    if (!attack) return {};
    
    const sorted = [...VERIFIED_ATTACKS].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    const currentIndex = sorted.findIndex(a => a.id === attack.id);
    
    return {
      prevAttack: currentIndex > 0 ? sorted[currentIndex - 1] : null,
      nextAttack: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null
    };
  }, [attack]);

  // Get random attack
  const handleRandom = () => {
    const random = VERIFIED_ATTACKS[Math.floor(Math.random() * VERIFIED_ATTACKS.length)];
    if (random.id !== attack.id) {
      window.location.href = `/attack/${random.id}`;
    } else {
      handleRandom(); // Try again if same attack
    }
  };

  if (!attack) {
    return <Navigate to="/live-map" replace />;
  }

  // Format date
  const formattedDate = new Date(attack.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const formattedTime = new Date(attack.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });

  // Format coordinates
  const formatCoords = (lat, lng) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
  };

  // Attack type display
  const attackTypeDisplay = {
    airstrike: 'Airstrike',
    missile: 'Missile Strike',
    drone: 'Drone Attack',
    bomb: 'Bombing',
    strike: 'Strike',
    default: 'Attack'
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] bg-grid text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            to="/live-map" 
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Attacks</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              {attack.conflictZone === 'us-iran-war-2026' ? 'US-Iran War' : 
               attack.conflictZone === 'israel-hezbollah-conflict' ? 'Israel-Hezbollah Conflict' : 
               'Conflict Zone'}
            </span>
            <ShareButton attack={attack} />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {/* HERO SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Day Counter Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
              Day {dayOfConflict} of Conflict
            </span>
            {attack.severity === 'high' && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase">
                <AlertTriangle className="w-3 h-3" />
                Critical
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {attack.headline}
          </h1>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{attack.location}, {attack.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="capitalize">{attackTypeDisplay[attack.attackType] || attack.attackType}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${
                attack.severity === 'high' ? 'text-red-400' :
                attack.severity === 'medium' ? 'text-orange-400' :
                'text-yellow-400'
              }`} />
              <span className={`uppercase font-medium ${
                attack.severity === 'high' ? 'text-red-400' :
                attack.severity === 'medium' ? 'text-orange-400' :
                'text-yellow-400'
              }`}>
                {attack.severity} Severity
              </span>
            </div>
          </div>
        </motion.section>

        {/* MAP SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <MiniAttackMap attack={attack} height={280} />
          <div className="flex items-center justify-end mt-3">
            <Link 
              to="/live-map"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              View on full map
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </motion.section>

        {/* WHAT HAPPENED SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Here's What Went Down
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
            {/* Main description - split into paragraphs for readability */}
            {attack.description.split('. ').filter(Boolean).map((sentence, idx) => (
              <p key={idx} className="text-gray-300 leading-relaxed">
                {sentence.trim()}{!sentence.endsWith('.') && '.'}
              </p>
            ))}
            
            {/* Context */}
            {attack.context && (
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-gray-500">
                  <span className="text-gray-400 font-medium">Location context:</span> {attack.context}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* DETAILS GRID */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-red-400" />
            The Details
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <DetailCard 
              icon={<MapPin className="w-4 h-4 text-gray-500" />}
              label="Location"
              value={attack.location}
              subvalue={attack.country}
            />
            <DetailCard 
              icon={<Target className="w-4 h-4 text-gray-500" />}
              label="Attack Type"
              value={attackTypeDisplay[attack.attackType] || attack.attackType}
              subvalue="Confirmed strike"
            />
            <DetailCard 
              icon={<Clock className="w-4 h-4 text-gray-500" />}
              label="Time (UTC)"
              value={formattedTime}
              subvalue={formattedDate}
            />
            <DetailCard 
              icon={<AlertTriangle className="w-4 h-4 text-gray-500" />}
              label="Severity"
              value={attack.severity.toUpperCase()}
              subvalue={attack.severity === 'high' ? 'Critical incident' : 
                       attack.severity === 'medium' ? 'Significant impact' : 
                       'Under monitoring'}
            />
            <DetailCard 
              icon={<Globe className="w-4 h-4 text-gray-500" />}
              label="Coordinates"
              value={formatCoords(attack.coordinates.lat, attack.coordinates.lng)}
              subvalue={`Lat: ${attack.coordinates.lat.toFixed(4)}, Lng: ${attack.coordinates.lng.toFixed(4)}`}
            />
            <DetailCard 
              icon={<Shield className="w-4 h-4 text-gray-500" />}
              label="Sources"
              value="Verified Reports"
              subvalue={attack.source || 'Multiple sources'}
            />
          </div>
        </motion.section>

        {/* WHY THIS MATTERS SECTION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Why This Matters
          </h2>
          
          <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-5">
            <p className="text-gray-300 leading-relaxed">
              {attack.conflictZone === 'us-iran-war-2026' ? (
                <>
                  This strike is part of the escalating US-Iran conflict that kicked off on March 17, 2026. 
                  {attack.country === 'Qatar' || attack.country === 'Saudi Arabia' || attack.country === 'Kuwait' 
                    ? ' Hitting Gulf energy infrastructure is a major escalation — it threatens global oil supplies and drags more nations into the fight.' 
                    : attack.country === 'Israel' 
                      ? ' Direct Iranian attacks on Israeli territory mark a dangerous new phase in the long-running proxy war.'
                      : attack.country === 'Iran'
                        ? ' Strikes inside Iran signal that the conflict has moved beyond proxy warfare to direct confrontation.'
                        : ' Every strike raises the temperature and makes de-escalation harder.'}
                </>
              ) : attack.conflictZone === 'israel-hezbollah-conflict' ? (
                <>
                  Israel-Hezbollah tensions have been simmering for years, but these strikes show the conflict is heating up fast. 
                  {attack.country === 'Lebanon' 
                    ? ' Airstrikes in Beirut put civilian populations at risk and could trigger wider regional involvement.'
                    : ' Cross-border attacks threaten to spiral into a full-scale war that could draw in multiple regional powers.'}
                </>
              ) : (
                <>
                  This attack represents another data point in an increasingly volatile region. 
                  The pattern of escalation suggests we're watching the early stages of a conflict that could reshape the Middle East.
                </>
              )}
            </p>
            
            <div className="mt-4 pt-4 border-t border-red-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white mb-1">Strategic Impact</div>
                  <p className="text-sm text-gray-400">
                    {attack.severity === 'high' 
                      ? 'High-severity incidents like this one significantly increase the risk of broader escalation and retaliation.'
                      : 'Even medium-severity attacks can trigger chain reactions in an already volatile environment.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* RELATED TIMELINE - Same Day */}
        {sameDayAttacks.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400" />
              What Else Happened That Day
            </h2>
            
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {sameDayAttacks.map(relatedAttack => (
                <RelatedAttackCard 
                  key={relatedAttack.id} 
                  attack={relatedAttack}
                  isActive={false}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* LOCATION CONTEXT */}
        {otherLocationAttacks.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              Other Attacks in {attack.country}
            </h2>
            
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x">
              {otherLocationAttacks.map(relatedAttack => (
                <RelatedAttackCard 
                  key={relatedAttack.id} 
                  attack={relatedAttack}
                  isActive={false}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* SOURCES & VERIFICATION */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-400" />
              <div className="text-left">
                <div className="font-semibold text-white">Sources & Verification</div>
                <div className="text-sm text-gray-500">How we confirm what happened</div>
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showSources ? 'rotate-180' : ''}`} />
          </button>
          
          {showSources && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-4 bg-white/5 border border-white/10 rounded-xl"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Source Information</h4>
                  <p className="text-sm text-gray-400">{attack.source || 'Verified through multiple independent sources'}</p>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Verification Process
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Cross-referenced with multiple news agencies and official statements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Geolocation verified through satellite imagery when available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Timestamps correlated across sources for accuracy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>Severity assessed based on damage reports and official confirmations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-white/10 text-xs text-gray-500">
                  <p>
                    WW3 Tracker maintains strict editorial standards. We only publish verified facts, 
                    not speculation or unconfirmed reports. All attacks in our database have been 
                    manually reviewed and cross-checked by our team.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* NAVIGATION FOOTER */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="pt-6 border-t border-white/10"
        >
          <div className="grid grid-cols-3 gap-3">
            <NavButton attack={prevAttack} direction="prev" />
            <NavButton onRandom={handleRandom} />
            <NavButton attack={nextAttack} direction="next" />
          </div>
        </motion.section>
      </main>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-[-90deg]" />
      </button>
    </div>
  );
}

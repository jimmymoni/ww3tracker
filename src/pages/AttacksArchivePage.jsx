import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  ChevronDown, 
  Filter,
  Archive,
  ArrowRight,
  Target,
  Bomb,
  Plane,
  Zap,
  Crosshair
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import the verified attacks data
// Note: This will be copied to src/data or imported from server/data
const VERIFIED_ATTACKS = [
  {
    id: '2026-03-19-ras-laffan',
    headline: 'Iranian missiles hit Qatar LNG facility',
    description: '5 ballistic missiles fired at world\'s largest LNG hub. 1 impacted. Extensive fires. No worker injuries. Global energy market impact.',
    location: 'Ras Laffan',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-19T03:00:00Z',
    coordinates: { lat: 25.9, lng: 51.5 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-19-riyadh-refineries',
    headline: 'Iranian missiles strike Riyadh oil refineries',
    description: 'Multiple ballistic missiles hit oil refineries near Saudi capital. Explosions and fires. Limited casualties due to intercepts.',
    location: 'Riyadh',
    country: 'Saudi Arabia',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-19T04:00:00Z',
    coordinates: { lat: 24.7136, lng: 46.6753 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-beit-awwa',
    headline: 'Iranian missile strike on West Bank - first direct hit',
    description: 'First Iranian missile strike in West Bank. Civilian area in Beit Awwa targeted. 4 killed, 6 injured. Regional expansion of conflict.',
    location: 'Beit Awwa',
    country: 'West Bank',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T08:00:00Z',
    coordinates: { lat: 31.5, lng: 35.0 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-tyre',
    headline: 'Israeli airstrikes on Hezbollah rocket launch sites in southern Lebanon',
    description: 'Tyre, South Lebanon coastal launch areas. Rocket launch sites targeted. Multiple Hezbollah sites hit.',
    location: 'Tyre',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'medium',
    date: '2026-03-18T06:00:00Z',
    coordinates: { lat: 33.2700, lng: 35.2033 },
    conflictZone: 'israel-hezbollah-conflict'
  },
  {
    id: '2026-03-18-beirut-hezbollah',
    headline: 'Israeli airstrike on Hezbollah-linked structure in central Beirut',
    description: 'Central district, targeted building. Hezbollah-linked structure destroyed following warning.',
    location: 'Beirut',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-18T08:00:00Z',
    coordinates: { lat: 33.8938, lng: 35.5018 },
    conflictZone: 'israel-hezbollah-conflict'
  },
  {
    id: '2026-03-18-ramat-gan',
    headline: 'Iranian ballistic missile strike kills 2 in Ramat Gan suburb',
    description: 'IRGC missiles with cluster munitions hit residential building. Elderly couple killed by shrapnel. Rail station damaged.',
    location: 'Ramat Gan',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T04:00:00Z',
    coordinates: { lat: 32.07, lng: 34.82 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-south-pars',
    headline: 'Israeli airstrikes on South Pars gas field, Iran',
    description: 'World\'s largest gas field hit. Gas storage tanks and petrochemical plants targeted. Production halted.',
    location: 'Asaluyeh',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-18T15:00:00Z',
    coordinates: { lat: 27.5, lng: 52.5 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-tel-aviv-missile',
    headline: 'Iranian ballistic missile strike on central Tel Aviv',
    description: 'Central urban impact zone. Ballistic missiles targeting civilian/urban area. Explosions confirmed, damage reported.',
    location: 'Tel Aviv',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-18T02:00:00Z',
    coordinates: { lat: 32.1098, lng: 34.8555 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-beirut-multi',
    headline: 'Israeli airstrikes hit multiple Beirut neighborhoods',
    description: 'Kafaat, Haret Hreik, and Doha Aramoun neighborhoods. Urban/military-linked sites including Hezbollah-linked areas targeted.',
    location: 'Beirut',
    country: 'Lebanon',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T02:30:00Z',
    coordinates: { lat: 33.8738, lng: 35.5218 },
    conflictZone: 'israel-hezbollah-conflict'
  },
  {
    id: '2026-03-17-baghdad-residential',
    headline: 'Missile strike on residential building in Baghdad al-Jadriya',
    description: 'Al-Jadriya residential district. Civilian building hit. Injuries reported; Iran-linked personnel casualties.',
    location: 'Baghdad',
    country: 'Iraq',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T05:00:00Z',
    coordinates: { lat: 33.2854, lng: 44.3848 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-baghdad-embassy',
    headline: 'Major attack on US Embassy Baghdad - rockets and drones',
    description: 'Green Zone – US Embassy compound. At least 5 drones and rockets launched; one drone hit inside compound.',
    location: 'Baghdad',
    country: 'Iraq',
    attackType: 'drone',
    severity: 'high',
    date: '2026-03-17T01:45:00Z',
    coordinates: { lat: 33.3128, lng: 44.3615 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-doha-intercepted',
    headline: 'Iranian ballistic missile attack on Doha intercepted',
    description: 'Airspace over central Doha. Missile intercepted by air defense. Fire in industrial area from debris. No casualties.',
    location: 'Doha',
    country: 'Qatar',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T06:00:00Z',
    coordinates: { lat: 25.2854, lng: 51.5310 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-kuwait-oil',
    headline: 'Iranian missile and drone strikes on Gulf oil facilities',
    description: 'Kuwait City oil/port infrastructure zone. Energy facilities targeted. No casualties confirmed.',
    location: 'Kuwait City',
    country: 'Kuwait',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T16:00:00Z',
    coordinates: { lat: 29.3759, lng: 47.9774 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-tel-aviv-barrage',
    headline: 'Iranian missile and drone barrage on Tel Aviv metro',
    description: 'Central district / Gush Dan region. Urban + air defense zones targeted. Multiple interceptions, minor injuries.',
    location: 'Tel Aviv',
    country: 'Israel',
    attackType: 'missile',
    severity: 'high',
    date: '2026-03-17T03:00:00Z',
    coordinates: { lat: 32.0853, lng: 34.7818 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-hormuz-usa',
    headline: 'US airstrikes on Iranian missile facilities in Strait of Hormuz',
    description: 'Bandar Abbas port + coastal missile belt. Missile storage/launch sites targeted with heavy bunker-buster munitions.',
    location: 'Bandar Abbas',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T14:00:00Z',
    coordinates: { lat: 27.1833, lng: 56.2666 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-tehran-leadership',
    headline: 'Israeli precision airstrike on senior Iranian leadership in Tehran',
    description: 'Central govt district / security zone. Senior leadership compound targeted. High-level officials killed.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T12:00:00Z',
    coordinates: { lat: 35.6892, lng: 51.3890 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-17-tehran-wave',
    headline: 'Wide-scale Israeli strikes on Tehran government & military infrastructure',
    description: 'West & north districts incl. military/admin zones. Govt & IRGC-linked infrastructure targeted.',
    location: 'Tehran',
    country: 'Iran',
    attackType: 'airstrike',
    severity: 'high',
    date: '2026-03-17T04:30:00Z',
    coordinates: { lat: 35.7219, lng: 51.3347 },
    conflictZone: 'us-iran-war-2026'
  },
  {
    id: '2026-03-18-hezbollah-rockets',
    headline: 'Hezbollah rocket attacks on northern Israel',
    description: 'Coordinated rocket barrage on Kiryat Shmona and Ashkelon. Part of broader Iranian-backed offensive.',
    location: 'Kiryat Shmona',
    country: 'Israel',
    attackType: 'missile',
    severity: 'medium',
    date: '2026-03-18T12:00:00Z',
    coordinates: { lat: 33.2, lng: 35.6 },
    conflictZone: 'israel-hezbollah-conflict'
  },
];

// Country flag emojis
const COUNTRY_FLAGS = {
  'Iran': '🇮🇷',
  'Israel': '🇮🇱',
  'Qatar': '🇶🇦',
  'Kuwait': '🇰🇼',
  'Iraq': '🇮🇶',
  'Lebanon': '🇱🇧',
  'Saudi Arabia': '🇸🇦',
  'West Bank': '🇵🇸'
};

// Severity configuration
const SEVERITY_CONFIG = {
  high: { 
    label: 'CRITICAL', 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500'
  },
  medium: { 
    label: 'ELEVATED', 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500'
  },
  low: { 
    label: 'MONITORING', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    badge: 'bg-yellow-500'
  }
};

// Attack type icons
const ATTACK_ICONS = {
  airstrike: Plane,
  missile: Zap,
  drone: Target,
  bomb: Bomb,
  strike: Crosshair
};

// Format date nicely: "March 19, 2026"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

// Calculate relative time: "3 days ago"
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
};

// Attack Card Component
const AttackCard = ({ attack, index }) => {
  const severity = SEVERITY_CONFIG[attack.severity] || SEVERITY_CONFIG.medium;
  const AttackIcon = ATTACK_ICONS[attack.attackType] || Crosshair;
  const flag = COUNTRY_FLAGS[attack.country] || '🌍';
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-white/5 border ${severity.border} rounded-xl p-5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01]`}
    >
      {/* Date badge - absolute positioned */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-xs text-gray-400 font-mono">{formatDate(attack.date)}</div>
        <div className="text-[10px] text-gray-500">{getRelativeTime(attack.date)}</div>
      </div>

      {/* Header row */}
      <div className="flex items-start gap-4 mb-4 pr-24">
        <div className={`w-12 h-12 rounded-xl ${severity.bg} border ${severity.border} flex items-center justify-center flex-shrink-0`}>
          <AttackIcon className={`w-5 h-5 ${severity.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl" role="img" aria-label={attack.country}>{flag}</span>
            <span className="text-gray-400 text-sm">{attack.location}</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500 text-sm capitalize">{attack.attackType}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">
          {attack.headline}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {attack.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${severity.badge} text-white`}>
          {severity.label}
        </span>
        <Link 
          to={`/attack/${attack.id}`}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors group/link"
        >
          Read full report
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
};

// Empty State Component
const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-20"
  >
    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
      <Archive className="w-8 h-8 text-gray-500" />
    </div>
    <h3 className="font-heading font-bold text-xl text-white mb-2">
      No attacks recorded in this category yet.
    </h3>
    <p className="text-gray-500 text-sm">
      Try adjusting your filters to see all attacks.
    </p>
  </motion.div>
);

// Main Component
export default function AttacksArchivePage() {
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique countries and attack types
  const countries = useMemo(() => {
    const unique = [...new Set(VERIFIED_ATTACKS.map(a => a.country))];
    return unique.sort();
  }, []);

  const attackTypes = useMemo(() => {
    const unique = [...new Set(VERIFIED_ATTACKS.map(a => a.attackType))];
    return unique.sort();
  }, []);

  // Filter and sort attacks
  const filteredAttacks = useMemo(() => {
    let result = [...VERIFIED_ATTACKS];

    // Apply country filter
    if (countryFilter !== 'all') {
      result = result.filter(a => a.country === countryFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(a => a.attackType === typeFilter);
    }

    // Apply sort
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [countryFilter, typeFilter, sortOrder]);

  // Stats
  const totalAttacks = VERIFIED_ATTACKS.length;
  const criticalCount = VERIFIED_ATTACKS.filter(a => a.severity === 'high').length;

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      {/* Header Section */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-medium text-red-400">VERIFIED DATABASE</span>
            </div>
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              All Confirmed Attacks
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Chronological record of verified military strikes. 
              Every entry has been cross-referenced and confirmed.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats & Filters Bar */}
      <div className="sticky top-0 z-30 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{filteredAttacks.length}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {filteredAttacks.length === 1 ? 'Attack' : 'Attacks'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {criticalCount} Critical
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            <div className={`flex flex-col sm:flex-row gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Country Filter */}
              <div className="relative">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50 min-w-[140px]"
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {COUNTRY_FLAGS[country]} {country}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Attack Type Filter */}
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50 min-w-[140px]"
                >
                  <option value="all">All Types</option>
                  {attackTypes.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-10 text-sm text-white focus:outline-none focus:border-blue-500/50 min-w-[140px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attacks Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <AnimatePresence mode="wait">
          {filteredAttacks.length > 0 ? (
            <motion.div
              key={`${countryFilter}-${typeFilter}-${sortOrder}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              {filteredAttacks.map((attack, index) => (
                <AttackCard key={attack.id} attack={attack} index={index} />
              ))}
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>

        {/* Bottom note */}
        {filteredAttacks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 text-sm">
              End of verified records. Database last updated March 19, 2026.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

# Conflict Context System Design Document

## Executive Summary

This document outlines the design for a **Conflict Context System** that explains WHY conflicts are happening. The system adds "context panels" to the existing WW3 Tracker map, providing users with deep background information on conflict zones, key players, motivations, trigger events, and current status.

---

## 1. Data Structure Design

### 1.1 Conflict Zone Schema

```javascript
// server/data/conflictZones.js

/**
 * Conflict Zone Schema
 * Defines structured data for conflict context panels
 */

export const CONFLICT_ZONES = [
  {
    // Unique identifier for the conflict zone
    id: 'us-iran-war-2026',
    
    // Display information
    displayName: 'US-Iran War',
    shortName: 'Iran Conflict',
    region: 'Middle East',
    
    // Geographic bounds for map interaction
    geography: {
      center: { lat: 32.0, lng: 53.0 },
      zoom: 4,
      bounds: {
        north: 40.0, south: 24.0, east: 65.0, west: 40.0
      },
      // Associated countries for filtering
      countries: ['Iran', 'Iraq', 'Israel', 'Lebanon', 'Syria', 'UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Jordan'],
      // Key cities/locations within this conflict
      keyLocations: [
        { name: 'Tehran', lat: 35.6892, lng: 51.3890, type: 'capital' },
        { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, type: 'city' },
        { name: 'Baghdad', lat: 33.3152, lng: 44.3661, type: 'city' },
        { name: 'Beirut', lat: 33.8938, lng: 35.5018, type: 'city' },
        { name: 'Strait of Hormuz', lat: 26.5, lng: 56.5, type: 'strategic' }
      ]
    },
    
    // Metadata
    status: 'active', // 'active' | 'escalating' | 'de-escalating' | 'frozen'
    startDate: '2026-03-14',
    lastUpdated: '2026-03-18',
    
    // Conflict intensity (0-100)
    intensity: 85,
    
    // Root cause analysis
    rootCauses: {
      summary: 'Long-standing tensions over Iran\'s nuclear program, regional proxy conflicts, and strategic competition for Middle East influence.',
      factors: [
        {
          title: 'Nuclear Program Dispute',
          description: 'Iran\'s uranium enrichment activities and alleged weapons development have triggered repeated Israeli and US strikes on nuclear facilities.',
          since: '2002',
          impact: 'critical'
        },
        {
          title: 'Proxy War Dynamics',
          description: 'Iran backs Hezbollah (Lebanon), Houthis (Yemen), and Iraqi militias. Israel and US support opposing forces.',
          since: '1979',
          impact: 'high'
        },
        {
          title: 'Strategic Chokepoint Control',
          description: 'Control of Strait of Hormuz, through which 20% of global oil passes, makes this conflict globally significant.',
          since: 'Ongoing',
          impact: 'critical'
        }
      ]
    },
    
    // Key players and their motivations
    keyPlayers: [
      {
        name: 'Iran',
        type: 'state',
        role: 'primary-adversary',
        flag: '🇮🇷',
        motivations: [
          'Defend sovereignty against foreign strikes',
          'Maintain nuclear program capabilities',
          'Project regional influence through proxies',
          'Control Strait of Hormuz for leverage'
        ],
        capabilities: ['Ballistic missiles', 'Drone swarms', 'Proxy forces', 'Cyber warfare', 'Naval mines'],
        losses: 'Multiple nuclear facilities damaged, senior officials killed, economic infrastructure hit',
        stance: 'Retaliatory - vows continued strikes until aggression stops'
      },
      {
        name: 'United States',
        type: 'state',
        role: 'primary-actor',
        flag: '🇺🇸',
        motivations: [
          'Prevent Iranian nuclear weapon development',
          'Protect regional allies (Israel, Gulf states)',
          'Maintain freedom of navigation in Gulf',
          'Contain Iranian regional expansion'
        ],
        capabilities: ['Stealth aircraft', 'Carrier strike groups', 'Missile defense', 'Cyber operations', 'Bunker busters'],
        losses: 'Embassy facilities damaged in Baghdad, troops injured',
        stance: 'Escalatory - committed to degrading Iranian military capabilities'
      },
      {
        name: 'Israel',
        type: 'state',
        role: 'primary-actor',
        flag: '🇮🇱',
        motivations: [
          'Eliminate existential nuclear threat',
          'Degrade Hezbollah and Iranian proxies',
          'Ensure northern border security',
          'Prevent Iranian entrenchment in Syria'
        ],
        capabilities: ['F-35 strikes', 'Intelligence operations', 'Mossad covert ops', 'Iron Dome defense'],
        losses: 'Civilian casualties from Iranian missile strikes, property damage',
        stance: 'Proactive - conducting preventive strikes on threats'
      },
      {
        name: 'Hezbollah',
        type: 'non-state',
        role: 'proxy',
        flag: '🟡',
        motivations: [
          'Defend Lebanon from Israeli strikes',
          'Support Iranian strategic objectives',
          'Maintain arms and rocket capabilities'
        ],
        capabilities: ['Rocket artillery', 'Anti-tank missiles', 'Tunnel networks', 'Drone attacks'],
        losses: 'Commanders assassinated, weapons depots destroyed',
        stance: 'Engaged - launching rockets at Israel in coordination with Iran'
      }
    ],
    
    // Recent trigger events (timeline)
    triggerEvents: [
      {
        date: '2026-03-14',
        title: 'Pakistan-Afghanistan Border Conflict',
        description: 'Escalating tensions between Pakistan and Afghanistan draw regional attention and complicate alliances.',
        impact: 'Regional tension amplifier'
      },
      {
        date: '2026-03-16',
        title: 'Dubai Airport Drone Strike',
        description: 'Drone strike on Dubai International Airport fuel tank marks major escalation affecting civilian infrastructure.',
        impact: 'High - first GCC civilian airport targeted'
      },
      {
        date: '2026-03-17',
        title: 'US Embassy Baghdad Attack',
        description: 'Major coordinated drone and rocket attack on US Embassy Baghdad - most intense since war began.',
        impact: 'Critical - direct attack on US sovereign territory'
      },
      {
        date: '2026-03-17',
        title: 'Israeli Leadership Strike in Tehran',
        description: 'Precision Israeli airstrike kills senior Iranian leadership in Tehran.',
        impact: 'Critical - decapitation strike'
      },
      {
        date: '2026-03-18',
        title: 'Iranian Missile Strike on Central Israel',
        description: 'Ballistic missiles target mixed urban-military zones in central Israel.',
        impact: 'High - direct mainland Israel attack'
      }
    ],
    
    // Current status overview
    currentStatus: {
      summary: 'Full-scale regional war with direct state-on-state military action. Multiple theaters active simultaneously.',
      activeTheaters: [
        {
          name: 'Iranian Homeland',
          status: 'Under heavy air attack',
          description: 'Repeated Israeli and US strikes on military and nuclear facilities. Key cities targeted.',
          lastAction: '2026-03-17'
        },
        {
          name: 'Israel-Lebanon Border',
          status: 'Active combat',
          description: 'Hezbollah rocket launches and Israeli retaliatory airstrikes.',
          lastAction: '2026-03-18'
        },
        {
          name: 'Gulf Shipping Routes',
          status: 'High risk',
          description: 'Iranian threats to Hormuz, tanker attacks near Fujairah.',
          lastAction: '2026-03-17'
        },
        {
          name: 'Iraq (US Presence)',
          status: 'Ongoing attacks',
          description: 'Iranian-backed militias conducting regular attacks on US facilities.',
          lastAction: '2026-03-17'
        }
      ],
      statistics: {
        estimatedCasualties: '500+ (conflict estimates)',
        displacedPersons: 'Tens of thousands',
        economicImpact: 'Oil prices surged 15%, regional markets volatile',
        infrastructureDamage: 'Major airports, oil facilities, military bases hit'
      }
    },
    
    // Related resources
    resources: [
      { type: 'timeline', title: 'Full Timeline', url: '/timeline' },
      { type: 'analysis', title: 'Risk Assessment', url: '/ww3-risk-calculator' },
      { type: 'tracker', title: 'Live Tracker', url: '/iran-conflict-live' }
    ]
  }
];

// Helper functions
export function getConflictZoneById(id) {
  return CONFLICT_ZONES.find(zone => zone.id === id);
}

export function getConflictZoneByLocation(location) {
  return CONFLICT_ZONES.find(zone => 
    zone.geography.countries.includes(location) ||
    zone.geography.keyLocations.some(loc => loc.name === location)
  );
}

export function getActiveConflictZones() {
  return CONFLICT_ZONES.filter(zone => zone.status === 'active');
}
```

### 1.2 Attack-to-Context Mapping

Attacks in `verifiedAttacks.js` can reference conflict zones:

```javascript
// Extended attack schema with context reference
{
  id: '2026-03-17-tehran-leadership',
  headline: 'Israeli precision airstrike on senior Iranian leadership in Tehran',
  // ... existing fields ...
  
  // NEW: Link to conflict context
  conflictZoneId: 'us-iran-war-2026',
  
  // Contextual tags for filtering
  tags: ['leadership-strike', 'decapitation', 'tehran'],
  
  // Strategic significance
  strategicImpact: {
    level: 'critical',
    description: 'Elimination of senior leadership represents major escalation and potential turning point',
    consequences: ['Retaliatory strikes expected', 'Command disruption temporary', 'Potential hardline response']
  }
}
```

---

## 2. UI Component Design

### 2.1 Component Architecture

```
ConflictContextPanel (Main Container)
├── ConflictContextHeader
│   ├── ZoneTitle & Status Badge
│   ├── Intensity Meter
│   └── Close Button
├── ContextTabs
│   ├── Overview Tab
│   ├── Players Tab
│   ├── Timeline Tab
│   └── Status Tab
└── ContextContent (Tab-specific content)
```

### 2.2 Main Component: ConflictContextPanel

```jsx
// src/components/ConflictContextPanel.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Info, Users, Clock, Activity, 
  AlertTriangle, TrendingUp, TrendingDown, 
  MapPin, Shield, Target, Flame 
} from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Why Here?', icon: Info },
  { id: 'players', label: 'Key Players', icon: Users },
  { id: 'timeline', label: 'Triggers', icon: Clock },
  { id: 'status', label: 'Current Status', icon: Activity }
];

export default function ConflictContextPanel({ 
  conflictZone, 
  onClose, 
  isOpen,
  relatedAttacks = [] 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!conflictZone) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0d0d12] border-l border-white/10 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <ContextHeader 
              conflictZone={conflictZone} 
              onClose={onClose} 
            />
            
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    activeTab === tab.id 
                      ? 'text-red-400 border-b-2 border-red-400 bg-red-500/5' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'overview' && (
                <OverviewTab conflictZone={conflictZone} />
              )}
              {activeTab === 'players' && (
                <PlayersTab conflictZone={conflictZone} />
              )}
              {activeTab === 'timeline' && (
                <TimelineTab conflictZone={conflictZone} />
              )}
              {activeTab === 'status' && (
                <StatusTab 
                  conflictZone={conflictZone} 
                  relatedAttacks={relatedAttacks}
                />
              )}
            </div>
            
            {/* Footer */}
            <ContextFooter conflictZone={conflictZone} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 2.3 Tab Components

#### Overview Tab (Root Causes)

```jsx
function OverviewTab({ conflictZone }) {
  const { rootCauses } = conflictZone;
  
  return (
    <div className="p-4 space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Root Cause
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {rootCauses.summary}
        </p>
      </div>
      
      {/* Contributing Factors */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Contributing Factors
        </h3>
        <div className="space-y-3">
          {rootCauses.factors.map((factor, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-bold text-white">{factor.title}</h4>
                <ImpactBadge level={factor.impact} />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                {factor.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Active since {factor.since}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Key Locations */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Key Locations
        </h3>
        <div className="flex flex-wrap gap-2">
          {conflictZone.geography.keyLocations.map((loc, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-400 flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              {loc.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImpactBadge({ level }) {
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };
  
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[level] || colors.medium}`}>
      {level.toUpperCase()}
    </span>
  );
}
```

#### Players Tab

```jsx
function PlayersTab({ conflictZone }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  return (
    <div className="p-4 space-y-4">
      <div className="text-xs text-gray-500 mb-2">
        Click a player to view detailed motivations and capabilities
      </div>
      
      {conflictZone.keyPlayers.map((player, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`border rounded-xl overflow-hidden transition-all ${
            selectedPlayer === idx 
              ? 'border-red-500/50 bg-red-500/5' 
              : 'border-white/10 bg-white/5 hover:bg-white/10'
          }`}
        >
          {/* Player Header */}
          <button
            onClick={() => setSelectedPlayer(selectedPlayer === idx ? null : idx)}
            className="w-full p-3 flex items-center gap-3 text-left"
          >
            <span className="text-2xl">{player.flag}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{player.name}</span>
                <RoleBadge role={player.role} />
              </div>
              <span className="text-xs text-gray-500 capitalize">{player.type}</span>
            </div>
            {selectedPlayer === idx ? (
              <TrendingUp className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {/* Expanded Details */}
          <AnimatePresence>
            {selectedPlayer === idx && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 pt-0 space-y-3 border-t border-white/10">
                  {/* Motivations */}
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Motivations
                    </h4>
                    <ul className="space-y-1">
                      {player.motivations.map((mot, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5">•</span>
                          {mot}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Capabilities */}
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {player.capabilities.map((cap, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Losses & Stance */}
                  <div className="bg-white/5 rounded-lg p-2 space-y-1">
                    <p className="text-xs text-gray-400">
                      <span className="text-red-400">Losses:</span> {player.losses}
                    </p>
                    <p className="text-xs text-gray-400">
                      <span className="text-blue-400">Stance:</span> {player.stance}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

function RoleBadge({ role }) {
  const config = {
    'primary-actor': { color: 'bg-blue-500/20 text-blue-400', label: 'Actor' },
    'primary-adversary': { color: 'bg-red-500/20 text-red-400', label: 'Adversary' },
    'proxy': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Proxy' },
    'mediator': { color: 'bg-green-500/20 text-green-400', label: 'Mediator' },
    'affected': { color: 'bg-gray-500/20 text-gray-400', label: 'Affected' }
  };
  
  const { color, label } = config[role] || config.affected;
  
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded ${color}`}>
      {label}
    </span>
  );
}
```

#### Timeline Tab (Trigger Events)

```jsx
function TimelineTab({ conflictZone }) {
  return (
    <div className="p-4">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-red-500/50 via-orange-500/30 to-transparent" />
        
        {/* Events */}
        <div className="space-y-4">
          {conflictZone.triggerEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative pl-8"
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#0d0d12] border-2 border-red-500/50 flex items-center justify-center">
                <Flame className="w-3 h-3 text-red-400" />
              </div>
              
              {/* Event Card */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-red-400 font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric' 
                    })}
                  </span>
                  <ImpactBadge level={
                    event.impact.includes('Critical') ? 'critical' : 
                    event.impact.includes('High') ? 'high' : 'medium'
                  } />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{event.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Activity className="w-3 h-3" />
                  <span>{event.impact}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### Status Tab

```jsx
function StatusTab({ conflictZone, relatedAttacks }) {
  const { currentStatus } = conflictZone;
  
  return (
    <div className="p-4 space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20 rounded-xl p-4">
        <h3 className="text-sm font-bold text-orange-400 mb-2">Current Situation</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {currentStatus.summary}
        </p>
      </div>
      
      {/* Active Theaters */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Active Theaters
        </h3>
        <div className="space-y-2">
          {currentStatus.activeTheaters.map((theater, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-white">{theater.name}</h4>
                <TheaterStatusBadge status={theater.status} />
              </div>
              <p className="text-xs text-gray-400 mb-1">{theater.description}</p>
              <p className="text-[10px] text-gray-500">
                Last action: {new Date(theater.lastAction).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Statistics */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Conflict Statistics
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <StatBox label="Est. Casualties" value={currentStatus.statistics.estimatedCasualties} />
          <StatBox label="Displaced" value={currentStatus.statistics.displacedPersons} />
          <StatBox label="Economic Impact" value={currentStatus.statistics.economicImpact} colSpan={2} />
          <StatBox label="Infrastructure" value={currentStatus.statistics.infrastructureDamage} colSpan={2} />
        </div>
      </div>
      
      {/* Related Recent Attacks */}
      {relatedAttacks.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Recent Verified Attacks ({relatedAttacks.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {relatedAttacks.slice(0, 5).map((attack, idx) => (
              <div key={idx} className="text-xs bg-white/5 rounded p-2 border border-white/10">
                <div className="flex items-center gap-1 text-red-400 mb-1">
                  <Flame className="w-3 h-3" />
                  <span className="font-medium">{attack.location}</span>
                </div>
                <p className="text-gray-400 line-clamp-2">{attack.headline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TheaterStatusBadge({ status }) {
  const config = {
    'Under heavy air attack': 'bg-red-500/20 text-red-400',
    'Active combat': 'bg-orange-500/20 text-orange-400',
    'High risk': 'bg-yellow-500/20 text-yellow-400',
    'Ongoing attacks': 'bg-orange-500/20 text-orange-400',
    'Frozen': 'bg-gray-500/20 text-gray-400'
  };
  
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded ${config[status] || 'bg-gray-500/20'}`}>
      {status}
    </span>
  );
}

function StatBox({ label, value, colSpan = 1 }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-lg p-2 ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <p className="text-[10px] text-gray-500 mb-0.5">{label}</p>
      <p className="text-xs text-white font-medium">{value}</p>
    </div>
  );
}
```

### 2.4 Integration with ConflictMap

```jsx
// Add to ConflictMap.jsx

import ConflictContextPanel from './ConflictContextPanel';
import { CONFLICT_ZONES, getConflictZoneByLocation } from '../../server/data/conflictZones';

export default function ConflictMap({ mobile = false }) {
  // ... existing state ...
  const [selectedConflictZone, setSelectedConflictZone] = useState(null);
  const [showContextPanel, setShowContextPanel] = useState(false);
  
  // When clicking a map marker
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    
    // NEW: Check if this location is part of a conflict zone
    const zone = getConflictZoneByLocation(event.country) || 
                 getConflictZoneByLocation(event.city);
    
    if (zone) {
      setSelectedConflictZone(zone);
      // On mobile, show context after a short delay or via button
      // On desktop, show side panel
    }
    
    setShowTimeline(true);
    if (isMobile) {
      setShowDrawer(true);
    }
  };
  
  // NEW: Add "View Context" button to event cards
  const renderEventWithContext = (event) => {
    const zone = getConflictZoneByLocation(event.country);
    
    return (
      <div className="relative">
        {/* ... existing event card content ... */}
        
        {zone && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedConflictZone(zone);
              setShowContextPanel(true);
            }}
            className="mt-2 w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-xs text-red-400 font-medium flex items-center justify-center gap-1"
          >
            <Info className="w-3 h-3" />
            Why is this happening?
          </button>
        )}
      </div>
    );
  };
  
  return (
    <>
      {/* ... existing map JSX ... */}
      
      {/* NEW: Conflict Context Panel */}
      <ConflictContextPanel
        conflictZone={selectedConflictZone}
        isOpen={showContextPanel}
        onClose={() => setShowContextPanel(false)}
        relatedAttacks={events.filter(e => 
          selectedConflictZone?.geography.countries.includes(e.country)
        )}
      />
      
      {/* NEW: Map overlay buttons for conflict zones */}
      <div className="absolute top-3 right-3 space-y-2">
        {CONFLICT_ZONES.filter(z => z.status === 'active').map(zone => (
          <button
            key={zone.id}
            onClick={() => {
              setSelectedConflictZone(zone);
              setShowContextPanel(true);
            }}
            className="block bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-left hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-bold text-white">{zone.shortName}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${zone.intensity}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{zone.intensity}%</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
```

---

## 3. Map Integration Design

### 3.1 Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAP INTERACTIONS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. USER CLICKS ATTACK MARKER                                    │
│     ↓                                                            │
│     ├─ Show attack details (existing)                            │
│     ├─ Look up associated conflict zone                          │
│     └─ Show "Why Here?" button if zone exists                    │
│                                                                  │
│  2. USER CLICKS "WHY HERE?" BUTTON                               │
│     ↓                                                            │
│     ├─ Open ConflictContextPanel                                 │
│     ├─ Default to "Overview" tab (root causes)                   │
│     └─ Highlight related attacks in timeline                     │
│                                                                  │
│  3. USER EXPLORES TABS                                           │
│     ↓                                                            │
│     ├─ Overview: Root causes, contributing factors               │
│     ├─ Players: Expandable player cards with motivations         │
│     ├─ Timeline: Chronological trigger events                    │
│     └─ Status: Current situation, theaters, statistics           │
│                                                                  │
│  4. USER CLICKS ZONE BUTTON (sidebar)                            │
│     ↓                                                            │
│     ├─ Show context panel immediately                            │
│     ├─ Zoom map to zone bounds                                   │
│     └─ Filter attacks to zone countries                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Visual Design for Map

```css
/* Conflict Zone Visual Indicators */

/* Zone boundary overlay (subtle) */
.conflict-zone-boundary {
  fill: url(#conflict-zone-gradient);
  stroke: rgba(239, 68, 68, 0.3);
  stroke-width: 1;
  stroke-dasharray: 5, 5;
  pointer-events: none;
}

/* Hot zone pulse effect */
@keyframes hot-zone-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}

.hot-zone-overlay {
  animation: hot-zone-pulse 3s ease-in-out infinite;
}

/* Attack marker with context indicator */
.attack-marker-with-context {
  cursor: pointer;
}

.attack-marker-with-context::after {
  content: '';
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  border: 2px solid #0d0d12;
}
```

---

## 4. Example Content

### 4.1 US-Iran War (2026)

See the full data structure in Section 1.1 - this is already implemented as the primary example.

### 4.2 Pakistan-Afghanistan Border Conflict

```javascript
{
  id: 'pak-afghan-border-2026',
  displayName: 'Pakistan-Afghanistan Border Conflict',
  shortName: 'Pak-Afghan Conflict',
  region: 'South Asia',
  
  geography: {
    center: { lat: 33.0, lng: 70.0 },
    zoom: 5,
    countries: ['Pakistan', 'Afghanistan'],
    keyLocations: [
      { name: 'Kandahar', lat: 31.6289, lng: 65.7372, type: 'city' },
      { name: 'Islamabad', lat: 33.6844, lng: 73.0479, type: 'capital' },
      { name: 'Kabul', lat: 34.5553, lng: 69.2075, type: 'capital' },
      { name: 'Durand Line', lat: 32.0, lng: 69.0, type: 'border' },
      { name: 'Torkham Border', lat: 34.1172, lng: 71.0956, type: 'border' }
    ]
  },
  
  status: 'active',
  startDate: '2026-03-14',
  intensity: 65,
  
  rootCauses: {
    summary: 'Long-disputed Durand Line border, Taliban support for Pakistani militants, and reciprocal accusations of harboring terrorist groups.',
    factors: [
      {
        title: 'Durand Line Dispute',
        description: 'Afghanistan never recognized the 1893 British-drawn border. Taliban claims Pashtun territories in Pakistan.',
        since: '1893',
        impact: 'critical'
      },
      {
        title: 'TTP Safe Havens',
        description: 'Pakistan accuses Afghanistan of harboring Tehrik-e-Taliban Pakistan (TTP) militants who attack Pakistani targets.',
        since: '2007',
        impact: 'high'
      },
      {
        title: 'Taliban Expansionism',
        description: 'Afghan Taliban seeks "Greater Afghanistan" including Pakistan\'s tribal areas, creating strategic friction.',
        since: '2021',
        impact: 'high'
      },
      {
        title: 'Chinese Pressure',
        description: 'China investing heavily in both countries (CPEC) and attempting to broker peace to protect its economic interests.',
        since: '2015',
        impact: 'medium'
      }
    ]
  },
  
  keyPlayers: [
    {
      name: 'Pakistan',
      type: 'state',
      role: 'primary-actor',
      flag: '🇵🇰',
      motivations: [
        'Eliminate TTP threat from Afghan territory',
        'Secure western border for CPEC projects',
        'Prevent Afghan claims on Pakistani territory',
        'Maintain strategic depth doctrine'
      ],
      capabilities: ['F-16 fighter jets', 'Precision airstrikes', 'Artillery', 'Border fencing'],
      losses: 'Military personnel killed, border posts attacked, civilian casualties',
      stance: 'Aggressive - conducting cross-border strikes, calls it "open war"'
    },
    {
      name: 'Afghanistan (Taliban)',
      type: 'state',
      role: 'primary-adversary',
      flag: '🇦🇫',
      motivations: [
        'Reject Pakistani violation of sovereignty',
        'Support Pashtun self-determination',
        'Challenge Durand Line legitimacy',
        'Retaliate for Pakistani airstrikes'
      ],
      capabilities: ['Drone attacks', 'Rocket artillery', 'Militant proxies', 'Mountain warfare'],
      losses: 'Military facilities struck, civilian casualties in Kandahar',
      stance: 'Defiant - denying TTP presence, retaliating against strikes'
    },
    {
      name: 'China',
      type: 'state',
      role: 'mediator',
      flag: '🇨🇳',
      motivations: [
        'Protect $60B CPEC investment in Pakistan',
        'Prevent regional instability spreading',
        'Maintain influence with both governments',
        'Counter US/India regional presence'
      ],
      capabilities: ['Diplomatic leverage', 'Economic pressure', 'Military aid'],
      losses: 'CPEC projects delayed, personnel security concerns',
      stance: 'Mediating - hosting talks, urging restraint from both sides'
    },
    {
      name: 'TTP (Tehrik-e-Taliban)',
      type: 'non-state',
      role: 'proxy',
      flag: '⚫',
      motivations: [
        'Overthrow Pakistani government',
        'Establish Islamic emirate in Pakistan',
        'Fight Pakistani military presence in tribal areas',
        'Avenge military operations against militants'
      ],
      capabilities: ['Suicide attacks', 'Guerrilla warfare', 'IEDs', 'Cross-border raids'],
      losses: 'Commanders killed in Pakistani strikes, bases destroyed',
      stance: 'Provoking - launching attacks to maintain Pakistan-Afghanistan tensions'
    }
  ],
  
  triggerEvents: [
    {
      date: '2026-03-10',
      title: 'TTP Attack on Pakistani Military Convoy',
      description: 'Major TTP attack kills 12 Pakistani soldiers in North Waziristan, blamed on Afghan safe havens.',
      impact: 'High - triggered military response planning'
    },
    {
      date: '2026-03-14',
      title: 'Pakistani Airstrikes on Kandahar',
      description: 'Pakistan Air Force strikes alleged TTP facility in Kandahar, killing Afghan personnel.',
      impact: 'Critical - first major cross-border strike'
    },
    {
      date: '2026-03-14',
      title: 'Afghan Retaliation on Islamabad',
      description: 'Afghan forces claim strikes near Islamabad and northwest Pakistan.',
      impact: 'Critical - direct threat to Pakistani capital'
    },
    {
      date: '2026-03-15',
      title: 'China Brokers Emergency Talks',
      description: 'Chinese officials host emergency negotiations in Beijing.',
      impact: 'Medium - temporary de-escalation attempt'
    }
  ],
  
  currentStatus: {
    summary: 'Active border war with aerial bombardment and cross-border artillery. Regional powers attempting to mediate.',
    activeTheaters: [
      {
        name: 'Durand Line Border',
        status: 'Active combat',
        description: 'Artillery exchanges, airstrikes, and border post attacks along entire frontier.',
        lastAction: '2026-03-14'
      },
      {
        name: 'Kandahar Province',
        status: 'Under air attack',
        description: 'Pakistani jets conducting repeated strikes on alleged militant positions.',
        lastAction: '2026-03-14'
      }
    ],
    statistics: {
      estimatedCasualties: '50+ confirmed',
      displacedPersons: 'Thousands near border regions',
      economicImpact: 'CPEC projects suspended, border trade halted',
      infrastructureDamage: 'Border crossings closed, military facilities damaged'
    }
  }
}
```

### 4.3 Israel-Hezbollah Conflict

```javascript
{
  id: 'israel-hezbollah-conflict-2026',
  displayName: 'Israel-Hezbollah War',
  shortName: 'Israel-Hezbollah',
  region: 'Levant',
  
  geography: {
    center: { lat: 33.0, lng: 35.5 },
    zoom: 6,
    countries: ['Israel', 'Lebanon', 'Syria'],
    keyLocations: [
      { name: 'Beirut', lat: 33.8938, lng: 35.5018, type: 'capital' },
      { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, type: 'city' },
      { name: 'Tyre', lat: 33.2700, lng: 35.2033, type: 'city' },
      { name: 'Golan Heights', lat: 32.9917, lng: 35.7481, type: 'strategic' },
      { name: 'Blue Line', lat: 33.3, lng: 35.5, type: 'border' }
    ]
  },
  
  status: 'active',
  startDate: '2023-10-08',
  intensity: 80,
  
  rootCauses: {
    summary: 'Decades-long conflict rooted in Hezbollah\'s opposition to Israel, Iranian backing of Lebanese militias, and territorial disputes along the Lebanon-Israel border.',
    factors: [
      {
        title: 'Iranian Proxy Strategy',
        description: 'Hezbollah serves as Iran\'s primary proxy force against Israel, receiving billions in funding and advanced weapons.',
        since: '1982',
        impact: 'critical'
      },
      {
        title: 'Shebaa Farms Dispute',
        description: 'Territorial dispute over small mountainous area claimed by Lebanon but held by Israel creates constant friction.',
        since: '2000',
        impact: 'medium'
      },
      {
        title: '2006 War Legacy',
        description: 'UN Resolution 1701 was never fully implemented. Hezbollah rearmed massively since 2006 conflict.',
        since: '2006',
        impact: 'high'
      },
      {
        title: 'Gaza Conflict Spillover',
        description: 'Hezbollah launched support operations for Hamas on October 8, 2023, creating sustained northern front.',
        since: '2023-10-08',
        impact: 'critical'
      }
    ]
  },
  
  keyPlayers: [
    {
      name: 'Israel',
      type: 'state',
      role: 'primary-actor',
      flag: '🇮🇱',
      motivations: [
        'Eliminate Hezbollah rocket threat to northern Israel',
        'Secure border communities for refugee return',
        'Degrade Iranian proxy capabilities',
        'Enforce UN Resolution 1701'
      ],
      capabilities: ['F-35 stealth strikes', 'Heavy bunker busters', 'Iron Dome defense', 'Special forces raids'],
      losses: 'Northern towns evacuated (60,000+ displaced), civilian casualties from rockets',
      stance: 'Escalatory - conducting systematic strikes on Hezbollah infrastructure'
    },
    {
      name: 'Hezbollah',
      type: 'non-state',
      role: 'primary-adversary',
      flag: '🟡',
      motivations: [
        'Defend Lebanon from Israeli aggression',
        'Support Palestinian cause and Hamas',
        'Maintain deterrent against Israeli attack',
        'Preserve Iranian supply lines through Syria'
      ],
      capabilities: ['150,000+ rockets', 'Precision-guided missiles', 'Anti-tank missiles', 'Tunnel networks', 'Drones'],
      losses: 'Senior commanders assassinated, weapons depots destroyed, Beirut buildings hit',
      stance: 'Engaged - daily rocket/missile launches at Israel, but trying to avoid full war'
    },
    {
      name: 'Lebanon (State)',
      type: 'state',
      role: 'affected',
      flag: '🇱🇧',
      motivations: [
        'Prevent national collapse from war',
        'Maintain sovereignty despite Hezbollah dominance',
        'Protect civilian infrastructure',
        'Secure international aid and support'
      ],
      capabilities: ['Limited national army', 'Diplomatic appeals'],
      losses: 'Economic collapse accelerated, infrastructure damaged, 100,000+ displaced',
      stance: 'Neutral-declaring - unable to control Hezbollah, appealing for international help'
    },
    {
      name: 'Iran',
      type: 'state',
      role: 'proxy-supporter',
      flag: '🇮🇷',
      motivations: [
        'Maintain pressure on Israel via proxy',
        'Preserve Hezbollah as strategic asset',
        'Deter direct Israeli attack on Iran',
        'Expand regional influence'
      ],
      capabilities: ['Weapon supply lines', 'Funding ($1B+ annually)', 'Advisors', 'Intelligence support'],
      losses: 'Supply routes disrupted, proxies degraded, weapons caches destroyed',
      stance: 'Supporting - providing weapons and funding while avoiding direct involvement'
      }
  ],
  
  triggerEvents: [
    {
      date: '2023-10-08',
      title: 'Hezbollah Opens Northern Front',
      description: 'Hezbollah begins rocket and artillery attacks on Israel in solidarity with Hamas.',
      impact: 'Critical - created two-front situation for Israel'
    },
    {
      date: '2024-09',
      title: 'Pager/Communications Attack',
      description: 'Israeli operation explodes Hezbollah pagers and radios, killing operatives and wounding thousands.',
      impact: 'High - decimated Hezbollah command structure'
    },
    {
      date: '2024-09',
      title: 'Nasrallah Assassination',
      description: 'Israeli airstrike kills Hezbollah Secretary-General Hassan Nasrallah in Beirut.',
      impact: 'Critical - decapitation of leadership'
    },
    {
      date: '2026-03-17',
      title: 'Israeli Strikes on Beirut Escalate',
      description: 'Wide-scale Israeli airstrikes hit multiple Beirut neighborhoods including civilian areas.',
      impact: 'High - major escalation in capital'
    },
    {
      date: '2026-03-18',
      title: 'Beirut Building Destruction',
      description: 'Israeli strike destroys Hezbollah-linked building in central Beirut following warning.',
      impact: 'Medium - continued pressure on organization'
    }
  ],
  
  currentStatus: {
    summary: 'Sustained low-intensity war with periodic escalation. Hezbollah degraded but still capable. Northern Israel remains evacuated.',
    activeTheaters: [
      {
        name: 'Israel-Lebanon Border',
        status: 'Active combat',
        description: 'Daily rocket fire from Hezbollah, Israeli retaliatory airstrikes.',
        lastAction: '2026-03-18'
      },
      {
        name: 'Beirut',
        status: 'Under periodic air attack',
        description: 'Israeli strikes on Hezbollah targets in Dahiyeh and other neighborhoods.',
        lastAction: '2026-03-18'
      },
      {
        name: 'Southern Lebanon',
        status: 'Occupied/militarized',
        description: 'Hezbollah maintains positions despite Israeli pressure.',
        lastAction: '2026-03-18'
      }
    ],
    statistics: {
      estimatedCasualties: '4,000+ in Lebanon, 100+ Israeli civilians and soldiers',
      displacedPersons: '1.2 million Lebanese, 60,000+ Israelis',
      economicImpact: 'Lebanon economy in freefall, northern Israel paralyzed',
      infrastructureDamage: 'Beirut suburbs devastated, Israeli border towns damaged'
    }
  }
}
```

---

## 5. Technical Implementation

### 5.1 File Structure

```
server/
├── data/
│   ├── verifiedAttacks.js          # Existing attack database
│   └── conflictZones.js            # NEW: Conflict context database

src/
├── components/
│   ├── ConflictMap.jsx             # Modified to integrate context
│   └── ConflictContextPanel.jsx    # NEW: Main context panel component
│   └── context-panel/              # NEW: Panel sub-components
│       ├── OverviewTab.jsx
│       ├── PlayersTab.jsx
│       ├── TimelineTab.jsx
│       ├── StatusTab.jsx
│       └── index.js

```

### 5.2 API Endpoints

```javascript
// server/server.js additions

// Get all conflict zones
app.get('/api/conflict-zones', (req, res) => {
  const zones = CONFLICT_ZONES.map(z => ({
    id: z.id,
    displayName: z.displayName,
    shortName: z.shortName,
    region: z.region,
    status: z.status,
    intensity: z.intensity,
    center: z.geography.center,
    countries: z.geography.countries
  }));
  res.json({ zones, count: zones.length });
});

// Get specific conflict zone with full details
app.get('/api/conflict-zones/:id', (req, res) => {
  const zone = getConflictZoneById(req.params.id);
  if (!zone) {
    return res.status(404).json({ error: 'Conflict zone not found' });
  }
  res.json(zone);
});

// Get conflict zone by location
app.get('/api/conflict-zones/location/:location', (req, res) => {
  const zone = getConflictZoneByLocation(req.params.location);
  if (!zone) {
    return res.status(404).json({ error: 'No conflict zone found for location' });
  }
  res.json(zone);
});
```

### 5.3 Frontend API Client

```javascript
// src/lib/api.js additions

const CACHE_KEYS = {
  // ... existing keys ...
  CONFLICT_ZONES: 'conflict_zones',
  CONFLICT_ZONE_PREFIX: 'conflict_zone_'
};

export async function getConflictZones() {
  return getCachedData(
    CACHE_KEYS.CONFLICT_ZONES,
    async () => {
      const res = await fetch('/api/conflict-zones');
      return res.json();
    },
    5 * 60 * 1000 // 5 minutes
  );
}

export async function getConflictZone(id) {
  return getCachedData(
    `${CACHE_KEYS.CONFLICT_ZONE_PREFIX}${id}`,
    async () => {
      const res = await fetch(`/api/conflict-zones/${id}`);
      return res.json();
    },
    10 * 60 * 1000 // 10 minutes
  );
}
```

---

## 6. User Experience Flow

### 6.1 Desktop Experience

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DESKTOP LAYOUT                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────────────────────┐  ┌─────────────────────────┐    │
│   │                              │  │    CONFIRMED STRIKES    │    │
│   │                              │  │  ┌─────────────────┐    │    │
│   │                              │  │  │ Tehran Strike   │    │    │
│   │      INTERACTIVE MAP         │  │  │ ┌─────────────┐ │    │    │
│   │                              │  │  │ │ [Why Here?] │ │    │    │
│   │   [🔴] Attack marker         │  │  │ └─────────────┘ │    │    │
│   │   Click → Show details       │  │  └─────────────────┘    │    │
│   │                              │  │  ┌─────────────────┐    │    │
│   │   [🇮🇷 Iran Conflict]         │  │  │ Dubai Strike    │    │    │
│   │   Click → Open context panel │  │  │ ┌─────────────┐ │    │    │
│   │                              │  │  │ │ [Why Here?] │ │    │    │
│   │                              │  │  │ └─────────────┘ │    │    │
│   │                              │  │  └─────────────────┘    │    │
│   └──────────────────────────────┘  └─────────────────────────┘    │
│                                                                     │
│   When "Why Here?" clicked:                                         │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │  SLIDE-IN PANEL (right side)                                 │  │
│   │  ┌────────────────────────────────────────────────────────┐ │  │
│   │  │  US-IRAN WAR                    [X]                    │ │  │
│   │  │  Status: ACTIVE ⚫ Intensity: 85%                       │ │  │
│   │  ├────────────────────────────────────────────────────────┤ │  │
│   │  │  [Why Here?] [Key Players] [Triggers] [Status]         │ │  │
│   │  ├────────────────────────────────────────────────────────┤ │  │
│   │  │  ROOT CAUSE                                              │ │  │
│   │  │  Long-standing tensions over Iran's nuclear...         │ │  │
│   │  │                                                          │ │  │
│   │  │  CONTRIBUTING FACTORS                                    │ │  │
│   │  │  ⚫ Nuclear Program Dispute [CRITICAL]                  │ │  │
│   │  │  ⚫ Proxy War Dynamics [HIGH]                           │ │  │
│   │  │  ⚫ Strategic Chokepoint Control [CRITICAL]             │ │  │
│   │  └────────────────────────────────────────────────────────┘ │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Experience

```
┌─────────────────────────────┐
│        MOBILE LAYOUT         │
├─────────────────────────────┤
│                             │
│   ┌─────────────────────┐   │
│   │                     │   │
│   │   MAP (240px)       │   │
│   │                     │   │
│   │   [Tap markers]     │   │
│   │                     │   │
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │ STRIKE: Tehran      │   │
│   │ Israeli strike on...│   │
│   │                     │   │
│   │ [View Full Details] │   │
│   │                     │   │
│   │ [? Why Here?]       │   │  ← Opens bottom sheet
│   └─────────────────────┘   │
│                             │
│   ┌─────────────────────┐   │
│   │ STRIKE: Dubai       │   │
│   │ Drone strike on...  │   │
│   │ [? Why Here?]       │   │
│   └─────────────────────┘   │
│                             │
│  When "Why Here?" tapped:   │
│  ┌─────────────────────┐    │
│  │  ╔═══════════════╗  │    │
│  │  ║ Bottom Sheet  ║  │    │
│  │  ║ ───────────── ║  │    │
│  │  ║ US-IRAN WAR   ║  │    │
│  │  ║ [Tabs]        ║  │    │
│  │  ║               ║  │    │
│  │  ║ Root cause... ║  │    │
│  │  ║               ║  │    │
│  │  ╚═══════════════╝  │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

---

## 7. Future Enhancements

### Phase 2 Features

1. **Historical Timeline Integration**
   - Link to the existing TimelineOfChaos component
   - Show historical context for each conflict

2. **Player Relationship Map**
   - Visual diagram showing alliances and enmities
   - Interactive network graph

3. **Predictive Indicators**
   - Risk assessment for each conflict zone
   - Warning signs of escalation

4. **User Contributions**
   - Allow users to submit context updates
   - Community-verified information

5. **Media Integration**
   - Embed relevant news videos
   - Satellite imagery comparison

---

## 8. Summary

This Conflict Context System provides:

| Feature | Description | User Value |
|---------|-------------|------------|
| **Root Cause Analysis** | Explains underlying reasons for conflicts | Understanding, not just data |
| **Key Player Profiles** | Motivations, capabilities, and stances | Comprehensive perspective |
| **Trigger Timeline** | Chronological escalation events | Historical context |
| **Current Status** | Active theaters and statistics | Situational awareness |
| **Map Integration** | Click attack → See context | Seamless UX |
| **Related Attacks** | Filtered attack list per zone | Focused information |

The design maintains the existing visual style while adding rich contextual information that transforms the tracker from a data display into a comprehensive conflict analysis tool.

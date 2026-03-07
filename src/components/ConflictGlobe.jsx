import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, AlertTriangle, Clock, MapPin } from 'lucide-react';

// Simplified conflict data (will be fetched from API in production)
const MOCK_CONFLICTS = [
  { id: 1, lat: 35.6892, lng: 51.3890, location: 'Tehran, Iran', severity: 'high', type: 'Military Activity', time: '2 min ago', description: 'Missile defense systems activated' },
  { id: 2, lat: 31.7683, lng: 35.2137, location: 'Jerusalem, Israel', severity: 'high', type: 'Airstrike', time: '15 min ago', description: 'Retaliatory strikes reported' },
  { id: 3, lat: 33.3152, lng: 44.3661, location: 'Baghdad, Iraq', severity: 'medium', type: 'Proxy Activity', time: '1 hour ago', description: 'Militia movements detected' },
  { id: 4, lat: 50.4501, lng: 30.5234, location: 'Kyiv, Ukraine', severity: 'medium', type: 'Drone Attack', time: '3 hours ago', description: 'Air defense engagement' },
  { id: 5, lat: 34.0522, lng: -118.2437, location: 'Los Angeles, USA', severity: 'low', type: 'Political', time: '5 hours ago', description: 'Sanctions announcement' },
];

const SEVERITY_CONFIG = {
  high: { color: '#ef4444', pulse: true, label: '🔴 CRITICAL' },
  medium: { color: '#f97316', pulse: true, label: '🟠 ELEVATED' },
  low: { color: '#eab308', pulse: false, label: '🟡 MONITORING' },
};

export default function ConflictGlobe() {
  const globeRef = useRef(null);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotate the globe
  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Convert lat/lng to 2D position on the globe
  const project = (lat, lng, radius = 150) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + rotation) * (Math.PI / 180);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    // Only show front-facing points
    if (z < 0) return null;
    
    return { x: x + 200, y: y + 200, scale: (z + radius) / (2 * radius) };
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">Live Conflict Monitor</h2>
              <p className="text-xs text-gray-500">Real-time global conflict tracking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs font-body text-red-400">LIVE</span>
            </div>
          </div>
        </div>

        {/* Globe Visualization */}
        <div className="relative h-[400px] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
          {/* Grid Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {/* Globe Circle */}
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity="0.5"
            />
            
            {/* Latitude Lines */}
            {[30, 60, 90, 120].map((r) => (
              <ellipse
                key={r}
                cx="200"
                cy="200"
                rx={r}
                ry={r * 0.4}
                fill="none"
                stroke="#374151"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            
            {/* Longitude Lines (rotating) */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1="200"
                y1="50"
                x2="200"
                y2="350"
                stroke="#374151"
                strokeWidth="0.5"
                opacity="0.3"
                transform={`rotate(${angle + rotation} 200 200)`}
              />
            ))}
            
            {/* Conflict Markers */}
            {MOCK_CONFLICTS.map((conflict) => {
              const pos = project(conflict.lat, conflict.lng);
              if (!pos) return null;
              
              const config = SEVERITY_CONFIG[conflict.severity];
              
              return (
                <g key={conflict.id}>
                  {/* Pulse Effect */}
                  {config.pulse && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="15"
                      fill="none"
                      stroke={config.color}
                      strokeWidth="2"
                      opacity={0.5}
                    >
                      <animate
                        attributeName="r"
                        values="8;20;8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.8;0;0.8"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  
                  {/* Marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={6 + (pos.scale * 4)}
                    fill={config.color}
                    stroke="white"
                    strokeWidth="1"
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => setSelectedConflict(conflict)}
                    style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Label */}
          <div className="absolute top-4 left-4 text-xs text-gray-500 font-mono">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span>5 Active Conflicts</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>3 Recent Events</span>
            </div>
            <div className="text-gray-600 mt-2">Last update: 2 min ago</div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors"
            >
              {isAutoRotating ? '⏸ Pause' : '▶ Rotate'}
            </button>
          </div>

          {/* Selected Conflict Info */}
          {selectedConflict && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 w-64 bg-black/90 border border-white/20 rounded-lg p-4 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-bold text-red-400 uppercase">
                    {SEVERITY_CONFIG[selectedConflict.severity].label}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedConflict(null)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <h3 className="font-heading font-bold text-white mb-1">
                {selectedConflict.location}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{selectedConflict.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedConflict.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedConflict.type}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Active Zones List */}
        <div className="p-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {MOCK_CONFLICTS.map((conflict) => (
              <button
                key={conflict.id}
                onClick={() => setSelectedConflict(conflict)}
                className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: SEVERITY_CONFIG[conflict.severity].color }}
                  />
                  <span className="text-xs font-bold text-white">
                    {conflict.location.split(',')[0]}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">{conflict.time}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

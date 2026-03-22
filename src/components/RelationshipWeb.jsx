import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Minus, HelpCircle } from 'lucide-react';

// Predefined positions for a clean layout
const DEFAULT_NODES = [
  { id: 'us', name: 'United States', flag: '🇺🇸', x: 50, y: 20, type: 'primary' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', x: 50, y: 80, type: 'primary' },
  { id: 'israel', name: 'Israel', flag: '🇮🇱', x: 75, y: 35, type: 'ally' },
  { id: 'uk', name: 'UK', flag: '🇬🇧', x: 25, y: 30, type: 'ally' },
  { id: 'houthis', name: 'Houthis', flag: '🇾🇪', x: 30, y: 65, type: 'proxy' },
  { id: 'hezbollah', name: 'Hezbollah', flag: '🇱🇧', x: 70, y: 60, type: 'proxy' },
  { id: 'hamas', name: 'Hamas', flag: '🇵🇸', x: 80, y: 75, type: 'proxy' },
  { id: 'uae', name: 'UAE', flag: '🇦🇪', x: 80, y: 15, type: 'neutral' },
  { id: 'ksa', name: 'Saudi Arabia', flag: '🇸🇦', x: 20, y: 85, type: 'neutral' },
];

const DEFAULT_EDGES = [
  { from: 'us', to: 'israel', type: 'alliance', label: 'Ally' },
  { from: 'us', to: 'uk', type: 'alliance', label: 'Ally' },
  { from: 'us', to: 'uae', type: 'alliance', label: 'Ally' },
  { from: 'iran', to: 'houthis', type: 'proxy', label: 'Proxy' },
  { from: 'iran', to: 'hezbollah', type: 'proxy', label: 'Proxy' },
  { from: 'iran', to: 'hamas', type: 'proxy', label: 'Proxy' },
  { from: 'us', to: 'iran', type: 'conflict', label: 'Conflict' },
  { from: 'israel', to: 'hezbollah', type: 'conflict', label: 'Conflict' },
  { from: 'israel', to: 'hamas', type: 'conflict', label: 'Conflict' },
  { from: 'ksa', to: 'houthis', type: 'conflict', label: 'Conflict' },
];

const EDGE_STYLES = {
  alliance: { 
    stroke: '#cc1a1a', 
    strokeWidth: 2, 
    strokeDasharray: '0',
    label: 'Direct Alliance'
  },
  proxy: { 
    stroke: '#f59e0b', 
    strokeWidth: 1.5, 
    strokeDasharray: '5,5',
    label: 'Proxy Relationship'
  },
  conflict: { 
    stroke: '#ef4444', 
    strokeWidth: 2.5, 
    strokeDasharray: '0',
    label: 'Active Conflict'
  },
  neutral: { 
    stroke: '#6b7280', 
    strokeWidth: 1, 
    strokeDasharray: '2,2',
    label: 'Neutral/Diplomatic'
  },
};

const NODE_SIZES = {
  primary: { r: 22, fontSize: 20 },
  ally: { r: 16, fontSize: 14 },
  proxy: { r: 14, fontSize: 12 },
  neutral: { r: 12, fontSize: 10 },
};

const RelationshipWeb = ({ nodes = DEFAULT_NODES, edges = DEFAULT_EDGES }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  const getNodeById = (id) => nodes.find(n => n.id === id);

  const getConnectedEdges = (nodeId) => {
    return edges.filter(e => e.from === nodeId || e.to === nodeId);
  };

  const isEdgeHighlighted = (edge) => {
    if (!hoveredNode && !hoveredEdge) return false;
    if (hoveredEdge?.from === edge.from && hoveredEdge?.to === edge.to) return true;
    if (hoveredNode) {
      return edge.from === hoveredNode || edge.to === hoveredNode;
    }
    return false;
  };

  const isNodeHighlighted = (nodeId) => {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId) return true;
    return edges.some(e => 
      (e.from === hoveredNode && e.to === nodeId) ||
      (e.to === hoveredNode && e.from === nodeId)
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="section-header mb-4">
        <div className="section-icon text-red-400">
          <span className="text-lg">🕸️</span>
        </div>
        <div className="flex-1">
          <h2 className="font-heading font-bold text-lg text-white tracking-wide">RELATIONSHIP WEB</h2>
          <p className="text-gray-500 text-xs">Network of alliances and conflicts</p>
        </div>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Toggle legend"
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="comic-panel rounded-xl p-4 relative">
        {/* SVG Diagram */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-auto aspect-square"
          style={{ maxHeight: '400px' }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Edges */}
          {edges.map((edge, index) => {
            const from = getNodeById(edge.from);
            const to = getNodeById(edge.to);
            if (!from || !to) return null;

            const style = EDGE_STYLES[edge.type] || EDGE_STYLES.neutral;
            const highlighted = isEdgeHighlighted(edge);
            const dimmed = hoveredNode && !highlighted;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={style.stroke}
                  strokeWidth={highlighted ? style.strokeWidth * 1.5 : style.strokeWidth}
                  strokeDasharray={style.strokeDasharray}
                  opacity={dimmed ? 0.2 : highlighted ? 1 : 0.6}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredEdge(edge)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />
                {/* Edge label on hover */}
                {highlighted && (
                  <g>
                    <rect
                      x={(from.x + to.x) / 2 - 15}
                      y={(from.y + to.y) / 2 - 8}
                      width="30"
                      height="16"
                      rx="3"
                      fill="rgba(13, 13, 18, 0.95)"
                      stroke={style.stroke}
                      strokeWidth="0.5"
                    />
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 + 3}
                      textAnchor="middle"
                      fill={style.stroke}
                      fontSize="4"
                      fontWeight="500"
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const size = NODE_SIZES[node.type] || NODE_SIZES.neutral;
            const highlighted = isNodeHighlighted(node.id);
            const dimmed = hoveredNode && !highlighted && hoveredNode !== node.id;
            const isHovered = hoveredNode === node.id;

            return (
              <motion.g
                key={node.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                style={{ opacity: dimmed ? 0.3 : 1 }}
              >
                {/* Outer glow for primary nodes */}
                {node.type === 'primary' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size.r + 4}
                    fill="none"
                    stroke={node.id === 'us' ? '#cc1a1a' : '#ef4444'}
                    strokeWidth="0.5"
                    opacity={isHovered ? 0.5 : 0.2}
                    className="transition-opacity duration-300"
                  />
                )}
                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? size.r + 2 : size.r}
                  fill="#1a1a24"
                  stroke={node.id === 'us' ? '#cc1a1a' : node.id === 'iran' ? '#ef4444' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-300"
                />
                {/* Flag */}
                <text
                  x={node.x}
                  y={node.y + size.fontSize * 0.35}
                  textAnchor="middle"
                  fontSize={size.fontSize}
                  style={{ pointerEvents: 'none' }}
                >
                  {node.flag}
                </text>
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + size.r + 8}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#9ca3af'}
                  fontSize="4"
                  fontWeight={isHovered ? '600' : '400'}
                  className="transition-all duration-300"
                >
                  {node.name}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Legend */}
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {Object.entries(EDGE_STYLES).map(([type, style]) => (
              <div key={type} className="flex items-center gap-2">
                <svg width="24" height="8" className="shrink-0">
                  <line
                    x1="2" y1="4" x2="22" y2="4"
                    stroke={style.stroke}
                    strokeWidth="2"
                    strokeDasharray={style.strokeDasharray}
                  />
                </svg>
                <span className="text-[10px] text-gray-400 capitalize">{style.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Info text */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
          <Info className="w-3 h-3" />
          <span>Hover over nodes and lines to explore relationships</span>
        </div>
      </div>
    </div>
  );
};

export default RelationshipWeb;

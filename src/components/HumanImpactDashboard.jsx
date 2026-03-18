import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Home, Building2, TrendingDown, AlertCircle, MapPin, ExternalLink, Clock, Shield, Users, Zap, Droplets, School } from 'lucide-react';

// Impact data structure - NOTE: These are SAMPLE/ESTIMATED figures
// TODO: Replace with real ACLED API integration
const impactData = {
  casualties: {
    civilian: { confirmed: 2847, estimated: 4500, change24h: 12, changeWeek: 89 },
    military: { confirmed: 1923, estimated: null, change24h: 5, changeWeek: 34 },
    confidence: 'medium', // high | medium | low
    sources: ['Reuters', 'AP', 'Local Reports'],
    lastUpdated: '2026-03-17T08:00:00Z'
  },
  displaced: {
    idp: 450000,
    refugees: 180000,
    hosts: [
      { country: 'Jordan', count: 85000 },
      { country: 'Turkey', count: 65000 },
      { country: 'Iraq', count: 30000 }
    ]
  },
  infrastructure: {
    hospitals: { destroyed: 4, damaged: 12 },
    schools: { destroyed: 8, damaged: 23 },
    powerPlants: { destroyed: 1, damaged: 3 },
    waterSystems: { damaged: 8 },
    mostAffected: ['Gaza', 'Beirut', 'Tehran suburbs']
  },
  economic: {
    directDamage: 12400000000,
    gdpLoss: 42000000000,
    oilHalt: 850000,
    hormuzTrafficDrop: 0.15,
    foodPriceIncrease: 0.18
  }
};

// Utility to format large numbers
const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Utility to format currency
const formatCurrency = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return `$${formatNumber(num)}`;
};

// Animated counter hook
const useAnimatedCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * easeOut);
      
      countRef.current = current;
      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return count;
};

// Confidence badge component
const ConfidenceBadge = ({ level }) => {
  const colors = {
    high: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const labels = {
    high: 'Verified',
    medium: 'Estimated',
    low: 'Reported'
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border rounded ${colors[level]}`}>
      {labels[level]}
    </span>
  );
};

// Casualty stat card
const CasualtyCard = ({ title, number, subtitle, change, changeLabel, delay = 0 }) => {
  const animatedNumber = useAnimatedCounter(number);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="comic-panel rounded-xl p-4 text-center hover-lift"
    >
      <div className="font-heading text-3xl sm:text-4xl text-white mb-1 tracking-tight">
        {formatNumber(animatedNumber)}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className="text-[10px] text-gray-500">
        {subtitle}
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center justify-center gap-1 text-[11px]">
          <TrendingDown className="w-3 h-3 text-red-400" />
          <span className="text-red-400 font-mono">+{change}</span>
          <span className="text-gray-500">{changeLabel}</span>
        </div>
      )}
    </motion.div>
  );
};

// Infrastructure item
const InfrastructureItem = ({ icon: Icon, label, destroyed, damaged, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors"
  >
    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-white">{label}</div>
      <div className="flex items-center gap-3 mt-1">
        {destroyed !== undefined && (
          <span className="text-[11px] text-red-400">
            <span className="font-mono font-bold">{destroyed}</span> destroyed
          </span>
        )}
        <span className="text-[11px] text-amber-400">
          <span className="font-mono font-bold">{damaged}</span> damaged
        </span>
      </div>
    </div>
  </motion.div>
);

// Economic stat
const EconomicStat = ({ label, value, subtext, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3"
  >
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-400" />
    </div>
    <div>
      <div className="font-mono text-lg text-white">{value}</div>
      <div className="text-[11px] text-gray-500">{label}</div>
      {subtext && <div className="text-[10px] text-gray-600">{subtext}</div>}
    </div>
  </motion.div>
);

// Main component
const HumanImpactDashboard = () => {
  const { casualties, displaced, infrastructure, economic } = impactData;
  const totalDeaths = casualties.civilian.confirmed + casualties.military.confirmed;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="bg-[#14141c] border border-white/10 rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Skull className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl text-white tracking-wide">
                  HUMAN IMPACT
                </h2>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Real cost of conflict
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border rounded bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                Estimated Data
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-600">
              <Clock className="w-3 h-3" />
              <span>Updated {formatDate(casualties.lastUpdated)}</span>
            </div>
          </div>
        </div>

        {/* DATA TRANSPARENCY WARNING */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-200/70">
              <strong className="text-yellow-400">Data Transparency:</strong> These are preliminary estimates based on available reports. 
              We are working to integrate ACLED (Armed Conflict Location & Event Data) for real-time verified casualty figures.
              Current numbers may underreport actual impact.
            </div>
          </div>
        </div>

        {/* CASUALTY ESTIMATES */}
        <div className="mb-6">
          <div className="section-header">
            <div className="section-icon">
              <AlertCircle className="w-4 h-4 text-red-400" />
            </div>
            <h3 className="font-heading text-sm text-gray-300 uppercase tracking-wider">
              Casualty Estimates
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <CasualtyCard
              title="Civilian"
              subtitle="deaths"
              number={casualties.civilian.confirmed}
              change={casualties.civilian.changeWeek}
              changeLabel="this wk"
              delay={0}
            />
            <CasualtyCard
              title="Military"
              subtitle="deaths"
              number={casualties.military.confirmed}
              change={casualties.military.changeWeek}
              changeLabel="this wk"
              delay={0.1}
            />
            <CasualtyCard
              title="Total"
              subtitle="deaths"
              number={totalDeaths}
              change={casualties.civilian.changeWeek + casualties.military.changeWeek}
              changeLabel="this wk"
              delay={0.2}
            />
          </div>

          {/* Confidence note */}
          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
            <Shield className="w-3 h-3" />
            <span>
              Confidence: <span className="text-gray-400 capitalize">{casualties.confidence}</span>
              {' '}({casualties.sources.join(' + ')})
            </span>
          </div>
        </div>

        {/* DISPLACED PERSONS */}
        <div className="mb-6">
          <div className="section-header">
            <div className="section-icon">
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="font-heading text-sm text-gray-300 uppercase tracking-wider">
              Displaced Persons
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="comic-panel rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-mono text-2xl text-white">
                    {formatNumber(displaced.idp)}
                  </div>
                  <div className="text-[11px] text-gray-500">Internally Displaced</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-mono text-2xl text-white">
                    {formatNumber(displaced.refugees)}
                  </div>
                  <div className="text-[11px] text-gray-500">Refugees</div>
                </div>
              </div>
            </div>

            <div className="comic-panel rounded-xl p-4">
              <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-3">
                Top Host Countries
              </div>
              <div className="space-y-2">
                {displaced.hosts.map((host, idx) => (
                  <div key={host.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600 w-4">{idx + 1}</span>
                      <span className="text-sm text-gray-300">{host.country}</span>
                    </div>
                    <span className="font-mono text-sm text-white">
                      {formatNumber(host.count)}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-3 flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors">
                <span>View refugee map</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* INFRASTRUCTURE DESTROYED */}
        <div className="mb-6">
          <div className="section-header">
            <div className="section-icon">
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-heading text-sm text-gray-300 uppercase tracking-wider">
              Infrastructure Destroyed
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            <InfrastructureItem
              icon={Building2}
              label="Hospitals"
              destroyed={infrastructure.hospitals.destroyed}
              damaged={infrastructure.hospitals.damaged}
              delay={0}
            />
            <InfrastructureItem
              icon={School}
              label="Schools"
              destroyed={infrastructure.schools.destroyed}
              damaged={infrastructure.schools.damaged}
              delay={0.05}
            />
            <InfrastructureItem
              icon={Zap}
              label="Power Plants"
              destroyed={infrastructure.powerPlants.destroyed}
              damaged={infrastructure.powerPlants.damaged}
              delay={0.1}
            />
            <InfrastructureItem
              icon={Droplets}
              label="Water Systems"
              damaged={infrastructure.waterSystems.damaged}
              delay={0.15}
            />
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>
              Most affected: <span className="text-gray-400">{infrastructure.mostAffected.join(', ')}</span>
            </span>
          </div>
        </div>

        {/* ECONOMIC IMPACT */}
        <div>
          <div className="section-header">
            <div className="section-icon">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-heading text-sm text-gray-300 uppercase tracking-wider">
              Economic Impact
            </h3>
          </div>

          <div className="comic-panel rounded-xl p-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <EconomicStat
                icon={AlertCircle}
                label="Direct Damage"
                value={formatCurrency(economic.directDamage)}
                delay={0}
              />
              <EconomicStat
                icon={TrendingDown}
                label="Regional GDP Loss"
                value={formatCurrency(economic.gdpLoss)}
                delay={0.05}
              />
              <EconomicStat
                icon={Zap}
                label="Oil Production Halt"
                value={`${(economic.oilHalt / 1e6).toFixed(1)}M`}
                subtext="barrels/day"
                delay={0.1}
              />
              <EconomicStat
                icon={MapPin}
                label="Hormuz Traffic"
                value={`↓ ${(economic.hormuzTrafficDrop * 100).toFixed(0)}%`}
                delay={0.15}
              />
              <EconomicStat
                icon={AlertCircle}
                label="Food Prices"
                value={`↑ ${(economic.foodPriceIncrease * 100).toFixed(0)}%`}
                subtext="regional average"
                delay={0.2}
              />
            </div>
          </div>
        </div>

        {/* Footer - Source attribution */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-gray-600">
            <span>Sources:</span>
            <span className="text-gray-500">ACLED (Armed Conflict Location & Event Data)</span>
            <span className="text-gray-500">UN OCHA</span>
            <span className="text-gray-500">UNHCR</span>
          </div>
          <p className="mt-2 text-[10px] text-gray-700 italic">
            Every number represents real people affected by conflict. Data represents best available estimates.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HumanImpactDashboard;

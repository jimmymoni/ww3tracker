import { motion } from 'framer-motion';
import { Skull, Users, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Impact data - summary stats only
const impactSummary = {
  casualties: {
    civilian: 2847,
    military: 1923,
    total: 4770
  },
  displaced: {
    idp: 450000,
    refugees: 180000,
    total: 630000
  },
  infrastructure: {
    hospitals: { destroyed: 4, damaged: 12 },
    schools: { destroyed: 8, damaged: 23 },
    powerPlants: { destroyed: 1, damaged: 3 }
  }
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toLocaleString();
};

/**
 * ImpactSummaryBar - Compact stats bar for homepage
 * Shows key impact metrics with link to full dashboard
 */
const ImpactSummaryBar = () => {
  const { casualties, displaced, infrastructure } = impactSummary;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="w-full mb-6"
    >
      <div className="bg-[#14141c] border border-white/10 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Stats Row */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Casualties */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Skull className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="font-mono font-bold text-xl text-white">
                  {formatNumber(casualties.total)}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Deaths
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-white/10" />

            {/* Displaced */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-mono font-bold text-xl text-white">
                  {formatNumber(displaced.total)}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Displaced
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-white/10" />

            {/* Infrastructure */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-mono font-bold text-xl text-white">
                  {infrastructure.hospitals.destroyed + infrastructure.schools.destroyed + infrastructure.powerPlants.destroyed}
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">
                  Facilities Hit
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/impact"
            className="flex items-center justify-center sm:justify-start gap-2 text-sm text-red-400 hover:text-red-300 transition-colors group"
          >
            <span>View Full Impact Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-600">
            Preliminary estimates. Full data includes breakdowns by region and source verification.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default ImpactSummaryBar;

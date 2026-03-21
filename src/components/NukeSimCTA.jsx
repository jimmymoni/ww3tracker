import { motion } from 'framer-motion';
import { Zap, ArrowRight, Radiation } from 'lucide-react';

/**
 * NukeSimCTA - Call-to-action for nuclear simulator
 * Compact CTA card linking to the nuke simulator
 */
const NukeSimCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full mb-6"
    >
      <a 
        href="/nuke" 
        className="block group"
      >
        <div className="relative bg-gradient-to-r from-red-950/50 via-orange-950/30 to-red-950/50 border border-red-500/20 rounded-2xl p-5 overflow-hidden hover:border-red-500/40 transition-colors">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
          
          <div className="relative flex items-center justify-between gap-4">
            {/* Left: Icon & Text */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                <Radiation className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white mb-1 flex items-center gap-2">
                  Nuclear Blast Simulator
                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    ☢️ Interactive
                  </span>
                </h3>
                <p className="text-sm text-gray-400">
                  See the impact of different weapons on any city. Understand the stakes.
                </p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-5 rounded-xl transition-colors flex-shrink-0">
              <span>Try Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden mt-4">
            <div className="flex items-center justify-center gap-2 bg-red-600 text-white font-medium py-3 px-5 rounded-xl">
              <span>Try Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </a>
    </motion.section>
  );
};

export default NukeSimCTA;

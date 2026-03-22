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
        <div className="relative bg-[#111111] border border-[#2a2a2a] rounded-lg p-5 overflow-hidden hover:border-[#3a3a3a] transition-colors">
          <div className="relative flex items-center justify-between gap-4">
            {/* Left: Icon & Text */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <Radiation className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-white mb-1 flex items-center gap-2">
                  Nuclear Blast Simulator
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">
                    Interactive
                  </span>
                </h3>
                <p className="text-sm text-gray-400">
                  See the impact of different weapons on any city. Understand the stakes.
                </p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="hidden sm:flex items-center gap-1 text-gray-400 group-hover:text-white transition-colors flex-shrink-0">
              <span className="text-sm font-medium">Try Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden mt-4">
            <div className="flex items-center justify-center gap-1 text-gray-400">
              <span className="text-sm font-medium">Try Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </a>
    </motion.section>
  );
};

export default NukeSimCTA;

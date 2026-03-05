import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';

const KeyTakeaway = ({ title, points, cta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-xl border border-orange-500/20 bg-orange-500/5 p-6"
    >
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-orange-400">{title || "Key Takeaway"}</h3>
        </div>

        <div className="space-y-3">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <ArrowRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-zinc-300">{point}</p>
            </motion.div>
          ))}
        </div>

        {cta && (
          <div className="mt-6 pt-4 border-t border-orange-500/10">
            <button className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors text-sm">
              {cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KeyTakeaway;

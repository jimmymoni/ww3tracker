import { motion } from 'framer-motion';
import { Calendar, Flag, Skull, Bomb, Star } from 'lucide-react';

const iconMap = {
  coup: Flag,
  revolution: Star,
  war: Bomb,
  death: Skull,
  default: Calendar,
};

const Timeline = ({ events, title = "Timeline" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-zinc-400" />
        {title}
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />

        {/* Events */}
        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = iconMap[event.icon] || iconMap.default;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-12"
              >
                {/* Icon */}
                <div className={`absolute left-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                  event.highlight
                    ? 'bg-red-500/20 border-red-500/50'
                    : 'bg-zinc-900 border-zinc-700'
                }`}>
                  <Icon className={`w-4 h-4 ${event.highlight ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>

                {/* Content */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-bold ${
                      event.highlight ? 'text-red-400' : 'text-zinc-400'
                    }`}>
                      {event.year}
                    </span>
                    {event.tag && (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                        {event.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="text-white font-medium mb-1">{event.title}</h4>
                  <p className="text-zinc-500 text-sm">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;

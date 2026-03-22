import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swords, ArrowUpRight, Globe, Users } from 'lucide-react';

const RelatedConflicts = ({ conflicts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-slate-700/50 bg-slate-900/50 overflow-hidden"
    >
      <div className="p-5 border-b border-slate-700/50">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-400" />
          Related Conflicts
        </h3>
      </div>

      <div className="p-4 space-y-3">
        {conflicts.map((conflict, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={conflict.link || '#'}
              className="group block p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all hover:border-slate-600 border border-transparent"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${
                      conflict.status === 'active' ? 'bg-red-500 animate-pulse' :
                      conflict.status === 'ongoing' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{conflict.region}</span>
                  </div>
                  <h4 className="text-white font-semibold group-hover:text-red-400 transition-colors mb-1">
                    {conflict.title}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-2">{conflict.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    {conflict.parties && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {conflict.parties} parties
                      </span>
                    )}
                    {conflict.coverage && (
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {conflict.coverage}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-red-400 transition-colors flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedConflicts;

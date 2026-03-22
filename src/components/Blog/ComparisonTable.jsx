import { motion } from 'framer-motion';
import { Scale, Trophy, AlertCircle } from 'lucide-react';

const ComparisonTable = ({ title, subtitle, data, usaLabel = "USA", iranLabel = "Iran" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-zinc-400" />
          {title}
        </h3>
        {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-4 text-zinc-500 font-medium">Category</th>
              <th className="text-center p-4 text-zinc-300 font-semibold w-1/4">
                {usaLabel}
              </th>
              <th className="text-center p-4 text-zinc-300 font-semibold w-1/4">
                {iranLabel}
              </th>
              <th className="text-center p-4 text-zinc-500 font-medium w-24">Edge</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors"
              >
                <td className="p-4">
                  <span className="text-zinc-300 font-medium">{row.category}</span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    row.winner === 'usa' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'text-zinc-400'
                  }`}>
                    {row.usa}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    row.winner === 'iran' 
                      ? 'bg-green-500/10 text-green-400' 
                      : 'text-zinc-400'
                  }`}>
                    {row.iran}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {row.winner === 'tie' ? (
                    <span className="text-zinc-500 text-xs flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Even
                    </span>
                  ) : (
                    <span className={`text-xs ${
                      row.winner === 'usa' ? 'text-red-400' : 'text-red-400'
                    }`}>
                      {row.winner === 'usa' ? 'USA' : 'Iran'}
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComparisonTable;

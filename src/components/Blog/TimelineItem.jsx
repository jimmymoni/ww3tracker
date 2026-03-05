import { motion } from 'framer-motion';
import { Calendar, Circle } from 'lucide-react';

/**
 * TimelineItem - Timeline item component for historical events
 * 
 * @param {Object} props
 * @param {string} props.date - Date or year
 * @param {string} props.title - Event title
 * @param {string} props.description - Event description
 * @param {React.ElementType} props.icon - Icon component
 * @param {boolean} props.isLast - Whether this is the last item (no connecting line)
 * @param {boolean} props.isActive - Whether this item is highlighted/active
 * @param {string} props.variant - Visual variant: 'default' | 'milestone' | 'event'
 * @param {string} props.className - Additional CSS classes
 */
const TimelineItem = ({
  date,
  title,
  description,
  icon: Icon,
  isLast = false,
  isActive = false,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: {
      node: 'bg-slate-700 border-slate-600',
      activeNode: 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/30',
      line: 'bg-slate-700',
      date: 'text-slate-400',
      title: 'text-slate-100',
      description: 'text-slate-400',
    },
    milestone: {
      node: 'bg-purple-900/50 border-purple-700',
      activeNode: 'bg-purple-500 border-purple-400 shadow-lg shadow-purple-500/30',
      line: 'bg-gradient-to-b from-purple-500/50 to-slate-700',
      date: 'text-purple-400',
      title: 'text-purple-100',
      description: 'text-slate-400',
    },
    event: {
      node: 'bg-emerald-900/50 border-emerald-700',
      activeNode: 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/30',
      line: 'bg-emerald-700/30',
      date: 'text-emerald-400',
      title: 'text-emerald-100',
      description: 'text-slate-400',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;
  const DisplayIcon = Icon || Calendar;

  return (
    <motion.div
      className={`relative flex gap-4 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Timeline Node & Line */}
      <div className="relative flex flex-col items-center">
        {/* Node */}
        <motion.div
          className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center ${
            isActive ? styles.activeNode : styles.node
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <DisplayIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
          
          {/* Pulse Effect for Active */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full bg-inherit"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Connecting Line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-2 ${styles.line}`} />
        )}
      </div>

      {/* Content */}
      <motion.div
        className={`flex-1 pb-8 ${isLast ? '' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {/* Date Badge */}
        <motion.span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 border border-slate-700/50 ${styles.date} mb-2`}
          whileHover={{ scale: 1.02 }}
        >
          <Calendar className="w-3 h-3" />
          {date}
        </motion.span>

        {/* Title */}
        <h4 className={`font-bold text-lg mb-2 ${styles.title}`}>
          {title}
        </h4>

        {/* Description */}
        {description && (
          <p className={`text-sm leading-relaxed ${styles.description}`}>
            {description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * TimelineContainer - Wrapper component for timeline items
 */
export const TimelineContainer = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default TimelineItem;

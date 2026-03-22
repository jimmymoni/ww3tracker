import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

/**
 * PullQuote - Pull quote/callout component
 * 
 * @param {Object} props
 * @param {string} props.text - The quote text
 * @param {string} props.attribution - Optional attribution (author/source)
 * @param {string} props.attributionTitle - Optional attribution title/role
 * @param {string} props.variant - Visual variant: 'default' | 'statistic' | 'testimonial'
 * @param {string} props.size - Text size: 'sm' | 'md' | 'lg'
 * @param {string} props.className - Additional CSS classes
 */
const PullQuote = ({
  text,
  attribution,
  attributionTitle,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: {
      container: 'bg-slate-800/60 border-slate-700/50',
      border: 'from-red-500 via-purple-500 to-pink-500',
      icon: 'text-red-400',
      text: 'text-slate-200',
      attribution: 'text-slate-400',
    },
    statistic: {
      container: 'bg-red-900/20 border-red-700/30',
      border: 'from-red-400 via-orange-400 to-yellow-400',
      icon: 'text-orange-400',
      text: 'text-orange-100',
      attribution: 'text-orange-400/70',
    },
    testimonial: {
      container: 'bg-purple-900/20 border-purple-700/30',
      border: 'from-purple-400 via-pink-400 to-rose-400',
      icon: 'text-purple-400',
      text: 'text-purple-100',
      attribution: 'text-purple-400/70',
    },
  };

  const sizeStyles = {
    sm: {
      text: 'text-base',
      icon: 'w-8 h-8',
      padding: 'p-5',
    },
    md: {
      text: 'text-lg md:text-xl',
      icon: 'w-10 h-10',
      padding: 'p-6',
    },
    lg: {
      text: 'text-xl md:text-2xl lg:text-3xl',
      icon: 'w-12 h-12',
      padding: 'p-8',
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;
  const sizeClasses = sizeStyles[size] || sizeStyles.md;

  return (
    <motion.blockquote
      className={`relative rounded-r-xl border border-l-4 border-l-transparent ${sizeClasses.padding} ${styles.container} ${className}`}
      style={{
        borderLeftColor: 'transparent',
        backgroundClip: 'padding-box',
      }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Left Border */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.border} rounded-l`}
      />

      {/* Quote Icon */}
      <motion.div
        className={`mb-4 ${styles.icon}`}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Quote className={`${sizeClasses.icon} fill-current opacity-20`} />
      </motion.div>

      {/* Quote Text */}
      <motion.p
        className={`font-medium leading-relaxed ${styles.text} ${sizeClasses.text}`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        "{text}"
      </motion.p>

      {/* Attribution */}
      {attribution && (
        <motion.footer
          className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${styles.attribution}`}>
              — {attribution}
            </span>
            {attributionTitle && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-sm">{attributionTitle}</span>
              </>
            )}
          </div>
        </motion.footer>
      )}

      {/* Background Decoration */}
      <div className="absolute top-4 right-4 opacity-5">
        <Quote className="w-24 h-24 rotate-180" />
      </div>
    </motion.blockquote>
  );
};

export default PullQuote;

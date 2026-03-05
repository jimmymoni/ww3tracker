import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';

/**
 * ArticleCard - Featured article card component
 * 
 * @param {Object} props
 * @param {string} props.image - Image URL
 * @param {string} props.category - Article category
 * @param {string} props.categoryColor - Category badge color (default: blue)
 * @param {string} props.title - Article title
 * @param {string} props.excerpt - Article excerpt/description
 * @param {string} props.date - Publication date
 * @param {number} props.readingTime - Reading time in minutes
 * @param {string} props.href - Link URL
 * @param {boolean} props.featured - Whether this is a featured (large) card
 */
const ArticleCard = ({
  image,
  category,
  categoryColor = 'blue',
  title,
  excerpt,
  date,
  readingTime,
  href = '#',
  featured = false,
}) => {
  const colorVariants = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  return (
    <motion.article
      className={`group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 backdrop-blur-sm ${
        featured ? 'md:grid md:grid-cols-2 md:gap-0' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden ${featured ? 'md:h-full h-48' : 'h-48'}`}>
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60" />
        
        {/* Category Badge - Positioned on Image */}
        <div className="absolute top-4 left-4">
          <motion.span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              colorVariants[categoryColor] || colorVariants.blue
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tag className="w-3 h-3" />
            {category}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 ${featured ? 'md:p-8 flex flex-col justify-center' : ''}`}>
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-slate-400 text-sm mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-slate-100 mb-3 leading-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
        >
          <a href={href} className="hover:outline-none">
            {title}
          </a>
        </h3>

        {/* Excerpt */}
        <p className={`text-slate-400 mb-5 leading-relaxed ${featured ? 'text-base' : 'text-sm line-clamp-2'}`}>
          {excerpt}
        </p>

        {/* Read More Button */}
        <motion.a
          href={href}
          className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm group/btn"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <span className="relative">
            Read More
            <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover/btn:w-full" />
          </span>
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </motion.span>
        </motion.a>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      </div>
    </motion.article>
  );
};

export default ArticleCard;

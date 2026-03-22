import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Tag, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LatestBlogHero - Large featured blog card for homepage
 * Displays the most recent blog post as a hero section
 */
const LatestBlogHero = ({ post }) => {
  if (!post) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-6"
    >
      <div className="bg-[#14141c] border border-white/10 rounded-2xl overflow-hidden">
        {/* Section Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-400" />
            <h2 className="font-heading font-bold text-lg text-white">Latest Analysis</h2>
          </div>
          <Link 
            to="/blog" 
            className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Hero Card */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image || '/images/blog/default.jpg'})` }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-transparent to-transparent md:bg-gradient-to-r" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-red-500/20 text-red-400 border-red-500/30">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 md:p-8 flex flex-col justify-center">
            {/* Meta */}
            <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 leading-tight">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            {/* CTA Button */}
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#cc1a1a] hover:bg-[#cc1a1a] text-white font-medium py-3 px-6 rounded transition-colors w-fit"
            >
              Read Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LatestBlogHero;

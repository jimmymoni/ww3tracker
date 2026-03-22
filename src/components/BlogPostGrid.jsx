import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * BlogPostGrid - Grid of smaller blog cards
 * Displays 3-4 blog posts in a compact grid layout
 */
const BlogPostGrid = ({ posts = [] }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full mb-6"
    >
      <div className="bg-[#14141c] border border-white/10 rounded-2xl p-5">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            More Stories
          </h3>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative h-32 rounded-xl overflow-hidden mb-3">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${post.image || '/images/blog/default.jpg'})`,
                      backgroundColor: '#1a1a2e'
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-gray-500 text-[10px] mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-white mb-1.5 line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                    {post.title}
                  </h4>

                  {/* Read More */}
                  <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 group-hover:text-white transition-colors">
                    Read
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BlogPostGrid;

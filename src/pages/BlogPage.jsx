import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  console.log('[BlogPage] Rendering, posts:', blogPosts?.length);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <SEO
        title="War Room Blog | US-Iran Conflict Analysis"
        description="Deep analysis of the US-Iran conflict."
        pathname="/blog"
      />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <div className="border-b border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Understanding the War</h1>
            <p className="text-lg text-zinc-400">Analysis and explainers on the US-Iran conflict.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Search */}
          <div className="relative max-w-xl mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Articles */}
          <div className="space-y-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 aspect-[16/10] overflow-hidden rounded-xl">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 text-sm text-zinc-500">
                        <span>{post.category}</span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-zinc-400 mb-4">{post.excerpt}</p>
                      <span className="text-red-400 flex items-center gap-1">
                        Read article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              No articles found.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;

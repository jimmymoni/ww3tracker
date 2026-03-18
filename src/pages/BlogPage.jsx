import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, Search, BookOpen } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get featured and other posts
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <>
      <SEO
        title="War Analysis | US-Iran Conflict Explained"
        description="Clear explanations of the US-Iran war. From the 1953 coup to today's strikes, understand what's happening and why."
        pathname="/blog"
      />
      
      {/* Canonical URL for this page */}
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/blog" />
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Simple Header */}
        <div className="border-b border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4 text-red-400 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                <span>Understanding the Conflict</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">War Analysis</h1>
              <p className="text-zinc-400 text-lg">
                Clear explanations of what's happening, why it matters, and what comes next.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          {/* Featured Article */}
          {featuredPost && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Featured</span>
              <Link to={`/blog/${featuredPost.slug}`} className="group block">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all">
                  <div className="aspect-video">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                      <span className="text-red-400">{featuredPost.category}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zinc-400">{featuredPost.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article List */}
          <div>
            <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">More Articles</h2>
            <div className="space-y-4">
              {otherPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group flex gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-zinc-500 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              No articles found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

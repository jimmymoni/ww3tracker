import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, Search, BookOpen, Menu, X } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';

// Simple Header for Blog Page
const BlogHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 relative">
              <img src="/logo/globe-radar.svg" alt="WW3 Tracker" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg text-white tracking-wide">
                WW3 TRACKER
              </h1>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/live-map', label: 'Live Map' },
              { to: '/blog', label: 'WW3 News' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/nuke"
              className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
            >
              ☢️ Nuke Sim
            </a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 mt-2 py-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/live-map', label: 'Live Map' },
              { to: '/blog', label: 'WW3 News' },
              { to: '/nuke', label: '☢️ Nuke Sim' },
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-white font-body text-sm py-2 px-3 rounded hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <>
      <SEO
        title="War Analysis | US-Iran Conflict Explained"
        description="Clear explanations of the US-Iran war. From the 1953 coup to today's strikes, understand what's happening and why."
        pathname="/blog"
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/blog" />
      </Helmet>

      <div className="min-h-screen bg-[#0d0d12] text-white">
        <BlogHeader />

        {/* Hero */}
        <div className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4 text-red-400 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                <span>Understanding the Conflict</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">War Analysis</h1>
              <p className="text-gray-400 text-lg">
                Clear explanations of what's happening, why it matters, and what comes next.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Featured Article */}
          {featuredPost && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Featured</span>
              <Link to={`/blog/${featuredPost.slug}`} className="group block">
                <div className="bg-[#14141c] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
                  <div className="aspect-video bg-gray-800">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="text-red-400">{featuredPost.category}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-400">{featuredPost.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article List */}
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">More Articles</h2>
            <div className="space-y-4">
              {otherPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group flex gap-4 p-4 bg-[#14141c] border border-white/10 rounded-xl hover:border-white/20 transition-all">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No articles found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

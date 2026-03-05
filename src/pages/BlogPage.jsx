import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ArrowRight, Search, Flame, TrendingUp, 
  ChevronLeft, ChevronRight, BookOpen, Zap, 
  Target, Globe, Newspaper, BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import NewsletterSignup from '../components/Blog/NewsletterSignup';
import PollWidget from '../components/Blog/PollWidget';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const categoryIcons = {
    'All': Globe,
    'Explainer': BookOpen,
    'Military': Target,
    'Israel-Iran': Zap,
    'Nuclear': Flame,
    'Economics': BarChart3,
    'Analysis': Newspaper
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.slice(0, 3);
  const regularPosts = filteredPosts.slice(3);

  const pollData = {
    question: "What's the most likely outcome of the US-Iran war?",
    options: [
      { label: "Prolonged stalemate", votes: 3420 },
      { label: "Iranian regime collapse", votes: 1890 },
      { label: "Negotiated settlement", votes: 1230 },
      { label: "Escalation to WW3", votes: 890 }
    ]
  };

  const nextFeatured = () => setCurrentFeatured((prev) => (prev + 1) % featuredPosts.length);
  const prevFeatured = () => setCurrentFeatured((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);

  return (
    <>
      <Helmet>
        <title>Blog | WW3 Tracker - US-Iran Conflict Analysis</title>
        <meta name="description" content="Deep dives into US-Iran tensions, Israel conflicts, military comparisons, and the history behind the current war." />
      </Helmet>

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Header Section */}
        <div className="border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-sm font-medium">Live Conflict Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                The War Room Blog
              </h1>
              
              <p className="text-lg text-zinc-400 leading-relaxed">
                Deep analysis of the US-Iran conflict. From the 1953 coup to today's bombings, 
                explained with data, timelines, and zero BS.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search topics, tags, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors text-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map(category => {
                const Icon = categoryIcons[category] || Globe;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {category}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Post Carousel */}
          {featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium text-sm">Featured Stories</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={prevFeatured} className="p-1.5 hover:bg-zinc-800 rounded transition-colors">
                    <ChevronLeft className="w-4 h-4 text-zinc-400" />
                  </button>
                  <div className="flex gap-1">
                    {featuredPosts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentFeatured(idx)}
                        className={`h-1 rounded-full transition-all ${
                          idx === currentFeatured ? 'w-6 bg-red-400' : 'w-1 bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <button onClick={nextFeatured} className="p-1.5 hover:bg-zinc-800 rounded transition-colors">
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatured}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Link to={`/blog/${featuredPosts[currentFeatured].slug}`} className="group block">
                    <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                      <div className="grid md:grid-cols-2">
                        <div className="aspect-video md:aspect-auto overflow-hidden">
                          <img 
                            src={featuredPosts[currentFeatured].image} 
                            alt={featuredPosts[currentFeatured].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full border border-red-500/20">
                              {featuredPosts[currentFeatured].category}
                            </span>
                            <span className="flex items-center gap-1 text-zinc-500 text-xs">
                              <Clock className="w-3 h-3" />
                              {featuredPosts[currentFeatured].readTime}
                            </span>
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors leading-tight">
                            {featuredPosts[currentFeatured].title}
                          </h2>
                          <p className="text-zinc-400 mb-4 leading-relaxed">
                            {featuredPosts[currentFeatured].excerpt}
                          </p>
                          <div className="flex items-center text-red-400 font-medium text-sm group-hover:gap-2 transition-all">
                            Read Full Analysis <ArrowRight className="w-4 h-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Latest Analysis</h2>
                <span className="text-zinc-500 text-sm">{filteredPosts.length} articles</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block h-full">
                      <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                            <span>{post.category}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-zinc-500 text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-2">
                            {post.tags?.slice(0, 2).map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No articles found</h3>
                  <p className="text-zinc-500">Try adjusting your search or filter</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <NewsletterSignup variant="card" />
              <PollWidget question={pollData.question} options={pollData.options} />
              
              {/* Trending Topics */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Trending Now
                </h3>
                <div className="space-y-2">
                  {[
                    { tag: "Nuclear Program", count: "12.5K" },
                    { tag: "Strait of Hormuz", count: "8.2K" },
                    { tag: "Israel Strikes", count: "6.8K" },
                    { tag: "Proxy War", count: "4.3K" },
                    { tag: "Oil Prices", count: "3.9K" }
                  ].map((topic, i) => (
                    <div key={i} className="flex items-center justify-between py-2 hover:bg-zinc-800/50 px-2 -mx-2 rounded transition-colors cursor-pointer">
                      <span className="text-zinc-400 text-sm">#{topic.tag}</span>
                      <span className="text-zinc-600 text-xs">{topic.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-zinc-400" />
                  Conflict Snapshot
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Days at War</span>
                    <span className="text-white">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Oil Change</span>
                    <span className="text-red-400">+62%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Countries Involved</span>
                    <span className="text-white">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Enrichment</span>
                    <span className="text-orange-400">60%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;

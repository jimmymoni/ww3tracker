import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, ArrowRight, Search, BookOpen, Zap, 
  Target, Globe, Newspaper, ArrowUpRight,
  FileText, AlertTriangle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { BreadcrumbSchema, FAQSchema } from '../components/StructuredData';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const categoryIcons = {
    'All': Globe,
    'Explainer': BookOpen,
    'Military': Target,
    'Israel-Iran': Zap,
    'Nuclear': AlertTriangle,
    'Economics': Newspaper
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get featured post (first one)
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  // Breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" }
  ];

  // FAQ for rich snippets
  const faqs = [
    {
      question: "What is the US-Iran conflict about?",
      answer: "The US-Iran conflict stems from decades of tension including the 1953 CIA coup, the 1979 Islamic Revolution, and ongoing disputes over Iran's nuclear program."
    },
    {
      question: "How did the current war start?",
      answer: "The current conflict escalated in 2026 when Israel, backed by the US, launched strikes on Iranian nuclear facilities, leading to Iranian retaliation."
    }
  ];

  return (
    <>
      <SEO
        title="War Room Blog | US-Iran Conflict Analysis & WW3 News"
        description="Deep analysis of the US-Iran conflict. From the 1953 coup to today's bombings, explained with clarity and context."
        pathname="/blog"
        ogImage="/og-image.png"
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={faqs} />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Hero Section */}
        <div className="border-b border-zinc-800">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-red-400 text-sm font-medium tracking-wide uppercase">Live Conflict Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Understanding the War
              </h1>
              
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl">
                From the 1953 CIA coup to the missiles flying today. 
                We break down the US-Iran conflict with the context you need to understand what's really happening.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Search & Filter */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="relative max-w-xl mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors text-base"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const Icon = categoryIcons[category] || Globe;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-white text-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Article */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Featured Story
              </div>
              
              <Link to={`/blog/${featuredPost.slug}`} className="group block">
                <div className="grid md:grid-cols-5 gap-8">
                  <div className="md:col-span-3 aspect-[16/10] overflow-hidden rounded-2xl">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-sm text-zinc-500">
                      <span className="text-red-400 font-medium">{featuredPost.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-zinc-400 mb-6 leading-relaxed text-base">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center text-white font-medium group-hover:gap-3 transition-all">
                      Read the full story <ArrowRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article List */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">More Stories</h2>
              <span className="text-zinc-500">{otherPosts.length} articles</span>
            </div>

            <div className="space-y-8">
              {otherPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 aspect-[16/10] overflow-hidden rounded-xl flex-shrink-0">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-3 text-sm text-zinc-500">
                          <span className="text-zinc-300 font-medium">{post.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-sm text-zinc-500 group-hover:text-white transition-colors">
                          Read article <ArrowUpRight className="w-4 h-4 ml-1" />
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
        </div>
      </div>
    </>
  );
};

export default BlogPage;

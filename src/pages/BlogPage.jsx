import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, Search, BookOpen, TrendingUp, Shield, Globe, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { FAQSchema, ItemListSchema, BreadcrumbSchema } from '../components/StructuredData';

// Category colors
const categoryStyles = {
  'Breaking': 'bg-red-500/10 text-red-400 border-red-500/20',
  'Military': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Economic': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Analysis': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Explainer': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'History': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const categoryIcons = {
  'Breaking': Zap,
  'Military': Shield,
  'Economic': TrendingUp,
  'Analysis': Globe,
  'Explainer': BookOpen,
  'History': Clock,
};

// AI-Optimized FAQ Section
const AIFriendlyFAQ = () => {
  const faqs = [
    {
      question: "How many casualties in the US-Iran war?",
      answer: "The US-Iran war has resulted in significant casualties on both sides. Confirmed losses include Iranian military personnel from Israeli strikes in Tehran and Bandar Abbas, US casualties from Iranian missile attacks on bases in the region, and civilian casualties in cities including Tel Aviv, Beirut, and Baghdad."
    },
    {
      question: "What weapons is Iran using against Israel and the US?",
      answer: "Iran has deployed ballistic missiles (Shahab and Emad series), cruise missiles, and drone swarms (Shahed-136 and Shahed-131). These have been used to target Israeli cities including Tel Aviv, US military installations across the Middle East, and commercial shipping in the Persian Gulf."
    },
    {
      question: "Why did America attack Iran in 2026?",
      answer: "The direct US involvement followed Israeli precision strikes on senior Iranian leadership in Tehran on March 17, 2026. The US joined the conflict after Iran retaliated with missile strikes against both Israeli and American targets."
    },
    {
      question: "Is the Strait of Hormuz still open?",
      answer: "The Strait of Hormuz remains a critical flashpoint. While commercial shipping continues, military activity in the region poses significant risks. This narrow waterway handles approximately 20% of global oil shipments, making it strategically vital to the world economy."
    },
    {
      question: "What countries are supporting Iran?",
      answer: "Iran receives support from various proxy groups including Hezbollah in Lebanon, various Shia militias in Iraq, and the Houthis in Yemen. Regional allies include Syria. However, no major nation-state has entered the conflict directly on Iran's side as of March 2026."
    },
    {
      question: "Will the US-Iran war cause World War 3?",
      answer: "While the conflict represents one of the most serious Middle East escalations in decades, WW3 would require direct involvement of multiple major powers. Currently, the conflict remains regional with proxy involvement. However, the risk of escalation continues as long as hostilities persist."
    }
  ];

  return (
    <section className="mt-20 pt-16 border-t border-white/10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>Common Questions</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          US-Iran War FAQs
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="group bg-gradient-to-br from-[#1a1a24] to-[#14141c] border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:from-[#1e1e2a] hover:to-[#181820] transition-all duration-300"
          >
            <h3 className="text-white font-semibold mb-3 group-hover:text-blue-400 transition-colors">
              {faq.question}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  // FAQ data for schema
  const faqData = [
    {
      question: "How many casualties in the US-Iran war?",
      answer: "The US-Iran war has resulted in significant casualties on both sides including Iranian military personnel, US forces, and civilians in Tel Aviv, Beirut, and Baghdad."
    },
    {
      question: "What weapons is Iran using?",
      answer: "Iran has deployed ballistic missiles (Shahab and Emad series), cruise missiles, and drone swarms (Shahed-136) targeting Israel and US bases."
    },
    {
      question: "Why did America attack Iran in 2026?",
      answer: "US involvement followed Israeli strikes on Iranian leadership in Tehran on March 17, 2026, after Iran retaliated against Israeli and American targets."
    },
    {
      question: "Is the Strait of Hormuz open?",
      answer: "The Strait of Hormuz remains open but is a critical flashpoint, handling 20% of global oil shipments with ongoing military activity in the region."
    }
  ];

  // ItemList schema for articles
  const articleListData = filteredPosts.map(post => ({
    name: post.title,
    description: post.excerpt,
    url: `/blog/${post.slug}`
  }));

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "WW3 News & Analysis", url: "/blog" }
  ];

  return (
    <>
      <SEO
        title="WW3 News & Analysis | US-Iran War Updates | WW3 Tracker"
        description="Breaking analysis of the US-Iran conflict. F-35 shot down, Strait of Hormuz at risk, and what it means for global security. Live updates and military analysis."
        pathname="/blog"
        ogImage="/og-image-blog.png"
        article={false}
        tags={["US-Iran war", "WW3", "World War 3", "Iran conflict", "military analysis"]}
      />
      
      <Helmet>
        <link rel="canonical" href="https://ww3tracker.live/blog" />
        <meta name="keywords" content="US-Iran war news, Iran conflict analysis, WW3 updates, World War 3 news, military casualties, Strait of Hormuz, Iran missiles" />
      </Helmet>

      {/* Structured Data */}
      <FAQSchema faqs={faqData} />
      <ItemListSchema items={articleListData} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/10 rounded-full blur-[120px] opacity-50" />
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-semibold uppercase tracking-wider mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                <span>War Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                WW3 News & Analysis
              </h1>
              
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                Breaking analysis of the US-Iran conflict. Verified intelligence, military breakdowns, and what it means for global security.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/[0.07] transition-all"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-red-500 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Featured Article */}
          {featuredPost && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-12"
            >
              <Link to={`/blog/${featuredPost.slug}`} className="group block">
                <div className="relative bg-gradient-to-br from-[#14141c] to-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <img 
                        src={featuredPost.image} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent lg:bg-gradient-to-r" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${categoryStyles[featuredPost.category] || categoryStyles['Analysis']}`}>
                          {(() => {
                            const Icon = categoryIcons[featuredPost.category] || Globe;
                            return <Icon className="w-3.5 h-3.5" />;
                          })()}
                          {featuredPost.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="text-red-400 font-medium">Featured</span>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime} read</span>
                      </div>
                      
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-2 text-red-400 font-medium group-hover:gap-3 transition-all">
                        <span>Read analysis</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Article Grid */}
          {otherPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Latest Analysis</h2>
                <span className="text-sm text-gray-500">{otherPosts.length} articles</span>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/blog/${post.slug}`} className="group block h-full">
                      <div className="h-full bg-gradient-to-b from-[#14141c] to-[#0f0f14] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300">
                        {/* Image */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] to-transparent opacity-60" />
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryStyles[post.category] || categoryStyles['Analysis']}`}>
                              {(() => {
                                const Icon = categoryIcons[post.category] || Globe;
                                return <Icon className="w-3 h-3" />;
                              })()}
                              {post.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readTime}</span>
                          </div>
                          
                          <h3 className="font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-2 leading-snug">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center gap-1 text-red-400 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Read more</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          )}

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          )}

          {/* FAQ Section */}
          <AIFriendlyFAQ />
        </div>
      </div>
    </>
  );
}

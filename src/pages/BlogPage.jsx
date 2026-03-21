import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, Search, BookOpen, Menu, X, AlertCircle } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { FAQSchema, ItemListSchema, BreadcrumbSchema } from '../components/StructuredData';

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

// AI-Optimized FAQ Section with Question-Format H2s
const AIFriendlyFAQ = () => {
  const faqs = [
    {
      question: "How many casualties in the US-Iran war?",
      answer: "The US-Iran war has resulted in significant casualties on both sides. Confirmed losses include Iranian military personnel from Israeli strikes in Tehran and Bandar Abbas, US casualties from Iranian missile attacks on bases in the region, and civilian casualties in cities including Tel Aviv, Beirut, and Baghdad. Exact numbers are updated in real-time as verification comes in."
    },
    {
      question: "What weapons is Iran using against Israel and the US?",
      answer: "Iran has deployed a range of weapons including ballistic missiles (Shahab and Emad series), cruise missiles, and drone swarms (Shahed-136 and Shahed-131). These have been used to target Israeli cities including Tel Aviv, US military installations across the Middle East, and commercial shipping in the Persian Gulf."
    },
    {
      question: "Why did America attack Iran in 2026?",
      answer: "The direct US involvement followed Israeli precision strikes on senior Iranian leadership in Tehran on March 17, 2026. The US joined the conflict after Iran retaliated with missile strikes against both Israeli and American targets. The broader context involves decades of tension over Iran's nuclear program and regional influence."
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
      answer: "While the conflict represents one of the most serious Middle East escalations in decades, WW3 would require direct involvement of multiple major powers (Russia, China, NATO). Currently, the conflict remains regional with proxy involvement. However, the risk of escalation continues as long as hostilities persist."
    }
  ];

  return (
    <section className="mt-16 pt-12 border-t border-white/10">
      <div className="flex items-center gap-2 mb-8">
        <AlertCircle className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Common Questions About the US-Iran War
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-[#14141c] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors ai-citation"
          >
            <h3 className="text-lg font-semibold text-white mb-3">
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

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      {/* Enhanced SEO for Blog Page - Optimized for US-Iran War queries */}
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

      <div className="min-h-screen bg-[#0d0d12] text-white">
        <BlogHeader />

        {/* Hero - Enhanced for SEO */}
        <div className="border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4 text-red-400 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                <span>US-Iran War Analysis</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                WW3 News & Analysis
              </h1>
              <p className="text-gray-400 text-lg">
                Breaking analysis of the US-Iran conflict. F-35 shot down, Strait of Hormuz at risk, and what it means for global security.
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
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Featured Analysis</span>
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
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Latest Analysis</h2>
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

          {/* AI-Friendly FAQ Section for SEO */}
          <AIFriendlyFAQ />
        </div>
      </div>
    </>
  );
}

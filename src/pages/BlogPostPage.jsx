import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, ArrowLeft, Calendar, Twitter, Facebook, 
  BookOpen, ChevronUp, ThumbsUp, ThumbsDown,
  Share2, Link2, Check
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '../data/blogPosts';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import QuickFacts from '../components/Blog/QuickFacts';
import Timeline from '../components/Blog/Timeline';
import KeyTakeaway from '../components/Blog/KeyTakeaway';
import ComparisonTable from '../components/Blog/ComparisonTable';
import QuoteBlock from '../components/Blog/QuoteBlock';
import FAQ from '../components/Blog/FAQ';
import NewsletterSignup from '../components/Blog/NewsletterSignup';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const [activeSection, setActiveSection] = useState('');
  const [helpful, setHelpful] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!post?.sections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    post.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 2);

  // Custom markdown components for styling
  const markdownComponents = {
    h2: ({ children }) => (
      <h2 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} 
          className="text-2xl md:text-3xl font-bold text-white mt-16 mb-6 pb-2 border-b border-zinc-800">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-4">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-zinc-400 leading-relaxed mb-6 text-base md:text-lg">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-zinc-400">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-400">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-zinc-400 leading-relaxed ml-4">
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="text-zinc-200 font-semibold">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="text-zinc-300 italic">
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-500/50 bg-red-500/5 pl-6 pr-4 py-4 my-6 rounded-r-lg">
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className="border-zinc-800 my-8" />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-900">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="text-left px-4 py-3 text-zinc-300 font-semibold border-b border-zinc-700">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-zinc-400 border-b border-zinc-800">
        {children}
      </td>
    ),
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | WW3 Tracker Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <ReadingProgress post={post} readingTime={post.readTime} />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Navigation Bar */}
        <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/blog" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-sm hidden sm:inline">{post.category}</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ww3tracker.live/blog/${post.slug}`)}`, '_blank')}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ww3tracker.live/blog/${post.slug}`)}`, '_blank')}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-[280px_1fr_200px] gap-8">
            
            {/* Left Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                {post.sections && <TableOfContents sections={post.sections} activeSection={activeSection} />}
              </div>
            </aside>

            {/* Main Content */}
            <article ref={contentRef} className="min-w-0">
              {/* Header */}
              <motion.header 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-8"
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                  <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                  <span>/</span>
                  <span className="text-zinc-300">{post.category}</span>
                </div>

                {/* Category & Read Time */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 text-sm font-medium rounded-full border border-red-500/20">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-500 text-sm">
                    <Clock className="w-4 h-4" />
                    {post.readTime} read
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-lg md:text-xl text-zinc-400 mb-6">{post.excerpt}</p>

                {/* Author & Meta */}
                <div className="flex items-center gap-4 py-6 border-y border-zinc-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold">
                    {post.author?.name?.charAt(0) || 'W'}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{post.author?.name || 'WW3 Tracker Team'}</p>
                    <p className="text-sm text-zinc-500">{post.author?.role || 'Analysis Team'}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                </div>
              </motion.header>

              {/* Featured Image */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.1 }} 
                className="mb-10"
              >
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              </motion.div>

              {/* Quick Facts */}
              {post.quickFacts && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-10"
                >
                  <QuickFacts facts={post.quickFacts} />
                </motion.div>
              )}

              {/* Main Content with Markdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-invert prose-lg max-w-none"
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </motion.div>

              {/* Timeline */}
              {post.timeline && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <Timeline events={post.timeline} />
                </motion.div>
              )}

              {/* Comparison Table */}
              {post.comparisonData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <ComparisonTable 
                    title="Military Comparison"
                    subtitle="Head-to-head breakdown of capabilities"
                    data={post.comparisonData}
                  />
                </motion.div>
              )}

              {/* Quotes */}
              {post.quotes?.map((quote, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <QuoteBlock {...quote} />
                </motion.div>
              ))}

              {/* Key Takeaway */}
              {post.keyTakeaway && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <KeyTakeaway {...post.keyTakeaway} />
                </motion.div>
              )}

              {/* FAQ */}
              {post.faq && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <FAQ questions={post.faq} />
                </motion.div>
              )}

              {/* Was this helpful? */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Was this article helpful?</h3>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setHelpful('yes')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      helpful === 'yes' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Yes
                  </button>
                  <button
                    onClick={() => setHelpful('no')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      helpful === 'no' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    No
                  </button>
                </div>
                {helpful && (
                  <p className="text-zinc-500 mt-4 text-sm">Thanks for your feedback!</p>
                )}
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16"
              >
                <NewsletterSignup variant="card" />
              </motion.div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16"
                >
                  <h3 className="text-xl font-semibold text-white mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {relatedPosts.map(relatedPost => (
                      <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                        <div className="flex gap-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all">
                          <img src={relatedPost.image} alt={relatedPost.title} className="w-24 h-24 object-cover rounded-lg" />
                          <div>
                            <span className="text-red-400 text-xs font-medium">{relatedPost.category}</span>
                            <h4 className="text-white font-medium group-hover:text-red-400 transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h4>
                            <span className="text-zinc-500 text-xs">{relatedPost.readTime} read</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </article>

            {/* Right Sidebar - Reading Stats & Share */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Reading Progress Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Reading Progress</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center">
                      <span className="text-xs text-zinc-400">0%</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-300">{post.readTime}</p>
                      <p className="text-xs text-zinc-500">Estimated time</p>
                    </div>
                  </div>
                </div>

                {/* Share Card */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Share</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ww3tracker.live/blog/${post.slug}`)}`, '_blank')}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all text-sm"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </button>
                    <button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ww3tracker.live/blog/${post.slug}`)}`, '_blank')}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all text-sm"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://ww3tracker.live/blog/${post.slug}`);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all text-sm"
                    >
                      <Link2 className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Back to Top */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition-all border border-zinc-700"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      </div>
    </>
  );
};

export default BlogPostPage;

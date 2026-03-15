import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, ArrowLeft, Twitter, Facebook, Calendar,
  ChevronUp, ThumbsUp, ThumbsDown, Lightbulb, AlertCircle,
  Target, History, Scale
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '../data/blogPosts';
import SEO from '../components/SEO';
import { ArticleSchema, FAQSchema, BreadcrumbSchema } from '../components/StructuredData';

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

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  // Simple markdown components
  const markdownComponents = {
    h2: ({ children }) => (
      <h2 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} 
          className="text-2xl md:text-3xl font-bold text-white mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-zinc-200 mt-8 mb-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-zinc-400 leading-relaxed mb-4 text-base">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-400">
        {children}
      </ul>
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
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-red-500/50 bg-red-500/5 pl-4 pr-4 py-3 my-4 rounded-r">
        {children}
      </blockquote>
    ),
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        pathname={`/blog/${post.slug}`}
        ogImage={post.image}
        article={true}
        publishedTime={new Date(post.date).toISOString()}
      />
      
      <ArticleSchema post={post} />
      {post.faq && <FAQSchema faqs={post.faq} />}
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="min-h-screen bg-zinc-950 text-white">
        {/* Navigation */}
        <div className="sticky top-0 z-40 bg-zinc-950/95 border-b border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/blog" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <span className="text-zinc-500 text-sm hidden sm:block">{post.category}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
              <span className="text-red-400 font-medium">{post.category}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{post.readTime} read</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-zinc-400 mb-6">{post.excerpt}</p>
            
            <div className="flex items-center gap-3 text-sm text-zinc-500 pb-6 border-b border-zinc-800">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
          </header>

          {/* Key Takeaways Box - For beginners */}
          {post.keyTakeaway && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h2 className="font-bold text-white">Key Takeaways</h2>
              </div>
              <ul className="space-y-2">
                {post.keyTakeaway.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Facts - Visual cards */}
          {post.quickFacts && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {post.quickFacts.map((fact, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">{fact.value}</div>
                  <div className="text-xs text-zinc-500">{fact.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-8">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Article Content */}
          <article ref={contentRef} className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {post.content}
            </ReactMarkdown>
          </article>

          {/* Timeline - If available */}
          {post.timeline && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-red-400" />
                Timeline of Events
              </h2>
              <div className="space-y-4">
                {post.timeline.slice(0, 6).map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      {i < post.timeline.length - 1 && <div className="w-px h-full bg-zinc-800 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <span className="text-red-400 font-bold">{event.year}</span>
                      <h3 className="text-white font-semibold mt-1">{event.title}</h3>
                      <p className="text-zinc-400 text-sm mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {post.faq && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-blue-400" />
                Common Questions
              </h2>
              <div className="space-y-4">
                {post.faq.slice(0, 4).map((item, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                    <p className="text-zinc-400 text-sm">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Was this helpful? */}
          <div className="mt-12 p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <h3 className="font-semibold text-white mb-4">Was this article helpful?</h3>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setHelpful('yes')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                  helpful === 'yes' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                Yes
              </button>
              <button
                onClick={() => setHelpful('no')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${
                  helpful === 'no' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                No
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-white mb-4">Related Reading</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPosts.map(relatedPost => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group block">
                    <div className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-red-400 text-xs">{relatedPost.category}</span>
                        <h4 className="text-white text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg border border-zinc-700"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default BlogPostPage;

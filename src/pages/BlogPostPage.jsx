import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, ArrowLeft, Twitter, Facebook, Calendar,
  ChevronUp, ThumbsUp, ThumbsDown, Lightbulb, AlertCircle,
  Target, History, Scale, Share2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '../data/blogPosts';
import { BlogSEO } from '../components/SEO';
import { ArticleSchema, FAQSchema, BreadcrumbSchema, SpeakableSchema, NewsMediaOrganizationSchema } from '../components/StructuredData';

// Category color mapping
const categoryColors = {
  military: { border: '#c41c1c', text: '#c41c1c' },
  economic: { border: '#0d9488', text: '#14b8a6' },
  political: { border: '#475569', text: '#64748b' },
  nuclear: { border: '#7c3aed', text: '#8b5cf6' },
  analysis: { border: '#0369a1', text: '#38bdf8' },
  default: { border: '#c41c1c', text: '#c41c1c' }
};

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
    { name: "WW3 News", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  // Generate keywords from tags and category
  const keywords = [
    ...(post.tags || []),
    post.category,
    "US-Iran war",
    "WW3",
    "World War 3",
    "Iran conflict"
  ].join(", ");

  // Get category colors
  const catKey = post.category?.toLowerCase() || 'default';
  const catColor = categoryColors[catKey] || categoryColors.default;

  // Enhanced markdown components with editorial styling
  const markdownComponents = {
    h2: ({ children }) => (
      <h2 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} 
          className="editorial-h2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="editorial-h3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="editorial-paragraph">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="editorial-list">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="editorial-list-ordered">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="editorial-list-item">
        {children}
      </li>
    ),
    strong: ({ children }) => (
      <strong className="editorial-bold">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="editorial-italic">
        {children}
      </em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pull-quote">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} className="editorial-link">
        {children}
      </a>
    ),
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <>
      {/* Enhanced SEO with Blog-specific settings */}
      <BlogSEO
        title={post.title}
        description={post.excerpt}
        pathname={`/blog/${post.slug}`}
        image={post.image}
        publishedTime={new Date(post.date).toISOString()}
        modifiedTime={new Date(post.date).toISOString()}
        tags={post.tags}
        category={post.category}
        author={post.author?.name || "WW3 Tracker"}
      />
      
      <Helmet>
        <link rel="canonical" href={`https://ww3tracker.live/blog/${post.slug}`} />
        <meta name="keywords" content={keywords} />
        
        {/* Article-specific meta */}
        <meta property="article:section" content={post.category} />
        {post.tags?.map(tag => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
      </Helmet>

      {/* Structured Data */}
      <ArticleSchema post={post} />
      {post.faq && <FAQSchema faqs={post.faq} />}
      <BreadcrumbSchema items={breadcrumbItems} />
      <SpeakableSchema cssSelectors={["h1", "h2", "h3", ".key-takeaway", ".ai-citation"]} />
      <NewsMediaOrganizationSchema />

      <div className="min-h-screen bg-editorial text-editorial-body">
        {/* Navigation - Full Width */}
        <nav className="editorial-nav">
          <div className="editorial-nav-inner">
            <Link to="/blog" className="editorial-nav-back">
              <ArrowLeft className="w-4 h-4" />
              Back to WW3 News
            </Link>
            <div className="flex items-center gap-3">
              <span className="editorial-category-pill" style={{ 
                borderColor: catColor.border, 
                color: catColor.text 
              }}>
                {post.category}
              </span>
              <button 
                onClick={handleShare}
                className="editorial-share-btn"
                aria-label="Share article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section - Full Width with Title Overlay */}
        <header className="editorial-hero">
          <div className="editorial-hero-image-container">
            <img 
              src={post.image} 
              alt={post.title}
              className="editorial-hero-image"
              loading="eager"
            />
            <div className="editorial-hero-gradient" />
          </div>
          <div className="editorial-hero-content">
            <div className="editorial-hero-inner">
              <div className="editorial-hero-meta">
                <span className="editorial-kicker">{post.category}</span>
                <span className="editorial-meta-divider">|</span>
                <span className="editorial-read-time">
                  <Clock className="w-3 h-3" />
                  {post.readTime} read
                </span>
              </div>
              <h1 className="editorial-hero-title">
                {post.title}
              </h1>
              <p className="editorial-hero-excerpt">
                {post.excerpt}
              </p>
              <div className="editorial-hero-date">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Constrained Width */}
        <main className="editorial-main">
          <div className="editorial-content-wrapper">
            
            {/* Key Takeaways Box */}
            {post.keyTakeaway && (
              <div className="editorial-takeaways">
                <div className="editorial-takeaways-label">Key Takeaways</div>
                <ul className="editorial-takeaways-list">
                  {post.keyTakeaway.points.map((point, i) => (
                    <li key={i} className="editorial-takeaways-item">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Facts - Visual cards */}
            {post.quickFacts && (
              <div className="editorial-quick-facts">
                {post.quickFacts.map((fact, i) => (
                  <div key={i} className="editorial-fact-card">
                    <div className="editorial-fact-value">{fact.value}</div>
                    <div className="editorial-fact-label">{fact.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Article Body */}
            <article ref={contentRef} className="editorial-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Timeline - If available */}
            {post.timeline && (
              <section className="editorial-timeline-section">
                <h2 className="editorial-section-title">
                  <History className="w-5 h-5" />
                  Timeline of Events
                </h2>
                <div className="editorial-timeline">
                  {post.timeline.slice(0, 6).map((event, i) => (
                    <div key={i} className="editorial-timeline-item">
                      <div className="editorial-timeline-date">{event.year}</div>
                      <div className="editorial-timeline-content">
                        <h3 className="editorial-timeline-title">{event.title}</h3>
                        <p className="editorial-timeline-desc">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQ - Enhanced for AI citations */}
            {post.faq && (
              <section className="editorial-faq-section">
                <h2 className="editorial-section-title">
                  <AlertCircle className="w-5 h-5" />
                  Common Questions
                </h2>
                <div className="editorial-faq-list">
                  {post.faq.slice(0, 4).map((item, i) => (
                    <div key={i} className="editorial-faq-item">
                      <h3 className="editorial-faq-question">{item.question}</h3>
                      <p className="editorial-faq-answer">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Was this helpful? */}
            <div className="editorial-feedback">
              <h3 className="editorial-feedback-title">Was this article helpful?</h3>
              <div className="editorial-feedback-buttons">
                <button
                  onClick={() => setHelpful('yes')}
                  className={`editorial-feedback-btn ${helpful === 'yes' ? 'active-yes' : ''}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Yes
                </button>
                <button
                  onClick={() => setHelpful('no')}
                  className={`editorial-feedback-btn ${helpful === 'no' ? 'active-no' : ''}`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  No
                </button>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="editorial-related">
                <h3 className="editorial-related-title">Related Reading</h3>
                <div className="editorial-related-grid">
                  {relatedPosts.map(relatedPost => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="editorial-related-card">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title}
                        className="editorial-related-image"
                        loading="lazy"
                      />
                      <div className="editorial-related-content">
                        <span className="editorial-related-category">{relatedPost.category}</span>
                        <h4 className="editorial-related-card-title">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="editorial-footer">
          <div className="editorial-footer-inner">
            <p>WW3 Tracker — Live US-Iran War Monitor</p>
            <p className="editorial-footer-copy">
              © 2026 WW3 Tracker. Data aggregated from verified sources.
            </p>
          </div>
        </footer>

        {/* Back to Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="editorial-back-to-top"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

export default BlogPostPage;

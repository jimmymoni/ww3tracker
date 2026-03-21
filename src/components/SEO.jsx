import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Comprehensive meta tag management
 * Usage: <SEO title="..." description="..." pathname="/blog/post-slug" />
 * 
 * SEO Best Practices Implemented:
 * - Title: 50-60 characters optimal
 * - Description: 150-160 characters optimal
 * - OG images: 1200x630px for optimal social sharing
 * - Canonical URLs prevent duplicate content issues
 * - Article schema for blog posts, Website for pages
 */

// Default OG image for pages without specific images
export const DEFAULT_OG_IMAGE = '/og-image.png';

// OG images for specific page types
export const OG_IMAGES = {
  blog: '/og-image-blog.png',
  map: '/og-image-map.png',
  conflict: '/og-image-conflict.png',
  default: '/og-image.png'
};

export const SEO = ({ 
  title, 
  description, 
  pathname = '', 
  ogImage = DEFAULT_OG_IMAGE,
  article = false,
  publishedTime,
  modifiedTime,
  tags = [],
  author = 'WW3 Tracker',
  noindex = false,
  type = 'website' // 'website' | 'article' | 'news'
}) => {
  const siteUrl = 'https://ww3tracker.live';
  const siteName = 'WW3 Tracker';
  const twitterHandle = '@ww3tracker';
  const url = `${siteUrl}${pathname}`;
  
  // Ensure OG image has full URL
  const image = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Truncate description to optimal length (150-160 chars)
  const truncatedDescription = description?.length > 160 
    ? description.substring(0, 157) + '...' 
    : description || 'Real-time tracking of the US-Iran conflict. Interactive map of every strike, verified news, and military analysis.';
  
  // Build title with site name (keep under 60 chars)
  const fullTitle = title?.includes(siteName) ? title : `${title} | ${siteName}`;
  const truncatedTitle = fullTitle?.length > 60 
    ? fullTitle.substring(0, 57) + '...' 
    : fullTitle;

  // Determine OG type based on content
  const ogType = article ? 'article' : type === 'news' ? 'news' : 'website';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <link rel="canonical" href={url} />
      
      {/* Robots - Enhanced directives for better indexing */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Google-specific robots */}
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Bing robots */}
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      
      {/* Article Specific Meta */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && (
        <meta property="article:author" content={author} />
      )}
      {article && tags.map(tag => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}
      
      {/* News-specific meta */}
      {type === 'news' && (
        <>
          <meta property="og:updated_time" content={modifiedTime || publishedTime} />
          <meta name="news_keywords" content={tags.join(', ')} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO Meta */}
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Mobile-specific */}
      <meta name="theme-color" content="#0d0d12" />
      <meta name="msapplication-TileColor" content="#0d0d12" />
    </Helmet>
  );
};

/**
 * BlogSEO - Specialized SEO component for blog posts
 * Pre-configured with article-specific meta tags
 */
export const BlogSEO = ({
  title,
  description,
  pathname,
  image,
  publishedTime,
  modifiedTime,
  tags = [],
  category = 'Analysis',
  author = 'WW3 Tracker'
}) => (
  <SEO
    title={title}
    description={description}
    pathname={pathname}
    ogImage={image || OG_IMAGES.blog}
    article={true}
    publishedTime={publishedTime}
    modifiedTime={modifiedTime}
    tags={tags}
    author={author}
  />
);

/**
 * NewsSEO - Specialized SEO component for breaking news
 * Includes news-specific meta tags and structured data hints
 */
export const NewsSEO = ({
  title,
  description,
  pathname,
  image,
  publishedTime,
  tags = []
}) => (
  <SEO
    title={title}
    description={description}
    pathname={pathname}
    ogImage={image || OG_IMAGES.conflict}
    article={true}
    type="news"
    publishedTime={publishedTime}
    modifiedTime={publishedTime}
    tags={tags}
  />
);

/**
 * PageSEO - Standard SEO for regular pages
 */
export const PageSEO = ({
  title,
  description,
  pathname,
  ogImage: customOgImage,
  noindex = false
}) => (
  <SEO
    title={title}
    description={description}
    pathname={pathname}
    ogImage={customOgImage || OG_IMAGES.default}
    noindex={noindex}
  />
);

export default SEO;

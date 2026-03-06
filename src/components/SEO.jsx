import { Helmet } from 'react-helmet-async';

/**
 * SEO Component - Comprehensive meta tag management
 * Usage: <SEO title="..." description="..." pathname="/blog/post-slug" />
 */
export const SEO = ({ 
  title, 
  description, 
  pathname = '', 
  ogImage = '/og-image.png',
  article = false,
  publishedTime,
  modifiedTime,
  tags = [],
  author = 'WW3 Tracker',
  noindex = false
}) => {
  const siteUrl = 'https://ww3tracker.live';
  const siteName = 'WW3 Tracker';
  const twitterHandle = '@ww3tracker';
  const url = `${siteUrl}${pathname}`;
  const image = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;
  
  // Truncate description to optimal length
  const truncatedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;
  
  // Truncate title to optimal length
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const truncatedTitle = fullTitle.length > 60 
    ? fullTitle.substring(0, 57) + '...' 
    : fullTitle;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDescription} />
      <link rel="canonical" href={url} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
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
      
      {article ? (
        <meta property="og:type" content="article" />
      ) : (
        <meta property="og:type" content="website" />
      )}
      
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
    </Helmet>
  );
};

export default SEO;

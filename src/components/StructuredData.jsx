import React from 'react';

const SITE_URL = 'https://ww3tracker.live';
const SITE_NAME = 'WW3 Tracker';
const LOGO_URL = `${SITE_URL}/favicon.svg`;
const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

/**
 * Article Schema - For blog posts and news articles
 * Enhanced with NewsArticle type for better Google News visibility
 */
const ArticleSchema = ({ post }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image?.startsWith('http') 
      ? post.image 
      : `${SITE_URL}${post.image}`,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author?.name || SITE_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": OG_IMAGE_URL,
        "width": 1200,
        "height": 630
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`
    },
    "url": `${SITE_URL}/blog/${post.slug}`,
    "articleSection": post.category,
    "keywords": post.tags?.join(', ') || "US Iran conflict, WW3, World War 3",
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * FAQ Schema - For FAQ sections (triggers rich snippets)
 * Essential for AI citation optimization - ChatGPT, Perplexity, etc.
 */
const FAQSchema = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * Breadcrumb Schema - For navigation breadcrumbs
 * Helps Google show breadcrumb navigation in search results
 */
const BreadcrumbSchema = ({ items }) => {
  // items = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, ...]
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * WebSite Schema - For homepage
 * Includes SearchAction for Google sitelinks search box
 */
const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": "WW3 Tracker - Live US-Iran War Monitor",
    "url": SITE_URL,
    "description": "Real-time tracking of the US-Iran conflict. Interactive map of every strike, verified news, and military analysis.",

    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": OG_IMAGE_URL,
        "width": 1200,
        "height": 630
      }
    },
    "inLanguage": "en-US"
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * Organization Schema - Enhanced for Google Knowledge Panel
 * Critical for brand recognition and entity SEO
 */
const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "alternateName": "WW3 Tracker - Live Conflict Monitor",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/favicon-48x48.png`,
      "width": 48,
      "height": 48
    },
    "image": {
      "@type": "ImageObject",
      "url": OG_IMAGE_URL,
      "width": 1200,
      "height": 630
    },
    "sameAs": [
      "https://twitter.com/ww3tracker"
    ],
    "description": "Real-time tracking of the US-Iran conflict with interactive maps, verified news, and military analysis.",
    "foundingDate": "2025",
    "areaServed": {
      "@type": "Place",
      "name": "Global"
    },
    "knowsAbout": [
      "US-Iran Conflict",
      "Military Analysis",
      "Geopolitics",
      "World War 3",
      "Middle East Relations"
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * NewsMediaOrganization Schema - For news credibility
 * Helps establish the site as a news source
 */
const NewsMediaOrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": OG_IMAGE_URL,
      "width": 1200,
      "height": 630
    },
    "sameAs": [
      "https://twitter.com/ww3tracker"
    ],
    "ethicsPolicy": `${SITE_URL}/about`,
    "missionCoveragePrioritiesPolicy": "Track and analyze the US-Iran conflict with verified data from satellite imagery and confirmed military sources.",
    "diversityPolicy": "We aggregate data from multiple international sources to ensure balanced coverage.",
    "correctionsPolicy": `${SITE_URL}/about`,
    "verificationFactCheckingPolicy": "All attacks are verified through multiple independent sources before publication."
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * HowTo Schema - For instructional/military comparison content
 * Triggers rich "How To" snippets in search results
 */
const HowToSchema = ({ title, description, steps, totalTime }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "description": description,
    "totalTime": totalTime,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "url": step.url
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * ClaimReview Schema - For fact-checking content
 * Shows "Fact Check" rich results in Google
 */
const ClaimReviewSchema = ({ claim, reviewRating, author = SITE_NAME }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "datePublished": new Date().toISOString(),
    "url": SITE_URL,
    "claimReviewed": claim,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": reviewRating.value,
      "bestRating": reviewRating.best || "100",
      "worstRating": reviewRating.worst || "0",
      "alternateName": reviewRating.label
    },
    "author": {
      "@type": "Organization",
      "name": author
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * Speakable Schema - For voice search optimization (AEO)
 * Identifies content sections optimized for voice assistants
 * Critical for "Hey Google" and Alexa answers
 */
const SpeakableSchema = ({ cssSelectors = [".article-summary", ".key-takeaway", ".faq-answer", "h2", ".ai-citation"] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * VideoObject Schema - For video content
 */
const VideoObjectSchema = ({ 
  name, 
  description, 
  thumbnailUrl, 
  uploadDate, 
  duration,
  contentUrl,
  embedUrl 
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "duration": duration,
    ...(contentUrl && { "contentUrl": contentUrl }),
    ...(embedUrl && { "embedUrl": embedUrl }),
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL,
        "width": 512,
        "height": 512
      }
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * Event Schema - For timeline/conflict events
 */
const EventSchema = ({ name, startDate, endDate, location, description }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "startDate": startDate,
    ...(endDate && { "endDate": endDate }),
    "location": {
      "@type": "Place",
      "name": location || "Middle East",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": location || "IR"
      }
    },
    "description": description,
    "organizer": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * ItemList Schema - For list-based content (news feeds, rankings)
 * Triggers "Top Stories" style rich results
 */
const ItemListSchema = ({ items, itemType = "ListItem" }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => ({
      "@type": itemType,
      "position": index + 1,
      "name": item.name || item.title,
      "description": item.description,
      "url": item.url ? `${SITE_URL}${item.url}` : undefined
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * Person Schema - For author/entity pages
 */
const PersonSchema = ({ name, description, jobTitle, sameAs = [] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "description": description,
    "jobTitle": jobTitle,
    "sameAs": sameAs
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * WebPage Schema - Generic page schema
 */
const WebPageSchema = ({ title, description, url, lastReviewed }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url || SITE_URL,
    "lastReviewed": lastReviewed || new Date().toISOString(),
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL
    }
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export {
  ArticleSchema,
  FAQSchema,
  BreadcrumbSchema,
  WebsiteSchema,
  OrganizationSchema,
  NewsMediaOrganizationSchema,
  HowToSchema,
  ClaimReviewSchema,
  SpeakableSchema,
  VideoObjectSchema,
  EventSchema,
  ItemListSchema,
  PersonSchema,
  WebPageSchema
};

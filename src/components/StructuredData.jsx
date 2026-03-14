import React from 'react';

/**
 * Article Schema - For blog posts and news articles
 */
export const ArticleSchema = ({ post }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image?.startsWith('http') 
      ? post.image 
      : `https://ww3tracker.live${post.image}`,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author?.name || "WW3 Tracker",
      "url": "https://ww3tracker.live"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WW3 Tracker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ww3tracker.live/favicon.svg",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ww3tracker.live/blog/${post.slug}`
    },
    "url": `https://ww3tracker.live/blog/${post.slug}`,
    "articleSection": post.category,
    "keywords": post.tags?.join(', ') || "US Iran conflict, WW3, World War 3"
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * FAQ Schema - For FAQ sections (triggers rich snippets)
 */
export const FAQSchema = ({ faqs }) => {
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
 */
export const BreadcrumbSchema = ({ items }) => {
  // items = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, ...]
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://ww3tracker.live${item.url}`
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
 */
export const WebsiteSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "WW3 Tracker",
    "url": "https://ww3tracker.live",
    "description": "Live US-Iran conflict tracker with real-time data, prediction markets, satellite intelligence, and breaking news.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ww3tracker.live/blog?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "WW3 Tracker",
      "url": "https://ww3tracker.live",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ww3tracker.live/favicon.svg",
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
 * Organization Schema - For about/brand pages
 */
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "WW3 Tracker",
    "alternateName": "WW3 Tracker - Live Conflict Monitor",
    "url": "https://ww3tracker.live",
    "logo": "https://ww3tracker.live/favicon.svg",
    "sameAs": [
      "https://twitter.com/ww3tracker"
    ],
    "description": "Live US-Iran conflict tracker with real-time data, prediction markets, satellite intelligence, and breaking news."
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

/**
 * HowTo Schema - For instructional/military comparison content
 */
export const HowToSchema = ({ title, description, steps, totalTime }) => {
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
 */
export const ClaimReviewSchema = ({ claim, reviewRating, author = "WW3 Tracker" }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    "datePublished": new Date().toISOString(),
    "url": "https://ww3tracker.live",
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
 */
export const SpeakableSchema = ({ cssSelectors = [".article-summary", ".key-takeaway", ".faq-answer"] }) => {
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
export const VideoObjectSchema = ({ 
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
      "name": "WW3 Tracker",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ww3tracker.live/favicon.svg",
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
export const EventSchema = ({ name, startDate, endDate, location, description }) => {
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
      "name": "WW3 Tracker",
      "url": "https://ww3tracker.live"
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
 */
export const ItemListSchema = ({ items, itemType = "ListItem" }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => ({
      "@type": itemType,
      "position": index + 1,
      "name": item.name || item.title,
      "description": item.description,
      "url": item.url ? `https://ww3tracker.live${item.url}` : undefined
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
};

export default {
  ArticleSchema,
  FAQSchema,
  BreadcrumbSchema,
  WebsiteSchema,
  OrganizationSchema,
  HowToSchema,
  ClaimReviewSchema,
  SpeakableSchema,
  VideoObjectSchema,
  EventSchema,
  ItemListSchema
};

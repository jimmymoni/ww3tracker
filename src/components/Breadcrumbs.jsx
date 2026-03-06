import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs Component - SEO-friendly navigation with Schema.org markup
 * 
 * Usage:
 * <Breadcrumbs items={[
 *   { name: "Home", url: "/" },
 *   { name: "Blog", url: "/blog" },
 *   { name: "Article Title", url: "/blog/slug" }
 * ]} />
 */
const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Generate Schema.org structured data
  const breadcrumbSchema = {
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
    <>
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
        <ol 
          className="flex flex-wrap items-center gap-2 text-sm text-zinc-500"
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li 
                key={index}
                className="flex items-center gap-2"
                itemProp="itemListElement" 
                itemScope 
                itemType="https://schema.org/ListItem"
              >
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                )}
                
                {isLast ? (
                  // Current page (not a link)
                  <span 
                    className="text-zinc-300 font-medium"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  // Parent pages (links)
                  <Link
                    to={item.url}
                    className="hover:text-white transition-colors flex items-center gap-1"
                    itemProp="item"
                  >
                    {index === 0 && <Home className="w-3.5 h-3.5" />}
                    <span itemProp="name">{item.name}</span>
                  </Link>
                )}
                
                <meta itemProp="position" content={index + 1} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

/**
 * Helper function to generate breadcrumbs for common page types
 */
export const generateBreadcrumbs = {
  // Home page
  home: () => [
    { name: "Home", url: "/" }
  ],
  
  // Blog listing page
  blog: () => [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" }
  ],
  
  // Individual blog post
  blogPost: (post) => [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` }
  ],
  
  // Landing pages
  landing: (pageName, pageUrl) => [
    { name: "Home", url: "/" },
    { name: pageName, url: pageUrl }
  ],
  
  // WW3 Probability page
  ww3Probability: () => [
    { name: "Home", url: "/" },
    { name: "WW3 Probability", url: "/ww3-probability" }
  ],
  
  // US Iran War Tracker
  warTracker: () => [
    { name: "Home", url: "/" },
    { name: "US vs Iran War Tracker", url: "/us-iran-war-tracker" }
  ],
  
  // Timeline
  timeline: () => [
    { name: "Home", url: "/" },
    { name: "Timeline", url: "/timeline" }
  ]
};

export default Breadcrumbs;

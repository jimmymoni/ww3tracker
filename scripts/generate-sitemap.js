/**
 * Sitemap Generator
 * Generates sitemap.xml for SEO
 * Updated to match current live routes (March 2026)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read blog posts
const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.js');
const blogPostsContent = fs.readFileSync(blogPostsPath, 'utf-8');

// Extract post data using regex
const postMatches = blogPostsContent.matchAll(/id:\s*["']([^"']+)["'][^}]*date:\s*["']([^"']+)["']/gs);
const posts = [];
for (const match of postMatches) {
  posts.push({ id: match[1], date: match[2] });
}

const baseUrl = process.env.SITE_URL || 'https://ww3tracker.live';
const today = new Date().toISOString().split('T')[0];

// UPDATED: Removed deleted routes (/live-updates, /losses, /ww3, /ww3-probability, etc.)
// Added current live routes (/live-map, /attacks, /iran-us-conflict, etc.)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${baseUrl}/og-image.png</image:loc>
      <image:title>WW3 Tracker - Live US-Iran War Map</image:title>
    </image:image>
  </url>
  
  <!-- Core Feature Pages -->
  <url>
    <loc>${baseUrl}/live-map</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/attacks</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.90</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/timeline</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/nuke</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>
  
  <!-- SEO Landing Pages -->
  <url>
    <loc>${baseUrl}/is-ww3-happening</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/world-war-3-news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/iran-nuclear-deal</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.90</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/iran-us-conflict</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/israel-hezbollah-conflict</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.90</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/pak-afghan-conflict</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.80</priority>
  </url>
  
  <!-- Trust Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  
  <!-- Blog Posts -->
${posts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}
</urlset>`;

// Write to dist folder (production)
const distPath = path.join(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(distPath, sitemap);

// Also write to public folder (source)
const publicPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(publicPath, sitemap);

console.log(`✅ Sitemap generated with ${posts.length + 11} URLs`);
console.log(`   - ${posts.length} blog posts`);
console.log(`   - 11 static pages`);
console.log(`   Output: ${distPath}`);

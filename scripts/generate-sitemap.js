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
      <image:title>WW3 Tracker - Live Conflict Monitor</image:title>
    </image:image>
  </url>
  
  <!-- Core Feature Pages -->
  <url>
    <loc>${baseUrl}/live-updates</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/losses</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/ww3</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/timeline</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  
  <!-- SEO Landing Pages -->
  <url>
    <loc>${baseUrl}/ww3-probability</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/us-iran-war-tracker</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/iran-conflict-live</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  
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
  
  <!-- Viral Quiz Pages -->
  <url>
    <loc>${baseUrl}/ww3-risk-calculator</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/ready</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/share</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
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

const distPath = path.join(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(distPath, sitemap);
console.log(`✅ Sitemap generated with ${posts.length + 14} URLs at ${distPath}`);

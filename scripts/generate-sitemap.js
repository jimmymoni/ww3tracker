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

const baseUrl = process.env.SITE_URL || 'https://usvsiran.com';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/live-updates</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/losses</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/ww3</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  ${posts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <lastmod>${new Date(post.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

const distPath = path.join(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(distPath, sitemap);
console.log(`✅ Sitemap generated with ${posts.length + 4} URLs at ${distPath}`);

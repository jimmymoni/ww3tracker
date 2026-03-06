#!/usr/bin/env node

/**
 * WW3 Tracker - Sitemap Generator
 * 
 * Run this script to automatically generate an updated sitemap.xml
 * based on your blog posts and static pages.
 * 
 * Usage:
 *   node scripts/generate-sitemap.js
 * 
 * This will update public/sitemap.xml with current dates
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SITE_URL = 'https://ww3tracker.live';
const TODAY = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'hourly' },
  { url: '/ww3-probability', priority: '0.9', changefreq: 'hourly' },
  { url: '/us-iran-war-tracker', priority: '0.9', changefreq: 'hourly' },
  { url: '/iran-conflict-live', priority: '0.9', changefreq: 'hourly' },
  { url: '/blog', priority: '0.8', changefreq: 'daily' },
  { url: '/timeline', priority: '0.7', changefreq: 'daily' },
  { url: '/ww3-risk-calculator', priority: '0.9', changefreq: 'weekly' },
];

// Try to import blog posts (if running from project root)
let blogPosts = [];
try {
  const blogData = require('../src/data/blogPosts.js');
  blogPosts = blogData.blogPosts || [];
} catch (e) {
  console.log('⚠️  Could not load blog posts dynamically. Using manual list.');
  // Fallback manual list
  blogPosts = [
    { slug: 'why-america-fighting-iran', date: '2026-03-05', priority: '0.8' },
    { slug: 'us-vs-iran-military', date: '2026-03-04', priority: '0.8' },
    { slug: 'israel-iran-war', date: '2026-03-03', priority: '0.8' },
    { slug: 'iran-nuclear-program', date: '2026-03-02', priority: '0.8' },
    { slug: 'strait-hormuz-oil', date: '2026-03-01', priority: '0.7' },
    { slug: 'what-happens-next', date: '2026-02-28', priority: '0.7' },
  ];
}

// Generate sitemap XML
function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Static Pages -->\n`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
\n`;
  });

  // Add blog posts
  xml += `  <!-- Blog Posts -->\n`;
  blogPosts.forEach(post => {
    const date = post.date || TODAY;
    const priority = post.priority || '0.7';
    const image = post.image ? `
    <image:image>
      <image:loc>${SITE_URL}${post.image.startsWith('/') ? post.image : '/' + post.image}</image:loc>
      <image:title>${escapeXml(post.title || '')}</image:title>
    </image:image>` : '';

    xml += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>${image}
  </url>
\n`;
  });

  xml += `</urlset>`;

  return xml;
}

// Escape XML special characters
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Write sitemap to file
function writeSitemap() {
  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap);
  console.log('✅ Sitemap generated successfully!');
  console.log(`📄 Location: ${outputPath}`);
  console.log(`📊 Total URLs: ${staticPages.length + blogPosts.length}`);
  console.log(`📅 Last Modified: ${TODAY}`);
}

// Main execution
writeSitemap();

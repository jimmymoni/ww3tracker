/**
 * Verify prerendered HTML files have correct meta tags
 * Run this after building to ensure all routes have correct SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Expected meta tags for each route - UPDATED to match current live routes
const expectedMeta = {
  '/': {
    title: 'WW3 Tracker | Live US-Iran War Map',
    description: 'Real-time tracking of the US-Iran conflict',
    canonical: 'https://ww3tracker.live/'
  },
  '/live-map': {
    title: 'Live Conflict Map',
    description: 'Interactive map showing every verified strike',
    canonical: 'https://ww3tracker.live/live-map'
  },
  '/blog': {
    title: 'WW3 Tracker Blog',
    description: 'In-depth analysis of the US vs Iran conflict',
    canonical: 'https://ww3tracker.live/blog'
  },
  '/is-ww3-happening': {
    title: 'Is WW3 Happening Right Now',
    description: 'Is World War 3 happening',
    canonical: 'https://ww3tracker.live/is-ww3-happening'
  },
  '/world-war-3-news': {
    title: 'World War 3 News',
    description: 'Latest World War 3 news and updates',
    canonical: 'https://ww3tracker.live/world-war-3-news'
  },
  '/iran-nuclear-deal': {
    title: 'Iran Nuclear Deal',
    description: 'Complete guide to the Iran nuclear deal',
    canonical: 'https://ww3tracker.live/iran-nuclear-deal'
  },
  '/iran-us-conflict': {
    title: 'Iran vs US Conflict',
    description: 'Live tracking of the Iran-US conflict',
    canonical: 'https://ww3tracker.live/iran-us-conflict'
  },
  '/attacks': {
    title: 'Verified Attacks Database',
    description: 'Complete database of every confirmed military strike',
    canonical: 'https://ww3tracker.live/attacks'
  },
  '/timeline': {
    title: 'US-Iran Conflict Timeline',
    description: 'Complete timeline of US-Iran relations',
    canonical: 'https://ww3tracker.live/timeline'
  },
  // Blog post sample
  '/blog/iran-shot-down-f35': {
    title: 'Iran Just Shot Down an F-35',
    description: '$80 million stealth fighter was supposed to be invisible',
    canonical: 'https://ww3tracker.live/blog/iran-shot-down-f35'
  }
};

// Deleted routes that should NOT exist
const deletedRoutes = [
  '/ww3-risk-calculator',
  '/ww3-probability',
  '/us-iran-war-tracker',
  '/iran-conflict-live',
  '/impact',
  '/ready',
  '/share',
  '/global-risk-monitor'
];

let hasErrors = false;
let hasWarnings = false;

console.log('🔍 Verifying prerendered HTML files...\n');

// Check expected routes
Object.entries(expectedMeta).forEach(([route, expected]) => {
  const filePath = route === '/' 
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route, 'index.html');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing: ${filePath}`);
    hasErrors = true;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const descMatch = content.match(/<meta name="description" content="([^"]*)"/);
  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]*)"/);
  
  const actualTitle = titleMatch ? titleMatch[1] : 'NOT FOUND';
  const actualDesc = descMatch ? descMatch[1] : 'NOT FOUND';
  const actualCanonical = canonicalMatch ? canonicalMatch[1] : 'NOT FOUND';
  
  const titleOk = actualTitle.includes(expected.title) || expected.title.includes(actualTitle.substring(0, 20));
  const descOk = actualDesc.includes(expected.description) || expected.description.includes(actualDesc.substring(0, 30));
  const canonicalOk = actualCanonical === expected.canonical;
  
  if (titleOk && descOk && canonicalOk) {
    console.log(`✅ ${route}`);
    console.log(`   Title: ${actualTitle.substring(0, 60)}...`);
    console.log(`   Canonical: ${actualCanonical}`);
  } else {
    console.error(`❌ ${route}`);
    if (!titleOk) {
      console.error(`   Title MISMATCH:`);
      console.error(`     Expected: ${expected.title}`);
      console.error(`     Actual: ${actualTitle}`);
    }
    if (!descOk) {
      console.error(`   Description MISMATCH:`);
      console.error(`     Expected: ${expected.description}`);
      console.error(`     Actual: ${actualDesc.substring(0, 60)}...`);
    }
    if (!canonicalOk) {
      console.error(`   Canonical MISMATCH:`);
      console.error(`     Expected: ${expected.canonical}`);
      console.error(`     Actual: ${actualCanonical}`);
    }
    hasErrors = true;
  }
  console.log('');
});

// Check that deleted routes don't exist
console.log('🔍 Checking deleted routes are removed...\n');
deletedRoutes.forEach(route => {
  const filePath = route === '/' 
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route, 'index.html');
  
  if (fs.existsSync(filePath)) {
    console.warn(`⚠️  Deleted route still exists: ${route}`);
    console.warn(`   This route should be removed or redirected`);
    hasWarnings = true;
  }
});

console.log('\n📊 Verification Summary:\n');
console.log(`   Routes checked: ${Object.keys(expectedMeta).length}`);
console.log(`   Deleted routes checked: ${deletedRoutes.length}`);

if (hasErrors) {
  console.error('\n❌ Prerender verification FAILED. Please check the errors above.');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  Prerender verification PASSED with warnings.');
  console.warn('   Some deleted routes still exist but may be handled by redirects.');
  process.exit(0);
} else {
  console.log('\n✅ All prerendered files have correct meta tags and canonical URLs!');
  process.exit(0);
}

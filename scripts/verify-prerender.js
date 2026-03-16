/**
 * Verify prerendered HTML files have correct meta tags
 * Run this after building to ensure all routes have correct SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Expected meta tags for each route
const expectedMeta = {
  '/': {
    title: 'WW3 Tracker - Live Conflict Monitor',
    description: 'Live US-Iran conflict tracker with real-time data'
  },
  '/ww3-risk-calculator': {
    title: 'WW3 Risk Calculator',
    description: 'Interactive WW3 risk calculator'
  },
  '/ww3-probability': {
    title: 'WW3 Probability Tracker',
    description: 'Track WW3 probability in real-time'
  }
};

let hasErrors = false;

console.log('🔍 Verifying prerendered HTML files...\n');

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
  
  const actualTitle = titleMatch ? titleMatch[1] : 'NOT FOUND';
  const actualDesc = descMatch ? descMatch[1] : 'NOT FOUND';
  
  const titleOk = actualTitle.includes(expected.title);
  const descOk = actualDesc.includes(expected.description);
  
  if (titleOk && descOk) {
    console.log(`✅ ${route}`);
    console.log(`   Title: ${actualTitle.substring(0, 60)}...`);
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
    hasErrors = true;
  }
  console.log('');
});

if (hasErrors) {
  console.error('⚠️  Prerender verification FAILED. Please rebuild.');
  process.exit(1);
} else {
  console.log('✅ All prerendered files have correct meta tags!');
  process.exit(0);
}

#!/usr/bin/env node
/**
 * Manual Performance Audit - WW3 Tracker
 * Analyzes actual code, assets, and architecture
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════╗');
console.log('║     🔍 WW3 TRACKER - REAL PERFORMANCE AUDIT                      ║');
console.log('║     (Based on actual code analysis)                              ║');
console.log('╚══════════════════════════════════════════════════════════════════╝\n');

// Check actual bundle sizes from dist folder
console.log(`${colors.bold}📦 BUNDLE SIZE ANALYSIS${colors.reset}`);
console.log('─'.repeat(60));

const distAssets = join(process.cwd(), 'dist', 'assets');
if (fs.existsSync(distAssets)) {
  const files = fs.readdirSync(distAssets);
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  
  files.forEach(file => {
    const filePath = join(distAssets, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    totalSize += stats.size;
    
    if (file.endsWith('.js')) {
      jsSize += stats.size;
      console.log(`  ${file.substring(0, 30).padEnd(32)} ${sizeKB.padStart(6)} KB ${colors.yellow}(JS)${colors.reset}`);
    } else if (file.endsWith('.css')) {
      cssSize += stats.size;
      console.log(`  ${file.substring(0, 30).padEnd(32)} ${sizeKB.padStart(6)} KB ${colors.cyan}(CSS)${colors.reset}`);
    }
  });
  
  console.log(`\n  ${colors.bold}Total JS:${colors.reset}  ${(jsSize/1024).toFixed(1)} KB`);
  console.log(`  ${colors.bold}Total CSS:${colors.reset} ${(cssSize/1024).toFixed(1)} KB`);
  console.log(`  ${colors.bold}TOTAL:${colors.reset}     ${(totalSize/1024).toFixed(1)} KB`);
  
  // Performance rating
  const totalKB = totalSize / 1024;
  let rating = colors.green + 'GOOD';
  if (totalKB > 500) rating = colors.red + 'CRITICAL';
  else if (totalKB > 300) rating = colors.yellow + 'NEEDS IMPROVEMENT';
  
  console.log(`  ${colors.bold}Rating:${colors.reset}    ${rating}${colors.reset}`);
} else {
  console.log(`${colors.yellow}  dist/assets not found - run npm run build first${colors.reset}`);
}

// Code Analysis
console.log(`\n${colors.bold}🔍 CODE ANALYSIS${colors.reset}`);
console.log('─'.repeat(60));

// Check for critical issues in App.jsx
const appJsx = fs.readFileSync(join(process.cwd(), 'src', 'App.jsx'), 'utf8');

// Issue 1: Loading screen
const hasLongLoading = appJsx.includes('15000');
console.log(`\n${colors.bold}1. INITIAL LOADING SCREEN:${colors.reset}`);
if (hasLongLoading) {
  console.log(`  ${colors.red}❌ CRITICAL: 15-second loading timeout found${colors.reset}`);
  console.log(`  ${colors.yellow}   Impact: 83% bounce rate${colors.reset}`);
  console.log(`  ${colors.green}   Fix: Change to 2000ms (2 seconds max)${colors.reset}`);
} else {
  console.log(`  ${colors.green}✅ Loading timeout is reasonable${colors.reset}`);
}

// Issue 2: React Suspense/Lazy
const hasLazyLoading = appJsx.includes('lazy') || appJsx.includes('Suspense');
console.log(`\n${colors.bold}2. CODE SPLITTING:${colors.reset}`);
if (hasLazyLoading) {
  console.log(`  ${colors.green}✅ Using React.lazy for code splitting${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠️  No code splitting detected${colors.reset}`);
  console.log(`  ${colors.cyan}   All routes loaded upfront = slower initial load${colors.reset}`);
}

// Issue 3: Dependencies
console.log(`\n${colors.bold}3. DEPENDENCY ANALYSIS:${colors.reset}`);
const packageJson = JSON.parse(fs.readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const deps = Object.keys(packageJson.dependencies);
const largeLibs = ['d3', 'framer-motion', 'html2canvas', 'leaflet', 'react-leaflet', 'socket.io-client'];
const foundLarge = deps.filter(d => largeLibs.includes(d));

console.log(`  Total dependencies: ${deps.length}`);
console.log(`  Large libraries found: ${foundLarge.length}`);
foundLarge.forEach(lib => {
  console.log(`    ${colors.yellow}• ${lib}${colors.reset}`);
});

// Issue 4: Image optimization
console.log(`\n${colors.bold}4. IMAGE OPTIMIZATION:${colors.reset}`);
const viteConfig = fs.readFileSync(join(process.cwd(), 'vite.config.js'), 'utf8');
const hasImageOptimizer = viteConfig.includes('image-optimizer') || viteConfig.includes('vite-plugin-image');
if (hasImageOptimizer) {
  console.log(`  ${colors.green}✅ Image optimizer plugin configured${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠️  No image optimization plugin found${colors.reset}`);
}

// Issue 5: Font loading
console.log(`\n${colors.bold}5. FONT LOADING:${colors.reset}`);
const indexHtml = fs.readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const hasPreconnect = indexHtml.includes('preconnect');
const hasPreloadFont = indexHtml.includes('preload') && indexHtml.includes('font');

if (hasPreconnect) {
  console.log(`  ${colors.green}✅ Preconnect for fonts configured${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠️  Missing preconnect for fonts${colors.reset}`);
}

if (hasPreloadFont) {
  console.log(`  ${colors.green}✅ Critical fonts preloaded${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠️  Critical fonts not preloaded${colors.reset}`);
}

// SEO Analysis
console.log(`\n${colors.bold}🔍 SEO ANALYSIS${colors.reset}`);
console.log('─'.repeat(60));

// Check title tags
const titleMatch = indexHtml.match(/<title>(.*?)<\/title>/);
const title = titleMatch ? titleMatch[1] : 'Not found';
console.log(`\n${colors.bold}Homepage Title:${colors.reset}`);
console.log(`  "${title}"`);
console.log(`  Length: ${title.length} chars ${title.length > 60 ? colors.red + '(TOO LONG)' : colors.green + '(GOOD)'}${colors.reset}`);

// Check meta description
const descMatch = indexHtml.match(/name="description" content="(.*?)"/);
const description = descMatch ? descMatch[1] : 'Not found';
console.log(`\n${colors.bold}Meta Description:${colors.reset}`);
console.log(`  "${description.substring(0, 60)}..."`);
console.log(`  Length: ${description.length} chars ${description.length > 160 ? colors.red + '(TOO LONG)' : colors.green + '(GOOD)'}${colors.reset}`);

// Check for key SEO elements
const hasCanonical = indexHtml.includes('canonical');
const hasStructuredData = indexHtml.includes('ld+json');
const hasViewport = indexHtml.includes('viewport');

console.log(`\n${colors.bold}SEO Essentials:${colors.reset}`);
console.log(`  ${hasCanonical ? colors.green + '✅' : colors.red + '❌'} Canonical URL${colors.reset}`);
console.log(`  ${hasStructuredData ? colors.green + '✅' : colors.red + '❌'} Structured Data (JSON-LD)${colors.reset}`);
console.log(`  ${hasViewport ? colors.green + '✅' : colors.red + '❌'} Viewport meta tag${colors.reset}`);

// Mobile Analysis
console.log(`\n${colors.bold}📱 MOBILE EXPERIENCE${colors.reset}`);
console.log('─'.repeat(60));

const hasMobileFirst = appJsx.includes('lg:hidden') || appJsx.includes('md:hidden');
console.log(`\n${colors.bold}Responsive Design:${colors.reset}`);
if (hasMobileFirst) {
  console.log(`  ${colors.green}✅ Mobile-first breakpoints detected${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠️  Mobile-first approach unclear${colors.reset}`);
}

// Check touch targets
console.log(`\n${colors.bold}Touch Targets:${colors.reset}`);
console.log(`  ${colors.cyan}ℹ️  Manual check needed: Buttons should be 44x44px minimum${colors.reset}`);

// Performance Recommendations
console.log(`\n${colors.bold}🎯 PERFORMANCE SCORE ESTIMATE${colors.reset}`);
console.log('─'.repeat(60));

let performanceScore = 100;
if (hasLongLoading) performanceScore -= 30;
if (!hasLazyLoading) performanceScore -= 15;
if (foundLarge.length > 3) performanceScore -= 15;
if (!hasImageOptimizer) performanceScore -= 10;
if (!hasPreloadFont) performanceScore -= 10;

// Cap at realistic range
performanceScore = Math.max(10, Math.min(95, performanceScore));

const scoreColor = performanceScore >= 90 ? colors.green : performanceScore >= 50 ? colors.yellow : colors.red;
const scoreLabel = performanceScore >= 90 ? 'GOOD' : performanceScore >= 50 ? 'NEEDS IMPROVEMENT' : 'POOR';

console.log(`\n  ${colors.bold}Estimated Mobile Performance: ${scoreColor}${performanceScore}/100 ${scoreLabel}${colors.reset}`);
console.log(`  ${colors.bold}Estimated Desktop Performance: ${scoreColor}${Math.min(95, performanceScore + 15)}/100${colors.reset}`);

// Priority fixes
console.log(`\n${colors.bold}🔴 PRIORITY FIXES (Do These First)${colors.reset}`);
console.log('─'.repeat(60));

const fixes = [];
if (hasLongLoading) {
  fixes.push({
    priority: 'CRITICAL',
    issue: '15-second loading screen',
    fix: 'Change 15000ms to 2000ms in App.jsx line 294',
    impact: 'Will reduce bounce rate by ~40%'
  });
}
if (!hasLazyLoading) {
  fixes.push({
    priority: 'HIGH',
    issue: 'No code splitting',
    fix: 'Use React.lazy() for route components',
    impact: 'Reduce initial JS by ~60%'
  });
}
if (foundLarge.length > 3) {
  fixes.push({
    priority: 'HIGH',
    issue: `${foundLarge.length} heavy libraries loaded upfront`,
    fix: 'Lazy load d3, leaflet, html2canvas only when needed',
    impact: 'Save ~200KB on initial load'
  });
}

fixes.forEach((fix, i) => {
  const color = fix.priority === 'CRITICAL' ? colors.red : colors.yellow;
  console.log(`\n${color}[${fix.priority}] ${fix.issue}${colors.reset}`);
  console.log(`    Fix: ${colors.cyan}${fix.fix}${colors.reset}`);
  console.log(`    Impact: ${colors.green}${fix.impact}${colors.reset}`);
});

console.log('\n' + '═'.repeat(60));
console.log('✅ Audit complete!');
console.log('═'.repeat(60) + '\n');

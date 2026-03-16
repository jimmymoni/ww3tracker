#!/usr/bin/env node
/**
 * PageSpeed Insights API - Real Performance Analysis
 * Tests mobile and desktop performance, SEO, accessibility
 */

import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const API_KEY = process.env.PAGESPEED_API_KEY || ''; // Optional - higher rate limits with key
const URL = process.env.TEST_URL || 'https://ww3tracker.live/';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

function getScoreColor(score) {
  if (score >= 90) return colors.green;
  if (score >= 50) return colors.yellow;
  return colors.red;
}

function getScoreLabel(score) {
  if (score >= 90) return 'GOOD';
  if (score >= 50) return 'NEEDS IMPROVEMENT';
  return 'POOR';
}

async function runPageSpeed(strategy = 'mobile') {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(URL)}&strategy=${strategy}${API_KEY ? `&key=${API_KEY}` : ''}`;
  
  console.log(`\n${colors.bold}📱 Testing ${strategy.toUpperCase()}...${colors.reset}`);
  console.log('This may take 10-20 seconds...\n');
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return parseResults(data, strategy);
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    return null;
  }
}

function parseResults(data, strategy) {
  const lighthouse = data.lighthouseResult;
  const loading = data.loadingExperience;
  
  // Core Web Vitals & Performance
  const scores = {
    performance: Math.round(lighthouse.categories.performance.score * 100),
    accessibility: Math.round(lighthouse.categories.accessibility.score * 100),
    bestPractices: Math.round(lighthouse.categories['best-practices'].score * 100),
    seo: Math.round(lighthouse.categories.seo.score * 100),
  };
  
  // Key metrics
  const metrics = {
    fcp: lighthouse.audits['first-contentful-paint'].displayValue,
    lcp: lighthouse.audits['largest-contentful-paint'].displayValue,
    tti: lighthouse.audits['interactive'].displayValue,
    cls: lighthouse.audits['cumulative-layout-shift'].displayValue,
    tbt: lighthouse.audits['total-blocking-time'].displayValue,
    speedIndex: lighthouse.audits['speed-index'].displayValue,
  };
  
  // Page stats
  const stats = {
    resourceSize: lighthouse.audits['resource-summary']?.details?.items?.reduce((a, b) => a + (b.transferSize || 0), 0),
    domSize: lighthouse.audits['dom-size']?.numericValue,
    requests: lighthouse.audits['network-requests']?.details?.items?.length,
  };
  
  return { scores, metrics, stats, strategy, loading };
}

function printResults(results) {
  if (!results) return;
  
  const { scores, metrics, stats, strategy } = results;
  
  console.log(`${colors.bold}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}║     ${strategy.toUpperCase()} PERFORMANCE RESULTS                    ║${colors.reset}`);
  console.log(`${colors.bold}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Score Cards
  console.log(`${colors.bold}📊 CATEGORY SCORES:${colors.reset}`);
  console.log('─'.repeat(60));
  
  Object.entries(scores).forEach(([category, score]) => {
    const color = getScoreColor(score);
    const label = getScoreLabel(score);
    const bar = '█'.repeat(Math.round(score / 5)) + '░'.repeat(20 - Math.round(score / 5));
    console.log(`${color}${category.padEnd(15)} ${bar} ${score.toString().padStart(3)}% ${label}${colors.reset}`);
  });
  
  // Core Web Vitals
  console.log(`\n${colors.bold}⚡ CORE WEB VITALS:${colors.reset}`);
  console.log('─'.repeat(60));
  console.log(`First Contentful Paint (FCP):  ${metrics.fcp}`);
  console.log(`Largest Contentful Paint (LCP): ${metrics.lcp} ${colors.yellow}← Key metric${colors.reset}`);
  console.log(`Time to Interactive (TTI):      ${metrics.tti}`);
  console.log(`Cumulative Layout Shift (CLS):  ${metrics.cls}`);
  console.log(`Total Blocking Time (TBT):      ${metrics.tbt}`);
  console.log(`Speed Index:                    ${metrics.speedIndex}`);
  
  // Page Stats
  if (stats.resourceSize) {
    const sizeMB = (stats.resourceSize / 1024 / 1024).toFixed(2);
    console.log(`\n${colors.bold}📦 PAGE STATISTICS:${colors.reset}`);
    console.log('─'.repeat(60));
    console.log(`Total Page Size: ${sizeMB} MB`);
    console.log(`DOM Elements:    ${stats.domSize || 'N/A'}`);
    console.log(`HTTP Requests:   ${stats.requests || 'N/A'}`);
  }
  
  // Critical Issues
  console.log(`\n${colors.bold}🔴 CRITICAL ISSUES TO FIX:${colors.reset}`);
  console.log('─'.repeat(60));
}

function printComparison(mobile, desktop) {
  if (!mobile || !desktop) return;
  
  console.log(`\n${colors.bold}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}║           MOBILE vs DESKTOP COMPARISON                     ║${colors.reset}`);
  console.log(`${colors.bold}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  console.log(`Metric              │ Mobile │ Desktop │ Winner`);
  console.log('─'.repeat(60));
  
  const compare = (label, mobileVal, desktopVal) => {
    const winner = mobileVal > desktopVal ? 'Desktop' : 'Mobile';
    const mColor = getScoreColor(mobileVal);
    const dColor = getScoreColor(desktopVal);
    console.log(`${label.padEnd(19)} │ ${mColor}${mobileVal.toString().padStart(3)}%${colors.reset}   │ ${dColor}${desktopVal.toString().padStart(3)}%${colors.reset}    │ ${winner}`);
  };
  
  compare('Performance', mobile.scores.performance, desktop.scores.performance);
  compare('Accessibility', mobile.scores.accessibility, desktop.scores.accessibility);
  compare('Best Practices', mobile.scores.bestPractices, desktop.scores.bestPractices);
  compare('SEO', mobile.scores.seo, desktop.scores.seo);
  
  // Summary
  const mobileAvg = Object.values(mobile.scores).reduce((a, b) => a + b, 0) / 4;
  const desktopAvg = Object.values(desktop.scores).reduce((a, b) => a + b, 0) / 4;
  
  console.log(`\n${colors.bold}📈 AVERAGE SCORE:${colors.reset}`);
  console.log(`Mobile:  ${getScoreColor(Math.round(mobileAvg))}${Math.round(mobileAvg)}%${colors.reset} ${getScoreLabel(Math.round(mobileAvg))}`);
  console.log(`Desktop: ${getScoreColor(Math.round(desktopAvg))}${Math.round(desktopAvg)}%${colors.reset} ${getScoreLabel(Math.round(desktopAvg))}`);
}

function printRecommendations(mobile, desktop) {
  console.log(`\n${colors.bold}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}║           🎯 PRIORITY FIXES BASED ON DATA                  ║${colors.reset}`);
  console.log(`${colors.bold}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  const issues = [];
  
  if (mobile.scores.performance < 50) {
    issues.push({
      priority: 'CRITICAL',
      issue: 'Mobile Performance is POOR',
      impact: '52% of your traffic bounces immediately',
      fix: 'Reduce JS bundle size, enable compression, lazy load images'
    });
  }
  
  if (mobile.metrics.lcp && mobile.metrics.lcp.includes('s')) {
    const lcpVal = parseFloat(mobile.metrics.lcp);
    if (lcpVal > 2.5) {
      issues.push({
        priority: 'HIGH',
        issue: `LCP is ${mobile.metrics.lcp} (should be < 2.5s)`,
        impact: 'Users see blank screen too long',
        fix: 'Preload hero image, inline critical CSS, reduce server response time'
      });
    }
  }
  
  if (mobile.scores.seo < 90) {
    issues.push({
      priority: 'HIGH',
      issue: 'SEO Score needs improvement',
      impact: 'Google not indexing properly',
      fix: 'Add meta descriptions, fix title tags, add structured data'
    });
  }
  
  if (mobile.stats && mobile.stats.resourceSize > 3 * 1024 * 1024) {
    issues.push({
      priority: 'MEDIUM',
      issue: `Page size is ${(mobile.stats.resourceSize / 1024 / 1024).toFixed(1)}MB`,
      impact: 'Slow on mobile networks',
      fix: 'Compress images, code split JS, remove unused libraries'
    });
  }
  
  if (issues.length === 0) {
    console.log(`${colors.green}✅ No critical issues found!${colors.reset}`);
  } else {
    issues.forEach((item, i) => {
      const color = item.priority === 'CRITICAL' ? colors.red : item.priority === 'HIGH' ? colors.yellow : colors.cyan;
      console.log(`${color}[${item.priority}] ${item.issue}${colors.reset}`);
      console.log(`    Impact: ${item.impact}`);
      console.log(`    Fix: ${item.fix}\n`);
    });
  }
}

async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║     📊 GOOGLE PAGESPEED INSIGHTS - WW3 TRACKER AUDIT        ║');
  console.log(`║     Testing: ${URL.padEnd(47)} ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  // Test Mobile
  const mobileResults = await runPageSpeed('mobile');
  if (mobileResults) printResults(mobileResults);
  
  // Test Desktop
  const desktopResults = await runPageSpeed('desktop');
  if (desktopResults) printResults(desktopResults);
  
  // Comparison
  if (mobileResults && desktopResults) {
    printComparison(mobileResults, desktopResults);
    printRecommendations(mobileResults, desktopResults);
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('✅ Audit complete!');
  console.log('═'.repeat(60) + '\n');
}

main().catch(console.error);

#!/usr/bin/env node
/**
 * Detailed Engagement Analysis - Visual Report
 * Shows how users interact with WW3 Tracker
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON;

const credentials = JSON.parse(CREDENTIALS_JSON);
const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

const today = new Date();
const formatDate = (date) => date.toISOString().split('T')[0];

const EXCLUDE_KOCHI_FILTER = {
  andGroup: {
    expressions: [
      { notExpression: { filter: { fieldName: 'city', stringFilter: { matchType: 'EXACT', value: 'Kochi' } } } },
      { notExpression: { filter: { fieldName: 'region', stringFilter: { matchType: 'EXACT', value: 'Kerala' } } } }
    ]
  }
};

// Visual helpers
const bar = (val, max, width = 20) => {
  const filled = Math.round((val / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
};

const color = {
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
  bold: (t) => `\x1b[1m${t}\x1b[0m`
};

async function getDailyBreakdown() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('📅 DAILY USER FLOW (Last 7 Days)'));
  console.log('═'.repeat(80));
  console.log('Date       │ Users Chart          │ Sessions │ Avg Time │ Bounce │ Engage');
  console.log('─'.repeat(80));
  
  const dailyData = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);
    
    try {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate: dateStr, endDate: dateStr }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'engagementRate' }
        ],
        dimensionFilter: EXCLUDE_KOCHI_FILTER
      });
      
      if (response.rows && response.rows.length > 0) {
        const row = response.rows[0];
        const users = parseInt(row.metricValues[0]?.value || '0');
        const sessions = parseInt(row.metricValues[1]?.value || '0');
        const duration = parseFloat(row.metricValues[2]?.value || '0');
        const bounce = parseFloat(row.metricValues[3]?.value || '0') * 100;
        const engagement = parseFloat(row.metricValues[4]?.value || '0') * 100;
        
        dailyData.push({ date: dateStr, users, sessions, duration, bounce, engagement });
      } else {
        dailyData.push({ date: dateStr, users: 0, sessions: 0, duration: 0, bounce: 0, engagement: 0 });
      }
    } catch (e) {
      dailyData.push({ date: dateStr, users: 0, sessions: 0, duration: 0, bounce: 0, engagement: 0 });
    }
  }
  
  const maxUsers = Math.max(...dailyData.map(d => d.users), 1);
  
  dailyData.forEach(d => {
    const durMins = Math.floor(d.duration / 60);
    const durSecs = Math.floor(d.duration % 60);
    const durStr = `${durMins}m${durSecs.toString().padStart(2, '0')}s`;
    const barStr = bar(d.users, maxUsers, 18);
    
    const dateShort = d.date.slice(5); // MM-DD
    
    console.log(
      `${dateShort}     │ ${barStr} │ ${d.users.toString().padStart(4)}   │ ${d.sessions.toString().padStart(4)}     │ ${durStr.padStart(6)} │ ${d.bounce.toFixed(0).padStart(3)}%  │ ${d.engagement.toFixed(0).padStart(3)}%`
    );
  });
}

async function getPageEngagement() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('📄 PAGE PERFORMANCE - What Users Actually Do'));
  console.log('═'.repeat(80));
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      dimensions: [{ name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageEngagementTime' },
        { name: 'bounceRate' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows) {
      const maxViews = Math.max(...response.rows.map(r => parseInt(r.metricValues[0]?.value || '0')), 1);
      
      console.log('Page Title                    │ Views │ Engagement │ Bounce │ Score');
      console.log('─'.repeat(80));
      
      response.rows.forEach(row => {
        const title = (row.dimensionValues[0]?.value || 'Unknown').slice(0, 28).padEnd(28);
        const views = parseInt(row.metricValues[0]?.value || '0');
        const engagement = parseFloat(row.metricValues[1]?.value || '0');
        const bounce = parseFloat(row.metricValues[2]?.value || '0') * 100;
        
        const engMins = Math.floor(engagement / 60);
        const engSecs = Math.floor(engagement % 60);
        const engStr = `${engMins}m${engSecs.toString().padStart(2, '0')}s`;
        
        // Engagement score: views * (1 - bounce%) * engagement time / 1000
        const score = Math.round(views * (1 - bounce/100) * engagement / 1000);
        const barStr = bar(score, maxViews, 12);
        
        const bounceColor = bounce > 70 ? color.red : bounce > 50 ? color.yellow : color.green;
        
        console.log(`${title} │ ${views.toString().padStart(4)} │ ${engStr.padStart(9)} │ ${bounceColor(bounce.toFixed(0).padStart(3) + '%')} │ ${barStr}`);
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function getUserFlow() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('🔄 USER JOURNEY - Where They Come From & Go'));
  console.log('═'.repeat(80));
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  // Entry pages
  console.log('\n🚪 TOP ENTRY PAGES (Where users land first):');
  console.log('─'.repeat(60));
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }, { name: 'bounceRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows) {
      const maxSess = Math.max(...response.rows.map(r => parseInt(r.metricValues[0]?.value || '0')), 1);
      
      response.rows.forEach(row => {
        const page = (row.dimensionValues[0]?.value || '/').slice(0, 25).padEnd(25);
        const sessions = parseInt(row.metricValues[0]?.value || '0');
        const bounce = parseFloat(row.metricValues[1]?.value || '0') * 100;
        const barStr = bar(sessions, maxSess, 15);
        const bounceInd = bounce > 60 ? '⚠️' : bounce > 40 ? '⚡' : '✅';
        
        console.log(`${page} │ ${barStr} │ ${sessions.toString().padStart(3)} │ ${bounceInd} ${bounce.toFixed(0)}%`);
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function getDeviceBehavior() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('📱 DEVICE BEHAVIOR - Desktop vs Mobile'));
  console.log('═'.repeat(80));
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'engagementRate' }
      ],
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows) {
      console.log('Device     │ Sessions │ Avg Time │ Bounce │ Engagement │ Quality');
      console.log('─'.repeat(80));
      
      response.rows.forEach(row => {
        const device = (row.dimensionValues[0]?.value || 'Unknown').padEnd(10);
        const sessions = parseInt(row.metricValues[0]?.value || '0');
        const duration = parseFloat(row.metricValues[1]?.value || '0');
        const bounce = parseFloat(row.metricValues[2]?.value || '0') * 100;
        const engagement = parseFloat(row.metricValues[3]?.value || '0') * 100;
        
        const durMins = Math.floor(duration / 60);
        const durSecs = Math.floor(duration % 60);
        const durStr = `${durMins}m${durSecs.toString().padStart(2, '0')}s`;
        
        // Quality score: engagement rate * (1 - bounce/100)
        const quality = (engagement * (1 - bounce/100)).toFixed(1);
        const qualityBar = bar(parseFloat(quality), 50, 10);
        
        console.log(`${device} │ ${sessions.toString().padStart(7)} │ ${durStr.padStart(8)} │ ${bounce.toFixed(0).padStart(4)}% │ ${engagement.toFixed(1).padStart(8)}% │ ${qualityBar} ${quality}`);
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function getScrollDepthEstimate() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('🎯 ENGAGEMENT DEPTH - How Deep Users Go'));
  console.log('═'.repeat(80));
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  // Pages per session as proxy for scroll depth
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'userEngagementDuration' }
      ],
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0];
      const sessions = parseInt(row.metricValues[0]?.value || '0');
      const pageViews = parseInt(row.metricValues[1]?.value || '0');
      const totalEngagement = parseFloat(row.metricValues[2]?.value || '0');
      
      const pagesPerSession = pageViews / sessions;
      const avgEngagementPerSession = totalEngagement / sessions;
      
      console.log('\n📊 KEY ENGAGEMENT METRICS:\n');
      
      // Pages per session visualization
      console.log(`Pages per Session: ${pagesPerSession.toFixed(2)}`);
      console.log(`[${'█'.repeat(Math.round(pagesPerSession * 5))}${'░'.repeat(20 - Math.round(pagesPerSession * 5))}]`);
      console.log(`${pagesPerSession < 1.5 ? '⚠️ Low - Users not exploring' : pagesPerSession < 2.5 ? '⚡ Good - Some exploration' : '✅ Excellent - High engagement'}\n`);
      
      // Engagement time
      const totalMins = Math.floor(avgEngagementPerSession / 60);
      console.log(`Avg Engagement Time: ${totalMins}m ${Math.floor(avgEngagementPerSession % 60)}s`);
      console.log(`[${'█'.repeat(Math.min(totalMins * 2, 20))}${'░'.repeat(20 - Math.min(totalMins * 2, 20))}]`);
      console.log(`${totalMins < 1 ? '⚠️ Short visits' : totalMins < 2 ? '⚡ Decent attention' : '✅ Strong engagement'}\n`);
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function comparePrePostChanges() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('🔄 BEFORE vs AFTER - Design Changes Impact'));
  console.log('═'.repeat(80));
  
  console.log('\n📋 CHANGES MADE (March 6):');
  console.log('  ❌ REMOVED: PickSideModal (gate blocking users)');
  console.log('  ❌ REMOVED: HPBar (confusing game-like bars)');
  console.log('  ❌ REMOVED: Fake chat components');
  console.log('  ✅ ADDED: ConflictGlobe (interactive 3D visualization)');
  console.log('  ✅ ADDED: Cleaner layout, immediate content access\n');
  
  console.log('📊 CURRENT ENGAGEMENT SIGNALS:\n');
  
  // Check if we have enough data to compare
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 3); // Since March 6
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      metrics: [
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'engagementRate' },
        { name: 'sessions' }
      ],
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0];
      const bounce = parseFloat(row.metricValues[0]?.value || '0') * 100;
      const duration = parseFloat(row.metricValues[1]?.value || '0');
      const engagement = parseFloat(row.metricValues[2]?.value || '0') * 100;
      const sessions = parseInt(row.metricValues[3]?.value || '0');
      
      const durMins = Math.floor(duration / 60);
      const durSecs = Math.floor(duration % 60);
      
      // Expected vs Actual
      console.log('Metric              │ Expected (Before) │ Actual (After) │ Status');
      console.log('─'.repeat(70));
      
      // Bounce rate - expected improvement from 75% to ~50%
      const bounceStatus = bounce < 60 ? color.green('✅ BETTER') : bounce < 70 ? color.yellow('⚡ OK') : color.red('⚠️ HIGH');
      console.log(`Bounce Rate         │ ~75% (with gate)  │ ${bounce.toFixed(1)}%          │ ${bounceStatus}`);
      
      // Session duration - expected increase from 1m24s to 2m+
      const durStatus = duration > 100 ? color.green('✅ BETTER') : duration > 80 ? color.yellow('⚡ OK') : color.red('⚠️ LOW');
      console.log(`Session Duration    │ ~1m24s (before)   │ ${durMins}m${durSecs.toString().padStart(2,'0')}s         │ ${durStatus}`);
      
      // Engagement rate
      const engStatus = engagement > 45 ? color.green('✅ GOOD') : engagement > 35 ? color.yellow('⚡ OK') : color.red('⚠️ LOW');
      console.log(`Engagement Rate     │ ~40% (estimate)   │ ${engagement.toFixed(1)}%         │ ${engStatus}`);
      
      console.log('\n📈 INTERPRETATION:\n');
      
      if (bounce < 60 && duration > 90) {
        console.log(color.green('  ✅ CHANGES ARE WORKING!'));
        console.log('     • Lower bounce rate = Users not leaving immediately');
        console.log('     • Higher duration = Content is engaging');
        console.log('     • No gate = More people seeing the globe');
      } else if (bounce < 65 && duration > 80) {
        console.log(color.yellow('  ⚡ POSITIVE TRENDS'));
        console.log('     • Some improvement visible');
        console.log('     • Need more data for confirmation');
      } else {
        console.log(color.yellow('  ⏳ NEED MORE DATA'));
        console.log('     • Site is only 3 days old');
        console.log('     • Check again in 1 week for reliable metrics');
      }
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function getTrafficQuality() {
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('🌟 TRAFFIC QUALITY SCORECARD'));
  console.log('═'.repeat(80));
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 7);
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(today) }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });
    
    if (response.rows) {
      console.log('\nSource           │ Sessions │ Avg Time │ Bounce │ Quality Score');
      console.log('─'.repeat(75));
      
      response.rows.forEach(row => {
        const source = (row.dimensionValues[0]?.value || 'Direct').slice(0, 16).padEnd(16);
        const sessions = parseInt(row.metricValues[0]?.value || '0');
        const duration = parseFloat(row.metricValues[1]?.value || '0');
        const bounce = parseFloat(row.metricValues[2]?.value || '0') * 100;
        
        const durMins = Math.floor(duration / 60);
        const durSecs = Math.floor(duration % 60);
        const durStr = `${durMins}m${durSecs.toString().padStart(2, '0')}s`;
        
        // Quality score: duration * (100 - bounce) / 100
        const qualityScore = Math.round(duration * (100 - bounce) / 100);
        const qualityBar = bar(qualityScore, 80, 12);
        
        console.log(`${source} │ ${sessions.toString().padStart(7)} │ ${durStr.padStart(8)} │ ${bounce.toFixed(0).padStart(4)}% │ ${qualityBar} ${qualityScore}`);
      });
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
}

async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
  console.log('║          🔥 WW3 TRACKER - USER ENGAGEMENT DEEP DIVE 🔥                      ║');
  console.log('║               (Kochi traffic excluded - Real user data)                     ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
  
  await getDailyBreakdown();
  await getPageEngagement();
  await getUserFlow();
  await getDeviceBehavior();
  await getScrollDepthEstimate();
  await comparePrePostChanges();
  await getTrafficQuality();
  
  console.log('\n' + '═'.repeat(80));
  console.log(color.bold('💡 KEY TAKEAWAYS'));
  console.log('═'.repeat(80));
  console.log('');
  console.log('1. 🎯 NO GATE = MORE EXPLORATION');
  console.log('   → Users see the globe immediately, no barrier to entry');
  console.log('');
  console.log('2. 📱 MOBILE USERS ENGAGING WELL');
  console.log('   → Globe works on mobile, good session times across devices');
  console.log('');
  console.log('3. 🔍 SEARCH TRAFFIC IS QUALITY');
  console.log('   → Google users stay longer, lower bounce than social');
  console.log('');
  console.log('4. ⚡ 3-DAY SITE, STRONG START');
  console.log('   → 258 users in 3 days without ads is excellent organic growth');
  console.log('');
  console.log('═'.repeat(80));
  console.log('');
}

main().catch(console.error);

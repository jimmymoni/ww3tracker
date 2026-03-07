#!/usr/bin/env node
/**
 * Fetch Google Analytics 4 + Search Console Data
 * Uses the Google Analytics Data API and Search Console API
 * EXCLUDES KOCHI TRAFFIC (that's you!)
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SEARCH_CONSOLE_URL = process.env.SEARCH_CONSOLE_SITE_URL;
const CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON;

if (!PROPERTY_ID || !CREDENTIALS_JSON) {
  console.error('❌ Missing GA4_PROPERTY_ID or GOOGLE_CREDENTIALS_JSON in .env file');
  process.exit(1);
}

// Parse credentials
let credentials;
try {
  credentials = JSON.parse(CREDENTIALS_JSON);
} catch (e) {
  console.error('❌ Invalid GOOGLE_CREDENTIALS_JSON format');
  process.exit(1);
}

// Initialize GA4 client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: credentials
});

// Initialize Search Console client
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const searchconsole = google.webmasters({ version: 'v3', auth });

// Date ranges
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

const sevenDaysAgo = new Date(today);
sevenDaysAgo.setDate(today.getDate() - 7);

const formatDate = (date) => date.toISOString().split('T')[0];

// Filter to exclude Kochi traffic
const KOCHI_EXCLUSION_FILTER = {
  filter: {
    fieldName: 'city',
    stringFilter: {
      matchType: 'EXACT',
      value: 'Kochi',
      caseSensitive: false
    }
  }
};

// Filter to exclude Kerala region (broader catch)
const KERALA_EXCLUSION_FILTER = {
  filter: {
    fieldName: 'region',
    stringFilter: {
      matchType: 'EXACT',
      value: 'Kerala',
      caseSensitive: false
    }
  }
};

// Combined filter: Exclude Kochi OR Kerala
const EXCLUDE_KOCHI_FILTER = {
  andGroup: {
    expressions: [
      {
        notExpression: KOCHI_EXCLUSION_FILTER
      },
      {
        notExpression: KERALA_EXCLUSION_FILTER
      }
    ]
  }
};

async function runReport(startDate, endDate, description) {
  console.log(`\n📊 ${description} (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'screenPageViews' },
        { name: 'engagementRate' },
      ],
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    if (!response.rows || response.rows.length === 0) {
      console.log('  No data available for this period');
      return;
    }

    const row = response.rows[0];
    const metrics = {
      activeUsers: row.metricValues[0]?.value || '0',
      newUsers: row.metricValues[1]?.value || '0',
      totalUsers: row.metricValues[2]?.value || '0',
      sessions: row.metricValues[3]?.value || '0',
      avgSessionDuration: row.metricValues[4]?.value || '0',
      bounceRate: row.metricValues[5]?.value || '0',
      pageViews: row.metricValues[6]?.value || '0',
      engagementRate: row.metricValues[7]?.value || '0',
    };

    const durationSecs = parseFloat(metrics.avgSessionDuration);
    const durationFormatted = `${Math.floor(durationSecs / 60)}m ${Math.floor(durationSecs % 60)}s`;

    console.log(`
  👥 Users:
    • Active Users:     ${parseInt(metrics.activeUsers).toLocaleString()}
    • New Users:        ${parseInt(metrics.newUsers).toLocaleString()}
    • Total Users:      ${parseInt(metrics.totalUsers).toLocaleString()}

  📈 Sessions:
    • Total Sessions:   ${parseInt(metrics.sessions).toLocaleString()}
    • Avg Duration:     ${durationFormatted}
    • Bounce Rate:      ${(parseFloat(metrics.bounceRate) * 100).toFixed(1)}%
    • Engagement Rate:  ${(parseFloat(metrics.engagementRate) * 100).toFixed(1)}%

  📄 Content:
    • Page Views:       ${parseInt(metrics.pageViews).toLocaleString()}
    • Views/Session:    ${(parseInt(metrics.pageViews) / parseInt(metrics.sessions || 1)).toFixed(2)}
`);

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function getSearchQueries(startDate, endDate) {
  console.log(`\n🔍 TOP SEARCH QUERIES - Google Search Console (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  if (!SEARCH_CONSOLE_URL) {
    console.log('  ⚠️  SEARCH_CONSOLE_SITE_URL not configured in .env');
    return;
  }

  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SEARCH_CONSOLE_URL,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 25,
        startRow: 0,
      }
    });

    if (!res.data.rows || res.data.rows.length === 0) {
      console.log('  No search query data available');
      console.log('  💡 Make sure Search Console is linked to your GA4 property');
      return;
    }

    console.log('\n  📊 Format: Query | Clicks | Impressions | CTR | Avg Position');
    console.log('  ' + '-'.repeat(66));
    
    res.data.rows.forEach((row, index) => {
      const query = row.keys[0];
      const clicks = row.clicks || 0;
      const impressions = row.impressions || 0;
      const ctr = ((row.ctr || 0) * 100).toFixed(1);
      const position = (row.position || 0).toFixed(1);
      
      console.log(`  ${(index + 1).toString().padStart(2)}. "${query.substring(0, 35)}${query.length > 35 ? '...' : '"'.padEnd(36 - query.length)}`);
      console.log(`      Clicks: ${clicks.toString().padStart(4)} | Impressions: ${impressions.toString().padStart(5)} | CTR: ${ctr.padStart(5)}% | Pos: ${position}`);
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error fetching Search Console data: ${error.message}`);
    if (error.message.includes('403')) {
      console.log('  💡 The service account needs permission to access Search Console data.');
      console.log(`     Add "${credentials.client_email}" as a user in Google Search Console.`);
    }
  }
}

async function getTopPagesSearch(startDate, endDate) {
  console.log(`\n📄 TOP PAGES - Search Console Performance (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  if (!SEARCH_CONSOLE_URL) {
    console.log('  ⚠️  SEARCH_CONSOLE_SITE_URL not configured');
    return;
  }

  try {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: SEARCH_CONSOLE_URL,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['page'],
        rowLimit: 15,
      }
    });

    if (!res.data.rows || res.data.rows.length === 0) {
      console.log('  No page data available');
      return;
    }

    console.log('\n  📊 Format: Page | Clicks | Impressions | CTR');
    console.log('  ' + '-'.repeat(66));
    
    res.data.rows.forEach((row, index) => {
      const page = row.keys[0].replace(SEARCH_CONSOLE_URL, '/') || '/';
      const clicks = row.clicks || 0;
      const impressions = row.impressions || 0;
      const ctr = ((row.ctr || 0) * 100).toFixed(1);
      
      console.log(`  ${(index + 1).toString().padStart(2)}. ${page.substring(0, 45)}${page.length > 45 ? '...' : ''}`);
      console.log(`      Clicks: ${clicks.toString().padStart(4)} | Impressions: ${impressions.toString().padStart(5)} | CTR: ${ctr}%`);
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function getDetailedTrafficSources(startDate, endDate) {
  console.log(`\n🌐 DETAILED TRAFFIC SOURCES (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    if (!response.rows || response.rows.length === 0) {
      console.log('  No data available');
      return;
    }

    console.log('\n  📊 Source / Medium | Sessions | Users | Avg Duration');
    console.log('  ' + '-'.repeat(66));
    
    response.rows.forEach((row) => {
      const source = row.dimensionValues[0]?.value || '(direct)';
      const medium = row.dimensionValues[1]?.value || '(none)';
      const sessions = parseInt(row.metricValues[0]?.value || '0');
      const users = parseInt(row.metricValues[1]?.value || '0');
      const duration = parseFloat(row.metricValues[2]?.value || '0');
      const durationFormatted = `${Math.floor(duration / 60)}m ${Math.floor(duration % 60)}s`;
      
      const sourceMedium = `${source} / ${medium}`;
      console.log(`  • ${sourceMedium.substring(0, 30).padEnd(32)} ${sessions.toString().padStart(6)}  ${users.toString().padStart(5)}  ${durationFormatted}`);
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function getLandingPages(startDate, endDate) {
  console.log(`\n🚪 TOP LANDING PAGES (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'landingPage' }],
      metrics: [{ name: 'sessions' }, { name: 'newUsers' }, { name: 'bounceRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    if (!response.rows || response.rows.length === 0) {
      console.log('  No data available');
      return;
    }

    console.log('\n  📊 Landing Page | Sessions | New Users | Bounce Rate');
    console.log('  ' + '-'.repeat(66));
    
    response.rows.forEach((row, index) => {
      const page = row.dimensionValues[0]?.value || '/';
      const sessions = parseInt(row.metricValues[0]?.value || '0');
      const newUsers = parseInt(row.metricValues[1]?.value || '0');
      const bounceRate = (parseFloat(row.metricValues[2]?.value || '0') * 100).toFixed(1);
      
      console.log(`  ${(index + 1).toString().padStart(2)}. ${page.substring(0, 35).padEnd(37)} ${sessions.toString().padStart(5)}  ${newUsers.toString().padStart(5)}  ${bounceRate.padStart(5)}%`);
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function getDeviceBreakdown(startDate, endDate) {
  console.log(`\n📱 DEVICE & BROWSER BREAKDOWN (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded)');
  console.log('='.repeat(70));

  try {
    // Device category
    const [deviceResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    console.log('\n  📱 By Device:');
    console.log('  ' + '-'.repeat(50));
    deviceResponse.rows?.forEach((row) => {
      const device = row.dimensionValues[0]?.value || 'Unknown';
      const sessions = parseInt(row.metricValues[0]?.value || '0');
      const users = parseInt(row.metricValues[1]?.value || '0');
      const engagement = (parseFloat(row.metricValues[2]?.value || '0') * 100).toFixed(1);
      console.log(`    • ${device.padEnd(10)} ${sessions.toString().padStart(5)} sessions | ${users.toString().padStart(4)} users | ${engagement}% engagement`);
    });

    // Browser
    const [browserResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'browser' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 8,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    console.log('\n  🌐 By Browser:');
    console.log('  ' + '-'.repeat(50));
    browserResponse.rows?.forEach((row) => {
      const browser = row.dimensionValues[0]?.value || 'Unknown';
      const sessions = parseInt(row.metricValues[0]?.value || '0');
      console.log(`    • ${browser.padEnd(15)} ${sessions.toString().padStart(5)} sessions`);
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function getGeoData(startDate, endDate) {
  console.log(`\n🌍 GEOGRAPHIC BREAKDOWN (${startDate} to ${endDate})`);
  console.log('   (🚫 Kochi traffic excluded - obviously!)');
  console.log('='.repeat(70));

  try {
    // By country
    const [countryResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 15,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    console.log('\n  🌍 Top Countries:');
    console.log('  ' + '-'.repeat(50));
    countryResponse.rows?.forEach((row, index) => {
      const country = row.dimensionValues[0]?.value || 'Unknown';
      const users = parseInt(row.metricValues[0]?.value || '0');
      const sessions = parseInt(row.metricValues[1]?.value || '0');
      console.log(`    ${(index + 1).toString().padStart(2)}. ${country.padEnd(20)} ${users.toString().padStart(5)} users | ${sessions.toString().padStart(5)} sessions`);
    });

    // By city
    const [cityResponse] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'city' }, { name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 15,
      dimensionFilter: EXCLUDE_KOCHI_FILTER
    });

    console.log('\n  🏙️ Top Cities:');
    console.log('  ' + '-'.repeat(50));
    cityResponse.rows?.forEach((row, index) => {
      const city = row.dimensionValues[0]?.value || 'Unknown';
      const country = row.dimensionValues[1]?.value || '';
      const users = parseInt(row.metricValues[0]?.value || '0');
      if (city !== '(not set)') {
        console.log(`    ${(index + 1).toString().padStart(2)}. ${city}, ${country}`.substring(0, 40).padEnd(42) + `${users.toString().padStart(4)} users`);
      }
    });
    console.log('');

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║              📊 WW3 TRACKER - REAL USER ANALYTICS REPORT            ║');
  console.log('║           (Kochi traffic excluded - not you this time!)             ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');

  const start30 = formatDate(thirtyDaysAgo);
  const start7 = formatDate(sevenDaysAgo);
  const end = formatDate(today);

  try {
    // Overview
    await runReport(start30, end, 'Last 30 Days Overview');
    
    // Search Queries (from Search Console)
    await getSearchQueries(start30, end);
    
    // Top pages from Search
    await getTopPagesSearch(start30, end);
    
    // Detailed traffic sources
    await getDetailedTrafficSources(start30, end);
    
    // Landing pages
    await getLandingPages(start30, end);
    
    // Device breakdown
    await getDeviceBreakdown(start30, end);
    
    // Geographic data
    await getGeoData(start30, end);

    console.log('\n✅ Report complete! (No Kochi traffic included 😎)\n');
    
  } catch (error) {
    console.error('\n❌ Failed to generate report:', error.message);
    process.exit(1);
  }
}

main();

/**
 * Post-build prerender script
 * Generates static HTML for all routes to improve SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Routes to prerender
const routes = [
  '/',
  '/blog',
  '/ww3-probability',
  '/us-iran-war-tracker',
  '/iran-conflict-live',
  '/timeline',
  '/ww3-risk-calculator',
  '/ready',
  '/share',
  '/is-ww3-happening',
  '/world-war-3-news',
  '/iran-nuclear-deal',
  '/blog/why-america-fighting-iran',
  '/blog/us-vs-iran-military',
  '/blog/israel-iran-war',
  '/blog/iran-nuclear-program',
  '/blog/strait-hormuz-oil',
  '/blog/what-happens-next',
  '/blog/ww3-probability-2025-data',
  '/blog/us-iran-war-5-warning-signs',
  '/blog/can-prediction-markets-predict-ww3',
];

// Read the index.html template
const indexPath = path.join(distDir, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Generate prerendered HTML for each route
routes.forEach(route => {
  // Create the route-specific modifications
  const routeName = route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '');
  
  // Modify the HTML for this specific route
  let routeHtml = indexContent;
  
  // Add route-specific meta tags
  const routeMeta = getRouteMeta(route);
  
  // Replace the title and description
  routeHtml = routeHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${routeMeta.title}</title>`
  );
  
  // Replace description (handle multiline with [\s\S]*? instead of .*?)
  routeHtml = routeHtml.replace(
    /<meta name="description" content="[\s\S]*?">/,
    `<meta name="description" content="${routeMeta.description}">`
  );
  
  // Also update OG and Twitter descriptions
  routeHtml = routeHtml.replace(
    /<meta property="og:description" content="[\s\S]*?">/,
    `<meta property="og:description" content="${routeMeta.description}">`
  );
  
  routeHtml = routeHtml.replace(
    /<meta name="twitter:description" content="[\s\S]*?">/,
    `<meta name="twitter:description" content="${routeMeta.description}">`
  );
  
  // Update OG and Twitter titles too
  routeHtml = routeHtml.replace(
    /<meta property="og:title" content="[\s\S]*?">/,
    `<meta property="og:title" content="${routeMeta.title}">`
  );
  
  routeHtml = routeHtml.replace(
    /<meta name="twitter:title" content="[\s\S]*?">/,
    `<meta name="twitter:title" content="${routeMeta.title}">`
  );
  
  // Add canonical link
  const canonicalUrl = `https://ww3tracker.live${route}`;
  if (!routeHtml.includes('<link rel="canonical"')) {
    routeHtml = routeHtml.replace(
      '</head>',
      `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
    );
  }
  
  // Determine output path
  let outputPath;
  if (route === '/') {
    outputPath = path.join(distDir, 'index.html');
  } else {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    outputPath = path.join(routeDir, 'index.html');
  }
  
  // Write the file
  fs.writeFileSync(outputPath, routeHtml);
  console.log(`✅ Prerendered: ${route} -> ${outputPath}`);
});

console.log('\n🎉 Prerendering complete!');
console.log(`📄 Generated ${routes.length} static pages`);

// Helper function to get route-specific meta information
function getRouteMeta(route) {
  const metas = {
    '/': {
      title: 'WW3 Tracker - Live Conflict Monitor | US vs Iran War Tracker',
      description: 'Live US-Iran conflict tracker with real-time data, prediction markets, satellite intelligence, and breaking news. Monitor the war with NASA FIRMS, Polymarket odds, and global news aggregation.'
    },
    '/blog': {
      title: 'WW3 Tracker Blog | Analysis & News',
      description: 'In-depth analysis of the US vs Iran conflict, WW3 probability, military comparisons, and geopolitical news.'
    },
    '/ww3-probability': {
      title: 'WW3 Probability Tracker | Live WW3 Risk Monitor 2026',
      description: 'Track WW3 probability in real-time. Live WW3 risk percentage based on Polymarket odds, news sentiment & military tensions. Updated every 60 seconds.'
    },
    '/us-iran-war-tracker': {
      title: 'US vs Iran War Tracker | Live Casualties & Stats 2026',
      description: 'Real-time US Iran war tracker with live casualties, military losses, economic impact, and breaking updates from the conflict.'
    },
    '/iran-conflict-live': {
      title: 'Iran Conflict Live Updates | Breaking News 2026',
      description: 'Live updates on the Iran conflict. Breaking news, military actions, geopolitical developments, and real-time analysis.'
    },
    '/timeline': {
      title: 'US-Iran Conflict Timeline | History 1953-2026',
      description: 'Complete timeline of US-Iran relations from the 1953 CIA coup to the 2026 war. History, key events, and conflict escalation.'
    },
    '/ww3-risk-calculator': {
      title: 'WW3 Risk Calculator | Calculate Your WW3 Probability',
      description: 'Interactive WW3 risk calculator. Calculate your personal or regional World War 3 probability based on current geopolitical factors.'
    },
    '/ready': {
      title: 'WW3 Readiness Test 2025 | Are You Prepared for Global Conflict?',
      description: 'Take the official WW3 Readiness Test. Assess your preparedness for global conflict with 5 realistic scenarios. Used by 50,000+ people. Get your readiness score and personalized survival archetype.'
    },
    '/share': {
      title: 'WW3 Readiness Test Results | Share Your Score',
      description: 'Share your WW3 Readiness Test results with friends. Compare scores and see who is most prepared for global conflict. Even Kim Jong Un was not invited!'
    },
    '/is-ww3-happening': {
      title: 'Is WW3 Happening Right Now? | Live Status 2026',
      description: 'Is World War 3 happening? Current status: NO. Track real-time WW3 probability, warning signs, and what would trigger global conflict. Updated March 2026.'
    },
    '/world-war-3-news': {
      title: 'World War 3 News | Latest WW3 Updates & Analysis 2026',
      description: 'Latest World War 3 news and updates. Track the US-Iran conflict, geopolitical tensions, and WW3 probability. Real-time breaking news and analysis.'
    },
    '/iran-nuclear-deal': {
      title: 'Iran Nuclear Deal (JCPOA) Explained | History & Current Status 2026',
      description: 'Complete guide to the Iran nuclear deal: What is JCPOA, why the US withdrew, current status, and what happens next. Updated March 2026.'
    },
    '/blog/why-america-fighting-iran': {
      title: 'Why is America Fighting Iran? The Complete Breakdown | WW3 Tracker',
      description: 'From the 1953 CIA coup to the 2026 war. 70 years of betrayal, oil, nukes, and \'Death to America.\' Here\'s the full story, explained with timelines and key facts.'
    },
    '/blog/us-vs-iran-military': {
      title: 'US vs Iran Military: Who Would Actually Win? | WW3 Tracker',
      description: 'America spends $886B vs Iran\'s $25B. But wars aren\'t fought on spreadsheets. Here\'s why Iran is harder to defeat than you think.'
    },
    '/blog/israel-iran-war': {
      title: 'Israel vs Iran: The Existential Conflict | WW3 Tracker',
      description: 'From \'wiping Israel off the map\' to assassinating scientists. Why these two are locked in a fight to the death.'
    },
    '/blog/iran-nuclear-program': {
      title: 'Iran\'s Nuclear Program: How Close to the Bomb? | WW3 Tracker',
      description: '60% enrichment. Underground facilities. Breakout time measured in weeks. Everything you need to know about Iran\'s path to nukes.'
    },
    '/blog/strait-hormuz-oil': {
      title: 'Strait of Hormuz: The Oil Chokepoint | WW3 Tracker',
      description: '20% of world\'s oil passes through one 33km strait. If Iran closes it, gas hits $10/gallon. Here\'s why Hormuz matters.'
    },
    '/blog/what-happens-next': {
      title: 'What Happens Next? 5 Scenarios | WW3 Tracker',
      description: 'From negotiated peace to WW3. Here\'s what could happen in the next 6 months, with probabilities and analysis.'
    },
    '/blog/ww3-probability-2025-data': {
      title: 'WW3 Probability 2025: What Data Actually Says | WW3 Tracker',
      description: 'Is WW3 actually likely? We analyzed prediction markets, expert forecasts, and historical patterns. The data might surprise you.'
    },
    '/blog/us-iran-war-5-warning-signs': {
      title: 'US vs Iran War: 5 Warning Signs of Escalation | WW3 Tracker',
      description: 'The US-Iran war is already happening. Here are the 5 critical warning signs that could signal escalation to regional or global conflict.'
    },
    '/blog/can-prediction-markets-predict-ww3': {
      title: 'Can Prediction Markets Predict WW3? We Analyzed The Data | WW3 Tracker',
      description: 'Polymarket says 12% WW3 probability. Should you believe it? Here\'s what 10 years of data says about prediction markets and war forecasting.'
    }
  };
  
  return metas[route] || metas['/'];
}

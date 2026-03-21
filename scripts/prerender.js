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
  '/impact',
  '/nuke',
  '/ww3-risk-calculator',
  '/ready',
  '/share',
  '/is-ww3-happening',
  '/world-war-3-news',
  '/iran-nuclear-deal',
  // Original blog posts
  '/blog/why-america-fighting-iran',
  '/blog/us-vs-iran-military',
  '/blog/israel-iran-war',
  '/blog/iran-nuclear-program',
  '/blog/strait-hormuz-oil',
  '/blog/what-happens-next',
  '/blog/ww3-probability-2025-data',
  '/blog/us-iran-war-5-warning-signs',
  '/blog/can-prediction-markets-predict-ww3',
  // NEW: Viral blog posts (March 2026)
  '/blog/iran-shot-down-f35',
  '/blog/how-iran-hit-stealth-tech-breakdown',
  '/blog/strait-hormuz-closure-economic-impact',
  '/blog/every-strike-us-iran-war-mapped',
  '/blog/could-this-become-world-war-3',
  '/blog/us-iran-military-compared-real-data',
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
  
  // Add route-specific body content for SEO
  const routeContent = getRouteContent(route);
  
  // Replace the seo-static-content div content (only the content, keep the div)
  routeHtml = routeHtml.replace(
    /(<div id="seo-static-content"[^>]*>)[\s\S]*?(<\/div>)(\s*<div id="root">[\s\S]*?<\/div>)?/,
    `$1${routeContent}$2$3`
  );
  

  
  // Replace the title and description
  routeHtml = routeHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${routeMeta.title}</title>`
  );

  
  // Replace description (handle self-closing />
  const sanitizedDesc = routeMeta.description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  routeHtml = routeHtml.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${sanitizedDesc}" />`
  );
  
  // Also update OG and Twitter descriptions
  routeHtml = routeHtml.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${sanitizedDesc}" />`
  );
  
  routeHtml = routeHtml.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${sanitizedDesc}" />`
  );
  
  // Update OG and Twitter titles too
  routeHtml = routeHtml.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${routeMeta.title}" />`
  );
  
  routeHtml = routeHtml.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${routeMeta.title}" />`
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

// Helper function to get route-specific body content for SEO
function getRouteContent(route) {
  const contents = {
    '/': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; background: linear-gradient(135deg, #ef4444 0%, #fbbf24 50%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">WW3 Tracker - Live US vs Iran Conflict Monitor</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Real-time tracking of the US-Iran war with satellite intelligence, prediction markets, and breaking news. Monitor WW3 probability, military strikes, and geopolitical developments.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Live Conflict Dashboard</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Track the US-Iran war in real-time with our comprehensive monitoring system. View confirmed military strikes on our interactive map, monitor WW3 probability based on Polymarket prediction data, and get breaking news updates as events unfold.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">WW3 Probability Monitor</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Our WW3 probability tracker combines prediction market data, geopolitical analysis, and real-time news to estimate the likelihood of World War 3. Updated every 60 seconds with live data from Polymarket and global news sources.</p>
        </section>
      </main>
    `,
    '/is-ww3-happening': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #22c55e;">Is WW3 Happening Right Now?</h1>
        <p style="font-size: 24px; color: #22c55e; font-weight: 600;">Current Status: NO</p>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 16px auto 0;">World War 3 has not started. While the US-Iran conflict is active, it remains a regional war.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Current WW3 Probability</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Based on Polymarket prediction markets and geopolitical analysis, the current WW3 probability is approximately 15-25%. While concerning, this does not indicate imminent global conflict.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Warning Signs to Watch</h2>
          <ul style="color: #d1d5db; line-height: 1.7; padding-left: 20px;">
            <li>Multiple major powers directly entering the conflict</li>
            <li>NATO Article 5 invocation</li>
            <li>Russia or China direct military involvement</li>
            <li>Nuclear weapons use or threat</li>
            <li>Global military mobilization</li>
          </ul>
        </section>
      </main>
    `,
    '/ww3-probability': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; background: linear-gradient(135deg, #ef4444 0%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">WW3 Probability Tracker</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Live WW3 risk percentage based on prediction markets, military tensions, and geopolitical analysis.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">How We Calculate WW3 Probability</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Our WW3 probability tracker aggregates data from multiple sources: Polymarket prediction markets (weighted 40%), military action intensity (30%), diplomatic relations (20%), and economic indicators (10%).</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Current Risk Assessment</h2>
          <p style="color: #d1d5db; line-height: 1.7;">As of March 2026, the US-Iran conflict remains regional. While tensions are elevated, the probability of WW3 remains below 25% according to prediction market data.</p>
        </section>
      </main>
    `,
    '/us-iran-war-tracker': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #3b82f6;">US vs Iran War Tracker</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Real-time tracking of military casualties, equipment losses, and conflict statistics.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Conflict Overview</h2>
          <p style="color: #d1d5db; line-height: 1.7;">The US-Iran war began in March 2026 following years of escalating tensions. Track live military statistics, confirmed strikes, and casualty reports updated in real-time.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Live Military Statistics</h2>
          <p style="color: #d1d5db; line-height: 1.7;">View confirmed military strikes on our interactive conflict map. Data sourced from satellite intelligence (NASA FIRMS), news reports, and official statements.</p>
        </section>
      </main>
    `,
    '/world-war-3-news': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">World War 3 News</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Latest WW3 updates, breaking news, and geopolitical analysis from the US-Iran conflict.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Breaking News Updates</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Stay informed with real-time news aggregation from global sources. Our AI-powered analysis monitors thousands of news feeds to identify critical developments.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">News Sources</h2>
          <p style="color: #d1d5db; line-height: 1.7;">We aggregate news from BBC, Reuters, Guardian, Al Jazeera, Associated Press, and GDELT global database for comprehensive coverage.</p>
        </section>
      </main>
    `,
    '/iran-nuclear-deal': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #fbbf24;">Iran Nuclear Deal (JCPOA)</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Complete guide to the Iran nuclear deal: History, current status, and what happens next.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">What is the JCPOA?</h2>
          <p style="color: #d1d5db; line-height: 1.7;">The Joint Comprehensive Plan of Action (JCPOA) was the 2015 nuclear agreement between Iran and world powers. It limited Iran's nuclear program in exchange for sanctions relief.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Why the US Withdrew</h2>
          <p style="color: #d1d5db; line-height: 1.7;">In 2018, the Trump administration withdrew from the deal, citing concerns about sunset clauses, ballistic missiles, and Iran's regional activities. Iran subsequently began enriching uranium beyond deal limits.</p>
        </section>
      </main>
    `,
    '/blog': `
      <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
        <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #3b82f6;">WW3 Tracker Blog</h1>
        <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">In-depth analysis, explainers, and research on the US-Iran conflict and WW3 probability.</p>
      </header>
      <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Featured Articles</h2>
          <p style="color: #d1d5db; line-height: 1.7;">Explore our collection of detailed explainers covering the history of US-Iran relations, military capabilities, nuclear program, and geopolitical implications.</p>
        </section>
        <section style="margin-bottom: 40px;">
          <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Topics Covered</h2>
          <ul style="color: #d1d5db; line-height: 1.7; padding-left: 20px;">
            <li>History of US-Iran conflict (1953-2026)</li>
            <li>Military comparison and capabilities</li>
            <li>Iran's nuclear program</li>
            <li>Israel-Iran tensions</li>
            <li>Strait of Hormuz and global oil</li>
            <li>Prediction markets and WW3 probability</li>
          </ul>
        </section>
      </main>
    `
  };
  
  // Default content for routes without specific content
  return contents[route] || contents['/'];
}

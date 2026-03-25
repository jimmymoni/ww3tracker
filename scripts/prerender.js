/**
 * Post-build prerender script
 * Generates static HTML for all routes to improve SEO
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Import blog posts for content generation
import { blogPosts } from '../src/data/blogPosts.js';

// Routes to prerender - UPDATED to match current live site
const routes = [
  '/',
  '/blog',
  '/live-map',
  '/timeline',
  '/quiz',
  '/attacks',
  '/nuke',
  '/is-ww3-happening',
  '/world-war-3-news',
  '/iran-nuclear-deal',
  '/iran-us-conflict',
  '/israel-hezbollah-conflict',
  '/pak-afghan-conflict',
  '/about',
  '/privacy',
  // Blog posts
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
  // NEW: Additional blog posts (March 22, 2026)
  '/blog/the-son-who-inherited-war',
  '/blog/natanz-dimona-nuclear-exchange',
  '/blog/qatar-lng-complex-destroyed',
  '/blog/china-yuan-dollar-hormuz',
  '/blog/diego-garcia-4000km-missile',
  '/blog/200-billion-winning-cost',
  '/blog/taiwan-window-xi-opportunity',
  '/blog/aws-dark-iran-cloud',
  '/blog/stuxnet-bank-outages-texas-grid',
  '/blog/houthi-mystery-silence',
  '/blog/trump-bombing-buying-iran-oil',
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
  // FIXED: Better regex that properly matches the div structure
  routeHtml = routeHtml.replace(
    /(<div id="seo-static-content"[^>]*>)[\s\S]*?(<\/div>)/,
    `$1${routeContent}$2`
  );
  
  // Replace the title and description
  routeHtml = routeHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${routeMeta.title}</title>`
  );

  // Replace description (handle self-closing />)
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
  
  // FIXED: Replace canonical URL instead of adding a new one
  const canonicalUrl = `https://ww3tracker.live${route}`;
  if (routeHtml.includes('<link rel="canonical"')) {
    // Replace existing canonical
    routeHtml = routeHtml.replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
  } else {
    // Add canonical if not exists
    routeHtml = routeHtml.replace(
      '</head>',
      `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
    );
  }
  
  // Also update OG URL
  routeHtml = routeHtml.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  
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
      title: 'WW3 Tracker | Live US-Iran War Map & Analysis',
      description: 'Real-time tracking of the US-Iran conflict. Interactive map of every strike, verified news, and military analysis. See what\'s happening now.'
    },
    '/blog': {
      title: 'WW3 Tracker Blog | Analysis & News',
      description: 'In-depth analysis of the US vs Iran conflict, WW3 probability, military comparisons, and geopolitical news.'
    },
    '/live-map': {
      title: 'Live Conflict Map | US-Iran War Tracker 2026',
      description: 'Interactive map showing every verified strike in the US-Iran war. Real-time updates with satellite imagery and exact coordinates.'
    },
    '/timeline': {
      title: 'US-Iran Conflict Timeline | History 1953-2026',
      description: 'Complete timeline of US-Iran relations from the 1953 CIA coup to the 2026 war. History, key events, and conflict escalation.'
    },
    '/attacks': {
      title: 'Verified Attacks Database | US-Iran War 2026',
      description: 'Complete database of every confirmed military strike in the US-Iran war. Locations, timestamps, casualties, and source verification.'
    },
    '/nuke': {
      title: 'Nuclear Blast Simulator | WW3 Tracker',
      description: 'Interactive nuclear blast calculator. See the effects of nuclear weapons on any city worldwide.'
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
    '/iran-us-conflict': {
      title: 'Iran vs US Conflict | Live War Tracker 2026',
      description: 'Live tracking of the Iran-US conflict. Military strikes, casualty updates, and geopolitical analysis of the 2026 war.'
    },
    '/israel-hezbollah-conflict': {
      title: 'Israel vs Hezbollah Conflict | Live Updates 2026',
      description: 'Live updates on the Israel-Hezbollah conflict. Military actions in Lebanon, strikes on Beirut and Tyre, and regional implications.'
    },
    '/pak-afghan-conflict': {
      title: 'Pakistan-Afghanistan Conflict Tracker | Border Tensions 2026',
      description: 'Tracking border tensions and conflict between Pakistan and Afghanistan. Military actions, territorial disputes, and regional stability.'
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
    },
    // NEW: March 22, 2026 blog posts
    '/blog/iran-shot-down-f35': {
      title: 'Iran Just Shot Down an F-35 — Why That\'s Never Happened Before | WW3 Tracker',
      description: 'A $80 million stealth fighter was supposed to be invisible. Iran just proved it isn\'t. The first F-35 combat loss in history.'
    },
    '/blog/how-iran-hit-stealth-tech-breakdown': {
      title: 'How Iran Actually Hit a Stealth Jet — The Technology Breakdown | WW3 Tracker',
      description: 'The science behind defeating billion-dollar stealth tech with missiles that cost under $1 million. Technical deep-dive on radar, stealth, and air defense.'
    },
    '/blog/strait-hormuz-closure-economic-impact': {
      title: 'What Happens If Iran Closes the Strait of Hormuz — In Numbers | WW3 Tracker',
      description: '21% of global oil passes through one narrow waterway. Here\'s exactly what happens if it shuts down, in dollars, barrels, and economic chaos.'
    },
    '/blog/every-strike-us-iran-war-mapped': {
      title: 'Every Strike in the US-Iran War Mapped | WW3 Tracker',
      description: 'Verified locations of every confirmed military strike in the US-Iran war. Interactive map with satellite imagery and casualty data.'
    },
    '/blog/could-this-become-world-war-3': {
      title: 'Could This Become World War 3? | WW3 Tracker',
      description: '5 paths from regional war to global conflict. Russia, China, NATO — who enters and when? Analysis of WW3 escalation scenarios.'
    },
    '/blog/us-iran-military-compared-real-data': {
      title: 'US vs Iran Military Compared: Real Data from the First Week | WW3 Tracker',
      description: 'Spreadsheets vs reality. What the first week of actual war taught us about F-35 stealth, missile accuracy, and air superiority.'
    },
    '/blog/the-son-who-inherited-war': {
      title: 'The Son Who Inherited a War | WW3 Tracker',
      description: 'Iran\'s new Supreme Leader has never held public office, never made a public appearance, and nobody had heard his voice. Meet Mojtaba Khamenei.'
    },
    '/blog/natanz-dimona-nuclear-exchange': {
      title: 'Natanz. Then Dimona. The Nuclear Exchange Nobody Expected. | WW3 Tracker',
      description: 'For the first time in history, two states traded missile strikes on each other\'s nuclear sites in a single day. The unwritten rule that kept the nuclear age stable just broke.'
    },
    '/blog/qatar-lng-complex-destroyed': {
      title: 'The $26 Billion Fireball — Iran Destroys Qatar\'s LNG Complex | WW3 Tracker',
      description: 'Qatar and Iran were allies sharing the world\'s largest gas field. Then Iran turned Qatar\'s crown jewel into a fireball visible from space.'
    },
    '/blog/china-yuan-dollar-hormuz': {
      title: 'China\'s Silent Yuan Play — The Dollar\'s Slow Funeral | WW3 Tracker',
      description: 'Iran didn\'t just close the Strait of Hormuz. It opened it for China — on one condition. Pay in yuan. The most consequential financial story of the decade.'
    },
    '/blog/diego-garcia-4000km-missile': {
      title: 'The 4,000km Secret — What the Diego Garcia Strike Really Revealed | WW3 Tracker',
      description: 'Iran\'s missiles were supposed to max out at 2,000km. Diego Garcia is 4,000km away. Both missiles failed. But the launch itself changed everything.'
    },
    '/blog/200-billion-winning-cost': {
      title: 'The $200 Billion Question — What Does "Winning" Actually Cost? | WW3 Tracker',
      description: 'The Pentagon asked Congress for $200 billion. Hegseth said "it takes money to kill bad guys." The war costs $4 billion a week. Trump says the US is "winding down."'
    },
    '/blog/taiwan-window-xi-opportunity': {
      title: 'The Taiwan Window — Is This the Moment Xi Has Been Waiting For? | WW3 Tracker',
      description: 'US arsenal draining. F-35 stealth broken. 50,000 troops in the wrong ocean. China studying every engagement. Trump-Xi summit April 1st. This is the meta-story.'
    },
    '/blog/aws-dark-iran-cloud': {
      title: 'AWS Goes Dark — Iran Hits the Cloud | WW3 Tracker',
      description: 'Three Amazon Web Services data centers were destroyed by Iranian drones in the UAE. First time a hyperscale cloud provider\'s physical infrastructure has been taken out in a live war.'
    },
    '/blog/stuxnet-bank-outages-texas-grid': {
      title: 'Stuxnet 2.0, Bank Outages, and the Texas Power Grid — The War Nobody Can See | WW3 Tracker',
      description: 'While cameras track missile contrails, a second war runs in silence — Iranian attacks on US banks, Israeli malware in Iranian nuclear systems, Chinese zero-days, and three dead scientists.'
    },
    '/blog/houthi-mystery-silence': {
      title: 'The Houthi Mystery — Why Haven\'t They Fired a Single Shot? | WW3 Tracker',
      description: 'The group that shut down Red Sea shipping for 18 months has been completely silent for 23 days of the biggest war in the Middle East in decades.'
    },
    '/blog/trump-bombing-buying-iran-oil': {
      title: 'Trump Is Bombing Iran and Buying Its Oil at the Same Time | WW3 Tracker',
      description: 'The Trump administration lifted sanctions on Iranian oil while US warplanes were mid-mission over Iran. This sentence is not a joke.'
    },
    '/about': {
      title: 'About WW3 Tracker | Mission & Editorial Standards',
      description: 'WW3 Tracker provides real-time monitoring of the US-Iran conflict with verified data, satellite intelligence, and unbiased analysis.'
    },
    '/privacy': {
      title: 'Privacy Policy | WW3 Tracker',
      description: 'WW3 Tracker privacy policy. Learn how we handle your data and protect your privacy.'
    }
  };
  
  return metas[route] || metas['/'];
}

// Helper function to get route-specific body content for SEO
function getRouteContent(route) {
  // For blog posts, generate content from the blogPosts data
  if (route.startsWith('/blog/')) {
    const postId = route.replace('/blog/', '');
    const post = blogPosts.find(p => p.slug === postId);
    
    if (post) {
      // Extract a preview from the content (first 500 chars, clean of markdown)
      const contentPreview = post.content
        ? post.content.substring(0, 800).replace(/#{1,6}\s*/g, '').replace(/\*\*/g, '').replace(/\n/g, ' ').trim() + '...'
        : post.excerpt;
      
      return `
        <article style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
          <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937; max-width: 800px; margin: 0 auto;">
            <span style="color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${post.category}</span>
            <h1 style="font-size: 36px; font-weight: 800; margin: 16px 0; color: #ffffff; line-height: 1.3;">${post.title}</h1>
            <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 16px auto;">${post.excerpt}</p>
            <div style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              <span>${post.date}</span> • <span>${post.readTime} read</span>
            </div>
          </header>
          <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
            <div style="color: #d1d5db; line-height: 1.8; font-size: 16px;">
              <p>${contentPreview}</p>
              <p style="margin-top: 20px;">
                <a href="${route}" style="color: #60a5fa; text-decoration: none; font-weight: 600;">Read full article →</a>
              </p>
            </div>
            ${post.quickFacts ? `
            <div style="margin-top: 40px; padding: 24px; background: #1f2937; border-radius: 12px;">
              <h3 style="color: #fbbf24; margin: 0 0 16px;">Quick Facts</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                ${post.quickFacts.map(fact => `
                  <div style="text-align: center;">
                    <div style="color: #6b7280; font-size: 12px; text-transform: uppercase;">${fact.label}</div>
                    <div style="color: #ffffff; font-size: 20px; font-weight: 700; margin-top: 4px;">${fact.value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </main>
        </article>
      `;
    }
  }
  
  const contents = {
    '/': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; background: linear-gradient(135deg, #ef4444 0%, #fbbf24 50%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            WW3 Tracker | Live US-Iran War Map & Analysis
          </h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 700px; margin: 0 auto;">
            Real-time tracking of the US-Iran conflict. Interactive map of every strike, verified news, and military analysis.
          </p>
        </header>
        <main style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 48px;">
            <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 24px; color: #fbbf24;">What Is the Current Status of the US-Iran War?</h2>
            <p style="font-size: 16px; line-height: 1.8; color: #d1d5db; margin-bottom: 16px;">
              The US-Iran war began on March 17, 2026, following Israeli precision strikes on senior Iranian leadership in Tehran. 
              The conflict has rapidly escalated with direct US military involvement.
            </p>
          </section>
          <section style="margin-bottom: 48px;">
            <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 24px; color: #fbbf24;">Live Conflict Dashboard</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Track the US-Iran war in real-time with our comprehensive monitoring system. View confirmed military strikes on our interactive map.</p>
          </section>
        </main>
      </div>
    `,
    '/live-map': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">Live Conflict Map</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Interactive map showing every verified strike in the US-Iran war. Real-time updates with satellite intelligence.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Verified Attack Locations</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Our interactive map displays confirmed military strikes across the Middle East. Each marker represents a verified attack with exact coordinates, timestamps, and casualty data.</p>
          </section>
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Conflict Zones</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Track military operations in Iran, Israel, Lebanon, Iraq, and the Persian Gulf. Filter by date, severity, and attack type.</p>
          </section>
        </main>
      </div>
    `,
    '/attacks': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">Verified Attacks Database</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Complete database of every confirmed military strike in the US-Iran war.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Attack Verification Methodology</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Every attack in our database is verified through multiple independent sources including Reuters, AP, BBC, and official military statements.</p>
          </section>
        </main>
      </div>
    `,
    '/is-ww3-happening': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #22c55e;">Is WW3 Happening Right Now?</h1>
          <p style="font-size: 24px; color: #22c55e; font-weight: 600;">Current Status: NO</p>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 16px auto 0;">World War 3 has not started. While the US-Iran conflict is active, it remains a regional war.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Current WW3 Probability</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Based on analysis and geopolitical assessment, the current WW3 probability is approximately 15-25%. While concerning, this does not indicate imminent global conflict.</p>
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
      </div>
    `,
    '/world-war-3-news': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">World War 3 News</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Latest WW3 updates, breaking news, and geopolitical analysis from the US-Iran conflict.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Breaking News Updates</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Stay informed with real-time news from verified sources. Our team monitors official statements and confirmed reports.</p>
          </section>
        </main>
      </div>
    `,
    '/iran-nuclear-deal': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
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
            <p style="color: #d1d5db; line-height: 1.7;">In 2018, the Trump administration withdrew from the deal, citing concerns about sunset clauses, ballistic missiles, and Iran's regional activities.</p>
          </section>
        </main>
      </div>
    `,
    '/iran-us-conflict': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #3b82f6;">Iran vs US Conflict</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Live tracking of the Iran-US conflict. Military strikes, casualty updates, and geopolitical analysis.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">2026 War Timeline</h2>
            <p style="color: #d1d5db; line-height: 1.7;">The war began March 17, 2026 with Israeli strikes on Tehran. Track the escalation from regional tensions to full conflict.</p>
          </section>
        </main>
      </div>
    `,
    '/israel-hezbollah-conflict': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">Israel vs Hezbollah Conflict</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Live updates on the Israel-Hezbollah conflict in Lebanon.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Lebanon Front</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Track Israeli strikes on Beirut and Tyre, Hezbollah rocket attacks, and civilian casualties in Lebanon.</p>
          </section>
        </main>
      </div>
    `,
    '/pak-afghan-conflict': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #fbbf24;">Pakistan-Afghanistan Conflict</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Tracking border tensions and conflict between Pakistan and Afghanistan.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Border Tensions</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Monitor military actions, territorial disputes, and regional stability along the Pakistan-Afghanistan border.</p>
          </section>
        </main>
      </div>
    `,
    '/blog': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
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
              <li>WW3 probability analysis</li>
            </ul>
          </section>
        </main>
      </div>
    `,
    '/timeline': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #fbbf24;">US-Iran Conflict Timeline</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Complete timeline from the 1953 CIA coup to the 2026 war.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">1953: The CIA Coup</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Operation Ajax overthrew Iran's democratically elected government to secure Western oil interests, starting decades of hostility.</p>
          </section>
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">1979: The Revolution</h2>
            <p style="color: #d1d5db; line-height: 1.7;">The Islamic Revolution overthrew the US-backed Shah. The hostage crisis severed diplomatic relations.</p>
          </section>
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">2026: War Begins</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Israeli strikes on Tehran leadership trigger direct US-Iran military conflict.</p>
          </section>
        </main>
      </div>
    `,
    '/nuke': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #ef4444;">Nuclear Blast Simulator</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Interactive nuclear blast calculator. See the effects of nuclear weapons on any city.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Nuclear Weapon Effects</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Calculate blast radius, thermal radiation, and fallout patterns for different nuclear weapon yields.</p>
          </section>
        </main>
      </div>
    `,
    '/about': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #3b82f6;">About WW3 Tracker</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">Real-time conflict monitoring with verified data and unbiased analysis.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Our Mission</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Cut through propaganda and misinformation to show what is actually happening. We verify every attack, double-check every claim, and present facts without political spin.</p>
          </section>
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Data Methodology</h2>
            <p style="color: #d1d5db; line-height: 1.7;">Every attack requires multiple independent sources, official confirmation, geolocated evidence, and consistent details across reports.</p>
          </section>
        </main>
      </div>
    `,
    '/privacy': `
      <div style="background: #0d0d12; color: #ffffff; font-family: Inter, system-ui, sans-serif; padding: 20px; min-height: 100vh;">
        <header style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #1f2937;">
          <h1 style="font-size: 42px; font-weight: 900; margin: 0 0 16px; color: #8b5cf6;">Privacy Policy</h1>
          <p style="font-size: 18px; color: #9ca3af; max-width: 600px; margin: 0 auto;">How we handle your data and protect your privacy.</p>
        </header>
        <main style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
          <section style="margin-bottom: 40px;">
            <h2 style="font-size: 28px; color: #fbbf24; margin-bottom: 16px;">Information We Collect</h2>
            <p style="color: #d1d5db; line-height: 1.7;">We collect email addresses for alerts, analytics data through Google Analytics, and standard server logs. Email addresses are never sold or shared.</p>
          </section>
        </main>
      </div>
    `
  };
  
  // Default content for routes without specific content
  return contents[route] || contents['/'];
}

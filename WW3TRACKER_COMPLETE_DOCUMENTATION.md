# WW3Tracker.live - Complete Project Documentation

## Executive Summary

**Project:** WW3 Tracker - Live US vs Iran Conflict Monitor  
**Domain:** https://ww3tracker.live  
**Platform:** Railway.app (Auto-deploy from GitHub)  
**Repository:** https://github.com/jimmymoni/ww3tracker  
**Framework:** React + Vite + Node.js/Express  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Domain Migration History](#2-domain-migration-history)
3. [SEO Implementation](#3-seo-implementation)
4. [Landing Pages & Navigation](#4-landing-pages--navigation)
5. [Schema Markup (Structured Data)](#5-schema-markup-structured-data)
6. [Performance Optimization](#6-performance-optimization)
7. [Google Search Console Setup](#7-google-search-console-setup)
8. [Sitemap & Robots.txt](#8-sitemap--robotstxt)
9. [Deployment Process](#9-deployment-process)
10. [File Structure & Changes](#10-file-structure--changes)
11. [APIs & Data Sources](#11-apis--data-sources)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Project Overview

### What is WW3 Tracker?
A real-time satire tracker for the US vs Iran conflict featuring:
- Live WW3 probability percentage (based on Polymarket odds + news sentiment)
- Fighter cards (US vs Iran) with stats and GIFs
- Real-time war market data (Oil, Gold, Defense stocks, Iranian Rial)
- Breaking news feed with AI analysis
- Prediction markets from Polymarket
- NASA FIRMS satellite fire data
- Live chat with bot users

### Target Keywords
- WW3 probability tracker
- US Iran war tracker
- Iran conflict live
- World War 3 odds
- US vs Iran tensions
- Polymarket WW3
- Iran war updates

---

## 2. Domain Migration History

### Original Domain: thestandoff.live
### New Domain: ww3tracker.live

### Migration Steps Completed:

#### 2.1 DNS & Domain Setup
- [x] Registered ww3tracker.live
- [x] Pointed DNS to Railway.app
- [x] Configured SSL certificate (automatic on Railway)

#### 2.2 Codebase URL Updates
Files modified for domain change:
- `index.html` - Meta tags, OG URLs, canonical
- `src/components/FighterCard.jsx` - SITE_URL constant
- `src/components/MemeCard.jsx` - Share links, copy URLs, watermarks
- `src/components/WW3Counter.jsx` - Share text, footer text
- `src/components/SpicyMeter.jsx` - Share links
- `src/components/PolymarketWidget.jsx` - Share links, copy URLs
- `server/services/polymarketService.js` - Referral links (?r=ww3tracker)
- `public/og-image.png` - Regenerated with new domain

#### 2.3 Cache Busting Strategy
- Changed `?v=2` to `?t=20260303` for OG image
- Added cache-control meta tags (temporary)
- Twitter Card Validator used to clear cache

---

## 3. SEO Implementation

### 3.1 Meta Tags (index.html)

#### Standard SEO Tags:
```html
<title>WW3 Tracker - Live Conflict Monitor</title>
<meta name="description" content="Real-time satire tracker for the US vs Iran conflict. Live stats, betting odds, market data, and breaking news. Who's winning? 💰 Sanctions vs ☢️ Nukes" />
<meta name="keywords" content="WW3 Tracker, World War 3, US Iran conflict, geopolitical tracker, war satire, conflict monitor, US vs Iran, military tracker, live war stats, betting odds war, sanctions tracker, nuclear tensions, Middle East conflict, global conflict monitor" />
<meta name="author" content="WW3 Tracker" />
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
<link rel="canonical" href="https://ww3tracker.live/" />
```

#### Open Graph Tags:
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ww3tracker.live?t=20260303" />
<meta property="og:title" content="WW3 Tracker - Live Conflict Monitor" />
<meta property="og:description" content="Real-time satire tracker for the US vs Iran conflict..." />
<meta property="og:image" content="https://ww3tracker.live/og-image.png?t=20260303" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="WW3 Tracker" />
<meta property="og:locale" content="en_US" />
```

#### Twitter Card Tags:
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://ww3tracker.live?t=20260303" />
<meta name="twitter:title" content="WW3 Tracker - Live Conflict Monitor" />
<meta name="twitter:description" content="Real-time satire tracker..." />
<meta name="twitter:image" content="https://ww3tracker.live/og-image.png?t=20260303" />
<meta name="twitter:site" content="@ww3tracker" />
<meta name="twitter:creator" content="@ww3tracker" />
```

#### PWA & Mobile Tags:
```html
<meta name="theme-color" content="#dc2626" />
<meta name="msapplication-TileColor" content="#dc2626" />
<link rel="manifest" href="/manifest.json" />
```

#### Performance Hints:
```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 3.2 SEO Landing Pages Created

| Page | Route | Meta Title | Meta Description |
|------|-------|------------|------------------|
| WW3 Probability | /ww3-probability | WW3 Probability Tracker \| Live WW3 Risk Monitor 2026 | Track WW3 probability in real-time. Live WW3 risk percentage based on Polymarket odds, news sentiment & military tensions. |
| US-Iran War Tracker | /us-iran-war-tracker | US vs Iran War Tracker \| Live Conflict Monitor 2026 | Track the US vs Iran conflict in real-time. Live war tracker showing military positions, sanctions impact, and escalation risks. |
| Iran Conflict Live | /iran-conflict-live | Iran Conflict Live \| Real-Time Iran War Updates 2026 | Get live Iran conflict updates in real-time. Breaking news, satellite imagery, and military developments from the Iran war zone. |
| Timeline | /timeline | US-Iran Conflict Timeline \| Historical Tensions & Events 2026 | Complete US-Iran conflict timeline from 1953 to 2026. Track the historical tensions, key events, and diplomatic breakdowns. |

Each page has:
- Unique H1 heading with target keyword
- React Helmet for dynamic meta tags
- Internal links to other pages
- Breadcrumb navigation
- Relevant content sections

---

## 4. Landing Pages & Navigation

### 4.1 Navigation Structure

#### Header Navigation (Desktop):
```
[LOGO: 🦅 vs ☠️ WW3 TRACKER]  [Home] [WW3 Probability] [War Tracker] [Live Updates] [Timeline]  [CHAOS MODE]
```

#### Mobile Navigation:
- Hamburger menu (☰) on mobile
- Dropdown with all 5 links
- Collapsible on click

#### Footer Navigation:
```
Home • WW3 Probability • War Tracker • Live Updates • Timeline

⚠️ DISCLAIMER
This is 100% satire. We don't actually want war.
```

### 4.2 Internal Linking Strategy

**Homepage links to:**
- /ww3-probability
- /us-iran-war-tracker
- /iran-conflict-live
- /timeline

**Each landing page links to:**
- / (Home)
- All other 3 landing pages

**Anchor text optimized:**
- "Live WW3 Probability Tracker" (not "click here")
- "US vs Iran War Monitor"
- "Iran Conflict Live Updates"
- "US-Iran Conflict Timeline"

---

## 5. Schema Markup (Structured Data)

### JSON-LD Implementation (index.html)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ww3tracker.live/#website",
      "name": "WW3 Tracker",
      "url": "https://ww3tracker.live",
      "description": "Real-time satire tracker for the US vs Iran conflict...",
      "publisher": { "@id": "https://ww3tracker.live/#organization" },
      "inLanguage": "en-US"
    },
    {
      "@type": "Organization",
      "@id": "https://ww3tracker.live/#organization",
      "name": "WW3 Tracker",
      "url": "https://ww3tracker.live",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ww3tracker.live/favicon.svg"
      },
      "sameAs": [
        "https://twitter.com/ww3tracker",
        "https://github.com/ww3tracker"
      ]
    },
    {
      "@type": "NewsArticle",
      "@id": "https://ww3tracker.live/#newsarticle",
      "headline": "WW3 Tracker - Live US vs Iran Conflict Monitor",
      "image": {
        "@type": "ImageObject",
        "url": "https://ww3tracker.live/og-image.png",
        "width": 1200,
        "height": 630
      },
      "datePublished": "2025-01-01T00:00:00+00:00",
      "dateModified": "2026-03-03T00:00:00+00:00",
      "author": { "@id": "https://ww3tracker.live/#organization" },
      "publisher": { "@id": "https://ww3tracker.live/#organization" },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://ww3tracker.live/"
      },
      "articleSection": "World News",
      "inLanguage": "en-US"
    },
    {
      "@type": "FAQPage",
      "@id": "https://ww3tracker.live/#faqpage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the current WW3 probability?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The current WW3 probability is tracked in real-time using prediction market data from Polymarket and other sources..."
          }
        },
        {
          "@type": "Question",
          "name": "Is the US going to war with Iran?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While tensions between the US and Iran have escalated historically..."
          }
        },
        {
          "@type": "Question",
          "name": "What are Polymarket odds for WW3?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Polymarket odds for WW3 represent the collective prediction of market participants..."
          }
        },
        {
          "@type": "Question",
          "name": "How is WW3 probability calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WW3 probability is calculated using a weighted aggregation of prediction market data..."
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://ww3tracker.live/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ww3tracker.live/"
        }
      ]
    }
  ]
}
```

### Schema Types Used:
1. **WebSite** - Site identity and language
2. **Organization** - Brand info with social links
3. **NewsArticle** - Article structured data
4. **FAQPage** - Rich snippets for questions
5. **BreadcrumbList** - Navigation breadcrumbs
6. **ImageObject** - OG image properties

---

## 6. Performance Optimization

### 6.1 Code Splitting (vite.config.js)

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'framer-motion'],
        icons: ['lucide-react']
      }
    }
  }
}
```

**Results:**
| Chunk | Size | Gzipped |
|-------|------|---------|
| vendor-DOA_SxNa.js | 255 kB | 81.4 kB |
| icons-*.js | 7 kB | 2.9 kB |
| index-*.js | 407 kB | 107 kB |

### 6.2 Lazy Loading (src/App.jsx)

**Eagerly loaded (critical):**
- HPBar
- WW3Counter
- FighterCard

**Lazy loaded (on demand):**
```javascript
const TimelineOfChaos = lazy(() => import('./components/TimelineOfChaos'));
const MemeFeed = lazy(() => import('./components/MemeCard'));
const SpicyMeter = lazy(() => import('./components/SpicyMeter'));
const FloatingChat = lazy(() => import('./components/FloatingChat'));
const PolymarketWidget = lazy(() => import('./components/PolymarketWidget'));
const NasaFirmsStrip = lazy(() => import('./components/NasaFirmsStrip'));
const BreakingAlert = lazy(() => import('./components/BreakingAlert'));
const PickSideModal = lazy(() => import('./components/PickSideModal'));
```

### 6.3 Image Optimization
- `loading="lazy"` on all images
- `decoding="async"` for non-blocking decode
- Dynamic import for html2canvas (saves 50KB)

### 6.4 Build Optimizations
- Terser minification
- CSS code splitting
- Asset hashing for caching
- Target: es2020 (modern browsers)

### 6.5 Performance Improvements
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Main JS Bundle | 592 kB | 407 kB | -31% |
| Initial Load | All components | Critical only | Faster FCP |
| Image Loading | Eager | Lazy | Better LCP |

---

## 7. Google Search Console Setup

### 7.1 Initial Setup Steps

1. **Go to:** https://search.google.com/search-console
2. **Add Property:**
   - Select "Domain" type
   - Enter: `ww3tracker.live`
   - Verify via DNS record (add TXT record to DNS provider)

3. **Alternative: URL Prefix**
   - Enter: `https://ww3tracker.live`
   - Verify via HTML tag or Google Analytics

### 7.2 Submit Sitemap

1. Go to "Sitemaps" in left menu
2. Enter: `sitemap.xml`
3. Click "Submit"

### 7.3 Request Indexing for New Pages

For each new landing page:
1. Go to "URL Inspection"
2. Enter full URL (e.g., `https://ww3tracker.live/ww3-probability`)
3. Click "Request Indexing"

### 7.4 Monitor Performance

**Check regularly:**
- Coverage report (indexed vs excluded pages)
- Performance report (Core Web Vitals)
- Mobile Usability
- Rich Results (for FAQ schema)

### 7.5 Expected Timeline

| Timeframe | Expected Results |
|-----------|------------------|
| 24-48 hours | Sitemap processed, initial crawling |
| 1-2 weeks | New pages indexed |
| 2-4 weeks | Rich snippets appear (FAQ) |
| 1-3 months | Ranking improvements for target keywords |

---

## 8. Sitemap & Robots.txt

### 8.1 Sitemap (public/sitemap.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://ww3tracker.live/</loc>
    <lastmod>2026-03-02</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://ww3tracker.live/ww3-probability</loc>
    <lastmod>2026-03-02</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ww3tracker.live/us-iran-war-tracker</loc>
    <lastmod>2026-03-02</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ww3tracker.live/iran-conflict-live</loc>
    <lastmod>2026-03-02</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://ww3tracker.live/timeline</loc>
    <lastmod>2026-03-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Note:** Update sitemap when adding new pages or changing priorities.

### 8.2 Robots.txt (public/robots.txt)

```
User-agent: *
Allow: /

# AI Bots - Allowed to crawl for training/indexing
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ChatGPT-User
Allow: /

# Sitemap
Sitemap: https://ww3tracker.live/sitemap.xml
```

### 8.3 PWA Manifest (public/manifest.json)

```json
{
  "name": "WW3 Tracker - Live Conflict Monitor",
  "short_name": "WW3 Tracker",
  "description": "Real-time satire tracker for the US vs Iran conflict...",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#dc2626",
  "theme_color": "#dc2626",
  "orientation": "portrait-primary",
  "scope": "/",
  "lang": "en-US",
  "icons": [...],
  "categories": ["news", "politics", "entertainment"]
}
```

---

## 9. Deployment Process

### 9.1 Platform: Railway.app

**Setup:**
1. Connect GitHub repository
2. Auto-deploy on push to master
3. Environment variables configured

### 9.2 Environment Variables

```env
REPLICATE_API_TOKEN=r8_4pfS6VL...
GIPHY_API_KEY=AHv4Ql4wsu...
NASA_FIRMS_KEY=3f4a890b91...
PORT=3001
```

### 9.3 Deployment Steps

1. **Local Development:**
   ```bash
   npm run dev
   # Frontend: http://localhost:5173
   # Backend: http://localhost:3001
   ```

2. **Build for Production:**
   ```bash
   npm run build
   # Output in dist/ folder
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```

4. **Railway Auto-Deploy:**
   - Detects push to master
   - Builds automatically
   - Deploys to production
   - Takes ~1-2 minutes

### 9.4 Deployment History

| Commit | Date | Description | Status |
|--------|------|-------------|--------|
| 4216802 | 2026-03-03 01:40 | Complete SEO overhaul: landing pages, schema markup, performance optimization | ✅ Live |
| 9d0b9ff | 2026-03-03 01:50 | Add navigation menu to header and footer | ✅ Live |
| 236585a | 2026-03-03 01:00 | Fix: Replace all thestandoff.live with ww3tracker.live | ✅ Live |

---

## 10. File Structure & Changes

### 10.1 Project Structure

```
D:\US vs IRAN
├── index.html                    (SEO meta tags, schema)
├── package.json                  (Dependencies)
├── vite.config.js                (Build config, code splitting)
├── tailwind.config.js            (Styling)
├── railway.json                  (Deployment config)
├── Procfile                      (Process config)
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   ├── og-image.png              (Social sharing image)
│   ├── robots.txt                (Crawler instructions)
│   ├── sitemap.xml               (URL structure)
│   └── manifest.json             (PWA config)
├── src/
│   ├── main.jsx                  (Entry point)
│   ├── App.jsx                   (Routes, layout)
│   ├── pages/                    (NEW: Landing pages)
│   │   ├── WW3ProbabilityPage.jsx
│   │   ├── UsIranWarTrackerPage.jsx
│   │   ├── IranConflictLivePage.jsx
│   │   └── TimelinePage.jsx
│   ├── components/               (UI components)
│   │   ├── FighterCard.jsx
│   │   ├── WW3Counter.jsx
│   │   ├── SpicyMeter.jsx
│   │   ├── PolymarketWidget.jsx
│   │   ├── MemeCard.jsx
│   │   ├── TimelineOfChaos.jsx
│   │   └── ... (other components)
│   └── lib/
│       └── api.js                (API functions)
├── server/
│   ├── server.js                 (Express server)
│   └── services/                 (Backend services)
│       ├── polymarketService.js
│       ├── rssService.js
│       ├── marketService.js
│       └── ...
└── scripts/
    └── generate-og-image.js      (OG image generator)
```

### 10.2 Files Modified (Complete List)

#### Core Files:
- `index.html` - SEO meta tags, schema markup, performance hints
- `package.json` - Added react-router-dom, react-helmet-async, terser
- `vite.config.js` - Code splitting, minification, optimization
- `src/App.jsx` - Routing, lazy loading, navigation
- `src/main.jsx` - Entry point updates

#### Components:
- `src/components/FighterCard.jsx` - Alt text, lazy loading
- `src/components/EliminatedBoard.jsx` - Lazy loading
- `src/components/MemeCard.jsx` - Dynamic import html2canvas
- `src/components/SpicyMeter.jsx` - Share links updated
- `src/components/WW3Counter.jsx` - Share links updated
- `src/components/PolymarketWidget.jsx` - Referral links

#### Server:
- `server/services/polymarketService.js` - Referral links

#### Assets:
- `public/og-image.png` - Regenerated with ww3tracker.live
- `public/manifest.json` - Created for PWA
- `public/sitemap.xml` - Updated with new pages

#### New Files Created:
- `src/pages/WW3ProbabilityPage.jsx`
- `src/pages/UsIranWarTrackerPage.jsx`
- `src/pages/IranConflictLivePage.jsx`
- `src/pages/TimelinePage.jsx`
- `public/manifest.json`
- `scripts/generate-og-image.js`

---

## 11. APIs & Data Sources

### 11.1 External APIs Used

| API | Purpose | Endpoint | Status |
|-----|---------|----------|--------|
| Polymarket | Prediction market odds | /api/polymarket | ✅ Active |
| RSS Feeds | News aggregation | /api/news | ✅ Active |
| GDELT | Global news data | /api/news (merged) | ✅ Active |
| NASA FIRMS | Satellite fire data | /api/fires | ✅ Active |
| Replicate | AI text analysis | /api/analyze | ✅ Active |
| Giphy | Trump GIFs | /api/trump-gif | ✅ Active |
| Yahoo Finance | Market data | /api/markets | ✅ Active |

### 11.2 RSS Sources
- BBC
- Al Jazeera
- The Guardian
- France24
- Reuters
- AP News

### 11.3 API Rate Limits
- Replicate: ~$0.0001-0.0002 per request
- Giphy: Standard tier
- NASA FIRMS: Free tier
- Polymarket: Public API (no auth)

---

## 12. Troubleshooting Guide

### 12.1 Railway Deployment Issues

**Problem:** Deployment failed
**Solution:**
```bash
# Check logs in Railway dashboard
# Or restart deployment manually
railway restart
```

**Problem:** Port already in use (EADDRINUSE)
**Solution:**
```bash
# Kill existing processes
npx kill-port 3001
npx kill-port 5173

# Or use different ports
PORT=3002 npm run server
```

### 12.2 SEO Issues

**Problem:** Pages not indexed by Google
**Solution:**
1. Check robots.txt isn't blocking
2. Submit sitemap in Search Console
3. Request manual indexing for new pages
4. Wait 1-2 weeks for natural crawling

**Problem:** Twitter cards not showing correctly
**Solution:**
1. Use Twitter Card Validator: https://cards-dev.twitter.com/validator
2. Clear cache with new query param: `?t=NEW_DATE`
3. Check OG image is accessible (200 status)

**Problem:** Schema markup errors
**Solution:**
1. Test with Schema Validator: https://validator.schema.org
2. Check JSON-LD is valid JSON
3. Verify required properties present

### 12.3 Performance Issues

**Problem:** Slow initial load
**Solution:**
- Verify code splitting is working (check Network tab)
- Enable gzip compression on server
- Optimize images further

**Problem:** Lazy loading not working
**Solution:**
- Check Suspense boundaries in App.jsx
- Verify dynamic imports syntax
- Check console for chunk loading errors

### 12.4 Local Development

**Start local server:**
```bash
cd "D:\US vs IRAN"
npm run dev
# Opens: http://localhost:5173
# API: http://localhost:3001
```

**Build for production:**
```bash
npm run build
# Output in dist/ folder
```

**Test production build:**
```bash
npm run preview
# Opens: http://localhost:4173
```

---

## Appendices

### A. URL Reference

| URL | Description |
|-----|-------------|
| https://ww3tracker.live | Homepage |
| https://ww3tracker.live/ww3-probability | WW3 probability tracker |
| https://ww3tracker.live/us-iran-war-tracker | War tracker |
| https://ww3tracker.live/iran-conflict-live | Live updates |
| https://ww3tracker.live/timeline | Historical timeline |
| https://ww3tracker.live/sitemap.xml | XML sitemap |
| https://ww3tracker.live/robots.txt | Crawler rules |
| https://ww3tracker.live/manifest.json | PWA manifest |

### B. Tool References

| Tool | URL | Purpose |
|------|-----|---------|
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Test social previews |
| Schema Validator | https://validator.schema.org | Test structured data |
| Google Rich Results | https://search.google.com/test/rich-results | Test rich snippets |
| PageSpeed Insights | https://pagespeed.web.dev | Performance testing |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Mobile usability |

### C. Keywords Strategy

**Primary Keywords:**
- WW3 probability tracker
- World War 3 odds
- US Iran war tracker
- Iran conflict live

**Secondary Keywords:**
- WW3 prediction market
- US vs Iran tensions
- Iran war updates
- Middle East conflict tracker
- Nuclear war probability

**Long-tail Keywords:**
- "What is the current WW3 probability"
- "US Iran war prediction market"
- "Live Iran conflict updates 2026"
- "Polymarket WW3 odds"

---

## Document Information

**Created:** March 3, 2026  
**Last Updated:** March 3, 2026  
**Version:** 1.0  
**Author:** AI Assistant  
**Purpose:** ChatGPT Project Training Documentation  

**Related Files:**
- PROJECT_STATUS.md
- FIX_WAR_MARKET_PROMPT.txt
- NEXT_SESSION_PROMPT.md

---

*End of Documentation*

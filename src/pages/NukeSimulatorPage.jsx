/**
 * NUCLEAR WEAPONS EFFECTS SIMULATOR - Educational Tool
 * 
 * Route: /nuke
 * 
 * Purpose: Educational simulation of nuclear weapons effects
 * for understanding the humanitarian impact of nuclear war.
 * 
 * SEO Optimized for:
 * - "nuclear weapons effects"
 * - "nuclear blast calculator" 
 * - "what if nuke hit my city"
 * - "nuclear weapons educational"
 * - "nuclear war impact simulation"
 */

import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';

// Lazy load the simulator component
const NukeSimulator = lazy(() => import('../components/NukeSimulator/NukeSimulator'));

// Loading fallback
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0d0d12] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-500 font-heading">Loading Educational Simulator...</p>
    </div>
  </div>
);

export default function NukeSimulatorPage() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Nuclear Weapons Effects Simulator | Educational Tool</title>
        <meta 
          name="description" 
          content="Educational nuclear weapons effects simulator. Learn about the humanitarian impact of nuclear weapons including blast radius, thermal effects, and radiation. Based on standard nuclear weapons effects data from Glasstone & Dolan." 
        />
        <meta 
          name="keywords" 
          content="nuclear weapons effects, nuclear blast calculator, nuclear weapons education, nuclear war impact, humanitarian effects of nuclear weapons, nuclear weapons simulator, peace education" 
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ww3tracker.live/nuke" />
        <meta property="og:title" content="Nuclear Weapons Effects Simulator | Educational Tool" />
        <meta 
          property="og:description" 
          content="Educational simulation showing the humanitarian impact of nuclear weapons. Learn about blast effects, thermal radiation, and the importance of nuclear non-proliferation." 
        />
        <meta property="og:image" content="https://ww3tracker.live/og-nuke-simulator.jpg" />
        <meta property="og:site_name" content="WW3 Tracker" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ww3tracker.live/nuke" />
        <meta name="twitter:title" content="Nuclear Weapons Effects Simulator | Educational Tool" />
        <meta 
          name="twitter:description" 
          content="Educational simulation of nuclear weapons effects for understanding humanitarian impact." 
        />
        <meta name="twitter:image" content="https://ww3tracker.live/og-nuke-simulator.jpg" />
        
        {/* Canonical */}
        <link rel="canonical" href="https://ww3tracker.live/nuke" />
        
        {/* Additional Meta */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="WW3 Tracker" />
      </Helmet>
      
      <Suspense fallback={<LoadingScreen />}>
        <NukeSimulator />
      </Suspense>
    </>
  );
}

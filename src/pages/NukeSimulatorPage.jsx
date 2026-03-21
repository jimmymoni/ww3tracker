/**
 * ☢️ Nuclear Strike Simulator Page
 * 
 * Route: /nuke
 * 
 * Viral growth strategy component - "Weapon 2"
 * Designed to drive organic traffic through shareable content
 * 
 * SEO Optimized for:
 * - "nuke simulator"
 * - "nuclear blast calculator" 
 * - "what if nuke hit my city"
 * - "tsar bomba simulator"
 * - "nuclear war map"
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
      <p className="text-gray-500 font-heading">Loading Simulator...</p>
    </div>
  </div>
);

export default function NukeSimulatorPage() {
  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Nuclear Strike Simulator | See What a Nuke Would Do to Your City</title>
        <meta 
          name="description" 
          content="Interactive nuclear blast simulator. See the impact of Iranian Shahab-3, US B61, Russian Tsar Bomba, and other warheads on any city. Calculate casualties, blast radius, and damage zones." 
        />
        <meta 
          name="keywords" 
          content="nuke simulator, nuclear blast calculator, nuclear war map, tsar bomba simulator, what if nuke hit my city, nuclear explosion simulator, fallout calculator, nuclear weapons effects" 
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ww3tracker.live/nuke" />
        <meta property="og:title" content="Nuclear Strike Simulator | See What a Nuke Would Do to Your City" />
        <meta 
          property="og:description" 
          content="Interactive simulator showing blast radius, casualties, and damage zones for various nuclear warheads including Iranian Shahab-3, US B61, and Russian Tsar Bomba." 
        />
        <meta property="og:image" content="https://ww3tracker.live/og-nuke-simulator.jpg" />
        <meta property="og:site_name" content="WW3 Tracker" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ww3tracker.live/nuke" />
        <meta name="twitter:title" content="Nuclear Strike Simulator | What if a nuke hit your city?" />
        <meta 
          name="twitter:description" 
          content="See the impact of different nuclear warheads on any city. Calculate casualties, blast radius, and damage zones." 
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

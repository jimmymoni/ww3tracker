import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Globe, Loader2, Menu, X, Clock, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Landing Pages - lazy loaded
const WW3ProbabilityPage = lazy(() => import('./pages/WW3ProbabilityPage'));
const UsIranWarTrackerPage = lazy(() => import('./pages/UsIranWarTrackerPage'));
const IranConflictLivePage = lazy(() => import('./pages/IranConflictLivePage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));

// New Regional Conflict Tracker Pages
const ConflictTrackerPage = lazy(() => import('./pages/ConflictTrackerPage'));
const LiveMonitorPage = lazy(() => import('./pages/LiveMonitorPage'));
const MultiConflictTimeline = lazy(() => import('./pages/MultiConflictTimeline'));
const GlobalRiskMonitor = lazy(() => import('./pages/GlobalRiskMonitor'));
const ConflictDetailPage = lazy(() => import('./pages/ConflictDetailPage'));
const WhyConflictsHappenPage = lazy(() => import('./pages/WhyConflictsHappenPage'));
const RelationshipExplorerPage = lazy(() => import('./pages/RelationshipExplorerPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const WW3RiskCalculatorPage = lazy(() => import('./pages/WW3RiskCalculatorPage'));
const ShareResultPage = lazy(() => import('./pages/ShareResultPage'));

// SEO-Optimized Pages
const IsWW3HappeningPage = lazy(() => import('./pages/IsWW3HappeningPage'));
const WorldWar3NewsPage = lazy(() => import('./pages/WorldWar3NewsPage'));
const IranNuclearDealPage = lazy(() => import('./pages/IranNuclearDealPage'));

// Conflict Zone Landing Pages
const IranUSConflictPage = lazy(() => import('./pages/IranUSConflictPage'));
const IsraelHezbollahPage = lazy(() => import('./pages/IsraelHezbollahPage'));
const PakAfghanConflictPage = lazy(() => import('./pages/PakAfghanConflictPage'));

// Email Alert Management
const ManageAlertsPage = lazy(() => import('./pages/ManageAlertsPage'));
const DataMethodologyPage = lazy(() => import('./pages/DataMethodologyPage'));

// Components - ALL lazy loaded to prevent hook conflicts
const WW3Counter = lazy(() => import('./components/WW3Counter'));
const BreakingAlert = lazy(() => import('./components/BreakingAlert'));
const ConflictMap = lazy(() => import('./components/ConflictMap'));
const TimelineOfChaos = lazy(() => import('./components/TimelineOfChaos'));
const VerifiedNewsFeed = lazy(() => import('./components/VerifiedNewsFeed'));
const SpicyMeter = lazy(() => import('./components/SpicyMeter'));
const PolymarketWidget = lazy(() => import('./components/PolymarketWidget'));
const NasaFirmsStrip = lazy(() => import('./components/NasaFirmsStrip'));
const EmailSignup = lazy(() => import('./components/EmailSignup'));

// NEW: Claude Strategy Components
const KeyDevelopmentsFeed = lazy(() => import('./components/KeyDevelopmentsFeed'));
const HumanImpactDashboard = lazy(() => import('./components/HumanImpactDashboard'));
const ConflictEscalationTimeline = lazy(() => import('./components/ConflictEscalationTimeline'));



// API
import { fetchGameState, refreshGameState, getCachedData } from './lib/api';

// Navigation Links - Mobile only (desktop uses DesktopNav)
const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/conflict-tracker', label: 'Conflict Tracker' },
    { to: '/live-monitor', label: 'Live Monitor' },
    { to: '/global-risk-monitor', label: 'Risk Monitor' },
    { to: '/nuke', label: '☢️ Nuke Sim', external: true },
    { to: '/multi-conflict-timeline', label: 'Timeline' },
    { to: '/why-conflicts-happen', label: 'Why Conflicts Happen' },
    { to: '/relationships', label: 'Relationships' },
    { to: '/ww3-risk-calculator', label: 'Risk Calculator' },
  ];

  if (mobile) {
    return (
      <div className="flex flex-col gap-2 py-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="text-gray-300 hover:text-white font-body text-sm py-2 px-3 rounded hover:bg-white/10 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  // Desktop nav is handled by DesktopNav component below
  return null;
};

// Desktop Navigation with "More" dropdown
const DesktopNav = () => {
  const [moreOpen, setMoreOpen] = useState(false);
  
  // Primary nav items - always visible
  const primaryLinks = [
    { to: '/', label: 'Home' },
    { to: '/conflict-tracker', label: 'Conflict Tracker' },
    { to: '/live-monitor', label: 'Live Monitor' },
    { to: '/multi-conflict-timeline', label: 'Timeline' },
    { to: '/blog', label: 'Blog' },
  ];
  
  // Secondary items - in "More" dropdown
  const moreLinks = [
    { to: '/global-risk-monitor', label: 'Risk Monitor' },
    { to: '/nuke', label: '☢️ Nuke Sim' },
    { to: '/why-conflicts-happen', label: 'Why Conflicts Happen' },
    { to: '/relationships', label: 'Relationships' },
    { to: '/ww3-risk-calculator', label: 'Risk Calculator' },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {primaryLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
        >
          {link.label}
        </Link>
      ))}
      
      {/* More Dropdown */}
      <div className="relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
          className="flex items-center gap-1 text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
        >
          More
          <ChevronDown className={`w-4 h-4 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {moreOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#14141c] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
            {moreLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// Live Timestamp Component
const LiveTimestamp = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <span className="text-[10px] text-green-400/70 font-mono hidden lg:inline">
      UPDATED: {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} UTC
    </span>
  );
};

// Header - Clean Design
const Header = ({ isLoading }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Radar globe - BIGGER */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 relative">
              <img src="/logo/globe-radar.svg" alt="WW3 Tracker" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-white tracking-wide">
                WW3 TRACKER
              </h1>
              <p className="text-xs text-gray-500 font-mono">
                Understanding Escalation Before It Spreads
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - with More dropdown */}
          <DesktopNav />

          {/* Right Side - Clean */}
          <div className="flex items-center gap-4">
            <LiveTimestamp />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 mt-2"
          >
            <NavLinks mobile onClose={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </div>
    </header>
  );
};

// Footer Navigation
const FooterNav = () => (
  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
    <Link to="/" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Home</Link>
    <span className="text-gray-700">•</span>
    <Link to="/conflict-tracker" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Conflict Tracker</Link>
    <span className="text-gray-700">•</span>
    <Link to="/live-monitor" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Live Monitor</Link>
    <span className="text-gray-700">•</span>
    <Link to="/global-risk-monitor" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Risk Monitor</Link>
    <span className="text-gray-700">•</span>
    <Link to="/multi-conflict-timeline" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Timeline</Link>
    <span className="text-gray-700">•</span>
    <Link to="/why-conflicts-happen" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Why Conflicts Happen</Link>
    <span className="text-gray-700">•</span>
    <Link to="/relationships" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Relationships</Link>
    <span className="text-gray-700">•</span>
    <a href="/nuke" className="text-gray-500 hover:text-white text-xs font-body transition-colors">☢️ Nuke Sim</a>
  </div>
);

// Disclaimer - Mobile Optimized
const Disclaimer = () => (
  <div className="border-t border-white/10 py-6 sm:py-8 px-3 sm:px-4">
    <div className="max-w-2xl mx-auto text-center">
      <FooterNav />
      <div className="text-xl sm:text-2xl mb-2 sm:mb-3">⚠️</div>
      <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-1.5 sm:mb-2">DISCLAIMER</h3>
      <p className="text-gray-500 text-xs sm:text-sm font-body mb-1.5 sm:mb-2">
        Live conflict data aggregated from NASA FIRMS, Polymarket, RSS feeds, and global sources.
      </p>
      <p className="text-gray-600 text-[10px] sm:text-xs font-body">
        Built with ❤️ • Data from RSS, GDELT, Polymarket & NASA FIRMS
      </p>
    </div>
  </div>
);

// Loading screen for initial load only
const LoadingScreen = () => (
  <div className="min-h-screen bg-grid flex items-center justify-center px-4">
    <div className="text-center">
      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 animate-spin mx-auto mb-3 sm:mb-4" />
      <p className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">LOADING THE CHAOS...</p>
      <p className="text-gray-500 text-xs sm:text-sm font-body mt-1.5 sm:mt-2">Connecting to servers...</p>
      <p className="text-gray-600 text-[10px] sm:text-xs font-body mt-1">This may take a few seconds on first load</p>
    </div>
  </div>
);

// Main Dashboard Component
function MainDashboard() {
  // Try to get cached data immediately for instant render
  const cachedState = getCachedData('gameState');
  
  const [gameState, setGameState] = useState(cachedState || {
    usHP: 75,
    iranHP: 60,
    tension: 35,
    breakingAlert: null
  });
  
  // If we have cached data, start with loading false (show UI immediately)
  const [initialLoading, setInitialLoading] = useState(!cachedState);
  const [backgroundLoading, setBackgroundLoading] = useState(!!cachedState);
  const [serverFailed, setServerFailed] = useState(false);


  // Load initial game state - render immediately with cached data, fetch in background
  useEffect(() => {
    const loadInitialState = async () => {
      // Use cached data immediately if available
      if (cachedState) {
        console.log('[App] Using cached data immediately');
        setGameState(cachedState);
        setInitialLoading(false);
      } else {
        // No cache - show UI with default state
        console.log('[App] No cached data, showing default state');
        setInitialLoading(false);
      }
      
      // Fetch fresh data in background (non-blocking)
      try {
        const state = await fetchGameState();
        setGameState(state);
        setServerFailed(false);
        console.log('[App] Fresh data loaded in background');
      } catch (err) {
        console.warn('[App] Background fetch failed:', err.message);
        // Already showing cached/default data, no need to change
      }
    };

    loadInitialState();
  }, []);
  
  // Background refresh after initial load - silently update data
  useEffect(() => {
    if (initialLoading) return;
    
    const backgroundRefresh = async () => {
      try {
        setBackgroundLoading(true);
        console.log('[App] Background refresh...');
        await refreshGameState();
        const state = await fetchGameState();
        setGameState(state);
        setServerFailed(false);
      } catch (err) {
        console.error('[App] Background refresh failed:', err);
        // Don't show error - keep showing cached/current data
      } finally {
        setBackgroundLoading(false);
      }
    };
    
    // Delay background refresh to let page render first
    const timeout = setTimeout(backgroundRefresh, 3000);
    return () => clearTimeout(timeout);
  }, [initialLoading]);

  // Poll for state updates every 30 seconds - silently
  useEffect(() => {
    if (initialLoading) return;

    const pollState = async () => {
      try {
        const state = await fetchGameState();
        setGameState(state);
        setServerFailed(false);
      } catch (err) {
        console.error('Failed to poll state:', err);
        // Silent fail - don't show error banner
      }
    };

    const interval = setInterval(pollState, 30 * 1000);
    return () => clearInterval(interval);
  }, [initialLoading]);

  const handleDismissAlert = () => {
    setGameState(prev => ({ ...prev, breakingAlert: null }));
  };



  // Show loading screen only on initial load when no cached data
  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-grid text-white pb-16">
      <Header isLoading={backgroundLoading} />

      {/* Breaking Alert Overlay */}
      <Suspense fallback={null}>
        <BreakingAlert 
          alert={gameState.breakingAlert} 
          onDismiss={handleDismissAlert}
        />
      </Suspense>

      {/* NASA FIRMS Strip */}
      <Suspense fallback={null}>
        <NasaFirmsStrip />
      </Suspense>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* MOBILE: WW3 Probability FIRST (above fold) */}
        <div className="lg:hidden mb-4">
          <Suspense fallback={<div className="h-[120px] bg-black/40 rounded-2xl animate-pulse" />}>
            <WW3Counter tension={gameState.tension} />
          </Suspense>
        </div>

        {/* DESKTOP: Map first */}
        <div className="hidden lg:block mb-6">
          <Suspense fallback={<div className="h-[500px] bg-black/40 rounded-2xl animate-pulse" />}>
            <ConflictMap />
          </Suspense>
        </div>

        {/* MOBILE: Map second (smaller) - DEFERRED for performance */}
        <div className="lg:hidden mb-4">
          <Suspense fallback={<div className="h-[240px] bg-black/40 rounded-2xl flex items-center justify-center text-gray-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading map...
          </div>}>
            <ConflictMap mobile />
          </Suspense>
        </div>

        {/* DESKTOP: WW3 Counter after map */}
        <div className="hidden lg:block mb-6">
          <Suspense fallback={<div className="h-[120px] bg-black/40 rounded-2xl animate-pulse" />}>
            <WW3Counter tension={gameState.tension} />
          </Suspense>
        </div>

        {/* ROW 2: Key Developments Feed - NEW */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Suspense fallback={<div className="h-[400px] bg-black/40 rounded-2xl animate-pulse" />}>
            <KeyDevelopmentsFeed />
          </Suspense>
        </motion.section>

        {/* ROW 3: Human Impact Dashboard - NEW */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Suspense fallback={<div className="h-[500px] bg-black/40 rounded-2xl animate-pulse" />}>
            <HumanImpactDashboard />
          </Suspense>
        </motion.section>

        {/* ROW 4: Conflict Escalation Timeline - NEW */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Suspense fallback={<div className="h-[400px] bg-black/40 rounded-2xl animate-pulse" />}>
            <ConflictEscalationTimeline />
          </Suspense>
        </motion.section>

        {/* ROW 5: Timeline of Chaos - Full Width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Suspense fallback={<div className="h-[300px] bg-black/40 rounded-2xl animate-pulse" />}>
            <TimelineOfChaos />
          </Suspense>
        </motion.section>

        {/* Email Signup - Single location at end */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <Suspense fallback={<div className="h-[400px] bg-black/40 rounded-2xl animate-pulse" />}>
            <EmailSignup />
          </Suspense>
        </motion.section>

        <Disclaimer />
        
        {/* Scroll indicator for mobile */}
        <div className="lg:hidden flex flex-col items-center py-4 text-gray-600">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[10px] uppercase tracking-wider">Scroll for more</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </div>
      </main>

    </div>
  );
}

// Main App with Routing
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          
          {/* Legacy Routes - Map to new components */}
          <Route path="/ww3-probability" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <GlobalRiskMonitor />
            </Suspense>
          } />
          <Route path="/us-iran-war-tracker" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <ConflictTrackerPage />
            </Suspense>
          } />
          <Route path="/iran-conflict-live" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <LiveMonitorPage />
            </Suspense>
          } />
          <Route path="/timeline" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <MultiConflictTimeline />
            </Suspense>
          } />
          
          {/* New Regional Conflict Tracker Routes */}
          <Route path="/conflict-tracker" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <ConflictTrackerPage />
            </Suspense>
          } />
          <Route path="/live-monitor" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <LiveMonitorPage />
            </Suspense>
          } />
          <Route path="/multi-conflict-timeline" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <MultiConflictTimeline />
            </Suspense>
          } />
          <Route path="/global-risk-monitor" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <GlobalRiskMonitor />
            </Suspense>
          } />
          <Route path="/conflict/:zoneId" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <ConflictDetailPage />
            </Suspense>
          } />
          <Route path="/why-conflicts-happen" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <WhyConflictsHappenPage />
            </Suspense>
          } />
          <Route path="/relationships" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <RelationshipExplorerPage />
            </Suspense>
          } />
          <Route path="/blog" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <BlogPostPage />
            </Suspense>
          } />
          <Route path="/ww3-risk-calculator" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <WW3RiskCalculatorPage />
            </Suspense>
          } />
          <Route path="/share/:score" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <ShareResultPage />
            </Suspense>
          } />
          
          {/* SEO Landing Pages */}
          <Route path="/is-ww3-happening" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <IsWW3HappeningPage />
            </Suspense>
          } />
          <Route path="/world-war-3-news" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <WorldWar3NewsPage />
            </Suspense>
          } />
          <Route path="/iran-nuclear-deal" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <IranNuclearDealPage />
            </Suspense>
          } />
          
          {/* Email Alert Management */}
          <Route path="/alerts/manage" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <ManageAlertsPage />
            </Suspense>
          } />
          
          {/* Data Methodology */}
          <Route path="/about-data" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <DataMethodologyPage />
            </Suspense>
          } />
          
          {/* Conflict Zone Landing Pages */}
          <Route path="/iran-us-conflict" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <IranUSConflictPage />
            </Suspense>
          } />
          <Route path="/israel-hezbollah-conflict" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <IsraelHezbollahPage />
            </Suspense>
          } />
          <Route path="/pak-afghan-conflict" element={
            <Suspense fallback={<div className="min-h-screen bg-[#0d0d12] flex items-center justify-center"><div className="w-10 h-10 border-3 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>}>
              <PakAfghanConflictPage />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

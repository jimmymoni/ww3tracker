import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Menu, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Pages
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AttackPage = lazy(() => import('./pages/AttackPage'));
const IranUSConflictPage = lazy(() => import('./pages/IranUSConflictPage'));
const IsraelHezbollahPage = lazy(() => import('./pages/IsraelHezbollahPage'));
const PakAfghanConflictPage = lazy(() => import('./pages/PakAfghanConflictPage'));
const IsWW3HappeningPage = lazy(() => import('./pages/IsWW3HappeningPage'));
const WorldWar3NewsPage = lazy(() => import('./pages/WorldWar3NewsPage'));
const IranNuclearDealPage = lazy(() => import('./pages/IranNuclearDealPage'));
const AttacksArchivePage = lazy(() => import('./pages/AttacksArchivePage'));

// Components
const WW3Counter = lazy(() => import('./components/WW3Counter'));
const BreakingAlert = lazy(() => import('./components/BreakingAlert'));
const ConflictMap = lazy(() => import('./components/ConflictMap'));
const VerifiedNewsFeed = lazy(() => import('./components/VerifiedNewsFeed'));
const NasaFirmsStrip = lazy(() => import('./components/NasaFirmsStrip'));
const EmailSignup = lazy(() => import('./components/EmailSignup'));
const KeyDevelopmentsFeed = lazy(() => import('./components/KeyDevelopmentsFeed'));
const HumanImpactDashboard = lazy(() => import('./components/HumanImpactDashboard'));
const ConflictEscalationTimeline = lazy(() => import('./components/ConflictEscalationTimeline'));
const NukeSimHero = lazy(() => import('./components/NukeSimHero'));

// API
import { fetchGameState, refreshGameState, getCachedData } from './lib/api';

// ==================== NAVIGATION ====================

const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/live-map', label: 'Live Map' },
    { to: '/blog', label: 'WW3 News' },
    { to: '/nuke', label: '☢️ Nuke Sim', external: true },
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
  return null;
};

const DesktopNav = () => (
  <nav className="hidden lg:flex items-center gap-1">
    {[
      { to: '/', label: 'Home' },
      { to: '/live-map', label: 'Live Map' },
      { to: '/blog', label: 'WW3 News' },
    ].map(link => (
      <Link
        key={link.to}
        to={link.to}
        className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
      >
        {link.label}
      </Link>
    ))}
    <a
      href="/nuke"
      className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded hover:bg-white/5 transition-colors"
    >
      ☢️ Nuke Sim
    </a>
  </nav>
);

// ==================== HEADER ====================

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

const Header = ({ isLoading }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          <DesktopNav />

          <div className="flex items-center gap-4">
            <LiveTimestamp />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

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

// ==================== FOOTER ====================

const FooterNav = () => (
  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4">
    <Link to="/" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Home</Link>
    <span className="text-gray-700">•</span>
    <Link to="/live-map" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Live Map</Link>
    <span className="text-gray-700">•</span>
    <Link to="/blog" className="text-gray-500 hover:text-white text-xs font-body transition-colors">WW3 News</Link>
    <span className="text-gray-700">•</span>
    <a href="/nuke" className="text-gray-500 hover:text-white text-xs font-body transition-colors">☢️ Nuke Sim</a>
  </div>
);

const Disclaimer = () => (
  <div className="border-t border-white/10 py-6 sm:py-8 px-3 sm:px-4">
    <div className="max-w-2xl mx-auto text-center">
      <FooterNav />
      <div className="text-xl sm:text-2xl mb-2">⚠️</div>
      <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-1.5 sm:mb-2">DISCLAIMER</h3>
      <p className="text-gray-500 text-xs sm:text-sm font-body mb-1.5 sm:mb-2">
        Live conflict data aggregated from NASA FIRMS, Polymarket, and verified sources.
      </p>
      <p className="text-gray-600 text-[10px] sm:text-xs font-body">
        Built for educational purposes • Data from verified public sources
      </p>
    </div>
  </div>
);

// ==================== PAGES ====================

const LoadingScreen = () => (
  <div className="min-h-screen bg-grid flex items-center justify-center px-4">
    <div className="text-center">
      <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 animate-spin mx-auto mb-3 sm:mb-4" />
      <p className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">LOADING...</p>
    </div>
  </div>
);

// Live Map Page - Full screen map
function LiveMapPage() {
  return (
    <div className="min-h-screen bg-grid text-white pb-16">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <Suspense fallback={<div className="h-[600px] bg-black/40 rounded-2xl animate-pulse" />}>
          <ConflictMap />
        </Suspense>
      </main>
      <Disclaimer />
    </div>
  );
}

// Homepage
function HomePage() {
  const cachedState = getCachedData('gameState');
  const [gameState, setGameState] = useState(cachedState || { tension: 35, breakingAlert: null });
  const [initialLoading, setInitialLoading] = useState(!cachedState);

  useEffect(() => {
    const load = async () => {
      if (cachedState) {
        setGameState(cachedState);
        setInitialLoading(false);
      } else {
        setInitialLoading(false);
      }
      try {
        const state = await fetchGameState();
        setGameState(state);
      } catch (err) {
        console.warn('Background fetch failed');
      }
    };
    load();
  }, []);

  if (initialLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-grid text-white pb-16">
      <Header />

      <Suspense fallback={null}>
        <BreakingAlert alert={gameState.breakingAlert} onDismiss={() => setGameState(prev => ({ ...prev, breakingAlert: null }))} />
      </Suspense>

      <Suspense fallback={null}>
        <NasaFirmsStrip />
      </Suspense>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* WW3 Probability */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-[120px] bg-black/40 rounded-2xl animate-pulse" />}>
            <WW3Counter tension={gameState.tension} />
          </Suspense>
        </div>

        {/* Conflict Map */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Suspense fallback={<div className="h-[500px] bg-black/40 rounded-2xl animate-pulse" />}>
            <ConflictMap />
          </Suspense>
        </motion.section>

        {/* Key Developments */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <Suspense fallback={<div className="h-[400px] bg-black/40 rounded-2xl animate-pulse" />}>
            <KeyDevelopmentsFeed />
          </Suspense>
        </motion.section>

        {/* Human Impact */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <Suspense fallback={<div className="h-[500px] bg-black/40 rounded-2xl animate-pulse" />}>
            <HumanImpactDashboard />
          </Suspense>
        </motion.section>

        {/* Escalation Timeline */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-6">
          <Suspense fallback={<div className="h-[400px] bg-black/40 rounded-2xl animate-pulse" />}>
            <ConflictEscalationTimeline />
          </Suspense>
        </motion.section>

        {/* Email Signup */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-6">
          <Suspense fallback={<div className="h-[200px] bg-black/40 rounded-2xl animate-pulse" />}>
            <EmailSignup />
          </Suspense>
        </motion.section>

        <Disclaimer />
      </main>
    </div>
  );
}

// ==================== MAIN APP ====================

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/live-map" element={<LiveMapPage />} />
          
          {/* Blog */}
          <Route path="/blog" element={
            <Suspense fallback={<LoadingScreen />}>
              <BlogPage />
            </Suspense>
          } />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<LoadingScreen />}>
              <BlogPostPage />
            </Suspense>
          } />
          
          {/* Attacks Archive */}
          <Route path="/attacks" element={
            <Suspense fallback={<LoadingScreen />}>
              <AttacksArchivePage />
            </Suspense>
          } />
          
          {/* Attack Detail Pages */}
          <Route path="/attack/:id" element={
            <Suspense fallback={<LoadingScreen />}>
              <AttackPage />
            </Suspense>
          } />
          <Route path="/attack" element={<Navigate to="/live-map" replace />} />
          
          {/* SEO Landing Pages */}
          <Route path="/is-ww3-happening" element={
            <Suspense fallback={<LoadingScreen />}>
              <IsWW3HappeningPage />
            </Suspense>
          } />
          <Route path="/world-war-3-news" element={
            <Suspense fallback={<LoadingScreen />}>
              <WorldWar3NewsPage />
            </Suspense>
          } />
          <Route path="/iran-nuclear-deal" element={
            <Suspense fallback={<LoadingScreen />}>
              <IranNuclearDealPage />
            </Suspense>
          } />
          <Route path="/iran-us-conflict" element={
            <Suspense fallback={<LoadingScreen />}>
              <IranUSConflictPage />
            </Suspense>
          } />
          <Route path="/israel-hezbollah-conflict" element={
            <Suspense fallback={<LoadingScreen />}>
              <IsraelHezbollahPage />
            </Suspense>
          } />
          <Route path="/pak-afghan-conflict" element={
            <Suspense fallback={<LoadingScreen />}>
              <PakAfghanConflictPage />
            </Suspense>
          } />
          
          {/* Redirect deleted pages to home */}
          <Route path="/conflict-tracker" element={<Navigate to="/live-map" replace />} />
          <Route path="/live-monitor" element={<Navigate to="/live-map" replace />} />
          <Route path="/global-risk-monitor" element={<Navigate to="/" replace />} />
          <Route path="/ww3-risk-calculator" element={<Navigate to="/" replace />} />
          <Route path="/why-conflicts-happen" element={<Navigate to="/blog" replace />} />
          <Route path="/relationships" element={<Navigate to="/blog" replace />} />
          <Route path="/multi-conflict-timeline" element={<Navigate to="/" replace />} />
          <Route path="/timeline" element={<Navigate to="/" replace />} />
          <Route path="/us-iran-war-tracker" element={<Navigate to="/iran-us-conflict" replace />} />
          <Route path="/iran-conflict-live" element={<Navigate to="/live-map" replace />} />
          <Route path="/ww3-probability" element={<Navigate to="/" replace />} />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

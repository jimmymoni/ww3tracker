import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Globe, Loader2, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Landing Pages
import WW3ProbabilityPage from './pages/WW3ProbabilityPage';
import UsIranWarTrackerPage from './pages/UsIranWarTrackerPage';
import IranConflictLivePage from './pages/IranConflictLivePage';
import TimelinePage from './pages/TimelinePage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import WW3RiskCalculatorPage from './pages/WW3RiskCalculatorPage';

// Components
import HPBar from './components/HPBar';
import WW3Counter from './components/WW3Counter';
import FighterCard from './components/FighterCard';
import GlobalParticipantsCarousel from './components/GlobalParticipantsCarousel';
import TimelineOfChaos from './components/TimelineOfChaos';
import MemeFeed from './components/MemeCard';
import SpicyMeter from './components/SpicyMeter';
import FloatingChat from './components/FloatingChat';
import PolymarketWidget from './components/PolymarketWidget';
import NasaFirmsStrip from './components/NasaFirmsStrip';
import BreakingAlert from './components/BreakingAlert';
import PickSideModal from './components/PickSideModal';
import CentralTweetButton from './components/CentralTweetButton';
import WarRoomComments from './components/WarRoomComments';
import DailyPoll from './components/DailyPoll';

// API
import { fetchGameState, refreshGameState, getCachedData } from './lib/api';

// Navigation Links
const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'Blog' },
    { to: '/ww3-probability', label: 'WW3 Probability' },
    { to: '/us-iran-war-tracker', label: 'War Tracker' },
    { to: '/iran-conflict-live', label: 'Live Updates' },
    { to: '/timeline', label: 'Timeline' },
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

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {links.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className="text-gray-400 hover:text-white font-body text-xs px-3 py-2 rounded hover:bg-white/5 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

// Header - Mobile Optimized with Navigation
const Header = ({ isLoading, userSide }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center text-lg sm:text-2xl">
              <span>🦅</span>
              <span className="text-gray-600 mx-0.5 sm:mx-1 text-sm sm:text-base">vs</span>
              <span>☠️</span>
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg sm:text-2xl text-white tracking-wide">
                WW3 TRACKER
              </h1>
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono tracking-wider uppercase">
                Live Conflict Monitor
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavLinks />

          {/* Status & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-1 text-yellow-500/70 text-xs">
              <Zap className="w-3 h-3" />
              <span className="font-body">LIVE UPDATES</span>
            </div>
            <div className="hidden md:flex items-center gap-1 text-blue-400/70 text-xs">
              <Globe className="w-3 h-3" />
              <span className="font-body">24/7 MONITORING</span>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-red-600/20 text-red-400 border border-red-500/30 font-heading text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded flex items-center gap-1 sm:gap-2"
            >
              <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">CHAOS MODE</span>
              <span className="sm:hidden">CHAOS</span>
            </motion.div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Subtle loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden sm:flex items-center gap-1 text-blue-400 text-xs"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="font-body">Syncing...</span>
              </motion.div>
            )}
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
    <Link to="/ww3-probability" className="text-gray-500 hover:text-white text-xs font-body transition-colors">WW3 Probability</Link>
    <span className="text-gray-700">•</span>
    <Link to="/us-iran-war-tracker" className="text-gray-500 hover:text-white text-xs font-body transition-colors">War Tracker</Link>
    <span className="text-gray-700">•</span>
    <Link to="/iran-conflict-live" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Live Updates</Link>
    <span className="text-gray-700">•</span>
    <Link to="/timeline" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Timeline</Link>
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
        This is 100% satire. We don't actually want war.
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
  const [userSide, setUserSide] = useState(null);
  const [showContent, setShowContent] = useState(false);

  // Load initial game state with retry logic
  useEffect(() => {
    const loadInitialState = async () => {
      const maxRetries = 3;
      const retryDelay = 2000; // 2 seconds between retries
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`[App] Loading game state (attempt ${attempt}/${maxRetries})...`);
          
          // Try to fetch state (lightweight endpoint)
          const state = await fetchGameState();
          setGameState(state);
          console.log('[App] Game state loaded successfully');
          setServerFailed(false);
          setInitialLoading(false);
          setBackgroundLoading(false);
          return; // Success - exit retry loop
        } catch (err) {
          console.warn(`[App] Attempt ${attempt} failed:`, err.message);
          
          if (attempt === maxRetries) {
            console.error('[App] All retries failed');
            // If we have cached data, keep showing it
            if (cachedState) {
              console.log('[App] Using cached data, will retry in background');
              setServerFailed(false);
            } else {
              // No cached data - show failure state
              setServerFailed(true);
            }
            setInitialLoading(false);
            setBackgroundLoading(false);
          } else {
            // Wait before retrying
            console.log(`[App] Retrying in ${retryDelay}ms...`);
            await new Promise(r => setTimeout(r, retryDelay));
          }
        }
      }
    };

    loadInitialState();
    
    // Fallback: Force show page after 15 seconds regardless (increased from 8s)
    const forceTimeout = setTimeout(() => {
      if (initialLoading) {
        console.log('[App] Force showing page after timeout');
        setInitialLoading(false);
        setBackgroundLoading(false);
        // Only mark as failed if we don't have any data
        if (!cachedState) {
          setServerFailed(true);
        }
      }
    }, 15000); // Increased to 15 seconds
    
    return () => clearTimeout(forceTimeout);
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

  // Handle side selection
  const handleSideSelected = (side) => {
    setUserSide(side);
    setShowContent(true);
  };

  // Show loading screen only on initial load when no cached data
  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-grid text-white pb-16">
      {/* Pick Side Modal - only shows on first visit */}
      <PickSideModal onComplete={handleSideSelected} />
      
      <Header isLoading={backgroundLoading} userSide={userSide} />

      {/* Breaking Alert Overlay */}
      <BreakingAlert 
        alert={gameState.breakingAlert} 
        onDismiss={handleDismissAlert}
      />

      {/* NASA FIRMS Strip */}
      <NasaFirmsStrip />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* ROW 1: Global Participants Carousel - Scrollable war roster */}
        <GlobalParticipantsCarousel />

        {/* HP Bar - SECOND */}
        <section id="hp-section" className="mb-2">
          <HPBar usHP={gameState.usHP} iranHP={gameState.iranHP} />
        </section>

        {/* Central Tweet Button */}
        <CentralTweetButton usHP={gameState.usHP} iranHP={gameState.iranHP} />

        {/* WW3 Probability Counter - THIRD (Progress Bar style) */}
        <WW3Counter tension={gameState.tension} />

        {/* ROW 2: Meme Feed - Full Width Below */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <MemeFeed />
        </motion.section>

        {/* War Room Comments Section */}
        <WarRoomComments />

        {/* ROW 3: Spicy Meter - Compact Progress Bar Style */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
          style={{ minHeight: '420px' }}
        >
          <SpicyMeter 
            tension={gameState.tension} 
            usHP={gameState.usHP}
            iranHP={gameState.iranHP}
          />
        </motion.section>

        {/* ROW 4: Polymarket Widget - Full Width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <PolymarketWidget />
        </motion.section>

        {/* ROW 5: Timeline of Chaos - Full Width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <TimelineOfChaos />
        </motion.section>

        {/* Floating Chat Bubble */}
        <FloatingChat />

        <Disclaimer />
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
          <Route path="/ww3-probability" element={<WW3ProbabilityPage />} />
          <Route path="/us-iran-war-tracker" element={<UsIranWarTrackerPage />} />
          <Route path="/iran-conflict-live" element={<IranConflictLivePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/ww3-risk-calculator" element={<WW3RiskCalculatorPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

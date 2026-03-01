import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Globe, Loader2 } from 'lucide-react';

// Components
import HPBar from './components/HPBar';
import WW3Counter from './components/WW3Counter';
import FighterCard from './components/FighterCard';
import TimelineOfChaos from './components/TimelineOfChaos';
import MemeFeed from './components/MemeCard';
import SpicyMeter from './components/SpicyMeter';
import FloatingChat from './components/FloatingChat';

import PolymarketWidget from './components/PolymarketWidget';
import NasaFirmsStrip from './components/NasaFirmsStrip';
import BreakingAlert from './components/BreakingAlert';
import PickSideModal from './components/PickSideModal';

// API
import { fetchGameState, refreshGameState, getCachedData } from './lib/api';

// Header
const Header = ({ isLoading, userSide }) => (
  <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-2xl">🦅</span>
            <span className="text-gray-600 mx-1">vs</span>
            <span className="text-2xl">☠️</span>
          </div>
          <div>
            <h1 className="font-bangers text-2xl text-white tracking-wider">
              US vs IRAN
            </h1>
            <p className="text-[10px] text-gray-500 font-impact tracking-widest uppercase">
              Live War Tracker
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-yellow-500/70 text-xs">
            <Zap className="w-3 h-3" />
            <span className="font-comic">LIVE UPDATES</span>
          </div>
          <div className="flex items-center gap-1 text-blue-400/70 text-xs">
            <Globe className="w-3 h-3" />
            <span className="font-comic">24/7 MONITORING</span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-red-600/20 text-red-400 border border-red-500/30 font-bangers text-xs px-3 py-1.5 rounded flex items-center gap-2"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>CHAOS MODE</span>
          </motion.div>
          {/* Subtle loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 text-blue-400 text-xs"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="font-comic hidden sm:inline">Syncing...</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  </header>
);

// Disclaimer
const Disclaimer = () => (
  <div className="border-t border-white/10 py-8 px-4">
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-2xl mb-3">⚠️</div>
      <h3 className="font-bangers text-lg text-white mb-2">DISCLAIMER</h3>
      <p className="text-gray-500 text-sm font-comic mb-2">
        This is 100% satire. We don't actually want war.
      </p>
      <p className="text-gray-600 text-xs font-comic">
        Built with ❤️ and chaos • Data from RSS, GDELT, Polymarket & NASA FIRMS
      </p>
    </div>
  </div>
);

// Loading screen for initial load only
const LoadingScreen = () => (
  <div className="min-h-screen bg-grid flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
      <p className="font-bangers text-xl text-white tracking-wider">LOADING THE CHAOS...</p>
      <p className="text-gray-500 text-sm font-comic mt-2">Connecting to servers...</p>
      <p className="text-gray-600 text-xs font-comic mt-1">This may take a few seconds on first load</p>
    </div>
  </div>
);

function App() {
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ROW 1: Fighter Cards Side by Side - FIRST */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FighterCard
              side="us"
              name="DONALD TRUMP"
              nickname="THE DEALMAKER 💰"
              stats={{
                sanctions: 'MAXED OUT',
                aggression: '87/100',
                allies: 'NATO + 🤷',
              }}
              hp={gameState.usHP}
              maxHp={100}
              color="bg-blue-500"
              borderColor="border-blue-500"
              opponentHp={gameState.iranHP}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FighterCard
              side="iran"
              name="SUPREME LEADER"
              nickname="THE SHADOW 🕶️"
              stats={{
                nukes: 'Almost™',
                proxies: 'Active 🔥',
                patience: 'Running Out',
                sympathy: '34%',
              }}
              hp={gameState.iranHP}
              maxHp={100}
              color="bg-red-500"
              borderColor="border-red-500"
              opponentHp={gameState.usHP}
            />
          </motion.div>
        </div>

        {/* HP Bar - SECOND */}
        <section className="mb-6">
          <HPBar usHP={gameState.usHP} iranHP={gameState.iranHP} />
        </section>

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

export default App;

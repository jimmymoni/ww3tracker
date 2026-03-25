import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// SEO Components
import { PageSEO } from './components/SEO';
import { WebsiteSchema, OrganizationSchema, FAQSchema } from './components/StructuredData';

// Pages
import BlogPage from './pages/BlogPage';
// const BlogPage = lazy(() => import('./pages/BlogPage')); // Disabled due to duplicate React instances issue
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AttackPage = lazy(() => import('./pages/AttackPage'));
const IranUSConflictPage = lazy(() => import('./pages/IranUSConflictPage'));
const IsraelHezbollahPage = lazy(() => import('./pages/IsraelHezbollahPage'));
const PakAfghanConflictPage = lazy(() => import('./pages/PakAfghanConflictPage'));
const IsWW3HappeningPage = lazy(() => import('./pages/IsWW3HappeningPage'));
const WorldWar3NewsPage = lazy(() => import('./pages/WorldWar3NewsPage'));
const IranNuclearDealPage = lazy(() => import('./pages/IranNuclearDealPage'));
const AttacksArchivePage = lazy(() => import('./pages/AttacksArchivePage'));

const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const NukeSimulatorPage = lazy(() => import('./pages/NukeSimulatorPage'));
const WW3QuizPage = lazy(() => import('./pages/WW3QuizPage'));

// Trust Pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));

// Components
const BreakingAlert = lazy(() => import('./components/BreakingAlert'));
const WW3CounterHero = lazy(() => import('./components/WW3CounterHero'));
const WW3QuizHome = lazy(() => import('./components/WW3QuizHome'));
const BlogCard = lazy(() => import('./components/BlogCard'));
const BlogCardSmall = lazy(() => import('./components/BlogCardSmall'));
const EmailSignup = lazy(() => import('./components/EmailSignup'));
const NukeSimCTA = lazy(() => import('./components/NukeSimCTA'));


// Data
import { blogPosts } from './data/blogPosts';

// API
import { fetchGameState, getCachedData } from './lib/api';

// ==================== NAVIGATION ====================

const NavLinks = ({ mobile = false, onClose }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/blog', label: 'News' },
    { to: '/quiz', label: 'Quiz' },
    { to: '/nuke', label: 'Nuke Sim', external: true },
  ];

  if (mobile) {
    return (
      <div className="flex flex-col gap-2 py-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="text-gray-300 hover:text-white font-body text-sm py-2 px-3 rounded transition-colors"
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
      { to: '/blog', label: 'News' },
      { to: '/quiz', label: 'Quiz' },
    ].map(link => (
      <Link
        key={link.to}
        to={link.to}
        className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded transition-colors"
      >
        {link.label}
      </Link>
    ))}
    <a
      href="/nuke"
      className="text-gray-400 hover:text-white font-body text-sm px-3 py-2 rounded transition-colors"
    >
      Nuke Sim
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
      UPDATED: {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })} UTC
    </span>
  );
};

const Header = ({ isLoading }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 relative">
              <img src="/logo/globe-radar.svg" alt="WW3 Tracker" className="w-full h-full" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-white">
                WW3 Tracker
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
    <Link to="/blog" className="text-gray-500 hover:text-white text-xs font-body transition-colors">News</Link>
    <span className="text-gray-700">•</span>
    <Link to="/quiz" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Quiz</Link>
    <span className="text-gray-700">•</span>
    <Link to="/timeline" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Timeline</Link>
    <span className="text-gray-700">•</span>
    <a href="/nuke" className="text-gray-500 hover:text-white text-xs font-body transition-colors">Nuke Sim</a>
    <span className="text-gray-700">•</span>
    <Link to="/about" className="text-gray-500 hover:text-white text-xs font-body transition-colors">About</Link>
  </div>
);

const Disclaimer = () => (
  <div className="border-t border-white/10 py-6 sm:py-8 px-3 sm:px-4">
    <div className="max-w-2xl mx-auto text-center">
      <FooterNav />
      <h3 className="font-heading font-semibold text-base sm:text-lg text-white mb-1.5 sm:mb-2 uppercase tracking-wider">Disclaimer</h3>
      <p className="text-gray-500 text-xs sm:text-sm font-body mb-1.5 sm:mb-2">
        Live conflict data aggregated from Polymarket and verified sources.
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
      <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
      <p className="font-heading font-bold text-lg sm:text-xl text-white">Loading...</p>
    </div>
  </div>
);

// Homepage - Clean, minimal design with WW3 Counter as hero
function HomePage() {
  const cachedState = getCachedData('gameState');
  const [gameState, setGameState] = useState(cachedState || { tension: 35, breakingAlert: null });
  const [initialLoading, setInitialLoading] = useState(!cachedState);

  // Get blog posts - latest first
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestPost = sortedPosts[0];
  const morePosts = sortedPosts.slice(1, 3); // Only 2 more posts

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
    <>
      <PageSEO
        title="WW3 Tracker | Live Conflict Monitor"
        description="Real-time WW3 probability tracking and in-depth analysis of the US-Iran conflict."
        pathname="/"
      />
      
      <Helmet>
        <meta name="keywords" content="WW3 tracker, WW3 probability, Iran war, conflict monitor" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <Header />

        <Suspense fallback={null}>
          <BreakingAlert 
            alert={gameState.breakingAlert} 
            onDismiss={() => setGameState(prev => ({ ...prev, breakingAlert: null }))} 
          />
        </Suspense>

        <main className="max-w-4xl mx-auto px-4 py-6">
          
          {/* WW3 Counter - MAIN HERO ELEMENT */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[120px] bg-white/5 rounded-2xl animate-pulse" />}>
              <WW3CounterHero tension={gameState.tension} />
            </Suspense>
          </motion.section>

          {/* Quiz Section - Clean Design */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[350px] bg-white/5 rounded-2xl animate-pulse" />}>
              <WW3QuizHome />
            </Suspense>
          </motion.section>

          {/* Simple Blog Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Latest</h2>
              <Link to="/blog" className="text-xs text-orange-400 hover:text-orange-300">View all →</Link>
            </div>
            <div className="space-y-3">
              {latestPost && (
                <Suspense fallback={<div className="h-[100px] bg-white/5 rounded-xl animate-pulse" />}>
                  <BlogCard post={latestPost} />
                </Suspense>
              )}
              {morePosts.map(post => (
                <Suspense key={post.id} fallback={<div className="h-[80px] bg-white/5 rounded-xl animate-pulse" />}>
                  <BlogCardSmall post={post} />
                </Suspense>
              ))}
            </div>
          </motion.section>

          {/* Email Signup */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[100px] bg-white/5 rounded-xl animate-pulse" />}>
              <EmailSignup />
            </Suspense>
          </motion.section>

          <Disclaimer />
        </main>
      </div>
    </>
  );
}

// ==================== MAIN APP ====================

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Blog }
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={
            <Suspense fallback={<LoadingScreen />}>
              <BlogPostPage />
            </Suspense>
          } />
          
          {/* Nuke Simulator */}
          <Route path="/nuke" element={
            <Suspense fallback={<LoadingScreen />}>
              <NukeSimulatorPage />
            </Suspense>
          } />
          
          {/* New Pages */}
          <Route path="/timeline" element={
            <Suspense fallback={<LoadingScreen />}>
              <TimelinePage />
            </Suspense>
          } />
          
          {/* Quiz */}
          <Route path="/quiz" element={
            <Suspense fallback={<LoadingScreen />}>
              <WW3QuizPage />
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
          <Route path="/conflict-tracker" element={<Navigate to="/" replace />} />
          <Route path="/live-monitor" element={<Navigate to="/" replace />} />
          <Route path="/live-map" element={<Navigate to="/" replace />} />
          <Route path="/global-risk-monitor" element={<Navigate to="/" replace />} />
          <Route path="/ww3-risk-calculator" element={<Navigate to="/" replace />} />
          <Route path="/why-conflicts-happen" element={<Navigate to="/blog" replace />} />
          <Route path="/relationships" element={<Navigate to="/blog" replace />} />
          <Route path="/multi-conflict-timeline" element={<Navigate to="/timeline" replace />} />
          <Route path="/us-iran-war-tracker" element={<Navigate to="/iran-us-conflict" replace />} />
          <Route path="/iran-conflict-live" element={<Navigate to="/" replace />} />
          <Route path="/ww3-probability" element={<Navigate to="/" replace />} />
          
          {/* Trust Pages */}
          <Route path="/about" element={
            <Suspense fallback={<LoadingScreen />}>
              <AboutPage />
            </Suspense>
          } />
          <Route path="/privacy" element={
            <Suspense fallback={<LoadingScreen />}>
              <PrivacyPage />
            </Suspense>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

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
const WW3Counter = lazy(() => import('./components/WW3Counter'));
const WW3QuizHome = lazy(() => import('./components/WW3QuizHome'));

const EmailSignup = lazy(() => import('./components/EmailSignup'));
const LatestBlogHero = lazy(() => import('./components/LatestBlogHero'));
const BlogPostGrid = lazy(() => import('./components/BlogPostGrid'));
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

// Homepage - New welcoming design with quiz centerpiece
function HomePage() {
  const cachedState = getCachedData('gameState');
  const [gameState, setGameState] = useState(cachedState || { tension: 35, breakingAlert: null });
  const [initialLoading, setInitialLoading] = useState(!cachedState);

  // Get blog posts - latest first
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestPost = sortedPosts[0];
  const morePosts = sortedPosts.slice(1, 4);

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
        title="WW3 Tracker | Understanding the US-Iran Conflict"
        description="Clear, fact-based analysis of the US-Iran war. Test your knowledge, track developments, and understand what's really happening."
        pathname="/"
      />
      
      <Helmet>
        <meta name="keywords" content="US-Iran war, Iran conflict, WW3 tracker, World War 3, US strikes Iran, Iran missiles, war analysis" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Header />

        <Suspense fallback={null}>
          <BreakingAlert 
            alert={gameState.breakingAlert} 
            onDismiss={() => setGameState(prev => ({ ...prev, breakingAlert: null }))} 
          />
        </Suspense>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section - Welcoming */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Understanding the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">US-Iran Conflict</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Clear, fact-based analysis of what's happening and why it matters. 
              No sensationalism. No noise. Just the story.
            </p>
          </motion.section>

          {/* WW3 Counter - Real-time Tension */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[60px] bg-white/5 rounded-xl animate-pulse" />}>
              <WW3Counter tension={gameState.tension} />
            </Suspense>
          </motion.section>

          {/* Two Column Layout: Quiz + Latest News */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Quiz Column */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Test Your Knowledge</h2>
                <span className="text-xs text-gray-500">15 questions</span>
              </div>
              <Suspense fallback={<div className="h-[400px] bg-white/5 rounded-2xl animate-pulse" />}>
                <WW3QuizHome />
              </Suspense>
            </motion.section>

            {/* News Column */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Latest Analysis</h2>
                <a href="/blog" className="text-sm text-orange-400 hover:text-orange-300">View all</a>
              </div>
              <div className="space-y-4">
                {latestPost && (
                  <Suspense fallback={<div className="h-[200px] bg-white/5 rounded-xl animate-pulse" />}>
                    <LatestBlogHero post={latestPost} />
                  </Suspense>
                )}
                {morePosts.length > 0 && (
                  <Suspense fallback={<div className="h-[150px] bg-white/5 rounded-xl animate-pulse" />}>
                    <BlogPostGrid posts={morePosts} />
                  </Suspense>
                )}
              </div>
            </motion.section>
          </div>

          {/* Stats Row */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              { label: 'Conflict Started', value: 'March 17, 2026' },
              { label: 'Days Active', value: Math.floor((new Date() - new Date('2026-03-17')) / (1000 * 60 * 60 * 24)) },
              { label: 'Articles', value: '40+' },
              { label: 'Data Sources', value: 'Verified' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.section>

          {/* Nuke Sim CTA */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[80px] bg-white/5 rounded-xl animate-pulse" />}>
              <NukeSimCTA />
            </Suspense>
          </motion.section>

          {/* Email Signup */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Suspense fallback={<div className="h-[150px] bg-white/5 rounded-xl animate-pulse" />}>
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

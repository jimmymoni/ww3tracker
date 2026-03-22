import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load the timeline component
const ConflictEscalationTimeline = lazy(() => import('../components/ConflictEscalationTimeline'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

export default function TimelinePage() {
  return (
    <>
      <Helmet>
        <title>Escalation Timeline | WW3 Tracker</title>
        <meta name="description" content="Interactive timeline of events leading to the US-Iran conflict. Track causation chains and understand how tensions escalated." />
        <meta property="og:title" content="Escalation Timeline | WW3 Tracker" />
        <meta property="og:description" content="Visual timeline showing the chain of events that led to current conflicts." />
      </Helmet>

      <div className="min-h-screen bg-grid text-white pb-16">
        {/* Simple Header */}
        <header className="sticky top-0 z-40 bg-[#0d0d12]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-white">
                  Escalation Timeline
                </h1>
                <p className="text-gray-500 text-sm">
                  Track the chain of events — understand how we got here and what triggered each escalation
                </p>
              </div>
            </div>
          </motion.div>

          {/* Full Timeline */}
          <Suspense fallback={<LoadingFallback />}>
            <ConflictEscalationTimeline />
          </Suspense>

          {/* Navigation Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <Link to="/" className="text-gray-500 hover:text-white transition-colors">
              ← Back to Home
            </Link>
            <span className="text-gray-700">•</span>

            <Link to="/live-map" className="text-gray-500 hover:text-white transition-colors">
              Live Conflict Map →
            </Link>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">DISCLAIMER</h3>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Timeline shows verified events and their causal relationships. 
              Some timing and attribution may be based on publicly available reports.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

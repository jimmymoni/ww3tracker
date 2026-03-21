import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, Skull } from 'lucide-react';
import { Link } from 'react-router-dom';

// Lazy load the dashboard component
const HumanImpactDashboard = lazy(() => import('../components/HumanImpactDashboard'));

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
  </div>
);

export default function ImpactPage() {
  return (
    <>
      <Helmet>
        <title>Human Impact Dashboard | WW3 Tracker</title>
        <meta name="description" content="Track the human cost of the US-Iran conflict. Casualty estimates, displaced persons, infrastructure damage, and economic impact data." />
        <meta property="og:title" content="Human Impact Dashboard | WW3 Tracker" />
        <meta property="og:description" content="Real-time data on casualties, refugees, and infrastructure damage from the ongoing conflict." />
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
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Skull className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-white">
                  Human Impact Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                  The real cost of conflict — casualties, displacement, and infrastructure damage
                </p>
              </div>
            </div>
          </motion.div>

          {/* Full Dashboard */}
          <Suspense fallback={<LoadingFallback />}>
            <HumanImpactDashboard />
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
            <Link to="/timeline" className="text-gray-500 hover:text-white transition-colors">
              View Escalation Timeline →
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
              Data represents best available estimates from verified sources. 
              Actual figures may vary. We are working to integrate ACLED for real-time verified casualty data.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

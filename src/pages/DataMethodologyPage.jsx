import { motion } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle, Database, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';

const DataMethodologyPage = () => {
  return (
    <>
      <SEO 
        title="Data Methodology - WW3 Tracker"
        description="How we collect, verify, and report conflict data. Our sources, confidence levels, and limitations."
      />
      
      <div className="min-h-screen bg-[#0d0d12]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold text-white mb-4">
                Data Methodology
              </h1>
              <p className="text-gray-400">
                How we collect, verify, and report conflict data. Transparency is essential when reporting on war.
              </p>
            </div>

            {/* Data Status Banner */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-1">Current Data Status</h3>
                  <p className="text-sm text-yellow-200/70">
                    We are currently using a hybrid approach: manually verified attack locations combined with 
                    estimated casualty figures from news reports. We are working to integrate ACLED API for 
                    real-time, verified casualty data.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <section className="mb-8">
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Our Data Sources
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Attack Locations & Events</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Manually verified from Reuters, AP, BBC reports</li>
                    <li>• Cross-referenced with multiple sources</li>
                    <li>• Geocoded for map accuracy</li>
                    <li>• Updated within 1-6 hours of confirmed events</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Casualty Estimates</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Collated from news reports (Reuters, AP, BBC, Al Jazeera)</li>
                    <li>• Marked as confirmed (multiple sources) or estimated (single source)</li>
                    <li>• Currently integrating ACLED API for verified figures</li>
                    <li>• Note: Actual casualties often higher than reported</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Satellite Data</h3>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• NASA FIRMS (Fire Information for Resource Management System)</li>
                    <li>• Real-time fire detection from VIIRS satellites</li>
                    <li>• Helps verify attack locations and damage assessment</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Confidence Levels */}
            <section className="mb-8">
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Confidence Levels
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="text-green-400 font-semibold mb-2">High Confidence</div>
                  <p className="text-sm text-gray-400">
                    Multiple independent sources confirm. Usually includes official statements, 
                    verified photos/video, and satellite confirmation.
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="text-yellow-400 font-semibold mb-2">Medium Confidence</div>
                  <p className="text-sm text-gray-400">
                    Single credible source (major news outlet) or multiple unverified reports 
                    with consistent details.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-red-400 font-semibold mb-2">Low Confidence</div>
                  <p className="text-sm text-gray-400">
                    Single unverified source, social media claims, or conflicting reports. 
                    Marked clearly as unverified.
                  </p>
                </div>
              </div>
            </section>

            {/* Known Limitations */}
            <section className="mb-8">
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Known Limitations
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-400 space-y-2">
                <p>• <strong className="text-white">Underreporting:</strong> Many casualties go unreported, especially in restricted areas.</p>
                <p>• <strong className="text-white">Propaganda:</strong> All sides may inflate enemy losses and minimize their own.</p>
                <p>• <strong className="text-white">Access:</strong> Journalists cannot access many conflict zones, limiting verification.</p>
                <p>• <strong className="text-white">Delays:</strong> Confirmation can take hours to days, especially for remote areas.</p>
              </div>
            </section>

            {/* Email Data Storage */}
            <section className="mb-8">
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Email Alert Privacy
              </h2>
              
              <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-400 space-y-2">
                <p>• <strong className="text-white">Storage:</strong> Email addresses are stored securely in our database.</p>
                <p>• <strong className="text-white">Usage:</strong> We only send alerts for conflicts you subscribe to. No spam, no marketing.</p>
                <p>• <strong className="text-white">Unsubscribe:</strong> One-click unsubscribe available in every email.</p>
                <p>• <strong className="text-white">Data sharing:</strong> We never sell or share your email with third parties.</p>
              </div>
            </section>

            {/* External Resources */}
            <section>
              <h2 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                External Resources
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="https://acleddata.com" target="_blank" rel="noopener" 
                   className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                  <div className="text-white font-semibold mb-1">ACLED</div>
                  <p className="text-sm text-gray-400">Armed Conflict Location & Event Data</p>
                </a>
                
                <a href="https://data.humdata.org" target="_blank" rel="noopener"
                   className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                  <div className="text-white font-semibold mb-1">UN OCHA</div>
                  <p className="text-sm text-gray-400">UN Humanitarian Data</p>
                </a>
                
                <a href="https://www.airwars.org" target="_blank" rel="noopener"
                   className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                  <div className="text-white font-semibold mb-1">Airwars</div>
                  <p className="text-sm text-gray-400">Civilian casualties from airstrikes</p>
                </a>
                
                <a href="https://ucdp.uu.se" target="_blank" rel="noopener"
                   className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
                  <div className="text-white font-semibold mb-1">UCDP</div>
                  <p className="text-sm text-gray-400">Uppsala Conflict Data Program</p>
                </a>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DataMethodologyPage;

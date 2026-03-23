import { Helmet } from 'react-helmet-async';
import { PageSEO } from '../components/SEO';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      <PageSEO
        title="About WW3 Tracker | Mission & Editorial Standards"
        description="WW3 Tracker provides real-time monitoring of the US-Iran conflict with verified data, satellite intelligence, and unbiased analysis."
        url="/about"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
              About WW3 Tracker
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real-time conflict monitoring with verified data and unbiased analysis
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            WW3 Tracker was created in 2025 to provide accurate, real-time information about escalating 
            geopolitical conflicts. When the US-Iran war began in March 2026, we shifted our focus to 
            provide comprehensive coverage of this critical conflict.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our goal is simple: cut through propaganda and misinformation to show you what is actually 
            happening. We verify every attack, double-check every claim, and present the facts without 
            political spin.
          </p>
        </section>

        {/* Data Methodology */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Data Methodology</h2>
          <div className="space-y-4 text-gray-300">
            <p className="leading-relaxed">
              <strong className="text-white">Verification Standard:</strong> Every attack in our database 
              must meet strict criteria before publication:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Multiple independent sources (Reuters, AP, BBC, NYT, Al Jazeera)</li>
              <li>Official government or military confirmation</li>
              <li>Geolocated evidence (photos, video, satellite imagery)</li>
              <li>Consistent details across multiple reports</li>
            </ul>
            <p className="leading-relaxed mt-4">
              <strong className="text-white">What We Exclude:</strong> Unconfirmed social media claims, 
              single-source reports, propaganda from either side, and reports later debunked.
            </p>
          </div>
        </section>

        {/* Editorial Standards */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Editorial Standards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Unbiased Reporting</h3>
              <p className="text-gray-400 text-sm">
                We present facts, not opinions. Every claim is attributed to its source.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Real-Time Updates</h3>
              <p className="text-gray-400 text-sm">
                Our database updates as attacks are verified—typically within 1-6 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Source Transparency</h3>
              <p className="text-gray-400 text-sm">
                Every data point links to its original source. No black boxes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Correction Policy</h3>
              <p className="text-gray-400 text-sm">
                Errors are corrected promptly with clear notation of changes.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Data Sources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📡</div>
              <h3 className="font-semibold text-white">NASA FIRMS</h3>
              <p className="text-gray-400 text-sm">Satellite fire detection for attack verification</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📰</div>
              <h3 className="font-semibold text-white">News Agencies</h3>
              <p className="text-gray-400 text-sm">Reuters, AP, BBC, and verified journalists</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🗺️</div>
              <h3 className="font-semibold text-white">Geolocation</h3>
              <p className="text-gray-400 text-sm">Satellite imagery and coordinate verification</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-6">
            Questions, corrections, or media inquiries? Reach out to our team.
          </p>
          <a 
            href="mailto:contact@ww3tracker.live" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            contact@ww3tracker.live
          </a>
        </section>

        {/* Disclaimer */}
        <section className="mt-12 text-center text-gray-500 text-sm">
          <p>
            WW3 Tracker is an educational and journalistic project. We do not promote violence or conflict. 
            Our goal is to help people understand complex geopolitical situations through data.
          </p>
        </section>
      </div>
    </div>
  );
}

import { Helmet } from 'react-helmet-async';
import { PageSEO } from '../components/SEO';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0d0d12] text-white">
      <PageSEO
        title="Privacy Policy | WW3 Tracker"
        description="WW3 Tracker privacy policy. Learn how we handle your data and protect your privacy."
        url="/privacy"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Last updated: March 23, 2026
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            WW3 Tracker respects your privacy. This Privacy Policy explains how we collect, use, and 
            protect your personal information when you use our website. By using WW3 Tracker, you 
            agree to the practices described in this policy.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Information We Collect</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Email Addresses</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                When you subscribe to our email alerts, we collect your email address to send you 
                notifications about significant conflict developments. You can unsubscribe at any time.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Analytics Data</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We use Google Analytics to understand how visitors interact with our website. This 
                includes information like pages visited, time spent on site, and general geographic 
                location (city/country level only). This data is anonymized and cannot identify you 
                personally.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-2">Technical Information</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our servers automatically collect standard log information including your IP address, 
                browser type, referring pages, and operating system. This is used for security and 
                performance monitoring.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">How We Use Your Information</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              To send email alerts you have subscribed to
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              To improve our website and user experience
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              To monitor and prevent security issues
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-3">•</span>
              To comply with legal obligations
            </li>
          </ul>
        </section>

        {/* Data Protection */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Data Protection</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction. 
            However, no internet transmission is completely secure, and we cannot guarantee absolute 
            security.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Email addresses are stored securely and are never sold, rented, or shared with third 
            parties for marketing purposes.
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Cookies</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            WW3 Tracker uses minimal cookies:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li><strong className="text-white">Essential cookies:</strong> Required for the website to function properly</li>
            <li><strong className="text-white">Analytics cookies:</strong> Used by Google Analytics to understand site usage</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-4">
            You can disable cookies in your browser settings, but this may affect website functionality.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Third-Party Services</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            We use the following third-party services:
          </p>
          <ul className="space-y-3 text-gray-300">
            <li>
              <strong className="text-white">Google Analytics</strong> — For website analytics. 
              <a href="https://policies.google.com/privacy" className="text-blue-400 hover:text-blue-300 ml-1" target="_blank" rel="noopener noreferrer">
                Privacy Policy →
              </a>
            </li>
            <li>
              <strong className="text-white">SendGrid</strong> — For email delivery. 
              <a href="https://www.twilio.com/legal/privacy" className="text-blue-400 hover:text-blue-300 ml-1" target="_blank" rel="noopener noreferrer">
                Privacy Policy →
              </a>
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="mb-12 bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Your Rights</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            You have the right to:
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>• Access the personal information we hold about you</li>
            <li>• Request correction of inaccurate information</li>
            <li>• Request deletion of your personal information</li>
            <li>• Unsubscribe from email alerts at any time</li>
            <li>• Opt out of analytics tracking</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-6">
            If you have any questions about this Privacy Policy or your data, please contact us.
          </p>
          <a 
            href="mailto:privacy@ww3tracker.live" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            privacy@ww3tracker.live
          </a>
        </section>

        {/* Changes to Policy */}
        <section className="mt-12 text-center text-gray-500 text-sm">
          <p className="mb-2">
            We may update this Privacy Policy from time to time. Any changes will be posted on this 
            page with an updated revision date.
          </p>
          <p>
            © 2026 WW3 Tracker. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}

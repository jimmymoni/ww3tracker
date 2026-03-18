import React, { useState } from 'react';
import { Bell, Shield, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ZONE_OPTIONS = [
  { id: 'us-iran', label: 'US-Iran', description: 'US-Iran conflict zone' },
  { id: 'pak-afghan', label: 'Pak-Afghan', description: 'Pakistan-Afghanistan border' },
  { id: 'israel-hezb', label: 'Israel-Hezb', description: 'Israel-Hezbollah conflict' },
  { id: 'all', label: 'All Zones', description: 'Monitor all conflict zones' }
];

const FREQUENCY_OPTIONS = [
  { id: 'breaking', label: 'Breaking Only', description: 'Immediate alerts for major events' },
  { id: 'daily', label: 'Daily Digest', description: 'Once-daily summary of all events' },
  { id: 'all', label: 'All Updates', description: 'Breaking + daily digest' }
];

export default function EmailSignup({ onSuccess, className = '' }) {
  const [email, setEmail] = useState('');
  const [selectedZones, setSelectedZones] = useState(['us-iran']);
  const [frequency, setFrequency] = useState('breaking');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleZoneToggle = (zoneId) => {
    if (zoneId === 'all') {
      // If selecting "all", unselect others
      setSelectedZones(['all']);
    } else {
      // If selecting specific zone, remove "all" if present
      setSelectedZones(prev => {
        const withoutAll = prev.filter(z => z !== 'all');
        if (prev.includes(zoneId)) {
          // Don't allow unchecking the last zone
          const newZones = withoutAll.filter(z => z !== zoneId);
          return newZones.length > 0 ? newZones : [zoneId];
        } else {
          return [...withoutAll, zoneId];
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !acceptedTerms) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          zones: selectedZones,
          frequency
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        if (onSuccess) onSuccess(data.subscriber);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`comic-panel p-6 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="font-heading text-xl text-white mb-2">You&apos;re Subscribed!</h3>
        <p className="text-gray-400 text-sm">
          Watch your inbox for alerts. You can manage preferences or unsubscribe anytime.
        </p>
      </div>
    );
  }

  return (
    <div className={`comic-panel ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-heading text-lg text-white">Get Conflict Alerts</h3>
            <p className="text-gray-400 text-sm">Verified events, no spam</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
                disabled={status === 'loading'}
              />
            </div>
          </div>

          {/* Zone Selection */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Monitor Zones
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ZONE_OPTIONS.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => handleZoneToggle(zone.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedZones.includes(zone.id)
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-black/20 border-gray-700 hover:border-gray-600'
                  }`}
                  disabled={status === 'loading'}
                >
                  <div className="font-medium text-white text-sm">{zone.label}</div>
                  <div className="text-gray-500 text-xs">{zone.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Alert Frequency */}
          <div className="mb-5">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Alert Frequency
            </label>
            <div className="space-y-2">
              {FREQUENCY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    frequency === opt.id
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-black/20 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={opt.id}
                    checked={frequency === opt.id}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="sr-only"
                    disabled={status === 'loading'}
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    frequency === opt.id ? 'border-blue-400' : 'border-gray-500'
                  }`}>
                    {frequency === opt.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">{opt.label}</div>
                    <div className="text-gray-500 text-xs">{opt.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 bg-black/30 text-blue-500 focus:ring-blue-500"
                disabled={status === 'loading'}
              />
              <span className="text-gray-400 text-sm">
                I agree to receive conflict alerts. We respect your privacy and won&apos;t share your email.
              </span>
            </label>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 mb-5 text-gray-500 text-xs">
            <Shield className="w-4 h-4" />
            <span>We don&apos;t spam. Unsubscribe anytime. Verified events only.</span>
          </div>

          {/* Error Message */}
          {status === 'error' && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim() || !acceptedTerms}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Bell className="w-5 h-5" />
                Subscribe to Alerts
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

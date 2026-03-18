import React, { useState } from 'react';
import { Bell, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function EmailSignup({ onSuccess, className = '' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/alerts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          zones: ['all'],
          frequency: 'breaking'
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
      setErrorMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`bg-[#14141c] border border-white/10 rounded-xl p-6 text-center ${className}`}>
        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <h3 className="font-heading text-lg text-white mb-1">Subscribed!</h3>
        <p className="text-gray-500 text-sm">Breaking alerts will arrive in your inbox.</p>
      </div>
    );
  }

  return (
    <div className={`bg-[#14141c] border border-white/10 rounded-xl p-5 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-5 h-5 text-blue-400" />
        <div>
          <h3 className="font-heading text-white">Get Breaking Alerts</h3>
          <p className="text-gray-500 text-xs">Major events only. Unsubscribe anytime.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Input + Button Inline */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              required
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading' || !email.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="flex items-center gap-2 mt-3 text-red-400 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}

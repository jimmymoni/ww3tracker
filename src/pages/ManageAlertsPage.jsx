import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AlertPreferences from '../components/AlertPreferences';
import { Bell, ArrowLeft } from 'lucide-react';

export default function ManageAlertsPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const action = searchParams.get('action');

  const handleUnsubscribe = () => {
    // Redirect to home after unsubscribe
    window.location.href = '/?unsubscribed=true';
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Back Link */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </a>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="font-heading text-3xl text-white mb-2">
            Manage Your Alerts
          </h1>
          <p className="text-gray-400">
            Update your preferences or unsubscribe from WW3 Tracker alerts
          </p>
        </div>

        {/* Preferences Component */}
        <AlertPreferences 
          token={token}
          onUnsubscribe={handleUnsubscribe}
        />

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Having trouble? Contact us at{' '}
            <a href="mailto:support@ww3tracker.live" className="text-red-400 hover:underline">
              support@ww3tracker.live
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

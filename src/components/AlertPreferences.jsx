import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  BellOff, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  MapPin,
  Clock,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

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

export default function AlertPreferences({ token, onUnsubscribe, className = '' }) {
  const [subscriber, setSubscriber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showUnsubscribeConfirm, setShowUnsubscribeConfirm] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  // Form state
  const [selectedZones, setSelectedZones] = useState([]);
  const [frequency, setFrequency] = useState('breaking');
  const [expandedSections, setExpandedSections] = useState({
    zones: true,
    frequency: true
  });

  useEffect(() => {
    fetchSubscriber();
  }, [token]);

  const fetchSubscriber = async () => {
    if (!token) {
      setError('Invalid or missing subscription token');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/alerts/preferences?token=${token}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setSubscriber(data.subscriber);
        setSelectedZones(data.subscriber.zones);
        setFrequency(data.subscriber.frequency);
      } else {
        setError(data.error || 'Failed to load subscription details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleZoneToggle = (zoneId) => {
    if (zoneId === 'all') {
      setSelectedZones(['all']);
    } else {
      setSelectedZones(prev => {
        const withoutAll = prev.filter(z => z !== 'all');
        if (prev.includes(zoneId)) {
          const newZones = withoutAll.filter(z => z !== zoneId);
          return newZones.length > 0 ? newZones : [zoneId];
        } else {
          return [...withoutAll, zoneId];
        }
      });
    }
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!subscriber) return;

    setSaving(true);
    setSaveSuccess(false);
    setError('');

    try {
      const response = await fetch('/api/alerts/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: subscriber.token,
          zones: selectedZones,
          frequency
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscriber(data.subscriber);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update preferences');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscriber) return;

    setUnsubscribing(true);

    try {
      const response = await fetch('/api/alerts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: subscriber.token })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (onUnsubscribe) onUnsubscribe();
      } else {
        setError(data.error || 'Failed to unsubscribe');
        setShowUnsubscribeConfirm(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setShowUnsubscribeConfirm(false);
    } finally {
      setUnsubscribing(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasChanges = subscriber && (
    JSON.stringify(selectedZones.sort()) !== JSON.stringify(subscriber.zones.sort()) ||
    frequency !== subscriber.frequency
  );

  if (loading) {
    return (
      <div className={`comic-panel p-8 text-center ${className}`}>
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading your preferences...</p>
      </div>
    );
  }

  if (error && !subscriber) {
    return (
      <div className={`comic-panel p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="font-heading text-lg text-white mb-2">Unable to Load</h3>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ExternalLink className="w-4 h-4" />
          Return to Dashboard
        </a>
      </div>
    );
  }

  if (showUnsubscribeConfirm) {
    return (
      <div className={`comic-panel p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="font-heading text-xl text-white mb-2">Unsubscribe?</h3>
          <p className="text-gray-400 text-sm">
            You&apos;ll no longer receive any conflict alerts at:<br />
            <span className="text-white">{subscriber?.email}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowUnsubscribeConfirm(false)}
            disabled={unsubscribing}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Keep Alerts
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={unsubscribing}
            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {unsubscribing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Unsubscribe
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`comic-panel ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg text-white">Alert Preferences</h3>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {subscriber?.email}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            Active
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Zone Preferences */}
        <div className="mb-4 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('zones')}
            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">Monitored Zones</span>
            </div>
            {expandedSections.zones ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.zones && (
            <div className="p-4 bg-black/10">
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
                  >
                    <div className="font-medium text-white text-sm">{zone.label}</div>
                    <div className="text-gray-500 text-xs">{zone.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Frequency Preferences */}
        <div className="mb-6 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('frequency')}
            className="w-full flex items-center justify-between p-4 bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-white font-medium">Alert Frequency</span>
            </div>
            {expandedSections.frequency ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.frequency && (
            <div className="p-4 bg-black/10">
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
                      onChange={(e) => {
                        setFrequency(e.target.value);
                        setSaveSuccess(false);
                      }}
                      className="sr-only"
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
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-black/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{subscriber?.alertCount || 0}</div>
            <div className="text-gray-500 text-xs">Alerts Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {subscriber?.createdAt ? new Date(subscriber.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
            </div>
            <div className="text-gray-500 text-xs">Subscribed Since</div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mb-3"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Settings className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>

        {/* Unsubscribe Link */}
        <button
          onClick={() => setShowUnsubscribeConfirm(true)}
          className="w-full py-3 text-gray-500 hover:text-red-400 text-sm transition-colors flex items-center justify-center gap-2"
        >
          <BellOff className="w-4 h-4" />
          Unsubscribe from All Alerts
        </button>
      </div>
    </div>
  );
}

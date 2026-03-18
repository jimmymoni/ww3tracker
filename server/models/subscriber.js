/**
 * Subscriber Model
 * In-memory storage for email alert subscribers
 * MVP approach - can be upgraded to database later
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path for persistent storage (JSON file)
const DATA_FILE = path.join(__dirname, '../data/subscribers.json');

// In-memory storage
let subscribers = new Map();
let isInitialized = false;

// Valid zones and frequencies
const VALID_ZONES = ['us-iran', 'pak-afghan', 'israel-hezb', 'all'];
const VALID_FREQUENCIES = ['breaking', 'daily', 'all'];

/**
 * Initialize subscriber storage
 * Load from JSON file if exists
 */
function initialize() {
  if (isInitialized) return;

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      
      // Convert array back to Map
      if (Array.isArray(parsed)) {
        parsed.forEach(sub => {
          subscribers.set(sub.email.toLowerCase(), {
            ...sub,
            createdAt: new Date(sub.createdAt),
            updatedAt: new Date(sub.updatedAt),
            lastAlertAt: sub.lastAlertAt ? new Date(sub.lastAlertAt) : null
          });
        });
      }
      console.log(`[SubscriberModel] Loaded ${subscribers.size} subscribers from disk`);
    }
  } catch (error) {
    console.error('[SubscriberModel] Error loading subscribers:', error.message);
  }

  isInitialized = true;
}

/**
 * Persist subscribers to JSON file
 */
function saveToDisk() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const data = Array.from(subscribers.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('[SubscriberModel] Error saving subscribers:', error.message);
  }
}

/**
 * Generate unique subscription token
 */
function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create new subscriber
 * @param {Object} subscriberData
 * @returns {Object} Result with success flag and message
 */
function create(subscriberData) {
  initialize();

  const { email, zones, frequency } = subscriberData;

  // Validation
  if (!email || !isValidEmail(email)) {
    return { success: false, error: 'Valid email required' };
  }

  if (!zones || !Array.isArray(zones) || zones.length === 0) {
    return { success: false, error: 'At least one zone must be selected' };
  }

  // Validate zones
  const invalidZones = zones.filter(z => !VALID_ZONES.includes(z));
  if (invalidZones.length > 0) {
    return { success: false, error: `Invalid zones: ${invalidZones.join(', ')}` };
  }

  // Validate frequency
  const alertFrequency = frequency || 'breaking';
  if (!VALID_FREQUENCIES.includes(alertFrequency)) {
    return { success: false, error: `Invalid frequency: ${alertFrequency}` };
  }

  const normalizedEmail = email.toLowerCase();

  // Check if already subscribed
  if (subscribers.has(normalizedEmail)) {
    return { success: false, error: 'Email already subscribed' };
  }

  const subscriber = {
    email: normalizedEmail,
    zones: zones.includes('all') ? ['all'] : zones,
    frequency: alertFrequency,
    token: generateToken(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastAlertAt: null,
    alertCount: 0
  };

  subscribers.set(normalizedEmail, subscriber);
  saveToDisk();

  console.log(`[SubscriberModel] New subscriber: ${normalizedEmail}`);
  
  return { 
    success: true, 
    subscriber: {
      email: subscriber.email,
      zones: subscriber.zones,
      frequency: subscriber.frequency,
      token: subscriber.token
    }
  };
}

/**
 * Get subscriber by email
 */
function getByEmail(email) {
  initialize();
  return subscribers.get(email.toLowerCase()) || null;
}

/**
 * Get subscriber by token
 */
function getByToken(token) {
  initialize();
  for (const subscriber of subscribers.values()) {
    if (subscriber.token === token) {
      return subscriber;
    }
  }
  return null;
}

/**
 * Update subscriber preferences
 */
function update(email, updates) {
  initialize();

  const normalizedEmail = email.toLowerCase();
  const subscriber = subscribers.get(normalizedEmail);

  if (!subscriber) {
    return { success: false, error: 'Subscriber not found' };
  }

  // Update zones if provided
  if (updates.zones) {
    const invalidZones = updates.zones.filter(z => !VALID_ZONES.includes(z));
    if (invalidZones.length > 0) {
      return { success: false, error: `Invalid zones: ${invalidZones.join(', ')}` };
    }
    subscriber.zones = updates.zones.includes('all') ? ['all'] : updates.zones;
  }

  // Update frequency if provided
  if (updates.frequency) {
    if (!VALID_FREQUENCIES.includes(updates.frequency)) {
      return { success: false, error: `Invalid frequency: ${updates.frequency}` };
    }
    subscriber.frequency = updates.frequency;
  }

  subscriber.updatedAt = new Date();
  saveToDisk();

  return { 
    success: true, 
    subscriber: {
      email: subscriber.email,
      zones: subscriber.zones,
      frequency: subscriber.frequency,
      token: subscriber.token
    }
  };
}

/**
 * Unsubscribe (soft delete - mark inactive)
 */
function unsubscribe(emailOrToken) {
  initialize();

  let subscriber = subscribers.get(emailOrToken.toLowerCase());
  
  if (!subscriber) {
    // Try by token
    subscriber = getByToken(emailOrToken);
  }

  if (!subscriber) {
    return { success: false, error: 'Subscriber not found' };
  }

  subscriber.isActive = false;
  subscriber.updatedAt = new Date();
  saveToDisk();

  console.log(`[SubscriberModel] Unsubscribed: ${subscriber.email}`);

  return { success: true, message: 'Successfully unsubscribed' };
}

/**
 * Hard delete subscriber (admin use)
 */
function remove(email) {
  initialize();
  
  const normalizedEmail = email.toLowerCase();
  const deleted = subscribers.delete(normalizedEmail);
  
  if (deleted) {
    saveToDisk();
  }

  return { success: deleted };
}

/**
 * Get all active subscribers for a zone
 */
function getActiveByZone(zone) {
  initialize();

  const results = [];
  for (const subscriber of subscribers.values()) {
    if (!subscriber.isActive) continue;
    
    // Match if 'all' zones or specific zone
    if (subscriber.zones.includes('all') || subscriber.zones.includes(zone)) {
      results.push(subscriber);
    }
  }
  return results;
}

/**
 * Get all active subscribers
 */
function getAllActive() {
  initialize();
  return Array.from(subscribers.values()).filter(s => s.isActive);
}

/**
 * Get subscribers by frequency type
 */
function getByFrequency(frequency) {
  initialize();
  return getAllActive().filter(s => 
    s.frequency === frequency || s.frequency === 'all'
  );
}

/**
 * Increment alert count for subscriber
 */
function incrementAlertCount(email) {
  initialize();
  
  const subscriber = subscribers.get(email.toLowerCase());
  if (subscriber) {
    subscriber.alertCount++;
    subscriber.lastAlertAt = new Date();
    saveToDisk();
  }
}

/**
 * Get subscription stats
 */
function getStats() {
  initialize();

  const all = Array.from(subscribers.values());
  const active = all.filter(s => s.isActive);

  return {
    total: all.length,
    active: active.length,
    inactive: all.length - active.length,
    byFrequency: {
      breaking: active.filter(s => s.frequency === 'breaking').length,
      daily: active.filter(s => s.frequency === 'daily').length,
      all: active.filter(s => s.frequency === 'all').length
    },
    byZone: {
      'us-iran': active.filter(s => s.zones.includes('us-iran') || s.zones.includes('all')).length,
      'pak-afghan': active.filter(s => s.zones.includes('pak-afghan') || s.zones.includes('all')).length,
      'israel-hezb': active.filter(s => s.zones.includes('israel-hezb') || s.zones.includes('all')).length
    }
  };
}

export {
  create,
  getByEmail,
  getByToken,
  update,
  unsubscribe,
  remove,
  getActiveByZone,
  getAllActive,
  getByFrequency,
  incrementAlertCount,
  getStats,
  VALID_ZONES,
  VALID_FREQUENCIES
};

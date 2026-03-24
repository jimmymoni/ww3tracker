/**
 * Auto-Publisher Pipeline
 * 
 * When developer confirms attacks in Telegram, this system:
 * 1. Updates database
 * 2. Regenerates attack pages
 * 3. Rebuilds site
 * 4. Deploys to Railway
 * 5. Schedules tweets
 * 6. Sends notifications
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VERIFIED_ATTACKS } from '../data/verifiedAttacks.js';
import scheduler from './scheduler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '../..');

class AutoPublisher {
  constructor() {
    this.logs = [];
  }

  /**
   * Main publish pipeline
   * @param {Object} attackData - Raw attack data from Telegram/command
   * @returns {Object} Result with steps and status
   */
  async publishAttack(attackData) {
    const steps = [];
    const startTime = Date.now();

    this.log('info', 'Starting auto-publish pipeline', { headline: attackData.headline });

    try {
      // Step 1: Validate attack data
      this.validateAttackData(attackData);
      steps.push('✅ Data validated');

      // Step 2: Format and add to database
      const attack = this.formatAttack(attackData);
      const added = addAttack(attack);
      
      if (!added) {
        throw new Error('Attack already exists (duplicate location within 6 hours)');
      }
      
      this.persistDatabase();
      steps.push(`✅ Database updated: ${attack.id}`);
      this.log('success', 'Attack added to database', { id: attack.id });

      // Step 3: Update sitemap with new attack URL
      await this.updateSitemap(attack);
      steps.push('✅ Sitemap updated');

      // Step 4: Git commit and push
      const commitResult = await this.gitCommit(attack);
      if (commitResult.pushed) {
        steps.push('✅ Committed and pushed to git');
      } else {
        steps.push('⚠️ Git commit skipped or failed');
      }

      // Step 5: Railway auto-deploys on git push
      steps.push('⏳ Railway deploying... (auto-deploy enabled)');

      // Step 6: Schedule social distribution
      const distribution = await this.scheduleDistribution(attack);
      steps.push(`⏳ Tweet scheduled: ${distribution.tweetDelay || 'N/A'}min`);
      if (distribution.emailBatch) {
        steps.push(`✅ Email alerts queued: ${distribution.email?.queued || 0} subscribers`);
      }

      const duration = Date.now() - startTime;
      this.log('success', 'Publish pipeline completed', { duration: `${duration}ms` });

      return {
        success: true,
        steps,
        attackId: attack.id,
        attack,
        distribution,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.log('error', 'Publish pipeline failed', { error: error.message });
      
      return {
        success: false,
        error: error.message,
        steps,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate attack data before processing
   * @param {Object} data 
   */
  validateAttackData(data) {
    const required = ['headline', 'location', 'country', 'coordinates'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate coordinates
    if (!data.coordinates.lat || !data.coordinates.lng) {
      throw new Error('Coordinates must include lat and lng');
    }

    // Validate confidence if provided
    const validConfidence = ['HIGH', 'MEDIUM', 'LOW'];
    if (data.confidence && !validConfidence.includes(data.confidence.toUpperCase())) {
      throw new Error(`Invalid confidence: ${data.confidence}. Must be HIGH, MEDIUM, or LOW`);
    }

    this.log('info', 'Data validation passed');
  }

  /**
   * Format raw attack data to match verifiedAttacks.js schema
   * @param {Object} data 
   * @returns {Object} Formatted attack
   */
  formatAttack(data) {
    const now = new Date();
    const date = data.date || now.toISOString();
    const reportedAt = data.reportedAt || now.toISOString().split('T')[0];
    
    // Generate ID: `2026-03-25-[city]-[type]`
    const citySlug = data.location.toLowerCase().replace(/\s+/g, '-');
    const dateSlug = reportedAt;
    const typeSlug = data.attackType || 'strike';
    const id = data.id || `${dateSlug}-${citySlug}-${typeSlug}`;

    // Determine conflict zone
    const conflictZone = data.conflictZone || this.determineConflictZone(data.location, data.country);

    const formatted = {
      id,
      headline: data.headline,
      description: data.description || data.headline,
      location: data.location,
      country: data.country,
      attackType: data.attackType || 'strike',
      severity: data.severity || 'medium',
      date,
      reportedAt,
      source: data.source || 'Verified reports',
      coordinates: {
        lat: parseFloat(data.coordinates.lat),
        lng: parseFloat(data.coordinates.lng)
      },
      context: data.context || `${data.location} - ${data.country}`,
      conflictZone,
      confidence: data.confidence || 'MEDIUM',
      addedAt: now.toISOString()
    };

    this.log('info', 'Attack formatted', { id: formatted.id });
    return formatted;
  }

  /**
   * Determine conflict zone from location/country
   */
  determineConflictZone(location, country) {
    const text = `${location} ${country}`.toLowerCase();
    
    if (text.includes('iran') || text.includes('iraq') || text.includes('israel') || 
        text.includes('kuwait') || text.includes('qatar') || text.includes('saudi') ||
        text.includes('uae') || text.includes('dubai') || text.includes('doha') ||
        text.includes('riyadh') || text.includes('tehran') || text.includes('baghdad') ||
        text.includes('tel aviv') || text.includes('jerusalem') || text.includes('west bank')) {
      return 'us-iran-war-2026';
    }
    
    if (text.includes('lebanon') || text.includes('beirut') || text.includes('tyre') ||
        text.includes('hezbollah')) {
      return 'israel-hezbollah-conflict';
    }
    
    if (text.includes('pakistan') || text.includes('afghanistan') || 
        text.includes('kabul') || text.includes('islamabad')) {
      return 'pak-afghan-conflict';
    }
    
    return 'uncategorized';
  }

  /**
   * Persist database to disk by rewriting the verifiedAttacks.js file
   * This ensures data survives server restarts
   */
  persistDatabase() {
    try {
      const dbPath = path.join(__dirname, '../data/verifiedAttacks.js');
      
      // Read current file to get the header/comments
      const currentContent = fs.readFileSync(dbPath, 'utf-8');
      const headerMatch = currentContent.match(/(\/\*\*[\s\S]*?\*\/)/);
      const header = headerMatch ? headerMatch[1] : '/** Verified Attacks Database */';
      
      // Build new content
      const attacksJson = JSON.stringify(VERIFIED_ATTACKS, null, 2);
      
      const newContent = `${header}

export const VERIFIED_ATTACKS = ${attacksJson};

// ==================== HELPER FUNCTIONS ====================

// Helper: Get all verified attacks
export function getAllAttacks() {
  return [...VERIFIED_ATTACKS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks within time window (hours)
export function getAttacks(hoursWindow = 48) {
  const cutoff = Date.now() - (hoursWindow * 60 * 60 * 1000);
  return VERIFIED_ATTACKS.filter(attack => {
    return new Date(attack.date).getTime() > cutoff;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks by conflict zone
export function getAttacksByZone(zoneId) {
  return VERIFIED_ATTACKS.filter(attack => attack.conflictZone === zoneId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Helper: Get attacks grouped by zone
export function getAttacksGroupedByZone() {
  const grouped = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!grouped[zone]) {
      grouped[zone] = [];
    }
    grouped[zone].push(attack);
  });
  return grouped;
}

// Helper: Add new verified attack (prevents duplicates by location+date)
export function addAttack(attackData) {
  // Check for duplicate (same location within 6 hours)
  const isDuplicate = VERIFIED_ATTACKS.some(existing => {
    const sameLocation = existing.location === attackData.location;
    const timeDiff = Math.abs(new Date(existing.date) - new Date(attackData.date));
    const within6Hours = timeDiff < (6 * 60 * 60 * 1000);
    return sameLocation && within6Hours;
  });

  if (isDuplicate) {
    console.log(\`[VerifiedDB] Duplicate attack skipped: \${attackData.location}\`);
    return null;
  }

  const newAttack = {
    id: \`attack-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`,
    ...attackData,
    addedAt: new Date().toISOString()
  };

  VERIFIED_ATTACKS.push(newAttack);
  console.log(\`[VerifiedDB] New attack added: \${attackData.headline}\`);
  return newAttack;
}

// Helper: Check if attack already exists
export function attackExists(location, date) {
  return VERIFIED_ATTACKS.some(existing => {
    const sameLocation = existing.location === location;
    const timeDiff = Math.abs(new Date(existing.date) - new Date(date));
    const within6Hours = timeDiff < (6 * 60 * 60 * 1000);
    return sameLocation && within6Hours;
  });
}

// Helper: Get attack count
export function getAttackCount() {
  return VERIFIED_ATTACKS.length;
}

// Helper: Get attack count by zone
export function getAttackCountByZone(zoneId) {
  return VERIFIED_ATTACKS.filter(attack => attack.conflictZone === zoneId).length;
}

// Helper: Get unique locations
export function getAttackLocations() {
  return [...new Set(VERIFIED_ATTACKS.map(a => a.location))];
}

// Helper: Get zone statistics
export function getZoneStatistics() {
  const stats = {};
  VERIFIED_ATTACKS.forEach(attack => {
    const zone = attack.conflictZone || 'uncategorized';
    if (!stats[zone]) {
      stats[zone] = { count: 0, highSeverity: 0, countries: new Set() };
    }
    stats[zone].count++;
    if (attack.severity === 'high') {
      stats[zone].highSeverity++;
    }
    stats[zone].countries.add(attack.country);
  });
  
  // Convert Sets to Arrays for JSON serialization
  Object.keys(stats).forEach(zone => {
    stats[zone].countries = [...stats[zone].countries];
  });
  
  return stats;
}

export default {
  VERIFIED_ATTACKS,
  getAllAttacks,
  getAttacks,
  getAttacksByZone,
  getAttacksGroupedByZone,
  addAttack,
  attackExists,
  getAttackCount,
  getAttackCountByZone,
  getAttackLocations,
  getZoneStatistics
};
`;

      fs.writeFileSync(dbPath, newContent, 'utf-8');
      this.log('success', 'Database persisted to disk', { path: dbPath, count: VERIFIED_ATTACKS.length });
      
    } catch (error) {
      this.log('error', 'Failed to persist database', { error: error.message });
      throw new Error(`Database persistence failed: ${error.message}`);
    }
  }

  /**
   * Update sitemap.xml to include new attack URL
   * @param {Object} attack 
   */
  async updateSitemap(attack) {
    try {
      // Run the generate-sitemap script
      const scriptPath = path.join(ROOT_DIR, 'scripts/generate-sitemap.js');
      
      if (fs.existsSync(scriptPath)) {
        // Dynamic import to run the ESM script
        await import(scriptPath);
        this.log('success', 'Sitemap regenerated');
      } else {
        // Manual sitemap update as fallback
        this.log('warn', 'Generate-sitemap script not found, manual update needed');
      }
      
    } catch (error) {
      this.log('error', 'Sitemap update failed', { error: error.message });
      // Don't throw - sitemap update is not critical
    }
  }

  /**
   * Git commit and push changes
   * @param {Object} attack 
   * @returns {Object} Result
   */
  async gitCommit(attack) {
    try {
      // Check if we're in a git repository
      const gitDir = path.join(ROOT_DIR, '.git');
      if (!fs.existsSync(gitDir)) {
        this.log('warn', 'Not a git repository, skipping git commit');
        return { committed: false, pushed: false, reason: 'not a git repo' };
      }

      // Check for git user config (required for commits)
      try {
        execSync('git config user.name', { cwd: ROOT_DIR, stdio: 'pipe' });
        execSync('git config user.email', { cwd: ROOT_DIR, stdio: 'pipe' });
      } catch {
        this.log('warn', 'Git user not configured, skipping git commit');
        return { committed: false, pushed: false, reason: 'git user not configured' };
      }

      // Check if there are changes to commit
      const status = execSync('git status --porcelain', { 
        cwd: ROOT_DIR, 
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      if (!status.trim()) {
        this.log('info', 'No changes to commit');
        return { committed: false, pushed: false, reason: 'no changes' };
      }

      // Stage files
      execSync('git add server/data/verifiedAttacks.js', { cwd: ROOT_DIR, stdio: 'pipe' });
      
      // Also stage sitemap if it changed
      try {
        execSync('git add public/sitemap.xml dist/sitemap.xml', { cwd: ROOT_DIR, stdio: 'pipe' });
      } catch {
        // sitemap might not exist, ignore
      }

      // Create commit
      const commitMessage = `🔴 Add attack: ${attack.headline.substring(0, 80)}${attack.headline.length > 80 ? '...' : ''}`;
      execSync(`git commit -m "${commitMessage}"`, { cwd: ROOT_DIR, stdio: 'pipe' });
      
      this.log('success', 'Changes committed', { message: commitMessage });

      // Push to origin
      try {
        execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'pipe' });
        this.log('success', 'Pushed to origin/main');
        return { committed: true, pushed: true };
      } catch (pushError) {
        this.log('error', 'Push failed', { error: pushError.message });
        return { committed: true, pushed: false, error: pushError.message };
      }

    } catch (error) {
      this.log('error', 'Git commit failed', { error: error.message });
      return { committed: false, pushed: false, error: error.message };
    }
  }

  /**
   * Schedule social distribution based on confidence
   * @param {Object} attack 
   * @returns {Object} Distribution config
   */
  async scheduleDistribution(attack) {
    this.log('info', 'Scheduling distribution', { confidence: attack.confidence });
    
    const result = await scheduler.scheduleDistribution(attack);
    
    this.log('success', 'Distribution scheduled', { 
      tweetDelay: result.tweetDelay,
      emailsQueued: result.email?.queued || 0
    });
    
    return result;
  }

  /**
   * Get pending jobs from scheduler
   * @returns {Array}
   */
  getPendingJobs() {
    return scheduler.listPendingJobs();
  }

  /**
   * Cancel a scheduled job
   * @param {string} jobId 
   * @returns {boolean}
   */
  cancelJob(jobId) {
    return scheduler.cancelJob(jobId);
  }

  /**
   * Get publisher stats
   * @returns {Object}
   */
  getStats() {
    return {
      totalAttacks: VERIFIED_ATTACKS.length,
      schedulerStats: scheduler.getStats(),
      recentLogs: this.logs.slice(-20)
    };
  }

  /**
   * Internal logging
   */
  log(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta
    };
    
    this.logs.push(entry);
    
    // Keep logs manageable
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-500);
    }
    
    // Console output
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    console.log(`[AutoPublisher] ${level.toUpperCase()}: ${message} ${metaStr}`);
  }
}

// Export singleton instance
export const autoPublisher = new AutoPublisher();
export default autoPublisher;

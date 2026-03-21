/**
 * Scheduler Service
 * Manages delayed tweet/email distribution for verified attacks
 * MVP: Uses setTimeout for delays (production: node-cron or external queue)
 */

import { queueBreakingAlerts } from './alertService.js';

// Job storage
const jobs = new Map();
let jobCounter = 0;

// Mock Twitter service (replace with real implementation)
const mockTweet = async (attack, options = {}) => {
  const confidenceWarning = options.confidenceWarning ? '\n⚠️ UNVERIFIED - AWAITING CONFIRMATION' : '';
  const tweetText = `🔴 ${attack.headline}

📍 ${attack.location}, ${attack.country}
⏰ ${new Date(attack.date).toLocaleString('en-US', { timeZone: 'UTC' })}
${confidenceWarning}

ww3tracker.live`;

  console.log('[Twitter] Mock tweet:', tweetText.substring(0, 100) + '...');
  return { success: true, tweetId: `mock-${Date.now()}`, text: tweetText };
};

class Scheduler {
  constructor() {
    this.jobs = jobs;
    this.twitterService = { tweet: mockTweet };
  }

  /**
   * Schedule a tweet for delayed posting
   * @param {Object} attack - Attack data
   * @param {number} delayMinutes - Minutes to wait before tweeting
   * @param {Object} options - Additional options (confidenceWarning, etc)
   * @returns {Object} Job info
   */
  scheduleTweet(attack, delayMinutes, options = {}) {
    const jobId = `tweet-${++jobCounter}`;
    const delayMs = delayMinutes * 60 * 1000;
    const scheduledTime = new Date(Date.now() + delayMs);

    console.log(`[Scheduler] Scheduling tweet for ${attack.location} in ${delayMinutes}min (${scheduledTime.toISOString()})`);

    const timeoutId = setTimeout(async () => {
      try {
        const result = await this.twitterService.tweet(attack, options);
        
        if (result.success) {
          console.log(`[Scheduler] Tweet posted successfully: ${result.tweetId}`);
          this.jobs.get(jobId).status = 'completed';
          this.jobs.get(jobId).completedAt = new Date().toISOString();
          this.jobs.get(jobId).result = result;
        } else {
          throw new Error(result.error || 'Tweet failed');
        }
      } catch (error) {
        console.error(`[Scheduler] Tweet failed for ${attack.id}:`, error.message);
        this.jobs.get(jobId).status = 'failed';
        this.jobs.get(jobId).error = error.message;
      }
    }, delayMs);

    const job = {
      id: jobId,
      type: 'tweet',
      attackId: attack.id,
      attackLocation: attack.location,
      scheduledTime: scheduledTime.toISOString(),
      delayMinutes,
      status: 'pending',
      timeoutId,
      options
    };

    this.jobs.set(jobId, job);
    return { jobId, scheduledTime: scheduledTime.toISOString() };
  }

  /**
   * Schedule email alerts for breaking news
   * @param {Object} attack - Attack data
   * @returns {Object} Job info
   */
  async scheduleEmail(attack) {
    const jobId = `email-${++jobCounter}`;
    
    console.log(`[Scheduler] Scheduling email alerts for ${attack.location}`);

    try {
      // Queue breaking alerts immediately (they have their own batching logic)
      const result = await queueBreakingAlerts(attack);
      
      const job = {
        id: jobId,
        type: 'email',
        attackId: attack.id,
        attackLocation: attack.location,
        scheduledTime: new Date().toISOString(),
        status: 'completed',
        completedAt: new Date().toISOString(),
        result: { queued: result.queued }
      };

      this.jobs.set(jobId, job);
      
      return { 
        jobId, 
        queued: result.queued,
        message: `Queued ${result.queued} breaking alerts` 
      };
    } catch (error) {
      console.error(`[Scheduler] Email scheduling failed:`, error.message);
      
      const job = {
        id: jobId,
        type: 'email',
        attackId: attack.id,
        status: 'failed',
        error: error.message
      };
      
      this.jobs.set(jobId, job);
      throw error;
    }
  }

  /**
   * Schedule both tweet and email for an attack based on confidence
   * @param {Object} attack - Attack data with confidence level
   * @returns {Object} Scheduling results
   */
  async scheduleDistribution(attack) {
    const confidence = attack.confidence || 'MEDIUM';
    const results = {
      confidence,
      tweet: null,
      email: null
    };

    // Schedule based on confidence level
    switch (confidence.toUpperCase()) {
      case 'HIGH':
        // HIGH: Tweet in 15 min, Email immediately
        results.tweet = this.scheduleTweet(attack, 15, { confidenceWarning: false });
        results.email = await this.scheduleEmail(attack);
        results.tweetDelay = 15;
        results.emailBatch = true;
        results.confidenceWarning = false;
        break;

      case 'MEDIUM':
        // MEDIUM: Tweet in 30 min with warning, Email immediately
        results.tweet = this.scheduleTweet(attack, 30, { confidenceWarning: true });
        results.email = await this.scheduleEmail(attack);
        results.tweetDelay = 30;
        results.emailBatch = true;
        results.confidenceWarning = true;
        break;

      case 'LOW':
        // LOW: No tweet, site-only with unverified label
        console.log(`[Scheduler] LOW confidence attack - skipping social distribution`);
        results.tweetDelay = null;
        results.emailBatch = false;
        results.confidenceWarning = true;
        results.skipped = true;
        break;

      default:
        console.log(`[Scheduler] Unknown confidence level: ${confidence}`);
        results.tweetDelay = null;
        results.skipped = true;
    }

    return results;
  }

  /**
   * List all pending jobs
   * @returns {Array} Pending jobs
   */
  listPendingJobs() {
    return Array.from(this.jobs.values())
      .filter(job => job.status === 'pending')
      .map(({ timeoutId, ...job }) => job); // Exclude timeoutId from output
  }

  /**
   * List all jobs (including completed/failed)
   * @returns {Array} All jobs
   */
  listAllJobs() {
    return Array.from(this.jobs.values())
      .map(({ timeoutId, ...job }) => job);
  }

  /**
   * Cancel a pending job
   * @param {string} jobId - Job ID to cancel
   * @returns {boolean} Success status
   */
  cancelJob(jobId) {
    const job = this.jobs.get(jobId);
    
    if (!job) {
      console.log(`[Scheduler] Job not found: ${jobId}`);
      return false;
    }

    if (job.status !== 'pending') {
      console.log(`[Scheduler] Cannot cancel ${job.status} job: ${jobId}`);
      return false;
    }

    // Clear the timeout
    clearTimeout(job.timeoutId);
    job.status = 'cancelled';
    job.cancelledAt = new Date().toISOString();
    
    console.log(`[Scheduler] Cancelled job: ${jobId}`);
    return true;
  }

  /**
   * Get job by ID
   * @param {string} jobId 
   * @returns {Object|null}
   */
  getJob(jobId) {
    const job = this.jobs.get(jobId);
    if (job) {
      const { timeoutId, ...rest } = job;
      return rest;
    }
    return null;
  }

  /**
   * Get scheduler stats
   * @returns {Object} Stats
   */
  getStats() {
    const allJobs = Array.from(this.jobs.values());
    return {
      total: allJobs.length,
      pending: allJobs.filter(j => j.status === 'pending').length,
      completed: allJobs.filter(j => j.status === 'completed').length,
      failed: allJobs.filter(j => j.status === 'failed').length,
      cancelled: allJobs.filter(j => j.status === 'cancelled').length
    };
  }

  /**
   * Clear old completed jobs (keep last 100)
   */
  cleanup() {
    const completed = Array.from(this.jobs.entries())
      .filter(([_, job]) => job.status !== 'pending');
    
    if (completed.length > 100) {
      const toRemove = completed.slice(0, completed.length - 100);
      for (const [id, _] of toRemove) {
        this.jobs.delete(id);
      }
      console.log(`[Scheduler] Cleaned up ${toRemove.length} old jobs`);
    }
  }
}

// Export singleton instance
export const scheduler = new Scheduler();
export default scheduler;

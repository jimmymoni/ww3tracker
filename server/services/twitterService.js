/**
 * Twitter/X Auto-Tweet Service
 * 
 * Automatically tweets verified attacks based on confidence level:
 * - HIGH confidence: Tweet after 15 min
 * - MEDIUM confidence: Tweet after 30 min with warning
 * - LOW confidence: No auto-tweet
 * 
 * Rate Limits (Free Tier):
 * - 100 tweets per 15 min window per user
 * - 200 tweets per 15 min window per app
 * 
 * Note: Requires twitter-api-v2 package to be installed
 * npm install twitter-api-v2
 */

// Lazy load TwitterApi - only when needed
let TwitterApi;

// Tweet templates with character budget optimization
const TEMPLATES = {
  high: `🔴 NEW: {headline}
📍 {location} | ⏰ {time}
→ {url}`,

  medium: `🟡 DEVELOPING: {headline}
📍 {location} | ⏰ {time}
Details being verified → {url}`,

  low: null, // No auto-tweet for low confidence

  correction: `📝 CORRECTION to earlier report:
{correction_text}
Updated → {url}`,

  update: `🔄 UPDATE: {headline}
📍 {location}
{update_text}
→ {url}`
};

// Character limits
const TWITTER_CHAR_LIMIT = 280;
const URL_LENGTH = 23; // t.co URLs are always 23 chars
const RESERVE_CHARS = 5; // Buffer for safety

// Pending tweet queue for delayed posting
const pendingTweets = new Map();

class TwitterService {
  constructor() {
    this.client = null;
    this.isEnabled = false;
    this.rateLimitStats = {
      tweetsThisWindow: 0,
      windowStart: null
    };
    
    this._initializeClient();
  }

  /**
   * Initialize Twitter client if credentials are available
   */
  _initializeClient() {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;
    const accessToken = process.env.TWITTER_ACCESS_TOKEN;
    const accessSecret = process.env.TWITTER_ACCESS_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      console.log('[TwitterService] Credentials not configured - service disabled');
      console.log('[TwitterService] Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET to enable');
      this.isEnabled = false;
      return;
    }

    try {
      // Dynamically import TwitterApi (ES module compatibility)
      import('twitter-api-v2').then(({ TwitterApi: TApi }) => {
        TwitterApi = TApi;
        this.client = new TwitterApi({
          appKey: apiKey,
          appSecret: apiSecret,
          accessToken: accessToken,
          accessSecret: accessSecret,
        });
        this.isEnabled = true;
        console.log('[TwitterService] Client initialized successfully');
      }).catch(err => {
        console.error('[TwitterService] Failed to load twitter-api-v2:', err.message);
        console.log('[TwitterService] Run: npm install twitter-api-v2');
        this.isEnabled = false;
      });
    } catch (error) {
      console.error('[TwitterService] Initialization error:', error.message);
      this.isEnabled = false;
    }
  }

  /**
   * Check if service is ready to tweet
   */
  isReady() {
    return this.isEnabled && this.client !== null;
  }

  /**
   * Queue an attack for tweeting based on confidence level
   * Returns the scheduled time or null if not queued
   */
  async queueAttackTweet(attack, options = {}) {
    const confidence = options.confidence || this._determineConfidence(attack);
    
    // LOW confidence: No auto-tweet
    if (confidence === 'low') {
      console.log(`[TwitterService] LOW confidence attack - no auto-tweet: ${attack.id}`);
      return { queued: false, reason: 'low_confidence' };
    }

    // Calculate delay
    const delayMs = confidence === 'high' ? 15 * 60 * 1000 : 30 * 60 * 1000; // 15 or 30 min
    const scheduledTime = new Date(Date.now() + delayMs);

    // Store in pending queue
    const tweetJob = {
      attack,
      confidence,
      scheduledTime,
      status: 'pending',
      options
    };

    pendingTweets.set(attack.id, tweetJob);

    // Schedule the tweet
    setTimeout(() => {
      this._processScheduledTweet(attack.id);
    }, delayMs);

    console.log(`[TwitterService] Queued ${confidence} confidence tweet for ${attack.id} at ${scheduledTime.toISOString()}`);

    return {
      queued: true,
      confidence,
      scheduledTime: scheduledTime.toISOString(),
      delayMinutes: confidence === 'high' ? 15 : 30
    };
  }

  /**
   * Process a scheduled tweet
   */
  async _processScheduledTweet(attackId) {
    const job = pendingTweets.get(attackId);
    if (!job || job.status !== 'pending') {
      return;
    }

    // Check if attack was retracted/corrected
    if (job.options.retracted) {
      console.log(`[TwitterService] Attack ${attackId} was retracted - cancelling tweet`);
      pendingTweets.delete(attackId);
      return;
    }

    job.status = 'processing';

    try {
      const result = await this.tweetAttack(job.attack, {
        confidence: job.confidence,
        isCorrection: job.options.isCorrection || false
      });

      job.status = 'completed';
      job.tweetId = result?.id;
      job.tweetUrl = result?.url;

      console.log(`[TwitterService] Tweet posted for ${attackId}: ${result?.url}`);
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      console.error(`[TwitterService] Failed to tweet ${attackId}:`, error.message);
    }
  }

  /**
   * Tweet an attack immediately
   */
  async tweetAttack(attack, options = {}) {
    if (!this.isReady()) {
      console.log('[TwitterService] Not ready - credentials not configured or client not initialized');
      return { 
        success: false, 
        error: 'Twitter service not configured',
        wouldHaveTweeted: this._formatTweetText(attack, options.confidence || 'high')
      };
    }

    // Check rate limits
    if (!this._checkRateLimit()) {
      const error = new Error('Rate limit exceeded - try again in 15 minutes');
      error.code = 'RATE_LIMITED';
      throw error;
    }

    try {
      // Format tweet text
      const text = this._formatTweetText(attack, options.confidence || 'high');

      // Post tweet
      const { data: tweet } = await this.client.v2.tweet(text);

      // Update rate limit tracking
      this._incrementRateLimit();

      const tweetUrl = `https://twitter.com/i/web/status/${tweet.id}`;

      console.log(`[TwitterService] Tweet posted: ${tweetUrl}`);

      return {
        success: true,
        id: tweet.id,
        text: text,
        url: tweetUrl,
        attackId: attack.id
      };
    } catch (error) {
      console.error('[TwitterService] Tweet error:', error.message);
      
      // Handle specific Twitter API errors
      if (error.code === 403) {
        throw new Error('Twitter API authentication failed - check credentials');
      }
      if (error.code === 429) {
        throw new Error('Twitter rate limit exceeded - wait 15 minutes');
      }
      if (error.code === 186) {
        throw new Error('Tweet exceeds character limit');
      }
      
      throw error;
    }
  }

  /**
   * Format tweet text with character limit handling
   */
  _formatTweetText(attack, confidence = 'high') {
    const template = TEMPLATES[confidence] || TEMPLATES.high;
    
    // Build URL
    const url = `ww3tracker.live/attack/${attack.id}`;
    
    // Format time
    const time = this._formatTime(attack.date);
    
    // Build location string
    const location = `${attack.location}, ${attack.country}`;
    
    // Calculate available space for headline
    const fixedParts = template
      .replace('{headline}', '')
      .replace('{location}', location)
      .replace('{time}', time)
      .replace('{url}', url);
    
    const availableForHeadline = TWITTER_CHAR_LIMIT - fixedParts.length - RESERVE_CHARS;
    
    // Truncate headline if needed
    let headline = attack.headline;
    if (headline.length > availableForHeadline) {
      headline = headline.substring(0, availableForHeadline - 3) + '...';
    }
    
    // Replace placeholders
    let text = template
      .replace('{headline}', headline)
      .replace('{location}', location)
      .replace('{time}', time)
      .replace('{url}', url);
    
    return text;
  }

  /**
   * Format correction tweet
   */
  formatCorrectionTweet(originalAttack, correctionText) {
    const url = `ww3tracker.live/attack/${originalAttack.id}`;
    
    // Truncate correction text to fit
    const maxCorrectionLen = TWITTER_CHAR_LIMIT - TEMPLATES.correction.length + '{correction_text}'.length - url.length - 30;
    let truncatedCorrection = correctionText;
    if (truncatedCorrection.length > maxCorrectionLen) {
      truncatedCorrection = truncatedCorrection.substring(0, maxCorrectionLen - 3) + '...';
    }
    
    return TEMPLATES.correction
      .replace('{correction_text}', truncatedCorrection)
      .replace('{url}', url);
  }

  /**
   * Format update tweet
   */
  formatUpdateTweet(attack, updateText) {
    const url = `ww3tracker.live/attack/${attack.id}`;
    
    // Truncate update text
    const maxUpdateLen = 100;
    let truncatedUpdate = updateText;
    if (truncatedUpdate.length > maxUpdateLen) {
      truncatedUpdate = truncatedUpdate.substring(0, maxUpdateLen - 3) + '...';
    }
    
    return TEMPLATES.update
      .replace('{headline}', attack.headline)
      .replace('{location}', `${attack.location}, ${attack.country}`)
      .replace('{update_text}', truncatedUpdate)
      .replace('{url}', url);
  }

  /**
   * Delete a tweet
   */
  async deleteTweet(tweetId) {
    if (!this.isReady()) {
      console.log('[TwitterService] Cannot delete - service not configured');
      return { success: false, error: 'Twitter service not configured' };
    }

    try {
      await this.client.v2.deleteTweet(tweetId);
      console.log(`[TwitterService] Tweet deleted: ${tweetId}`);
      return { success: true, tweetId };
    } catch (error) {
      console.error('[TwitterService] Delete error:', error.message);
      throw error;
    }
  }

  /**
   * Reply to a tweet (for corrections/updates)
   */
  async replyToTweet(tweetId, text, options = {}) {
    if (!this.isReady()) {
      console.log('[TwitterService] Cannot reply - service not configured');
      return { success: false, error: 'Twitter service not configured' };
    }

    // Ensure text fits limit
    if (text.length > TWITTER_CHAR_LIMIT) {
      text = text.substring(0, TWITTER_CHAR_LIMIT - 3) + '...';
    }

    try {
      const { data: tweet } = await this.client.v2.reply(text, tweetId);
      
      this._incrementRateLimit();

      const tweetUrl = `https://twitter.com/i/web/status/${tweet.id}`;
      
      console.log(`[TwitterService] Reply posted: ${tweetUrl}`);
      
      return {
        success: true,
        id: tweet.id,
        text: text,
        url: tweetUrl,
        replyTo: tweetId
      };
    } catch (error) {
      console.error('[TwitterService] Reply error:', error.message);
      throw error;
    }
  }

  /**
   * Post a correction as reply to original tweet
   */
  async postCorrection(originalTweetId, attack, correctionText) {
    const text = this.formatCorrectionTweet(attack, correctionText);
    return this.replyToTweet(originalTweetId, text);
  }

  /**
   * Cancel a pending tweet
   */
  cancelPendingTweet(attackId) {
    const job = pendingTweets.get(attackId);
    if (job && job.status === 'pending') {
      job.status = 'cancelled';
      pendingTweets.delete(attackId);
      console.log(`[TwitterService] Cancelled pending tweet for ${attackId}`);
      return { cancelled: true };
    }
    return { cancelled: false, reason: 'not_found_or_already_processing' };
  }

  /**
   * Get pending tweets status
   */
  getPendingTweets() {
    const result = [];
    for (const [id, job] of pendingTweets) {
      result.push({
        attackId: id,
        status: job.status,
        scheduledTime: job.scheduledTime?.toISOString(),
        confidence: job.confidence,
        tweetId: job.tweetId || null
      });
    }
    return result;
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      ready: this.isReady(),
      credentialsConfigured: !!(
        process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_SECRET
      ),
      rateLimit: {
        tweetsThisWindow: this.rateLimitStats.tweetsThisWindow,
        windowStart: this.rateLimitStats.windowStart,
        limit: 100, // Free tier per user
        remaining: Math.max(0, 100 - this.rateLimitStats.tweetsThisWindow)
      },
      pendingTweetsCount: pendingTweets.size
    };
  }

  /**
   * Check rate limit status
   */
  _checkRateLimit() {
    const now = Date.now();
    const windowStart = this.rateLimitStats.windowStart;
    
    // Reset window if 15 minutes passed
    if (!windowStart || (now - windowStart) > 15 * 60 * 1000) {
      this.rateLimitStats.tweetsThisWindow = 0;
      this.rateLimitStats.windowStart = now;
      return true;
    }
    
    // Free tier: 100 tweets per 15 min per user
    return this.rateLimitStats.tweetsThisWindow < 100;
  }

  /**
   * Increment rate limit counter
   */
  _incrementRateLimit() {
    this.rateLimitStats.tweetsThisWindow++;
  }

  /**
   * Determine confidence level from attack data
   */
  _determineConfidence(attack) {
    // If attack has explicit confidence field, use it
    if (attack.confidence) {
      return attack.confidence.toLowerCase();
    }
    
    // Otherwise infer from severity and source quality
    const highConfidenceSources = ['reuters', 'ap', 'bbc', 'nyt', 'confirmed', 'official'];
    const source = (attack.source || '').toLowerCase();
    const hasHighConfidenceSource = highConfidenceSources.some(s => source.includes(s));
    
    if (attack.severity === 'critical' || (attack.severity === 'high' && hasHighConfidenceSource)) {
      return 'high';
    }
    if (attack.severity === 'high' || attack.severity === 'medium') {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Format time for tweet
   */
  _formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: false
    }) + ' UTC';
  }

  /**
   * Test formatting without posting
   */
  previewTweet(attack, confidence = 'high') {
    const text = this._formatTweetText(attack, confidence);
    return {
      text,
      characterCount: text.length,
      withinLimit: text.length <= TWITTER_CHAR_LIMIT,
      confidence,
      attack: {
        id: attack.id,
        headline: attack.headline,
        location: `${attack.location}, ${attack.country}`
      }
    };
  }
}

// Export singleton instance
const twitterService = new TwitterService();
export default twitterService;

// Named exports for specific use cases
export const queueAttackTweet = (attack, options) => twitterService.queueAttackTweet(attack, options);
export const tweetAttack = (attack, options) => twitterService.tweetAttack(attack, options);
export const deleteTweet = (tweetId) => twitterService.deleteTweet(tweetId);
export const replyToTweet = (tweetId, text, options) => twitterService.replyToTweet(tweetId, text, options);
export const postCorrection = (originalTweetId, attack, correctionText) => twitterService.postCorrection(originalTweetId, attack, correctionText);
export const cancelPendingTweet = (attackId) => twitterService.cancelPendingTweet(attackId);
export const getPendingTweets = () => twitterService.getPendingTweets();
export const getStatus = () => twitterService.getStatus();
export const previewTweet = (attack, confidence) => twitterService.previewTweet(attack, confidence);

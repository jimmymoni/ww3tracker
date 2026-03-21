/**
 * Email Service
 * Sends email alerts to subscribers with hourly batching
 * Only HIGH and MEDIUM confidence attacks are sent (LOW = site-only)
 */

import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as subscriberModel from '../models/subscriber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path for pending attacks queue (persists across restarts)
const QUEUE_FILE = path.join(__dirname, '../data/pendingAttacks.json');

// Severity display configuration
const SEVERITY_CONFIG = {
  high: { label: 'HIGH', color: '#dc2626', emoji: '🔴', badgeColor: '#fee2e2' },
  medium: { label: 'MEDIUM', color: '#ea580c', emoji: '🟠', badgeColor: '#ffedd5' },
  low: { label: 'LOW', color: '#16a34a', emoji: '🟢', badgeColor: '#dcfce7' }
};

// Attack type display names
const ATTACK_TYPE_LABELS = {
  airstrike: 'Airstrike',
  missile: 'Missile Attack',
  drone: 'Drone Strike',
  bombing: 'Bombing',
  ground: 'Ground Combat',
  naval: 'Naval Action'
};

// Zone display names
const ZONE_NAMES = {
  'us-iran-war-2026': 'US-Iran War',
  'israel-hezbollah-conflict': 'Israel-Hezbollah Conflict'
};

class EmailService {
  constructor() {
    this.transporter = null;
    this.pendingAttacks = [];
    this.batchInterval = 60 * 60 * 1000; // 1 hour in milliseconds
    this.batchTimer = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the email service
   */
  async initialize() {
    if (this.isInitialized) return;

    // Create nodemailer transporter
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Load any pending attacks from disk
    await this.loadPendingAttacks();

    // Start the batch timer
    this.startBatchTimer();

    this.isInitialized = true;
    console.log('[EmailService] Initialized successfully');
  }

  /**
   * Create a test account (for development/testing)
   */
  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log('[EmailService] Test account created:', testAccount.user);
      
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      return testAccount;
    } catch (error) {
      console.error('[EmailService] Failed to create test account:', error);
      throw error;
    }
  }

  /**
   * Load pending attacks from disk
   */
  async loadPendingAttacks() {
    try {
      const data = await fs.readFile(QUEUE_FILE, 'utf8');
      const parsed = JSON.parse(data);
      this.pendingAttacks = Array.isArray(parsed) ? parsed : [];
      console.log(`[EmailService] Loaded ${this.pendingAttacks.length} pending attacks from disk`);
    } catch (error) {
      // File doesn't exist or is empty - start with empty queue
      this.pendingAttacks = [];
    }
  }

  /**
   * Save pending attacks to disk
   */
  async savePendingAttacks() {
    try {
      const dataDir = path.dirname(QUEUE_FILE);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(QUEUE_FILE, JSON.stringify(this.pendingAttacks, null, 2), 'utf8');
    } catch (error) {
      console.error('[EmailService] Failed to save pending attacks:', error);
    }
  }

  /**
   * Queue an attack for email alerting
   * Only HIGH and MEDIUM confidence attacks are queued
   * LOW confidence attacks are skipped (site-only)
   */
  async queueAttack(attack) {
    await this.initialize();

    // Skip LOW confidence attacks
    if (attack.confidence === 'LOW' || attack.severity === 'low') {
      console.log(`[EmailService] Skipping LOW confidence attack: ${attack.headline}`);
      return { queued: false, reason: 'LOW confidence - site only' };
    }

    // Only queue HIGH and MEDIUM
    if (attack.severity !== 'high' && attack.severity !== 'medium') {
      console.log(`[EmailService] Skipping unknown severity: ${attack.severity}`);
      return { queued: false, reason: 'Unknown severity level' };
    }

    // Check for duplicates in pending queue
    const isDuplicate = this.pendingAttacks.some(
      pending => pending.id === attack.id
    );

    if (isDuplicate) {
      console.log(`[EmailService] Attack already in queue: ${attack.id}`);
      return { queued: false, reason: 'Already queued' };
    }

    // Add to pending queue
    const queuedAttack = {
      ...attack,
      queuedAt: new Date().toISOString()
    };

    this.pendingAttacks.push(queuedAttack);
    await this.savePendingAttacks();

    console.log(`[EmailService] Queued ${attack.severity} attack: ${attack.headline}`);
    
    return { 
      queued: true, 
      queuePosition: this.pendingAttacks.length,
      attack: queuedAttack 
    };
  }

  /**
   * Start the batch timer - sends emails every hour
   */
  startBatchTimer() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      this.sendBatch().catch(error => {
        console.error('[EmailService] Batch send failed:', error);
      });
    }, this.batchInterval);

    console.log(`[EmailService] Batch timer started (${this.batchInterval / 1000 / 60} minute interval)`);
  }

  /**
   * Stop the batch timer
   */
  stopBatchTimer() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
      console.log('[EmailService] Batch timer stopped');
    }
  }

  /**
   * Send batch email to all subscribers
   */
  async sendBatch() {
    await this.initialize();

    if (this.pendingAttacks.length === 0) {
      console.log('[EmailService] No pending attacks to send');
      return { sent: 0, attacks: 0 };
    }

    // Get attacks to send and clear queue
    const attacks = [...this.pendingAttacks];
    this.pendingAttacks = [];
    await this.savePendingAttacks();

    // Get all active subscribers
    const subscribers = subscriberModel.getAllActive();

    if (subscribers.length === 0) {
      console.log('[EmailService] No subscribers to notify');
      return { sent: 0, attacks: attacks.length };
    }

    console.log(`[EmailService] Sending batch with ${attacks.length} attacks to ${subscribers.length} subscribers`);

    // Send to each subscriber
    let sentCount = 0;
    const errors = [];

    for (const subscriber of subscribers) {
      try {
        await this.sendDigestEmail(subscriber, attacks);
        sentCount++;
        
        // Increment alert count
        subscriberModel.incrementAlertCount(subscriber.email);
      } catch (error) {
        console.error(`[EmailService] Failed to send to ${subscriber.email}:`, error.message);
        errors.push({ email: subscriber.email, error: error.message });
      }
    }

    console.log(`[EmailService] Batch complete: ${sentCount}/${subscribers.length} emails sent`);

    return {
      sent: sentCount,
      attacks: attacks.length,
      subscribers: subscribers.length,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Send digest email to a single subscriber
   */
  async sendDigestEmail(subscriber, attacks) {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized');
    }

    // Sort attacks by severity (high first) then by date
    const sortedAttacks = [...attacks].sort((a, b) => {
      if (a.severity === 'high' && b.severity !== 'high') return -1;
      if (a.severity !== 'high' && b.severity === 'high') return 1;
      return new Date(b.date) - new Date(a.date);
    });

    const subject = this.generateSubject(sortedAttacks);
    const html = this.generateEmailTemplate(sortedAttacks, subscriber);
    const text = this.generateTextTemplate(sortedAttacks, subscriber);

    const mailOptions = {
      from: `"WW3 Tracker" <${process.env.SMTP_FROM || 'alerts@ww3tracker.live'}>`,
      to: subscriber.email,
      subject,
      html,
      text,
      headers: {
        'X-Priority': sortedAttacks.some(a => a.severity === 'high') ? '1' : '3',
        'X-Mailer': 'WW3 Tracker Email Service'
      }
    };

    const info = await this.transporter.sendMail(mailOptions);
    
    console.log(`[EmailService] Email sent to ${subscriber.email}: ${info.messageId}`);
    
    // If using Ethereal (test), log the preview URL
    if (info.ethereal) {
      console.log(`[EmailService] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  }

  /**
   * Generate email subject line
   */
  generateSubject(attacks) {
    const highCount = attacks.filter(a => a.severity === 'high').length;
    const mediumCount = attacks.filter(a => a.severity === 'medium').length;

    if (attacks.length === 1) {
      const attack = attacks[0];
      const severity = SEVERITY_CONFIG[attack.severity];
      return `${severity.emoji} New ${severity.label} Alert: ${attack.location}`;
    }

    if (highCount > 0) {
      return `🔴 ${highCount} HIGH + ${mediumCount} MEDIUM Severity Alerts Confirmed`;
    }

    return `🟠 ${attacks.length} New Alerts Confirmed`;
  }

  /**
   * Generate HTML email template
   */
  generateEmailTemplate(attacks, subscriber) {
    const highCount = attacks.filter(a => a.severity === 'high').length;
    const mediumCount = attacks.filter(a => a.severity === 'medium').length;
    
    const attacksHtml = attacks.map(attack => this.attackHTML(attack)).join('');
    const manageUrl = `https://ww3tracker.live/alerts/manage?token=${subscriber.token}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WW3 Tracker Alert</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #ffffff;
      padding: 30px 24px;
      text-align: center;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .header p {
      opacity: 0.8;
      font-size: 14px;
    }
    .summary {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      padding: 20px 24px;
      margin: 0;
    }
    .summary-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .summary-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .summary-badge {
      font-size: 20px;
      font-weight: 700;
      color: #dc2626;
    }
    .summary-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 24px;
    }
    .attack-card {
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .attack-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #fafafa;
      border-bottom: 1px solid #e5e5e5;
    }
    .severity-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .severity-high {
      background: #fee2e2;
      color: #dc2626;
    }
    .severity-medium {
      background: #ffedd5;
      color: #ea580c;
    }
    .attack-time {
      font-size: 12px;
      color: #666;
      margin-left: auto;
    }
    .attack-body {
      padding: 16px;
    }
    .attack-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #1a1a1a;
    }
    .attack-location {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }
    .attack-description {
      font-size: 14px;
      color: #444;
      line-height: 1.6;
    }
    .attack-meta {
      display: flex;
      gap: 16px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      font-size: 12px;
      color: #888;
    }
    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #2563eb;
      color: #ffffff;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      margin: 24px 0;
    }
    .button:hover {
      background: #1d4ed8;
    }
    .footer {
      background: #f8f9fa;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .footer-links {
      margin-bottom: 16px;
    }
    .footer-links a {
      margin: 0 8px;
    }
    .disclaimer {
      font-size: 11px;
      color: #999;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e5e5e5;
    }
    @media only screen and (max-width: 600px) {
      .header { padding: 20px 16px; }
      .header h1 { font-size: 20px; }
      .content { padding: 16px; }
      .summary { padding: 16px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ WW3 TRACKER ALERT</h1>
      <p>Verified Conflict Monitoring</p>
    </div>
    
    <div class="summary">
      <div class="summary-row">
        <div class="summary-item">
          <span class="summary-badge">${attacks.length}</span>
          <span class="summary-label">New Alerts</span>
        </div>
        ${highCount > 0 ? `
        <div class="summary-item">
          <span class="summary-badge" style="color: #dc2626;">${highCount}</span>
          <span class="summary-label">High Severity</span>
        </div>
        ` : ''}
        ${mediumCount > 0 ? `
        <div class="summary-item">
          <span class="summary-badge" style="color: #ea580c;">${mediumCount}</span>
          <span class="summary-label">Medium Severity</span>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div class="content">
      <h2 style="font-size: 18px; margin-bottom: 20px; color: #1a1a1a;">Confirmed Attacks</h2>
      
      ${attacksHtml}
      
      <div style="text-align: center;">
        <a href="https://ww3tracker.live/live-map" class="button">
          View Live Map →
        </a>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-links">
        <a href="${manageUrl}">Manage Preferences</a> • 
        <a href="${manageUrl}&action=unsubscribe">Unsubscribe</a> • 
        <a href="https://ww3tracker.live">Visit Website</a>
      </div>
      <p>You're receiving this because you subscribed to WW3 Tracker alerts.</p>
      <div class="disclaimer">
        <p>WW3 Tracker • ww3tracker.live</p>
        <p>Educational conflict monitoring service. Data manually verified from multiple sources.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate HTML for a single attack
   */
  attackHTML(attack) {
    const severity = SEVERITY_CONFIG[attack.severity];
    const typeLabel = ATTACK_TYPE_LABELS[attack.attackType] || attack.attackType;
    const zoneLabel = ZONE_NAMES[attack.conflictZone] || attack.conflictZone;
    
    const date = new Date(attack.date);
    const timeStr = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';

    return `
    <div class="attack-card">
      <div class="attack-header">
        <span class="severity-badge severity-${attack.severity}">
          ${severity.emoji} ${severity.label}
        </span>
        <span class="attack-time">${timeStr}</span>
      </div>
      <div class="attack-body">
        <h3 class="attack-title">${attack.headline}</h3>
        <div class="attack-location">
          📍 ${attack.location}, ${attack.country}
        </div>
        <p class="attack-description">${attack.description}</p>
        <div class="attack-meta">
          <span>Type: ${typeLabel}</span>
          <span>Zone: ${zoneLabel}</span>
          ${attack.source ? `<span>Source: ${attack.source}</span>` : ''}
        </div>
      </div>
    </div>
    `;
  }

  /**
   * Generate plain text email template
   */
  generateTextTemplate(attacks, subscriber) {
    const manageUrl = `https://ww3tracker.live/alerts/manage?token=${subscriber.token}`;
    
    const attacksText = attacks.map(attack => {
      const severity = SEVERITY_CONFIG[attack.severity];
      const typeLabel = ATTACK_TYPE_LABELS[attack.attackType] || attack.attackType;
      const date = new Date(attack.date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      }) + ' UTC';

      return `
${severity.emoji} ${severity.label} SEVERITY
Location: ${attack.location}, ${attack.country}
Time: ${date}
Type: ${typeLabel}

${attack.headline}

${attack.description}

---
`;
    }).join('\n');

    return `WW3 TRACKER ALERT
=================

${attacks.length} new confirmed attack${attacks.length > 1 ? 's' : ''} detected.

${attacksText}

View Live Map: https://ww3tracker.live/live-map

---
Manage Preferences: ${manageUrl}
Unsubscribe: ${manageUrl}&action=unsubscribe

WW3 Tracker • ww3tracker.live
Educational conflict monitoring service.`;
  }

  /**
   * Get current queue status
   */
  getQueueStatus() {
    const highCount = this.pendingAttacks.filter(a => a.severity === 'high').length;
    const mediumCount = this.pendingAttacks.filter(a => a.severity === 'medium').length;

    return {
      pending: this.pendingAttacks.length,
      high: highCount,
      medium: mediumCount,
      nextBatchIn: this.batchTimer ? this.batchInterval : null
    };
  }

  /**
   * Clear the pending queue (admin use)
   */
  async clearQueue() {
    this.pendingAttacks = [];
    await this.savePendingAttacks();
    return { cleared: true };
  }

  /**
   * Send immediate test email
   */
  async sendTestEmail(toEmail) {
    await this.initialize();

    const testAttacks = [{
      id: 'test-1',
      headline: 'Test Alert: Simulated Attack Detection',
      description: 'This is a test email to verify the alert system is working correctly. No actual attack has occurred.',
      location: 'Test City',
      country: 'Test Country',
      attackType: 'airstrike',
      severity: 'high',
      date: new Date().toISOString(),
      conflictZone: 'us-iran-war-2026',
      source: 'Test System'
    }];

    const subscriber = {
      email: toEmail,
      token: 'test-token',
      zones: ['all']
    };

    const info = await this.sendDigestEmail(subscriber, testAttacks);
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: info.ethereal ? nodemailer.getTestMessageUrl(info) : null
    };
  }

  /**
   * Verify SMTP configuration
   */
  async verifyConnection() {
    await this.initialize();

    try {
      const result = await this.transporter.verify();
      return { success: true, ready: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export for testing
export { EmailService };
export default emailService;

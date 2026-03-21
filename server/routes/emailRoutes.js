/**
 * Email Routes
 * API endpoints for email alert management
 */

import express from 'express';
import { emailService } from '../services/emailService.js';
import * as subscriberModel from '../models/subscriber.js';

const router = express.Router();

/**
 * GET /api/email/status
 * Get email service status and queue
 */
router.get('/status', async (req, res) => {
  try {
    const queueStatus = emailService.getQueueStatus();
    const subscriberStats = subscriberModel.getStats();
    
    res.json({
      success: true,
      queue: queueStatus,
      subscribers: subscriberStats,
      smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/email/test
 * Send a test email
 */
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email required' });
    }

    const result = await emailService.sendTestEmail(email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/email/verify-smtp
 * Verify SMTP configuration
 */
router.post('/verify-smtp', async (req, res) => {
  try {
    const result = await emailService.verifyConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/email/queue-attack
 * Queue an attack for email alerting
 * (Called internally when new attacks are added)
 */
router.post('/queue-attack', async (req, res) => {
  try {
    const attack = req.body;
    
    if (!attack || !attack.id) {
      return res.status(400).json({ success: false, error: 'Attack data required' });
    }

    const result = await emailService.queueAttack(attack);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/email/send-batch
 * Manually trigger batch send (admin only)
 */
router.post('/send-batch', async (req, res) => {
  try {
    const result = await emailService.sendBatch();
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/email/clear-queue
 * Clear the pending queue (admin only)
 */
router.post('/clear-queue', async (req, res) => {
  try {
    const result = await emailService.clearQueue();
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

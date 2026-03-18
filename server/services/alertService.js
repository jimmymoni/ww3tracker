/**
 * Alert Service
 * Manages email alerts for verified attacks and daily digests
 * MVP: Email templates and queue management (actual sending can be added later)
 */

import * as subscriberModel from '../models/subscriber.js';

// Email queue for processing
const emailQueue = [];
let queueProcessing = false;

// Zone display names
const ZONE_NAMES = {
  'us-iran': 'US-Iran Conflict',
  'pak-afghan': 'Pakistan-Afghanistan',
  'israel-hezb': 'Israel-Hezbollah',
  'all': 'All Zones'
};

// Severity display
const SEVERITY_LABELS = {
  'critical': '🔴 CRITICAL',
  'high': '🟠 HIGH',
  'medium': '🟡 MEDIUM',
  'low': '🟢 LOW'
};

// Attack type display
const ATTACK_TYPE_LABELS = {
  'drone': 'Drone Strike',
  'missile': 'Missile Attack',
  'airstrike': 'Airstrike',
  'bombing': 'Bombing',
  'plane': 'Aircraft Incident',
  'naval': 'Naval Action',
  'ground': 'Ground Combat'
};

/**
 * Generate breaking alert email template
 */
function generateBreakingEmail(attack, subscriber) {
  const severityLabel = SEVERITY_LABELS[attack.severity] || SEVERITY_LABELS.medium;
  const typeLabel = ATTACK_TYPE_LABELS[attack.attackType] || attack.attackType;
  const timestamp = new Date(attack.date).toLocaleString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const manageUrl = `https://ww3tracker.live/alerts/manage?token=${subscriber.token}`;
  const mapUrl = `https://ww3tracker.live/?lat=${attack.coordinates?.lat}&lng=${attack.coordinates?.lng}&zoom=8`;

  return {
    subject: `[WW3 Tracker] New strike in ${attack.location} - ${severityLabel}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WW3 Tracker Alert</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      background: #f5f5f5;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: #1a1a2e;
      color: #fff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .alert-badge {
      background: ${attack.severity === 'critical' ? '#dc2626' : attack.severity === 'high' ? '#ea580c' : '#ca8a04'};
      color: white;
      display: inline-block;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      margin: 16px 0;
    }
    .content {
      padding: 24px;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      border-bottom: 1px solid #eee;
      padding-bottom: 12px;
    }
    .detail-label {
      font-weight: 600;
      color: #666;
      width: 100px;
      flex-shrink: 0;
    }
    .detail-value {
      color: #1a1a1a;
    }
    .description {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 6px;
      margin: 16px 0;
    }
    .context {
      background: #fff7ed;
      border-left: 4px solid #ea580c;
      padding: 16px;
      margin: 16px 0;
    }
    .button {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 8px 0;
    }
    .button-secondary {
      background: #6b7280;
    }
    .footer {
      background: #f8f9fa;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ WW3 TRACKER ALERT</h1>
    </div>
    
    <div class="content">
      <div style="text-align: center;">
        <span class="alert-badge">${severityLabel} - VERIFIED STRIKE</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${attack.location}, ${attack.country}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${timestamp} UTC</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${typeLabel}</span>
      </div>
      
      <div class="detail-row">
        <span class="detail-label">Severity:</span>
        <span class="detail-value">${attack.severity.toUpperCase()}</span>
      </div>
      
      <div class="description">
        <strong>What happened:</strong>
        <p>${attack.description}</p>
      </div>
      
      <div class="context">
        <strong>Why this matters:</strong>
        <p>${getContextForAttack(attack)}</p>
      </div>
      
      <div style="text-align: center; margin: 24px 0;">
        <a href="${mapUrl}" class="button">View on Map</a>
      </div>
    </div>
    
    <div class="footer">
      <p>You're receiving this because you subscribed to ${subscriber.zones.includes('all') ? 'all zones' : subscriber.zones.map(z => ZONE_NAMES[z]).join(', ')} alerts.</p>
      <p>
        <a href="${manageUrl}">Manage Preferences</a> | 
        <a href="${manageUrl}&action=unsubscribe">Unsubscribe</a>
      </p>
      <p style="margin-top: 16px; color: #999;">
        WW3 Tracker • ww3tracker.live<br>
        Verified conflict monitoring. No spam, ever.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
WW3 TRACKER ALERT

⚠️ ${severityLabel} - VERIFIED STRIKE

Location: ${attack.location}, ${attack.country}
Time: ${timestamp} UTC
Type: ${typeLabel}
Severity: ${attack.severity.toUpperCase()}

WHAT HAPPENED:
${attack.description}

WHY THIS MATTERS:
${getContextForAttack(attack)}

View on map: ${mapUrl}
Manage alerts: ${manageUrl}

---
WW3 Tracker • ww3tracker.live
You're receiving this because you subscribed to conflict alerts.
Unsubscribe: ${manageUrl}&action=unsubscribe
    `.trim()
  };
}

/**
 * Generate daily digest email template
 */
function generateDigestEmail(events, date, subscriber) {
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const manageUrl = `https://ww3tracker.live/alerts/manage?token=${subscriber.token}`;

  // Build event list HTML
  const eventsHtml = events.map(event => {
    const severityEmoji = event.severity === 'critical' ? '🔴' : 
                         event.severity === 'high' ? '🟠' : '🟡';
    return `
      <div style="border-left: 3px solid ${getSeverityColor(event.severity)}; padding-left: 16px; margin-bottom: 20px;">
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">
          ${severityEmoji} ${event.location}, ${event.country}
        </div>
        <div style="color: #666; font-size: 13px; margin-bottom: 8px;">
          ${new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • 
          ${ATTACK_TYPE_LABELS[event.attackType] || event.attackType}
        </div>
        <p style="margin: 0; color: #444;">${event.description}</p>
      </div>
    `;
  }).join('');

  return {
    subject: `[WW3 Tracker] Daily Digest - ${events.length} events`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WW3 Tracker Daily Digest</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      background: #f5f5f5;
    }
    .container {
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: #1a1a2e;
      color: #fff;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .summary {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 16px;
      margin: 24px;
      border-radius: 6px;
      text-align: center;
    }
    .content {
      padding: 0 24px 24px;
    }
    .button {
      display: inline-block;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 8px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 16px 24px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 WW3 TRACKER DAILY DIGEST</h1>
      <p style="margin: 8px 0 0; opacity: 0.8;">${dateStr}</p>
    </div>
    
    <div class="summary">
      <strong style="font-size: 18px;">${events.length} verified events</strong>
      <p style="margin: 8px 0 0;">Across your monitored zones: ${subscriber.zones.includes('all') ? 'All Zones' : subscriber.zones.map(z => ZONE_NAMES[z]).join(', ')}</p>
    </div>
    
    <div class="content">
      <h2 style="font-size: 18px; margin-bottom: 20px;">Today's Events</h2>
      ${eventsHtml}
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://ww3tracker.live" class="button">View Full Dashboard</a>
      </div>
    </div>
    
    <div class="footer">
      <p>
        <a href="${manageUrl}">Manage Preferences</a> | 
        <a href="${manageUrl}&action=unsubscribe">Unsubscribe</a>
      </p>
      <p style="margin-top: 16px; color: #999;">
        WW3 Tracker • ww3tracker.live<br>
        Verified conflict monitoring. No spam, ever.
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
WW3 TRACKER DAILY DIGEST
${dateStr}

${events.length} verified events across your monitored zones.

TODAY'S EVENTS:
${events.map(e => `
[${e.severity.toUpperCase()}] ${e.location}, ${e.country}
${new Date(e.date).toLocaleTimeString('en-US')} • ${ATTACK_TYPE_LABELS[e.attackType] || e.attackType}
${e.description}
`).join('\n---\n')}

View full dashboard: https://ww3tracker.live
Manage alerts: ${manageUrl}

---
WW3 Tracker • ww3tracker.live
Unsubscribe: ${manageUrl}&action=unsubscribe
    `.trim()
  };
}

/**
 * Get context text based on attack details
 */
function getContextForAttack(attack) {
  const contexts = {
    'us-iran': 'This strike occurs within the ongoing US-Iran conflict zone, where tensions remain elevated following recent military exchanges. Any attack in this region risks broader escalation between the two powers and their respective allies.',
    'israel-hezb': 'This incident takes place in the Israel-Hezbollah conflict zone, where cross-border hostilities have intensified. Such strikes threaten to expand the conflict beyond immediate borders and draw in regional actors.',
    'pak-afghan': 'This attack occurs in the Pakistan-Afghanistan border region, an area with ongoing security challenges and militant activity. Events here can impact regional stability and international counterterrorism efforts.'
  };

  // Determine zone from location/attack data if possible
  const zone = attack.country?.toLowerCase().includes('iran') || 
               attack.country?.toLowerCase().includes('iraq') ||
               attack.location?.toLowerCase().includes('tehran') ? 'us-iran' :
               attack.country?.toLowerCase().includes('israel') || 
               attack.country?.toLowerCase().includes('lebanon') ? 'israel-hezb' :
               attack.country?.toLowerCase().includes('pakistan') || 
               attack.country?.toLowerCase().includes('afghanistan') ? 'pak-afghan' : null;

  return contexts[zone] || 'This verified strike has been confirmed by multiple sources and represents a significant security incident in an active conflict zone. Continued monitoring is recommended for potential escalation indicators.';
}

/**
 * Get color code for severity
 */
function getSeverityColor(severity) {
  const colors = {
    'critical': '#dc2626',
    'high': '#ea580c',
    'medium': '#ca8a04',
    'low': '#16a34a'
  };
  return colors[severity] || '#6b7280';
}

/**
 * Queue breaking alert emails for an attack
 */
async function queueBreakingAlerts(attack) {
  // Determine which zone this attack belongs to
  const attackZone = determineZone(attack);
  
  // Get subscribers for this zone who want breaking alerts
  const subscribers = subscriberModel.getActiveByZone(attackZone)
    .filter(s => s.frequency === 'breaking' || s.frequency === 'all');

  if (subscribers.length === 0) {
    console.log(`[AlertService] No breaking alert subscribers for zone: ${attackZone}`);
    return { queued: 0 };
  }

  // Queue emails
  for (const subscriber of subscribers) {
    const email = generateBreakingEmail(attack, subscriber);
    
    emailQueue.push({
      type: 'breaking',
      to: subscriber.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      attackId: attack.id,
      subscriberToken: subscriber.token,
      queuedAt: new Date()
    });

    subscriberModel.incrementAlertCount(subscriber.email);
  }

  console.log(`[AlertService] Queued ${subscribers.length} breaking alerts for ${attack.location}`);

  // Process queue (in production, this would be a background job)
  processQueue();

  return { queued: subscribers.length };
}

/**
 * Generate and queue daily digest emails
 */
async function queueDailyDigests(events, date = new Date()) {
  // Get all subscribers who want daily digest
  const subscribers = subscriberModel.getByFrequency('daily');

  if (subscribers.length === 0) {
    console.log('[AlertService] No daily digest subscribers');
    return { queued: 0 };
  }

  // Group events by zone for filtering
  const eventsByZone = {
    'us-iran': events.filter(e => determineZone(e) === 'us-iran'),
    'israel-hezb': events.filter(e => determineZone(e) === 'israel-hezb'),
    'pak-afghan': events.filter(e => determineZone(e) === 'pak-afghan')
  };

  // Queue digest for each subscriber with relevant events
  let totalQueued = 0;
  
  for (const subscriber of subscribers) {
    // Get events relevant to this subscriber's zones
    let relevantEvents = [];
    
    if (subscriber.zones.includes('all')) {
      relevantEvents = events;
    } else {
      for (const zone of subscriber.zones) {
        relevantEvents.push(...(eventsByZone[zone] || []));
      }
    }

    // Skip if no events for this subscriber
    if (relevantEvents.length === 0) continue;

    // Remove duplicates and sort by date
    relevantEvents = [...new Set(relevantEvents)]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const email = generateDigestEmail(relevantEvents, date, subscriber);

    emailQueue.push({
      type: 'digest',
      to: subscriber.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      eventCount: relevantEvents.length,
      subscriberToken: subscriber.token,
      queuedAt: new Date()
    });

    subscriberModel.incrementAlertCount(subscriber.email);
    totalQueued++;
  }

  console.log(`[AlertService] Queued ${totalQueued} daily digests`);

  processQueue();

  return { queued: totalQueued };
}

/**
 * Determine which zone an attack belongs to
 */
function determineZone(attack) {
  const location = (attack.location + ' ' + attack.country).toLowerCase();
  
  if (location.includes('iran') || location.includes('iraq') || 
      location.includes('tehran') || location.includes('baghdad') ||
      location.includes('dubai') || location.includes('uae')) {
    return 'us-iran';
  }
  
  if (location.includes('israel') || location.includes('lebanon') || 
      location.includes('gaza') || location.includes('palestine') ||
      location.includes('beirut') || location.includes('tel aviv')) {
    return 'israel-hezb';
  }
  
  if (location.includes('pakistan') || location.includes('afghanistan') ||
      location.includes('kabul') || location.includes('islamabad')) {
    return 'pak-afghan';
  }

  // Default to us-iran if can't determine
  return 'us-iran';
}

/**
 * Process email queue
 * MVP: Log emails to console (actual sending requires SMTP configuration)
 */
async function processQueue() {
  if (queueProcessing || emailQueue.length === 0) return;

  queueProcessing = true;
  console.log(`[AlertService] Processing ${emailQueue.length} queued emails...`);

  // In MVP, just log what would be sent
  // In production, integrate with SendGrid, AWS SES, or similar
  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    
    // Log the email that would be sent
    console.log(`[AlertService] Would send ${email.type} email to ${email.to}`);
    console.log(`  Subject: ${email.subject}`);
    
    // TODO: Integrate with email provider
    // await sendEmailViaProvider(email);
  }

  queueProcessing = false;
}

/**
 * Get queue status
 */
function getQueueStatus() {
  return {
    pending: emailQueue.length,
    processing: queueProcessing
  };
}

/**
 * Get alert service stats
 */
function getStats() {
  return {
    ...subscriberModel.getStats(),
    queue: getQueueStatus()
  };
}

/**
 * Test function to simulate sending an email
 */
async function testSend(email, attack) {
  const subscriber = subscriberModel.getByEmail(email);
  if (!subscriber) {
    return { success: false, error: 'Subscriber not found' };
  }

  const emailContent = generateBreakingEmail(attack, subscriber);
  
  console.log('[AlertService] Test email generated:');
  console.log('Subject:', emailContent.subject);
  console.log('HTML length:', emailContent.html.length);
  console.log('Text length:', emailContent.text.length);

  return {
    success: true,
    preview: {
      subject: emailContent.subject,
      text: emailContent.text.substring(0, 500) + '...'
    }
  };
}

export {
  queueBreakingAlerts,
  queueDailyDigests,
  generateBreakingEmail,
  generateDigestEmail,
  getQueueStatus,
  getStats,
  testSend,
  determineZone,
  ZONE_NAMES,
  ATTACK_TYPE_LABELS,
  SEVERITY_LABELS
};

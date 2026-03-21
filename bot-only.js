/**
 * Standalone Telegram Bot for WW3 Tracker
 * Supports both single AND batch publishing
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID');
  process.exit(1);
}

let lastUpdateId = 0;
const processedUpdates = new Set();
let isProcessing = false;
const pendingAttacks = new Map(); // Store pending attacks for confirmation

console.log('🤖 WW3 Tracker Bot Starting...');
console.log('Token:', BOT_TOKEN.slice(0, 10) + '...');
console.log('Channel:', CHANNEL_ID);

// Simple coordinate lookup (fallback)
const COORDINATES = {
  'tehran': { lat: 35.6892, lng: 51.3890 },
  'tel aviv': { lat: 32.0853, lng: 34.7818 },
  'baghdad': { lat: 33.3152, lng: 44.3661 },
  'beirut': { lat: 33.8938, lng: 35.5018 },
  'damascus': { lat: 33.5138, lng: 36.2765 },
  'riyadh': { lat: 24.7136, lng: 46.6753 },
  'doha': { lat: 25.2854, lng: 51.5310 },
  'kuwait city': { lat: 29.3759, lng: 47.9774 },
  'jerusalem': { lat: 31.7683, lng: 35.2137 },
  'gaza': { lat: 31.5017, lng: 34.4668 },
  'bandar abbas': { lat: 27.1833, lng: 56.2666 },
  'isfahan': { lat: 32.6539, lng: 51.6660 },
  'qom': { lat: 34.6416, lng: 50.8746 },
  'basra': { lat: 30.5156, lng: 47.7804 },
  'erbil': { lat: 36.1911, lng: 44.0092 },
  'ras laffan': { lat: 25.9333, lng: 51.6167 },
  'mina al-ahmadi': { lat: 29.0833, lng: 48.1333 },
  'yanbu': { lat: 24.0943, lng: 38.0264 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'abu dhabi': { lat: 24.4539, lng: 54.3773 },
  'manama': { lat: 26.2285, lng: 50.5860 }
};

function getCoords(location) {
  const key = location.toLowerCase().trim();
  return COORDINATES[key] || { lat: 0, lng: 0 };
}

async function telegramApi(method, params = {}) {
  const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  try {
    const response = await fetch(url.toString());
    return await response.json();
  } catch (err) {
    console.error(`API error (${method}):`, err.message);
    return { ok: false };
  }
}

async function sendMessage(chatId, text, options = {}) {
  const params = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  if (options.reply_markup) {
    params.reply_markup = JSON.stringify(options.reply_markup);
  }
  return telegramApi('sendMessage', params);
}

function parseSingleAttack(text) {
  const data = {};
  const lines = text.split('\n');
  
  for (const line of lines) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      data[key.trim().toUpperCase()] = value;
    }
  }
  
  const narrativeMatch = text.match(/NARRATIVE:(.*)/s);
  data.NARRATIVE = narrativeMatch ? narrativeMatch[1].trim() : '';
  
  const date = data.TIME ? data.TIME.split(' ')[0] : new Date().toISOString().split('T')[0];
  const location = data.LOCATION?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
  const type = data.TYPE?.toLowerCase() || 'attack';
  data.ID = `${date}-${location}-${type}`;
  
  return data;
}

function parseBatchAttacks(text) {
  // Remove the /batch command from the start
  let content = text.replace(/^\/batch\s*/i, '').trim();
  
  // DEBUG: Log what we received
  console.log('[Bot] Raw content length:', content.length);
  console.log('[Bot] Content preview:', content.substring(0, 200));
  
  // Normalize line endings to \n for consistent parsing
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  let incidents = [];
  
  // Check for --- separators (explicit separator)
  if (content.includes('\n---\n') || content.includes('\n---')) {
    incidents = content.split(/\n\s*---\s*\n?/).filter(s => s.trim().length > 0);
    console.log('[Bot] Used --- separator pattern');
  } else {
    // ROBUST METHOD: Split by LOCATION: at the start of a line
    // This handles both blank line separators AND no separators between incidents
    const lines = content.split('\n');
    const locationLineIndices = [];
    
    lines.forEach((line, idx) => {
      // Check if line starts with LOCATION: (allowing for optional whitespace)
      if (/^\s*LOCATION:/.test(line)) {
        locationLineIndices.push(idx);
      }
    });
    
    console.log(`[Bot] Found ${locationLineIndices.length} LOCATION: markers at lines:`, locationLineIndices);
    
    // Reconstruct incidents from LOCATION: markers
    for (let i = 0; i < locationLineIndices.length; i++) {
      const start = locationLineIndices[i];
      const end = locationLineIndices[i + 1] !== undefined ? locationLineIndices[i + 1] : lines.length;
      const incidentLines = lines.slice(start, end);
      const incident = incidentLines.join('\n').trim();
      if (incident.length > 0) {
        incidents.push(incident);
      }
    }
    
    if (incidents.length > 0) {
      console.log('[Bot] Used LOCATION: line-start pattern');
    } else {
      // Fallback: try double newline separator
      incidents = content.split(/\n\n+/).filter(s => s.trim().length > 0 && s.includes('LOCATION:'));
      console.log('[Bot] Used double newline fallback pattern');
    }
  }
  
  console.log(`[Bot] Found ${incidents.length} raw incidents`);
  
  const attacks = [];
  
  for (let i = 0; i < incidents.length; i++) {
    const incident = incidents[i];
    try {
      const trimmed = incident.trim();
      if (!trimmed) continue;
      
      console.log(`[Bot] Processing incident ${i+1}, length: ${trimmed.length}`);
      
      const attack = parseSingleAttack(trimmed);
      // Only add if has required fields
      if (attack.LOCATION && attack.COUNTRY && attack.HEADLINE) {
        attacks.push(attack);
        console.log(`[Bot] ✓ Parsed: ${attack.LOCATION}`);
      } else {
        console.log(`[Bot] ✗ Skipped (missing fields): LOCATION=${attack.LOCATION}, COUNTRY=${attack.COUNTRY}, HEADLINE=${attack.HEADLINE?.substring(0,30)}`);
      }
    } catch (err) {
      console.log(`[Bot] ✗ Error on incident ${i+1}:`, err.message);
    }
  }
  
  console.log(`[Bot] Total valid attacks: ${attacks.length}`);
  return attacks;
}

function validateAttack(data) {
  const required = ['LOCATION', 'COUNTRY', 'TIME', 'TYPE', 'SEVERITY', 'TARGET', 'HEADLINE'];
  const missing = required.filter(field => !data[field] || data[field].trim() === '');
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Normalize severity to lowercase for validation and storage
  const severityRaw = data.SEVERITY.trim();
  const severityLower = severityRaw.toLowerCase();
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  
  if (!validSeverities.includes(severityLower)) {
    throw new Error(
      `Invalid SEVERITY "${severityRaw}". Must be one of: low, medium, high, critical (case-insensitive)`
    );
  }
  
  // Update the data object with normalized lowercase severity
  data.SEVERITY = severityLower;
  
  // Additional validation for other fields
  if (data.LOCATION.trim().length < 2) {
    throw new Error('LOCATION must be at least 2 characters');
  }
  
  if (data.HEADLINE.trim().length < 10) {
    throw new Error('HEADLINE must be at least 10 characters');
  }
  
  return true;
}

async function addToDatabase(attack) {
  const filePath = path.join(__dirname, 'server/data/verifiedAttacks.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  const attackObj = {
    id: attack.ID,
    headline: attack.HEADLINE,
    description: attack.TARGET,
    location: attack.LOCATION,
    country: attack.COUNTRY,
    attackType: attack.TYPE.toLowerCase(),
    severity: attack.SEVERITY.toLowerCase(),
    date: new Date(attack.TIME).toISOString(),
    coordinates: getCoords(attack.LOCATION),
    conflictZone: 'us-iran-war-2026',
    source: attack.SOURCE || 'Telegram Bot',
    narrative: attack.NARRATIVE || ''
  };
  
  // Find the end of VERIFIED_ATTACKS array
  const arrayEndPattern = /(conflictZone: 'us-iran-war-2026'\s*\}\s*)\];\s*\/\/ =+/;
  const match = content.match(arrayEndPattern);
  
  if (!match) {
    throw new Error('Could not find insertion point in database file');
  }
  
  const insertPoint = content.indexOf(match[0]) + match[1].length;
  const attackStr = JSON.stringify(attackObj, null, 2);
  const newContent = content.slice(0, insertPoint) + 
    `,\n  // Added via Telegram Bot on ${new Date().toISOString()}\n  ${attackStr}` + 
    content.slice(insertPoint);
  
  fs.writeFileSync(filePath, newContent);
  console.log(`[Bot] Added attack: ${attack.ID}`);
  return attackObj;
}

async function addMultipleToDatabase(attacks) {
  const results = [];
  for (const attack of attacks) {
    try {
      const result = await addToDatabase(attack);
      results.push(result);
    } catch (err) {
      console.error(`[Bot] Failed to add ${attack.ID}:`, err.message);
    }
  }
  return results;
}

function gitPush(message) {
  try {
    execSync('git add server/data/verifiedAttacks.js', { cwd: __dirname });
    execSync(`git commit -m "${message}"`, { cwd: __dirname });
    execSync('git push origin master', { cwd: __dirname });
    console.log('[Bot] Git push successful');
    return true;
  } catch (err) {
    console.error('[Bot] Git push failed:', err.message);
    throw new Error('Git push failed: ' + err.message);
  }
}

async function handleHelp(chatId) {
  await sendMessage(chatId,
    '📖 **WW3 Tracker Bot Commands**\n\n' +
    '`/publish` - Publish single attack\n' +
    '`/batch` - Publish multiple attacks (5-6 at once)\n' +
    '`/status` - Check bot status\n' +
    '`/help` - Show this message\n\n' +
    '**For single attack:**\n' +
    '`/publish` + fields\n\n' +
    '**For batch (multiple):**\n' +
    '`/batch` + incidents separated by `---`'
  );
}

async function handleStatus(chatId) {
  await sendMessage(chatId,
    '🤖 **WW3 Tracker Bot Status**\n\n' +
    '✅ Bot is running\n' +
    `📊 Pending: ${pendingAttacks.size}\n` +
    `⏰ Last poll: ${new Date().toISOString()}`
  );
}

async function handleSinglePublish(msg, chatId) {
  const text = msg.text.replace('/publish', '').trim();
  
  if (!text || !text.includes('LOCATION:')) {
    await sendMessage(chatId, 
      '❌ Invalid format. Use:\n\n' +
      '`/publish`\n' +
      '`LOCATION:` Tehran\n' +
      '`COUNTRY:` Iran\n' +
      '`TIME:` 2026-03-25 03:00 UTC\n' +
      '`TYPE:` airstrike\n' +
      '`SEVERITY:` high\n' +
      '`TARGET:` Azadi oil refinery\n' +
      '`HEADLINE:` Israeli jets strike Tehran refinery\n' +
      '`SOURCE:` Reuters, IntelCrab\n' +
      '`NARRATIVE:` At 3 AM local time...'
    );
    return;
  }
  
  try {
    const attack = parseSingleAttack(text);
    validateAttack(attack);
    
    // Store pending with message ID as key
    pendingAttacks.set(msg.message_id.toString(), { type: 'single', data: attack });
    
    const preview = `
📋 **ATTACK PREVIEW**

📍 **${attack.LOCATION}**, ${attack.COUNTRY}
⏰ ${attack.TIME}
💥 ${attack.TYPE} | ${attack.SEVERITY.toUpperCase()}
🎯 ${attack.TARGET}
📰 ${attack.HEADLINE}

✅ Publish this attack?
    `.trim();
    
    await sendMessage(chatId, preview, {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ YES - Publish', callback_data: `confirm_${msg.message_id}` },
          { text: '❌ NO - Cancel', callback_data: `cancel_${msg.message_id}` }
        ]]
      }
    });
    
  } catch (err) {
    await sendMessage(chatId, `❌ Error: ${err.message}`);
  }
}

async function handleBatchPublish(msg, chatId) {
  const text = msg.text.replace('/batch', '').trim();
  
  if (!text || !text.includes('LOCATION:')) {
    await sendMessage(chatId, 
      '❌ Invalid format. Use:\n\n' +
      '`/batch`\n' +
      '`LOCATION:` Kuwait\n' +
      '`COUNTRY:` Kuwait\n' +
      '`TIME:` 2026-03-21 08:00 UTC\n' +
      '`TYPE:` drone\n' +
      '`SEVERITY:` critical\n' +
      '`TARGET:` Mina al-Ahmadi refinery\n' +
      '`HEADLINE:` Iran strikes Kuwait oil refinery\n' +
      '`SOURCE:` Reuters, Al Jazeera\n' +
      '`NARRATIVE:` Drone attack caused fires...\n\n' +
      '`---`\n\n' +
      '`LOCATION:` Ras Laffan\n' +
      '`COUNTRY:` Qatar\n' +
      '... (next incident)\n\n' +
      '💡 **Tip:** You can include up to 10 attacks in one batch!'
    );
    return;
  }
  
  try {
    const attacks = parseBatchAttacks(text);
    
    if (attacks.length === 0) {
      await sendMessage(chatId, '❌ No valid attacks found. Check format.');
      return;
    }
    
    if (attacks.length > 10) {
      await sendMessage(chatId, 
        `⚠️ **Too many attacks!**\n\n` +
        `Found ${attacks.length} attacks.\n` +
        `Maximum is 10 per batch.\n\n` +
        `Please split into multiple batches.`
      );
      return;
    }
    
    // Validate all
    for (const attack of attacks) {
      validateAttack(attack);
    }
    
    // Store pending batch
    pendingAttacks.set(msg.message_id.toString(), { type: 'batch', data: attacks });
    
    // Build summary preview
    let preview = `📋 **BATCH PREVIEW: ${attacks.length} ATTACKS**\n\n`;
    attacks.forEach((attack, i) => {
      preview += `${i + 1}. **${attack.LOCATION}** - ${attack.HEADLINE.substring(0, 45)}${attack.HEADLINE.length > 45 ? '...' : ''}\n`;
    });
    
    preview += `\n✅ Publish all ${attacks.length} attacks?`;
    
    await sendMessage(chatId, preview, {
      reply_markup: {
        inline_keyboard: [[
          { text: `✅ YES - Publish ${attacks.length}`, callback_data: `confirm_${msg.message_id}` },
          { text: '❌ NO - Cancel', callback_data: `cancel_${msg.message_id}` }
        ]]
      }
    });
    
  } catch (err) {
    await sendMessage(chatId, `❌ Error: ${err.message}`);
  }
}

async function handleCallback(query) {
  const chatId = query.message.chat.id.toString();
  const data = query.data;
  
  if (!data.startsWith('confirm_') && !data.startsWith('cancel_')) {
    return;
  }
  
  const [action, msgId] = data.split('_');
  const pending = pendingAttacks.get(msgId);
  
  if (action === 'cancel') {
    pendingAttacks.delete(msgId);
    await telegramApi('editMessageText', {
      chat_id: chatId,
      message_id: query.message.message_id,
      text: '❌ **Cancelled**',
      parse_mode: 'Markdown'
    });
    await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Cancelled' });
    return;
  }
  
  if (action === 'confirm' && pending) {
    await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Publishing...' });
    
    try {
      if (pending.type === 'single') {
        // Single attack
        await addToDatabase(pending.data);
        gitPush(`Add attack: ${pending.data.HEADLINE.substring(0, 50)}`);
        
        await telegramApi('editMessageText', {
          chat_id: chatId,
          message_id: query.message.message_id,
          text: `✅ **PUBLISHED!**\n\n🔗 ww3tracker.live\n⏳ Site updating in 2-3 minutes...`,
          parse_mode: 'Markdown'
        });
      } else {
        // Batch attacks
        const results = await addMultipleToDatabase(pending.data);
        const headlines = pending.data.map(a => a.HEADLINE.substring(0, 30)).join(', ');
        gitPush(`Add ${results.length} attacks: ${headlines.substring(0, 60)}...`);
        
        // Build success message with list
        let successMsg = `✅ **PUBLISHED ${results.length} ATTACKS!**\n\n`;
        results.forEach((attack, i) => {
          successMsg += `${i + 1}. ${attack.location}\n`;
        });
        successMsg += `\n🔗 ww3tracker.live\n⏳ Site updating...`;
        
        await telegramApi('editMessageText', {
          chat_id: chatId,
          message_id: query.message.message_id,
          text: successMsg,
          parse_mode: 'Markdown'
        });
      }
      
      pendingAttacks.delete(msgId);
      
    } catch (err) {
      await telegramApi('editMessageText', {
        chat_id: chatId,
        message_id: query.message.message_id,
        text: `❌ **Error:** ${err.message}`,
        parse_mode: 'Markdown'
      });
    }
  }
}

async function poll() {
  if (isProcessing) return;
  isProcessing = true;
  
  try {
    const result = await telegramApi('getUpdates', {
      offset: lastUpdateId + 1,
      limit: 10
    });
    
    if (result.ok && result.result && result.result.length > 0) {
      for (const update of result.result) {
        if (processedUpdates.has(update.update_id)) continue;
        processedUpdates.add(update.update_id);
        
        if (processedUpdates.size > 50) {
          const oldest = [...processedUpdates].slice(0, 25);
          oldest.forEach(id => processedUpdates.delete(id));
        }
        
        // Handle channel posts (commands)
        if (update.channel_post) {
          const msg = update.channel_post;
          const text = msg.text || '';
          const chatId = msg.chat.id.toString();
          
          if (chatId !== CHANNEL_ID) continue;
          
          if (text.startsWith('/publish')) {
            await handleSinglePublish(msg, chatId);
          } else if (text.startsWith('/batch')) {
            await handleBatchPublish(msg, chatId);
          } else if (text === '/help') {
            await handleHelp(chatId);
          } else if (text === '/status') {
            await handleStatus(chatId);
          }
        }
        
        // Handle callback queries (button clicks)
        if (update.callback_query) {
          await handleCallback(update.callback_query);
        }
        
        lastUpdateId = Math.max(lastUpdateId, update.update_id);
      }
    }
  } catch (err) {
    console.error('Poll error:', err.message);
  } finally {
    isProcessing = false;
  }
}

// Start polling
setInterval(poll, 5000);
console.log('✅ Bot polling started! (5 second interval)');
poll();

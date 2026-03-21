/**
 * Simple Telegram Bot Service using manual polling
 * More reliable than node-telegram-bot-api's built-in polling
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { getCoordinates } from './locationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let BOT_TOKEN = null;
let CHANNEL_ID = null;
let isRunning = false;
let lastUpdateId = 0;
let pollInterval = null;
const pendingAttacks = new Map();

const API_BASE = 'https://api.telegram.org/bot';

/**
 * Make Telegram API request
 */
async function telegramApi(method, params = {}) {
  const url = new URL(`${API_BASE}${BOT_TOKEN}/${method}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    const response = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`[TelegramBot] API timeout (${method})`);
    } else {
      console.error(`[TelegramBot] API error (${method}):`, err.message);
    }
    return { ok: false, error: err.message };
  }
}

/**
 * Parse attack data from AI pipeline
 */
function parseAttackData(text) {
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

/**
 * Validate required fields
 */
function validateAttack(data) {
  const required = ['LOCATION', 'COUNTRY', 'TIME', 'TYPE', 'SEVERITY', 'TARGET', 'HEADLINE'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(data.SEVERITY.toLowerCase())) {
    throw new Error(`Invalid severity. Must be one of: ${validSeverities.join(', ')}`);
  }
  
  return true;
}

/**
 * Send message to chat
 */
async function sendMessage(chatId, text, options = {}) {
  console.log('[TelegramBot] sendMessage to:', chatId);
  const result = await telegramApi('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: options.parse_mode || 'Markdown',
    reply_markup: options.reply_markup ? JSON.stringify(options.reply_markup) : undefined
  });
  console.log('[TelegramBot] sendMessage result:', result.ok ? 'OK' : 'FAILED', result.error || '');
  return result;
}

/**
 * Handle /publish command
 */
async function handlePublishCommand(msg) {
  const chatId = msg.chat.id.toString();
  
  if (chatId !== CHANNEL_ID) {
    await sendMessage(msg.chat.id, '❌ Not authorized. This bot only works in the designated channel.');
    return;
  }
  
  const text = msg.text.replace('/publish', '').trim();
  
  if (!text || !text.includes('LOCATION:')) {
    await sendMessage(msg.chat.id, 
      '❌ Invalid format. Use:\n\n' +
      '/publish\n' +
      'LOCATION: Tehran\n' +
      'COUNTRY: Iran\n' +
      'TIME: 2026-03-25 03:00 UTC\n' +
      'TYPE: airstrike\n' +
      'SEVERITY: high\n' +
      'TARGET: Azadi oil refinery\n' +
      'HEADLINE: Israeli jets strike Tehran refinery\n' +
      'SOURCE: Reuters, IntelCrab\n' +
      'NARRATIVE: At 3 AM local time...'
    );
    return;
  }
  
  try {
    const attack = parseAttackData(text);
    validateAttack(attack);
    
    pendingAttacks.set(chatId, attack);
    
    const preview = `
📋 **ATTACK PREVIEW**

📍 **${attack.LOCATION}**, ${attack.COUNTRY}
⏰ ${attack.TIME}
💥 ${attack.TYPE} | ${attack.SEVERITY.toUpperCase()}
🎯 ${attack.TARGET}
📰 ${attack.HEADLINE}

📝 **NARRATIVE:**
${attack.NARRATIVE ? attack.NARRATIVE.substring(0, 200) + '...' : '(none)'}

✅ Publish this attack?
    `.trim();
    
    await sendMessage(msg.chat.id, preview, {
      reply_markup: {
        inline_keyboard: [[
          { text: '✅ YES - Publish', callback_data: 'confirm_publish' },
          { text: '❌ NO - Cancel', callback_data: 'cancel_publish' }
        ]]
      }
    });
    
  } catch (err) {
    await sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
  }
}

/**
 * Handle /help command
 */
async function handleHelpCommand(msg) {
  const chatId = msg.chat.id.toString();
  console.log('[TelegramBot] handleHelpCommand - chatId:', chatId, 'CHANNEL_ID:', CHANNEL_ID);
  
  if (chatId !== CHANNEL_ID) {
    console.log('[TelegramBot] Unauthorized - chatId mismatch');
    await sendMessage(msg.chat.id, '❌ Not authorized');
    return;
  }
  
  console.log('[TelegramBot] Sending help message...');
  
  await sendMessage(msg.chat.id,
    '📖 **WW3 Tracker Bot Commands**\n\n' +
    '`/publish` - Publish new attack\n' +
    '`/status` - Check bot status\n' +
    '`/help` - Show this message\n\n' +
    '**Required fields:**\n' +
    '• LOCATION, COUNTRY, TIME\n' +
    '• TYPE, SEVERITY, TARGET\n' +
    '• HEADLINE, SOURCE\n' +
    '• NARRATIVE (optional)'
  );
}

/**
 * Handle /status command
 */
async function handleStatusCommand(msg) {
  const chatId = msg.chat.id.toString();
  
  if (chatId !== CHANNEL_ID) {
    await sendMessage(msg.chat.id, '❌ Not authorized');
    return;
  }
  
  await sendMessage(msg.chat.id, 
    '🤖 **WW3 Tracker Bot Status**\n\n' +
    '✅ Bot is running\n' +
    `📊 Pending attacks: ${pendingAttacks.size}\n` +
    `⏰ Last poll: ${new Date().toISOString()}`
  );
}

/**
 * Process a single update
 */
async function processUpdate(update) {
  console.log('[TelegramBot] Processing update:', update.update_id);
  
  // Handle channel posts
  if (update.channel_post) {
    const msg = update.channel_post;
    const text = msg.text || '';
    const chatId = msg.chat.id.toString();
    
    console.log('[TelegramBot] Channel post:', text.substring(0, 50));
    console.log('[TelegramBot] Chat ID:', chatId, 'Expected:', CHANNEL_ID);
    
    if (text.startsWith('/publish')) {
      console.log('[TelegramBot] Handling /publish');
      await handlePublishCommand(msg);
    } else if (text === '/help') {
      console.log('[TelegramBot] Handling /help');
      await handleHelpCommand(msg);
    } else if (text === '/status') {
      console.log('[TelegramBot] Handling /status');
      await handleStatusCommand(msg);
    } else {
      console.log('[TelegramBot] Unknown command');
    }
  }
  
  // Handle callback queries (button clicks)
  if (update.callback_query) {
    const query = update.callback_query;
    const chatId = query.message.chat.id.toString();
    const action = query.data;
    
    if (chatId !== CHANNEL_ID) {
      await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Not authorized' });
      return;
    }
    
    if (action === 'cancel_publish') {
      pendingAttacks.delete(chatId);
      await telegramApi('editMessageText', {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        text: '❌ **Cancelled**',
        parse_mode: 'Markdown'
      });
      await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Cancelled' });
      return;
    }
    
    if (action === 'confirm_publish' && pendingAttacks.has(chatId)) {
      const attack = pendingAttacks.get(chatId);
      
      await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Publishing...' });
      
      try {
        await addToDatabase(attack);
        await gitPush(attack);
        
        await telegramApi('editMessageText', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          text: `✅ **PUBLISHED!**\n\n🔗 ww3tracker.live/attack/${attack.ID}\n⏳ Site updating...`,
          parse_mode: 'Markdown'
        });
        
        pendingAttacks.delete(chatId);
        
      } catch (err) {
        await telegramApi('editMessageText', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          text: `❌ **Error:** ${err.message}`,
          parse_mode: 'Markdown'
        });
      }
    }
  }
}

/**
 * Poll for updates
 */
async function poll() {
  if (!isRunning) return;
  
  try {
    console.log('[TelegramBot] Polling for updates...');
    const result = await telegramApi('getUpdates', {
      offset: lastUpdateId + 1,
      limit: 10
    });
    
    if (result.ok) {
      if (result.result && result.result.length > 0) {
        console.log(`[TelegramBot] Got ${result.result.length} updates`);
        for (const update of result.result) {
          await processUpdate(update);
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
        }
      } else {
        console.log('[TelegramBot] No new updates');
      }
    } else {
      console.error('[TelegramBot] getUpdates failed:', result.error);
    }
  } catch (err) {
    console.error('[TelegramBot] Poll error:', err.message);
  }
}

/**
 * Add attack to database
 */
async function addToDatabase(attack) {
  const filePath = path.join(__dirname, '../../server/data/verifiedAttacks.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  let coordinates = { lat: 0, lng: 0 };
  try {
    const coords = await getCoordinates(attack.LOCATION);
    if (coords) coordinates = coords;
  } catch (err) {
    console.log(`[TelegramBot] Could not get coordinates for ${attack.LOCATION}`);
  }
  
  const attackObj = {
    id: attack.ID,
    headline: attack.HEADLINE,
    description: attack.TARGET,
    location: attack.LOCATION,
    country: attack.COUNTRY,
    attackType: attack.TYPE.toLowerCase(),
    severity: attack.SEVERITY.toLowerCase(),
    date: new Date(attack.TIME).toISOString(),
    coordinates: coordinates,
    conflictZone: 'us-iran-war-2026',
    source: attack.SOURCE || 'Telegram Bot',
    narrative: attack.NARRATIVE || ''
  };
  
  const insertPoint = content.lastIndexOf('];');
  const attackStr = JSON.stringify(attackObj, null, 2);
  const newContent = content.slice(0, insertPoint) + 
    `  // Added via Telegram Bot on ${new Date().toISOString()}\n  ${attackStr},\n\n` + 
    content.slice(insertPoint);
  
  fs.writeFileSync(filePath, newContent);
  console.log(`[TelegramBot] Added attack: ${attack.ID}`);
  
  return attackObj;
}

/**
 * Git commit and push
 */
async function gitPush(attack) {
  const repoPath = path.join(__dirname, '../..');
  
  try {
    execSync('git add server/data/verifiedAttacks.js', { cwd: repoPath });
    execSync(`git commit -m "Add attack: ${attack.HEADLINE.substring(0, 50)}${attack.HEADLINE.length > 50 ? '...' : ''}"`, { cwd: repoPath });
    execSync('git push origin main', { cwd: repoPath });
    console.log(`[TelegramBot] Git push successful`);
    return true;
  } catch (err) {
    console.error('[TelegramBot] Git push failed:', err.message);
    throw new Error(`Git operation failed: ${err.message}`);
  }
}

/**
 * Start the bot
 */
export function start() {
  BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
  
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('[TelegramBot] Not starting - missing config');
    return false;
  }
  
  if (isRunning) {
    console.log('[TelegramBot] Already running');
    return true;
  }
  
  isRunning = true;
  
  // Poll every 2 seconds
  pollInterval = setInterval(poll, 2000);
  
  console.log('[TelegramBot] Started successfully (manual polling)');
  console.log(`[TelegramBot] Token: ${BOT_TOKEN.slice(0, 10)}...`);
  console.log(`[TelegramBot] Channel ID: ${CHANNEL_ID}`);
  
  return true;
}

/**
 * Stop the bot
 */
export function stop() {
  isRunning = false;
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  console.log('[TelegramBot] Stopped');
}

export function getStatus() {
  return {
    running: isRunning,
    pendingAttacks: pendingAttacks.size
  };
}

export default { start, stop, getStatus };

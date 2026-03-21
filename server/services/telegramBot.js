/**
 * Telegram Bot Service for WW3 Tracker
 * Handles /publish command with structured attack data from AI pipeline
 */

import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { getCoordinates } from './locationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let BOT_TOKEN = null;
let CHANNEL_ID = null;
let bot = null;
let isRunning = false;
const pendingAttacks = new Map(); // Store pending attacks by chat ID

/**
 * Parse attack data from AI pipeline text format
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
  
  // Extract narrative (everything after NARRATIVE:)
  const narrativeMatch = text.match(/NARRATIVE:(.*)/s);
  data.NARRATIVE = narrativeMatch ? narrativeMatch[1].trim() : '';
  
  // Generate ID from date, location, and type
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
  
  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(data.SEVERITY.toLowerCase())) {
    throw new Error(`Invalid severity. Must be one of: ${validSeverities.join(', ')}`);
  }
  
  return true;
}

/**
 * Add attack to verifiedAttacks.js database
 */
async function addToDatabase(attack) {
  const filePath = path.join(__dirname, '../../server/data/verifiedAttacks.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Get coordinates for the location
  let coordinates = { lat: 0, lng: 0 };
  try {
    const coords = await getCoordinates(attack.LOCATION);
    if (coords) {
      coordinates = coords;
    }
  } catch (err) {
    console.log(`[TelegramBot] Could not get coordinates for ${attack.LOCATION}:`, err.message);
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
  
  // Find the insertion point (before the closing ];)
  const insertPoint = content.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error('Could not find insertion point in verifiedAttacks.js');
  }
  
  const attackStr = JSON.stringify(attackObj, null, 2);
  const newContent = content.slice(0, insertPoint) + 
    `  // Added via Telegram Bot on ${new Date().toISOString()}\n  ${attackStr},\n\n` + 
    content.slice(insertPoint);
  
  fs.writeFileSync(filePath, newContent);
  console.log(`[TelegramBot] Added attack to database: ${attack.ID}`);
  
  return attackObj;
}

/**
 * Commit and push to git (triggers Railway deploy)
 */
function gitPush(attack) {
  const repoPath = path.join(__dirname, '../..');
  
  try {
    // Check if git is available and we're in a repo
    execSync('git rev-parse --git-dir', { cwd: repoPath, stdio: 'pipe' });
    
    // Stage the file
    execSync('git add server/data/verifiedAttacks.js', { cwd: repoPath });
    
    // Commit
    const commitMsg = `Add attack: ${attack.HEADLINE.substring(0, 50)}${attack.HEADLINE.length > 50 ? '...' : ''}`;
    execSync(`git commit -m "${commitMsg}"`, { cwd: repoPath });
    
    // Push
    execSync('git push origin main', { cwd: repoPath });
    
    console.log(`[TelegramBot] Git push successful: ${attack.ID}`);
    return true;
  } catch (err) {
    console.error('[TelegramBot] Git push failed:', err.message);
    throw new Error(`Git operation failed: ${err.message}`);
  }
}

/**
 * Start the Telegram bot
 */
export function start() {
  // Load env vars here (after dotenv has been configured by server.js)
  BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
  
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('[TelegramBot] Not starting - missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID');
    return false;
  }
  
  if (isRunning) {
    console.log('[TelegramBot] Already running');
    return true;
  }
  
  try {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    isRunning = true;
    
    console.log('[TelegramBot] Started successfully');
    console.log(`[TelegramBot] Token: ${BOT_TOKEN?.slice(0, 10)}...`);
    console.log(`[TelegramBot] Channel ID: ${CHANNEL_ID}`);
    
    // Handle ALL messages (debug)
    bot.on('message', (msg) => {
      console.log('[TelegramBot] Received message:', {
        chatId: msg.chat.id,
        chatType: msg.chat.type,
        text: msg.text?.substring(0, 50),
        from: msg.from?.username
      });
    });
    
    // Handle CHANNEL POSTS (this is what channels use!)
    bot.on('channel_post', (msg) => {
      console.log('[TelegramBot] Received channel_post:', {
        chatId: msg.chat.id,
        text: msg.text?.substring(0, 50)
      });
    });
    
    // /publish command handler (for direct messages)
    bot.onText(/\/publish/, (msg) => {
      handlePublishCommand(msg);
    });
    
    // Handle channel posts for /publish
    bot.on('channel_post', (msg) => {
      const text = msg.text || '';
      if (text.startsWith('/publish')) {
        handlePublishCommand(msg);
      } else if (text === '/help') {
        handleHelpCommand(msg);
      } else if (text === '/status') {
        handleStatusCommand(msg);
      }
    });
    
    // Main publish handler function
    function handlePublishCommand(msg) {
      const chatId = msg.chat.id.toString();
      
      // Only allow from authorized channel
      if (chatId !== CHANNEL_ID) {
        bot.sendMessage(msg.chat.id, '❌ Not authorized. This bot only works in the designated channel.');
        return;
      }
      
      const text = msg.text.replace('/publish', '').trim();
      
      if (!text || !text.includes('LOCATION:')) {
        bot.sendMessage(msg.chat.id, 
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
        
        // Store pending attack
        pendingAttacks.set(chatId, attack);
        
        // Show preview
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
        
        bot.sendMessage(msg.chat.id, preview, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '✅ YES - Publish', callback_data: 'confirm_publish' },
                { text: '❌ NO - Cancel', callback_data: 'cancel_publish' }
              ]
            ]
          }
        });
        
      } catch (err) {
        bot.sendMessage(msg.chat.id, `❌ Error: ${err.message}`);
      }
    }
    
    // Handle callback queries (button clicks)
    bot.on('callback_query', async (query) => {
      const chatId = query.message.chat.id.toString();
      const action = query.data;
      
      // Only allow from authorized channel
      if (chatId !== CHANNEL_ID) {
        bot.answerCallbackQuery(query.id, { text: 'Not authorized' });
        return;
      }
      
      if (action === 'cancel_publish') {
        pendingAttacks.delete(chatId);
        bot.editMessageText('❌ **Cancelled**', {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          parse_mode: 'Markdown'
        });
        bot.answerCallbackQuery(query.id, { text: 'Cancelled' });
        return;
      }
      
      if (action === 'confirm_publish') {
        const attack = pendingAttacks.get(chatId);
        
        if (!attack) {
          bot.editMessageText('❌ **Error: Attack data not found. Please try again.**', {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id,
            parse_mode: 'Markdown'
          });
          bot.answerCallbackQuery(query.id, { text: 'Error' });
          return;
        }
        
        bot.answerCallbackQuery(query.id, { text: 'Publishing...' });
        
        try {
          // Step 1: Add to database
          await addToDatabase(attack);
          
          // Step 2: Git commit and push
          gitPush(attack);
          
          // Step 3: Confirm success
          bot.editMessageText(
            `✅ **PUBLISHED SUCCESSFULLY!**\n\n` +
            `🔗 ww3tracker.live/attack/${attack.ID}\n` +
            `⏳ Site will update in 2-3 minutes...\n\n` +
            `📍 ${attack.LOCATION}, ${attack.COUNTRY}\n` +
            `💥 ${attack.HEADLINE}`,
            {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              parse_mode: 'Markdown'
            }
          );
          
          pendingAttacks.delete(chatId);
          
        } catch (err) {
          console.error('[TelegramBot] Publish error:', err);
          bot.editMessageText(
            `❌ **PUBLISH FAILED**\n\n` +
            `Error: ${err.message}\n\n` +
            `Please check server logs and try again.`,
            {
              chat_id: query.message.chat.id,
              message_id: query.message.message_id,
              parse_mode: 'Markdown'
            }
          );
        }
      }
    });
    
    // /status command handler functions
    function handleStatusCommand(msg) {
      const chatId = msg.chat.id.toString();
      
      if (chatId !== CHANNEL_ID) {
        bot.sendMessage(msg.chat.id, '❌ Not authorized');
        return;
      }
      
      bot.sendMessage(msg.chat.id, 
        '🤖 **WW3 Tracker Bot Status**\n\n' +
        '✅ Bot is running\n' +
        `📊 Pending attacks: ${pendingAttacks.size}\n` +
        `⏰ Last check: ${new Date().toISOString()}`,
        { parse_mode: 'Markdown' }
      );
    }
    
    // /help command handler function
    function handleHelpCommand(msg) {
      const chatId = msg.chat.id.toString();
      
      if (chatId !== CHANNEL_ID) {
        bot.sendMessage(msg.chat.id, '❌ Not authorized');
        return;
      }
      
      bot.sendMessage(msg.chat.id,
        '📖 **WW3 Tracker Bot Commands**\n\n' +
        '`/publish` - Publish new attack with full details\n' +
        '`/status` - Check bot status\n' +
        '`/help` - Show this help message\n\n' +
        '**Required fields for /publish:**\n' +
        '• LOCATION: City name\n' +
        '• COUNTRY: Country name\n' +
        '• TIME: ISO format (2026-03-25 03:00 UTC)\n' +
        '• TYPE: airstrike/missile/cyber/ground\n' +
        '• SEVERITY: low/medium/high/critical\n' +
        '• TARGET: What was hit\n' +
        '• HEADLINE: News headline\n' +
        '• SOURCE: Verification source\n' +
        '• NARRATIVE: Story text (optional)',
        { parse_mode: 'Markdown' }
      );
    }
    
    // /status command (for direct messages)
    bot.onText(/\/status/, (msg) => {
      handleStatusCommand(msg);
    });
    
    // /help command (for direct messages)
    bot.onText(/\/help/, (msg) => {
      handleHelpCommand(msg);
    });
    
    // Handle errors
    bot.on('error', (err) => {
      console.error('[TelegramBot] Error:', err.message);
    });
    
    bot.on('polling_error', (err) => {
      console.error('[TelegramBot] Polling error:', err.message);
    });
    
    return true;
    
  } catch (err) {
    console.error('[TelegramBot] Failed to start:', err.message);
    isRunning = false;
    return false;
  }
}

/**
 * Stop the bot
 */
export function stop() {
  if (bot) {
    bot.stopPolling();
    isRunning = false;
    console.log('[TelegramBot] Stopped');
  }
}

/**
 * Get bot status
 */
export function getStatus() {
  return {
    running: isRunning,
    pendingAttacks: pendingAttacks.size
  };
}

export default { start, stop, getStatus };

/**
 * Telegram Bot with /blog auto-publish feature
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.error('Missing config');
  process.exit(1);
}

let lastUpdateId = 0;
const processedUpdates = new Set();
let isProcessing = false;
const pendingBlogs = new Map();

console.log('🤖 Blog Bot Starting...');

async function telegramApi(method, params = {}) {
  const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined) url.searchParams.append(key, params[key]);
  });
  try {
    const response = await fetch(url.toString());
    return await response.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function sendMessage(chatId, text, options = {}) {
  const params = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (options.reply_markup) params.reply_markup = JSON.stringify(options.reply_markup);
  return telegramApi('sendMessage', params);
}

function downloadFile(fileUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(fileUrl, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`Status ${res.statusCode}`)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(outputPath); });
    }).on('error', reject);
  });
}

// ============== PARSING ==============

function extractField(text, fieldName) {
  const pattern = new RegExp(`${fieldName}:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`, 'i');
  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}

function parseBlogData(text) {
  console.log('[Parse] Input length:', text.length);
  console.log('[Parse] First 200 chars:', text.substring(0, 200));
  
  // Remove /blog command
  const cleanText = text.replace(/^\/blog\s*\n?/i, '').trim();
  
  const data = {};
  data.title = extractField(cleanText, 'TITLE');
  data.category = extractField(cleanText, 'CATEGORY') || 'analysis';
  data.tags = (extractField(cleanText, 'TAGS') || '').split(',').map(t => t.trim()).filter(t => t);
  data.content = extractField(cleanText, 'CONTENT');
  data.faqText = extractField(cleanText, 'FAQ');
  
  console.log('[Parse] Title:', data.title);
  console.log('[Parse] Has content:', !!data.content);
  console.log('[Parse] Content length:', data.content?.length);
  
  if (!data.title) throw new Error('Missing TITLE');
  if (!data.content) throw new Error('Missing CONTENT');
  
  // Parse FAQ
  data.faq = [];
  if (data.faqText) {
    const lines = data.faqText.split('\n');
    let currentQ = null;
    let currentA = [];
    
    for (const line of lines) {
      const qMatch = line.match(/^Q:\s*(.+)/i);
      const aMatch = line.match(/^A:\s*(.+)/i);
      
      if (qMatch) {
        if (currentQ && currentA.length) {
          data.faq.push({ question: currentQ, answer: currentA.join(' ') });
        }
        currentQ = qMatch[1];
        currentA = [];
      } else if (aMatch) {
        currentA.push(aMatch[1]);
      } else if (currentA.length) {
        currentA.push(line.trim());
      }
    }
    if (currentQ && currentA.length) {
      data.faq.push({ question: currentQ, answer: currentA.join(' ') });
    }
  }
  
  // Generate fields
  data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
  
  const firstPara = data.content.split('\n\n')[0] || '';
  data.excerpt = firstPara.replace(/##?\s*/g, '').substring(0, 150) + '...';
  
  const wordCount = data.content.split(/\s+/).length;
  data.readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' min';
  
  // Sections
  data.sections = [];
  const sectionMatches = data.content.match(/##\s*(.+?)(?=\n|$)/g);
  if (sectionMatches) {
    sectionMatches.forEach((m, i) => {
      data.sections.push({ id: `section-${i}`, title: m.replace(/##\s*/, '').trim() });
    });
  }
  
  // Quick facts
  data.quickFacts = [];
  const boldMatches = data.content.match(/\*\*([^*]+?)\*\*/g);
  if (boldMatches) {
    let count = 0;
    for (const fact of boldMatches) {
      if (count >= 4) break;
      const clean = fact.replace(/\*\*/g, '');
      if (clean.includes(':')) {
        const parts = clean.split(':');
        if (parts.length === 2) {
          data.quickFacts.push({ label: parts[0].trim().substring(0, 20), value: parts[1].trim().substring(0, 30) });
          count++;
        }
      }
    }
  }
  
  data.keyTakeaway = { points: [firstPara.replace(/##?\s*/, '').trim() || 'Key insight'] };
  
  return data;
}

// ============== DATABASE ==============

async function addBlogToDatabase(blogData, imageFilename) {
  const filePath = path.join(__dirname, 'src/data/blogPosts.js');
  let content = fs.readFileSync(filePath, 'utf8');
  
  const sectionsStr = blogData.sections.map((s, i) => `      { id: "${s.id}", title: "${s.title}" }${i < blogData.sections.length - 1 ? ',' : ''}`).join('\n');
  const tagsStr = blogData.tags.map((t, i) => `    "${t}"${i < blogData.tags.length - 1 ? ',' : ''}`).join('\n');
  const factsStr = blogData.quickFacts.map((f, i) => `      { label: "${f.label}", value: "${f.value}" }${i < blogData.quickFacts.length - 1 ? ',' : ''}`).join('\n');
  const faqStr = blogData.faq.map((q, i) => `      {\n        question: "${q.question}",\n        answer: "${q.answer}"\n      }${i < blogData.faq.length - 1 ? ',' : ''}`).join('\n');
  
  const entryStr = `  {
    id: "${blogData.slug}",
    slug: "${blogData.slug}",
    title: "${blogData.title}",
    excerpt: "${blogData.excerpt}",
    category: "${blogData.category.charAt(0).toUpperCase() + blogData.category.slice(1)}",
    readTime: "${blogData.readTime}",
    date: "${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}",
    image: "/images/blog/${imageFilename}",
    author: { name: "WW3 Tracker", role: "Conflict Analysis", avatar: null },
    tags: [${tagsStr ? '\n' + tagsStr + '\n    ' : ''}],
    sections: [${sectionsStr ? '\n' + sectionsStr + '\n    ' : ''}],
    quickFacts: [${factsStr ? '\n' + factsStr + '\n    ' : ''}],
    keyTakeaway: { points: ["${blogData.keyTakeaway.points[0]}"] },
    content: \`
${blogData.content}
\`,
    faq: [${faqStr ? '\n' + faqStr + '\n    ' : ''}]
  }`;
  
  const arrayStart = content.indexOf('export const blogPosts = [');
  const firstObject = content.indexOf('{', arrayStart);
  const newContent = content.slice(0, firstObject) + `\n  // Auto-published: ${new Date().toISOString()}\n${entryStr},\n` + content.slice(firstObject);
  
  fs.writeFileSync(filePath, newContent);
  console.log('[Bot] Added blog:', blogData.slug);
  return blogData.slug;
}

function gitPushBlog(slug, imagePath) {
  const repoPath = __dirname;
  execSync('git add src/data/blogPosts.js', { cwd: repoPath });
  execSync(`git add "${imagePath}"`, { cwd: repoPath });
  execSync(`git commit -m "📝 Blog: ${slug}"`, { cwd: repoPath });
  execSync('git push origin master', { cwd: repoPath });
  console.log('[Bot] Git push done');
}

// ============== HANDLERS ==============

async function handleBlog(msg, chatId) {
  const text = msg.text || msg.caption || '';
  const photo = msg.photo?.[msg.photo.length - 1];
  
  if (!photo) {
    await sendMessage(chatId, '❌ Attach an image!');
    return;
  }
  
  try {
    const blogData = parseBlogData(text);
    
    const pendingKey = msg.message_id.toString();
    pendingBlogs.set(pendingKey, { data: blogData, photoFileId: photo.file_id });
    
    const preview = `📝 **BLOG PREVIEW**\n\n📰 **${blogData.title}**\n🏷️ ${blogData.category} | ⏱️ ${blogData.readTime}\n📄 ${blogData.sections.length} sections | ❓ ${blogData.faq.length} FAQs\n\n✅ Publish?`;
    
    await sendMessage(chatId, preview, {
      reply_markup: { inline_keyboard: [[
        { text: '✅ YES', callback_data: `confirm_${pendingKey}` },
        { text: '❌ NO', callback_data: `cancel_${pendingKey}` }
      ]]}
    });
  } catch (err) {
    console.error('[Bot] Parse error:', err);
    await sendMessage(chatId, `❌ Error: ${err.message}`);
  }
}

async function handleConfirm(query, pendingKey) {
  const pending = pendingBlogs.get(pendingKey);
  if (!pending) return;
  
  const chatId = query.message.chat.id.toString();
  await telegramApi('answerCallbackQuery', { callback_query_id: query.id, text: 'Publishing...' });
  
  try {
    // Download image
    const fileInfo = await telegramApi('getFile', { file_id: pending.photoFileId });
    if (!fileInfo.ok) throw new Error('File info failed');
    
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.result.file_path}`;
    const ext = path.extname(fileInfo.result.file_path) || '.jpg';
    const filename = `${pending.data.slug}${ext}`;
    const imagePath = path.join(__dirname, 'public/images/blog', filename);
    
    fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    await downloadFile(fileUrl, imagePath);
    
    // Add to DB and push
    await addBlogToDatabase(pending.data, filename);
    gitPushBlog(pending.data.slug, imagePath);
    
    await telegramApi('editMessageText', {
      chat_id: chatId,
      message_id: query.message.message_id,
      text: `✅ **PUBLISHED**\n\n📝 "${pending.data.title}"\n🔗 ww3tracker.live/blog/${pending.data.slug}\n⏳ Updating...`,
      parse_mode: 'Markdown'
    });
    
    pendingBlogs.delete(pendingKey);
  } catch (err) {
    console.error('[Bot] Publish error:', err);
    await telegramApi('editMessageText', {
      chat_id, message_id: query.message.message_id,
      text: `❌ Error: ${err.message}`, parse_mode: 'Markdown'
    });
  }
}

async function handleCancel(query, pendingKey) {
  pendingBlogs.delete(pendingKey);
  await telegramApi('editMessageText', {
    chat_id: query.message.chat.id,
    message_id: query.message.message_id,
    text: '❌ Cancelled', parse_mode: 'Markdown'
  });
}

// ============== MAIN LOOP ==============

async function poll() {
  if (isProcessing) return;
  isProcessing = true;
  
  try {
    const result = await telegramApi('getUpdates', { offset: lastUpdateId + 1, limit: 10 });
    
    if (result.ok && result.result) {
      for (const update of result.result) {
        if (processedUpdates.has(update.update_id)) continue;
        processedUpdates.add(update.update_id);
        
        if (processedUpdates.size > 100) processedUpdates.clear();
        
        // Channel posts
        if (update.channel_post) {
          const msg = update.channel_post;
          const text = msg.text || msg.caption || '';
          const chatId = msg.chat.id.toString();
          
          if (chatId !== CHANNEL_ID) continue;
          
          if (text.startsWith('/blog')) {
            await handleBlog(msg, chatId);
          } else if (text === '/help') {
            await sendMessage(chatId, '📖 **Commands**\n\n`/blog` - Publish blog (attach image)\nFormat: TITLE, CATEGORY, TAGS, CONTENT, FAQ');
          }
        }
        
        // Callbacks
        if (update.callback_query) {
          const data = update.callback_query.data;
          if (data.startsWith('confirm_')) await handleConfirm(update.callback_query, data.replace('confirm_', ''));
          else if (data.startsWith('cancel_')) await handleCancel(update.callback_query, data.replace('cancel_', ''));
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

setInterval(poll, 5000);
console.log('✅ Bot started!');
poll();

import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create canvas (1200x630 for OG image)
const canvas = createCanvas(1200, 630);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
gradient.addColorStop(0, '#0a0a0a');
gradient.addColorStop(0.5, '#1a1a2e');
gradient.addColorStop(1, '#0f0f0f');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1200, 630);

// Add subtle grid pattern
ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
ctx.lineWidth = 1;
for (let i = 0; i < 1200; i += 40) {
  ctx.beginPath();
  ctx.moveTo(i, 0);
  ctx.lineTo(i, 630);
  ctx.stroke();
}
for (let i = 0; i < 630; i += 40) {
  ctx.beginPath();
  ctx.moveTo(0, i);
  ctx.lineTo(1200, i);
  ctx.stroke();
}

// Title - "US vs IRAN"
ctx.textAlign = 'center';
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 80px Arial';
ctx.fillText('US vs IRAN', 600, 140);

// Subtitle
ctx.font = '36px Arial';
ctx.fillStyle = '#888888';
ctx.fillText('LIVE War Tracker', 600, 200);

// VS Circle
ctx.beginPath();
ctx.arc(600, 320, 70, 0, Math.PI * 2);
ctx.fillStyle = '#dc2626';
ctx.fill();
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 48px Arial';
ctx.fillText('VS', 600, 335);

// US Side (Left)
ctx.textAlign = 'left';
ctx.fillStyle = '#3b82f6'; // Blue
ctx.font = 'bold 36px Arial';
ctx.fillText('🇺🇸 US', 120, 280);

ctx.font = '32px Arial';
ctx.fillText('💰 Sanctions: MAXED', 120, 340);
ctx.fillText('🌶️ Aggression: 87/100', 120, 390);

// Iran Side (Right)
ctx.textAlign = 'right';
ctx.fillStyle = '#dc2626'; // Red
ctx.font = 'bold 36px Arial';
ctx.fillText('IRAN 🇮🇷', 1080, 280);

ctx.font = '32px Arial';
ctx.fillText('☢️ Nukes: Almost™', 1080, 340);
ctx.fillText('🥷 Proxies: Active 🩸', 1080, 390);

// Bottom - URL (THIS IS THE FIXED PART!)
ctx.textAlign = 'center';
ctx.fillStyle = '#666666';
ctx.font = '28px Arial';
ctx.fillText('ww3tracker.live | Real-time satire tracker', 600, 570);

// Border
ctx.strokeStyle = '#333333';
ctx.lineWidth = 4;
ctx.strokeRect(2, 2, 1196, 626);

// Save
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
fs.writeFileSync(outputPath, buffer);

console.log('✅ OG Image generated successfully!');
console.log('📁 Saved to:', outputPath);
console.log('🔗 Domain updated to: ww3tracker.live');

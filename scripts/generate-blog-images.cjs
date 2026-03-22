// Generate blog hero images using Canvas
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'blog');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to save canvas
async function saveCanvas(canvas, filename) {
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
  console.log(`✓ Generated: ${filename}`);
}

// Image 1: F-35 Shot Down
async function generateF35Image() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Dark gradient background (smoky sky)
  const gradient = ctx.createLinearGradient(0, 0, 0, 630);
  gradient.addColorStop(0, '#1a1a2e');
  gradient.addColorStop(0.5, '#16213e');
  gradient.addColorStop(1, '#0f3460');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Smoke/cloud effects
  ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(200 + i * 200, 150 + Math.random() * 100, 80 + Math.random() * 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw F-35 silhouette (falling/angled)
  ctx.save();
  ctx.translate(600, 300);
  ctx.rotate(-0.3);
  
  // F-35 body
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(150, -10);
  ctx.lineTo(200, 0);
  ctx.lineTo(150, 10);
  ctx.lineTo(0, 20);
  ctx.lineTo(-50, 10);
  ctx.lineTo(-50, -10);
  ctx.closePath();
  ctx.fill();
  
  // Left wing
  ctx.beginPath();
  ctx.moveTo(20, -15);
  ctx.lineTo(-30, -80);
  ctx.lineTo(10, -60);
  ctx.closePath();
  ctx.fill();
  
  // Right wing
  ctx.beginPath();
  ctx.moveTo(20, 15);
  ctx.lineTo(-30, 80);
  ctx.lineTo(10, 60);
  ctx.closePath();
  ctx.fill();
  
  // Fire/smoke from tail
  const fireGradient = ctx.createRadialGradient(-60, 0, 0, -60, 0, 80);
  fireGradient.addColorStop(0, '#ff6b35');
  fireGradient.addColorStop(0.5, '#f7931e');
  fireGradient.addColorStop(1, 'rgba(247, 147, 30, 0)');
  ctx.fillStyle = fireGradient;
  ctx.beginPath();
  ctx.arc(-60, 0, 60, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();

  // Missile trail coming from bottom right
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(1200, 630);
  ctx.quadraticCurveTo(900, 500, 650, 320);
  ctx.stroke();
  
  // Missile trail glow
  ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
  ctx.lineWidth = 20;
  ctx.stroke();

  // Explosion at impact point
  const explodeGradient = ctx.createRadialGradient(650, 320, 0, 650, 320, 100);
  explodeGradient.addColorStop(0, '#fff');
  explodeGradient.addColorStop(0.2, '#ff6b35');
  explodeGradient.addColorStop(0.5, '#e74c3c');
  explodeGradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
  ctx.fillStyle = explodeGradient;
  ctx.beginPath();
  ctx.arc(650, 320, 100, 0, Math.PI * 2);
  ctx.fill();

  // Title text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 20;
  ctx.fillText('F-35 SHOT DOWN', 50, 520);
  
  ctx.font = '32px Arial';
  ctx.fillStyle = '#ff6b35';
  ctx.fillText('First Ever Combat Loss', 50, 570);
  
  // Badge
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.roundRect(950, 40, 200, 50, 8);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('BREAKING', 1050, 72);

  await saveCanvas(canvas, 'iran-shot-down-f35.jpg');
}

// Image 2: How Iran Hit Stealth (Tech breakdown)
async function generateStealthTechImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Tech grid background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 1200, 630);
  
  // Grid lines
  ctx.strokeStyle = 'rgba(0, 255, 150, 0.1)';
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

  // Left side: F-35 with radar waves
  ctx.save();
  ctx.translate(350, 315);
  
  // Radar waves (blocked/scattered)
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(-300, 0, 50 + i * 40, -0.5, 0.5);
    ctx.stroke();
  }
  
  // Scattered waves
  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i - 4) * 0.3);
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(180, 0);
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
    ctx.stroke();
    ctx.restore();
  }
  
  // F-35 silhouette
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath();
  ctx.moveTo(-60, -15);
  ctx.lineTo(60, -8);
  ctx.lineTo(90, 0);
  ctx.lineTo(60, 8);
  ctx.lineTo(-60, 15);
  ctx.lineTo(-30, 8);
  ctx.lineTo(-30, -8);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();

  // Right side: S-400/Bavar missile
  ctx.save();
  ctx.translate(850, 315);
  
  // Missile launcher
  ctx.fillStyle = '#5d4037';
  ctx.fillRect(-40, 80, 80, 60);
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(-50, 140, 100, 20);
  
  // Missile tubes
  ctx.fillStyle = '#263238';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(-30 + i * 20, 20, 12, 60);
  }
  
  // Launching missile with trail
  const missileGradient = ctx.createLinearGradient(0, -200, 0, 20);
  missileGradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
  missileGradient.addColorStop(1, 'rgba(255, 100, 0, 0.8)');
  ctx.fillStyle = missileGradient;
  ctx.beginPath();
  ctx.moveTo(-10, 20);
  ctx.lineTo(10, 20);
  ctx.lineTo(5, -150);
  ctx.lineTo(-5, -150);
  ctx.closePath();
  ctx.fill();
  
  // Missile body
  ctx.fillStyle = '#e0e0e0';
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(8, -140);
  ctx.lineTo(0, -120);
  ctx.lineTo(-8, -140);
  ctx.closePath();
  ctx.fill();
  
  // Radar dish
  ctx.fillStyle = '#37474f';
  ctx.beginPath();
  ctx.arc(0, -100, 40, 0, Math.PI, true);
  ctx.fill();
  ctx.fillStyle = '#00e676';
  ctx.beginPath();
  ctx.arc(0, -100, 30, 0, Math.PI, true);
  ctx.fill();
  
  ctx.restore();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('HOW IRAN BEAT STEALTH', 50, 550);
  
  ctx.font = '28px Arial';
  ctx.fillStyle = '#00e676';
  ctx.fillText('$1.7 Trillion vs $1 Million Missile', 50, 590);

  // Tech badge
  ctx.fillStyle = 'rgba(0, 230, 118, 0.2)';
  ctx.strokeStyle = '#00e676';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(900, 40, 250, 50, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#00e676';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TECH BREAKDOWN', 1025, 72);

  await saveCanvas(canvas, 'how-iran-hit-stealth.jpg');
}

// Image 3: Strait of Hormuz
async function generateHormuzImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Ocean blue background
  ctx.fillStyle = '#1a237e';
  ctx.fillRect(0, 0, 1200, 630);
  
  // Map-like styling
  // Persian Gulf area (lighter blue)
  ctx.fillStyle = '#3949ab';
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(400, 150);
  ctx.lineTo(500, 300);
  ctx.lineTo(450, 500);
  ctx.lineTo(0, 550);
  ctx.closePath();
  ctx.fill();
  
  // Land masses
  ctx.fillStyle = '#5d4037';
  // Iran (right side)
  ctx.beginPath();
  ctx.moveTo(600, 0);
  ctx.lineTo(900, 50);
  ctx.lineTo(1100, 200);
  ctx.lineTo(1200, 300);
  ctx.lineTo(1200, 0);
  ctx.closePath();
  ctx.fill();
  
  // UAE/Oman (bottom)
  ctx.beginPath();
  ctx.moveTo(400, 400);
  ctx.lineTo(700, 450);
  ctx.lineTo(1000, 630);
  ctx.lineTo(300, 630);
  ctx.closePath();
  ctx.fill();

  // Strait of Hormuz (narrow passage)
  const straitGradient = ctx.createLinearGradient(500, 0, 700, 0);
  straitGradient.addColorStop(0, 'rgba(255, 50, 50, 0.3)');
  straitGradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.6)');
  straitGradient.addColorStop(1, 'rgba(255, 50, 50, 0.3)');
  ctx.fillStyle = straitGradient;
  ctx.fillRect(500, 250, 200, 130);
  
  // Red X over strait
  ctx.strokeStyle = '#ff3333';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(520, 270);
  ctx.lineTo(680, 360);
  ctx.moveTo(680, 270);
  ctx.lineTo(520, 360);
  ctx.stroke();

  // Oil tanker icons
  ctx.fillStyle = '#ffeb3b';
  for (let i = 0; i < 3; i++) {
    const x = 200 + i * 150;
    const y = 200 + i * 50;
    // Tanker body
    ctx.fillRect(x, y, 80, 25);
    // Tanker cabin
    ctx.fillRect(x + 60, y - 10, 20, 15);
  }

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('STRAIT OF HORMUZ', 50, 80);
  
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = '#ff5252';
  ctx.fillText('CLOSURE SCENARIO', 50, 130);
  
  // Stats
  ctx.font = '24px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('21% of Global Oil Passes Here', 50, 580);

  // Warning badge
  ctx.fillStyle = '#ff3333';
  ctx.beginPath();
  ctx.roundRect(950, 40, 200, 50, 8);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('ECONOMIC RISK', 1050, 72);

  await saveCanvas(canvas, 'strait-hormuz-closure.jpg');
}

// Image 4: Every Strike Mapped
async function generateStrikesMappedImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Dark map background
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, 1200, 630);

  // Simplified Middle East map outline
  ctx.strokeStyle = '#4a4a6a';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#2a2a4a';
  
  // Rough Middle East shape
  ctx.beginPath();
  ctx.moveTo(200, 500); // Egypt area
  ctx.lineTo(300, 400); // Israel/Lebanon
  ctx.lineTo(450, 380); // Syria
  ctx.lineTo(550, 300); // Turkey border
  ctx.lineTo(800, 280); // Iran north
  ctx.lineTo(900, 350); // Iran east
  ctx.lineTo(850, 500); // Iran south
  ctx.lineTo(700, 520); // Gulf
  ctx.lineTo(500, 480); // Saudi
  ctx.lineTo(300, 520); // Red Sea
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Attack markers (red dots with glow)
  const attacks = [
    { x: 680, y: 320, label: 'Tehran', count: 7 },
    { x: 320, y: 380, label: 'Tel Aviv', count: 4 },
    { x: 280, y: 350, label: 'Beirut', count: 4 },
    { x: 720, y: 480, label: 'Bandar Abbas', count: 2 },
    { x: 500, y: 420, label: 'Baghdad', count: 3 },
    { x: 650, y: 450, label: 'Doha', count: 2 },
    { x: 580, y: 400, label: 'Kuwait', count: 2 },
  ];

  attacks.forEach(attack => {
    // Glow effect
    const glow = ctx.createRadialGradient(attack.x, attack.y, 0, attack.x, attack.y, 30);
    glow.addColorStop(0, 'rgba(231, 76, 60, 0.8)');
    glow.addColorStop(1, 'rgba(231, 76, 60, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(attack.x, attack.y, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Center dot
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(attack.x, attack.y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Pulse ring
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(attack.x, attack.y, 20, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('EVERY STRIKE MAPPED', 50, 550);
  
  ctx.font = '32px Arial';
  ctx.fillStyle = '#e74c3c';
  ctx.fillText('26 Verified Attacks • 8 Countries', 50, 595);

  // Stats box
  ctx.fillStyle = 'rgba(231, 76, 60, 0.2)';
  ctx.strokeStyle = '#e74c3c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(900, 480, 250, 120, 12);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('26', 1025, 530);
  ctx.font = '18px Arial';
  ctx.fillText('VERIFIED STRIKES', 1025, 555);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#aaa';
  ctx.fillText('Mar 17-21, 2026', 1025, 580);

  await saveCanvas(canvas, 'every-strike-mapped.jpg');
}

// Image 5: Could This Be WW3
async function generateWW3Image() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Dark ominous background
  const bgGradient = ctx.createRadialGradient(600, 315, 0, 600, 315, 600);
  bgGradient.addColorStop(0, '#2d1b1b');
  bgGradient.addColorStop(0.5, '#1a0f0f');
  bgGradient.addColorStop(1, '#0d0505');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Nuclear warning symbol (stylized)
  ctx.strokeStyle = '#ff3333';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(600, 280, 120, 0, Math.PI * 2);
  ctx.stroke();
  
  // Radiation symbol triangles
  ctx.fillStyle = '#ff3333';
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.translate(600, 280);
    ctx.rotate((i * 120) * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, -100);
    ctx.lineTo(-25, -40);
    ctx.lineTo(25, -40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  // Inner circle
  ctx.fillStyle = '#2d1b1b';
  ctx.beginPath();
  ctx.arc(600, 280, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ff3333';
  ctx.lineWidth = 3;
  ctx.stroke();

  // World map silhouette (faint)
  ctx.fillStyle = 'rgba(100, 100, 100, 0.1)';
  ctx.beginPath();
  ctx.arc(600, 280, 200, 0, Math.PI * 2);
  ctx.fill();

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px Arial';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
  ctx.shadowBlur = 20;
  ctx.fillText('COULD THIS BE', 600, 500);
  ctx.fillStyle = '#ff3333';
  ctx.fillText('WORLD WAR 3?', 600, 565);

  // Probability indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(450, 40, 300, 60, 10);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('WW3 PROBABILITY', 600, 65);
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#ffaa00';
  ctx.fillText('15-20%', 600, 90);

  await saveCanvas(canvas, 'could-this-be-ww3.jpg');
}

// Image 6: US vs Iran Military Updated
async function generateMilitaryUpdatedImage() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Split background
  // Left (US) - blue
  const usGradient = ctx.createLinearGradient(0, 0, 600, 0);
  usGradient.addColorStop(0, '#1a237e');
  usGradient.addColorStop(1, '#283593');
  ctx.fillStyle = usGradient;
  ctx.fillRect(0, 0, 600, 630);
  
  // Right (Iran) - green/red tint
  const iranGradient = ctx.createLinearGradient(600, 0, 1200, 0);
  iranGradient.addColorStop(0, '#1b5e20');
  iranGradient.addColorStop(1, '#2e7d32');
  ctx.fillStyle = iranGradient;
  ctx.fillRect(600, 0, 600, 630);

  // Divider
  ctx.fillStyle = '#000';
  ctx.fillRect(595, 0, 10, 630);

  // VS text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 10;
  ctx.fillText('VS', 600, 320);

  // US Side
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('USA', 300, 80);
  
  ctx.font = '24px Arial';
  ctx.fillText('$886 Billion', 300, 120);
  ctx.fillText('1.3M Troops', 300, 150);
  
  // US aircraft carrier silhouette
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.moveTo(200, 400);
  ctx.lineTo(400, 420);
  ctx.lineTo(420, 480);
  ctx.lineTo(380, 500);
  ctx.lineTo(180, 480);
  ctx.closePath();
  ctx.fill();

  // Iran Side
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Arial';
  ctx.fillText('IRAN', 900, 80);
  
  ctx.font = '24px Arial';
  ctx.fillText('$25 Billion', 900, 120);
  ctx.fillText('580K Troops', 900, 150);
  
  // Missile silhouettes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(800 + i * 40, 500);
    ctx.lineTo(820 + i * 40, 500);
    ctx.lineTo(810 + i * 40, 380);
    ctx.closePath();
    ctx.fill();
  }

  // Result text at bottom
  ctx.fillStyle = '#ff6b35';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('SPREADSHEET SAID USA WINS', 600, 580);
  ctx.fillStyle = '#fff';
  ctx.font = '28px Arial';
  ctx.fillText('REALITY IS MORE COMPLICATED', 600, 615);

  await saveCanvas(canvas, 'us-iran-military-updated.jpg');
}

// Main execution
async function main() {
  console.log('Generating blog images...\n');
  
  try {
    await generateF35Image();
    await generateStealthTechImage();
    await generateHormuzImage();
    await generateStrikesMappedImage();
    await generateWW3Image();
    await generateMilitaryUpdatedImage();
    
    console.log('\n✓ All images generated successfully!');
  } catch (err) {
    console.error('Error generating images:', err);
    process.exit(1);
  }
}

main();

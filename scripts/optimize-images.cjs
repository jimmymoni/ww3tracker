const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Users/Tomso/Downloads/New folder (2)';
const destDir = './public/images/blog';

// Create destination directory if not exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.png'));

const blogNames = [
  'why-america-iran.jpg',
  'us-iran-military.jpg', 
  'israel-iran-war.jpg',
  'iran-nuclear.jpg',
  'strait-hormuz.jpg',
  'what-happens-next.jpg'
];

async function processImages() {
  console.log(`Found ${files.length} images to process...\n`);
  
  for (let i = 0; i < Math.min(files.length, blogNames.length); i++) {
    const inputPath = path.join(sourceDir, files[i]);
    const outputPath = path.join(destDir, blogNames[i]);
    
    const originalSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(2);
    
    try {
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ 
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      const newSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      
      console.log(`✅ ${files[i]}`);
      console.log(`   Original: ${originalSize} MB`);
      console.log(`   Optimized: ${newSize} KB (${blogNames[i]})\n`);
      
    } catch (err) {
      console.error(`❌ Error processing ${files[i]}:`, err.message);
    }
  }
  
  console.log('✨ All images optimized!');
  console.log(`📁 Saved to: ${path.resolve(destDir)}`);
}

processImages();

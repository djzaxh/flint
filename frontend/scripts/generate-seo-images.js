const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

// Create directory if it doesn't exist
const seoImagesDir = path.join(__dirname, '../public/seo');
if (!fs.existsSync(seoImagesDir)) {
  fs.mkdirSync(seoImagesDir, { recursive: true });
}

async function generateOgImage(outputPath, title, subtitle) {
  // OpenGraph image dimensions (1200x630 is standard)
  const width = 1200;
  const height = 630;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(1, '#1e293b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Load and draw logo
  const logo = await loadImage(path.join(__dirname, '../public/logo.png'));
  const logoSize = 120;
  ctx.drawImage(logo, 100, 100, logoSize, logoSize);
  
  // Draw title
  ctx.font = 'bold 60px Sora, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(title, 100, 300);
  
  // Draw subtitle
  ctx.font = '30px Urbanist, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(subtitle, 100, 350);
  
  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  // Generate main site OG image
  await generateOgImage(
    path.join(seoImagesDir, 'og-image.jpg'),
    'GetStrong',
    'AI-Powered Nutrition Coach'
  );
  
  // Generate Twitter image (same as OG but with slightly different dimensions if needed)
  await generateOgImage(
    path.join(seoImagesDir, 'twitter-image.jpg'),
    'GetStrong',
    'AI-Powered Nutrition Coach'
  );
  
  // Generate blog OG image
  await generateOgImage(
    path.join(seoImagesDir, 'blog-og-image.jpg'),
    'GetStrong Blog',
    'Nutrition & Health Insights'
  );
  
  // Generate blog Twitter image
  await generateOgImage(
    path.join(seoImagesDir, 'blog-twitter-image.jpg'),
    'GetStrong Blog',
    'Nutrition & Health Insights'
  );
}

main().catch(console.error);

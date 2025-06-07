// scripts/convert-svg-to-png.js
// Install: npm install sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSVGtoPNG() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));
  
  console.log('🔄 Converting beautiful compass SVGs to PNG...');
  
  for (const svgFile of svgFiles) {
    const svgPath = path.join(iconsDir, svgFile);
    const pngPath = path.join(iconsDir, svgFile.replace('.svg', '.png'));
    
    try {
      await sharp(svgPath)
        .png({ quality: 100 })
        .toFile(pngPath);
      console.log(`✅ ${svgFile} → ${svgFile.replace('.svg', '.png')}`);
    } catch (error) {
      console.error(`❌ Error converting ${svgFile}:`, error);
    }
  }
  
  console.log('🎉 PNG conversion completed!');
  console.log('📱 Your beautiful compass icons are ready for all devices!');
}

if (require.main === module) {
  convertSVGtoPNG().catch(console.error);
}

module.exports = { convertSVGtoPNG };
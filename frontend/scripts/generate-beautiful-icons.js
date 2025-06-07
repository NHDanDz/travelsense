// scripts/generate-beautiful-icons.js
const fs = require('fs');
const path = require('path');

console.log('🎨 TravelSense Beautiful Compass Icon Generator\n');

// Logo design function - tạo SVG đẹp với compass rose
function createBeautifulIcon(size) {
  // Tính toán scale cho các elements
  const scale = size / 512;
  const center = size / 2;
  const radius = (size * 0.47);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bgGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#f093fb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
    </linearGradient>
    
    <!-- Compass ring gradient -->
    <linearGradient id="ringGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ff8c00;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6347;stop-opacity:1" />
    </linearGradient>
    
    <!-- Compass needle gradient -->
    <linearGradient id="needleNorth${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff4757;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c44569;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="needleSouth${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2f3542;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#57606f;stop-opacity:1" />
    </linearGradient>
    
    <!-- Star gradient -->
    <linearGradient id="starGradient${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffeaa7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fdcb6e;stop-opacity:1" />
    </linearGradient>
    
    <!-- Shadow filters -->
    <filter id="shadow${size}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="${4 * scale}" stdDeviation="${6 * scale}" flood-color="#000" flood-opacity="0.25"/>
    </filter>
    
    <filter id="innerShadow${size}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="${2 * scale}" stdDeviation="${3 * scale}" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    
    <!-- Glow effect -->
    <filter id="glow${size}" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${3 * scale}" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background circle with gradient -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="url(#bgGradient${size})" filter="url(#shadow${size})"/>
  
  <!-- Outer decorative ring -->
  <circle cx="${center}" cy="${center}" r="${radius * 0.92}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="${2 * scale}"/>
  
  <!-- Compass ring -->
  <circle cx="${center}" cy="${center}" r="${85 * scale}" fill="none" stroke="url(#ringGradient${size})" stroke-width="${6 * scale}" filter="url(#innerShadow${size})"/>
  <circle cx="${center}" cy="${center}" r="${85 * scale}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="${1 * scale}"/>
  
  <!-- Main compass rose (8-pointed star) -->
  <g filter="url(#glow${size})">
    <!-- Long points (N, E, S, W) -->
    <g fill="url(#starGradient${size})" stroke="rgba(255,255,255,0.4)" stroke-width="${1 * scale}">
      <!-- North point -->
      <path d="M ${center} ${center - 70 * scale} L ${center - 8 * scale} ${center - 25 * scale} L ${center} ${center - 35 * scale} L ${center + 8 * scale} ${center - 25 * scale} Z"/>
      <!-- East point -->
      <path d="M ${center + 70 * scale} ${center} L ${center + 25 * scale} ${center - 8 * scale} L ${center + 35 * scale} ${center} L ${center + 25 * scale} ${center + 8 * scale} Z"/>
      <!-- South point -->
      <path d="M ${center} ${center + 70 * scale} L ${center + 8 * scale} ${center + 25 * scale} L ${center} ${center + 35 * scale} L ${center - 8 * scale} ${center + 25 * scale} Z"/>
      <!-- West point -->
      <path d="M ${center - 70 * scale} ${center} L ${center - 25 * scale} ${center + 8 * scale} L ${center - 35 * scale} ${center} L ${center - 25 * scale} ${center - 8 * scale} Z"/>
    </g>
    
    <!-- Short points (NE, SE, SW, NW) -->
    <g fill="rgba(255,255,255,0.8)" stroke="rgba(255,255,255,0.6)" stroke-width="${0.5 * scale}">
      <!-- Northeast -->
      <path d="M ${center + 50 * scale} ${center - 50 * scale} L ${center + 20 * scale} ${center - 15 * scale} L ${center + 25 * scale} ${center - 25 * scale} L ${center + 15 * scale} ${center - 20 * scale} Z"/>
      <!-- Southeast -->
      <path d="M ${center + 50 * scale} ${center + 50 * scale} L ${center + 15 * scale} ${center + 20 * scale} L ${center + 25 * scale} ${center + 25 * scale} L ${center + 20 * scale} ${center + 15 * scale} Z"/>
      <!-- Southwest -->
      <path d="M ${center - 50 * scale} ${center + 50 * scale} L ${center - 20 * scale} ${center + 15 * scale} L ${center - 25 * scale} ${center + 25 * scale} L ${center - 15 * scale} ${center + 20 * scale} Z"/>
      <!-- Northwest -->
      <path d="M ${center - 50 * scale} ${center - 50 * scale} L ${center - 15 * scale} ${center - 20 * scale} L ${center - 25 * scale} ${center - 25 * scale} L ${center - 20 * scale} ${center - 15 * scale} Z"/>
    </g>
  </g>
  
  <!-- Compass needle -->
  <g filter="url(#innerShadow${size})">
    <!-- North needle (red) -->
    <path d="M ${center} ${center - 45 * scale} L ${center - 4 * scale} ${center + 5 * scale} L ${center} ${center} L ${center + 4 * scale} ${center + 5 * scale} Z" 
          fill="url(#needleNorth${size})" stroke="rgba(255,255,255,0.3)" stroke-width="${0.5 * scale}"/>
    
    <!-- South needle (dark) -->
    <path d="M ${center} ${center + 45 * scale} L ${center + 4 * scale} ${center - 5 * scale} L ${center} ${center} L ${center - 4 * scale} ${center - 5 * scale} Z" 
          fill="url(#needleSouth${size})" stroke="rgba(255,255,255,0.2)" stroke-width="${0.5 * scale}"/>
  </g>
  
  <!-- Center pivot -->
  <circle cx="${center}" cy="${center}" r="${8 * scale}" fill="url(#ringGradient${size})" stroke="rgba(255,255,255,0.5)" stroke-width="${1 * scale}" filter="url(#innerShadow${size})"/>
  <circle cx="${center}" cy="${center}" r="${4 * scale}" fill="rgba(255,255,255,0.9)"/>
  
  <!-- Cardinal direction markers (for larger sizes) -->
  ${size >= 128 ? `
  <g fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" font-size="${16 * scale}">
    <text x="${center}" y="${center - 95 * scale}" text-anchor="middle">N</text>
    <text x="${center + 95 * scale}" y="${center + 6 * scale}" text-anchor="middle">E</text>
    <text x="${center}" y="${center + 105 * scale}" text-anchor="middle">S</text>
    <text x="${center - 95 * scale}" y="${center + 6 * scale}" text-anchor="middle">W</text>
  </g>` : ''}
  
  <!-- Decorative dots around the compass -->
  ${size >= 192 ? `
  <g fill="rgba(255,255,255,0.6)">
    ${Array.from({length: 12}, (_, i) => {
      const angle = (i * 30) * Math.PI / 180;
      const dotRadius = 110 * scale;
      const x = center + Math.cos(angle - Math.PI/2) * dotRadius;
      const y = center + Math.sin(angle - Math.PI/2) * dotRadius;
      const size = i % 3 === 0 ? 2 * scale : 1 * scale;
      return `<circle cx="${x}" cy="${y}" r="${size}"/>`;
    }).join('')}
  </g>` : ''}
  
  <!-- Brand indicator (for larger sizes) -->
  ${size >= 256 ? `
  <g fill="rgba(255,255,255,0.8)" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" font-size="${20 * scale}">
    <text x="${center}" y="${center + 160 * scale}">TS</text>
  </g>` : ''}
</svg>`;
}

// Maskable icon với compass theme
function createMaskableIcon(size) {
  const center = size / 2;
  const scale = size / 512;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="maskableBg${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="maskableCompass${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Safe area background -->
  <rect width="${size}" height="${size}" fill="url(#maskableBg${size})"/>
  
  <!-- Content in safe area -->
  <g transform="translate(${size * 0.1}, ${size * 0.1}) scale(0.8)">
    <!-- Simplified compass rose -->
    <circle cx="${center}" cy="${center}" r="${60 * scale}" fill="none" stroke="url(#maskableCompass${size})" stroke-width="${4 * scale}"/>
    
    <!-- Main star points -->
    <g fill="url(#maskableCompass${size})">
      <path d="M ${center} ${center - 50 * scale} L ${center - 6 * scale} ${center - 20 * scale} L ${center} ${center - 25 * scale} L ${center + 6 * scale} ${center - 20 * scale} Z"/>
      <path d="M ${center + 50 * scale} ${center} L ${center + 20 * scale} ${center - 6 * scale} L ${center + 25 * scale} ${center} L ${center + 20 * scale} ${center + 6 * scale} Z"/>
      <path d="M ${center} ${center + 50 * scale} L ${center + 6 * scale} ${center + 20 * scale} L ${center} ${center + 25 * scale} L ${center - 6 * scale} ${center + 20 * scale} Z"/>
      <path d="M ${center - 50 * scale} ${center} L ${center - 20 * scale} ${center + 6 * scale} L ${center - 25 * scale} ${center} L ${center - 20 * scale} ${center - 6 * scale} Z"/>
    </g>
    
    <!-- Center -->
    <circle cx="${center}" cy="${center}" r="${6 * scale}" fill="white"/>
    <circle cx="${center}" cy="${center}" r="${3 * scale}" fill="#ff4757"/>
  </g>
</svg>`;
}

// Favicon với compass đơn giản
function createFavicon(size) {
  const center = size / 2;
  const scale = size / 32;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconBg${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#faviconBg${size})"/>
  
  <!-- Simple compass for favicon -->
  <circle cx="${center}" cy="${center}" r="${10 * scale}" fill="none" stroke="white" stroke-width="${1.5 * scale}"/>
  
  <!-- Simple star -->
  <g fill="white">
    <path d="M ${center} ${center - 8 * scale} L ${center - 2 * scale} ${center - 2 * scale} L ${center} ${center - 4 * scale} L ${center + 2 * scale} ${center - 2 * scale} Z"/>
    <path d="M ${center + 8 * scale} ${center} L ${center + 2 * scale} ${center - 2 * scale} L ${center + 4 * scale} ${center} L ${center + 2 * scale} ${center + 2 * scale} Z"/>
    <path d="M ${center} ${center + 8 * scale} L ${center + 2 * scale} ${center + 2 * scale} L ${center} ${center + 4 * scale} L ${center - 2 * scale} ${center + 2 * scale} Z"/>
    <path d="M ${center - 8 * scale} ${center} L ${center - 2 * scale} ${center + 2 * scale} L ${center - 4 * scale} ${center} L ${center - 2 * scale} ${center - 2 * scale} Z"/>
  </g>
  
  <circle cx="${center}" cy="${center}" r="${2 * scale}" fill="#ff4757"/>
</svg>`;
}

// Apple touch icon với compass
function createAppleTouchIcon(size) {
  const center = size / 2;
  const scale = size / 180;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="appleBg${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="appleCompass${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
    </linearGradient>
    
    <filter id="appleShadow${size}">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- iOS rounded rectangle -->
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#appleBg${size})" filter="url(#appleShadow${size})"/>
  
  <!-- Content -->
  <g transform="translate(${size * 0.15}, ${size * 0.15}) scale(0.7)">
    <!-- Compass ring -->
    <circle cx="${center}" cy="${center}" r="${50 * scale}" fill="none" stroke="url(#appleCompass${size})" stroke-width="${3 * scale}"/>
    
    <!-- Compass star -->
    <g fill="url(#appleCompass${size})">
      <path d="M ${center} ${center - 40 * scale} L ${center - 5 * scale} ${center - 15 * scale} L ${center} ${center - 20 * scale} L ${center + 5 * scale} ${center - 15 * scale} Z"/>
      <path d="M ${center + 40 * scale} ${center} L ${center + 15 * scale} ${center - 5 * scale} L ${center + 20 * scale} ${center} L ${center + 15 * scale} ${center + 5 * scale} Z"/>
      <path d="M ${center} ${center + 40 * scale} L ${center + 5 * scale} ${center + 15 * scale} L ${center} ${center + 20 * scale} L ${center - 5 * scale} ${center + 15 * scale} Z"/>
      <path d="M ${center - 40 * scale} ${center} L ${center - 15 * scale} ${center + 5 * scale} L ${center - 20 * scale} ${center} L ${center - 15 * scale} ${center - 5 * scale} Z"/>
    </g>
    
    <!-- Center dot -->
    <circle cx="${center}" cy="${center}" r="${8 * scale}" fill="white"/>
    <circle cx="${center}" cy="${center}" r="${5 * scale}" fill="#ff4757"/>
    
    <!-- Direction letters -->
    <g fill="white" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle" font-size="${12 * scale}">
      <text x="${center}" y="${center - 60 * scale}">N</text>
    </g>
  </g>
</svg>`;
}

async function generateAllIcons() {
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  
  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Định nghĩa các kích thước cần thiết
  const iconSizes = [
    // PWA standard sizes
    { size: 72, type: 'standard' },
    { size: 96, type: 'standard' },
    { size: 128, type: 'standard' },
    { size: 144, type: 'maskable' },
    { size: 152, type: 'apple' },
    { size: 192, type: 'maskable' },
    { size: 384, type: 'maskable' },
    { size: 512, type: 'maskable' },
    
    // Favicon sizes
    { size: 16, type: 'favicon' },
    { size: 32, type: 'favicon' },
    { size: 48, type: 'favicon' },
    
    // Apple specific
    { size: 180, type: 'apple' },
    { size: 167, type: 'apple' }, // iPad Pro
  ];

  console.log('🧭 Tạo beautiful compass icons...\n');

  for (const { size, type } of iconSizes) {
    let svgContent;
    let filename;

    switch (type) {
      case 'maskable':
        svgContent = createMaskableIcon(size);
        filename = `icon-${size}x${size}.svg`;
        break;
      case 'apple':
        svgContent = createAppleTouchIcon(size);
        filename = size === 180 ? 'apple-touch-icon.svg' : `apple-touch-icon-${size}x${size}.svg`;
        break;
      case 'favicon':
        svgContent = createFavicon(size);
        filename = size === 32 ? 'favicon.svg' : `favicon-${size}x${size}.svg`;
        break;
      default:
        svgContent = createBeautifulIcon(size);
        filename = `icon-${size}x${size}.svg`;
    }

    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, svgContent);
    console.log(`✅ Tạo ${filename} (${size}x${size}) - Beautiful Compass`);
  }

  // Tạo shortcuts icons với travel theme
  console.log('\n🔗 Tạo travel-themed shortcut icons...');
  
  const shortcutIcons = [
    { name: 'map-shortcut.svg', icon: '🗺️', color: '#10b981', title: 'Maps' },
    { name: 'trip-shortcut.svg', icon: '✈️', color: '#f59e0b', title: 'Trips' },
    { name: 'favorites-shortcut.svg', icon: '❤️', color: '#ef4444', title: 'Favorites' }
  ];

  shortcutIcons.forEach(({ name, icon, color, title }) => {
    const shortcutSvg = `<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shortcut${name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}dd;stop-opacity:1" />
    </linearGradient>
    <filter id="shortcutShadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  <rect width="96" height="96" rx="20" fill="url(#shortcut${name})" filter="url(#shortcutShadow)"/>
  <text x="48" y="60" text-anchor="middle" font-size="48">${icon}</text>
</svg>`;
    
    fs.writeFileSync(path.join(iconsDir, name), shortcutSvg);
    console.log(`✅ Tạo ${name} - ${title}`);
  });

  // Copy main favicon
  const mainFavicon = createFavicon(32);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), mainFavicon);
  console.log('✅ Tạo favicon.svg chính - Compass Design');

  console.log('\n🎉 Hoàn thành Beautiful Compass Icons!');
  console.log(`📁 ${iconSizes.length} PWA compass icons`);
  console.log(`📁 ${shortcutIcons.length} travel shortcut icons`);
  console.log(`📁 1 main compass favicon`);
  
  console.log('\n💡 Features của compass design:');
  console.log('🧭 8-pointed compass rose với gradient đẹp');
  console.log('⭐ Detailed design cho size lớn, simplified cho size nhỏ');
  console.log('🌈 Modern gradient colors (purple-pink-gold)');
  console.log('✨ Glow effects và shadows');
  console.log('📍 Cardinal directions (N, E, S, W)');
  console.log('🎯 Responsive scaling cho mọi kích thước');
  
  console.log('\n🚀 Next steps:');
  console.log('1. npm run build');
  console.log('2. Test PWA installation');
  console.log('3. Check Chrome DevTools > Application > Manifest');
  console.log('4. Optional: node scripts/convert-svg-to-png.js');
}

// Convert to PNG script
function generatePNGConverterScript() {
  const convertScript = `// scripts/convert-svg-to-png.js
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
      console.log(\`✅ \${svgFile} → \${svgFile.replace('.svg', '.png')}\`);
    } catch (error) {
      console.error(\`❌ Error converting \${svgFile}:\`, error);
    }
  }
  
  console.log('🎉 PNG conversion completed!');
  console.log('📱 Your beautiful compass icons are ready for all devices!');
}

if (require.main === module) {
  convertSVGtoPNG().catch(console.error);
}

module.exports = { convertSVGtoPNG };`;

  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(scriptsDir, 'convert-svg-to-png.js'),
    convertScript
  );
  console.log('✅ Tạo PNG converter script');
}

// Chạy script
if (require.main === module) {
  generateAllIcons()
    .then(() => {
      generatePNGConverterScript();
      console.log('\n🧭✨ Beautiful Compass Icons Generated Successfully!');
      console.log('Your TravelSense app now has stunning compass-themed icons! 🎨');
    })
    .catch(console.error);
}

module.exports = { 
  generateAllIcons, 
  createBeautifulIcon, 
  createMaskableIcon, 
  createFavicon, 
  createAppleTouchIcon 
};
// scripts/setup-pwa.js
const fs = require('fs');
const path = require('path');

console.log('🚀 TravelSense PWA Setup Script\n');

async function setupPWA() {
  console.log('📁 Tạo các thư mục cần thiết...');
  
  // Tạo thư mục public/icons nếu chưa có
  const iconsDir = path.join(process.cwd(), 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
    console.log('✅ Đã tạo thư mục public/icons');
  }

  // Tạo thư mục components nếu chưa có
  const componentsDir = path.join(process.cwd(), 'app', 'components');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
    console.log('✅ Đã tạo thư mục app/components');
  }

  console.log('\n📝 Tạo các file PWA...');

  // 1. Tạo manifest.json
  const manifest = {
    "name": "TravelSense - Khám phá địa điểm tuyệt vời",
    "short_name": "TravelSense",
    "description": "Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "vi",
    "categories": ["travel", "navigation", "lifestyle"],
    "icons": [
      {
        "src": "/icons/icon-72x72.png",
        "sizes": "72x72",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-96x96.png",
        "sizes": "96x96",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-144x144.png",
        "sizes": "144x144",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-152x152.png",
        "sizes": "152x152",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-384x384.png",
        "sizes": "384x384",
        "type": "image/png",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable any"
      }
    ],
    "shortcuts": [
      {
        "name": "Khám phá bản đồ",
        "short_name": "Bản đồ",
        "description": "Xem bản đồ và tìm kiếm địa điểm",
        "url": "/dashboard/Map",
        "icons": [
          {
            "src": "/icons/map-shortcut.png",
            "sizes": "96x96"
          }
        ]
      },
      {
        "name": "Lập lịch trình",
        "short_name": "Lịch trình", 
        "description": "Tạo và quản lý lịch trình du lịch",
        "url": "/trip-planner",
        "icons": [
          {
            "src": "/icons/trip-shortcut.png",
            "sizes": "96x96"
          }
        ]
      }
    ]
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ Đã tạo manifest.json');

  // 2. Tạo browserconfig.xml
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/icons/icon-144x144.png"/>
      <square310x310logo src="/icons/icon-384x384.png"/>
      <TileColor>#3b82f6</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'browserconfig.xml'),
    browserConfig
  );
  console.log('✅ Đã tạo browserconfig.xml');

  // 3. Tạo robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://507c-113-185-48-241.ngrok-free.app/sitemap.xml`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'robots.txt'),
    robotsTxt
  );
  console.log('✅ Đã tạo robots.txt');

  console.log('\n🎨 Tạo icons placeholder...');
  
  // Tạo SVG icons đơn giản
  const createSVGIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <path d="M${size * 0.25} ${size * 0.3} L${size * 0.75} ${size * 0.3} L${size * 0.6} ${size * 0.7} L${size * 0.4} ${size * 0.7} Z" fill="white"/>
  <circle cx="${size * 0.5}" cy="${size * 0.4}" r="${size * 0.08}" fill="white"/>
</svg>`;

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  sizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    fs.writeFileSync(
      path.join(iconsDir, `icon-${size}x${size}.svg`),
      svgContent
    );
  });

  // Tạo favicon
  const faviconSVG = createSVGIcon(32);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), faviconSVG);
  
  console.log('✅ Đã tạo placeholder icons');

  console.log('\n⚙️ Cấu hình next.config.ts...');
  
  // Đọc next.config.ts hiện tại
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
  let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
  
  // Thêm headers cho PWA nếu chưa có
  if (!nextConfig.includes('X-Content-Type-Options')) {
    const headersConfig = `
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },`;

    nextConfig = nextConfig.replace(
      'const nextConfig: NextConfig = {',
      `const nextConfig: NextConfig = {${headersConfig}`
    );
    
    fs.writeFileSync(nextConfigPath, nextConfig);
    console.log('✅ Đã cập nhật next.config.ts');
  }

  console.log('\n📱 Cách test PWA:');
  console.log('1. Chạy: npm run build && npm run start');
  console.log('2. Mở Chrome DevTools > Application > Manifest');
  console.log('3. Kiểm tra Service Workers tab');
  console.log('4. Test trên mobile bằng ngrok URL');
  console.log('5. Thử cài đặt app từ Chrome menu');

  console.log('\n🌐 Để deploy lên production:');
  console.log('1. Cập nhật NEXT_PUBLIC_APP_URL trong .env');
  console.log('2. Thay đổi start_url trong manifest.json');
  console.log('3. Tạo icons PNG thật từ SVG (dùng sharp hoặc online tools)');
  console.log('4. Test PWA score trên Lighthouse');

  console.log('\n✅ PWA setup hoàn thành!');
  console.log('📝 Nhớ:');
  console.log('- Thay thế SVG icons bằng PNG icons thật');
  console.log('- Test trên HTTPS (ngrok URL ok)');
  console.log('- Kiểm tra manifest.json và service worker');
  console.log('- Test offline functionality');
}

// Export function để có thể import từ nơi khác
module.exports = { setupPWA };

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  setupPWA().catch(console.error);
}
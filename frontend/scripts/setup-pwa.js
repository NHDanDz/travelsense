// scripts/setup-pwa.js
const fs = require('fs');
const path = require('path');

console.log('🚀 TravelSense PWA Setup Script with Beautiful Compass Icons\n');

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

  // Tạo thư mục scripts nếu chưa có
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
    console.log('✅ Đã tạo thư mục scripts');
  }

  console.log('\n📝 Tạo các file PWA...');

  // 1. Tạo manifest.json với compass theme
  const manifest = {
    "name": "TravelSense - Khám phá địa điểm tuyệt vời",
    "short_name": "TravelSense",
    "description": "Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn với compass định hướng.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#667eea",
    "theme_color": "#764ba2",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "vi",
    "categories": ["travel", "navigation", "lifestyle"],
    "icons": [
      {
        "src": "/icons/icon-72x72.svg",
        "sizes": "72x72",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/icons/icon-96x96.svg",
        "sizes": "96x96",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/icons/icon-128x128.svg",
        "sizes": "128x128",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/icons/icon-144x144.svg",
        "sizes": "144x144",
        "type": "image/svg+xml",
        "purpose": "maskable"
      },
      {
        "src": "/icons/apple-touch-icon.svg",
        "sizes": "152x152",
        "type": "image/svg+xml",
        "purpose": "any"
      },
      {
        "src": "/icons/icon-192x192.svg",
        "sizes": "192x192",
        "type": "image/svg+xml",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-384x384.svg",
        "sizes": "384x384",
        "type": "image/svg+xml",
        "purpose": "maskable any"
      },
      {
        "src": "/icons/icon-512x512.svg",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "maskable any"
      }
    ],
    "shortcuts": [
      {
        "name": "Khám phá bản đồ",
        "short_name": "Bản đồ",
        "description": "Xem bản đồ compass và tìm kiếm địa điểm",
        "url": "/dashboard/Map",
        "icons": [
          {
            "src": "/icons/map-shortcut.svg",
            "sizes": "96x96",
            "type": "image/svg+xml"
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
            "src": "/icons/trip-shortcut.svg",
            "sizes": "96x96",
            "type": "image/svg+xml"
          }
        ]
      },
      {
        "name": "Yêu thích",
        "short_name": "Favorites",
        "description": "Quản lý địa điểm yêu thích",
        "url": "/favorites",
        "icons": [
          {
            "src": "/icons/favorites-shortcut.svg",
            "sizes": "96x96", 
            "type": "image/svg+xml"
          }
        ]
      }
    ],
    "screenshots": [
      {
        "src": "/icons/screenshot-mobile.jpg",
        "sizes": "390x844",
        "type": "image/jpeg",
        "form_factor": "narrow",
        "label": "TravelSense mobile app with compass navigation"
      },
      {
        "src": "/icons/screenshot-desktop.jpg", 
        "sizes": "1920x1080",
        "type": "image/jpeg",
        "form_factor": "wide",
        "label": "TravelSense desktop app with detailed compass"
      }
    ]
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ Đã tạo manifest.json với compass theme');

  // 2. Tạo browserconfig.xml với compass colors
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/icon-72x72.svg"/>
      <square150x150logo src="/icons/icon-144x144.svg"/>
      <square310x310logo src="/icons/icon-384x384.svg"/>
      <wide310x150logo src="/icons/icon-384x384.svg"/>
      <TileColor>#764ba2</TileColor>
    </tile>
    <notification>
      <polling-uri src="/api/notifications/polling"/>
      <frequency>30</frequency>
      <cycle>1</cycle>
    </notification>
  </msapplication>
</browserconfig>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'browserconfig.xml'),
    browserConfig
  );
  console.log('✅ Đã tạo browserconfig.xml');

  // 3. Tạo robots.txt với dynamic ngrok URL
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

# Sitemap sẽ tự động update với domain hiện tại
Sitemap: /sitemap.xml

# PWA specific
Allow: /manifest.json
Allow: /sw.js
Allow: /icons/`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'robots.txt'),
    robotsTxt
  );
  console.log('✅ Đã tạo robots.txt');

  // 4. Tạo sitemap.xml cơ bản
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>/dashboard</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>/dashboard/Map</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>/trip-planner</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sitemap.xml'),
    sitemap
  );
  console.log('✅ Đã tạo sitemap.xml');

  console.log('\n🎨 Chạy Beautiful Compass Icons Generator...');
  
  // Gọi function từ generate-beautiful-icons.js
  try {
    const { generateAllIcons } = require('./generate-beautiful-icons.js');
    await generateAllIcons();
    console.log('✅ Đã tạo beautiful compass icons');
  } catch (error) {
    console.log('⚠️  Không tìm thấy generate-beautiful-icons.js, tạo basic icons...');
    
    // Fallback: tạo basic compass icon
    const createBasicCompass = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="compassGrad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.45}" fill="url(#compassGrad${size})"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.3}" fill="none" stroke="white" stroke-width="${size*0.02}"/>
  <path d="M ${size/2} ${size*0.2} L ${size*0.45} ${size*0.4} L ${size/2} ${size*0.35} L ${size*0.55} ${size*0.4} Z" fill="white"/>
  <path d="M ${size*0.8} ${size/2} L ${size*0.6} ${size*0.45} L ${size*0.65} ${size/2} L ${size*0.6} ${size*0.55} Z" fill="white"/>
  <path d="M ${size/2} ${size*0.8} L ${size*0.55} ${size*0.6} L ${size/2} ${size*0.65} L ${size*0.45} ${size*0.6} Z" fill="white"/>
  <path d="M ${size*0.2} ${size/2} L ${size*0.4} ${size*0.55} L ${size*0.35} ${size/2} L ${size*0.4} ${size*0.45} Z" fill="white"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.05}" fill="#ff4757"/>
</svg>`;

    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    sizes.forEach(size => {
      const svgContent = createBasicCompass(size);
      fs.writeFileSync(
        path.join(iconsDir, `icon-${size}x${size}.svg`),
        svgContent
      );
    });
    
    // Tạo favicon
    const faviconSVG = createBasicCompass(32);
    fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), faviconSVG);
    
    console.log('✅ Đã tạo basic compass icons');
  }

  console.log('\n⚙️ Cập nhật next.config.ts...');
  
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
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
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
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/icons/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
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
    console.log('✅ Đã cập nhật next.config.ts với PWA headers');
  }

  // 5. Kiểm tra và tích hợp với PWA components có sẵn
  const checkExistingComponents = () => {
    const existingComponents = [
      'PWAInstallButton.tsx',
      'PWANotifications.tsx', 
      'iOSPWAHelper.tsx'
    ];
    
    const foundComponents = existingComponents.filter(component => 
      fs.existsSync(path.join(componentsDir, component))
    );
    
    if (foundComponents.length > 0) {
      console.log('✅ Đã phát hiện PWA components có sẵn:');
      foundComponents.forEach(component => {
        console.log(`   - ${component}`);
      });
      return true;
    }
    return false;
  };

  const hasExistingComponents = checkExistingComponents();

  // 6. Tạo service worker cơ bản
  const serviceWorker = `// public/sw.js
const CACHE_NAME = 'travelsense-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sw.js'),
    serviceWorker
  );
  console.log('✅ Đã tạo service worker');
}

// Export function để có thể import từ nơi khác
module.exports = { setupPWA };

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  setupPWA().catch(console.error);
}
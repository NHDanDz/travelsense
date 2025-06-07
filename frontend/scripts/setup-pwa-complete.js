// scripts/setup-pwa-complete.js
// Script setup PWA hoàn chỉnh với Beautiful Compass Icons
const fs = require('fs');
const path = require('path');
const { generateAllIcons } = require('./generate-beautiful-icons');

console.log('🧭 TravelSense PWA Complete Setup\n');

async function setupPWAComplete() {
  try {
    // 1. Generate beautiful compass icons
    console.log('🎨 BƯỚC 1: Tạo Beautiful Compass Icons...');
    await generateAllIcons();
    console.log('✅ Icons đã được tạo!\n');

    // 2. Create manifest.json
    console.log('📋 BƯỚC 2: Tạo PWA Manifest...');
    createManifest();
    console.log('✅ Manifest.json đã được tạo!\n');

    // 3. Create service worker
    console.log('⚙️ BƯỚC 3: Tạo Service Worker...');
    createServiceWorker();
    console.log('✅ Service Worker đã được tạo!\n');

    // 4. Create browserconfig.xml
    console.log('🖥️ BƯỚC 4: Tạo Browser Config...');
    createBrowserConfig();
    console.log('✅ BrowserConfig.xml đã được tạo!\n');

    // 5. Create splash screens
    console.log('📱 BƯỚC 5: Tạo Splash Screens...');
    createSplashScreens();
    console.log('✅ Splash screens đã được tạo!\n');

    // 6. Update package.json scripts
    console.log('📦 BƯỚC 6: Cập nhật Package.json Scripts...');
    updatePackageScripts();
    console.log('✅ Scripts đã được cập nhật!\n');

    // 7. Create PWA test page
    console.log('🧪 BƯỚC 7: Tạo PWA Test Page...');
    createPWATestPage();
    console.log('✅ Test page đã được tạo!\n');

    // 8. Generate install instructions
    console.log('📖 BƯỚC 8: Tạo Installation Guide...');
    createInstallGuide();
    console.log('✅ Install guide đã được tạo!\n');

    // 9. Final verification
    console.log('✅ BƯỚC 9: Verification...');
    verifyPWASetup();

    console.log('\n🎉 PWA SETUP HOÀN THÀNH!');
    console.log('\n🚀 Next steps:');
    console.log('1. pnpm run build');
    console.log('2. npm start');
    console.log('3. Mở Chrome DevTools > Application > Manifest');
    console.log('4. Test install PWA');
    console.log('5. Test offline functionality');
    console.log('\n🧭 Enjoy your beautiful TravelSense PWA! ✨');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

function createManifest() {
  const manifest = {
    name: "TravelSense - Khám phá địa điểm tuyệt vời",
    short_name: "TravelSense",
    description: "Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn.",
    start_url: "/",
    display: "standalone",
    background_color: "#667eea",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    scope: "/",
    lang: "vi",
    categories: ["travel", "lifestyle", "navigation"],
    screenshots: [
      {
        src: "/images/screenshot-mobile.jpg",
        type: "image/jpeg",
        sizes: "390x844",
        form_factor: "narrow"
      },
      {
        src: "/images/screenshot-desktop.jpg", 
        type: "image/jpeg",
        sizes: "1280x720",
        form_factor: "wide"
      }
    ],
    icons: [
      {
        src: "/icons/icon-72x72.svg",
        sizes: "72x72",
        type: "image/svg+xml",
        density: "1.5"
      },
      {
        src: "/icons/icon-96x96.svg",
        sizes: "96x96",
        type: "image/svg+xml",
        density: "2.0"
      },
      {
        src: "/icons/icon-128x128.svg",
        sizes: "128x128",
        type: "image/svg+xml",
        density: "2.5"
      },
      {
        src: "/icons/icon-144x144.svg",
        sizes: "144x144",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable any"
      },
      {
        src: "/icons/icon-384x384.svg",
        sizes: "384x384",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable any"
      }
    ],
    shortcuts: [
      {
        name: "Xem bản đồ",
        short_name: "Bản đồ",
        description: "Khám phá địa điểm trên bản đồ",
        url: "/dashboard/Map",
        icons: [
          {
            src: "/icons/map-shortcut.svg",
            sizes: "96x96",
            type: "image/svg+xml"
          }
        ]
      },
      {
        name: "Lập lịch trình",
        short_name: "Lịch trình", 
        description: "Tạo lịch trình du lịch",
        url: "/trip-planner",
        icons: [
          {
            src: "/icons/trip-shortcut.svg",
            sizes: "96x96",
            type: "image/svg+xml"
          }
        ]
      },
      {
        name: "Yêu thích",
        short_name: "Yêu thích",
        description: "Xem địa điểm yêu thích",
        url: "/dashboard/Map?tab=favorites",
        icons: [
          {
            src: "/icons/favorites-shortcut.svg",
            sizes: "96x96", 
            type: "image/svg+xml"
          }
        ]
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    },
    launch_handler: {
      client_mode: "navigate-existing"
    },
    handle_links: "preferred",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    protocol_handlers: [
      {
        protocol: "web+travelsense",
        url: "/share?url=%s"
      }
    ]
  };

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

function createServiceWorker() {
  const swContent = `// sw.js - TravelSense Service Worker với Beautiful Compass Icons
const CACHE_NAME = 'travelsense-v1.0.0';
const STATIC_CACHE = 'travelsense-static-v1.0.0';
const DYNAMIC_CACHE = 'travelsense-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  
  // Beautiful compass icons
  '/icons/favicon.svg',
  '/icons/apple-touch-icon.svg',
  '/icons/icon-192x192.svg',
  '/icons/icon-512x512.svg',
  '/icons/map-shortcut.svg',
  '/icons/trip-shortcut.svg',
  '/icons/favorites-shortcut.svg',
  
  // Core app pages
  '/dashboard/Map',
  '/trip-planner',
  
  // Static assets
  '/images/hero-1.jpg',
  '/images/place-hanoi.jpg',
  '/images/place-hoian.webp',
  '/images/place-halong.jpg',
  
  // Fonts
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🧭 TravelSense SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Cache failed:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🧭 TravelSense SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ SW activated');
        self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
          });
      })
  );
});

console.log('🧭 TravelSense Service Worker loaded!');`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'sw.js'),
    swContent
  );
}

function createBrowserConfig() {
  const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/icons/icon-72x72.svg"/>
      <square150x150logo src="/icons/icon-144x144.svg"/>
      <square310x310logo src="/icons/icon-384x384.svg"/>
      <TileColor>#3b82f6</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'browserconfig.xml'),
    browserConfig
  );
}

function createSplashScreens() {
  const splashDir = path.join(process.cwd(), 'public', 'images', 'splash');
  if (!fs.existsSync(splashDir)) {
    fs.mkdirSync(splashDir, { recursive: true });
  }

  // Create simple splash screen SVG template
  const createSplashSVG = (width, height) => `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="splashBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#splashBg)"/>
      
      <!-- Compass icon -->
      <g transform="translate(${width/2 - 50}, ${height/2 - 50})">
        <circle cx="50" cy="50" r="40" fill="none" stroke="white" stroke-width="3"/>
        <path d="M 50 20 L 45 40 L 50 35 L 55 40 Z" fill="white"/>
        <path d="M 80 50 L 60 45 L 65 50 L 60 55 Z" fill="white"/>
        <path d="M 50 80 L 55 60 L 50 65 L 45 60 Z" fill="white"/>
        <path d="M 20 50 L 40 55 L 35 50 L 40 45 Z" fill="white"/>
        <circle cx="50" cy="50" r="5" fill="#ff4757"/>
      </g>
      
      <!-- App name -->
      <text x="${width/2}" y="${height/2 + 80}" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">TravelSense</text>
    </svg>
  `;

  // Generate splash screens for common iOS devices
  const splashSizes = [
    { name: 'iPhone_14_Pro_Max_portrait.png', width: 430, height: 932 },
    { name: 'iPhone_14_Pro_portrait.png', width: 393, height: 852 },
    { name: 'iPhone_14_portrait.png', width: 390, height: 844 },
    { name: 'iPhone_13_mini_portrait.png', width: 375, height: 812 },
    { name: 'iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png', width: 414, height: 896 },
    { name: 'iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png', width: 414, height: 736 },
    { name: 'iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png', width: 375, height: 667 },
    { name: '4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png', width: 320, height: 568 },
    { name: '11__iPad_Pro__10.5__iPad_Pro_portrait.png', width: 834, height: 1194 },
    { name: '12.9__iPad_Pro_portrait.png', width: 1024, height: 1366 }
  ];

  splashSizes.forEach(({ name, width, height }) => {
    const svgContent = createSplashSVG(width, height);
    fs.writeFileSync(path.join(splashDir, name.replace('.png', '.svg')), svgContent);
    console.log(`📱 Created splash: ${name}`);
  });
}

function updatePackageScripts() {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    'pwa:build': 'pnpm run build && npm run pwa:test',
    'pwa:test': 'node scripts/test-pwa.js',
    'pwa:icons': 'node scripts/generate-beautiful-icons.js',
    'pwa:setup': 'node scripts/setup-pwa-complete.js',
    'pwa:serve': 'pnpm run build && npx serve out -p 3000',
    'pwa:analyze': 'npx pwa-asset-generator --help'
  };

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

function createPWATestPage() {
  const testPageContent = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Test - TravelSense</title>
    <link rel="manifest" href="/manifest.json">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test-item { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .pass { background: #d4edda; }
        .fail { background: #f8d7da; }
        .pending { background: #fff3cd; }
    </style>
</head>
<body>
    <h1>🧭 TravelSense PWA Test</h1>
    
    <div id="tests">
        <div class="test-item pending" id="manifest-test">
            📋 Manifest: Đang kiểm tra...
        </div>
        <div class="test-item pending" id="sw-test">
            ⚙️ Service Worker: Đang kiểm tra...
        </div>
        <div class="test-item pending" id="icons-test">
            🎨 Icons: Đang kiểm tra...
        </div>
        <div class="test-item pending" id="install-test">
            📱 Install Prompt: Đang kiểm tra...
        </div>
        <div class="test-item pending" id="offline-test">
            📡 Offline: Đang kiểm tra...
        </div>
    </div>

    <button onclick="runTests()">🔄 Chạy lại test</button>
    <button onclick="window.installPWA && window.installPWA()">📲 Cài đặt PWA</button>

    <script>
        async function runTests() {
            // Test manifest
            try {
                const response = await fetch('/manifest.json');
                const manifest = await response.json();
                updateTest('manifest-test', manifest.name ? 'pass' : 'fail', 
                    manifest.name ? '✅ Manifest OK' : '❌ Manifest không hợp lệ');
            } catch (e) {
                updateTest('manifest-test', 'fail', '❌ Không tìm thấy manifest');
            }

            // Test service worker
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    updateTest('sw-test', 'pass', '✅ Service Worker đã đăng ký');
                } catch (e) {
                    updateTest('sw-test', 'fail', '❌ Service Worker lỗi: ' + e.message);
                }
            } else {
                updateTest('sw-test', 'fail', '❌ Browser không hỗ trợ Service Worker');
            }

            // Test icons
            const iconExists = await fetch('/icons/icon-192x192.svg').then(r => r.ok);
            updateTest('icons-test', iconExists ? 'pass' : 'fail', 
                iconExists ? '✅ Icons có sẵn' : '❌ Icons không tìm thấy');

            // Test install prompt
            window.addEventListener('beforeinstallprompt', (e) => {
                updateTest('install-test', 'pass', '✅ Install prompt có sẵn');
            });

            // Test offline (simplified)
            if ('serviceWorker' in navigator && 'caches' in window) {
                updateTest('offline-test', 'pass', '✅ Offline support có sẵn');
            } else {
                updateTest('offline-test', 'fail', '❌ Offline không được hỗ trợ');
            }
        }

        function updateTest(id, status, message) {
            const element = document.getElementById(id);
            element.className = 'test-item ' + status;
            element.textContent = message;
        }

        // Auto run tests
        runTests();
    </script>
</body>
</html>`;

  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'pwa-test.html'),
    testPageContent
  );
}

function createInstallGuide() {
  const installGuide = `# 🧭 TravelSense PWA Installation Guide

## Tính năng PWA

### ✨ Tính năng chính
- 🧭 Beautiful compass icons với gradient đẹp
- ⚡ Khởi động nhanh từ màn hình chính
- 📡 Hoạt động offline
- 🔄 Tự động cập nhật
- 📱 Trải nghiệm như app native
- 🎯 Shortcuts cho các tính năng chính

### 🎨 Icon Design
- 8-pointed compass rose design
- Modern gradient colors (purple-pink-gold)
- Responsive scaling cho mọi device
- Glow effects và shadows
- Cardinal directions (N, E, S, W)

## Cài đặt

### 📱 Mobile (Android)
1. Mở Chrome/Edge
2. Vào https://your-domain.com
3. Nhấn menu ⋮ → "Thêm vào màn hình chính"
4. Hoặc nhấn banner install xuất hiện

### 🍎 Mobile (iOS)
1. Mở Safari
2. Vào https://your-domain.com  
3. Nhấn Share 📤 → "Thêm vào màn hình chính"
4. Icon compass sẽ xuất hiện trên home screen

### 💻 Desktop
1. Mở Chrome/Edge
2. Vào https://your-domain.com
3. Nhấn ⊕ trong address bar
4. Hoặc nhấn nút "Cài đặt ứng dụng"

## Testing

### 🧪 PWA Test
- Vào \`/pwa-test.html\` để kiểm tra PWA setup
- Kiểm tra Manifest, Service Worker, Icons, Install prompt

### 🛠️ Chrome DevTools
1. F12 → Application tab
2. Kiểm tra Manifest
3. Kiểm tra Service Workers
4. Test Install prompt
5. Test Offline functionality

### 📊 Lighthouse Audit
1. F12 → Lighthouse tab
2. Chọn "Progressive Web App"
3. Run audit
4. Target score: 90+

## Development

### 🔧 Scripts
\`\`\`bash
npm run pwa:setup     # Setup PWA hoàn chỉnh
npm run pwa:icons     # Tạo lại icons
npm run pwa:build     # Build và test PWA
npm run pwa:test      # Test PWA functionality
npm run pwa:serve     # Serve built app
\`\`\`

### 📁 File Structure
\`\`\`
public/
├── manifest.json         # PWA manifest
├── sw.js                # Service worker
├── browserconfig.xml    # Windows tiles
├── pwa-test.html       # PWA test page
├── icons/              # Beautiful compass icons
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   ├── icon-*.svg
│   └── *-shortcut.svg
└── images/
    └── splash/         # iOS splash screens
\`\`\`

### 🎯 Shortcuts
- 🗺️ Bản đồ → /dashboard/Map
- ✈️ Lịch trình → /trip-planner  
- ❤️ Yêu thích → /dashboard/Map?tab=favorites

## Troubleshooting

### ❌ Install button không hiện
- Kiểm tra manifest.json có hợp lệ
- Kiểm tra HTTPS (required cho PWA)
- Kiểm tra Service Worker đã register

### ❌ Icons không đúng
- Chạy \`npm run pwa:icons\` để tạo lại
- Kiểm tra paths trong manifest.json
- Clear cache và hard refresh

### ❌ Offline không hoạt động
- Kiểm tra Service Worker console logs
- Kiểm tra Cache trong DevTools
- Thử disconnect network và reload

## 🚀 Deployment

### Vercel
\`\`\`bash
vercel --prod
\`\`\`

### Netlify
\`\`\`bash
pnpm run build
# Upload \`out\` folder to Netlify
\`\`\`

### Manual
\`\`\`bash
pnpm run build
# Serve \`out\` folder với HTTPS
\`\`\`

---

🧭 Happy traveling với TravelSense PWA! ✨
`;

  fs.writeFileSync(
    path.join(process.cwd(), 'PWA-INSTALL-GUIDE.md'),
    installGuide
  );
}

function verifyPWASetup() {
  const requiredFiles = [
    'public/manifest.json',
    'public/sw.js',
    'public/browserconfig.xml',
    'public/pwa-test.html',
    'public/icons/favicon.svg',
    'public/icons/apple-touch-icon.svg',
    'public/icons/icon-192x192.svg',
    'public/icons/icon-512x512.svg',
    'PWA-INSTALL-GUIDE.md'
  ];

  console.log('📋 Kiểm tra files...');
  
  let allPresent = true;
  requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allPresent = false;
  });

  if (allPresent) {
    console.log('✅ Tất cả files PWA đã sẵn sàng!');
  } else {
    console.log('⚠️ Một số files bị thiếu!');
  }

  // Check manifest.json content
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/manifest.json'), 'utf8'));
    console.log('✅ Manifest.json hợp lệ');
    console.log(`   📱 Name: ${manifest.name}`);
    console.log(`   🎨 Icons: ${manifest.icons.length} icons`);
    console.log(`   🔗 Shortcuts: ${manifest.shortcuts.length} shortcuts`);
  } catch (error) {
    console.log('❌ Manifest.json không hợp lệ:', error.message);
  }
}

// Run setup
if (require.main === module) {
  setupPWAComplete();
}

module.exports = { setupPWAComplete };
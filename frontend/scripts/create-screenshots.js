// scripts/create-screenshots.js - Tạo screenshots cho PWA
const fs = require('fs');
const path = require('path');

console.log('📸 Tạo Screenshots cho TravelSense PWA...\n');

// Tạo mobile screenshot
function createMobileScreenshot(width = 390, height = 844) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mobileBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.2"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#mobileBg)"/>
  
  <!-- Status bar -->
  <rect width="${width}" height="44" fill="rgba(0,0,0,0.3)"/>
  <text x="20" y="30" fill="white" font-size="16" font-weight="bold">9:41</text>
  <text x="${width-60}" y="30" fill="white" font-size="14">100%</text>
  
  <!-- Header -->
  <rect y="44" width="${width}" height="80" fill="rgba(255,255,255,0.95)" filter="url(#shadow)"/>
  
  <!-- TravelSense Logo -->
  <g transform="translate(20, 64)">
    <!-- Compass icon -->
    <circle cx="20" cy="20" r="18" fill="#667eea"/>
    <circle cx="20" cy="20" r="12" fill="none" stroke="white" stroke-width="1.5"/>
    <path d="M 20 14 L 18 23 L 20 21 L 22 23 Z" fill="white"/>
    <path d="M 26 20 L 17 18 L 19 20 L 17 22 Z" fill="white"/>
    <path d="M 20 26 L 22 17 L 20 19 L 18 17 Z" fill="white"/>
    <path d="M 14 20 L 23 22 L 21 20 L 23 18 Z" fill="white"/>
    <circle cx="20" cy="20" r="2" fill="#ff4757"/>
    
    <text x="50" y="26" fill="#1f2937" font-size="24" font-weight="bold">TravelSense</text>
  </g>
  
  <!-- Search bar -->
  <rect x="20" y="140" width="${width-40}" height="50" rx="25" fill="white" filter="url(#shadow)"/>
  <text x="40" y="170" fill="#6b7280" font-size="16">🔍 Tìm kiếm địa điểm...</text>
  
  <!-- Featured section -->
  <text x="20" y="230" fill="white" font-size="22" font-weight="bold">Địa điểm nổi bật</text>
  
  <!-- Place cards -->
  <g transform="translate(20, 250)">
    <!-- Card 1 -->
    <rect width="${(width-60)/2}" height="160" rx="12" fill="white" filter="url(#shadow)"/>
    <rect width="${(width-60)/2}" height="100" rx="12" fill="#10b981"/>
    <text x="10" y="125" fill="#1f2937" font-size="14" font-weight="bold">Hồ Hoàn Kiếm</text>
    <text x="10" y="145" fill="#6b7280" font-size="12">⭐ 4.8 • Hà Nội</text>
    
    <!-- Card 2 -->
    <g transform="translate(${(width-60)/2 + 20}, 0)">
      <rect width="${(width-60)/2}" height="160" rx="12" fill="white" filter="url(#shadow)"/>
      <rect width="${(width-60)/2}" height="100" rx="12" fill="#f59e0b"/>
      <text x="10" y="125" fill="#1f2937" font-size="14" font-weight="bold">Vịnh Hạ Long</text>
      <text x="10" y="145" fill="#6b7280" font-size="12">⭐ 4.9 • Quảng Ninh</text>
    </g>
  </g>
  
  <!-- Map preview -->
  <rect x="20" y="440" width="${width-40}" height="200" rx="12" fill="white" filter="url(#shadow)"/>
  <rect x="20" y="440" width="${width-40}" height="200" rx="12" fill="#3b82f6" opacity="0.1"/>
  <text x="${width/2}" y="550" text-anchor="middle" fill="#3b82f6" font-size="18" font-weight="bold">🗺️ Xem trên bản đồ</text>
  
  <!-- Bottom navigation -->
  <rect y="${height-80}" width="${width}" height="80" fill="white" filter="url(#shadow)"/>
  
  <!-- Nav items -->
  <g fill="#6b7280" font-size="10" text-anchor="middle">
    <g transform="translate(${width/4}, ${height-60})">
      <circle cx="0" cy="-10" r="12" fill="#667eea"/>
      <text y="0" fill="white">🧭</text>
      <text y="15" fill="#667eea" font-weight="bold">Khám phá</text>
    </g>
    
    <g transform="translate(${width/2}, ${height-60})">
      <circle cx="0" cy="-10" r="12" fill="#e5e7eb"/>
      <text y="0">🗺️</text>
      <text y="15">Bản đồ</text>
    </g>
    
    <g transform="translate(${3*width/4}, ${height-60})">
      <circle cx="0" cy="-10" r="12" fill="#e5e7eb"/>
      <text y="0">✈️</text>
      <text y="15">Lịch trình</text>
    </g>
  </g>
  
  <!-- PWA indicator -->
  <rect x="${width-80}" y="60" width="60" height="20" rx="10" fill="rgba(16, 185, 129, 0.2)"/>
  <text x="${width-50}" y="74" text-anchor="middle" fill="#10b981" font-size="10" font-weight="bold">PWA</text>
</svg>`;
}

// Tạo desktop screenshot
function createDesktopScreenshot(width = 1280, height = 720) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="desktopBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="headerBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
    
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#desktopBg)"/>
  
  <!-- Header -->
  <rect width="${width}" height="80" fill="url(#headerBg)"/>
  
  <!-- Logo and nav -->
  <g transform="translate(40, 20)">
    <!-- Logo -->
    <circle cx="20" cy="20" r="18" fill="white" opacity="0.2"/>
    <circle cx="20" cy="20" r="12" fill="none" stroke="white" stroke-width="1.5"/>
    <path d="M 20 14 L 18 23 L 20 21 L 22 23 Z" fill="white"/>
    <circle cx="20" cy="20" r="2" fill="#ff4757"/>
    
    <text x="50" y="28" fill="white" font-size="24" font-weight="bold">TravelSense</text>
    
    <!-- Navigation -->
    <g transform="translate(300, 0)" fill="white" font-size="16">
      <text x="0" y="28" font-weight="bold">Khám phá</text>
      <text x="100" y="28" opacity="0.8">Bản đồ</text>
      <text x="180" y="28" opacity="0.8">Lịch trình</text>
      <text x="280" y="28" opacity="0.8">Yêu thích</text>
    </g>
    
    <!-- User menu -->
    <g transform="translate(${width-200}, 0)">
      <rect x="0" y="10" width="120" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
      <text x="60" y="24" text-anchor="middle" fill="white" font-size="12">👤 Đăng nhập</text>
    </g>
  </g>
  
  <!-- Main content -->
  <g transform="translate(0, 80)">
    <!-- Sidebar -->
    <rect width="320" height="${height-80}" fill="white" filter="url(#cardShadow)"/>
    
    <!-- Search in sidebar -->
    <rect x="20" y="20" width="280" height="50" rx="8" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="40" y="50" fill="#6b7280" font-size="14">🔍 Tìm kiếm địa điểm...</text>
    
    <!-- Categories -->
    <text x="20" y="100" fill="#1f2937" font-size="18" font-weight="bold">Danh mục</text>
    
    <g transform="translate(20, 120)" fill="#6b7280" font-size="14">
      <g>
        <rect width="60" height="60" rx="8" fill="#fef3c7"/>
        <text x="30" y="40" text-anchor="middle" font-size="24">🍽️</text>
        <text x="30" y="80" text-anchor="middle" fill="#1f2937" font-size="12">Nhà hàng</text>
      </g>
      
      <g transform="translate(80, 0)">
        <rect width="60" height="60" rx="8" fill="#dbeafe"/>
        <text x="30" y="40" text-anchor="middle" font-size="24">🏨</text>
        <text x="30" y="80" text-anchor="middle" fill="#1f2937" font-size="12">Khách sạn</text>
      </g>
      
      <g transform="translate(160, 0)">
        <rect width="60" height="60" rx="8" fill="#dcfce7"/>
        <text x="30" y="40" text-anchor="middle" font-size="24">🎭</text>
        <text x="30" y="80" text-anchor="middle" fill="#1f2937" font-size="12">Du lịch</text>
      </g>
    </g>
    
    <!-- Featured places list -->
    <text x="20" y="220" fill="#1f2937" font-size="18" font-weight="bold">Địa điểm nổi bật</text>
    
    <g transform="translate(20, 240)">
      <!-- Place 1 -->
      <rect width="280" height="80" rx="8" fill="#f8fafc"/>
      <circle cx="40" cy="40" r="25" fill="#10b981"/>
      <text x="40" y="46" text-anchor="middle" fill="white" font-size="20">🏞️</text>
      <text x="80" y="30" fill="#1f2937" font-size="16" font-weight="bold">Hồ Hoàn Kiếm</text>
      <text x="80" y="50" fill="#6b7280" font-size="14">⭐ 4.8 • Hà Nội • 2.1km</text>
      
      <!-- Place 2 -->
      <g transform="translate(0, 90)">
        <rect width="280" height="80" rx="8" fill="#f8fafc"/>
        <circle cx="40" cy="40" r="25" fill="#f59e0b"/>
        <text x="40" y="46" text-anchor="middle" fill="white" font-size="20">🌊</text>
        <text x="80" y="30" fill="#1f2937" font-size="16" font-weight="bold">Vịnh Hạ Long</text>
        <text x="80" y="50" fill="#6b7280" font-size="14">⭐ 4.9 • Quảng Ninh • 150km</text>
      </g>
    </g>
  </g>
  
  <!-- Map area -->
  <rect x="320" y="80" width="${width-320}" height="${height-80}" fill="#3b82f6" opacity="0.1" filter="url(#cardShadow)"/>
  
  <!-- Map content -->
  <g transform="translate(${width/2}, ${height/2})">
    <text text-anchor="middle" fill="#3b82f6" font-size="48" y="-20">🗺️</text>
    <text text-anchor="middle" fill="#1f2937" font-size="24" font-weight="bold" y="20">Bản đồ tương tác</text>
    <text text-anchor="middle" fill="#6b7280" font-size="16" y="45">Khám phá hàng ngàn địa điểm thú vị</text>
  </g>
  
  <!-- Map pins -->
  <g fill="#ef4444">
    <circle cx="600" cy="200" r="8"/>
    <circle cx="800" cy="300" r="8"/>
    <circle cx="700" cy="400" r="8"/>
    <circle cx="900" cy="250" r="8"/>
  </g>
  
  <!-- Desktop PWA indicator -->
  <rect x="${width-120}" y="100" width="100" height="30" rx="15" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981"/>
  <text x="${width-70}" y="120" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Installed PWA</text>
</svg>`;
}

async function generateScreenshots() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Tạo mobile screenshot
  const mobileScreenshot = createMobileScreenshot(390, 844);
  fs.writeFileSync(
    path.join(imagesDir, 'screenshot-mobile.svg'),
    mobileScreenshot
  );
  console.log('✅ Tạo screenshot-mobile.svg (390x844) - Beautiful mobile view');

  // Tạo desktop screenshot
  const desktopScreenshot = createDesktopScreenshot(1280, 720);
  fs.writeFileSync(
    path.join(imagesDir, 'screenshot-desktop.svg'),
    desktopScreenshot
  );
  console.log('✅ Tạo screenshot-desktop.svg (1280x720) - Beautiful desktop view');

  console.log('\n🎉 Screenshots tạo thành công!');
  console.log('📱 Mobile: Hiển thị giao diện điện thoại với compass theme');
  console.log('💻 Desktop: Hiển thị giao diện máy tính với sidebar và map');
  
  console.log('\n💡 Lưu ý:');
  console.log('- Screenshots này sẽ hiển thị trong PWA install prompt');
  console.log('- Giúp users hiểu được giao diện app trước khi cài');
  console.log('- Tăng conversion rate cho PWA installation');
  
  console.log('\n🔄 Optional: Convert sang JPG:');
  console.log('- Dùng tool online: https://svgtojpg.com/');
  console.log('- Hoặc Photoshop/GIMP để export');
  console.log('- Hoặc npm install sharp và viết script convert');
}

// Chạy script
if (require.main === module) {
  generateScreenshots().catch(console.error);
}

module.exports = { generateScreenshots, createMobileScreenshot, createDesktopScreenshot };
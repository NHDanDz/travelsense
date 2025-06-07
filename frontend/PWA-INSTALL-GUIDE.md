# 🧭 TravelSense PWA Installation Guide

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
- Vào `/pwa-test.html` để kiểm tra PWA setup
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
```bash
npm run pwa:setup     # Setup PWA hoàn chỉnh
npm run pwa:icons     # Tạo lại icons
npm run pwa:build     # Build và test PWA
npm run pwa:test      # Test PWA functionality
npm run pwa:serve     # Serve built app
```

### 📁 File Structure
```
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
```

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
- Chạy `npm run pwa:icons` để tạo lại
- Kiểm tra paths trong manifest.json
- Clear cache và hard refresh

### ❌ Offline không hoạt động
- Kiểm tra Service Worker console logs
- Kiểm tra Cache trong DevTools
- Thử disconnect network và reload

## 🚀 Deployment

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
pnpm run build
# Upload `out` folder to Netlify
```

### Manual
```bash
pnpm run build
# Serve `out` folder với HTTPS
```

---

🧭 Happy traveling với TravelSense PWA! ✨

# 🧭 TravelSense PWA

Beautiful compass-themed Progressive Web App cho TravelSense.

## ✨ Tính năng PWA

- 🧭 Beautiful compass icons với gradient design
- ⚡ Khởi động nhanh từ màn hình chính  
- 📡 Hoạt động offline
- 🔄 Tự động cập nhật
- 📱 Trải nghiệm như native app
- 🎯 Shortcuts cho các tính năng chính

## 🚀 Cài đặt

### Cho Users
1. Truy cập website
2. Nhấn nút "Cài đặt ứng dụng" 
3. Hoặc nhấn ⊕ trong address bar (Chrome)
4. Trên iOS: Share → "Thêm vào màn hình chính"

### Cho Developers  
```bash
npm run pwa:setup   # Setup PWA hoàn chỉnh
npm run pwa:test    # Test PWA functionality  
npm run pwa:build   # Build và test
```

## 📁 Files Structure

```
public/
├── manifest.json           # PWA manifest
├── sw.js                  # Service worker
├── browserconfig.xml      # Windows tiles
├── icons/                 # Beautiful compass icons
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   ├── icon-*.svg         # Various sizes
│   └── *-shortcut.svg     # App shortcuts
└── images/
    └── splash/            # iOS splash screens
```

## 🛠️ Development

### Test PWA locally
```bash
npm run build
npm start
# Mở Chrome DevTools > Application > Manifest
```

### Test offline
1. Mở DevTools > Network
2. Check "Offline" 
3. Refresh page - vẫn hoạt động!

## 🎨 Icons Design

Beautiful compass rose design với:
- 8-pointed star compass
- Modern gradient colors (purple-pink-gold)
- Responsive scaling
- Glow effects và shadows
- Cardinal directions

## 📱 Browser Support

- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS)
- ✅ Firefox (Desktop)
- ✅ Samsung Internet

## 🔧 Troubleshooting

### Install button không hiện
- Kiểm tra HTTPS (required)
- Kiểm tra manifest.json hợp lệ
- Hard refresh (Ctrl+Shift+R)

### Icons không đúng
- Chạy `npm run pwa:setup` lại
- Clear cache
- Kiểm tra paths trong manifest

---

🧭 Happy traveling với TravelSense PWA! ✨

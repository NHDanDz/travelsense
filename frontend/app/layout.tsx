// app/layout.tsx - Enhanced with Beautiful Compass Icons & Complete PWA Support
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TravelSense - Khám phá địa điểm tuyệt vời',
    template: '%s | TravelSense'
  },
  description: 'Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn. PWA với beautiful compass icons.',
  manifest: '/manifest.json',
  keywords: [
    'du lịch', 'travel', 'khám phá', 'địa điểm', 'bản đồ', 'lịch trình', 
    'vietnam', 'pwa', 'progressive web app', 'offline', 'compass', 'navigation'
  ],
  authors: [{ name: 'TravelSense Team', url: 'https://travelsense.app' }],
  creator: 'TravelSense',
  publisher: 'TravelSense',
  applicationName: 'TravelSense',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://travelsense.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'vi-VN': '/vi',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'TravelSense - Khám phá địa điểm tuyệt vời',
    description: 'Nền tảng du lịch thông minh với PWA và beautiful compass icons. Hoạt động offline, khởi động nhanh.',
    siteName: 'TravelSense',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TravelSense - Progressive Web App du lịch thông minh',
      },
      {
        url: '/icons/icon-512x512.svg',
        width: 512,
        height: 512,
        alt: 'TravelSense Compass Icon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TravelSense - Khám phá địa điểm tuyệt vời',
    description: 'Progressive Web App du lịch với beautiful compass icons. Hoạt động offline!',
    images: ['/images/og-image.jpg'],
    creator: '@travelsense',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/icons/favicon-48x48.svg', sizes: '48x48', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/favicon.svg',
    apple: [
      { url: '/icons/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
      { url: '/icons/apple-touch-icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/icons/apple-touch-icon-167x167.svg', sizes: '167x167', type: 'image/svg+xml' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/favicon.svg',
        color: '#3b82f6',
      },
    ],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: 'travel',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#667eea' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* PWA Essential Meta Tags */}
        <meta name="application-name" content="TravelSense" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TravelSense" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Enhanced Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Beautiful Compass Icons - All Sizes */}
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/favicon-16x16.svg" sizes="16x16" type="image/svg+xml" />
        <link rel="icon" href="/icons/favicon-48x48.svg" sizes="48x48" type="image/svg+xml" />
        
        {/* Apple Touch Icons - Beautiful Compass Design */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.svg" />
        
        {/* PWA Manifest & Shortcuts */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/icons/icon-192x192.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Comprehensive iOS Splash Screens */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* iPhone 14 Pro Max */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_14_Pro_Max_portrait.svg" />
        
        {/* iPhone 14 Pro */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_14_Pro_portrait.svg" />
        
        {/* iPhone 14 */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_14_portrait.svg" />
        
        {/* iPhone 13 mini */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_13_mini_portrait.svg" />
        
        {/* iPhone 11 Pro Max / XS Max */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.svg" />
        
        {/* iPhone 8 Plus / 7 Plus / 6s Plus / 6 Plus */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
          href="/images/splash/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.svg" />
        
        {/* iPhone 8 / 7 / 6s / 6 / SE */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
          href="/images/splash/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.svg" />
        
        {/* iPhone SE / 5s / 5c / 5 */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
          href="/images/splash/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.svg" />
        
        {/* iPad Pro 11" */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
          href="/images/splash/11__iPad_Pro__10.5__iPad_Pro_portrait.svg" />
        
        {/* iPad Pro 12.9" */}
        <link rel="apple-touch-startup-image" 
          media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
          href="/images/splash/12.9__iPad_Pro_portrait.svg" />

        {/* Optimized Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Enhanced Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // TravelSense PWA Enhanced Service Worker
              (function() {
                'use strict';
                
                if ('serviceWorker' in navigator) {
                  let refreshing = false;
                  
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', {
                      scope: '/',
                      updateViaCache: 'imports'
                    })
                    .then(function(registration) {
                      console.log('🧭 TravelSense SW registered successfully');
                      console.log('Scope:', registration.scope);
                      
                      // Listen for waiting SW
                      registration.addEventListener('updatefound', () => {
                        const installingWorker = registration.installing;
                        if (installingWorker) {
                          installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'installed') {
                              if (navigator.serviceWorker.controller) {
                                console.log('🔄 New content available');
                                window.dispatchEvent(new CustomEvent('swUpdate', {
                                  detail: { registration }
                                }));
                              } else {
                                console.log('✅ Content cached for offline use');
                                window.dispatchEvent(new CustomEvent('swCached'));
                              }
                            }
                          });
                        }
                      });
                      
                      // Check for updates every 30 minutes
                      setInterval(() => {
                        registration.update();
                      }, 30 * 60 * 1000);
                    })
                    .catch(function(registrationError) {
                      console.error('❌ SW registration failed:', registrationError);
                    });
                  });

                  // Auto-reload when new SW takes control
                  navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (refreshing) return;
                    refreshing = true;
                    console.log('🔄 Reloading for SW update...');
                    window.location.reload();
                  });
                }
                
                // Performance monitoring
                if ('performance' in window) {
                  window.addEventListener('load', () => {
                    setTimeout(() => {
                      const perfData = performance.getEntriesByType('navigation')[0];
                      console.log('🚀 TravelSense Load Time:', Math.round(perfData.loadEventEnd), 'ms');
                    }, 0);
                  });
                }
              })();
            `,
          }}
        />

        {/* Advanced PWA Install Prompt Handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // TravelSense PWA Install Manager
              (function() {
                'use strict';
                
                let deferredPrompt;
                let installSource = 'unknown';
                
                // Track install prompt availability
                window.addEventListener('beforeinstallprompt', (e) => {
                  console.log('🧭 PWA install prompt available');
                  e.preventDefault();
                  deferredPrompt = e;
                  installSource = 'browser';
                  
                  // Dispatch custom event for components
                  window.dispatchEvent(new CustomEvent('pwaInstallAvailable', {
                    detail: { prompt: e }
                  }));
                  
                  // Show install buttons
                  document.querySelectorAll('[data-pwa-install]').forEach(button => {
                    button.style.display = 'flex';
                    button.removeAttribute('disabled');
                    button.setAttribute('aria-label', 'Cài đặt TravelSense như ứng dụng');
                  });
                });

                // Global install function
                window.installTravelSensePWA = async function() {
                  if (!deferredPrompt) {
                    console.log('⚠️ No install prompt available');
                    
                    // Show platform-specific instructions
                    if (isIOSSafari()) {
                      window.dispatchEvent(new CustomEvent('showIOSInstallInstructions'));
                    } else {
                      window.dispatchEvent(new CustomEvent('showManualInstallInstructions'));
                    }
                    return false;
                  }
                  
                  try {
                    // Show the install prompt
                    deferredPrompt.prompt();
                    
                    // Wait for user choice
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    console.log('User choice:', outcome);
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'pwa_install_prompt', {
                        'pwa_install_source': installSource,
                        'pwa_install_result': outcome
                      });
                    }
                    
                    if (outcome === 'accepted') {
                      console.log('✅ User accepted PWA install');
                      window.dispatchEvent(new CustomEvent('pwaInstallAccepted'));
                    } else {
                      console.log('❌ User dismissed PWA install');
                      window.dispatchEvent(new CustomEvent('pwaInstallDismissed'));
                    }
                    
                    // Clear the prompt
                    deferredPrompt = null;
                    return outcome === 'accepted';
                    
                  } catch (error) {
                    console.error('PWA install error:', error);
                    return false;
                  }
                };

                // Handle successful installation
                window.addEventListener('appinstalled', (evt) => {
                  console.log('🎉 TravelSense PWA installed successfully!');
                  
                  // Hide install prompts
                  document.querySelectorAll('[data-pwa-install]').forEach(button => {
                    button.style.display = 'none';
                  });
                  
                  // Analytics
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'pwa_installed_success', {
                      'pwa_install_source': installSource
                    });
                  }
                  
                  // Dispatch success event
                  window.dispatchEvent(new CustomEvent('pwaInstalledSuccess'));
                  
                  // Clear prompt
                  deferredPrompt = null;
                });

                // Platform detection
                function isIOSSafari() {
                  const userAgent = window.navigator.userAgent.toLowerCase();
                  const safari = /safari/.test(userAgent);
                  const ios = /iphone|ipod|ipad/.test(userAgent);
                  return ios && safari && !window.MSStream;
                }
                
                function isStandalone() {
                  return window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');
                }

                // Check PWA status on load
                window.addEventListener('load', () => {
                  if (isStandalone()) {
                    console.log('✅ Running as PWA');
                    document.documentElement.classList.add('pwa-mode');
                    
                    // Hide install buttons for PWA mode
                    document.querySelectorAll('[data-pwa-install]').forEach(button => {
                      button.style.display = 'none';
                    });
                    
                    // Analytics
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'pwa_launched');
                    }
                  }
                  
                  if (isIOSSafari()) {
                    document.documentElement.classList.add('ios-safari');
                    installSource = 'ios-safari';
                  }
                });
                
                // Export for global access
                window.TravelSensePWA = {
                  install: window.installTravelSensePWA,
                  isInstalled: isStandalone,
                  isIOSSafari: isIOSSafari,
                  canInstall: () => !!deferredPrompt
                };
              })();
            `,
          }}
        />

        {/* PWA Status Indicator & Update Notification Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* PWA Mode Styles */
            .pwa-mode {
              --pwa-safe-area-top: env(safe-area-inset-top);
              --pwa-safe-area-bottom: env(safe-area-inset-bottom);
              --pwa-safe-area-left: env(safe-area-inset-left);
              --pwa-safe-area-right: env(safe-area-inset-right);
            }
            
            .pwa-mode [data-pwa-install] {
              display: none !important;
            }
            
            @media (display-mode: standalone) {
              body {
                margin: 0;
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
                overflow-x: hidden;
              }
              
              .safe-area-top {
                padding-top: env(safe-area-inset-top);
              }
              
              .safe-area-bottom {
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
            
            /* iOS Safari Install Instructions */
            .ios-safari .ios-install-prompt {
              display: block;
            }
            
            .ios-install-prompt {
              display: none;
            }
            
          
            /* PWA Install Animation */
            .pwa-install-button {
              position: relative;
              overflow: hidden;
            }
            
            .pwa-install-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
              transition: left 0.5s;
            }
            
            .pwa-install-button:hover::before {
              left: 100%;
            }
            
            /* Compass Loading Animation */
            .compass-spin {
              animation: compass-rotate 2s linear infinite;
            }
            
            @keyframes compass-rotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            /* Performance optimizations */
            .pwa-mode img[loading="lazy"] {
              content-visibility: auto;
            }
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        {/* PWA Content */}
        <div className="pwa-app-container">
          {children}
        </div>
 

        {/* iOS Install Instructions Modal */}
        <div id="ios-install-modal" className="fixed inset-0 bg-black/50 flex items-end z-50 ios-install-prompt" style={{ display: 'none' }}>
          <div className="bg-white w-full p-6 rounded-t-2xl transform transition-transform">
            <div className="text-center">
              {/* Beautiful compass icon */}
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-10 h-10 text-white">
                  <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M 16 8 L 14 14 L 16 12 L 18 14 Z" fill="currentColor"/>
                  <path d="M 24 16 L 18 14 L 20 16 L 18 18 Z" fill="currentColor"/>
                  <path d="M 16 24 L 18 18 L 16 20 L 14 18 Z" fill="currentColor"/>
                  <path d="M 8 16 L 14 18 L 12 16 L 14 14 Z" fill="currentColor"/>
                  <circle cx="16" cy="16" r="2" fill="#ff4757"/>
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cài đặt TravelSense</h3>
              <p className="text-gray-600 mb-6">Thêm vào màn hình chính để truy cập nhanh như ứng dụng thật</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-blue-700 mb-3">
                  <span className="text-sm font-medium">Hướng dẫn cài đặt:</span>
                </div>
                <div className="space-y-2 text-sm text-blue-600">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                    <span>Nhấn nút Chia sẻ 
                      <svg className="inline w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                    <span>Chọn "Thêm vào Màn hình chính"</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                    <span>Nhấn "Thêm" để hoàn tất</span>
                  </div>
                </div>
              </div>
              
              <button 
                id="ios-install-close" 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>

        {/* PWA Success Installation Toast */}
        <div id="pwa-success-toast" className="fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform" style={{ display: 'none' }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <div className="font-bold">Cài đặt thành công! 🎉</div>
              <div className="text-green-100 text-sm">TravelSense đã sẵn sàng sử dụng</div>
            </div>
          </div>
        </div>

        {/* Manual Install Instructions for Other Browsers */}
        <div id="manual-install-modal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ display: 'none' }}>
          <div className="bg-white max-w-md w-full mx-4 p-6 rounded-xl shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Cài đặt TravelSense</h3>
              <p className="text-gray-600 mb-4">Tạo shortcut để truy cập nhanh</p>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="text-left">
                  <div className="font-medium text-gray-800 mb-1">Chrome/Edge:</div>
                  <div>Menu ⋮ → "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính"</div>
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-800 mb-1">Firefox:</div>
                  <div>Menu ☰ → "Cài đặt trang web này"</div>
                </div>
              </div>
              
              <button 
                id="manual-install-close"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>

        {/* Advanced PWA Event Handlers */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              'use strict';
              
              // Update notification handler
              window.addEventListener('swUpdate', (event) => {
                const updateBtn = document.getElementById('pwa-update-btn');
                const dismissBtn = document.getElementById('pwa-update-dismiss');
                 
              
              // iOS install instructions
              window.addEventListener('showIOSInstallInstructions', () => {
                const modal = document.getElementById('ios-install-modal');
                const closeBtn = document.getElementById('ios-install-close');
                
                if (modal) {
                  modal.style.display = 'flex';
                  closeBtn?.addEventListener('click', () => {
                    modal.style.display = 'none';
                  });
                }
              });
              
              // Manual install instructions
              window.addEventListener('showManualInstallInstructions', () => {
                const modal = document.getElementById('manual-install-modal');
                const closeBtn = document.getElementById('manual-install-close');
                
                if (modal) {
                  modal.style.display = 'flex';
                  closeBtn?.addEventListener('click', () => {
                    modal.style.display = 'none';
                  });
                }
              });
              
              // Success toast
              window.addEventListener('pwaInstalledSuccess', () => {
                const toast = document.getElementById('pwa-success-toast');
                if (toast) {
                  toast.style.display = 'block';
                  setTimeout(() => {
                    toast.style.transform = 'translateX(0)';
                  }, 100);
                  
                  setTimeout(() => {
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                      toast.style.display = 'none';
                    }, 300);
                  }, 5000);
                }
              });
              
              // Network status monitoring
              function updateNetworkStatus() {
                const isOnline = navigator.onLine;
                document.documentElement.classList.toggle('offline', !isOnline);
                
                if (!isOnline) {
                  console.log('📡 Gone offline - PWA cache active');
                } else {
                  console.log('📡 Back online');
                }
              }
              
              window.addEventListener('online', updateNetworkStatus);
              window.addEventListener('offline', updateNetworkStatus);
              updateNetworkStatus();
              
              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', () => {
                  // Measure app load time
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = Math.round(perfData.loadEventEnd);
                    console.log(\`🚀 TravelSense loaded in \${loadTime}ms\`);
                    
                    // Track performance for analytics
                    if (typeof gtag !== 'undefined') {
                      gtag('event', 'page_load_time', {
                        value: loadTime,
                        custom_parameter: 'pwa_performance'
                      });
                    }
                  }, 0);
                });
              }
              
              // PWA lifecycle logging
              window.addEventListener('beforeunload', () => {
                console.log('👋 TravelSense PWA closing');
              });
              
              // Expose PWA utilities globally
              window.TravelSensePWA = {
                ...window.TravelSensePWA,
                showUpdateNotification: () => window.dispatchEvent(new CustomEvent('swUpdate')),
                showInstallInstructions: () => window.dispatchEvent(new CustomEvent('showIOSInstallInstructions')),
                checkNetworkStatus: () => navigator.onLine,
                version: '1.0.0'
              };
              
              console.log('🧭 TravelSense PWA Enhanced Layout Ready!');
            })();
          `
        }} />
      </body>
    </html>
  );
}
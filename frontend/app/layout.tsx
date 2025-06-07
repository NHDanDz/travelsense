// app/layout.tsx - Enhanced với PWA detection
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravelSense - Khám phá địa điểm tuyệt vời',
  description: 'Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn.',
  manifest: '/manifest.json',
  keywords: ['du lịch', 'khám phá', 'địa điểm', 'bản đồ', 'lịch trình', 'vietnam', 'travel'],
  authors: [{ name: 'TravelSense Team' }],
  creator: 'TravelSense',
  publisher: 'TravelSense',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://507c-113-185-48-241.ngrok-free.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'TravelSense - Khám phá địa điểm tuyệt vời',
    description: 'Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn.',
    siteName: 'TravelSense',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TravelSense - Khám phá địa điểm tuyệt vời',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TravelSense - Khám phá địa điểm tuyệt vời',
    description: 'Nền tảng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời xung quanh bạn.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" dir="ltr">
      <head>
        {/* Critical PWA Meta Tags */}
        <meta name="application-name" content="TravelSense" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="TravelSense" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* iOS specific meta tags */}
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />
        
        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Splash screens for iOS - Critical ones only */}
        <link
          rel="apple-touch-startup-image"
          href="/images/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple-splash-1242-2208.jpg"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/apple-splash-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />

        {/* Service Worker Registration - Improved */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    const registration = await navigator.serviceWorker.register('/sw.js', {
                      scope: '/'
                    });
                    console.log('SW registered successfully:', registration.scope);
                    
                    // Listen for updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('Có phiên bản mới! Bạn có muốn cập nhật không?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      }
                    });
                  } catch (error) {
                    console.log('SW registration failed:', error);
                  }
                });
              }
              
              // PWA Install Detection
              let deferredPrompt;
              let isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
              let isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                                (window.navigator).standalone === true;
              
              // Hide address bar on iOS Safari
              if (isIOSDevice && !isStandalone) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    window.scrollTo(0, 1);
                  }, 0);
                });
              }
              
              window.addEventListener('beforeinstallprompt', (e) => {
                console.log('beforeinstallprompt fired');
                e.preventDefault();
                deferredPrompt = e;
                
                // Trigger custom install UI
                window.dispatchEvent(new CustomEvent('pwa-installable', { detail: e }));
              });

              window.addEventListener('appinstalled', (evt) => {
                console.log('App was installed');
                deferredPrompt = null;
                window.dispatchEvent(new CustomEvent('pwa-installed'));
              });
              
              // Expose install function globally
              window.triggerPWAInstall = async function() {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  console.log('User choice:', outcome);
                  deferredPrompt = null;
                  return outcome === 'accepted';
                }
                return false;
              };
              
              // iOS detection
              window.isIOSDevice = isIOSDevice;
              window.isStandalone = isStandalone;
            `,
          }}
        />

        {/* Hide iOS Safari UI when in standalone mode */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media (display-mode: standalone) {
              body {
                -webkit-user-select: none;
                -webkit-touch-callout: none;
                -webkit-tap-highlight-color: transparent;
              }
              
              /* Hide any browser UI remnants */
              body::before {
                content: "";
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: env(safe-area-inset-top, 0px);
                background: #3b82f6;
                z-index: 9999;
              }
            }
            
            /* iOS Safe Area Support */
            @supports (padding: max(0px)) {
              body {
                padding-top: env(safe-area-inset-top);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
                padding-bottom: env(safe-area-inset-bottom);
              }
            }
            
            /* Prevent iOS zoom on input focus */
            input, select, textarea {
              font-size: 16px !important;
            }
            
            /* iOS PWA status bar styling */
            @media (display-mode: standalone) and (max-device-width: 480px) {
              html {
                padding-top: constant(safe-area-inset-top);
                padding-top: env(safe-area-inset-top);
              }
            }
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        {children}
        
        {/* PWA Update Notification */}
        <div id="pwa-update-notification" style={{ display: 'none' }} className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span>Có phiên bản mới! Cập nhật ngay?</span>
            <button id="pwa-update-btn" className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
              Cập nhật
            </button>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Handle PWA update notifications
            document.addEventListener('DOMContentLoaded', () => {
              const updateNotification = document.getElementById('pwa-update-notification');
              const updateBtn = document.getElementById('pwa-update-btn');
              
              if (updateBtn) {
                updateBtn.addEventListener('click', () => {
                  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                });
              }
            });
          `
        }} />
      </body>
    </html>
  );
}
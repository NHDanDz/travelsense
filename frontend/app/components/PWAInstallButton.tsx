// app/components/PWAInstallButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, X } from 'lucide-react';

// Interface cho PWA Status
interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  platform: 'ios' | 'android' | 'desktop' | '';
}

// Custom hook để theo dõi PWA status
export const usePWAStatus = (): PWAStatus => {
  const [status, setStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    isInstallable: false,
    isOnline: true,
    platform: ''
  });

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    let platform: PWAStatus['platform'] = '';
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      platform = 'ios';
    } else if (userAgent.includes('android')) {
      platform = 'android';
    } else {
      platform = 'desktop';
    }

    // Check if running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    // Check if installable (will be updated by beforeinstallprompt)
    let isInstallable = false;

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      isInstallable = true;
      setStatus(prev => ({ ...prev, isInstallable: true }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setStatus(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isStandalone: true,
        isInstallable: false 
      }));
    };

    // Listen for online/offline
    const handleOnlineStatus = () => {
      setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Initial status
    setStatus({
      isInstalled: isStandalone,
      isStandalone,
      isInstallable,
      isOnline: navigator.onLine,
      platform
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return status;
};

// PWA Install Button Component
interface PWAInstallButtonProps {
  className?: string;
}

export const SimpleInstallButton: React.FC<PWAInstallButtonProps> = ({ className = '' }) => {
  const { isInstalled, isInstallable, platform } = usePWAStatus();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt && platform !== 'ios') return;

    setIsLoading(true);

    try {
      if (platform === 'ios') {
        // Show iOS instructions
        alert('Để cài đặt:\n1. Nhấn nút Share 📤\n2. Chọn "Thêm vào màn hình chính"\n3. Nhấn "Thêm"');
        return;
      }

      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white ${className}`}>
        <CheckCircle className="w-4 h-4 mr-2" />
        Đã cài đặt
      </div>
    );
  }

  // Don't show if not installable (except iOS)
  if (!isInstallable && platform !== 'ios') {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
      } ${className || 'bg-blue-600 hover:bg-blue-700 text-white'}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Đang cài đặt...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          {platform === 'ios' ? 'Hướng dẫn cài đặt' : 'Cài đặt ứng dụng'}
        </>
      )}
    </button>
  );
};

// Full PWA Install Banner
const PWAInstallButton: React.FC = () => {
  const { isInstalled, isInstallable, platform } = usePWAStatus();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show banner if installable and not dismissed
    if (typeof window !== 'undefined') {
      const wasDismissed = localStorage.getItem('pwa-banner-dismissed') === 'true';
      if (!isInstalled && (isInstallable || platform === 'ios') && !wasDismissed) {
        setShowBanner(true);
      }
    }
  }, [isInstalled, isInstallable, platform]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }
  };

  if (!showBanner || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Smartphone className="w-6 h-6" />
          <div>
            <div className="font-medium">Cài đặt TravelSense</div>
            <div className="text-sm opacity-90">Trải nghiệm tốt hơn như ứng dụng thật</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <SimpleInstallButton className="bg-white text-blue-600 hover:bg-blue-50" />
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;
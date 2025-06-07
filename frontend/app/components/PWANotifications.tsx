'use client';

import { useEffect, useState } from 'react';

// PWA Update Notification Component
export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleSWUpdate = () => {
      setShowUpdate(true);
    };

    window.addEventListener('swUpdate', handleSWUpdate);
    return () => window.removeEventListener('swUpdate', handleSWUpdate);
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-3">
        <span>🔄 Có phiên bản mới!</span>
        <button 
          onClick={handleUpdate}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium"
        >
          Cập nhật
        </button>
      </div>
    </div>
  );
}

// iOS Install Instructions Component
export function IOSInstallInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleShowManualInstall = () => {
      if (document.documentElement.classList.contains('ios-safari')) {
        setShowInstructions(true);
      }
    };

    window.addEventListener('showManualInstall', handleShowManualInstall);
    return () => window.removeEventListener('showManualInstall', handleShowManualInstall);
  }, []);

  const handleClose = () => {
    setShowInstructions(false);
  };

  if (!showInstructions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 ios-install-prompt">
      <div className="bg-white w-full p-6 rounded-t-2xl">
        <div className="text-center">
          <div className="text-4xl mb-4">🧭</div>
          <h3 className="text-xl font-bold mb-2">Cài đặt TravelSense</h3>
          <p className="text-gray-600 mb-4">Thêm vào màn hình chính để truy cập nhanh</p>
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
            <span>Nhấn</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3 3h-2v10h-2V5H9l3-3z"/>
              <path d="M5 15v5h14v-5h2v7H3v-7h2z"/>
            </svg>
            <span>rồi chọn "Thêm vào Màn hình chính"</span>
          </div>
          <button
            onClick={handleClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}

// Event Listeners Component
export function PWAEventListeners() {
  useEffect(() => {
    // Listen for SW update
    const handleSWUpdate = () => {
      // Dispatch custom event that PWAUpdateNotification will catch
      window.dispatchEvent(new CustomEvent('swUpdate'));
    };
    
    // Listen for manual install instructions
    const handleShowManualInstall = () => {
      if (document.documentElement.classList.contains('ios-safari')) {
        // Dispatch custom event that IOSInstallInstructions will catch
        window.dispatchEvent(new CustomEvent('showManualInstall'));
      }
    };
    
    // Listen for install success
    const handlePWAInstalled = () => {
      console.log('🎉 PWA installed successfully!');
      // Hide any install prompts
      document.querySelectorAll('[data-pwa-install]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    };

    window.addEventListener('swUpdate', handleSWUpdate);
    window.addEventListener('showManualInstall', handleShowManualInstall);
    window.addEventListener('pwaInstalled', handlePWAInstalled);

    return () => {
      window.removeEventListener('swUpdate', handleSWUpdate);
      window.removeEventListener('showManualInstall', handleShowManualInstall);
      window.removeEventListener('pwaInstalled', handlePWAInstalled);
    };
  }, []);

  return null; // This component doesn't render anything
}
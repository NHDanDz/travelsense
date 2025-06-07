// app/components/iOSPWAHelper.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Share, Plus, Home } from 'lucide-react';

interface IOSPWAHelperProps {
  onClose?: () => void;
}

const IOSPWAHelper: React.FC<IOSPWAHelperProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đang chạy trên iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Kiểm tra nếu đã cài đặt (standalone mode)
    const isInStandaloneMode = 
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isInStandaloneMode);

    // Chỉ hiển thị trên iOS và chưa cài đặt
    if (isIOS && !isInStandaloneMode) {
      // Kiểm tra nếu user đã dismiss trước đó
      const dismissed = localStorage.getItem('ios-pwa-dismissed');
      if (!dismissed) {
        setTimeout(() => setIsVisible(true), 2000); // Hiển thị sau 2 giây
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('ios-pwa-dismissed', 'true');
    onClose?.();
  };

  const handleNeverShow = () => {
    setIsVisible(false);
    localStorage.setItem('ios-pwa-dismissed', 'permanent');
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={handleDismiss} />
      
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧭</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Cài đặt TravelSense</h3>
              <p className="text-sm text-gray-600">Trải nghiệm tốt hơn như app thật</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-lg">1️⃣</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">Nhấn nút Share</span>
                <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-sm">
                  <Share className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Ở thanh công cụ phía dưới Safari</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-lg">2️⃣</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">Chọn "Thêm vào màn hình chính"</span>
                <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-sm">
                  <Plus className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Cuộn xuống trong menu chia sẻ</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-lg">3️⃣</span>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-900">Nhấn "Thêm"</span>
                <div className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-sm">
                  <Home className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Xác nhận thêm vào màn hình chính</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Lợi ích khi cài đặt:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Mở nhanh hơn từ màn hình chính</li>
            <li>• Hoạt động offline</li>
            <li>• Không có thanh địa chỉ</li>
            <li>• Trải nghiệm như app thật</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Để sau
          </button>
          <button
            onClick={handleNeverShow}
            className="py-3 px-4 text-gray-500 font-medium hover:text-gray-700 transition-colors"
          >
            Không hiện nữa
          </button>
        </div>

        {/* Visual indicator */}
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </>
  );
};

export default IOSPWAHelper;
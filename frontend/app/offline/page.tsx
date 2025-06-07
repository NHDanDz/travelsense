// app/offline/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home, Map } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = '/';
    } else {
      // Try to go back to the last page
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Status Icon */}
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isOnline ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isOnline ? (
            <RefreshCw className="w-10 h-10 text-green-600" />
          ) : (
            <WifiOff className="w-10 h-10 text-red-600" />
          )}
        </div>

        {/* Status Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isOnline ? 'Đã kết nối lại!' : 'Không có kết nối mạng'}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {isOnline 
            ? 'Kết nối internet đã được khôi phục. Bạn có thể tiếp tục sử dụng ứng dụng.'
            : 'Vui lòng kiểm tra kết nối internet và thử lại. Một số tính năng có thể không hoạt động khi offline.'
          }
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isOnline ? (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Tiếp tục
            </button>
          ) : (
            <button
              onClick={handleRefresh}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Thử lại
            </button>
          )}

          <div className="flex space-x-3">
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Trang chủ
            </Link>
            
            <Link
              href="/dashboard/Map"
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Map className="w-5 h-5 mr-2" />
              Bản đồ
            </Link>
          </div>
        </div>

        {/* Offline Features Info */}
        {!isOnline && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Tính năng offline:</h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Xem các địa điểm đã lưu</li>
              <li>• Xem lịch trình đã tạo</li>
              <li>• Lưu địa điểm yêu thích</li>
              <li>• Xem thông tin cơ bản</li>
            </ul>
          </div>
        )}

        {/* Network Status Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-500">
            {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Hook to detect online/offline status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      console.log('Network: Back online');
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('Network: Gone offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
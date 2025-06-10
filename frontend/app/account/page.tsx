'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Edit, MapPin, Heart, Clock, Settings, LogOut, Lock, 
  Camera, Award, Compass, UserCheck, Star, Calendar, 
  ThumbsUp, Trash, Map, Loader2, ChevronLeft, ChevronRight,
  TrendingUp, Target, Shield, MoreVertical, Bell, X, Check,
  Smartphone, Mail, MessageSquare, Volume2, VolumeX, Eye,
  EyeOff, Download, HelpCircle, CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';  
import { AuthService } from '@/lib/auth';
import { Trip, Day, Place } from '@/types/trip';

// Interfaces
interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  joinDate: string;
  savedPlaces: number;
  completedTrips: number;
  reviewsCount: number;
}

interface SavedPlace {
  id: number;
  name: string;
  type: string;
  address: string;
  rating: number;
  image: string;
  savedAt: string;
  notes?: string;
}

interface Review {
  id: number;
  placeName: string;
  placeType: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  visitDate?: string;
}
 
type TabType = 'profile' | 'saved' | 'trips' | 'reviews' | 'settings';
type SettingsModal = 'notifications' | 'security' | 'privacy' | 'upgrade' | null;

// PWA Notification Service
class NotificationService {
  static async requestPermission(): Promise<boolean> {
    try {
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        return false;
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  static async showNotification(title: string, options?: NotificationOptions) {
    try {
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      const defaultOptions = {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
        requireInteraction: false,
        ...options
      };

      // Try service worker first for better PWA experience
      if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
        try {
          const registration = await navigator.serviceWorker.ready;
          return await registration.showNotification(title, defaultOptions);
        } catch (swError) {
          console.warn('Service worker notification failed, falling back to regular notification:', swError);
        }
      }

      // Fallback to regular notification
      return new Notification(title, defaultOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  static getPermissionStatus(): string {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }

  static isSupported(): boolean {
    return 'Notification' in window;
  }
}

// Settings interfaces
interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  tripReminders: boolean;
  reviewRequests: boolean;
  promotions: boolean;
  sound: boolean;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  passwordLastChanged: string;
}

interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showTrips: boolean;
  dataSharing: boolean;
}

// Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
  </div>
);

const Toast = ({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error'; 
  onClose: () => void; 
}) => (
  <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top duration-300">
    <div className={`rounded-xl shadow-lg p-4 flex items-center space-x-3 max-w-sm ${
      type === 'success' 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-red-50 border border-red-200'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        type === 'success' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {type === 'success' ? (
          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
        ) : (
          <X className="w-3 h-3 text-red-600" />
        )}
      </div>
      <p className={`text-sm font-medium ${
        type === 'success' ? 'text-green-800' : 'text-red-800'
      }`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`p-1 rounded-full transition-colors ${
          type === 'success' 
            ? 'text-green-400 hover:bg-green-100' 
            : 'text-red-400 hover:bg-red-100'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const NotificationSettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [permissionStatus, setPermissionStatus] = useState(NotificationService.getPermissionStatus());
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handlePermissionRequest = async () => {
    setIsRequestingPermission(true);
    const granted = await NotificationService.requestPermission();
    setPermissionStatus(NotificationService.getPermissionStatus());
    
    if (granted) {
      setLocalSettings(prev => ({ ...prev, pushEnabled: true }));
      // Show test notification
      NotificationService.showNotification('Thông báo đã được bật!', {
        body: 'Bạn sẽ nhận được thông báo về các hoạt động mới.',
        icon: '/icon-192x192.png'
      });
    }
    setIsRequestingPermission(false);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Cài đặt thông báo</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Push Notifications */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Thông báo đẩy</h4>
                    <p className="text-sm text-gray-500">Nhận thông báo trên thiết bị</p>
                  </div>
                </div>
                {permissionStatus === 'granted' ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.pushEnabled}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${localSettings.pushEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.pushEnabled ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                    </div>
                  </label>
                ) : (
                  <button
                    onClick={handlePermissionRequest}
                    disabled={isRequestingPermission || permissionStatus === 'denied'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    {isRequestingPermission ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                        Đang xin phép...
                      </>
                    ) : (
                      permissionStatus === 'denied' ? 'Đã từ chối' : 'Bật thông báo'
                    )}
                  </button>
                )}
              </div>
              
              {permissionStatus === 'denied' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">
                    Thông báo đã bị từ chối. Vui lòng bật trong cài đặt trình duyệt.
                  </p>
                </div>
              )}
            </div>

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Loại thông báo</h4>
              
              {[
                { key: 'emailEnabled', icon: Mail, label: 'Email thông báo', desc: 'Nhận email về hoạt động mới' },
                { key: 'tripReminders', icon: Calendar, label: 'Nhắc nhở chuyến đi', desc: 'Thông báo trước khi khởi hành' },
                { key: 'reviewRequests', icon: Star, label: 'Yêu cầu đánh giá', desc: 'Nhắc nhở đánh giá sau chuyến đi' },
                { key: 'promotions', icon: Target, label: 'Khuyến mãi', desc: 'Ưu đãi và chương trình đặc biệt' },
                { key: 'sound', icon: localSettings.sound ? Volume2 : VolumeX, label: 'Âm thanh', desc: 'Phát âm thanh khi có thông báo' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings[item.key as keyof NotificationSettings] as boolean}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${localSettings[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings[item.key as keyof NotificationSettings] ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecuritySettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: SecuritySettings;
  onSave: (settings: SecuritySettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleChangePassword = () => {
    // Implement password change logic
    console.log('Changing password...', passwordForm);
    setShowChangePassword(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Bảo mật & Đăng nhập</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Password Section */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Mật khẩu</h4>
                    <p className="text-sm text-gray-500">Cập nhật lần cuối: {settings.passwordLastChanged}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Đổi mật khẩu
                </button>
              </div>

              {showChangePassword && (
                <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                  <input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu mới"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleChangePassword}
                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              )}
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Cài đặt bảo mật</h4>
              
              {[
                { key: 'twoFactorEnabled', icon: Shield, label: 'Xác thực hai yếu tố', desc: 'Bảo mật tài khoản với mã OTP' },
                { key: 'loginAlerts', icon: Bell, label: 'Cảnh báo đăng nhập', desc: 'Thông báo khi có đăng nhập từ thiết bị mới' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings[item.key as keyof SecuritySettings] as boolean}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${localSettings[item.key as keyof SecuritySettings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings[item.key as keyof SecuritySettings] ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivacySettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSave 
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: PrivacySettings;
  onSave: (settings: PrivacySettings) => void;
}) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quyền riêng tư</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Hiển thị công khai</h4>
              
              {[
                { key: 'profileVisible', icon: User, label: 'Hồ sơ công khai', desc: 'Cho phép người khác xem hồ sơ của bạn' },
                { key: 'showEmail', icon: Mail, label: 'Hiển thị email', desc: 'Email sẽ hiện trong hồ sơ công khai' },
                { key: 'showTrips', icon: Map, label: 'Hiển thị chuyến đi', desc: 'Chuyến đi sẽ hiện cho người khác' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings[item.key as keyof PrivacySettings] as boolean}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${localSettings[item.key as keyof PrivacySettings] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings[item.key as keyof PrivacySettings] ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Chia sẻ dữ liệu</h4>
                    <p className="text-sm text-gray-500">Cho phép chia sẻ dữ liệu để cải thiện dịch vụ</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.dataSharing}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, dataSharing: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${localSettings.dataSharing ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${localSettings.dataSharing ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`}></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Bảo vệ dữ liệu</h4>
                  <p className="text-sm text-blue-700">
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo tiêu chuẩn GDPR và CCPA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
  const EditModal = ({ 
  isOpen, 
  onClose, 
  title, 
  currentValue, 
  onSave, 
  placeholder,
  type = 'text'
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  currentValue: string;
  onSave: (newValue: string) => Promise<void> | void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea';
}) => {
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(currentValue);
    setError(null);
  }, [currentValue, isOpen]);

  const handleSave = async () => {
    if (value.trim() === currentValue.trim()) {
      onClose();
      return;
    }

    if (!value.trim()) {
      setError('Trường này không được để trống');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(value.trim());
      onClose();
    } catch (err) {
      console.error('Error saving:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {title}
            </label>
            
            {type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                autoFocus
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                  error 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } disabled:bg-gray-50 disabled:opacity-50`}
              />
            ) : (
              <input
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                autoFocus
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  error 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } disabled:bg-gray-50 disabled:opacity-50`}
              />
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                {error}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !value.trim() || value.trim() === currentValue.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  color = 'blue' 
}: { 
  icon: any; 
  label: string; 
  value: number; 
  color?: string; 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

const AchievementBadge = ({ 
  icon: Icon, 
  title, 
  description, 
  isUnlocked, 
  progress 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  isUnlocked: boolean; 
  progress?: string; 
}) => (
  <div className={`p-4 rounded-2xl border-2 transition-all ${
    isUnlocked 
      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
      : 'bg-gray-50 border-gray-200'
  }`}>
    <div className={`w-12 h-12 rounded-xl ${
      isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
    } flex items-center justify-center mb-3`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>
      {title}
    </h3>
    <p className="text-xs text-gray-600 mb-2">{description}</p>
    {progress && (
      <div className="text-xs font-medium text-gray-500">{progress}</div>
    )}
  </div>
);

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Mobile states
  const [isMobile, setIsMobile] = useState(false);
  
  // Settings states
  const [activeSettingsModal, setActiveSettingsModal] = useState<SettingsModal>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    pushEnabled: false,
    emailEnabled: true,
    tripReminders: true,
    reviewRequests: true,
    promotions: false,
    sound: true
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginAlerts: true,
    passwordLastChanged: '3 tháng trước'
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisible: true,
    showEmail: false,
    showTrips: true,
    dataSharing: false
  });
  
  // Pagination states
  const [savedPlacesPage, setSavedPlacesPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    type: 'name' | 'email' | 'username' | null;
    title: string;
    currentValue: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    currentValue: ''
  });

  const router = useRouter();

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Authentication check
  useEffect(() => {
    try {
      if (!AuthService.isAuthenticated()) {
        router.push('/auth');
        return;
      }
      const userId = AuthService.getUserId();
      setCurrentUserId(userId);
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/auth');
    }
  }, [router]);

  // Fetch user data
  useEffect(() => {
    if (currentUserId) {
      fetchUserData();
    }
  }, [currentUserId]);

  // Fetch tab-specific data
  useEffect(() => {
    if (!currentUserId) return;
    switch (activeTab) {
      case 'saved':
        fetchSavedPlaces();
        break;
      case 'reviews':
        fetchReviews();
        break;
      case 'trips':
        fetchTrips();
        break;
    }
  }, [activeTab, savedPlacesPage, reviewsPage, selectedCategory, currentUserId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/account?userId=${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setUserData({
        ...data,
        joinDate: new Date(data.joinDate).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long'
        })
      });
    } catch (err) {
      setError('Không thể tải thông tin tài khoản');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPlaces = async () => {
    try {
      const response = await fetch(
        `/api/account/saved-places?userId=${currentUserId}&page=${savedPlacesPage}&category=${selectedCategory}`
      );
      if (!response.ok) throw new Error('Failed to fetch saved places');
      
      const data = await response.json();
      setSavedPlaces(data.places);
    } catch (err) {
      console.error('Error fetching saved places:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `/api/account/reviews?userId=${currentUserId}&page=${reviewsPage}`
      );
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await fetch(`/api/trips?userId=${currentUserId}`);
      if (!response.ok) throw new Error('Failed to fetch trips');
      
      const data = await response.json();
      setTrips(data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const openEditModal = (type: 'name' | 'email' | 'username', title: string, currentValue: string) => {
    setEditModal({
      isOpen: true,
      type,
      title,
      currentValue
    });
  };

  const handleSaveFromModal = async (newValue: string) => {
    if (!editModal.type || !userData) return;
    
    const updateData: Partial<UserData> = {};
    updateData[editModal.type] = newValue;
    
    await handleUpdateProfile(updateData);
  };

  const handleUpdateProfile = async (updatedData: Partial<UserData>) => {
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          ...updatedData
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      const result = await response.json();
      if (result.success) {
        await fetchUserData();
        setToast({
          type: 'success',
          message: 'Cập nhật thông tin thành công!'
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setToast({
        type: 'error',
        message: 'Không thể cập nhật thông tin'
      });
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

    try {
      const response = await fetch(`/api/account/reviews?reviewId=${reviewId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete review');
      
      fetchReviews();
      fetchUserData();
      setToast({
        type: 'success',
        message: 'Đã xóa đánh giá thành công'
      });
    } catch (err) {
      console.error('Error deleting review:', err);
      setToast({
        type: 'error',
        message: 'Không thể xóa đánh giá'
      });
    }
  };

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        AuthService.logout();
        router.push('/auth');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const handleNotificationTest = async () => {
    try {
      if (!NotificationService.isSupported()) {
        setToast({
          type: 'error',
          message: 'Trình duyệt không hỗ trợ thông báo!'
        });
        return;
      }

      const granted = await NotificationService.requestPermission();
      if (granted) {
        await NotificationService.showNotification('🎉 Thông báo thử nghiệm', {
          body: 'Hệ thống thông báo hoạt động bình thường! Bạn sẽ nhận được thông báo về các hoạt động mới.',
          icon: '/icon-192x192.png',
          tag: 'test-notification',  
        });
        
        setToast({
          type: 'success',
          message: 'Đã gửi thông báo thử nghiệm!'
        });

        // Update notification settings
        setNotificationSettings(prev => ({ ...prev, pushEnabled: true }));
      } else {
        setToast({
          type: 'error',
          message: 'Không thể gửi thông báo. Vui lòng bật quyền thông báo trong cài đặt trình duyệt.'
        });
      }
    } catch (error) {
      console.error('Notification test error:', error);
      setToast({
        type: 'error',
        message: 'Lỗi khi gửi thông báo!'
      });
    }
  };

  const handleOpenSettings = (type: SettingsModal) => {
    console.log('Opening settings modal:', type); // Debug log
    setActiveSettingsModal(type);
  };

  const handleCloseSettings = () => {
    console.log('Closing settings modal'); // Debug log
    setActiveSettingsModal(null);
  };

  const handlePWAInstall = async () => {
    try {
      // Check if app is already installed
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setToast({
          type: 'success',
          message: 'Ứng dụng đã được cài đặt!'
        });
        return;
      }

      // Try to install PWA
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
        setToast({
          type: 'success',
          message: 'Đã cài đặt ứng dụng! Kiểm tra màn hình chính của bạn.'
        });
      } else {
        setToast({
          type: 'error',
          message: 'Trình duyệt không hỗ trợ PWA!'
        });
      }
    } catch (error) {
      console.error('PWA install error:', error);
      setToast({
        type: 'error',
        message: 'Không thể cài đặt ứng dụng!'
      });
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ dữ liệu của bạn. Bạn có chắc chắn muốn tiếp tục?')) {
      if (confirm('Vui lòng xác nhận lần nữa. Dữ liệu sẽ không thể khôi phục!')) {
        setToast({
          type: 'error',
          message: 'Tính năng xóa tài khoản đang được phát triển!'
        });
      }
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      const savedSecuritySettings = localStorage.getItem('securitySettings');
      const savedPrivacySettings = localStorage.getItem('privacySettings');

      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings));
      }
      if (savedPrivacySettings) {
        setPrivacySettings(JSON.parse(savedPrivacySettings));
      }
    }
  }, []);

  const saveNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setToast({
      type: 'success',
      message: 'Đã lưu cài đặt thông báo!'
    });
  };

  const saveSecuritySettings = (settings: SecuritySettings) => {
    setSecuritySettings(settings);
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    setToast({
      type: 'success',
      message: 'Đã lưu cài đặt bảo mật!'
    });
  };

  const savePrivacySettings = (settings: PrivacySettings) => {
    setPrivacySettings(settings);
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    setToast({
      type: 'success',
      message: 'Đã lưu cài đặt quyền riêng tư!'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading || !currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error || 'Không thể tải dữ liệu'}</p>
          <button 
            onClick={fetchUserData}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Mobile Tab Navigation
  const MobileTabNav = () => (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        {[
          { id: 'profile', icon: User, label: 'Hồ sơ' },
          { id: 'saved', icon: Heart, label: 'Đã lưu' },
          { id: 'trips', icon: Map, label: 'Chuyến đi' },
          { id: 'reviews', icon: Star, label: 'Đánh giá' },
          { id: 'settings', icon: Settings, label: 'Cài đặt' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:block w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700"></div>
          <div className="absolute -bottom-8 left-6">
            <div className="relative w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-lg">
              <Image 
                src={userData.avatar} 
                alt={userData.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="pt-12 pb-6 px-6">
          <h3 className="font-bold text-xl text-gray-900 mb-1">{userData.name}</h3>
          <p className="text-gray-600 text-sm mb-1">@{userData.username}</p>
          <p className="text-gray-500 text-xs">Thành viên từ {userData.joinDate}</p>
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-6">
          <ul className="space-y-1">
            {[
              { id: 'profile', icon: User, label: 'Hồ sơ cá nhân' },
              { id: 'saved', icon: Heart, label: 'Địa điểm đã lưu', count: userData.savedPlaces },
              { id: 'trips', icon: Map, label: 'Chuyến đi của tôi', count: trips.length },
              { id: 'reviews', icon: Star, label: 'Đánh giá của tôi', count: userData.reviewsCount },
              { id: 'settings', icon: Settings, label: 'Cài đặt' }
            ].map(item => (
              <li key={item.id}>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(item.id as TabType)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard 
                icon={Heart} 
                label="Địa điểm đã lưu" 
                value={userData.savedPlaces} 
                color="blue" 
              />
              <StatsCard 
                icon={Map} 
                label="Chuyến đi hoàn thành" 
                value={userData.completedTrips} 
                color="green" 
              />
              <StatsCard 
                icon={Star} 
                label="Đánh giá" 
                value={userData.reviewsCount} 
                color="purple" 
              />
              <StatsCard 
                icon={TrendingUp} 
                label="Điểm tương tác" 
                value={userData.savedPlaces + userData.reviewsCount * 2} 
                color="orange" 
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hành động nhanh</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={handleNotificationTest}
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 hover:border-blue-300"
                >
                  <Bell className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-700">Test thông báo</span>
                  <span className="text-xs text-blue-500 mt-1">PWA Notification</span>
                </button>
                <button 
                  onClick={() => {
                    try {
                      const dataStr = JSON.stringify({
                        profile: userData,
                        savedPlaces: savedPlaces.length,
                        trips: trips.length,
                        reviews: reviews.length,
                        exportDate: new Date().toISOString()
                      }, null, 2);
                      
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `my-travel-data-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      
                      setToast({
                        type: 'success',
                        message: 'Đã tải xuống dữ liệu cá nhân!'
                      });
                    } catch (error) {
                      setToast({
                        type: 'error',
                        message: 'Lỗi khi tải dữ liệu!'
                      });
                    }
                  }}
                  className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200 hover:border-green-300"
                >
                  <Download className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-700">Tải dữ liệu</span>
                  <span className="text-xs text-green-500 mt-1">JSON Export</span>
                </button>
                <button 
                  onClick={() => handleOpenSettings('security')}
                  className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200 hover:border-purple-300"
                >
                  <Shield className="w-6 h-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-700">Bảo mật</span>
                  <span className="text-xs text-purple-500 mt-1">Settings</span>
                </button>
                <button 
                  onClick={() => {
                    window.open('mailto:support@example.com?subject=Cần trợ giúp từ ' + userData.name + '&body=Xin chào,%0A%0ATôi cần trợ giúp về ứng dụng du lịch.%0A%0AUser ID: ' + userData.id + '%0AUsername: ' + userData.username + '%0A%0AVấn đề: ');
                  }}
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 hover:border-orange-300"
                >
                  <HelpCircle className="w-6 h-6 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-700">Trợ giúp</span>
                  <span className="text-xs text-orange-500 mt-1">Email Support</span>
                </button>
              </div>
              
              {/* Notification Status */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      NotificationService.getPermissionStatus() === 'granted' ? 'bg-green-500' : 
                      NotificationService.getPermissionStatus() === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">
                      Trạng thái thông báo: <strong>
                        {NotificationService.getPermissionStatus() === 'granted' ? 'Đã bật' :
                         NotificationService.getPermissionStatus() === 'denied' ? 'Đã tắt' : 'Chưa cài đặt'}
                      </strong>
                    </span>
                  </div>
                  {NotificationService.getPermissionStatus() !== 'granted' && (
                    <button
                      onClick={handleNotificationTest}
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      Bật ngay
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Họ và tên', value: userData.name, type: 'name' as const },
                  { label: 'Email', value: userData.email, type: 'email' as const },
                  { label: 'Tên người dùng', value: `@${userData.username}`, type: 'username' as const }
                ].map(item => (
                  <div key={item.type} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="font-medium text-gray-900 mt-1">{item.value}</div>
                    </div>
                    <button 
                      onClick={() => openEditModal(
                        item.type, 
                        `Chỉnh sửa ${item.label.toLowerCase()}`, 
                        item.type === 'username' ? userData.username : item.value
                      )}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Chỉnh sửa
                    </button>
                  </div>
                ))}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
                  <div className="mb-2 sm:mb-0">
                    <div className="text-sm text-gray-500">Mật khẩu</div>
                    <div className="font-medium text-gray-900 mt-1">••••••••</div>
                  </div>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
                    <Lock className="w-4 h-4 mr-1" />
                    Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thành tựu</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AchievementBadge
                  icon={Award}
                  title="Nhà khám phá"
                  description="Khám phá nhiều địa điểm"
                  isUnlocked={userData.savedPlaces >= 20}
                  progress={`${userData.savedPlaces}/20 địa điểm`}
                />
                <AchievementBadge
                  icon={Star}
                  title="Chuyên gia đánh giá"
                  description="Đánh giá nhiều địa điểm"
                  isUnlocked={userData.reviewsCount >= 50}
                  progress={`${userData.reviewsCount}/50 đánh giá`}
                />
                <AchievementBadge
                  icon={Compass}
                  title="Lữ khách"
                  description="Hoàn thành nhiều chuyến đi"
                  isUnlocked={userData.completedTrips >= 5}
                  progress={`${userData.completedTrips}/5 chuyến đi`}
                />
                <AchievementBadge
                  icon={UserCheck}
                  title="Thành viên VIP"
                  description="Hoạt động tích cực"
                  isUnlocked={false}
                  progress="Sắp đạt được"
                />
              </div>
            </div>
          </div>
        );

      case 'saved':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Địa điểm đã lưu</h2>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="Tất cả">Tất cả danh mục</option>
                <option value="restaurant">Nhà hàng</option>
                <option value="hotel">Khách sạn</option>
                <option value="tourist_attraction">Địa điểm du lịch</option>
                <option value="cafe">Quán cà phê</option>
              </select>
            </div>
            
            {savedPlaces.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có địa điểm nào</h3>
                <p className="text-gray-400">Hãy khám phá và lưu những địa điểm yêu thích!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedPlaces.map(place => (
                  <div key={place.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                        <Image
                          src={place.image}
                          alt={place.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 truncate">{place.name}</h3>
                          <button className="text-red-500 hover:text-red-600 transition-colors p-1">
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        <div className="text-sm text-blue-600 mb-2">{place.type}</div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(place.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-600">{place.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">{formatDate(place.savedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'trips':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Chuyến đi của tôi</h2>
              <Link href="/trip-planner">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                  + Tạo chuyến đi mới
                </button>
              </Link>
            </div>
            
            {trips.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có chuyến đi nào</h3>
                <p className="text-gray-400 mb-6">Hãy tạo chuyến đi đầu tiên của bạn!</p>
                <Link href="/trip-planner">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    Tạo chuyến đi mới
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {trips.map(trip => (
                  <div key={trip.id} className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <div className="relative h-48">
                      <Image
                        src={trip.city?.imageUrl ?? "/images/default-city.jpg"}
                        alt={trip.name}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute top-4 right-4 text-xs font-medium py-2 px-3 rounded-full ${
                        trip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        trip.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.status === 'completed' ? 'Đã hoàn thành' : 
                         trip.status === 'planned' ? 'Đã lên kế hoạch' : 'Nháp'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 truncate">{trip.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{trip.placesCount} địa điểm</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Link href={`/trip-planner/${trip.id}`}>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Xem chi tiết
                          </button>
                        </Link>
                        <Link href={`/trip-planner/${trip.id}`}>
                          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá của tôi</h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có đánh giá nào</h3>
                <p className="text-gray-400">Hãy chia sẻ trải nghiệm của bạn!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{review.placeName}</h3>
                        <div className="text-sm text-blue-600 mt-1">{review.placeType}</div>
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
                    </div>
                    
                    <div className="flex mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 mb-4">{review.content}</p>
                    
                    <div className="flex items-center gap-4">
                      <button className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {review.likes}
                      </button>
                      <button className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </button>
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="inline-flex items-center text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
              
              <div className="space-y-4">
                {[
                  { 
                    icon: Bell, 
                    title: 'Thông báo', 
                    desc: 'Quản lý cài đặt thông báo push và email', 
                    action: 'Quản lý',
                    onClick: () => handleOpenSettings('notifications'),
                    badge: notificationSettings.pushEnabled ? 'Đã bật' : 'Tắt',
                    badgeColor: notificationSettings.pushEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  },
                  { 
                    icon: Shield, 
                    title: 'Bảo mật và đăng nhập', 
                    desc: 'Cập nhật mật khẩu và cài đặt bảo mật', 
                    action: 'Cập nhật',
                    onClick: () => handleOpenSettings('security'),
                    badge: securitySettings.twoFactorEnabled ? '2FA Bật' : 'Cơ bản',
                    badgeColor: securitySettings.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  },
                  { 
                    icon: User, 
                    title: 'Quyền riêng tư', 
                    desc: 'Quản lý dữ liệu và quyền riêng tư', 
                    action: 'Quản lý',
                    onClick: () => handleOpenSettings('privacy'),
                    badge: privacySettings.profileVisible ? 'Công khai' : 'Riêng tư',
                    badgeColor: privacySettings.profileVisible ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                        <item.icon className="w-6 h-6 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={item.onClick}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
                
                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-4">Hành động nhanh</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setToast({
                          type: 'success',
                          message: 'Đang chuẩn bị dữ liệu để tải xuống...'
                        });
                      }}
                      className="flex items-center justify-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      <Download className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-700">Tải dữ liệu</span>
                    </button>
                    <button 
                      onClick={() => {
                        window.open('mailto:support@example.com?subject=Cần trợ giúp&body=Xin chào, tôi cần trợ giúp về...');
                      }}
                      className="flex items-center justify-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                    >
                      <HelpCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-700">Trợ giúp</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-4 border-t border-gray-200 mt-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                      <Trash className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-red-600">Xóa tài khoản</h3>
                      <p className="text-sm text-gray-500">Xóa vĩnh viễn tài khoản và dữ liệu</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleDeleteAccount}
                    className="text-red-600 hover:text-red-700 font-medium text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                  >
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>

            {/* PWA Install Prompt */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Cài đặt ứng dụng</h3>
                    <p className="text-sm text-gray-600">Trải nghiệm tốt hơn với PWA</p>
                  </div>
                </div>
                <button 
                  onClick={handlePWAInstall}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors font-medium border border-purple-600"
                >
                  Cài đặt
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center text-purple-700">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Truy cập nhanh</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Thông báo push</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Dùng offline</span>
                </div>
                <div className="flex items-center text-purple-700">
                  <Check className="w-4 h-4 mr-2" />
                  <span>Tiết kiệm pin</span>
                </div>
              </div>
            </div>

            {/* Upgrade Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Gói Miễn phí</h3>
                    <p className="text-sm text-gray-600">Nâng cấp để trải nghiệm đầy đủ</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setToast({
                      type: 'success',
                      message: 'Tính năng nâng cấp đang được phát triển!'
                    });
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium border border-blue-600"
                >
                  Nâng cấp
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Lưu {userData.savedPlaces}/20 địa điểm</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Tạo {trips.length}/2 lịch trình</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-gray-500">Chế độ offline</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30">
        <div className="flex items-center">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden mr-3">
            <Image 
              src={userData.avatar} 
              alt={userData.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">{userData.name}</h1>
            <p className="text-sm text-gray-500">@{userData.username}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          <DesktopSidebar />
          
          {/* Main Content */}
          <div className="flex-1 min-w-0 pb-20 md:pb-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <MobileTabNav />

      {/* Settings Modals */}
      <NotificationSettingsModal
        isOpen={activeSettingsModal === 'notifications'}
        onClose={handleCloseSettings}
        settings={notificationSettings}
        onSave={saveNotificationSettings}
      />

      <SecuritySettingsModal
        isOpen={activeSettingsModal === 'security'}
        onClose={handleCloseSettings}
        settings={securitySettings}
        onSave={saveSecuritySettings}
      />

      <PrivacySettingsModal
        isOpen={activeSettingsModal === 'privacy'}
        onClose={handleCloseSettings}
        settings={privacySettings}
        onSave={savePrivacySettings}
      />

      {/* Debug Info (chỉ hiện khi development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 left-4 bg-black text-white p-2 rounded text-xs">
          Active Modal: {activeSettingsModal || 'none'}
        </div>
      )}

      {/* Modals and Notifications */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ ...editModal, isOpen: false })}
        title={editModal.title}
        currentValue={editModal.currentValue}
        onSave={handleSaveFromModal}
        type={editModal.type === 'email' ? 'email' : 'text'}
        placeholder={
          editModal.type === 'email' ? 'Nhập địa chỉ email mới' :
          editModal.type === 'username' ? 'Nhập tên người dùng mới' :
          'Nhập tên mới'
        }
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AccountPage;
// app/components/auth/ProtectedRoute.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { LogIn, User, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Mặc định là true
  redirectTo?: string; // Trang chuyển hướng sau khi đăng nhập
  fallback?: React.ReactNode; // Component hiển thị khi chưa đăng nhập
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/trip-planner',
  fallback
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra authentication status
    const checkAuth = () => {
      try {
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Nếu không yêu cầu auth hoặc đã đăng nhập, hiển thị children
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // Nếu có fallback component tùy chỉnh
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default login required screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Yêu cầu đăng nhập
          </h1>
          <p className="text-gray-600">
            Bạn cần đăng nhập để sử dụng tính năng lập kế hoạch du lịch
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span>Tạo lịch trình du lịch cá nhân hóa</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span>Lưu và quản lý các chuyến đi</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span>Sử dụng AI để tạo lịch trình thông minh</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href={`/auth?redirect=${encodeURIComponent(redirectTo)}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center group"
          >
            <LogIn className="w-5 h-5 mr-2" />
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href={`/auth?mode=register&redirect=${encodeURIComponent(redirectTo)}`}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <User className="w-5 h-5 mr-2" />
            <span>Tạo tài khoản mới</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;

// Cách sử dụng trong trip-planner page:
/*
// app/trip-planner/page.tsx
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';
import TripPlannerContent from './TripPlannerContent'; // Component chứa logic hiện tại

export default function TripPlannerPage() {
  return (
    <ProtectedRoute>
      <TripPlannerContent />
    </ProtectedRoute>
  );
}
*/
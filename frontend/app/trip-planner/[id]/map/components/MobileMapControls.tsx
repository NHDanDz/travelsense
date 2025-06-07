// app/trip-planner/[id]/map/components/MobileMapControls.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Layers, Route, Play, Square, RotateCcw,
  Navigation, Camera, Share, Download, Target, 
  ChevronDown, Sun, Moon, Map, Globe, Satellite,
  Eye, EyeOff, Maximize2, Minimize2, Activity,
  Menu, X, Zap, Filter, MoreVertical, Compass
} from 'lucide-react';

interface MapViewState {
  activeDay: number;
  showRoute: boolean;
  showAllDays: boolean;
  followRoute: boolean;
  mapStyle: string;
  showTimeline: boolean;
  fullScreen: boolean;
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  days: any[];
}

interface MobileMapControlsProps {
  mapViewState: MapViewState;
  onMapViewStateChange: (updates: Partial<MapViewState>) => void;
  onRouteSimulation: () => void;
  trip: Trip;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const mapStyles = [
  { id: 'streets-v12', name: 'Đường phố', icon: Map, preview: '🏙️' },
  { id: 'outdoors-v12', name: 'Ngoài trời', icon: Globe, preview: '🏞️' },
  { id: 'satellite-v9', name: 'Vệ tinh', icon: Satellite, preview: '🛰️' },
  { id: 'satellite-streets-v12', name: 'Vệ tinh + Đường', icon: Satellite, preview: '🗺️' },
  { id: 'light-v11', name: 'Sáng', icon: Sun, preview: '☀️' },
  { id: 'dark-v11', name: 'Tối', icon: Moon, preview: '🌙' }
];

export default function MobileMapControls({
  mapViewState,
  onMapViewStateChange,
  onRouteSimulation,
  trip,
  isOpen,
  onToggle,
  className = ""
}: MobileMapControlsProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'style' | 'settings'>('main');
  const [showStylePreview, setShowStylePreview] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentDay = trip.days.find(day => day.dayNumber === mapViewState.activeDay);
  const canSimulateRoute = currentDay && currentDay.places && currentDay.places.length >= 2;

  // Handle click outside to close
useEffect(() => {
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node;
    
    if (isOpen && 
        menuRef.current && 
        triggerRef.current &&
        !menuRef.current.contains(target) &&
        !triggerRef.current.contains(target)) {
      onToggle();
    }
  };

  const handleMouseDown = (event: MouseEvent) => handleClickOutside(event);
  const handleTouchStart = (event: TouchEvent) => handleClickOutside(event);

  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('touchstart', handleTouchStart);

  return () => {
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('touchstart', handleTouchStart);
  };
}, [isOpen, onToggle]);

  // Quick action handlers
  const handleQuickRouteToggle = () => {
    onMapViewStateChange({ showRoute: !mapViewState.showRoute });
  };

  const handleQuickAllDaysToggle = () => {
    onMapViewStateChange({ showAllDays: !mapViewState.showAllDays });
  };

  const handleStyleChange = (styleId: string) => {
    onMapViewStateChange({ mapStyle: styleId });
    setShowStylePreview(false);
  };

  const handleFitToRoute = () => {
    // This would integrate with map to fit current route
    console.log('Fitting to route...');
    onToggle();
  };

  const handleScreenshot = () => {
    // This would integrate with map screenshot functionality
    console.log('Taking screenshot...');
    onToggle();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Bản đồ: ${trip.name}`,
        text: `Xem lịch trình ${trip.destination}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onToggle();
  };

  // Current style info
  const currentStyle = mapStyles.find(style => style.id === mapViewState.mapStyle) || mapStyles[0];

  return (
    <div className={`relative ${className}`}>
      {/* Floating Action Button */}
      <button
        ref={triggerRef}
        onClick={onToggle}
        className={`
          w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
          ${isOpen 
            ? 'bg-blue-600 text-white rotate-45 scale-110' 
            : 'bg-white text-gray-700 hover:shadow-2xl hover:scale-105'
          }
          ${mapViewState.followRoute ? 'ring-4 ring-blue-300 ring-opacity-50' : ''}
        `}
        aria-label={isOpen ? "Đóng menu" : "Mở menu điều khiển"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        
        {/* Notification Badge */}
        {(mapViewState.showRoute || mapViewState.followRoute) && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </button>

      {/* Quick Actions Ring (when closed) */}
      {!isOpen && (
        <div className="absolute inset-0">
          {/* Route Toggle */}
          <button
            onClick={handleQuickRouteToggle}
            className={`
              absolute -top-16 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
              ${mapViewState.showRoute 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
            title="Bật/tắt tuyến đường"
          >
            <Route className="w-5 h-5" />
          </button>

          {/* All Days Toggle */}
          <button
            onClick={handleQuickAllDaysToggle}
            className={`
              absolute -top-11 -right-11 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
              ${mapViewState.showAllDays 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
            `}
            title="Xem tất cả ngày"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Route Simulation */}
          {canSimulateRoute && (
            <button
              onClick={onRouteSimulation}
              className={`
                absolute top-1 -right-16 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
                ${mapViewState.followRoute 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
                }
              `}
              title={mapViewState.followRoute ? "Dừng mô phỏng" : "Chạy mô phỏng"}
            >
              {mapViewState.followRoute ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40" />
      )}

      {/* Main Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-20 right-0 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden transform transition-all duration-300 scale-100"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Điều khiển bản đồ</h3>
                <p className="text-blue-100 text-sm">Tùy chỉnh hiển thị</p>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setActiveSection('main')}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeSection === 'main' ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
                <button 
                  onClick={() => setActiveSection('style')}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeSection === 'style' ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
                <button 
                  onClick={() => setActiveSection('settings')}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeSection === 'settings' ? 'bg-white' : 'bg-blue-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Main Controls */}
            {activeSection === 'main' && (
              <div className="space-y-4">
                {/* Toggle Controls */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Hiển thị</h4>
                  
                  {/* Route Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        mapViewState.showRoute ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        <Route className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Tuyến đường</div>
                        <div className="text-xs text-gray-500">Hiển thị đường đi</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onMapViewStateChange({ showRoute: !mapViewState.showRoute })}
                      className={`w-11 h-6 rounded-full relative transition-colors ${
                        mapViewState.showRoute ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        mapViewState.showRoute ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* All Days Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        mapViewState.showAllDays ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">Tất cả ngày</div>
                        <div className="text-xs text-gray-500">Hiển thị toàn bộ lịch trình</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onMapViewStateChange({ showAllDays: !mapViewState.showAllDays })}
                      className={`w-11 h-6 rounded-full relative transition-colors ${
                        mapViewState.showAllDays ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        mapViewState.showAllDays ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">Hành động</h4>
                  
                  {/* Route Simulation */}
                  <button
                    onClick={onRouteSimulation}
                    disabled={!canSimulateRoute}
                    className={`w-full flex items-center justify-center space-x-3 p-4 rounded-xl font-medium text-sm transition-all ${
                      !canSimulateRoute 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : mapViewState.followRoute 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg'
                    }`}
                  >
                    {mapViewState.followRoute ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span>{mapViewState.followRoute ? 'Dừng mô phỏng' : 'Mô phỏng tuyến đường'}</span>
                    {mapViewState.followRoute && <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse" />}
                  </button>

                  {/* Fit to Route */}
                  <button
                    onClick={handleFitToRoute}
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Target className="w-4 h-4" />
                    <span>Fit toàn bộ tuyến</span>
                  </button>
                </div>

                {/* Quick Navigation */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveSection('style')}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Kiểu bản đồ</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="flex-1 flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Cài đặt</span>
                  </button>
                </div>
              </div>
            )}

            {/* Map Style Section */}
            {activeSection === 'style' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Kiểu bản đồ</h4>
                  <button
                    onClick={() => setActiveSection('main')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    ← Quay lại
                  </button>
                </div>

                {/* Current Style */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{currentStyle.preview}</div>
                    <div>
                      <div className="font-medium text-blue-900">{currentStyle.name}</div>
                      <div className="text-sm text-blue-700">Đang sử dụng</div>
                    </div>
                  </div>
                </div>

                {/* Style Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {mapStyles.map(style => {
                    const StyleIcon = style.icon;
                    const isActive = style.id === mapViewState.mapStyle;
                    
                    return (
                      <button
                        key={style.id}
                        onClick={() => handleStyleChange(style.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          isActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="text-lg">{style.preview}</div>
                          <StyleIcon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        </div>
                        <div className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                          {style.name}
                        </div>
                        {isActive && (
                          <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Cài đặt</h4>
                  <button
                    onClick={() => setActiveSection('main')}
                    className="text-blue-600 text-sm font-medium"
                  >
                    ← Quay lại
                  </button>
                </div>

                {/* Export Actions */}
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800 text-sm">Xuất & Chia sẻ</h5>
                  
                  <button
                    onClick={handleScreenshot}
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Chụp ảnh màn hình</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center space-x-3 p-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Share className="w-4 h-4" />
                    <span>Chia sẻ bản đồ</span>
                  </button>
                </div>

                {/* Performance Settings */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-800 text-sm">Hiệu suất</h5>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Chất lượng cao</span>
                    <button className="w-10 h-6 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Hiệu ứng 3D</span>
                    <button className="w-10 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
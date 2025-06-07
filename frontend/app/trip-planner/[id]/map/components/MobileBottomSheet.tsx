// app/trip-planner/[id]/map/components/MobileBottomSheet.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {  
  Clock, MapPin, Star, ChevronDown, ChevronUp, Navigation,
  Utensils, Coffee, Building, Landmark, ShoppingBag, Timer,
  Route, Calendar, MoreHorizontal
} from 'lucide-react';

// Types (reuse from existing components)
interface Place {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  image: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  rating?: number;
  notes?: string;
}

interface Day {
  dayNumber: number;
  date: string;
  places: Place[];
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  days: Day[];
}

interface MobileBottomSheetProps {
  trip: Trip;
  activeDay: number;
  onDayChange: (dayNumber: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  onPlaceSelect: (place: Place) => void;
}

// Place type configuration
const placeTypeConfig = {
  restaurant: { icon: Utensils, color: 'text-red-600 bg-red-100', label: 'Nhà hàng' },
  cafe: { icon: Coffee, color: 'text-amber-600 bg-amber-100', label: 'Quán café' },
  hotel: { icon: Building, color: 'text-blue-600 bg-blue-100', label: 'Khách sạn' },
  tourist_attraction: { icon: Landmark, color: 'text-green-600 bg-green-100', label: 'Địa điểm tham quan' },
  shopping: { icon: ShoppingBag, color: 'text-purple-600 bg-purple-100', label: 'Mua sắm' },
  default: { icon: MapPin, color: 'text-gray-600 bg-gray-100', label: 'Địa điểm' }
};

const getPlaceTypeInfo = (place: Place) => {
  const type = place.type.toLowerCase() as keyof typeof placeTypeConfig;
  return placeTypeConfig[type] || placeTypeConfig.default;
};

// Mobile Place Card Component
const MobilePlaceCard = ({ 
  place, 
  index, 
  onSelect, 
  onNavigate 
}: { 
  place: Place; 
  index: number; 
  onSelect: () => void;
  onNavigate: () => void;
}) => {
  const typeInfo = getPlaceTypeInfo(place);
  const TypeIcon = typeInfo.icon;
  
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm active:shadow-md transition-all"
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        {/* Place Image & Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-lg overflow-hidden">
            {place.image ? (
              <Image
                src={place.image}
                alt={place.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className={`w-full h-full ${typeInfo.color} flex items-center justify-center`}>
                <TypeIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          {/* Order Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
        </div>

        {/* Place Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{place.name}</h4>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">{place.address}</p>
          
          {/* Metadata Row */}
          <div className="flex items-center space-x-4 mb-2">
            {place.startTime && (
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                <span>{place.startTime}</span>
                {place.endTime && <span> - {place.endTime}</span>}
              </div>
            )}
            {place.rating && (
              <div className="flex items-center text-xs text-gray-600">
                <Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
                <span>{place.rating.toFixed(1)}</span>
              </div>
            )}
            {place.duration && (
              <div className="flex items-center text-xs text-gray-600">
                <Timer className="w-3 h-3 mr-1" />
                <span>{Math.floor(place.duration / 60)}h{place.duration % 60 > 0 ? ` ${place.duration % 60}m` : ''}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate();
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Chỉ đường</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      {place.notes && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">{place.notes}</p>
        </div>
      )}
    </div>
  );
};

// Day Summary Component
const DaySummary = ({ day, isActive, onClick }: { 
  day: Day; 
  isActive: boolean; 
  onClick: () => void; 
}) => {
  const totalDuration = day.places.reduce((sum, place) => sum + (place.duration || 0), 0);
  const startTime = day.places[0]?.startTime;
  const endTime = day.places[day.places.length - 1]?.endTime;
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
          Ngày {day.dayNumber}
        </h3>
        <span className={`text-sm px-2 py-1 rounded-full ${
          isActive 
            ? 'bg-blue-200 text-blue-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {day.places.length} địa điểm
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        {new Date(day.date).toLocaleDateString('vi-VN', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        })}
      </p>
      
      {day.places.length > 0 && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-3">
            {startTime && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{startTime} - {endTime || '...'}</span>
              </div>
            )}
            {totalDuration > 0 && (
              <div className="flex items-center">
                <Timer className="w-3 h-3 mr-1" />
                <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
              </div>
            )}
          </div>
        </div>
      )}
    </button>
  );
};

export default function MobileBottomSheet({
  trip,
  activeDay,
  onDayChange,
  isOpen,
  onToggle,
  onPlaceSelect
}: MobileBottomSheetProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'places'>('overview');
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  
  const currentDay = trip.days.find(d => d.dayNumber === activeDay);
  
  // Handle touch drag for natural bottom sheet behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartY || !sheetRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    
    // Only allow dragging down when sheet is open
    if (isOpen && deltaY > 0) {
      const newTransform = Math.min(deltaY, 200);
      sheetRef.current.style.transform = `translateY(${newTransform}px)`;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStartY || !sheetRef.current) return;
    
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - dragStartY;
    
    // Reset transform
    sheetRef.current.style.transform = '';
    
    // Close if dragged down significantly
    if (deltaY > 100 && isOpen) {
      onToggle();
    }
    
    setDragStartY(null);
  };

  const handlePlaceNavigation = (place: Place) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-140px)]'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <button 
            onClick={onToggle}
            className="w-12 h-1.5 bg-gray-300 rounded-full active:bg-gray-400 transition-colors"
          />
        </div>
        
        {/* Collapsed Header */}
        {!isOpen && (
          <div className="px-6 pb-6" onClick={onToggle}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Ngày {activeDay}</h3>
                <p className="text-sm text-gray-600">
                  {currentDay?.places.length || 0} địa điểm • {new Date(currentDay?.date || '').toLocaleDateString('vi-VN', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              </div>
              <ChevronUp className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Expanded Content */}
        {isOpen && (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-xl">Lịch trình chi tiết</h3>
                <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedTab('overview')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === 'overview'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tổng quan
                </button>
                <button
                  onClick={() => setSelectedTab('places')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === 'places'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Địa điểm ({currentDay?.places.length || 0})
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {selectedTab === 'overview' && (
                <div className="p-6 space-y-4">
                  {/* Trip Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {trip.days.reduce((sum, day) => sum + day.places.length, 0)}
                      </div>
                      <div className="text-sm text-blue-700">Tổng địa điểm</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{trip.days.length}</div>
                      <div className="text-sm text-green-700">Số ngày</div>
                    </div>
                  </div>
                  
                  {/* Days Overview */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">Tất cả các ngày</h4>
                    {trip.days.map(day => (
                      <DaySummary
                        key={day.dayNumber}
                        day={day}
                        isActive={day.dayNumber === activeDay}
                        onClick={() => {
                          onDayChange(day.dayNumber);
                          setSelectedTab('places');
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {selectedTab === 'places' && (
                <div className="p-6">
                  {/* Day Selector */}
                  <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                    {trip.days.map(day => (
                      <button
                        key={day.dayNumber}
                        onClick={() => onDayChange(day.dayNumber)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          day.dayNumber === activeDay
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Ngày {day.dayNumber}
                      </button>
                    ))}
                  </div>
                  
                  {/* Places List */}
                  {currentDay && currentDay.places.length > 0 ? (
                    <div className="space-y-4">
                      {currentDay.places.map((place, index) => (
                        <MobilePlaceCard
                          key={place.id}
                          place={place}
                          index={index}
                          onSelect={() => onPlaceSelect(place)}
                          onNavigate={() => handlePlaceNavigation(place)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-900 mb-2">Chưa có địa điểm</h4>
                      <p className="text-sm text-gray-600">Thêm địa điểm vào ngày này để bắt đầu lên kế hoạch</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
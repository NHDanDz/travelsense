// app/trip-planner/[id]/map/components/MobileDayNavigation.tsx
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';

interface Day {
  dayNumber: number;
  date: string;
  places: any[];
}

interface Trip {
  id: string;
  name: string;
  destination: string;
  days: Day[];
}

interface MobileDayNavigationProps {
  trip: Trip;
  activeDay: number;
  onDayChange: (dayNumber: number) => void;
  className?: string;
}


export default function MobileDayNavigation({
  trip,
  activeDay,
  onDayChange,
  className = ""
}: MobileDayNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
    
  // Day colors for visual distinction
  const dayColors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const getDayColor = (dayNumber: number) => {
    return dayColors[(dayNumber - 1) % dayColors.length];
  };

  // Check scroll indicators
  const checkScrollIndicators = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftIndicator(scrollLeft > 0);
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Auto-scroll to active day
  const scrollToActiveDay = (dayNumber: number) => {
    if (!scrollContainerRef.current) return;

    const dayElement = scrollContainerRef.current.querySelector(
      `[data-day="${dayNumber}"]`
    ) as HTMLElement;

    if (dayElement) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const elementRect = dayElement.getBoundingClientRect();
      
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const elementLeft = elementRect.left - containerRect.left + scrollLeft;
      const elementWidth = elementRect.width;
      const containerWidth = containerRect.width;
      
      // Center the element
      const targetScrollLeft = elementLeft - (containerWidth - elementWidth) / 2;
      
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    setIsScrolling(true);
    checkScrollIndicators();
     
  };

  // Manual scroll buttons
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  };

  // Day selection handler
  const handleDaySelect = (dayNumber: number) => {
    onDayChange(dayNumber);
    scrollToActiveDay(dayNumber);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      weekday: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
      day: date.toLocaleDateString('vi-VN', { day: 'numeric' }),
      month: date.toLocaleDateString('vi-VN', { month: 'short' })
    };
  };

  // Calculate trip stats
  const getTripStats = () => {
    const totalPlaces = trip.days.reduce((sum, day) => sum + day.places.length, 0);
    const daysWithPlaces = trip.days.filter(day => day.places.length > 0).length;
    
    return {
      totalPlaces,
      daysWithPlaces,
      totalDays: trip.days.length
    };
  };

  const tripStats = getTripStats();

  // Effects
  useEffect(() => {
    checkScrollIndicators();
    scrollToActiveDay(activeDay);
  }, [activeDay]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkScrollIndicators);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScrollIndicators);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Trip Stats Header */}
      <div className="mb-3 px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {trip.days.length} ngày
                </h3>
                <p className="text-xs text-gray-600">
                  {tripStats.totalPlaces} địa điểm
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                Ngày {activeDay}
              </div>
              <div className="text-xs text-gray-600">
                {trip.days.find(d => d.dayNumber === activeDay)?.places.length || 0} điểm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Container */}
      <div className="relative">
        {/* Left Scroll Indicator */}
        {showLeftIndicator && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
            <button
              onClick={scrollLeft}
              className="ml-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="w-8 h-full bg-gradient-to-r from-white/60 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Right Scroll Indicator */}
        {showRightIndicator && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
            <div className="w-8 h-full bg-gradient-to-l from-white/60 to-transparent pointer-events-none" />
            <button
              onClick={scrollRight}
              className="mr-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}

        {/* Scrollable Day Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-4 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trip.days.map((day) => {
            const isActive = day.dayNumber === activeDay;
            const dateInfo = formatDate(day.date);
            const dayColorClass = getDayColor(day.dayNumber);
            const hasPlaces = day.places.length > 0;

            return (
              <button
                key={day.dayNumber}
                data-day={day.dayNumber}
                onClick={() => handleDaySelect(day.dayNumber)}
                className={`
                  flex-shrink-0 relative group transition-all duration-200
                  ${isActive ? 'scale-105' : 'hover:scale-102'}
                `}
              >
                {/* Day Card */}
                <div className={`
                  w-20 p-3 rounded-2xl border-2 transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600 border-blue-600 shadow-lg' 
                    : 'bg-white/90 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg'
                  }
                  ${!hasPlaces ? 'opacity-75' : ''}
                `}>
                  {/* Day Number */}
                  <div className={`
                    text-center mb-2
                    ${isActive ? 'text-white' : 'text-gray-900'}
                  `}>
                    <div className="text-lg font-bold">
                      {day.dayNumber}
                    </div>
                    <div className="text-xs font-medium opacity-75">
                      Ngày
                    </div>
                  </div>

                  {/* Date Info */}
                  <div className={`
                    text-center mb-2 text-xs
                    ${isActive ? 'text-blue-100' : 'text-gray-600'}
                  `}>
                    <div className="font-medium">{dateInfo.weekday}</div>
                    <div>{dateInfo.day} {dateInfo.month}</div>
                  </div>

                  {/* Places Count */}
                  <div className={`
                    flex items-center justify-center space-x-1 text-xs
                    ${isActive ? 'text-blue-100' : 'text-gray-600'}
                  `}>
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">{day.places.length}</span>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full" />
                  )}

                  {/* Day Color Indicator */}
                  <div className={`
                    absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                    ${dayColorClass}
                    ${isActive ? 'ring-2 ring-blue-300' : ''}
                  `} />
                </div>

                {/* Ripple Effect */}
                <div className={`
                  absolute inset-0 rounded-2xl transition-opacity duration-200
                  ${isActive ? 'bg-blue-600 opacity-20 animate-ping' : 'opacity-0'}
                `} />
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator Dots */}
        {trip.days.length > 3 && (
          <div className="flex justify-center mt-3 space-x-1">
            {trip.days.map((_, index) => {
              const isInView = Math.abs(index + 1 - activeDay) <= 1;
              return (
                <div
                  key={index}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-200
                    ${isInView ? 'bg-blue-600' : 'bg-gray-300'}
                    ${index + 1 === activeDay ? 'w-4' : ''}
                  `}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-3 px-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleDaySelect(1)}
            className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Ngày đầu
          </button>
          <button
            onClick={() => handleDaySelect(trip.days.length)}
            className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            Ngày cuối
          </button>
          {activeDay > 1 && (
            <button
              onClick={() => handleDaySelect(activeDay - 1)}
              className="py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              ← Trước
            </button>
          )}
          {activeDay < trip.days.length && (
            <button
              onClick={() => handleDaySelect(activeDay + 1)}
              className="py-2 px-3 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors"
            >
              Sau →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
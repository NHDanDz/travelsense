// app/api/ai/generate-itinerary/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8089';

interface TripRequest {
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  preferences: string;
  tags: string[];
  budget?: number;
  travelers: number;
  language: string;
}

interface TripResponse {
  tripName: string;
  destination: string;
  duration: number;
  estimatedBudget?: number;
  itinerary: Array<{
    day: number;
    date?: string;
    theme?: string;
    activities: Array<{
      name: string;
      time: string;
      duration?: number;
      location: {
        name: string;
        address?: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
      };
      type?: string;
      description?: string;
      estimatedCost?: number;
      rating?: number;
      notes?: string;
    }>;
  }>;
}

// Helper functions
function buildStandardPrompt(request: TripRequest): string {
  const startDate = new Date(request.startDate);
  
  return `Tạo lịch trình du lịch ${request.destination} ${request.duration} ngày.

THÔNG TIN CHUYẾN ĐI:
Điểm đến: ${request.destination}
Ngày bắt đầu: ${request.startDate}
Ngày kết thúc: ${request.endDate}
Số ngày: ${request.duration}
Số người: ${request.travelers}
Ngân sách: ${request.budget ? formatCurrency(request.budget) : 'Không giới hạn'}
Sở thích: ${request.preferences || 'Không có yêu cầu đặc biệt'}
Thể loại: ${request.tags.length > 0 ? request.tags.join(', ') : 'Chung'}

YÊU CẦU ĐỊNH DẠNG JSON CHUẨN DATABASE:
{
  "tripName": "tên chuyến đi phù hợp",
  "destination": "${request.destination}",
  "duration": ${request.duration},
  "estimatedBudget": tổng ngân sách dự kiến (VND),
  "itinerary": [
    {
      "day": 1,
      "date": "${formatDate(startDate, 0)}",
      "theme": "chủ đề của ngày",
      "activities": [
        {
          "name": "tên hoạt động cụ thể",
          "time": "${formatDate(startDate, 0)}T09:00:00+07:00",
          "duration": 120,
          "location": {
            "name": "tên địa điểm chính xác",
            "address": "địa chỉ đầy đủ",
            "coordinates": {
              "latitude": 21.0285,
              "longitude": 105.8542
            }
          },
          "type": "restaurant|tourist_attraction|cafe|hotel|shopping",
          "description": "mô tả chi tiết hoạt động",
          "estimatedCost": chi phí dự kiến (VND),
          "rating": 4.5,
          "notes": "lưu ý thêm"
        }
      ]
    }
  ]
}

QUAN TRỌNG - ĐỊNH DẠNG DỮ LIỆU:
- time: Sử dụng định dạng ISO-8601 DateTime với múi giờ +07:00
- coordinates: Sử dụng tọa độ thực của ${request.destination}
- type: CHỈ sử dụng: tourist_attraction, restaurant, cafe, hotel, shopping
- duration: Thời gian tính bằng phút (số nguyên)
- rating: Số thập phân từ 1.0 đến 5.0
- estimatedCost: Số nguyên (VND), không có dấu phẩy
- address: Địa chỉ đầy đủ, cụ thể tại ${request.destination}

CHỈ trả về JSON hợp lệ, không có markdown, không có text thừa.`;
}

function formatDate(date: Date, addDays: number = 0): string {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + addDays);
  return newDate.toISOString().split('T')[0];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
}

async function createNewSession(): Promise<string> {
  const response = await fetch(`${BACKEND_URL}/api/v1/chat/_new_chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }

  const data = await response.json();
  return data.data.session_id;
}

function parseAndValidateResponse(responseText: string, originalRequest: TripRequest): TripResponse {
  try {
    // Làm sạch response
    let jsonString = responseText.trim();
    
    // Loại bỏ các định dạng markdown
    const patterns = [
      /```json\s*\n?([\s\S]*?)\n?```/i,
      /```\s*\n?([\s\S]*?)\n?```/i,
      /`([\s\S]*?)`/,
      /^[^{]*({[\s\S]*})[^}]*$/
    ];
    
    for (const pattern of patterns) {
      const match = jsonString.match(pattern);
      if (match && match[1]) {
        jsonString = match[1].trim();
        break;
      }
    }

    // Parse JSON
    const parsed = JSON.parse(jsonString);
    
    // Validate và sửa cấu trúc
    return validateAndFixStructure(parsed, originalRequest);
    
  } catch (parseError) {
    console.error('Parse error:', parseError);
    console.error('Raw response:', responseText);
    
    // Fallback structure
    return createFallbackResponse(originalRequest);
  }
}

interface DayData {
  day: number;
  date: string;
  theme: string;
  activities: Array<{
    name: string;
    time: string;
    duration: number;
    location: {
      name: string;
      address: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    type: string;
    description: string;
    estimatedCost: number;
    rating: number;
    notes: string;
  }>;
}

function validateAndFixStructure(data: any, request: TripRequest): TripResponse {
  const result: TripResponse = {
    tripName: data.tripName || `Khám phá ${request.destination}`,
    destination: data.destination || request.destination,
    duration: data.duration || request.duration,
    estimatedBudget: data.estimatedBudget || undefined,
    itinerary: []
  };

  // Validate itinerary
  if (data.itinerary && Array.isArray(data.itinerary)) {
    const startDate = new Date(request.startDate);
    
    data.itinerary.forEach((day: any, index: number) => {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + index);
      
      const dayData: DayData = {
        day: day.day || index + 1,
        date: day.date || dayDate.toISOString().split('T')[0],
        theme: day.theme || `Ngày ${index + 1}`,
        activities: []
      };

      // Validate activities
      if (day.activities && Array.isArray(day.activities)) {
        day.activities.forEach((activity: any) => {
          if (activity.name && activity.location) {
            const validatedActivity = {
              name: activity.name,
              time: activity.time || "09:00",
              duration: activity.duration || 60,
              location: {
                name: activity.location.name || "Địa điểm",
                address: activity.location.address || activity.location.name || "",
                coordinates: {
                  latitude: activity.location.coordinates?.latitude || 0,
                  longitude: activity.location.coordinates?.longitude || 0
                }
              },
              type: activity.type || "tourist_attraction",
              description: activity.description || "",
              estimatedCost: activity.estimatedCost || 0,
              rating: activity.rating || 4,
              notes: activity.notes || ""
            };
            
            dayData.activities.push(validatedActivity);
          }
        });
      }

      result.itinerary.push(dayData);
    });
  }

  // Đảm bảo có ít nhất 1 ngày
  if (result.itinerary.length === 0) {
    const startDate = new Date(request.startDate);
    for (let i = 0; i < request.duration; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      
      result.itinerary.push({
        day: i + 1,
        date: dayDate.toISOString().split('T')[0],
        theme: `Khám phá ${request.destination}`,
        activities: []
      });
    }
  }

  return result;
}

function createFallbackResponse(request: TripRequest): TripResponse {
  const startDate = new Date(request.startDate);
  const itinerary: Array<{
    day: number;
    date: string;
    theme: string;
    activities: Array<{
      name: string;
      time: string;
      duration: number;
      location: {
        name: string;
        address: string;
        coordinates: { latitude: number; longitude: number };
      };
      type: string;
      description: string;
      estimatedCost: number;
      rating: number;
      notes: string;
    }>;
  }> = [];

  for (let i = 0; i < request.duration; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);
    
    itinerary.push({
      day: i + 1,
      date: dayDate.toISOString().split('T')[0],
      theme: `Ngày ${i + 1} - Khám phá ${request.destination}`,
      activities: [{
        name: `Khám phá ${request.destination}`,
        time: "09:00",
        duration: 480, // 8 tiếng
        location: {
          name: request.destination,
          address: request.destination,
          coordinates: { latitude: 0, longitude: 0 }
        },
        type: "tourist_attraction",
        description: "Tự do khám phá địa điểm địa phương",
        estimatedCost: 500000,
        rating: 4,
        notes: "Lịch trình sẽ được cập nhật chi tiết sau"
      }]
    });
  }

  return {
    tripName: `Khám phá ${request.destination}`,
    destination: request.destination,
    duration: request.duration,
    estimatedBudget: request.budget,
    itinerary
  };
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const body: TripRequest = await request.json();
    
    // Validate required fields
    if (!body.destination || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: destination, startDate, endDate' },
        { status: 400 }
      );
    }

    // Create new chat session
    const sessionId = await createNewSession();
    console.log('Created session:', sessionId);

    // Build prompt
    const prompt = buildStandardPrompt(body);
    
    console.log('Sending request to backend:', body);
    
    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/_chat_complete`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        content: prompt,
        metadata: {
          requestType: "trip_planning",
          expectedFormat: "structured_json",
          ...body
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error:', response.status, errorText);
      throw new Error(`Backend API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response:', data);
    
    // Parse and validate response
    const parsedResponse = parseAndValidateResponse(data.data.response, body);
    
    return NextResponse.json({
      success: true,
      data: parsedResponse
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate itinerary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ 
    message: 'AI Itinerary Generator API is running',
    timestamp: new Date().toISOString()
  });
}
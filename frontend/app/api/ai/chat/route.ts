// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8089';

interface ChatRequest {
  session_id: string;
  content: string;
  metadata?: any;
}

interface NewSessionRequest {
  // Có thể thêm các thông tin khởi tạo nếu cần
}

// API tạo session chat mới
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'new_session') {
      return await handleNewSession();
    } else if (action === 'send_message') {
      return await handleSendMessage(request);
    } else if (action === 'save_message') {
      return await handleSaveMessage(request);
    } else {
      // Default action - send message
      return await handleSendMessage(request);
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Tạo session mới
async function handleNewSession(): Promise<NextResponse> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/_new_chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        session_id: data.data.session_id
      }
    });
  } catch (error) {
    console.error('Error creating new session:', error);
    throw error;
  }
}

// Gửi message và stream response
async function handleSendMessage(request: NextRequest): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    
    if (!body.session_id || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, content' },
        { status: 400 }
      );
    }

    console.log('Sending message to backend:', {
      session_id: body.session_id,
      content: body.content.substring(0, 100) + '...'
    });

    // Gọi backend API
    const response = await fetch(`${BACKEND_URL}/api/v1/chat/_chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: body.session_id,
        content: body.content,
        metadata: body.metadata
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.status}`);
    }

    // Kiểm tra nếu response là streaming
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/stream') || contentType?.includes('text/plain')) {
      // Trả về streaming response
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/stream-events',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Trả về JSON response thông thường
      const data = await response.json();
      return NextResponse.json({
        success: true,
        data: data
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Lưu message
async function handleSaveMessage(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    if (!body.session_id || !body.role || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, role, content' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/v1/chat/_save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: body.session_id,
        role: body.role,
        content: body.content
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error saving message:', error);
    // Don't throw here as message saving is not critical
    return NextResponse.json({
      success: false,
      error: 'Failed to save message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API is running',
    timestamp: new Date().toISOString(),
    backend_url: BACKEND_URL
  });
}
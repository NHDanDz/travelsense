// services/chatService.ts
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'travel';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  session_id: string;
  messages: ChatMessage[];
}

export class ChatService {
  private static readonly API_BASE_URL = '/api/ai/chat'; // Thay đổi để gọi frontend API
  private static lastKnownUserId: string | null = null;
  
  // Tạo session chat mới
  static async createNewSession(): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?action=new_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create chat session: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data?.session_id) {
        throw new Error('Invalid response format from chat API');
      }

      return data.data.session_id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  // Gửi message và nhận streaming response
  static async sendMessage(
    sessionId: string, 
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?action=send_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          content: content,
          metadata: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to send message: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      // Kiểm tra content type để xử lý streaming hoặc JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/stream') || contentType?.includes('text/plain')) {
        // Handle streaming response
        await this.handleStreamingResponse(response, onChunk, onComplete, onError);
      } else {
        // Handle JSON response
        const data = await response.json();
        if (data.success && data.data) {
          // Nếu backend trả về response đầy đủ (không streaming)
          if (typeof data.data === 'string') {
            onChunk(data.data);
          } else if (data.data.response) {
            onChunk(data.data.response);
          } else if (data.data.content) {
            onChunk(data.data.content);
          }
          onComplete();
        } else {
          throw new Error(data.message || 'Invalid response from backend');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  // Xử lý streaming response
  private static async handleStreamingResponse(
    response: Response,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Xử lý buffer cuối cùng nếu có
          if (buffer.trim()) {
            this.processStreamChunk(buffer.trim(), onChunk);
          }
          onComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        
        // Xử lý từng data chunk (có thể có nhiều chunk trong một lần đọc)
        const dataChunks = buffer.split('data:');
        
        // Giữ lại phần cuối chưa hoàn chỉnh
        buffer = dataChunks.pop() || '';
        
        // Xử lý các chunk hoàn chỉnh
        for (const dataChunk of dataChunks) {
          if (dataChunk.trim()) {
            this.processStreamChunk(dataChunk.trim(), onChunk);
          }
        }
      }
    } catch (error) {
      console.error('Error handling streaming response:', error);
      onError(error instanceof Error ? error : new Error('Streaming error'));
    }
  }

  // Xử lý chunk response
  private static processStreamChunk(dataStr: string, onChunk: (chunk: string) => void): void {
    // Remove any leading/trailing data: prefixes
    const cleanedData = dataStr.replace(/^data:\s*/, '').replace(/data:\s*$/, '').trim();
    
    if (!cleanedData || cleanedData === 'data:' || cleanedData === '' || cleanedData === '[DONE]') {
      return;
    }

    try {
      const parsed = JSON.parse(cleanedData);
      
      // Kiểm tra các format response khác nhau
      if (parsed.data && typeof parsed.data === 'string') {
        // Format: {"message": "", "code": 0, "data": "content"}
        onChunk(parsed.data);
      } else if (parsed.content) {
        // Format backup: {"content": "..."}
        onChunk(parsed.content);
      } else if (parsed.text) {
        // Format backup: {"text": "..."}
        onChunk(parsed.text);
      } else if (parsed.response) {
        // Format backup: {"response": "..."}
        onChunk(parsed.response);
      } else if (typeof parsed === 'string') {
        // Nếu parsed result là string
        onChunk(parsed);
      } else {
        console.log('Unknown streaming chunk format:', parsed);
      }
    } catch (e) {
      // Nếu không parse được JSON, có thể là plain text
      if (cleanedData && cleanedData !== 'null' && cleanedData !== 'undefined') {
        console.log('Non-JSON chunk, treating as text:', cleanedData);
        onChunk(cleanedData);
      }
    }
  }

  // Lưu message history
  static async saveMessage(sessionId: string, role: string, content: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?action=save_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          role: role,
          content: content,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.warn(`Failed to save message: ${response.status}`);
        return; // Don't throw as this is not critical
      }

      const data = await response.json();
      if (!data.success) {
        console.warn('Failed to save message:', data.message);
      }
    } catch (error) {
      console.error('Error saving message:', error);
      // Don't throw here as this is not critical
    }
  }

  // Test connection to frontend API
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Frontend API test failed: ${response.status}`);
        return false;
      }

      const data = await response.json();
      console.log('Frontend API test successful:', data);
      return true;
    } catch (error) {
      console.error('Frontend API test error:', error);
      return false;
    }
  }

  // Local storage helpers với user-specific keys (không thay đổi)
  static saveSessionToLocal(session: ChatSession): void {
    try {
      const userId = this.getCurrentUserId();
      const sessions = this.getLocalSessions();
      const existingIndex = sessions.findIndex(s => s.session_id === session.session_id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      // Keep only last 10 sessions per user
      if (sessions.length > 10) {
        sessions.splice(0, sessions.length - 10);
      }
      
      const storageKey = userId ? `chat_sessions_${userId}` : 'chat_sessions';
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session to local storage:', error);
    }
  }

  static getLocalSessions(): ChatSession[] {
    try {
      const userId = this.getCurrentUserId();
      const storageKey = userId ? `chat_sessions_${userId}` : 'chat_sessions';
      const stored = localStorage.getItem(storageKey);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions.map((session: ChatSession) => ({
        ...session,
        messages: session.messages.map((message: ChatMessage) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading sessions from local storage:', error);
      return [];
    }
  }

  static getLocalSession(sessionId: string): ChatSession | null {
    try {
      const sessions = this.getLocalSessions();
      const session = sessions.find(s => s.session_id === sessionId);
      if (!session) return null;
      
      return {
        ...session,
        messages: session.messages.map((message: ChatMessage) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }))
      };
    } catch (error) {
      console.error('Error getting session from local storage:', error);
      return null;
    }
  }

  static clearLocalSessions(): void {
    try {
      const userId = this.getCurrentUserId();
      const storageKey = userId ? `chat_sessions_${userId}` : 'chat_sessions';
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing local sessions:', error);
    }
  }

  // Helper method để lấy current user ID
  private static getCurrentUserId(): string | null {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData.username || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  }

  // Method để clear sessions khi logout
  static clearAllUserSessions(): void {
    try {
      // Clear current user sessions
      this.clearLocalSessions();
      
      // Optionally clean up orphaned sessions
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat_sessions_')) {
          // You might want to keep these or implement a cleanup strategy
          // localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all user sessions:', error);
    }
  }

  // Method để migrate từ old format sang user-specific format
  static migrateToUserSpecificSessions(): void {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return;

      const oldSessions = localStorage.getItem('chat_sessions');
      const newStorageKey = `chat_sessions_${userId}`;
      
      if (oldSessions && !localStorage.getItem(newStorageKey)) {
        // Migrate old sessions to current user
        localStorage.setItem(newStorageKey, oldSessions);
        localStorage.removeItem('chat_sessions');
      }
    } catch (error) {
      console.error('Error migrating sessions:', error);
    }
  }

  // Getter và setter cho lastKnownUserId
  static getLastKnownUserId(): string | null {
    return this.lastKnownUserId;
  }

  static setLastKnownUserId(userId: string | null): void {
    this.lastKnownUserId = userId;
  }
}
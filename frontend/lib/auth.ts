export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
}

export class AuthService {
  // Key để lưu user trong storage
  private static readonly USER_STORAGE_KEY = 'user';

  // Kiểm tra xem có đang chạy trong môi trường browser không
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Lấy current user từ localStorage hoặc sessionStorage
  static getCurrentUser(): User | null {
    // ✅ Kiểm tra môi trường browser trước
    if (!this.isBrowser()) {
      return null;
    }

    try {
      // ✅ Check localStorage first (persistent login)
      let userData = localStorage.getItem(this.USER_STORAGE_KEY);
      
      // ✅ If not found, check sessionStorage (session-only login)
      if (!userData) {
        userData = sessionStorage.getItem(this.USER_STORAGE_KEY);
      }
      
      if (!userData) {
        return null;
      }
      
      const user: User = JSON.parse(userData);
      
      // Kiểm tra định dạng user
      if (!user.id || !user.username || !user.email) {
        console.warn('Invalid user data in storage');
        this.logout(); // Xóa dữ liệu không hợp lệ
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      this.logout(); // Xóa dữ liệu nếu lỗi
      return null;
    }
  }

  // Lấy user ID
  static getUserId(): string {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user.id;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Lưu user vào storage sau khi đăng nhập
  static login(user: User, rememberMe: boolean = false): void {
    // ✅ Kiểm tra môi trường browser trước
    if (!this.isBrowser()) {
      console.warn('Cannot save user data: not in browser environment');
      return;
    }

    try {
      const userJson = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem(this.USER_STORAGE_KEY, userJson);
      } else {
        sessionStorage.setItem(this.USER_STORAGE_KEY, userJson);
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  }

  // Xóa user khỏi cả localStorage và sessionStorage khi đăng xuất
  static logout(): void {
    // ✅ Kiểm tra môi trường browser trước
    if (!this.isBrowser()) {
      return;
    }

    try {
      localStorage.removeItem(this.USER_STORAGE_KEY);
      sessionStorage.removeItem(this.USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Tạo user mới (cho test hoặc đăng ký)
  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<User> {
    // TODO: Thay bằng API call thực tế tới backend
    console.log('Creating user:', userData);
    
    // Tạo user giả lập để test
    const newUser: User = {
      id: `user_${Date.now()}`, // Tạo ID tạm thời
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
    };

    // Lưu user mới vào storage (giả lập đăng nhập)
    this.login(newUser, false); // Default to session-only for new registrations
    return newUser;
  }

  // ✅ Phương thức mới: Khởi tạo auth state sau khi component mount
  static initializeAuth(callback?: (user: User | null) => void): void {
    if (!this.isBrowser()) {
      return;
    }

    // Gọi callback với current user (nếu có)
    const user = this.getCurrentUser();
    callback?.(user);
  }
}
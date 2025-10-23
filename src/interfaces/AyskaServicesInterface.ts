// Service interfaces following Interface Segregation Principle

export interface IStorageProvider {
  setItem<T>(_key: string, _value: T): Promise<void>;
  getItem<T>(_key: string): Promise<T | null>;
  removeItem(_key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface IAuthStorage {
  saveAuthToken(_token: string): Promise<void>;
  getAuthToken(): Promise<string | null>;
  removeAuthToken(): Promise<void>;
  saveUserData(_userData: any): Promise<void>;
  getUserData(): Promise<any | null>;
}

export interface ICacheStorage {
  cacheData(_key: string, _data: any, _expiryInMinutes?: number): Promise<void>;
  getCachedData<T>(_key: string): Promise<T | null>;
}

export interface IDraftStorage {
  saveDraftData(_key: string, _data: any): Promise<void>;
  getDraftData(_key: string): Promise<any | null>;
  removeDraftData(_key: string): Promise<void>;
}

export interface ISettingsStorage {
  saveSettings(_settings: any): Promise<void>;
  getSettings(): Promise<any | null>;
}

export interface IHttpClient {
  get<T>(_url: string, _config?: any): Promise<T>;
  post<T>(_url: string, _data?: any, _config?: any): Promise<T>;
  put<T>(_url: string, _data?: any, _config?: any): Promise<T>;
  patch<T>(_url: string, _data?: any, _config?: any): Promise<T>;
  delete<T>(_url: string, _config?: any): Promise<T>;
}

export interface IHttpInterceptor {
  onRequest?(_config: any): any;
  onResponse?(_response: any): any;
  onError?(_error: any): any;
}

export interface INotificationsService {
  // Local data operations
  fetchNotifications(_userId: string): Promise<Notification[]>;
  markNotificationRead(_notificationId: string): Promise<void>;
  clearAllNotifications(_userId: string): Promise<void>;

  // Future FCM/Expo integration hooks
  registerForPushNotifications?(): Promise<string>;
  unregisterPushNotifications?(): Promise<void>;
}

export interface Notification {
  id: string;
  userId: string;
  userRole: 'admin' | 'employee';
  type:
    | 'visit'
    | 'assignment'
    | 'attendance'
    | 'system'
    | 'alert'
    | 'checkin'
    | 'roundup';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionData?: {
    targetId?: string;
    route?: string;
    visitId?: string;
    employeeId?: string;
    doctorId?: string;
    attendanceId?: string;
    assignmentId?: string;
  };
}

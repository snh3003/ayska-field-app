// Notification API Types - Complete type definitions for notification system
// Covers all notification-related API endpoints and responses

// Notification model
export interface Notification {
  id: string;
  user_id: string;
  user_role: 'ADMIN' | 'EMPLOYEE';
  type: 'ASSIGNMENT' | 'CHECKIN' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  actionable: boolean;
  action_data?: {
    assignment_id?: string;
    doctor_name?: string;
    route?: string;
  };
  timestamp: string;
  created_at: string;
}

// Notification list response with pagination
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  page: number;
  size: number;
  has_next: boolean;
}

// Notification query parameters
export interface NotificationQueryParams {
  page?: number;
  size?: number;
  type?: string;
  read?: boolean;
  actionable?: boolean;
}

// Notification statistics response
export interface NotificationStatsResponse {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_by_type: Record<string, number>;
  recent_notifications: Notification[];
}

// Bulk mark as read request
export interface NotificationBulkReadRequest {
  notification_ids: string[];
}

// Bulk mark as read response
export interface NotificationBulkReadResponse {
  message: string;
  updated_count: number;
  notification_ids: string[];
}

// Mark all as read response
export interface NotificationMarkAllReadResponse {
  message: string;
  notification_id: string;
  read: boolean;
}

// Notification service interface
export interface INotificationService {
  getNotifications(
    _params?: NotificationQueryParams
  ): Promise<NotificationListResponse>;
  getNotificationById(_id: string): Promise<Notification>;
  getNotificationStats(): Promise<NotificationStatsResponse>;
  markNotificationAsRead(_id: string): Promise<void>;
  bulkMarkAsRead(
    _data: NotificationBulkReadRequest
  ): Promise<NotificationBulkReadResponse>;
  markAllAsRead(): Promise<NotificationMarkAllReadResponse>;
  deleteNotification(_id: string): Promise<void>;
}

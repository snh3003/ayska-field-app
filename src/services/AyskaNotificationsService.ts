// Notifications Service - Complete API integration for notification system
// Implements all notification operations with backend API calls

import { HttpClient } from '../api/HttpClient';
import { ApiErrorHandler } from '../utils/AyskaApiErrorHandlerUtil';
import {
  INotificationService,
  Notification,
  NotificationBulkReadRequest,
  NotificationBulkReadResponse,
  NotificationListResponse,
  NotificationMarkAllReadResponse,
  NotificationQueryParams,
  NotificationStatsResponse,
} from '../types/AyskaNotificationApiType';

export class NotificationsService implements INotificationService {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Get notifications with pagination and filters
   */
  async getNotifications(
    params?: NotificationQueryParams
  ): Promise<NotificationListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.size) queryParams.append('size', params.size.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.read !== undefined)
        queryParams.append('read', params.read.toString());
      if (params?.actionable !== undefined)
        queryParams.append('actionable', params.actionable.toString());

      const queryString = queryParams.toString();
      const endpoint = `/notifications${queryString ? `?${queryString}` : ''}`;

      const response =
        await this.httpClient.get<NotificationListResponse>(endpoint);
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    try {
      const response = await this.httpClient.get<Notification>(
        `/notifications/${id}`
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStatsResponse> {
    try {
      const response = await this.httpClient.get<NotificationStatsResponse>(
        '/notifications/stats'
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(id: string): Promise<void> {
    try {
      await this.httpClient.patch(`/notifications/${id}/read`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Bulk mark notifications as read
   */
  async bulkMarkAsRead(
    data: NotificationBulkReadRequest
  ): Promise<NotificationBulkReadResponse> {
    try {
      const response = await this.httpClient.post<NotificationBulkReadResponse>(
        '/notifications/bulk-read',
        data
      );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<NotificationMarkAllReadResponse> {
    try {
      const response =
        await this.httpClient.post<NotificationMarkAllReadResponse>(
          '/notifications/mark-all-read'
        );
      return response;
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    try {
      await this.httpClient.delete(`/notifications/${id}`);
    } catch (error) {
      throw ApiErrorHandler.mapError(error);
    }
  }
}

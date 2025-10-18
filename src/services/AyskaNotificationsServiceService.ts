import { INotificationsService } from '../interfaces/AyskaServicesInterface';
import { INotificationsRepository } from '../interfaces/AyskaRepositoriesInterface';
import { Notification } from '../types';

export class NotificationsService implements INotificationsService {
  constructor(private _notificationsRepository: INotificationsRepository) {}

  async fetchNotifications(userId: string): Promise<Notification[]> {
    return this._notificationsRepository.getNotificationsByUserId(userId);
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    return this._notificationsRepository.markAsRead(notificationId);
  }

  async clearAllNotifications(userId: string): Promise<void> {
    return this._notificationsRepository.markAllAsRead(userId);
  }

  // Future FCM/Expo integration hooks
  // TODO: Implement when integrating with Expo Notifications or FCM
  async registerForPushNotifications?(): Promise<string> {
    // Integration point for Expo Notifications:
    // 1. Request notification permissions
    // 2. Get push token
    // 3. Register token with backend
    // 4. Set up notification handlers
    throw new Error('Push notifications not yet implemented');
  }

  async unregisterPushNotifications?(): Promise<void> {
    // Integration point for Expo Notifications:
    // 1. Unregister push token from backend
    // 2. Clear local notification handlers
    // 3. Remove notification permissions
    throw new Error('Push notifications not yet implemented');
  }
}

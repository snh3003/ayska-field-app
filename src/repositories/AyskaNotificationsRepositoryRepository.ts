import { INotificationsRepository } from '../interfaces/AyskaRepositoriesInterface';
import { LocalDataRepository } from './AyskaLocalDataRepositoryRepository';
import { Notification } from '../types';

export class NotificationsRepository implements INotificationsRepository {
  constructor(private _dataRepository: LocalDataRepository<any>) {}

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    const allNotifications = await this._dataRepository.getAll('notifications');
    return allNotifications
      .filter((notification: Notification) => notification.userId === userId)
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this._dataRepository.update('notifications', notificationId, {
      read: true,
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications =
      await this._dataRepository.getAll('notifications');
    const unreadNotifications = userNotifications.filter(
      (notification: Notification) =>
        notification.userId === userId && !notification.read
    );

    for (const notification of unreadNotifications) {
      await this._dataRepository.update('notifications', notification.id, {
        read: true,
      });
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications =
      await this._dataRepository.getAll('notifications');
    const unreadNotifications = userNotifications.filter(
      (notification: Notification) =>
        notification.userId === userId && !notification.read
    );
    return unreadNotifications.length;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this._dataRepository.delete('notifications', notificationId);
  }
}

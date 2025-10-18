import {
  INotificationObserver,
  INotificationSubject,
} from '../interfaces/AyskaPatternsInterface';
import { Notification } from '../types/AyskaModelsType';

export class NotificationObserverService implements INotificationSubject {
  private observers: INotificationObserver[] = [];

  attach(observer: INotificationObserver): void {
    this.observers.push(observer);
  }

  detach(observer: INotificationObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) this.observers.splice(index, 1);
  }

  notify(notification: Notification): void {
    for (const observer of this.observers) {
      observer.update(notification);
    }
  }
}

// Concrete Observers
export class AdminDashboardObserver implements INotificationObserver {
  update(notification: Notification): void {
    // Update admin dashboard state
    if (__DEV__)
      console.log('[Admin Dashboard] New notification:', notification.title);
  }
}

export class EmployeeFeedObserver implements INotificationObserver {
  update(notification: Notification): void {
    // Update employee notification feed
    if (__DEV__)
      console.log('[Employee Feed] New notification:', notification.title);
  }
}

export class PushNotificationObserver implements INotificationObserver {
  update(notification: Notification): void {
    // Send push notification (future: FCM integration)
    if (__DEV__) console.log('[Push] Sending:', notification.title);
  }
}

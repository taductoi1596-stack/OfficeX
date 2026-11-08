import { injectable } from 'tsyringe';
import { Notification } from 'electron';

@injectable()
export class NotificationService {
  public show(title: string, body: string): void {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    } else {
      console.warn('Notifications are not supported on this system');
    }
  }
}

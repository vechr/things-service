import { NotificationEmail } from '@/modules/notification-emails/domain/entities/notification-email.entity';

export class EventSendEmailDto {
  constructor(
    public readonly notificationEmails: NotificationEmail[],
    public readonly body: string,
    public readonly htmlBodyContent: string,
  ) {}

  toString() {
    return JSON.stringify({
      notificationEmails: this.notificationEmails,
      body: this.body,
      htmlBodyContent: this.htmlBodyContent,
    });
  }
}

import { Notification } from "../notifications/Notification";

export interface MentionNotificationParams {
  recipientEmail: string;
  recipientName: string;
  taggerName: string;
  topicName: string;
  spaceId: string;
  roomId: string;
  topicId: string;
}

export class MentionNotification implements Notification {
  constructor(private params: MentionNotificationParams) {}

  getContent(): string {
    const link = `${process.env.FRONTEND_URL}/space/${this.params.spaceId}/${this.params.roomId}/${this.params.topicId}`;
    return `Hi ${this.params.recipientName}!<br >
${this.params.taggerName} has tagged you in ${this.params.topicName}. To read the message, simply click the following link: <a href="${link}">${link}</a>
`;
  }

  getSubject(): string {
    return `${this.params.taggerName} has tagged you in ${this.params.topicName}`;
  }

  getRecipientEmail(): string {
    return this.params.recipientEmail;
  }
}

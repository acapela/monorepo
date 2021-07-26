import { Notification } from "../notifications/Notification";

export interface MentionNotificationParams {
  recipientEmail: string;
  recipientName: string;
  authorName: string;
  topicName: string;
  spaceId: string;
  roomId: string;
  topicId: string;
}

export class MentionNotification implements Notification {
  constructor(private params: MentionNotificationParams) {}

  getTopicLink(): string {
    return `${process.env.FRONTEND_URL}/space/${this.params.spaceId}/${this.params.roomId}/${this.params.topicId}`;
  }

  getContent(): string {
    const link = this.getTopicLink();
    return `Hi ${this.params.recipientName}!<br >
${this.params.authorName} has tagged you in ${this.params.topicName}. To read the message, simply click the following link: <a href="${link}">${link}</a>
`;
  }

  getSubject(): string {
    return `${this.params.authorName} has tagged you in ${this.params.topicName}`;
  }

  getRecipientEmail(): string {
    return this.params.recipientEmail;
  }
}

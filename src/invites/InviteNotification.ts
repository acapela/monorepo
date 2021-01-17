import { Notification } from "../notifications/Notification";
import config from "../config";

export interface InviteNotificationParams {
  recipientEmail: string;
  inviterName: string;
  roomName: string;
  inviteCode: string;
}

export class InviteNotification implements Notification {
  constructor(private params: InviteNotificationParams) {}

  getContent(): string {
    const link = `${config.get("app.url")}/invites/${this.params.inviteCode}`;
    return `Hey!<br >
${this.params.inviterName} has invited you to collaborate on ${this.params.roomName} using acapela, a tool for asynchronous collaboration.
Follow this link to join the discussion: <a href="${link}">${link}</a>
`;
  }

  getSubject(): string {
    return `${this.params.inviterName} has invited you to collaborate on ${this.params.roomName}`;
  }

  getRecipientEmail(): string {
    return this.params.recipientEmail;
  }
}

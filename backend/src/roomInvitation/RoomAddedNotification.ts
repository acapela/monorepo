import { Notification } from "../notifications/Notification";

export interface RoomAddedNotificationParams {
  recipientEmail: string;
  inviterName: string;
  roomName: string;
  spaceId: string;
  roomId: string;
}

export class RoomAddedNotification implements Notification {
  constructor(private params: RoomAddedNotificationParams) {}

  getContent(): string {
    const link = `${process.env.FRONTEND_URL}/space/${this.params.spaceId}/${this.params.roomId}`;
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

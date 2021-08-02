import { Notification } from "~backend/src/notifications/Notification";

export interface RoomInvitationNotificationParams {
  recipientEmail: string;
  inviterName: string;
  roomName: string;
  inviteCode: string;
}

function getInvitationUrl(code: string) {
  return `${process.env.FRONTEND_URL}/invites/${code}`;
}

export class RoomInvitationNotification implements Notification {
  constructor(private params: RoomInvitationNotificationParams) {}

  getContent(): string {
    const link = getInvitationUrl(this.params.inviteCode);
    return [
      "Hey!",
      `${this.params.inviterName} has invited you to collaborate on ${this.params.roomName} room on Acapela.`,
      `Follow this link to sign up and join the discussion: <a href="${link}">${link}</a>`,
    ].join("<br/>");
  }

  getSubject(): string {
    return `${this.params.inviterName} has invited you to collaborate on ${this.params.roomName}`;
  }

  getRecipientEmail(): string {
    return this.params.recipientEmail;
  }
}

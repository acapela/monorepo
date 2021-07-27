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

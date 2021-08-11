import { Notification } from "../notifications/Notification";

export interface InviteNotificationParams {
  recipientEmail: string;
  inviterName: string;
  roomName?: string;
  teamName: string;
  inviteCode: string;
}

function getInvitationUrl(code: string) {
  return `${process.env.FRONTEND_URL}/invites/${code}`;
}

export class TeamInvitationNotification implements Notification {
  constructor(private params: InviteNotificationParams) {}

  getContent(): string {
    const { inviterName, roomName, teamName, inviteCode } = this.params;
    const link = getInvitationUrl(inviteCode);

    return [
      "Hey!",
      `${inviterName} has invited you to ${
        roomName ? `collaborate on ${getInvitationUrl} room and ` : ""
      }join ${teamName} team on Acapela.`,
      `Follow this link to sign up and join the discussion: <a href="${link}">${link}</a>`,
    ].join("<br/>");
  }

  getSubject(): string {
    return `${this.params.inviterName} has invited you to collaborate on ${
      this.params.roomName || this.params.teamName
    }`;
  }

  getRecipientEmail(): string {
    return this.params.recipientEmail;
  }
}

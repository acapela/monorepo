import { NotificationName, NotificationMeta, NotificationAgentName, UserNotification } from "./UserNotification";
import { MailData } from "@sendgrid/helpers/classes/mail";
import { Thread, Participant, Room } from "./domain";
import { Timestamp } from "@google-cloud/firestore";
import { generateMagicLinkToRoom } from "./utils";

export default class InviteNotification extends UserNotification {
  public static NOTIFICATION_NAME: NotificationName = "Invite";
  public meta: NotificationMeta = {
    timeProcessed: new Date(),
    name: InviteNotification.NOTIFICATION_NAME,
  };

  async buildNotificationContent(agentName: NotificationAgentName): Promise<MailData> {
    const magicLink = await generateMagicLinkToRoom(this.participant.email, this.room.id);

    switch (agentName) {
      case "email":
        return {
          to: this.participant.email,
          from: "acapela@meetnomore.com",
          subject: `You got invited to ${this.room.title}`,
          text: `You got invited to room ${this.room.title}.
Participants:
${this.generateParticipantsList(this.room, true)}
${
  this.room.agendaPoints.length &&
  `Room agenda:\n
 ${this.generateAgendaSummary(this.room, true)}\nGo to ${magicLink} to start the discussion.
 `
}`,
          html: `You got invited to room ${this.room.title}.<br />
Participants:<br />
${this.generateParticipantsList(this.room)}<br />

${
  this.room.agendaPoints.length &&
  `Room agenda:<br />
  ${this.generateAgendaSummary(this.room)}<br />Go to the <a href="${magicLink}">Acapela</a> to start the discussion.
  `
}`,
        };
    }
  }

  shouldSendToAgent(): boolean {
    return !this.participant.notificationsStatus.Invite?.timeSent && this.room.agendaPoints.length > 0;
  }

  afterNotificationSentToAgent(): void {
    this.markParticipantAsInvited();
  }

  private generateAgendaSummary(room: Room, textMode = false): string {
    const nextLine = textMode ? "\n" : "<br />";

    return room.agendaPoints
      .map((point: Thread, index: number): string => `${index + 1}. ${point.title}`)
      .join(nextLine);
  }

  private generateParticipantsList(room: Room, textMode = false): string {
    const nextLine = textMode ? "\n" : "<br />";

    return room.participants
      .map((participant: Participant, index: number): string => `${index + 1}. ${participant.name}`)
      .join(nextLine);
  }

  private markParticipantAsInvited() {
    const newParticipants: Array<Participant> = [...this.room.participants];
    const i: number = newParticipants.findIndex((p: Participant) => p.email === this.participant.email);
    newParticipants[i] = {
      ...newParticipants[i],
      notificationsStatus: {
        ...this.participant.notificationsStatus,
        Invite: {
          timeSent: new Timestamp(Math.floor(Date.now() / 1000), 0),
          notificationData: {},
        },
      },
    };

    this.roomRef.update({
      participants: newParticipants,
    });
  }
}

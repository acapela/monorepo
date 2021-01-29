import { MailData } from "@sendgrid/helpers/classes/mail";
import { NotificationName, NotificationMeta, NotificationAgentName, UserNotification } from "./UserNotification";
import { Thread, Participant, Room } from "./domain";
import { generateMagicLinkToRoom } from "./utils";
import { firestore } from "firebase-admin";

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
          text: `You got invited to ${this.room.title}.\n
Participants:\n
${this.generateParticipantsList(this.room, true)}\n
${
  this.room.agendaPoints.length &&
  `Room agenda:\n
 ${this.generateAgendaSummary(this.room, true)}\n\nGo to ${magicLink} to start the discussion.
 `
}`,
          html: `You got invited to ${this.room.title}.<br />
Participants:<br />
${this.generateParticipantsList(this.room)}<br />

${
  this.room.agendaPoints.length &&
  `Room agenda:<br />
  ${this.generateAgendaSummary(
    this.room
  )}<br /><br />Go to the <a href="${magicLink}">Acapela</a> to start the discussion.
  `
}`,
        };
    }
  }

  hasParticipantAlreadyBeenInvited(): boolean {
    return (
      this.participant.notificationsStatus !== undefined && this.participant.notificationsStatus.Invite !== undefined
    );
  }

  isParticipantRoomAuthor(): boolean {
    return this.participant.userId === this.room.authorId;
  }

  shouldSendToAgent(): boolean {
    return (
      !this.hasParticipantAlreadyBeenInvited() && !this.isParticipantRoomAuthor() && this.room.agendaPoints.length > 0
    );
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
          timeSent: firestore.Timestamp.now(),
          notificationData: {},
        },
      },
    };

    this.roomRef.update({
      participants: newParticipants,
    });
  }
}

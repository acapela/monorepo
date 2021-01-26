import { DocumentData } from "@google-cloud/firestore";
import { Room, Participant } from "./domain";
import SendEmailNotification from "./agents/email";

const NotificationAgents: NotificationAgents = {
  email: SendEmailNotification,
};

/**
 *  UserNotification rather than Notification due to naming conflict.
 *  Notification notifies one user (participant)
 */

export abstract class UserNotification {
  public room: Room;
  public participant: Participant;
  public roomRef: FirebaseFirestore.DocumentReference<DocumentData>;

  public static NOTIFICATION_NAME: NotificationName;
  public abstract meta: NotificationMeta;

  /**
   *
   * @param room - Room which should
   * @param agendaPoints
   * @param user
   */
  constructor(room: Room, participant: Participant, roomRef: FirebaseFirestore.DocumentReference<DocumentData>) {
    this.room = room;
    this.participant = participant;
    this.roomRef = roomRef;
  }

  private async sendToAgent(): Promise<void> {
    for (const agentName of this.enabledAgents) {
      const content: string = await this.buildNotificationContent(agentName);
      NotificationAgents[agentName](content, this.meta);
    }
  }

  public abstract buildNotificationContent(agentName: NotificationAgentName): any;
  public abstract shouldSendToAgent(): boolean;

  public enabledAgents: Array<NotificationAgentName> = ["email"];

  public updateNotificationStatus(newStatus: Record<string, unknown>): void {
    const newParticipants: Array<Participant> = [...this.room.participants];
    const participantIndex: number = newParticipants.findIndex(
      (participant: Participant) => participant.userId === this.participant.userId
    );

    newParticipants[participantIndex].notificationsStatus = {
      ...this.participant.notificationsStatus,
      [this.meta.name]: {
        timeSent: new Date(),
        notificationData: newStatus,
      },
    };

    const newRoom: Room = {
      ...this.room,
      participants: newParticipants,
    };

    this.roomRef.update(newRoom);
  }

  public afterNotificationSentToAgent(): void {
    return;
  }

  /**
   * Process the notification. If the notification is to be released, returns true, otherwise false.
   */
  public process(): boolean {
    const shouldBeRelased: boolean = this.shouldSendToAgent();
    if (shouldBeRelased) {
      this.sendToAgent();
      this.afterNotificationSentToAgent();
    }

    return shouldBeRelased;
  }
}

export type NotificationAgent = (content: any, notificationMeta: NotificationMeta) => void;
export type NotificationAgentName = "email"; // TODO with each new agent, add it here, e.g. 'email'|'slack'
export type NotificationAgents = {
  [key in NotificationAgentName]: NotificationAgent;
};
export type NotificationName = "Invite" | "RoomExpired" | "UnseenMessages" | "RoomUnchecked";
export type NotificationMeta = {
  timeProcessed: Date;
  name: NotificationName;
};

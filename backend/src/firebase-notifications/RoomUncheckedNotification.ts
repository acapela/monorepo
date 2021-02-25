import { UserNotification, NotificationAgentName, NotificationName, NotificationMeta } from "./UserNotification";
import { isRoomExpired, getUnreadMessages, getUncheckedThreads, getRoomLink } from "./utils";
import { MailData } from "@sendgrid/helpers/classes/mail";
import { Thread } from "./domain";

export default class RoomUnchecked extends UserNotification {
  public static NOTIFICATION_NAME: NotificationName = "RoomUnchecked";
  public meta: NotificationMeta = {
    name: RoomUnchecked.NOTIFICATION_NAME,
    timeProcessed: new Date(),
  };

  shouldSendToAgent(): boolean {
    const uncheckedThreadsIds: Array<string> = getUncheckedThreads(this.room, this.participant.userId).map(
      (thread: Thread) => thread.id
    );

    const notifiedThreads: Array<string> = this.participant.notificationsStatus?.RoomUnchecked?.notificationData
      ?.agendaPointIds as Array<string>;

    const hasReadEverything = getUnreadMessages(this.room, this.participant.userId).length === 0;
    const agendaPointsWithoutNotificationExist =
      notifiedThreads?.filter((id: string) => !uncheckedThreadsIds.includes(id)).length > 0 || !notifiedThreads;

    return (
      !isRoomExpired(this.room) &&
      hasReadEverything &&
      uncheckedThreadsIds.length > 0 &&
      agendaPointsWithoutNotificationExist
    );
  }

  generateUnreadSummary(unread: Array<Thread>, textMode = false): string {
    // TODO utils?
    const nextLine = textMode ? "\n" : "<br />";

    return unread.map((point: Thread, index: number): string => `${index + 1}. ${point.title}`).join(nextLine);
  }

  async buildNotificationContent(agent: NotificationAgentName): Promise<MailData> {
    const magicLink = await getRoomLink(this.room.id);

    switch (agent) {
      case "email":
        return {
          to: this.participant.email,
          from: "acapela@meetnomore.com",
          subject: `Your Acapela ${this.room.title} has unchecked Agenda Points.`,
          text: `The following points in your agenda remain unchecked:

${this.generateUnreadSummary(getUncheckedThreads(this.room, this.participant.userId), true)}\
                    
Go to ${magicLink} to review the Agenda.`,
          html: `The following points in your agenda remain unchecked:<br/><br/>

${this.generateUnreadSummary(getUncheckedThreads(this.room, this.participant.userId))}<br/>
Go to the <a href="${magicLink}">Acapela</a> to review unchecked agenda points.`,
        };
    }
  }

  afterNotificationSentToAgent(): void {
    this.updateNotificationStatus({
      agendaPointIds: getUncheckedThreads(this.room, this.participant.userId).map((thread: Thread) => thread.id),
    });
  }
}

import { UserNotification, NotificationAgentName, NotificationName, NotificationMeta } from "./UserNotification";
import { isRoomExpired, getUnreadMessages, UnreadMessagesInThread, generateMagicLinkToRoom } from "./utils";
import { MailData } from "@sendgrid/helpers/classes/mail";
import { Thread, Message } from "./domain";

type UnseenMessagesNotificationStatusData = {
  [key: string]: number; // agendaPointId - last seen message index
};

export default class UnseenMessagesNotification extends UserNotification {
  public static NOTIFICATION_NAME: NotificationName = "UnseenMessages";
  public meta: NotificationMeta = {
    name: UnseenMessagesNotification.NOTIFICATION_NAME,
    timeProcessed: new Date(),
  };

  shouldSendToAgent(): boolean {
    const hasUnnotifiedMessages = !!this.room.agendaPoints.find(
      (point: Thread) =>
        this.participant.notificationsStatus?.UnseenMessages?.notificationData?.[point.id] !==
        this.room.agendaPoints.find((a) => a.id === point.id)?.howls?.length
    );

    const lastTimeSentSeconds: number =
      this.participant.notificationsStatus?.UnseenMessages?.notificationData?.timeSent?.seconds || 0;

    const invitedTimeSeconds: number =
      this.participant.notificationsStatus?.Invite?.notificationData?.timeSent?.seconds || 0;

    const notifiedInLastHour = new Date().getTime() - lastTimeSentSeconds * 1000 < 60 * 60 * 1000;
    const invitedInLasthour = new Date().getTime() - invitedTimeSeconds * 1000 < 60 * 60 * 1000;

    return (
      !isRoomExpired(this.room) &&
      getUnreadMessages(this.room, this.participant.userId).length > 0 &&
      !notifiedInLastHour &&
      !invitedInLasthour &&
      hasUnnotifiedMessages
    );
  }

  generateUnreadSummary(unread: Array<UnreadMessagesInThread>, textMode = false): string {
    // TODO utils?
    const nextLine = textMode ? "\n" : "<br />";
    const boldText = (text: string) => (textMode ? text : `"<b>${text}</b>"`);

    function buildMessagesList(messages: Array<Message>): string {
      return messages.map((message: Message) => `${message.author}:${nextLine}${message.text}`).join(nextLine);
    }

    return unread
      .map((point: UnreadMessagesInThread, index: number): string => {
        return `${boldText(`${index + 1}. ${point.thread.title}`)}${nextLine}${buildMessagesList(point.messages)}`;
      })
      .join(nextLine);
  }

  async buildNotificationContent(agent: NotificationAgentName): Promise<MailData> {
    const magicLink: string = await generateMagicLinkToRoom(this.participant.email, this.room.id);
    const unreadMessages: Array<UnreadMessagesInThread> = getUnreadMessages(this.room, this.participant.userId);
    const summary: string = this.generateUnreadSummary(unreadMessages);

    switch (agent) {
      case "email":
        return {
          to: this.participant.email,
          from: "acapela@meetnomore.com",
          subject: `Your Acapela ${this.room.title} has unread messages.`,
          text: `Here's an overview of your unread messages: \n\n
${summary}\n\n
Go to ${magicLink} to respond or mark the agenda points as checked`,
          html: `Here's an overview of your unread messages: <br /><br />
${summary}<br /><br />
Go to the <a href="${magicLink}">Acapela</a> to respond or mark the agenda points as checked.`,
        };
    }
  }

  afterNotificationSentToAgent(): void {
    const newNotificationStatusData: UnseenMessagesNotificationStatusData = {};

    this.room.agendaPoints.forEach((thread: Thread) => {
      newNotificationStatusData[thread.id] = thread.howls.length;
    });

    this.updateNotificationStatus(newNotificationStatusData);
  }
}

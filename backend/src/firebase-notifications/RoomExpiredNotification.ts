import { MailData } from "@sendgrid/helpers/classes/mail";
import logger from "@acapela/shared/logger";
import { UserNotification, NotificationName, NotificationMeta, NotificationAgentName } from "./UserNotification";
import { isRoomExpired, getRoomLink } from "./utils";
import Hasura from "../hasura";

export default class RoomExpiredNotification extends UserNotification {
  public static NOTIFICATION_NAME: NotificationName = "RoomExpired";
  public meta: NotificationMeta = {
    timeProcessed: new Date(),
    name: RoomExpiredNotification.NOTIFICATION_NAME,
  };

  private isAuthor(): boolean {
    return this.participant.userId === this.room.authorId;
  }
  shouldSendToAgent(): boolean {
    return this.isAuthor() && isRoomExpired(this.room);
  }
  async buildNotificationContent(agentName: NotificationAgentName): Promise<MailData> {
    const magicLink: string = await getRoomLink(this.room.id);

    switch (agentName) {
      case "email":
        return {
          to: this.participant.email,
          from: "acapela@meetnomore.com",
          subject: `Your Acapela ${this.room.title} is past its deadline.`,
          text: `Go to ${magicLink} to prolongue the deadline or close the Acapela.`,
          html: `Go to the <a href="${magicLink}">Acapela</a> to prolongue the deadline or close it.`,
        };
    }
  }
  async afterNotificationSentToAgent(): Promise<void> {
    // ensures this happens only once
    if (this.isAuthor()) {
      try {
        await Hasura.deleteJob(this.room.id);
      } catch (e) {
        logger.error(`Couldn't delete cron job for room`, { roomId: this.room.id });
      }
    }
  }
}

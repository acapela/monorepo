import { db, Notification } from "~db";
import { AnyNotificationData, isNotificationDataOfType, NotificationData } from "~shared/notifications/types";
import { findUserById, getNormalizedUserName } from "../users/users";
import { MentionNotification } from "./MentionNotification";
import { sendNotification } from "./sendNotification";
import { assert } from "~shared/assert";

async function sendMentionEmailNotification(notification: Notification, data: NotificationData<"topicMention">) {
  const {
    payload: { mentionedByUserId, topicId },
  } = data;

  const [topic, mentionedUser, mentioningUser] = await Promise.all([
    db.topic.findUnique({
      where: { id: topicId },
      include: {
        room: true,
      },
    }),
    findUserById(notification.user_id),
    findUserById(mentionedByUserId),
  ]);

  assert(topic, `Created mention for non existing topic (${topicId})`);
  assert(mentionedUser, `Created mention notification for non existing user (${notification.user_id})`);
  assert(mentioningUser, `Created mention notification by non existing user (${notification.user_id})`);
  // TODO: we should probably finally make email non-nullable
  assert(mentionedUser.email, "Cannot send email to mentioned user as there is no email address");

  const mentionNotification = new MentionNotification({
    recipientEmail: mentionedUser.email,
    recipientName: getNormalizedUserName(mentionedUser),
    authorName: getNormalizedUserName(mentioningUser),
    topicName: topic.name || "a topic",
    spaceId: topic.room.space_id,
    roomId: topic.room.id,
    topicId: topic.id,
  });

  await sendNotification(mentionNotification);
}

export async function handleNotificationCreated(notification: Notification) {
  const notificationData = notification.data as AnyNotificationData;

  if (isNotificationDataOfType(notificationData, "topicMention")) {
    await sendMentionEmailNotification(notification, notificationData);
  }
}

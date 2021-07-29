import { db, Notification } from "~db";
import { AnyNotificationData, isNotificationDataOfType, NotificationData } from "~shared/notifications/types";
import { findUserById, getNormalizedUserName } from "../users/users";
import { MentionNotification } from "./MentionNotification";
import { sendNotification } from "./sendNotification";
import { assert } from "~shared/assert";
import { HasuraEvent } from "../hasura";
import { findRoomById } from "../rooms/rooms";
import { UnprocessableEntityError } from "../errors/errorTypes";
import { RoomAddedNotification } from "../roomInvitation/RoomAddedNotification";

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

async function sendAddedToRoomEmailNotification(notification: Notification, data: NotificationData<"addedToRoom">) {
  const {
    payload: { roomId, addedByUserId },
  } = data;
  const [addedUser, inviter, room] = await Promise.all([
    findUserById(notification.user_id),
    findUserById(addedByUserId),
    findRoomById(roomId),
  ]);

  if (!addedUser) {
    throw new UnprocessableEntityError(`added user ${notification.user_id} does not exist`);
  }
  if (!inviter) {
    throw new UnprocessableEntityError(`inviter ${addedByUserId} does not exist`);
  }
  if (!room) {
    throw new UnprocessableEntityError(`room ${roomId} does not exist`);
  }
  if (!addedUser.email) {
    throw new UnprocessableEntityError(`invalid user entry: ${notification.user_id} (no email address)`);
  }
  if (!room.space_id) {
    throw new UnprocessableEntityError(`invalid room entry: ${roomId}`);
  }

  const sendableNotification = new RoomAddedNotification({
    recipientEmail: addedUser.email,
    inviterName: getNormalizedUserName(inviter),
    roomName: room.name || "an acapela discussion",
    spaceId: room.space_id,
    roomId: room.id,
  });

  await sendNotification(sendableNotification);
}

export async function handleNotificationCreated({ item: notification }: HasuraEvent<Notification>) {
  const notificationData = notification.data as AnyNotificationData;

  if (isNotificationDataOfType(notificationData, "topicMention")) {
    await sendMentionEmailNotification(notification, notificationData);
  }

  if (isNotificationDataOfType(notificationData, "addedToRoom")) {
    await sendAddedToRoomEmailNotification(notification, notificationData);
  }
}

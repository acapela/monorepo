import { Notification, db } from "~db";
import { assert } from "~shared/assert";
import { AnyNotificationData, NotificationData, isNotificationDataOfType } from "~shared/notifications/types";

import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { RoomAddedNotification } from "../roomInvitation/RoomAddedNotification";
import { findRoomById } from "../rooms/rooms";
import { findUserById, getNormalizedUserName } from "../users/users";
import { MentionNotification } from "./MentionNotification";
import { sendNotification } from "./sendNotification";

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

  assert(addedUser, new UnprocessableEntityError(`added user ${notification.user_id} does not exist`));
  assert(inviter, new UnprocessableEntityError(`inviter ${addedByUserId} does not exist`));
  assert(room, new UnprocessableEntityError(`room ${roomId} does not exist`));
  assert(
    addedUser.email,
    new UnprocessableEntityError(`invalid user entry: ${notification.user_id} (no email address)`)
  );
  assert(room.space_id, new UnprocessableEntityError(`invalid room entry: ${roomId}`));

  const sendableNotification = new RoomAddedNotification({
    recipientEmail: addedUser.email,
    inviterName: getNormalizedUserName(inviter),
    roomName: room.name,
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

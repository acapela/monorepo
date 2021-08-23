import { Notification, db } from "~db";
import { assert } from "~shared/assert";
import { AnyNotificationData, NotificationData, isNotificationDataOfType } from "~shared/notifications/types";

import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { findRoomById } from "../rooms/rooms";
import { findUserById, getNormalizedUserName } from "../users/users";
import { sendNotification } from "./sendNotification";

async function sendMentionEmailNotification(notification: Notification, data: NotificationData<"topicMention">) {
  const {
    payload: { mentionedByUserId, topicId },
  } = data;

  const [topic, mentionedTeamMember, mentioningUser] = await Promise.all([
    db.topic.findUnique({
      where: { id: topicId },
      include: {
        room: true,
      },
    }),
    db.team_member.findFirst({
      where: {
        user_id: notification.user_id,
        team: { space: { some: { room: { some: { topic: { some: { id: { equals: topicId } } } } } } } },
      },
      include: { user: true },
    }),
    findUserById(mentionedByUserId),
  ]);

  assert(topic, `Created mention for non existing topic (${topicId})`);
  assert(mentionedTeamMember, `Created mention notification for non existing user (${notification.user_id})`);
  assert(mentioningUser, `Created mention notification by non existing user (${notification.user_id})`);

  const authorName = getNormalizedUserName(mentioningUser);
  const topicName = topic.name || "a topic";
  const link = `${process.env.FRONTEND_URL}/space/${topic.room.space_id}/${topic.room.id}/${topic.id}`;
  await sendNotification(mentionedTeamMember, {
    subject: `${authorName} has tagged you in ${topicName}`,
    content: [
      `Hi ${getNormalizedUserName(mentionedTeamMember.user)}!`,
      `${authorName} has tagged you in ${topicName}. To read the message, simply click the following link: ${link}`,
    ].join("\n"),
  });
}

async function sendAddedToRoomEmailNotification(notification: Notification, data: NotificationData<"addedToRoom">) {
  const {
    payload: { roomId, addedByUserId },
  } = data;
  const [addedTeamMember, inviter, room] = await Promise.all([
    db.team_member.findFirst({
      where: {
        user_id: notification.user_id,
        team: { space: { some: { room: { some: { id: { equals: roomId } } } } } },
      },
      include: { user: true },
    }),
    findUserById(addedByUserId),
    findRoomById(roomId),
  ]);

  assert(addedTeamMember, new UnprocessableEntityError(`added user ${notification.user_id} does not exist`));
  assert(inviter, new UnprocessableEntityError(`inviter ${addedByUserId} does not exist`));
  assert(room, new UnprocessableEntityError(`room ${roomId} does not exist`));
  assert(room.space_id, new UnprocessableEntityError(`invalid room entry: ${roomId}`));

  const inviterName = getNormalizedUserName(inviter);
  await sendNotification(addedTeamMember, {
    subject: `${inviterName} has invited you to collaborate on ${room.name}`,
    content: [
      `Hey!`,
      `${inviterName} has invited you to collaborate on ${room.name} using acapela, a tool for asynchronous collaboration.`,
      `Follow this link to join the discussion: ${process.env.FRONTEND_URL}/space/${room.space_id}/${room.id}`,
    ].join("\n"),
  });
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

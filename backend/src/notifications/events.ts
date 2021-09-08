import { NotificationRoomAddedTo, NotificationTopicMention, db } from "~db";
import { assert, assertDefined } from "~shared/assert";

import { UnprocessableEntityError } from "../errors/errorTypes";
import { HasuraEvent } from "../hasura";
import { findRoomById } from "../rooms/rooms";
import { findUserById, getNormalizedUserName } from "../users/users";
import { sendNotificationPerPreference } from "./sendNotification";

export async function handleNotificationTopicMentionCreated(event: HasuraEvent<NotificationTopicMention>) {
  const { notification_id: notificationId, topic_id: topicId, mentioned_by_user_id: mentionedByUserId } = event.item;
  const notification = assertDefined(
    await db.notification.findUnique({ where: { id: notificationId } }),
    "no related notification found"
  );
  const userId = notification.user_id;
  const [topic, mentionedTeamMember, mentioningUser] = await Promise.all([
    db.topic.findUnique({
      where: { id: topicId },
      include: {
        room: true,
      },
    }),
    db.team_member.findFirst({
      where: {
        user_id: userId,
        team: { space: { some: { room: { some: { topic: { some: { id: { equals: topicId } } } } } } } },
      },
      include: { user: true },
    }),
    findUserById(mentionedByUserId),
  ]);

  assert(topic, `Created mention for non existing topic (${topicId})`);
  assert(mentionedTeamMember, `Created mention notification for non existing user (${userId})`);
  assert(mentioningUser, `Created mention notification by non existing user (${userId})`);

  const authorName = getNormalizedUserName(mentioningUser);
  const topicName = topic.name || "a topic";
  const link = `${process.env.FRONTEND_URL}/space/${topic.room.space_id}/${topic.room.id}/${topic.id}`;
  await sendNotificationPerPreference(mentionedTeamMember, {
    subject: `${authorName} has tagged you in ${topicName}`,
    content: [
      `Hi ${getNormalizedUserName(mentionedTeamMember.user)}!`,
      `${authorName} has tagged you in ${topicName}. To read the message, simply click the following link: ${link}`,
    ].join("\n"),
  });
}

export async function handleNotificationRoomAddedToCreated(event: HasuraEvent<NotificationRoomAddedTo>) {
  const { notification_id: notificationId, room_id: roomId, added_by_user_id: addedByUserId } = event.item;
  const notification = assertDefined(
    await db.notification.findUnique({ where: { id: notificationId } }),
    "no related notification found"
  );
  const userId = notification.user_id;
  const [addedTeamMember, inviter, room] = await Promise.all([
    db.team_member.findFirst({
      where: {
        user_id: userId,
        team: { space: { some: { room: { some: { id: { equals: roomId } } } } } },
      },
      include: { user: true },
    }),
    findUserById(addedByUserId),
    findRoomById(roomId),
  ]);

  assert(addedTeamMember, new UnprocessableEntityError(`added user ${userId} does not exist`));
  assert(inviter, new UnprocessableEntityError(`inviter ${addedByUserId} does not exist`));
  assert(room, new UnprocessableEntityError(`room ${roomId} does not exist`));
  assert(room.space_id, new UnprocessableEntityError(`invalid room entry: ${roomId}`));

  const inviterName = getNormalizedUserName(inviter);
  await sendNotificationPerPreference(addedTeamMember, {
    subject: `${inviterName} has invited you to collaborate on ${room.name}`,
    content: [
      `Hey!`,
      `${inviterName} has invited you to collaborate on ${room.name} using acapela, a tool for asynchronous collaboration.`,
      `Follow this link to join the discussion: ${process.env.FRONTEND_URL}/space/${room.space_id}/${room.id}`,
    ].join("\n"),
  });
}

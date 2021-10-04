import { UnprocessableEntityError } from "~backend/src/errors/errorTypes";
import { sendNotificationPerPreference } from "~backend/src/notifications/sendNotification";
import { findRoomById } from "~backend/src/rooms/rooms";
import { findUserById, getNormalizedUserName } from "~backend/src/users/users";
import { db } from "~db";
import { assert } from "~shared/assert";

export async function createAndSendAddedToRoomNotification({
  userId,
  roomId,
  addedByUserId,
}: {
  userId: string;
  roomId: string;
  addedByUserId: string;
}) {
  const [, addedTeamMember, inviter, room] = await Promise.all([
    db.notification.create({
      data: {
        user_id: userId,
        notification_room_added_to: { create: { room_id: roomId, added_by_user_id: addedByUserId } },
      },
    }),
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

  sendNotificationPerPreference(addedTeamMember, {
    subject: `${inviterName} has invited you to collaborate on ${room.name}`,
    content: [
      `Hey!`,
      `${inviterName} has invited you to collaborate on ${room.name} using acapela, a tool for asynchronous collaboration.`,
      `Follow this link to join the discussion: ${process.env.FRONTEND_URL}/space/${room.space_id}/${room.id}`,
    ].join("\n"),
  });
}

export async function createAndSendTopicMentionNotification({
  topicId,
  userId,
  mentionedByUserId,
}: {
  topicId: string;
  userId: string;
  mentionedByUserId: string;
}) {
  const [, topic, mentionedTeamMember, mentioningUser] = await Promise.all([
    db.notification.create({
      data: {
        user_id: userId,
        notification_topic_mention: { create: { topic_id: topicId, mentioned_by_user_id: mentionedByUserId } },
      },
    }),
    db.topic.findUnique({
      where: { id: topicId },
      include: {
        room: true,
      },
    }),
    db.team_member.findFirst({
      where: {
        user_id: userId,
        team: { topic: { some: { id: { equals: topicId } } } },
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
  const link =
    process.env.FRONTEND_URL +
    (topic.room ? `/space/${topic.room.space_id}/${topic.room.id}/${topic.id}` : `/${topic.id}`);

  sendNotificationPerPreference(mentionedTeamMember, {
    subject: `${authorName} has tagged you in ${topicName}`,
    content: [
      `Hi ${getNormalizedUserName(mentionedTeamMember.user)}!`,
      `${authorName} has tagged you in ${topicName}. To read the message, simply click the following link: ${link}`,
    ].join("\n"),
  });
}

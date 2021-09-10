import { Topic, db } from "~db";

import { HasuraEvent } from "../hasura";
import { updateRoomLastActivityDate } from "../rooms/rooms";
import { markAllOpenTasksAsDone } from "../tasks/taskHandlers";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  await updateRoomLastActivityDate(event.item.room_id);

  if (event.type === "create") {
    await inheritTopicMembersFromParentRoom(event.item);
  }

  if (event.type === "update") {
    const wasJustClosed = event.item.closed_at && !event.itemBefore.closed_at;

    if (wasJustClosed && event.userId) {
      await createTopicClosedNotifications(event.item, event.userId);
      await markAllOpenTasksAsDone(event.item);
    }

    const ownerId = event.item.owner_id;
    const assignedByUserId = event.userId;
    const hasNewOwner = ownerId !== event.itemBefore.owner_id;
    const shouldNotifyAssignee = ownerId && hasNewOwner && assignedByUserId && assignedByUserId !== ownerId;

    if (shouldNotifyAssignee) {
      await db.notification.create({
        data: {
          user_id: ownerId,
          notification_topic_assigned: { create: { topic_id: event.item.id, assigned_by_user_id: assignedByUserId } },
        },
      });
    }
  }
}

async function createTopicClosedNotifications(topic: Topic, closedByUserId: string) {
  const topicMembers = await db.topic_member.findMany({ where: { topic_id: topic.id } });

  const createNotificationRequests = topicMembers
    // Don't send notification to user who closed the topic
    .filter((topicMembers) => topicMembers.user_id !== closedByUserId)
    .map((topicMember) =>
      db.notification.create({
        data: {
          user_id: topicMember.user_id,
          notification_topic_closed: { create: { topic_id: topic.id, closed_by_user_id: closedByUserId } },
        },
      })
    );

  return db.$transaction(createNotificationRequests);
}

async function inheritTopicMembersFromParentRoom(topic: Topic) {
  if (!topic.room_id) return;

  // Get all parent space members.
  const roomMembers = await db.room_member.findMany({
    where: { room_id: topic.room_id },
  });

  const roomMembersUserIds = roomMembers.map((member) => member.user_id);

  await db.topic_member.createMany({
    data: roomMembersUserIds.map((userId) => {
      return {
        user_id: userId,
        topic_id: topic.id,
      };
    }),
    // This should never happen as the room is just created so it should have no members yet.
    skipDuplicates: true,
  });
}

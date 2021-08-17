import { db, Topic } from "~db";
import { HasuraEvent } from "../hasura";
import { createNotification } from "../notifications/entity";
import { updateRoomLastActivityDate } from "../rooms/rooms";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  await updateRoomLastActivityDate(event.item.room_id);

  if (event.type === "create") {
    await inheritTopicMembersFromParentRoom(event.item);
  }

  if (event.type === "update") {
    const wasJustClosed = !event.item.closed_at && event.itemBefore.closed_at;

    if (wasJustClosed && event.userId) {
      await createTopicClosedNotifications(event.item, event.userId);
    }

    const ownerId = event.item.owner_id;
    const assignedByUserId = event.userId;
    const hasNewOwner = ownerId !== event.itemBefore.owner_id;
    const shouldNotifyAssignee = ownerId && hasNewOwner && assignedByUserId && assignedByUserId !== ownerId;

    if (shouldNotifyAssignee) {
      await createNotification({
        type: "topicAssigned",
        userId: ownerId,
        payload: {
          topicId: event.item.id,
          assignedByUserId,
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
    .map((topicMember) => {
      return createNotification({
        type: "topicClosed",
        userId: topicMember.user_id,
        payload: { topicId: topic.id, closedByUserId },
      });
    });

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

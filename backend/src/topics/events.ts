import { Topic, db } from "~db";

import { HasuraEvent } from "../hasura";
import { updateRoomLastActivityDate } from "../rooms/rooms";
import { markAllOpenTasksAsDone } from "../tasks/taskHandlers";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  if (event.item.room_id) {
    await updateRoomLastActivityDate(event.item.room_id);
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
  const roomMembers = await db.room_member.findMany({
    // Don't send notification to user who closed the topic
    where: { room: { topic: { some: { id: topic.id } } }, user_id: { not: closedByUserId } },
  });

  return db.$transaction(
    roomMembers.map((member) =>
      db.notification.create({
        data: {
          user_id: member.user_id,
          notification_topic_closed: { create: { topic_id: topic.id, closed_by_user_id: closedByUserId } },
        },
      })
    )
  );
}

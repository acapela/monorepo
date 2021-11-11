import { MessageTaskDueDate, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleTaskDueDateChanges(event: HasuraEvent<MessageTaskDueDate>) {
  const topic = await db.topic.findFirst({ where: { message: { some: { id: event.item.message_id } } } });

  assert(topic, "must have topic");

  // Probably handled by slack, and should be handled where the slack command is captured
  if (!event.userId) {
    return;
  }
  assert(event.userId, "due date can only be changed by users");

  if (event.item.due_at !== event.itemBefore?.due_at) {
    trackBackendUserEvent(event.userId, "Added Due Date", {
      topicId: topic.id,
      messageId: event.item.message_id,
      origin: "web-app",
    });
  }
}

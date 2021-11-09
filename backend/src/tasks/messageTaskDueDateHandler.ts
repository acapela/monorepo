import { MessageTaskDueDate, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleTaskDueDateChanges(event: HasuraEvent<MessageTaskDueDate>) {
  const topic = await db.topic.findFirst({ where: { message: { some: { id: event.item.message_id } } } });

  assert(topic, "must have topic");
  assert(event.userId, "due date can only be changed by users");

  if (event.item.due_date !== event.itemBefore?.due_date) {
    trackBackendUserEvent(event.userId, "Added Due Date", {
      topicId: topic.id,
      messageId: event.item.message_id,
    });
  }
}

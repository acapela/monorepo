import { Topic } from "~db";

import { HasuraEvent } from "../hasura";
import { markAllOpenTasksAsDone } from "../tasks/taskHandlers";

export async function handleTopicUpdates(event: HasuraEvent<Topic>) {
  if (event.type === "update") {
    const wasJustClosed = event.item.closed_at && !event.itemBefore.closed_at;

    if (wasJustClosed && event.userId) {
      await markAllOpenTasksAsDone(event.item);
    }

    const ownerId = event.item.owner_id;
    const assignedByUserId = event.userId;
    const hasNewOwner = ownerId !== event.itemBefore.owner_id;
    const shouldNotifyAssignee = ownerId && hasNewOwner && assignedByUserId && assignedByUserId !== ownerId;

    if (shouldNotifyAssignee) {
      // TODO??
    }
  }
}

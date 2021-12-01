import { tryUpdateTaskSlackMessages } from "~backend/src/slack/live-messages/LiveTaskMessage";
import { tryUpdateTopicSlackMessage } from "~backend/src/slack/live-messages/LiveTopicMessage";
import { MessageTaskDueDate, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";

import { HasuraEvent } from "../hasura";

export async function handleTaskDueDateChanges(event: HasuraEvent<MessageTaskDueDate>) {
  const messageId = event.item.message_id;
  const topic = await db.topic.findFirst({ where: { message: { some: { id: messageId } } } });

  assert(topic, `must have topic for message ${messageId}`);

  // Most likely created by slack command. The analytics event should be triggered where the slack command is captured
  if (!event.userId) {
    return;
  }

  if (event.item.due_at !== event.itemBefore?.due_at) {
    trackBackendUserEvent(event.userId, "Added Due Date", {
      topicId: topic.id,
      messageId,
      origin: "web-app",
    });
    await Promise.all([
      tryUpdateTopicSlackMessage(topic),
      tryUpdateTaskSlackMessages({
        taskSlackMessage: { task: { message_id: messageId } },
        message: { id: messageId },
      }),
    ]);
  }
}

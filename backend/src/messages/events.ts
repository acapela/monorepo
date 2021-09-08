import { Message, MessageReaction, db } from "~db";
import { Message_Type_Enum } from "~gql";
import { convertMessageContentToPlainText } from "~richEditor/content/plainText";
import { RichEditorNode } from "~richEditor/content/types";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { log } from "~shared/logger";

import { HasuraEvent } from "../hasura";
import { updateRoomLastActivityDate } from "../rooms/rooms";
import { createMessageMentionNotifications, createTasksFromNewMentions } from "./mentionHandlers";

export async function prepareMessagePlainTextData(message: Message) {
  if ((message.type as Message_Type_Enum) !== "TEXT") {
    return;
  }

  if (!message.content) return;

  try {
    const plainText = convertMessageContentToPlainText(message.content as RichEditorNode);

    await db.message.update({ where: { id: message.id }, data: { content_text: plainText } });
  } catch (error) {
    log.warn("Failed to prepare message plain text content", message);
  }
}

/**
 * Each time user creates a message in a topic, we mark all previous tasks of the message author in this topic as done.
 */
async function markPendingTasksAsDone(message: Message) {
  const { topic_id, user_id } = message;

  const taskCompletionTime = new Date();

  const pendingTasks = await db.task.findMany({ where: { message: { topic_id }, user_id, done_at: null } });

  await db.task.updateMany({
    where: { id: { in: pendingTasks.map((t) => t.id) } },
    data: { done_at: taskCompletionTime },
  });

  await db.message.updateMany({
    where: { id: { in: pendingTasks.map((t) => t.message_id) } },
    data: { updated_at: taskCompletionTime },
  });

  // Tracking
  pendingTasks.forEach((task) => {
    trackBackendUserEvent(task.user_id, "Completed Task", {
      taskType: task.type as string,
      taskId: task.id,
      messageId: task.message_id,
      doneAt: taskCompletionTime,
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function handleMessageChanges(event: HasuraEvent<Message>) {
  if (event.type === "delete") return;

  const topicInfo = await db.topic.findFirst({ where: { id: event.item.topic_id } });

  assert(topicInfo, "Message has no topic attached");

  await Promise.all([
    updateRoomLastActivityDate(topicInfo.room_id),
    prepareMessagePlainTextData(event.item),
    // In case message includes @mentions, create notifications for them
    createMessageMentionNotifications(event.item, event.itemBefore),
    createTasksFromNewMentions(event.item, event.itemBefore),
    markPendingTasksAsDone(event.item),
  ]);
}

export async function handleMessageReactionChanges(event: HasuraEvent<MessageReaction>) {
  await db.message.update({ where: { id: event.item.message_id }, data: { updated_at: new Date() } });
}

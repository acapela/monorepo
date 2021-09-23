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
async function markPendingTasksAsDone(newMessage: Message) {
  const { topic_id, user_id } = newMessage;

  const taskCompletionTime = new Date();

  const pendingTasks = await db.task.findMany({
    where: {
      message: {
        topic_id,
        /**
         * This check prevents messages from closing its own tasks.
         *
         * Use case:
         * 1. MessageA: hi @adam can you read it?
         * 2. Task is created
         * 3. You eg. edit MessageA, adding "please???" at the end.
         *
         * Message update is picked and it actually resolves task.
         *
         * Thus this check makes sure that message updates will never solve tasks attached to itself.
         *
         * Note: it is also possible that lack of this check introduces race condition eg. in `handleMessageChanges`
         * we have `Promise.all` that first creates message tasks and then solves pending tasks.
         *
         * As Promise.all executes all promises in parallel it is possible that
         *
         * 1. new message is created
         * 2. handler is called
         * 3. task is created
         * 4. then! markPendingTasksAsDone is called after (race condition)
         * 5. task is resolved instantly after it was created.
         *
         */
        id: { not: newMessage.id },
      },
      user_id,
      done_at: null,
    },
  });

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
    topicInfo.room_id ? updateRoomLastActivityDate(topicInfo.room_id) : Promise.resolve(),
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

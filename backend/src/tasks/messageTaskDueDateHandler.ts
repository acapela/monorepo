import { differenceInHours, parseISO } from "date-fns";

import { createShortDueDate } from "@aca/backend/src/notifications/bodyBuilders/requestIsDue";
import { sendNotificationPerPreference } from "@aca/backend/src/notifications/sendNotification";
import { tryUpdateTaskSlackMessages } from "@aca/backend/src/slack/live-messages/LiveTaskMessage";
import { tryUpdateTopicSlackMessage } from "@aca/backend/src/slack/live-messages/LiveTopicMessage";
import { backendGetTopicUrl } from "@aca/backend/src/topics/url";
import { MessageTaskDueDate, db } from "@aca/db";
import { assert } from "@aca/shared/assert";
import { trackBackendUserEvent } from "@aca/shared/backendAnalytics";
import { niceFormatDateTime } from "@aca/shared/dates/format";

import { HasuraEvent } from "../hasura";

// TODO: Update live message on task due date delete
export async function handleTaskDueDateChanges(event: HasuraEvent<MessageTaskDueDate>) {
  const messageId = event.item.message_id;
  const [tasks, topic] = await Promise.all([
    db.task.findMany({
      where: {
        message: {
          id: messageId,
        },
        done_at: {
          equals: null,
        },
      },
      include: {
        user: true,
        message: {
          include: {
            user: true,
          },
        },
      },
    }),
    db.topic.findFirst({ where: { message: { some: { id: messageId } } } }),
  ]);

  assert(topic, `must have topic for message ${messageId}`);

  const dueAt = parseISO(event.item.due_at.toString());
  if (tasks.length && ["create", "update"].includes(event.type) && differenceInHours(dueAt, new Date()) < 24) {
    for (const task of tasks) {
      const message = createShortDueDate({
        topicId: topic.id,
        topicName: topic.name,
        topicURL: await backendGetTopicUrl(topic),
        taskCreatorName: task.message.user.name,
        deadline: niceFormatDateTime(dueAt),
      });
      sendNotificationPerPreference(task.user, topic.team_id, message, topic.id);
    }
  }

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
      tryUpdateTopicSlackMessage(topic.id),
      tryUpdateTaskSlackMessages({
        taskSlackMessage: { task: { message_id: messageId } },
        message: { id: messageId },
      }),
    ]);
  }
}

import { HasuraEvent, UpdateHasuraEvent } from "~backend/src/hasura";
import { sendNotificationPerPreference } from "~backend/src/notifications/sendNotification";
import { LiveTaskMessage, tryUpdateTaskSlackMessages } from "~backend/src/slack/live-messages/LiveTaskMessage";
import { tryUpdateTopicSlackMessage } from "~backend/src/slack/live-messages/LiveTopicMessage";
import { Task, Topic, User, db } from "~db";
import { assert, assertDefined } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { isEqualForPick } from "~shared/object";
import { MENTION_TYPE_LABELS, MentionType, RequestType } from "~shared/types/mention";

import { backendGetTopicUrl } from "../topics/url";

export async function handleTaskChanges(event: HasuraEvent<Task>) {
  if (event.type === "create") {
    return onTaskCreation(event.item);
  } else if (event.type === "update") {
    return onTaskUpdate(event);
  }
}

async function sendTaskNotification(topic: Topic, task: Task, toUser: User, fromUser: User) {
  if (fromUser.id === toUser.id) {
    // do not notify users about tasks created by themselves
    return;
  }

  const teamId = topic.team_id;
  const topicURL = await backendGetTopicUrl(topic);
  const taskLabel = MENTION_TYPE_LABELS[task.type as MentionType] ?? "attention";
  const { slackMessage } = await sendNotificationPerPreference(toUser, teamId, {
    email: {
      subject: `${fromUser.name} has asked for your ${taskLabel} in ${topic.name}`,
      html: `Click <a href="${topicURL}">here</a> to find out what they need.`,
    },
    slack: async () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (
        await LiveTaskMessage(
          assertDefined(
            await db.task.findUnique({
              where: { id: task.id },
              include: { message: { include: { topic: true, message_task_due_date: true } } },
            }),
            "must still find the task"
          )
        )
      ).blocks!,
  });

  if (slackMessage && slackMessage.channel && slackMessage.ts) {
    await db.task_slack_message.create({
      data: {
        topic_id: topic.id,
        task_id: task.id,
        slack_channel_id: slackMessage.channel,
        slack_message_ts: slackMessage.ts,
      },
    });
  }
}

async function onTaskCreation(task: Task) {
  const [fromUser, toUser, topic] = await Promise.all([
    db.user.findFirst({ where: { message: { some: { id: task.message_id } } } }),
    db.user.findUnique({ where: { id: task.user_id } }),
    db.topic.findFirst({ where: { message: { some: { id: task.message_id } } } }),
  ]);

  assert(fromUser && toUser && topic, "must have users and topic");

  if (topic.all_tasks_done_at !== null) {
    await db.topic.update({
      where: {
        id: topic.id,
      },
      data: {
        all_tasks_done_at: null,
        last_task_done_by: null,
      },
    });
  }

  trackBackendUserEvent(fromUser.id, "Created Task", {
    taskType: task.type as RequestType,
    topicId: topic.id,
    mentionedUserId: toUser.id,
  });

  await sendTaskNotification(topic, task, toUser, fromUser);
}

async function getTopicHasOnlySelfAssignedTasks(topic: Topic) {
  const ownerId = topic.owner_id;

  const notTopicOwnerTasksCount = await db.task.count({
    where: {
      user_id: { not: ownerId },
      message: {
        topic_id: topic.id,
      },
    },
  });

  return notTopicOwnerTasksCount === 0;
}

async function onTaskUpdate({ item: task, itemBefore: taskBefore, userId }: UpdateHasuraEvent<Task>) {
  const topic = await db.topic.findFirst({ where: { message: { some: { id: task.message_id } } } });

  assert(topic, `must have topic for message ${task.message_id}`);

  if (!isEqualForPick(task, taskBefore, ["done_at"])) {
    await tryUpdateTaskSlackMessages({
      taskSlackMessage: { task_id: task.id },
      message: { task: { some: { id: task.id } } },
    });
  }

  if (userId && task.done_at && task.done_at !== taskBefore.done_at) {
    // userId is null when the update is not triggered through the frontend
    const wasTaskCompleteBeforeToggle = taskBefore.done_at;
    trackBackendUserEvent(userId, wasTaskCompleteBeforeToggle ? "Marked Task As Not Done" : "Marked Task As Done", {
      taskType: task.type as RequestType,
      topicId: topic.id,
      origin: "unknown",
    });
  }

  await tryUpdateTopicSlackMessage(topic);

  const amountOfOpenTasksLeft = await db.task.count({
    where: {
      message: { topic_id: { equals: topic.id } },
      done_at: {
        equals: null,
      },
    },
  });

  // If topic had only self assigned tasks and all of them are done - automatically close the topic
  if (amountOfOpenTasksLeft === 0 && !topic.closed_at) {
    if (await getTopicHasOnlySelfAssignedTasks(topic)) {
      await db.topic.update({
        where: { id: topic.id },
        data: {
          closed_at: new Date().toISOString(),
          closed_by_user_id: topic.owner_id,
        },
      });
    }
  }

  // HACK: This is  workaround until prisma supports `PG Generated Columns`
  // `all_tasks_done_at` should be one
  if (amountOfOpenTasksLeft === 0) {
    await db.topic.update({
      where: {
        id: topic.id,
      },
      data: {
        all_tasks_done_at: task.done_at,
        last_task_done_by: task.user_id,
      },
    });
  } else if (topic.all_tasks_done_at !== null) {
    await db.topic.update({
      where: {
        id: topic.id,
      },
      data: {
        all_tasks_done_at: null,
        last_task_done_by: null,
      },
    });
  }
}

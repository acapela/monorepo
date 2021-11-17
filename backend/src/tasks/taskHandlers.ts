import { HasuraEvent, UpdateHasuraEvent } from "~backend/src/hasura";
import { createSlackLink, sendNotificationPerPreference } from "~backend/src/notifications/sendNotification";
import { tryUpdateTopicSlackMessage } from "~backend/src/slack/LiveTopicMessage";
import { getSlackUserMentionOrLabel } from "~backend/src/slack/utils";
import { Task, db } from "~db";
import { assert } from "~shared/assert";
import { trackBackendUserEvent } from "~shared/backendAnalytics";
import { routes } from "~shared/routes";
import { Sentry } from "~shared/sentry";
import { MENTION_TYPE_LABELS, MentionType, RequestType } from "~shared/types/mention";

export async function handleTaskChanges(event: HasuraEvent<Task>) {
  if (event.type === "create") {
    return onTaskCreation(event.item);
  } else if (event.type === "update") {
    return onTaskUpdate(event);
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

  if (fromUser.id === toUser.id) {
    // do not notify users about tasks created by themselves
    return;
  }

  const teamId = topic.team_id;
  const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`;
  const slackFrom = await getSlackUserMentionOrLabel(fromUser, teamId);
  const taskLabel = MENTION_TYPE_LABELS[task.type as MentionType] ?? "attention";
  await sendNotificationPerPreference(toUser, teamId, {
    email: {
      subject: `${fromUser.name} has asked for your ${taskLabel} in ${topic.name}`,
      html: `Click <a href="${topicURL}">here</a> to find out what they need.`,
    },
    slack: `${slackFrom} has asked for your *${taskLabel}* in ${createSlackLink(topicURL, topic.name)}`,
  });
}

async function onTaskUpdate({ item: task, itemBefore: taskBefore, userId }: UpdateHasuraEvent<Task>) {
  const topic = await db.topic.findFirst({ where: { message: { some: { id: task.message_id } } } });

  assert(topic, "must have topic");

  if (userId && task.done_at && task.done_at !== taskBefore.done_at) {
    // userId is null when the update is not triggered through the frontend
    trackBackendUserEvent(userId, "Marked Task As Done", {
      taskType: task.type as RequestType,
      topicId: topic.id,
      origin: "unknown",
    });
  }

  tryUpdateTopicSlackMessage(topic).catch((error) => Sentry.captureException(error));

  const amountOfOpenTasksLeft = await db.task.count({
    where: {
      message: { topic_id: { equals: topic.id } },
      done_at: {
        equals: null,
      },
    },
  });

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

import { addMinutes } from "date-fns";
import { groupBy } from "lodash";

import { createRequestIsDue, createRequestIsDueIn3Hours } from "~backend/src/notifications/bodyBuilders/requestIsDue";
import { sendNotificationPerPreference } from "~backend/src/notifications/sendNotification";
import { backendGetTopicUrl } from "~backend/src/topics/url";
import { db } from "~db";

const findTasksDueBetween = (gt: Date, lte: Date) =>
  db.task.findMany({
    where: {
      message: { message_task_due_date: { due_at: { gt, lte } }, topic: { closed_at: { equals: null } } },
      done_at: { equals: null },
    },
    include: { message: { include: { message_task_due_date: true, topic: true, user: true } }, user: true },
  });

async function requestIsDueIn3Hours(now: Date) {
  const inThreeHours = addMinutes(now, 3 * 60);
  // NOTE! This is highly tightly coupled with the cron job timer. */15 (every 15 minutes)
  const inTwoHoursAnd45Minutes = addMinutes(inThreeHours, -15);
  const tasks = await findTasksDueBetween(inTwoHoursAnd45Minutes, inThreeHours);

  for (const task of tasks) {
    const message = createRequestIsDueIn3Hours({
      topicId: task.message.topic_id,
      topicName: task.message.topic.name,
      taskCreatorName: task.message.user.name,
      topicURL: await backendGetTopicUrl(task.message.topic),
    });
    sendNotificationPerPreference(task.user, task.message.topic.team_id, message, task.message.topic_id);
  }
}

async function requestIsDue(now: Date) {
  // NOTE! This is highly tightly coupled with the cron job timer. */15 (every 15 minutes)
  const fifteenMinutesAgo = addMinutes(now, -15);
  const tasks = await findTasksDueBetween(fifteenMinutesAgo, now);

  const tasksByTopicId = groupBy(tasks, "message.topic_id");
  for (const topicId in tasksByTopicId) {
    const topicTasks = tasksByTopicId[topicId];
    const message = createRequestIsDue({
      openTasks: topicTasks.length,
      topicName: topicTasks[0].message.topic.name,
      topicId,
      topicURL: await backendGetTopicUrl(topicTasks[0].message.topic),
    });
    sendNotificationPerPreference(topicTasks[0].message.user, topicTasks[0].message.topic.team_id, message, topicId);
  }
}

export async function proactiveNotifications() {
  const now = new Date();
  await requestIsDueIn3Hours(now);
  await requestIsDue(now);
}

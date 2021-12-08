import { addMinutes } from "date-fns";

import { createAllRequestsDoneNotificationMessage } from "~backend/src/notifications/bodyBuilders/allRequestsDone";
import { createRequestIsDue } from "~backend/src/notifications/bodyBuilders/requestIsDue";
import { sendNotificationPerPreference } from "~backend/src/notifications/sendNotification";
import { backendGetTopicUrl } from "~backend/src/topics/url";
import { db } from "~db";

export async function proactiveNotifications() {
  const now = new Date();

  const inThreeHours = addMinutes(now, 3 * 60);
  // NOTE! This is highly tightly coupled with the cron job timer. */15 (every 15 minutes)
  const inTwoHoursAnd45Minutes = addMinutes(inThreeHours, -15);
  const tasks = await db.task.findMany({
    where: {
      message: {
        message_task_due_date: {
          due_at: {
            gt: inTwoHoursAnd45Minutes,
            lte: inThreeHours,
          },
        },
        topic: {
          closed_at: {
            equals: null,
          },
        },
      },
    },
    include: {
      message: {
        include: {
          message_task_due_date: true,
          topic: true,
          user: true,
        },
      },
      user: true,
    },
  });
  for (const task of tasks) {
    const message = createRequestIsDue({
      topicId: task.message.topic_id,
      topicName: task.message.topic.name,
      taskCreatorName: task.message.user.name,
      topicURL: await backendGetTopicUrl(task.message.topic),
    });
    console.log(message);
    await sendNotificationPerPreference(task.user, task.message.topic.team_id, message);
  }
}

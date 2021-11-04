import { addMinutes } from "date-fns";

import { db } from "~db";
import { routes } from "~shared/routes";

import { createAllRequestsDoneNotificationMessage } from "../notifications/bodyBuilders/allRequestsDone";

export async function delayedTopicRequestsDoneNotifications() {
  const now = new Date();

  // NOTE! This is highly tightly coupled with the cron job timer. */15 (every 15 minutes)
  // We'll have repeat notifications if the below values are changes without the cronjob changing
  const fifteenMinutesAgo = addMinutes(now, -15);
  const thirtyMinutesAgo = addMinutes(now, -30);

  const topicsToNotify = await db.topic.findMany({
    where: {
      closed_at: {
        equals: null,
      },
      all_tasks_done_at: {
        gte: thirtyMinutesAgo,
        lte: fifteenMinutesAgo,
      },
    },
  });

  for (const topic of topicsToNotify) {
    const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`;
    createAllRequestsDoneNotificationMessage({ topicId: topic.id, topicName: topic.name, topicURL });
  }
}

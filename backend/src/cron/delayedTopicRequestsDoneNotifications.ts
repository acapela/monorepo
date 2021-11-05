import { addMinutes } from "date-fns";

import { db } from "~db";
import { assert } from "~shared/assert";
import { routes } from "~shared/routes";

import { createAllRequestsDoneNotificationMessage } from "../notifications/bodyBuilders/allRequestsDone";
import { sendNotificationPerPreference } from "../notifications/sendNotification";

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
    const topicOwner = await db.user.findFirst({ where: { id: topic.owner_id } });

    assert(topicOwner, `Owner ${topic.owner_id} not found.`);

    // Don't notify owner if they complete their own task
    if (topic.last_task_done_by === topicOwner.id) {
      continue;
    }

    const topicURL = `${process.env.FRONTEND_URL}${routes.topic({ topicSlug: topic.slug })}`;

    sendNotificationPerPreference(
      topicOwner,
      topic.team_id,
      createAllRequestsDoneNotificationMessage({ topicId: topic.id, topicName: topic.name, topicURL })
    );
  }
}

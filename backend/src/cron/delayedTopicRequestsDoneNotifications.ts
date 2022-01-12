import { addMinutes } from "date-fns";

import { db } from "@aca/db";
import { assert } from "@aca/shared/assert";

import { createAllRequestsDoneNotificationMessage } from "../notifications/bodyBuilders/allRequestsDone";
import { sendNotificationPerPreference } from "../notifications/sendNotification";
import { backendGetTopicUrl } from "../topics/url";

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
        gt: thirtyMinutesAgo,
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

    const topicURL = await backendGetTopicUrl(topic);

    sendNotificationPerPreference(
      topicOwner,
      topic.team_id,
      createAllRequestsDoneNotificationMessage({ topicId: topic.id, topicName: topic.name, topicURL }),
      topic.id
    );
  }
}

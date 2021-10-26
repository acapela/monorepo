import { addDays } from "date-fns";

import { db } from "~db";

export async function autoArchiveTopics() {
  const now = new Date();
  const oneDayAgo = addDays(now, -1);
  return db.topic.updateMany({
    where: {
      closed_at: {
        lte: oneDayAgo,
      },
      archived_at: null,
    },
    data: {
      archived_at: now,
    },
  });
}

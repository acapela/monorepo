import { addBusinessDays } from "date-fns";

import { db } from "@aca/db";

export async function autoArchiveOrCloseTopics() {
  return Promise.all([autoCloseTopics(), autoArchiveTopics()]);
}

async function autoArchiveTopics() {
  const now = new Date();
  const oneDayAgo = addBusinessDays(now, -1);
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

async function autoCloseTopics() {
  const now = new Date();
  const oneDayAgo = addBusinessDays(now, -1);

  return db.topic.updateMany({
    where: {
      closed_at: {
        equals: null,
      },
      AND: {
        all_tasks_done_at: {
          lte: oneDayAgo,
        },
        message: {
          every: {
            created_at: {
              lte: oneDayAgo,
            },
          },
        },
      },
    },
    data: {
      closed_at: now,
    },
  });
}

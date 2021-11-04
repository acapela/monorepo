import { addBusinessDays } from "date-fns";

import { db } from "~db";

// Close topics where all tasks have been completed for more than a day and last message was more than a day ago.
export async function autoCloseTopics() {
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

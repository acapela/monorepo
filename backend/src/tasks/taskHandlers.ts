import { Topic, db } from "~db";

export async function markAllOpenTasksAsDone(topic: Topic) {
  const nowInTimestamp = new Date().toISOString();

  return await db.task.updateMany({
    data: {
      done_at: nowInTimestamp,
    },
    where: {
      AND: {
        message: {
          topic_id: { equals: topic.id },
        },
        done_at: { equals: null },
      },
    },
  });
}

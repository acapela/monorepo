import { HasuraEvent } from "~backend/src/hasura";
import { Task, Topic, db } from "~db";

export async function handleTaskChanges(event: HasuraEvent<Task>) {
  await db.message.update({ where: { id: event.item.message_id }, data: { updated_at: new Date() } });
}

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

import { minBy } from "lodash";

import { TopicWithOpenTask } from "./types";

export function getMostUrgentTask(topic: TopicWithOpenTask) {
  // TODO this will need to be updated in the year 3k
  const mostUrgentMessage = minBy(
    topic.message,
    (message) => (message.task[0] && message.message_task_due_date?.due_at) ?? new Date(3000, 0)
  );
  const mostUrgentTask = mostUrgentMessage?.task[0];
  const mostUrgentDueDate = mostUrgentMessage?.message_task_due_date?.due_at;

  return {
    mostUrgentMessage,
    mostUrgentTask,
    mostUrgentDueDate,
  } as const;
}

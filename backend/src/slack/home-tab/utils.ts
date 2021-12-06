import { minBy } from "lodash";

import { TopicWithOpenTask } from "./types";

// TODO this will need to be updated in the year 3k
export const getMostUrgentMessage = ({ message }: TopicWithOpenTask) =>
  minBy(message, (message) => (message.task[0] && message.message_task_due_date?.due_at) ?? new Date(3000, 0));

import { minBy } from "lodash";
import { Blocks } from "slack-block-builder";

import { MessageTaskDueDate } from "~db";

// TODO this will need to be updated in the year 3k
export const getMostUrgentMessage = <T extends { message_task_due_date: MessageTaskDueDate | null }>(messages: T[]) =>
  minBy(messages, (message) => message.message_task_due_date?.due_at ?? new Date(3000, 0));

export const Padding = Blocks.Section({ text: " " });

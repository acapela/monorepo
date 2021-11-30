import { min } from "date-fns";

import { cachedComputed } from "~clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { isNotNullish } from "~shared/nullish";

export const getNearestTaskDueDateForCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    const selfTasks = topic.tasks.query({ isAssignedToSelf: true, isDone: false }).all;

    if (!selfTasks.length) return null;

    const selfDueDates = selfTasks.map((task) => task.message?.dueDate).filter(isNotNullish);

    return selfDueDates.length > 0 ? min(selfDueDates) ?? null : null;
  },
  { name: "getNearestTaskDueDateForCurrentUser" }
);

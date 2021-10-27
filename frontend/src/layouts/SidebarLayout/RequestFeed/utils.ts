import { createEntityCache } from "~clientdb";
import { lazyComputedWithArgs } from "~clientdb/entity/utils/lazyComputedWithArgs";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";

const sortByEarliestTaskDueDate = (task: TaskEntity) => task.due_at;

export const getUnfinishedTopicTaskWithEarliestDueDate = lazyComputedWithArgs((topic: TopicEntity) => {
  return topic.tasks.query({ isAssignedToSelf: true, hasDueDate: true, isDone: false }, sortByEarliestTaskDueDate)
    .first;
});

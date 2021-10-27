import { cachedComputed } from "~clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";

const sortByEarliestTaskDueDate = (task: TaskEntity) => task.due_at;

export const getUnfinishedTopicTaskWithEarliestDueDate = cachedComputed((topic: TopicEntity) => {
  return topic.tasks.query({ isAssignedToSelf: true, hasDueDate: true, isDone: false }, sortByEarliestTaskDueDate)
    .first;
});

import { createEntityCache } from "~frontend/../../clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";

const sortByEarliestTaskDueDate = (task: TaskEntity) => task.due_at;

export const getUnfinishedTopicTaskWithEarliestDueDate = createEntityCache((topic: TopicEntity) => {
  return topic.tasks.query({ isAssignedToSelf: true, hasDueDate: true, isDone: false }, sortByEarliestTaskDueDate)
    .first;
});

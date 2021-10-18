import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";

const sortByEarliestTaskDueDate = (task: TaskEntity) => task.due_at;
const filterByUnfinishedTasksAssignedToCurrentUser = (task: TaskEntity) =>
  task.isAssignedToSelf && !!task.due_at && !task.isDone;

export function getUnfinishedTopicTaskWithEarliestDueDate(topic: TopicEntity) {
  return topic.tasks.query(filterByUnfinishedTasksAssignedToCurrentUser, sortByEarliestTaskDueDate).first;
}

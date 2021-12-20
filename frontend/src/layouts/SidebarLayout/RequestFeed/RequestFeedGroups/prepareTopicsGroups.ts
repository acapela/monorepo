import { min } from "date-fns";
import { orderBy, sortBy } from "lodash";

import { cachedComputed } from "~clientdb";
import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";
import { isNotNullish } from "~shared/nullish";

import { getNearestTaskDueDateForCurrentUser } from "./shared";

const hasTopicOpenTasksForCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isAssignedToSelf: true, isDone: false }).hasItems;
  },
  { name: "hasTopicOpenTasksForCurrentUser" }
);

const isTaskSelfCreated = cachedComputed((task: TaskEntity) => task.isSelfCreated);

const hasTopicSentTasksByCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isDone: false }).query(isTaskSelfCreated).hasItems;
  },
  { name: "hasTopicSentTasksByCurrentUser" }
);

const getNearestTaskDueDateCreatedByCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    const createdTasks = topic.tasks.query({ isDone: false }).query(isTaskSelfCreated).all;

    if (!createdTasks.length) return null;

    const selfDueDates = createdTasks.map((task) => task.message?.dueDate).filter(isNotNullish);
    return min(selfDueDates) ?? null;
  },
  { name: "getNearestTaskDueDateCreatedByCurrentUser" }
);

function sortReceivedTopics(topics: TopicEntity[]) {
  return sortBy(topics, getNearestTaskDueDateForCurrentUser);
}

function sortSentTopics(topics: TopicEntity[]) {
  return sortBy(topics, getNearestTaskDueDateCreatedByCurrentUser);
}

export function prepareTopicsGroups(topics: TopicEntity[]) {
  const [archived, notArchived] = groupByFilter(topics, (topic) => topic.isArchived);
  const [closedTopics, allOpenTopics] = groupByFilter(notArchived, (topic) => topic.isClosed);
  const [receivedTasks, notReceivedTasks] = groupByFilter(allOpenTopics, hasTopicOpenTasksForCurrentUser);
  const [sentTasks, remainingUncategorizedOpenTopics] = groupByFilter(notReceivedTasks, hasTopicSentTasksByCurrentUser);

  return {
    receivedTasks: sortReceivedTopics(receivedTasks),
    sentTasks: sortSentTopics(sentTasks),
    openTopics: remainingUncategorizedOpenTopics,
    closedTopics,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    archived: orderBy(archived, (t) => t.archived_at!, "desc"),
  };
}

import { min, sortBy } from "lodash";
import { observer } from "mobx-react";
import styled from "styled-components";

import { lazyComputedWithArgs } from "~clientdb/entity/utils/lazyComputedWithArgs";
import { TopicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";
import { isNotNullish } from "~shared/nullish";

import { RequestsGroup } from "./RequestsGroup";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
}

const hasTopicOpenTasksForCurrentUser = lazyComputedWithArgs(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isAssignedToSelf: true, isDone: false }).hasItems;
  },
  { name: "hasTopicOpenTasksForCurrentUser" }
);

const hasTopicSentTasksByCurrentUser = lazyComputedWithArgs(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isSelfCreated: true, isDone: false }).hasItems;
  },
  { name: "hasTopicSentTasksByCurrentUser" }
);

const getNearestTaskDueDateForCurrentUser = lazyComputedWithArgs(
  (topic: TopicEntity) => {
    const selfTasks = topic.tasks.query({ isAssignedToSelf: true, isDone: false }).all;

    if (!selfTasks.length) return null;

    const selfDueDates = selfTasks
      .map((task) => task.due_at)
      .filter(isNotNullish)
      .map((dateString) => new Date(dateString));
    return min(selfDueDates) ?? null;
  },
  { name: "getNearestTaskDueDateForCurrentUser" }
);

const getNearestTaskDueDateCreatedByCurrentUser = lazyComputedWithArgs(
  (topic: TopicEntity) => {
    const createdTasks = topic.tasks.query({ isDone: false, isSelfCreated: true }).all;

    if (!createdTasks.length) return null;

    const selfDueDates = createdTasks
      .map((task) => task.due_at)
      .filter(isNotNullish)
      .map((dateString) => new Date(dateString));
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

function prepareTopicsGroups(topics: TopicEntity[]) {
  const [archived, notArchived] = groupByFilter(topics, (topic) => topic.isArchived);
  const [closedTopics, allOpenTopics] = groupByFilter(notArchived, (topic) => topic.isClosed);
  const [receivedTasks, notReceivedTasks] = groupByFilter(allOpenTopics, hasTopicOpenTasksForCurrentUser);
  const [sentTasks, remainingUncategorizedOpenTopics] = groupByFilter(notReceivedTasks, hasTopicSentTasksByCurrentUser);

  return {
    receivedTasks: sortReceivedTopics(receivedTasks),
    sentTasks: sortSentTopics(sentTasks),
    openTopics: remainingUncategorizedOpenTopics,
    closedTopics,
    archived,
  };
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = prepareTopicsGroups(topics);

  return (
    <UIHolder>
      {!!receivedTasks.length && <RequestsGroup topics={receivedTasks} groupName="Received" />}
      {!!sentTasks.length && <RequestsGroup topics={sentTasks} groupName="Sent" />}
      {!!openTopics.length && <RequestsGroup topics={openTopics} groupName="Open" />}
      {!!closedTopics.length && <RequestsGroup topics={closedTopics} groupName="Closed" />}
      {showArchived && !!archived.length && <RequestsGroup topics={archived} groupName="Archived" />}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

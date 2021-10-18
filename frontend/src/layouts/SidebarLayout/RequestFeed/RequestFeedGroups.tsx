import { differenceInHours, isBefore } from "date-fns";
import { observer } from "mobx-react";
import styled from "styled-components";

import { TopicEntity, topicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";

import { RequestsGroup } from "./RequestsGroup";
import { getUnfinishedTopicTaskWithEarliestDueDate } from "./utils";

interface Props {
  topics: TopicEntity[];
}

function isTopicUrgent(topic: TopicEntity) {
  const rawDueDate = getUnfinishedTopicTaskWithEarliestDueDate(topic)?.due_at;

  const isTopicWithoutDueDate = !rawDueDate;
  if (isTopicWithoutDueDate) {
    return false;
  }

  const now = new Date();
  const dueDate = new Date(rawDueDate);

  const isTopicPastDue = isBefore(dueDate, now);
  if (isTopicPastDue) {
    return true;
  }

  const isTopicDueWithinNext24Hours = Math.abs(differenceInHours(now, dueDate)) < 24;
  if (isTopicDueWithinNext24Hours) {
    return true;
  }

  return false;
}

function prepareTopicsGroups(topics: TopicEntity[]) {
  const [urgentTopics, notUrgentTopics] = groupByFilter(topics, isTopicUrgent);
  const [newTopics, notNewTopics] = groupByFilter(notUrgentTopics, (topic) => topic.isNew);
  const [openTopics, closedTopics] = groupByFilter(notNewTopics, (topic) => !topic.isClosed);

  return {
    urgentTopics,
    newTopics,
    openTopics,
    closedTopics,
  };
}

export const RequestFeedGroups = observer(({ topics }: Props) => {
  const { urgentTopics, newTopics, openTopics, closedTopics } = prepareTopicsGroups(topics);

  return (
    <UIHolder>
      {!!urgentTopics.length && <RequestsGroup topics={urgentTopics} groupName="Requires Attention" />}
      {!!newTopics.length && <RequestsGroup topics={newTopics} groupName="New" />}
      {!!openTopics.length && <RequestsGroup topics={openTopics} groupName="Open" />}
      {!!closedTopics.length && <RequestsGroup topics={closedTopics} groupName="Closed" />}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

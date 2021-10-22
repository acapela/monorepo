import { differenceInHours, isBefore } from "date-fns";
import { observer } from "mobx-react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";

import { RequestsGroup } from "./RequestsGroup";
import { getUnfinishedTopicTaskWithEarliestDueDate } from "./utils";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
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

  const isTopicDueWithinNext24Hours = differenceInHours(dueDate, now) < 24;
  if (isTopicDueWithinNext24Hours) {
    return true;
  }

  return false;
}

function prepareTopicsGroups(topics: TopicEntity[]) {
  const [urgentTopics, notUrgentTopics] = groupByFilter(topics, isTopicUrgent);
  const [newTopics, notNewTopics] = groupByFilter(notUrgentTopics, (topic) => topic.isNew);
  const [openTopics, closedTopics] = groupByFilter(notNewTopics, (topic) => !topic.isClosed);
  const [recentlyClosed, archived] = groupByFilter(closedTopics, (topic) => !topic.isArchived);

  return {
    urgentTopics,
    newTopics,
    openTopics,
    recentlyClosed,
    archived,
  };
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const { urgentTopics, newTopics, openTopics, recentlyClosed, archived } = prepareTopicsGroups(topics);

  return (
    <UIHolder>
      {!!urgentTopics.length && <RequestsGroup topics={urgentTopics} groupName="Requires Attention" />}
      {!!newTopics.length && <RequestsGroup topics={newTopics} groupName="New" />}
      {!!openTopics.length && <RequestsGroup topics={openTopics} groupName="Open" />}
      {!!recentlyClosed.length && <RequestsGroup topics={recentlyClosed} groupName="Closed" />}
      {showArchived && !!archived.length && <RequestsGroup topics={archived} groupName="Archived" />}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

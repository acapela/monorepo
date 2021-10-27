import { isAfter, startOfDay, startOfMonth, startOfWeek, sub, subDays, subWeeks } from "date-fns";
import { subBusinessDays } from "date-fns/esm";
import { min, sortBy } from "lodash";
import { observer } from "mobx-react";
import { useMemo } from "react";
import styled, { css } from "styled-components";

import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { theme } from "~frontend/../../ui/theme";
import { createEntityCache } from "~clientdb";
import { TopicEntity, topicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";
import { isNotNullish } from "~shared/nullish";
import { Toggle } from "~ui/toggle";

import { RequestsGroup, RequestsGroupProps } from "./RequestsGroup";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
}

const hasTopicOpenTasksForCurrentUser = createEntityCache((topic: TopicEntity) => {
  return topic.tasks.query({ isAssignedToSelf: true, isDone: false }).hasItems;
});

const hasTopicSentTasksByCurrentUser = createEntityCache((topic: TopicEntity) => {
  return topic.tasks.query({ isSelfCreated: true, isDone: false }).hasItems;
});

const getNearestTaskDueDateForCurrentUser = createEntityCache((topic: TopicEntity) => {
  const selfTasks = topic.tasks.query({ isAssignedToSelf: true, isDone: false }).all;

  if (!selfTasks.length) return null;

  const selfDueDates = selfTasks
    .map((task) => task.due_at)
    .filter(isNotNullish)
    .map((dateString) => new Date(dateString));
  return min(selfDueDates) ?? null;
});

const getNearestTaskDueDateCreatedByCurrentUser = createEntityCache((topic: TopicEntity) => {
  const createdTasks = topic.tasks.query({ isDone: false, isSelfCreated: true }).all;

  if (!createdTasks.length) return null;

  const selfDueDates = createdTasks
    .map((task) => task.due_at)
    .filter(isNotNullish)
    .map((dateString) => new Date(dateString));
  return min(selfDueDates) ?? null;
});

function sortReceivedTopics(topics: TopicEntity[]) {
  return sortBy(topics, getNearestTaskDueDateForCurrentUser);
}

function sortSentTopics(topics: TopicEntity[]) {
  return sortBy(topics, getNearestTaskDueDateCreatedByCurrentUser);
}

function prepareTopicsGroups(topics: TopicEntity[]) {
  const [archived, notArchived] = groupByFilter(topics, (topic) => topic.isArchived);
  const [receivedTasks, notReceivedTasks] = groupByFilter(notArchived, hasTopicOpenTasksForCurrentUser);
  const [sentTasks, notSentTasks] = groupByFilter(notReceivedTasks, hasTopicSentTasksByCurrentUser);
  const [openTopics, closedTopics] = groupByFilter(notSentTasks, (topic) => !topic.isClosed);

  return {
    receivedTasks: sortReceivedTopics(receivedTasks),
    sentTasks: sortSentTopics(sentTasks),
    openTopics,
    closedTopics,
    archived,
  };
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = prepareTopicsGroups(topics);

  const [isShowingArchived, { toggle: toggleShowArchived }] = useBoolean(false);

  const archivedGroups: RequestsGroupProps[] = useMemo(() => {
    const groups: RequestsGroupProps[] = [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toArchivedDate = (topic: TopicEntity) => new Date(topic.archived_at!);
    const happenedWithin = (compareDate: Date) => (topic: TopicEntity) => isAfter(toArchivedDate(topic), compareDate);

    const now = new Date();
    const sameTimeYesterday = subBusinessDays(now, 1);
    const sameTimeLastWeek = subWeeks(now, 1);

    const [today, notToday] = groupByFilter(archived, happenedWithin(startOfDay(now)));
    if (today.length > 0) {
      groups.push({ groupName: "Today", topics: today });
    }

    const [yesterday, notYesterday] = groupByFilter(notToday, happenedWithin(startOfDay(sameTimeYesterday)));
    if (yesterday.length > 0) {
      groups.push({ groupName: "Yesterday", topics: yesterday });
    }

    const [thisWeek, notThisWeek] = groupByFilter(notYesterday, happenedWithin(startOfWeek(now)));
    if (thisWeek.length > 0) {
      groups.push({ groupName: "Rest of this week", topics: thisWeek });
    }

    const [lastWeek, notLast2Weeks] = groupByFilter(notThisWeek, happenedWithin(startOfWeek(sameTimeLastWeek)));
    if (lastWeek.length > 0) {
      groups.push({ groupName: "Last week", topics: lastWeek });
    }

    if (notLast2Weeks.length > 0) {
      groups.push({ groupName: "All", topics: notLast2Weeks });
    }

    return groups;
  }, [archived]);

  console.log({ archivedGroups });

  return (
    <UIHolder>
      {!isShowingArchived && (
        <>
          {!!receivedTasks.length && <RequestsGroup topics={receivedTasks} groupName="Received" />}
          {!!sentTasks.length && <RequestsGroup topics={sentTasks} groupName="Sent" />}
          {!!openTopics.length && <RequestsGroup topics={openTopics} groupName="Open" />}
          {!!closedTopics.length && <RequestsGroup topics={closedTopics} groupName="Closed" />}
          {showArchived && !!archived.length && <RequestsGroup topics={archived} groupName="Archived" />}
        </>
      )}

      <UIArchivedToggle onClick={toggleShowArchived} isShowingArchived={isShowingArchived}>
        <Toggle isSet={isShowingArchived} size="small" /> <div>Show archived</div>
      </UIArchivedToggle>

      {isShowingArchived && (
        <>
          {archivedGroups.map(({ groupName, topics }) => (
            <RequestsGroup key={groupName} topics={topics} groupName={groupName} />
          ))}
        </>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  overflow-x: hidden;
`;

const UIArchivedToggle = styled.div<{ isShowingArchived: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
  padding-left: 22px;
  ${(props) =>
    props.isShowingArchived
      ? css`
          padding-bottom: 10px;
        `
      : css`
          padding-bottom: 40px;
        `}
  ${theme.spacing.horizontalActions.asGap}
  ${theme.typo.item.secondaryTitle}
  opacity: 0.6;
  cursor: pointer;
`;

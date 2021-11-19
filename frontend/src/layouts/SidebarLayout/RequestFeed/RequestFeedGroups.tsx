import {
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subBusinessDays,
  subWeeks,
} from "date-fns";
import { subMonths } from "date-fns/esm";
import { AnimatePresence, motion } from "framer-motion";
import { min, orderBy, sortBy } from "lodash";
import { observer } from "mobx-react";
import React, { useMemo, useRef } from "react";
import styled, { css } from "styled-components";

import { useBoundingBox } from "~frontend/../../shared/hooks/useBoundingBox";
import { cachedComputed } from "~clientdb/entity/utils/cachedComputed";
import { TopicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";
import { useBoolean } from "~shared/hooks/useBoolean";
import { isNotNullish } from "~shared/nullish";
import { IconChevronDown } from "~ui/icons";
import { theme } from "~ui/theme";

import { RequestsGroup, RequestsGroupProps } from "./RequestsGroup";

interface Props {
  topics: TopicEntity[];
  showArchived?: boolean;
}

// TODO; optimize enough to show more topics
const SHOW_RECENT_ONLY = true;

const ANIMATION_DURATION = 0.55;

const hasTopicOpenTasksForCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isAssignedToSelf: true, isDone: false }).hasItems;
  },
  { name: "hasTopicOpenTasksForCurrentUser" }
);

const hasTopicSentTasksByCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    return topic.tasks.query({ isSelfCreated: true, isDone: false }).hasItems || topic.isOwn;
  },
  { name: "hasTopicSentTasksByCurrentUser" }
);

const getNearestTaskDueDateForCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    const selfTasks = topic.tasks.query({ isAssignedToSelf: true, isDone: false }).all;

    if (!selfTasks.length) return null;

    const selfDueDates = selfTasks.map((task) => task.message?.dueDate).filter(isNotNullish);
    return min(selfDueDates) ?? null;
  },
  { name: "getNearestTaskDueDateForCurrentUser" }
);

const getNearestTaskDueDateCreatedByCurrentUser = cachedComputed(
  (topic: TopicEntity) => {
    const createdTasks = topic.tasks.query({ isDone: false, isSelfCreated: true }).all;

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    archived: orderBy(archived, (t) => t.archived_at!, "desc"),
  };
}

export const RequestFeedGroups = observer(({ topics, showArchived = false }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const boundingBox = useBoundingBox(ref);

  // MBA m1 2021 -> 186 ms to process (archived orderBy is main culprit)
  const { receivedTasks, sentTasks, openTopics, closedTopics, archived } = prepareTopicsGroups(topics);

  const [isShowingArchivedTimeline, { toggle: toggleShowArchived }] = useBoolean(false);

  // MBA m1 2021 -> 26 ms to process
  const archivedGroups: RequestsGroupProps[] = useMemo(() => {
    const groups: RequestsGroupProps[] = [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toArchivedDate = (topic: TopicEntity) => new Date(topic.archived_at!);
    const happenedWithin = (compareDate: Date) => (topic: TopicEntity) => isAfter(toArchivedDate(topic), compareDate);

    const now = new Date();
    const sameTimeYesterday = subBusinessDays(now, 1);
    const sameTimeLastWeek = subWeeks(now, 1);
    const sameTimeLastMonth = subMonths(now, 1);

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

    const [lastWeek, notLastWeek] = groupByFilter(notThisWeek, happenedWithin(startOfWeek(sameTimeLastWeek)));
    if (lastWeek.length > 0) {
      groups.push({ groupName: "Last week", topics: lastWeek });
    }

    if (SHOW_RECENT_ONLY) {
      return groups;
    }

    const [restOfMonth, allRemaining] = groupByFilter(notLastWeek, happenedWithin(startOfMonth(sameTimeLastMonth)));
    if (restOfMonth.length > 0) {
      groups.push({ groupName: "Rest of month", topics: lastWeek });
    }

    let remainingDays = allRemaining;

    while (remainingDays.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const beginningOfMonth = new Date(remainingDays[0].archived_at!);

      const previousMonth = endOfMonth(endOfDay(subMonths(beginningOfMonth, 1)));

      const [month, remaining] = groupByFilter(remainingDays, happenedWithin(previousMonth));
      if (month.length > 0) {
        const groupName = format(beginningOfMonth, "MMMM uuuu");
        groups.push({ groupName, topics: month });
      }

      remainingDays = remaining;
    }

    return groups;
  }, [archived]);

  return (
    <UIHolder ref={ref} data-test-id="sidebar-all-request-groups" $isShowingArchived={isShowingArchivedTimeline}>
      <UIArchivedToggle
        layout="position"
        layoutId="sidebar-archive-toggle"
        transition={{ duration: ANIMATION_DURATION }}
        initial={{ y: 0 }}
        animate={{
          y: isShowingArchivedTimeline ? -boundingBox.height + 58 : 0,
        }}
        onClick={toggleShowArchived}
        $isShowingArchived={isShowingArchivedTimeline}
      >
        {!isShowingArchivedTimeline && <>Show recently archived requests</>}
        {isShowingArchivedTimeline && <>Hide recently archived requests</>}
        <IconChevronDown />
      </UIArchivedToggle>

      <AnimatePresence key="first" initial={false}>
        {!isShowingArchivedTimeline && (
          <UIScrollableGroup
            key="archived"
            layout="position"
            layoutId="sidebar-unarchived-topics"
            // Add height of UIArchiveToggle + padding from top
            initial={{ y: -boundingBox.height + 72 }}
            animate={{ y: 12 }}
            exit={{ y: -boundingBox.height + 72 }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            {!!receivedTasks.length && <RequestsGroup key="Received" topics={receivedTasks} groupName="Received" />}
            {!!sentTasks.length && <RequestsGroup key="Sent" topics={sentTasks} groupName="Sent" />}
            {!!openTopics.length && <RequestsGroup key="Open" topics={openTopics} groupName="Open" />}
            {!!closedTopics.length && <RequestsGroup key="Closed" topics={closedTopics} groupName="Closed" />}
            {showArchived && !!archived.length && (
              <RequestsGroup key="Archived" topics={archived} groupName="Archived" />
            )}
          </UIScrollableGroup>
        )}
      </AnimatePresence>

      <AnimatePresence key="second">
        {isShowingArchivedTimeline && (
          <UIScrollableGroup
            key="unarchived"
            layout="position"
            layoutId="sidebar-archived-topics"
            initial={{ y: boundingBox.height }}
            animate={{ y: 60 }}
            exit={{ y: boundingBox.height }}
            transition={{ duration: ANIMATION_DURATION }}
          >
            {archivedGroups.map(({ groupName, topics }) => (
              <RequestsGroup key={groupName} topics={topics} groupName={groupName} />
            ))}
          </UIScrollableGroup>
        )}
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div<{ $isShowingArchived: boolean }>`
  position: relative;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const UIScrollableGroup = styled(motion.div)<{}>`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: absolute;

  padding-bottom: 60px;
`;

const UIArchivedToggle = styled(motion.div)<{ $isShowingArchived: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: absolute;
  z-index: 2;
  bottom: 0;

  svg {
    font-size: 25px;
  }
  ${(props) =>
    props.$isShowingArchived
      ? css`
          border-top-width: 0px;
          svg {
            transform: rotate(180deg);
            transition-duration: ${ANIMATION_DURATION}s;
          }
        `
      : css`
          svg {
            transform: rotate(360deg);
            transition-duration: ${ANIMATION_DURATION}s;
          }
        `}
  ${theme.typo.content.semibold}
  ${theme.colors.text.asColor}
  ${theme.colors.layout.backgroundAccent.asBg}  
  cursor: pointer;

  border-color: rgba(0, 0, 0, 0.05);
  border-style: solid;
  border-top-width: 1px;
  border-bottom-width: 1px;
`;

import { differenceInDays, differenceInHours, differenceInMinutes, isBefore, isToday } from "date-fns";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import styled, { css } from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { useRouteParams } from "~frontend/hooks/useRouteParams";
import { routes } from "~shared/routes";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { RequestContentSnippet } from "./RequestContentSnippet";
import { RequestParticipants } from "./RequestParticipants";

interface Props {
  topic: TopicEntity;
}

const sortByEarliestDueDate = (task: TaskEntity) => task.due_at;
const filterByUnfinishedTasksAssingedToCurrentUser = (task: TaskEntity) =>
  task.isAssignedToSelf && !!task.due_at && !task.isDone;

const getRelativeDueTimeLabel = (rawDate: string) => {
  const dueDate = new Date(rawDate);
  const now = new Date();
  const isPastDue = isBefore(dueDate, now);
  const isDueToday = isToday(dueDate);

  const isLessThan1HourFromNow = Math.abs(differenceInMinutes(now, dueDate)) < 60;
  if (isLessThan1HourFromNow) {
    return isPastDue ? "Recently past due" : "Due soon";
  }

  const getHoursFromDueDate = () => (isPastDue ? differenceInHours(now, dueDate) : differenceInHours(dueDate, now));
  const getDaysFromDueDate = () => (isPastDue ? differenceInDays(now, dueDate) : differenceInDays(dueDate, now));

  const amount = isDueToday ? getHoursFromDueDate() : getDaysFromDueDate();
  const hourOrDay = isDueToday ? "Hour" : "Day";
  const singularOrPlural = amount !== 1 ? "s" : "";
  const agoOrLeft = isPastDue ? "Ago" : "Left";

  // * Examples *
  // 5 Hours Left
  // 1 Day Ago
  // 14 Days Left
  return `${amount} ${hourOrDay}${singularOrPlural} ${agoOrLeft}`;
};

export const RequestItem = observer(function RequestItem({ topic }: Props) {
  const topicRouteParams = useRouteParams(routes.topic);

  // TODO: Optimize by adding some sort of selector. Now each request item will re-render or route change.
  const isHighlighted = topicRouteParams.slug === topic.slug;

  const unreadMessagesCount = topic.unreadMessages.count;
  const unfinishedTaskWithEarliestDueDate = topic.tasks.query(
    filterByUnfinishedTasksAssingedToCurrentUser,
    sortByEarliestDueDate
  ).first;

  return (
    <Link passHref href={routes.topic({ topicSlug: topic.slug })}>
      <UIFeedItem isHighlighted={isHighlighted}>
        <RequestParticipants topic={topic} />
        <UIFeedItemLabels>
          <HStack alignItems="center">
            <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
            {unreadMessagesCount > 0 && <UIBubble>{unreadMessagesCount}</UIBubble>}
          </HStack>
          <UIFeedItemSubTitle>
            {!unfinishedTaskWithEarliestDueDate && <RequestContentSnippet topic={topic} />}

            {unfinishedTaskWithEarliestDueDate && (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <>{getRelativeDueTimeLabel(unfinishedTaskWithEarliestDueDate.due_at!)}</>
            )}
          </UIFeedItemSubTitle>
        </UIFeedItemLabels>
      </UIFeedItem>
    </Link>
  );
});

const UIFeedItem = styled.a<{ isHighlighted?: boolean }>`
  display: flex;
  ${theme.box.item};
  ${theme.spacing.horizontalActions.asGap};
  ${theme.radius.primaryItem}

  align-items: center;

  ${theme.transitions.hover()};

  &:hover {
    background-color: hsla(0, 0%, 0%, 0.025);
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      &&& {
        background-color: hsla(0, 0%, 0%, 0.05);
      }
    `}
`;

const UIFeedItemLabels = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const UIFeedItemTitle = styled.h6`
  ${theme.typo.content.semibold.resetLineHeight};
`;

const UIBubble = styled.div`
  ${theme.radius.circle}
  margin-left: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.font.size(8).bold.resetLineHeight}
  background-color: rgba(0, 0, 0, 0.05);
`;

const UIFeedItemSubTitle = styled.div<{}>`
  ${theme.typo.item.subtitle};

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

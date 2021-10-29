import { differenceInDays, differenceInHours, differenceInMinutes, isBefore, isToday, startOfDay } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import Link from "next/link";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { useRouteParams } from "~frontend/hooks/useRouteParams";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { routes } from "~shared/routes";
import { getFadeInAnimationStyles } from "~ui/animations";
import { LazyRender } from "~ui/performance/LazyRender";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { RequestContentSnippet } from "./RequestContentSnippet";
import { RequestMessagePreview } from "./RequestMessagePreview";
import { RequestParticipants } from "./RequestParticipants";
import { getUnfinishedTopicTaskWithEarliestDueDate } from "./utils";

interface Props {
  topic: TopicEntity;
}

const getRelativeDueTimeLabel = (rawDate: string) => {
  const now = new Date();
  const dueDate = new Date(rawDate);
  const dayOfDueDate = startOfDay(dueDate);
  const today = startOfDay(now);

  const isPastDue = isBefore(dueDate, now);
  const isDueToday = isToday(dayOfDueDate);

  const isLessThan1HourFromNow = Math.abs(differenceInMinutes(now, dueDate)) < 60;
  if (isLessThan1HourFromNow) {
    return isPastDue ? "Recently past due" : "Due soon";
  }

  const getHoursFromDueDate = () => Math.abs(differenceInHours(now, dueDate));
  const getDaysFromDueDate = () => Math.abs(differenceInDays(today, dayOfDueDate));

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
  const elementRef = useRef<HTMLAnchorElement>(null);
  const isHovered = useIsElementOrChildHovered(elementRef);

  // TODO: Optimize by adding some sort of selector. Now each request item will re-render or route change.
  const isHighlighted = topicRouteParams.topicSlug === topic.slug;

  const unreadMessagesCount = topic.unreadMessages.count;
  const unfinishedTaskWithEarliestDueDate = getUnfinishedTopicTaskWithEarliestDueDate(topic);

  return (
    <>
      <AnimatePresence>
        {isHovered && !isHighlighted && <RequestMessagePreview anchorRef={elementRef} topic={topic} />}
      </AnimatePresence>

      <Link passHref href={routes.topic({ topicSlug: topic.slug })}>
        <UIFeedItem isHighlighted={isHighlighted} ref={elementRef}>
          <RequestParticipants topic={topic} />
          <UIFeedItemLabels>
            <HStack alignItems="center">
              <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
              {unreadMessagesCount > 0 && <UIBubble>{unreadMessagesCount}</UIBubble>}
            </HStack>
            <UIFeedItemSubTitle>
              {/* Content snippet requires booting up rich editor with plugins, lets make it lazy so it renders in next 'tick' */}
              {!unfinishedTaskWithEarliestDueDate && (
                <LazyRender fallback={<div>&nbsp;</div>}>
                  <RequestContentSnippet topic={topic} />
                </LazyRender>
              )}

              {unfinishedTaskWithEarliestDueDate && (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                <>{getRelativeDueTimeLabel(unfinishedTaskWithEarliestDueDate.due_at!)}</>
              )}
            </UIFeedItemSubTitle>
          </UIFeedItemLabels>
        </UIFeedItem>
      </Link>
    </>
  );
});

const UIFeedItem = styled.a<{ isHighlighted?: boolean }>`
  display: flex;
  ${theme.box.item};
  ${theme.spacing.actions.asGap};
  ${theme.radius.primaryItem}

  align-items: center;

  ${theme.transitions.hover()};

  &:hover {
    ${theme.colors.layout.backgroundAccent.hover.asBg}
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      &&& {
        ${theme.colors.layout.backgroundAccent.active.asBg}
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

  ${RequestContentSnippet} {
    ${getFadeInAnimationStyles(0.15)};
  }
`;

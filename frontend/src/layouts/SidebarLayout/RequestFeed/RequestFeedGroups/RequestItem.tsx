import { differenceInDays, differenceInHours, differenceInMinutes, isBefore, isToday, startOfDay } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import Link from "next/link";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { useRouteParams } from "@aca/frontend/hooks/useRouteParams";
import { niceFormatDate } from "@aca/shared/dates/format";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { routes } from "@aca/shared/routes";
import { getFadeInAnimationStyles } from "@aca/ui/animations";
import { LazyRender } from "@aca/ui/performance/LazyRender";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

import { RequestContentSnippet } from "../RequestContentSnippet";
import { RequestMessagePreview } from "../RequestMessagePreview";
import { RequestParticipants } from "../RequestParticipants";
import { getNearestTaskDueDateForCurrentUser } from "./shared";

interface Props {
  topic: TopicEntity;
}

const getRelativeDueTimeLabel = (dueDate: Date) => {
  const now = new Date();
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
  const topicRouteByHandleParams = useRouteParams(routes.topicByHandle);
  const elementRef = useRef<HTMLAnchorElement>(null);
  const isHovered = useIsElementOrChildHovered(elementRef);

  // TODO: Optimize by adding some sort of selector. Now each request item will re-render or route change.
  const isHighlighted = topicRouteByHandleParams.topicId === topic.id;

  const unreadMessagesCount = topic.unreadMessages.count;

  return (
    <>
      <AnimatePresence>
        {isHovered && !isHighlighted && <RequestMessagePreview anchorRef={elementRef} topic={topic} />}
      </AnimatePresence>

      <Link passHref href={topic.href}>
        <UIFeedItem $isHighlighted={isHighlighted} ref={elementRef}>
          <RequestParticipants topic={topic} />
          <UIFeedItemLabels>
            <HStack alignItems="center">
              <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
              {unreadMessagesCount > 0 && <UIBubble>{unreadMessagesCount}</UIBubble>}
            </HStack>
            <UIFeedItemSubTitle>
              {!topic.isArchived && <OpenTopicSubtitle topic={topic} />}
              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
              {topic.isArchived && <>Archived {niceFormatDate(new Date(topic.archived_at!))}</>}
            </UIFeedItemSubTitle>
          </UIFeedItemLabels>
        </UIFeedItem>
      </Link>
    </>
  );
});

const OpenTopicSubtitle = observer(function OpenTopicSubtitle({ topic }: { topic: TopicEntity }) {
  const currentUserUnfinishedDueDate = getNearestTaskDueDateForCurrentUser(topic);

  return (
    <>
      {/* Content snippet requires booting up rich editor with plugins, lets make it lazy so it renders in next 'tick' */}
      {!currentUserUnfinishedDueDate && (
        <LazyRender fallback={<div>&nbsp;</div>}>
          <RequestContentSnippet topic={topic} />
        </LazyRender>
      )}

      {currentUserUnfinishedDueDate && <>{getRelativeDueTimeLabel(currentUserUnfinishedDueDate)}</>}
    </>
  );
});

const UIFeedItem = styled.a<{ $isHighlighted?: boolean }>`
  display: flex;
  width: 100%;
  ${theme.box.item};
  ${theme.spacing.actions.asGap};
  ${theme.radius.primaryItem}

  align-items: center;

  ${theme.transitions.hover()};

  &:hover {
    ${theme.colors.layout.backgroundAccent.hover.asBg}
  }

  ${(props) =>
    props.$isHighlighted &&
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
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UIBubble = styled.div<{}>`
  ${theme.radius.circle}
  margin-left: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${theme.font.size(8).bold.resetLineHeight}
  ${theme.colors.secondary.asBgWithReadableText};
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

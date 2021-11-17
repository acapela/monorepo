import { differenceInMinutes, isSameDay } from "date-fns";
import { observer } from "mobx-react";
import React, { Fragment, useRef } from "react";
import styled from "styled-components";

import { layoutAnimations } from "~frontend/animations/layout";
import { MessageEntity } from "~frontend/clientdb/message";
import { TopicEventEntity } from "~frontend/clientdb/topicEvent";
import { niceFormatDate } from "~shared/dates/format";
import { theme } from "~ui/theme";

import { Message } from "./Message";
import { TopicEventFeedItem } from "./TopicEventFeedItem";

interface Props {
  feedItems: Array<MessageEntity | TopicEventEntity>;
  isReadonly?: boolean;
}

const CONSECUTIVE_MESSAGE_BUNDLING_THRESHOLD_IN_MINUTES = 15;

function shouldBundleCurrentMessageWithPrevious(
  currentMsg: MessageEntity,
  previousMessage: MessageEntity | null
): boolean {
  if (!previousMessage) {
    return false;
  }

  if (previousMessage.tasks.hasItems) return false;

  const isSameOwnerForBothMessages = previousMessage.user_id === currentMsg.user_id;
  if (!isSameOwnerForBothMessages) {
    return false;
  }

  const minutesBetweenCurrentAndPreviousMessage = differenceInMinutes(
    new Date(currentMsg.created_at),
    new Date(previousMessage.created_at)
  );

  return minutesBetweenCurrentAndPreviousMessage < CONSECUTIVE_MESSAGE_BUNDLING_THRESHOLD_IN_MINUTES;
}

function isMessage(thing: MessageEntity | TopicEventEntity | null): thing is MessageEntity {
  return (thing as MessageEntity)?.type !== undefined;
}

export const MessagesFeed = observer(({ feedItems, isReadonly }: Props) => {
  const holderRef = useRef<HTMLDivElement>(null);

  function renderMessageHeader(message: MessageEntity, previousMessage: MessageEntity | null) {
    if (!previousMessage) {
      return <DateHeader date={new Date(message.created_at)} />;
    }

    const currentDate = new Date(message.created_at);
    const previousDate = new Date(previousMessage.created_at);

    if (isSameDay(currentDate, previousDate)) {
      return null;
    }

    return <DateHeader date={currentDate} />;
  }

  return (
    <UIHolder ref={holderRef} data-messages-feed>
      {feedItems.map((feedItem, index) => {
        if (isMessage(feedItem)) {
          const message = feedItem;
          const isFirstMessage = index === 0;
          const previousItem = feedItems[index - 1] ?? null;
          const previousMessage = isMessage(previousItem) ? previousItem : null;

          return (
            <Fragment key={message.id}>
              {renderMessageHeader(message, previousMessage)}
              <Message
                contentLayoutId={isFirstMessage ? layoutAnimations.newTopic.message(message.topic_id) : undefined}
                isReadonly={isReadonly}
                message={message}
                key={message.id}
                isBundledWithPreviousMessage={shouldBundleCurrentMessageWithPrevious(message, previousMessage)}
              />
            </Fragment>
          );
        } else {
          const event = feedItem;
          return <TopicEventFeedItem key={event.id} topicEvent={event} />;
        }
      })}
    </UIHolder>
  );
});

function DateHeader({ date }: { date: Date }) {
  return <UIDateHeader>{niceFormatDate(date, { showWeekDay: "long" })}</UIDateHeader>;
}

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
`;

const UIDateHeader = styled.div<{}>`
  font-size: ${theme.typo.content.secondary.center};
  margin-top: 30px;
`;

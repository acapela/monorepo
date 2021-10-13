import { differenceInMinutes } from "date-fns";
import { isSameDay } from "date-fns";
import { observer } from "mobx-react";
import { Fragment, useRef } from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { niceFormatDate } from "~shared/dates/format";
import { theme } from "~ui/theme";

import { Message } from "./Message";

interface Props {
  messages: MessageEntity[];
  isReadonly?: boolean;
  onCloseTopicRequest?: (summary: string) => void;
}

const CONSECUTIVE_MESSAGE_BUNDLING_THRESHOLD_IN_MINUTES = 15;

function shouldBundleCurrentMessageWithPrevious(currentMsg: MessageEntity, prevMsg: MessageEntity | null): boolean {
  if (!prevMsg) {
    return false;
  }

  const isSameOwnerForBothMessages = prevMsg.user_id === currentMsg.user_id;
  if (!isSameOwnerForBothMessages) {
    return false;
  }

  const minutesBetweenCurrentAndPreviousMessage = differenceInMinutes(
    new Date(currentMsg.created_at),
    new Date(prevMsg.created_at)
  );

  return minutesBetweenCurrentAndPreviousMessage < CONSECUTIVE_MESSAGE_BUNDLING_THRESHOLD_IN_MINUTES;
}

export const MessagesFeed = observer(({ messages, isReadonly, onCloseTopicRequest }: Props) => {
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
    <UIHolder ref={holderRef}>
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1] ?? null;

        return (
          <Fragment key={message.id}>
            {renderMessageHeader(message, previousMessage)}
            <Message
              onCloseTopicRequest={onCloseTopicRequest}
              isReadonly={isReadonly}
              message={message}
              key={message.id}
              isBundledWithPreviousMessage={shouldBundleCurrentMessageWithPrevious(message, previousMessage)}
            />
          </Fragment>
        );
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

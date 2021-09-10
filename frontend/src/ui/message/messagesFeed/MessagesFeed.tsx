import { isSameDay } from "date-fns";
import { observer } from "mobx-react";
import { Fragment, useRef } from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { niceFormatDate } from "~shared/dates/format";
import { fontSize } from "~ui/baseStyles";

import { Message } from "./Message";
import { MessageLikeContent } from "./MessageLikeContent";

interface Props {
  messages: MessageEntity[];
  isReadonly?: boolean;
}

export const MessagesFeed = observer(function MessagesFeed({ messages, isReadonly }: Props) {
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
            <Message isReadonly={isReadonly} message={message} key={message.id} />
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

  ${MessageLikeContent} {
    margin-bottom: 16px;
  }
`;

const UIDateHeader = styled.div<{}>`
  font-size: ${fontSize.label};
  text-align: center;
  font-weight: bold;
`;

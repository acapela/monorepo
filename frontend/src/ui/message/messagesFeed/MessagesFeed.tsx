import { isSameDay } from "date-fns";
import { Fragment, useRef } from "react";
import styled from "styled-components";
import { MessageDetailedInfoFragment } from "~gql";
import { niceFormatDate } from "~shared/dates/format";
import { fontSize } from "~ui/baseStyles";
import { Message } from "./Message";
import { MessageLikeContent } from "./MessageLikeContent";

interface Props {
  messages: MessageDetailedInfoFragment[];
}

export function MessagesFeed({ messages }: Props) {
  const holderRef = useRef<HTMLDivElement>(null);

  function renderMessageHeader(
    message: MessageDetailedInfoFragment,
    previousMessage: MessageDetailedInfoFragment | null
  ) {
    if (!previousMessage) {
      return <DateHeader date={new Date(message.createdAt)} />;
    }

    const currentDate = new Date(message.createdAt);
    const previousDate = new Date(previousMessage.createdAt);

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
            <Message message={message} key={message.id} />
          </Fragment>
        );
      })}
    </UIHolder>
  );
}

function DateHeader({ date }: { date: Date }) {
  return <UIDateHeader>{niceFormatDate(date)}</UIDateHeader>;
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;

  ${MessageLikeContent} {
    margin-bottom: 16px;
  }
`;

const UIDateHeader = styled.div`
  font-size: ${fontSize.label};
  text-align: center;
  font-weight: bold;
`;

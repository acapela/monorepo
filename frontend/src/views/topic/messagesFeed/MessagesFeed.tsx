import { isSameDay } from "date-fns";
import { Fragment } from "react";
import { TopicMessageDetailedInfoFragment } from "~gql";
import { Message } from "./Message";

interface Props {
  messages: TopicMessageDetailedInfoFragment[];
}

export function MessagesFeed({ messages }: Props) {
  function renderMessageHeader(
    message: TopicMessageDetailedInfoFragment,
    previousMessage: TopicMessageDetailedInfoFragment | null
  ) {
    if (!previousMessage) {
      return <DateHeader date={message.createdAt} />;
    }

    if (isSameDay(previousMessage.createdAt, message.createdAt)) {
      return null;
    }

    return <DateHeader date={message.createdAt} />;
  }

  return (
    <>
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1] ?? null;

        return (
          <Fragment key={message.id}>
            {renderMessageHeader(message, previousMessage)}
            <Message message={message} key={message.id} />
          </Fragment>
        );
      })}
    </>
  );
}

function DateHeader({ date }: { date: Date }) {
  return <div>DATE</div>;
}

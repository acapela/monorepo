import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { MessagesFeed } from "~frontend/message/feed/MessagesFeed";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { PopPresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { NextAction } from "./NextAction";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureMessage } from "./TopicClosureMessage";
import { TopicHeader } from "./TopicHeader";
import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

export const TopicWithMessages = observer(({ topic }: { topic: TopicEntity }) => {
  const user = useAssertCurrentUser();
  const messages = topic.messages.all;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(
    action(() => {
      const unseenTasks = topic.tasks.query({ user_id: user.id, seen_at: null }).all;
      const seenAt = new Date().toISOString();
      for (const unseenTask of unseenTasks) {
        unseenTask.update({ seen_at: seenAt });
      }
    }),
    [messages, user.id]
  );

  const isClosed = topic.isClosed;

  const scrollerRef = useRef<ScrollHandle>();

  return (
    <TopicStoreContext>
      <UIHolder>
        <TopicHeader topic={topic} />

        <ScrollableMessages ref={scrollerRef as never}>
          <MessagesFeed messages={messages} />
          {/* TODO: Replace with events */}
          {isClosed ? <TopicClosureMessage topic={topic} /> : <NextAction topic={topic} />}
        </ScrollableMessages>

        {!isClosed && (
          <UIFooterContainer>
            <UIFooter>
              <CreateNewMessageEditor
                topic={topic}
                onMessageSent={() => {
                  scrollerRef.current?.scrollToBottom("auto");
                }}
                onClosePendingTasks={() => {
                  const openTasks = messages.flatMap(
                    (message) => message.tasks.query((task) => !task.isDone && task.user_id === user.id).all
                  );
                  const doneAt = new Date().toISOString();

                  for (const openTask of openTasks) {
                    openTask.update({ done_at: doneAt });
                  }
                }}
              />
            </UIFooter>
          </UIFooterContainer>
        )}
      </UIHolder>
    </TopicStoreContext>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 0;
  flex-grow: 1;
`;

const UIFooterContainer = styled(PopPresenceAnimator)`
  width: 100%;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid ${theme.colors.layout.background.border};
  display: flex;
  justify-content: center;
`;

const UIFooter = styled.div`
  width: 100%;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
`;

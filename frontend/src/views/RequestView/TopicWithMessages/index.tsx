import { AnimateSharedLayout } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { theme } from "~ui/theme";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicSummaryMessage } from "./TopicSummary";

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

  const handleCloseTopic = action((topicSummary: string) => {
    topic.update({
      closed_at: new Date().toISOString(),
      closed_by_user_id: user.id,
      closing_summary: topicSummary,
    });
    trackEvent("Closed Topic", { topicId: topic.id });
  });
  const onCloseTopicRequest = isClosed ? undefined : handleCloseTopic;

  return (
    <TopicStoreContext>
      <UIHolder>
        <UIHead>
          <UITitle>{topic.name}</UITitle>
          <UIAdditionalInfo>
            {topic.participants.count} {topic.participants.count === 1 ? "participant" : "participants"}
          </UIAdditionalInfo>
        </UIHead>

        <ScrollableMessages ref={scrollerRef as never}>
          <AnimateSharedLayout>
            <MessagesFeed onCloseTopicRequest={onCloseTopicRequest} messages={messages} />

            {topic && isClosed && <TopicSummaryMessage topic={topic} />}
          </AnimateSharedLayout>

          {!messages.length && !isClosed && (
            <UIContentWrapper>Start a request by adding a first message with an @-mention below.</UIContentWrapper>
          )}

          {isClosed && <TopicClosureNote />}
        </ScrollableMessages>

        {!isClosed && (
          <UIMessageComposer>
            <CreateNewMessageEditor
              topicId={topic.id}
              requireMention={messages.length === 0}
              onMessageSent={action(() => {
                scrollerRef.current?.scrollToBottom("auto");

                const openTasks = topic.tasks.query({ done_at: null, user_id: user.id }).all;
                const doneAt = new Date().toISOString();
                for (const openTask of openTasks) {
                  openTask.update({ done_at: doneAt });
                }
              })}
            />
          </UIMessageComposer>
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

const UIHead = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 800px;
`;

const UITitle = styled.h3`
  ${theme.typo.pageTitle};
`;

const UIAdditionalInfo = styled.div`
  ${theme.typo.content.secondary}
`;

const UIMessageComposer = styled.div`
  width: 100%;
  margin-top: auto;
  padding-top: 20px;
  padding-top: 0px;
  max-width: 800px;
`;

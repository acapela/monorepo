import { AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { TextH3 } from "~ui/typo";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicSummaryMessage } from "./TopicSummary";

export const TopicWithMessages = observer(({ topic }: { topic: TopicEntity }) => {
  const user = useAssertCurrentUser();
  const messages = topic.messages.all;

  // TODO figure out how to only run this for actually really existing messages
  // useMarkTopicAsRead(
  //   topic.id,
  //   messages.map((m) => m.id)
  // );

  useEffect(() => {
    const unseenTasks = messages.flatMap(
      (message) => message.tasks.query((task) => !task.seen_at && task.user_id === user.id).all
    );
    const seenAt = new Date().toISOString();
    for (const unseenTask of unseenTasks) {
      unseenTask.update({ seen_at: seenAt });
    }
  }, [messages, user.id]);

  const isClosed = topic.isClosed;

  const scrollerRef = useRef<ScrollHandle>();

  const handleCloseTopic = (topicSummary: string) => {
    topic.update({
      closed_at: new Date().toISOString(),
      closed_by_user_id: user.id,
      closing_summary: topicSummary,
    });
    trackEvent("Closed Topic", { topicId: topic.id });
  };
  const onCloseTopicRequest = isClosed ? undefined : handleCloseTopic;

  return (
    <TopicStoreContext>
      <UIHolder>
        <UITitle>{topic.name}</UITitle>

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
              onMessageSent={() => {
                scrollerRef.current?.scrollToBottom("auto");
                const openTasks = messages.flatMap(
                  (message) => message.tasks.query((task) => !task.done_at && task.user_id === user.id).all
                );
                const doneAt = new Date().toISOString();
                for (const openTask of openTasks) {
                  openTask.update({ done_at: doneAt });
                }
              }}
            />
          </UIMessageComposer>
        )}
      </UIHolder>
    </TopicStoreContext>
  );
});

const UIHolder = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const UITitle = styled(TextH3)`
  padding: 20px;
  font-weight: 700;
`;

const UIMessageComposer = styled.div`
  width: 100%;
  margin-top: auto;
  padding: 24px;
  padding-top: 0px;
`;

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
import { runUntracked } from "~shared/mobxUtils";
import { theme } from "~ui/theme";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicSummaryMessage } from "./TopicSummary";
import { MESSAGES_VIEW_MAX_WIDTH_PX } from "./ui";

export const TopicWithMessages = observer(({ topic }: { topic: TopicEntity }) => {
  const user = useAssertCurrentUser();
  const messages = topic.messages.all;

  // TODO figure out how to only run this for actually really existing messages
  // useMarkTopicAsRead(
  //   topic.id,
  //   messages.map((m) => m.id)
  // );

  useEffect(() => {
    const unseenTasks = runUntracked(() =>
      messages.flatMap((message) => message.tasks.query((task) => !task.seen_at && task.user_id === user.id).all)
    );
    const seenAt = new Date().toISOString();
    for (const unseenTask of unseenTasks) {
      unseenTask.update({ seen_at: seenAt });
    }
  }, [messages, user.id]);

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
            <UIMessageComposerBody>
              <CreateNewMessageEditor
                topic={topic}
                requireMention={messages.length === 0}
                onMessageSent={() => {
                  scrollerRef.current?.scrollToBottom("auto");
                  const openTasks = messages.flatMap(
                    (message) => message.tasks.query((task) => !task.isDone && task.user_id === user.id).all
                  );
                  const doneAt = new Date().toISOString();
                  for (const openTask of openTasks) {
                    openTask.update({ done_at: doneAt });
                  }
                }}
              />
            </UIMessageComposerBody>
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
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
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
  border-top: 1px solid ${theme.colors.layout.background.border};
  display: flex;
  justify-content: center;
`;

const UIMessageComposerBody = styled.div`
  width: 100%;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
`;

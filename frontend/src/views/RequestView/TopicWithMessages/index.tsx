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
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { PopAnimatedButton } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

import { CreateNewMessageEditor } from "./CreateNewMessageEditor";
import { ScrollableMessages } from "./ScrollableMessages";
import { ScrollHandle } from "./ScrollToBottomMonitor";
import { TopicSummaryMessage } from "./TopicSummary";
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

  const handleCloseTopic = action((topicSummary: string) => {
    topic.update({
      closed_at: new Date().toISOString(),
      closed_by_user_id: user.id,
      closing_summary: topicSummary,
    });
    trackEvent("Closed Topic", { topicId: topic.id });
  });

  const handleReopenTopic = action(() => {
    topic.update({
      closed_at: null,
      closed_by_user_id: null,
      closing_summary: null,
    });
    trackEvent("Reopened Topic", { topicId: topic.id });
  });

  const onCloseTopicRequest = isClosed ? undefined : handleCloseTopic;

  return (
    <TopicStoreContext>
      <UIHolder>
        <UIHead>
          <UITitle>{topic.name}</UITitle>
          <UIParticipants>
            <AvatarList users={topic.participants.all} maxVisibleCount={5} />
            {/* TODO: Include invite button */}
          </UIParticipants>
        </UIHead>

        <ScrollableMessages ref={scrollerRef as never}>
          <AnimateSharedLayout>
            <MessagesFeed onCloseTopicRequest={onCloseTopicRequest} messages={messages} />
            {/* TODO: Replace with events */}
            {topic && isClosed && <TopicSummaryMessage topic={topic} />}
          </AnimateSharedLayout>
        </ScrollableMessages>

        <UIFooterContainer>
          <UIFooter>
            {!isClosed && (
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
            )}
            {isClosed && (
              <UICloseTopicFooter>
                <PopAnimatedButton
                  shortcut={["Mod", "O"]}
                  kind="secondary"
                  tooltip="Reopen Request"
                  onClick={handleReopenTopic}
                >
                  Reopen request
                </PopAnimatedButton>
              </UICloseTopicFooter>
            )}
          </UIFooter>
        </UIFooterContainer>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
  max-width: ${MESSAGES_VIEW_MAX_WIDTH_PX}px;
`;

const UITitle = styled.h3`
  ${theme.typo.pageTitle};
`;

const UIParticipants = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap}
  ${theme.typo.pageTitle};
`;

const UIFooterContainer = styled.div`
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

const UICloseTopicFooter = styled.div<{}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap};
`;

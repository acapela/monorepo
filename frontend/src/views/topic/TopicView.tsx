import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { Message as MessageType } from "~db";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { updateLastSeenMessage, useSingleTopicQuery, useTopicMessagesQuery } from "~frontend/gql/topics";
import { useTopic } from "~frontend/topics/useTopic";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { disabledCss } from "~ui/disabled";
import { TopicSummaryMessage } from "./TopicSummary";
import { ScrollableMessages } from "./ScrollableMessages";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { CreateNewMessageEditor } from "~frontend/ui/message/composer/CreateNewMessageEditor";
import { TopicStoreContext } from "~frontend/topics/TopicStore";
import { useAsyncLayoutEffect } from "~shared/hooks/useAsyncEffect";
import { waitForAllRunningMutationsToFinish } from "~frontend/gql/utils";

interface Props {
  topicId: string;
}

function useMarkTopicAsRead(topicId: string, messages: Pick<MessageType, "id">[]) {
  /**
   * Let's mark last message as read each time we have new messages.
   */
  useAsyncLayoutEffect(async () => {
    if (!messages) return;

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage) return;

    /**
     * Let's make sure we're never marking message from 'optimistic' response (because it is not in the DB yet so it
     * would result in DB error).
     */
    await waitForAllRunningMutationsToFinish();

    // Component might be unmounted at this point, but we still want to mark seen message as read.

    // There are no mutations in progress now so we can safely mark new message as read as mutation creating it already
    // finished running
    updateLastSeenMessage({ topicId, messageId: lastMessage.id });
  }, [messages]);
}

export const TopicView = ({ topicId }: Props) => {
  const [topic] = useSingleTopicQuery({ id: topicId });
  const [messages = []] = useTopicMessagesQuery({
    topicId: topicId,
  });

  const isMember = isCurrentUserRoomMember(topic?.room);

  useMarkTopicAsRead(topicId, messages);

  const { hasTopic, isParentRoomOpen, isClosed: isTopicClosed, topicCloseInfo } = useTopic(topic);

  return (
    <TopicStoreContext>
      {hasTopic && (
        <TopicRoot>
          {/* We need to render the topic header wrapper or else flex bugs out on page reload */}
          <UITopicHeaderHolder>{topic && <TopicHeader topic={topic} />}</UITopicHeaderHolder>
          <ScrollableMessages>
            <AnimateSharedLayout>
              <MessagesFeed isReadonly={!isMember} messages={messages} />

              {topic && topicCloseInfo && <TopicSummaryMessage topic={topic} />}
            </AnimateSharedLayout>
            {!messages.length && !topicCloseInfo && (
              <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
            )}
          </ScrollableMessages>

          {isTopicClosed && <TopicClosureNote isParentRoomOpen={isParentRoomOpen} />}
          {!isTopicClosed && (
            <ClientSideOnly>
              <UIMessageComposer isDisabled={!isMember}>
                <CreateNewMessageEditor topicId={topicId} isDisabled={!isMember} />
              </UIMessageComposer>
            </ClientSideOnly>
          )}
        </TopicRoot>
      )}
    </TopicStoreContext>
  );
};

const UITopicHeaderHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TopicRoot = styled(DropFileContext)<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  ${ScrollableMessages} {
    flex: 1 1 100%;
    width: 100%;
    overflow: auto;
  }

  ${UITopicHeaderHolder} {
    margin-bottom: 16px;
  }
`;

const UIMessageComposer = styled.div<{ isDisabled: boolean }>`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;

  ${(props) => props.isDisabled && disabledCss}
`;

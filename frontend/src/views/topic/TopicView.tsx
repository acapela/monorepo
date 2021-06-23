import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";
import { Message as MessageType } from "~db";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { useLastSeenMessageMutation, useSingleTopicQuery, useTopicMessagesQuery } from "~frontend/gql/topics";
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

interface Props {
  topicId: string;
}

function useMarkTopicAsRead(topicId: string, messages: Pick<MessageType, "id">[]) {
  const [updateLastSeenMessage] = useLastSeenMessageMutation();

  useIsomorphicLayoutEffect(() => {
    if (messages) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage) {
        updateLastSeenMessage({ topicId, messageId: lastMessage.id });
      }
    }
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
          {/* We need to render the topic header or else flex bugs out on page reload */}
          <TopicHeader topic={topic} />
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
                <CreateNewMessageEditor topicId={topicId} />
              </UIMessageComposer>
            </ClientSideOnly>
          )}
        </TopicRoot>
      )}
    </TopicStoreContext>
  );
};

const TopicRoot = styled(DropFileContext)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  ${ScrollableMessages} {
    flex: 1 1 100%;
    width: 100%;
    overflow: auto;
  }

  ${TopicHeader} {
    margin-bottom: 16px;
  }
`;

const UIMessageComposer = styled.div<{ isDisabled: boolean }>`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;

  ${(props) => props.isDisabled && disabledCss}
`;

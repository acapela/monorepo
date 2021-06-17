import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";
import { Message as MessageType } from "~db";
import { useLastSeenMessageMutation, useSingleTopicQuery, useTopicMessagesQuery } from "~frontend/gql/topics";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { MessageComposer } from "./Composer";
import { ScrollableMessages } from "./ScrollableMessages";
import { TopicClosureBanner as TopicClosureNote } from "./TopicClosureNote";
import { TopicHeader } from "./TopicHeader";
import { useTopic } from "~frontend/topics/useTopic";
import { TopicSummaryMessage } from "./messagesFeed/TopicSummary";
import { MessagesFeed } from "./messagesFeed/MessagesFeed";
import { isCurrentUserRoomMember } from "~frontend/gql/rooms";
import { disabledCss } from "~ui/disabled";

interface Props {
  id: string;
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

export const TopicView = ({ id }: Props) => {
  const [topic] = useSingleTopicQuery({ id });
  const [messages = []] = useTopicMessagesQuery({
    topicId: id,
  });

  const isMember = isCurrentUserRoomMember(topic?.room);

  useMarkTopicAsRead(id, messages);

  const { hasTopic, isParentRoomOpen, isClosed: isTopicClosed, topicCloseInfo } = useTopic(topic);

  return (
    <>
      {hasTopic && (
        <TopicRoot>
          {/* We need to render the topic header or else flex bugs out on page reload */}
          <TopicHeader topic={topic} />
          <ScrollableMessages>
            <UIAnimatedMessagesWrapper>
              <AnimateSharedLayout>
                <MessagesFeed messages={messages} />

                {topic && topicCloseInfo && <TopicSummaryMessage topic={topic} />}
              </AnimateSharedLayout>
              {!messages.length && !topicCloseInfo && (
                <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
              )}
            </UIAnimatedMessagesWrapper>
          </ScrollableMessages>

          {isTopicClosed && <TopicClosureNote isParentRoomOpen={isParentRoomOpen} />}
          {!isTopicClosed && (
            <ClientSideOnly>
              <UIMessageComposer isDisabled={!isMember}>
                <MessageComposer topicId={id} />
              </UIMessageComposer>
            </ClientSideOnly>
          )}
        </TopicRoot>
      )}
    </>
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

const UIAnimatedMessagesWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";
import { Message as MessageType } from "~db";
import { useLastSeenMessageMutation, useTopicMessages } from "~frontend/gql/topics";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { MessageComposer } from "./Composer";
import { Message } from "./Message";
import { ScrollableMessages } from "./ScrollableMessages";

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
  const [data] = useTopicMessages.subscription({
    topicId: id,
  });

  const messages = data?.messages ?? [];

  useMarkTopicAsRead(id, messages);

  return (
    <TopicRoot>
      <ScrollableMessages>
        <UIAnimatedMessagesWrapper>
          <AnimateSharedLayout>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </AnimateSharedLayout>
          {!messages.length && (
            <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
          )}
        </UIAnimatedMessagesWrapper>
      </ScrollableMessages>
      <ClientSideOnly>
        <UIMessageComposer>
          <MessageComposer topicId={id} />
        </UIMessageComposer>
      </ClientSideOnly>
    </TopicRoot>
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
`;

const UIMessageComposer = styled.div`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;
`;

const UIAnimatedMessagesWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

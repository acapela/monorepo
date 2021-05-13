import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useTopicMessages } from "~frontend/gql/topics";
import { UIContentWrapper } from "~frontend/ui/UIContentWrapper";
import { DropFileContext } from "~richEditor/DropFileContext";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { MessageComposer } from "./Composer";
import { Message } from "./Message";
import { ScrollableMessages } from "./ScrollableMessages";

interface Props {
  id: string;
}

export const TopicView = ({ id }: Props) => {
  const { data } = useTopicMessages.subscription({
    topicId: id,
  });

  const messages = data?.messages ?? [];

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

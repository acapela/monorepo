import { AnimateSharedLayout, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { TopicMessageDetailedInfoFragment } from "~frontend/gql";
import { useTopicMessagesSubscription } from "~frontend/gql/topics";
import { MessageComposer } from "./Composer";
import { Message, MessageWithUserInfo } from "./Message";
import { ScrollableMessages } from "./ScrollableMessages";
import { DropFileContext } from "~richEditor/DropFileContext";

const useTopicMessages = (topicId: string): { isLoading: boolean; messages: MessageWithUserInfo[] } => {
  const { loading: isLoadingUser, user } = useCurrentUser();
  const { data, loading: isLoadingMessages } = useTopicMessagesSubscription({
    topicId,
  });

  const isLoading = isLoadingUser || isLoadingMessages || !data;
  const messagesList: TopicMessageDetailedInfoFragment[] = data?.messages ?? [];

  return {
    isLoading,
    messages: isLoading
      ? []
      : messagesList.map((message) => ({
          ...message,
          isOwnMessage: message.user.id === user?.id,
        })),
  };
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

export const TopicView: React.FC<{ id: string }> = ({ id }) => {
  const { isLoading, messages } = useTopicMessages(id);

  if (isLoading) {
    // TODO: Add proper loading UI
    return <div>loading...</div>;
  }

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
      <UIMessageComposer>
        <MessageComposer topicId={id} />
      </UIMessageComposer>
    </TopicRoot>
  );
};

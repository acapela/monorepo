import { useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";
import { ThreadMessageBasicInfoFragment, useThreadMessagesSubscription } from "@acapela/frontend/gql";
import { ScrollableMessages } from "@acapela/frontend/views/thread/ScrollableMessages";
import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { MessageComposer } from "./Composer";
import { TextMessage } from "./TextMessage";

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

const useThreadMessages = (threadId: string): { isLoading: boolean; messages: MessageWithUserInfo[] } => {
  const { loading: isLoadingUser, user } = useCurrentUser();
  const { data, loading: isLoadingMessages } = useThreadMessagesSubscription({
    variables: { threadId },
  });

  const isLoading = isLoadingUser || isLoadingMessages || !data;
  const messagesList: ThreadMessageBasicInfoFragment[] = data?.messages ?? [];

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

const UIThreadView = styled.div`
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

export const ThreadView: React.FC<{ id: string }> = ({ id }) => {
  const { isLoading, messages } = useThreadMessages(id);

  if (isLoading) {
    // TODO: Add proper loading UI
    return <div>loading...</div>;
  }

  return (
    <UIThreadView>
      <ScrollableMessages>
        <UIAnimatedMessagesWrapper>
          {messages.map((message) => (
            <TextMessage key={message.id} message={message} />
          ))}
          {!messages.length && (
            <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
          )}
        </UIAnimatedMessagesWrapper>
      </ScrollableMessages>
      <UIMessageComposer>
        <MessageComposer threadId={id} />
      </UIMessageComposer>
    </UIThreadView>
  );
};

import { AnimateSharedLayout, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { UIContentWrapper } from "~frontend/design/UIContentWrapper";
import { ThreadMessageBasicInfoFragment, useThreadMessagesSubscription } from "~frontend/gql";

import { MessageComposer } from "./Composer";
import { Message, MessageWithUserInfo } from "./Message";
import { ScrollableMessages } from "./ScrollableMessages";

const useThreadMessages = (threadId: string) => {
  const { loading: isLoadingUser, user } = useCurrentUser();
  /**
   * We want to be able to add 'optimistic' new messages before they're returned from socket subscribtion.
   * This is because currently socket subscribtion has 1s interval which might cause visible delay.
   *
   * This is array of additional messages to be added at the end of list of messages.
   *
   * This list is automatically cleared each time new data arrives from original subscribtion.
   */
  const [optimisticMessages, setOptimisticMessages] = useState<ThreadMessageBasicInfoFragment[]>([]);

  const { data, loading: isLoadingMessages } = useThreadMessagesSubscription({
    variables: { threadId },
  });

  // Each time new data is received, clear optimistic messages
  useEffect(() => {
    if (optimisticMessages.length === 0) return;

    setOptimisticMessages([]);
  }, [data]);

  function addOptimisticNewMessage(message: ThreadMessageBasicInfoFragment) {
    setOptimisticMessages((currentMessages) => {
      return [...currentMessages, { ...message, __typename: "message" }];
    });
  }

  const isLoading = isLoadingUser || isLoadingMessages || !data;

  function getMessages(): MessageWithUserInfo[] {
    // Add optimistic messages to original messages.
    const rawMessages = [...(data?.messages ?? []), ...optimisticMessages];

    return rawMessages.map(
      (message): MessageWithUserInfo => ({
        ...message,
        isOwnMessage: message.user.id === user?.id,
      })
    );
  }

  return {
    isLoading,
    addOptimisticNewMessage,
    messages: getMessages(),
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
  const { isLoading, messages, addOptimisticNewMessage } = useThreadMessages(id);

  if (isLoading) {
    // TODO: Add proper loading UI
    return <div>loading...</div>;
  }

  function handleNewMessageRequestSent(data: ThreadMessageBasicInfoFragment) {
    addOptimisticNewMessage({
      ...data,
      id: "_optimistic" + data.id,
    });
  }

  return (
    <UIThreadView>
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
        <MessageComposer threadId={id} onMessageAdded={handleNewMessageRequestSent} />
      </UIMessageComposer>
    </UIThreadView>
  );
};

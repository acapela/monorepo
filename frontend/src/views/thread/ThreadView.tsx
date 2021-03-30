import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { gql } from "@apollo/client";
import { useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { ThreadMessageBasicInfoFragment, useThreadMessagesSubscription } from "@acapela/frontend/gql";
import { MessageComposer } from "./Composer";
import { TextMessage } from "./TextMessage";
import { UIContentWrapper } from "@acapela/frontend/design/UIContentWrapper";

interface MessageWithUserInfo extends ThreadMessageBasicInfoFragment {
  isOwnMessage: boolean;
}

gql`
  subscription ThreadMessages($threadId: uuid!) {
    messages: message(where: { thread_id: { _eq: $threadId } }, order_by: [{ created_at: asc }]) {
      ...ThreadMessageBasicInfo
    }
  }
`;

const useThreadMessages = (threadId: string): { loading: boolean; messages: MessageWithUserInfo[] } => {
  const { loading: loadingUser, user } = useCurrentUser();
  const { data, loading: loadingMessages } = useThreadMessagesSubscription({ variables: { threadId } });

  if (loadingUser || loadingMessages || !data) {
    return { loading: true, messages: [] };
  }

  const messagesList: ThreadMessageBasicInfoFragment[] = data.messages ?? [];

  return {
    loading: false,
    messages: messagesList.map((message) => ({
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
`;

const UIMessages = styled.div`
  flex: 1 1 100%;
  width: 100%;
  overflow: auto;
`;

const UIMessageComposer = styled.div`
  flex: 1 0 auto;
  width: 100%;
  margin-top: 1rem;
`;

const UIAnimatedMessagesWrapper = styled(motion.div).attrs({
  variants: {
    show: { transition: { staggerChildren: 0.04 } },
  },
  initial: "hidden",
  animate: "show",
})`
  display: flex;
  flex-direction: column;
`;

export const ThreadView: React.FC<{ id: string }> = ({ id }) => {
  const { loading, messages } = useThreadMessages(id);

  if (loading) {
    // TODO: Add proper loading UI
    return <div>loading...</div>;
  }

  return (
    <UIThreadView>
      <UIMessages>
        <UIAnimatedMessagesWrapper>
          {messages.map((message) => (
            <TextMessage key={message.id} message={message} />
          ))}
          {!messages.length && (
            <UIContentWrapper>Start the conversation and add your first message below.</UIContentWrapper>
          )}
        </UIAnimatedMessagesWrapper>
      </UIMessages>
      <UIMessageComposer>
        <MessageComposer threadId={id} />
      </UIMessageComposer>
    </UIThreadView>
  );
};

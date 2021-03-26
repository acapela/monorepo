import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { gql } from "@apollo/client";
import { useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { ThreadMessageBasicInfoFragment, useThreadMessagesSubscription } from "@acapela/frontend/gql";
import { MessageComposer } from "./Composer";
import { TextMessage } from "./TextMessage";

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
  height: 100%;
  display: flex;
  flex-direction: column;
`;

// TODO: use flex
const UIMessages = styled.div`
  // flex: 1;
  // flex-grow: 1;
  position: absolute;
  top: 0;
  bottom: 2.75rem;
  width: 100%;
  overflow: auto;
`;

const UIMessageComposer = styled.div`
  position: absolute;
  bottom: 0;

  width: 100%;
  margin-top: 1rem;
`;

const UIMessageWrapper = styled(motion.div).attrs({
  variants: {
    show: { transition: { staggerChildren: 0.04 } },
  },
  initial: "hidden",
  animate: "show",
})`
  display: flex;
  flex-direction: column;
`;

const UIEmptyThreadBanner = styled.div`
  max-width: 28rem;
  margin-left: auto;
  margin-right: auto;
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
        <UIMessageWrapper>
          {messages.map((message) => (
            <TextMessage key={message.id} message={message} />
          ))}
          {!messages.length && (
            <UIEmptyThreadBanner>Start the conversation and add your first message below.</UIEmptyThreadBanner>
          )}
        </UIMessageWrapper>
      </UIMessages>
      <UIMessageComposer>
        <MessageComposer threadId={id} />
      </UIMessageComposer>
    </UIThreadView>
  );
};

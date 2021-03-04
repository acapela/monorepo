import { useCurrentUser } from "@acapela/frontend/authentication/authentication";
import { ThreadMessageBasicInfoFragment, useThreadMessagesSubscription } from "@acapela/frontend/gql";
import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import React from "react";
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
  return {
    loading: false,
    messages: data.messages?.map((message) => ({
      ...message,
      isOwnMessage: message.user.id === user?.id,
    })),
  };
};

export const ThreadView: React.FC<{ id: string }> = ({ id }) => {
  const { loading, messages } = useThreadMessages(id);
  return (
    <div className="relative h-full">
      <div className="absolute w-full overflow-auto top-0 bottom-11">
        {!loading && (
          <motion.div
            className="flex flex-col space-y-2"
            variants={{
              show: { transition: { staggerChildren: 0.04 } },
            }}
            initial="hidden"
            animate="show"
          >
            {messages.map((message) => (
              <TextMessage key={message.id} message={message} />
            ))}
            {!messages.length && (
              <div className="max-w-md mx-auto">Start the conversation and add your first message below.</div>
            )}
          </motion.div>
        )}
      </div>
      <div className="absolute w-full bottom-0">
        <MessageComposer threadId={id} />
      </div>
    </div>
  );
};

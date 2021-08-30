import { gql, useApolloClient, useSubscription } from "@apollo/client";
import { useEffect, useMemo } from "react";

import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import {
  MessagePresenceSubscription,
  MessagePresenceSubscriptionVariables,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";

export const TOPIC_WITH_MESSAGES_QUERY = gql`
  ${MessagesFeed.fragments.message}

  query TopicWithMessages($topicId: uuid!) {
    messages: message(
      where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false }, type: { _is_null: false } }
      order_by: [{ created_at: asc }]
    ) {
      updated_at
      ...Message_message
    }
  }
`;

// Update our messages cache when a message gets deleted
export function usePresentMessagesSubscription(topicId?: string) {
  const { data } = useSubscription<MessagePresenceSubscription, MessagePresenceSubscriptionVariables>(
    gql`
      subscription MessagePresence($topicId: uuid!) {
        presentMessages: message(
          where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false }, type: { _is_null: false } }
          order_by: [{ created_at: asc }]
        ) {
          id
        }
      }
    `,
    topicId ? { variables: { topicId } } : { skip: true }
  );
  const presentMessageIds = useMemo(() => (data ? new Set(data.presentMessages.map((m) => m.id)) : null), [data]);

  const client = useApolloClient();

  useEffect(() => {
    if (!topicId || !presentMessageIds) {
      return;
    }
    const options = {
      query: TOPIC_WITH_MESSAGES_QUERY,
      variables: { topicId },
    };
    const messages = client.readQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>(options)?.messages;
    if (messages) {
      client.writeQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>({
        ...options,
        data: {
          messages: messages.filter((m) => presentMessageIds.has(m.id)),
        },
      });
    }
  }, [client, presentMessageIds, topicId]);

  return presentMessageIds;
}

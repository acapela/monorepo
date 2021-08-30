import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { TOPIC_WITH_MESSAGES_QUERY } from "~frontend/views/RoomView/TopicWithMessages/gql";
import {
  MessageExistenceSubscription,
  MessageExistenceSubscriptionVariables,
  NewestTopicMessageSubscription,
  NewestTopicMessageSubscriptionVariables,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";

// Update our messages cache when a message gets deleted
function useExistingMessagesSubscription(topicId?: string) {
  const { data } = useSubscription<MessageExistenceSubscription, MessageExistenceSubscriptionVariables>(
    gql`
      subscription MessageExistence($topicId: uuid!) {
        existingMessages: message(
          where: { topic_id: { _eq: $topicId }, is_draft: { _eq: false }, type: { _is_null: false } }
          order_by: [{ created_at: asc }]
        ) {
          id
        }
      }
    `,
    topicId ? { variables: { topicId } } : { skip: true }
  );
  const existingMessageIds = useMemo(() => (data ? new Set(data.existingMessages.map((m) => m.id)) : null), [data]);

  const client = useApolloClient();

  useEffect(() => {
    if (!topicId || !existingMessageIds) {
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
          messages: messages.filter((m) => existingMessageIds.has(m.id)),
        },
      });
    }
  }, [client, existingMessageIds, topicId]);

  return existingMessageIds;
}

export function useMessagesSubscription(topicId?: string) {
  const {
    data,
    loading: isLoadingMessages,
    subscribeToMore,
  } = useQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>(
    TOPIC_WITH_MESSAGES_QUERY,
    topicId ? { variables: { topicId } } : { skip: true }
  );

  const existingMessageIds = useExistingMessagesSubscription(topicId);
  const messages = data?.messages ?? [];

  const lastUpdatedAt = useMemo(() => (data ? _.max(data.messages.map((m) => m.updated_at)) : null), [data]);

  useEffect(() => {
    if (!topicId || !lastUpdatedAt) {
      return;
    }
    return subscribeToMore<NewestTopicMessageSubscription, NewestTopicMessageSubscriptionVariables>({
      document: gql`
        ${MessagesFeed.fragments.message}

        subscription NewestTopicMessage($topicId: uuid!, $lastUpdatedAt: timestamptz!) {
          messages: message(where: { topic_id: { _eq: $topicId }, updated_at: { _gt: $lastUpdatedAt } }) {
            id
            created_at
            updated_at
            ...Message_message
          }
        }
      `,
      variables: { topicId, lastUpdatedAt },
      updateQuery(prev, { subscriptionData }) {
        const updatedMessages = subscriptionData.data.messages;

        const existingMessageIds = new Set(prev.messages.map((m) => m.id));
        const newMessages = updatedMessages.filter((m) => !existingMessageIds.has(m.id));

        return {
          ...prev,
          messages: [...prev.messages, ..._.sortBy(newMessages, (m) => new Date(m.created_at))],
        };
      },
    });
  }, [lastUpdatedAt, subscribeToMore, topicId]);

  return { messages, existingMessageIds, isLoadingMessages };
}

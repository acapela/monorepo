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

// use this to extract the last updated message timestamp and use that to subscribe only to changes after that
function useLastUpdatedAt() {
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const updateLastUpdatedAt = useCallback(
    (messages: { updated_at: string }[]) => {
      const newValue = _.max(messages.map((m) => m.updated_at));
      if (newValue) {
        setLastUpdatedAt(newValue);
      }
    },
    [setLastUpdatedAt]
  );

  return [lastUpdatedAt, updateLastUpdatedAt] as const;
}

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
  const [lastUpdatedAt, updateLastUpdatedAt] = useLastUpdatedAt();
  const {
    data,
    loading: isLoadingMessages,
    subscribeToMore,
  } = useQuery<TopicWithMessagesQuery, TopicWithMessagesQueryVariables>(
    TOPIC_WITH_MESSAGES_QUERY,
    topicId
      ? {
          variables: { topicId },
          onCompleted(data) {
            updateLastUpdatedAt(data?.messages ?? []);
          },
        }
      : { skip: true }
  );

  const existingMessageIds = useExistingMessagesSubscription(topicId);
  const messages = data?.messages ?? [];

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
        updateLastUpdatedAt(updatedMessages);

        const existingMessageIds = new Set(prev.messages.map((m) => m.id));
        const newMessages = updatedMessages.filter((m) => !existingMessageIds.has(m.id));

        return {
          ...prev,
          messages: [...prev.messages, ..._.sortBy(newMessages, (m) => new Date(m.created_at))],
        };
      },
    });
  }, [lastUpdatedAt, subscribeToMore, topicId, updateLastUpdatedAt]);

  return { messages, existingMessageIds, isLoadingMessages };
}

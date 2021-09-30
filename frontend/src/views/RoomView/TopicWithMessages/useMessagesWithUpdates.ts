import { gql } from "@apollo/client";

import { useQueryItemsWithUpdates } from "~frontend/gql/utils/useQueryItemsWithUpdates";
import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";
import { TOPIC_WITH_MESSAGES_QUERY } from "~frontend/views/RoomView/TopicWithMessages/gql";
import {
  TopicMessagesExistenceSubscription,
  TopicMessagesExistenceSubscriptionVariables,
  TopicMessagesUpdatesSubscription,
  TopicMessagesUpdatesSubscriptionVariables,
  TopicWithMessagesQuery,
  TopicWithMessagesQueryVariables,
} from "~gql";

export function useMessagesWithUpdates(topicId: string) {
  const { items, existingItemIds, loading } = useQueryItemsWithUpdates<
    "messages",
    TopicWithMessagesQuery,
    TopicWithMessagesQueryVariables,
    TopicMessagesUpdatesSubscription,
    TopicMessagesUpdatesSubscriptionVariables,
    TopicMessagesExistenceSubscription,
    TopicMessagesExistenceSubscriptionVariables
  >({
    queryDocument: TOPIC_WITH_MESSAGES_QUERY,
    updateSubscriptionDocument: gql`
      ${MessagesFeed.fragments.message}

      subscription TopicMessagesUpdates($topicId: uuid!, $lastUpdatedAt: timestamptz!) {
        messages: message(where: { topic_id: { _eq: $topicId }, updated_at: { _gt: $lastUpdatedAt } }) {
          id
          created_at
          updated_at
          ...Message_message
        }
      }
    `,
    existenceSubscriptionDocument: gql`
      subscription TopicMessagesExistence($topicId: uuid!) {
        messages: message(where: { topic_id: { _eq: $topicId } }, order_by: [{ created_at: asc }]) {
          id
        }
      }
    `,
    variables: { topicId },
    itemsKey: "messages",
  });

  return { messages: items, existingMessageIds: existingItemIds, isLoadingMessages: loading };
}

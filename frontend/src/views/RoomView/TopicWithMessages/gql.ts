import { gql } from "@apollo/client";

import { MessagesFeed } from "~frontend/ui/message/messagesFeed/MessagesFeed";

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

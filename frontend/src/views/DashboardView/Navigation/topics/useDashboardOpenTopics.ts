import gql from "graphql-tag";
import { orderBy } from "lodash";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useQueryItemsWithUpdates } from "~frontend/gql/utils/useQueryItemsWithUpdates";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  DashboardOpenTopicFragment,
  DashboardOpenTopicsExistenceSubscription,
  DashboardOpenTopicsExistenceSubscriptionVariables,
  DashboardOpenTopicsQuery,
  DashboardOpenTopicsQueryVariables,
  DashboardOpenTopicsUpdatesSubscription,
  DashboardOpenTopicsUpdatesSubscriptionVariables,
} from "~gql";

import { DashboardTopicCard } from "./TopicCard";

const topicFragment = gql`
  ${DashboardTopicCard.fragments.topic}
  fragment DashboardOpenTopic on topic {
    id
    updated_at
    ...DashboardTopicCard_topic
    last_seen_messages {
      seen_at
    }
    lastMessage: messages_aggregate {
      aggregate {
        max {
          updated_at
        }
      }
    }
  }
`;

const getTopicLastMessageTimestamp = (topic: DashboardOpenTopicFragment) => {
  const date = topic.lastMessage.aggregate?.max?.updated_at;
  return date ? new Date(date).getTime() : null;
};

const getTopicLastSeenMessageTimestamp = (topic: DashboardOpenTopicFragment) => {
  const [message] = topic.last_seen_messages;
  return message ? new Date(message.seen_at).getTime() : null;
};

const getTopicLastUnreadMessageTimestamp = (topic: DashboardOpenTopicFragment): number | null => {
  const lastMessageTimestamp = getTopicLastMessageTimestamp(topic);
  if (!lastMessageTimestamp) return null;

  const lastSeenMessageTimestamp = getTopicLastSeenMessageTimestamp(topic);
  const hasUnreadMessage = !lastSeenMessageTimestamp || lastSeenMessageTimestamp < lastMessageTimestamp;

  return hasUnreadMessage ? lastMessageTimestamp : null;
};

export const useDashboardOpenTopics = () => {
  const teamId = useAssertCurrentTeamId();
  const currentUser = useAssertCurrentUser();

  const { items: topics } = useQueryItemsWithUpdates<
    "topics",
    DashboardOpenTopicsQuery,
    DashboardOpenTopicsQueryVariables,
    DashboardOpenTopicsUpdatesSubscription,
    DashboardOpenTopicsUpdatesSubscriptionVariables,
    DashboardOpenTopicsExistenceSubscription,
    DashboardOpenTopicsExistenceSubscriptionVariables
  >({
    queryDocument: gql`
      ${topicFragment}
      query DashboardOpenTopics($topicsFilter: topic_bool_exp!) {
        topics: topic(where: $topicsFilter) {
          ...DashboardOpenTopic
        }
      }
    `,
    updateSubscriptionDocument: gql`
      ${topicFragment}
      subscription DashboardOpenTopicsUpdates($topicsFilter: topic_bool_exp!, $lastUpdatedAt: timestamptz!) {
        topics: topic(where: { _and: [$topicsFilter, { updated_at: { _gt: $lastUpdatedAt } }] }) {
          ...DashboardOpenTopic
        }
      }
    `,
    existenceSubscriptionDocument: gql`
      ${DashboardTopicCard.fragments.topic}
      subscription DashboardOpenTopicsExistence($topicsFilter: topic_bool_exp!) {
        topics: topic(where: $topicsFilter) {
          id
        }
      }
    `,
    variables: {
      topicsFilter: {
        team_id: { _eq: teamId },
        closed_at: { _is_null: true },
        _not: {
          messages: {
            tasks: {
              done_at: { _is_null: true },
              _or: [{ user_id: { _eq: currentUser.id } }, { message: { user_id: { _eq: currentUser.id } } }],
            },
          },
        },
      },
    },
    itemsKey: "topics",
  });

  return orderBy(topics, (topic) => [getTopicLastUnreadMessageTimestamp(topic), getTopicLastMessageTimestamp(topic)], [
    "desc",
    "desc",
  ]);
};

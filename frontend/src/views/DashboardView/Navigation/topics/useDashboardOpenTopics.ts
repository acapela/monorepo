import gql from "graphql-tag";
import _ from "lodash";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useQueryItemsWithUpdates } from "~frontend/gql/utils/useQueryItemsWithUpdates";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import {
  DashboardOpenTopicsExistenceSubscription,
  DashboardOpenTopicsExistenceSubscriptionVariables,
  DashboardOpenTopicsQuery,
  DashboardOpenTopicsQueryVariables,
  DashboardOpenTopicsUpdatesSubscription,
  DashboardOpenTopicsUpdatesSubscriptionVariables,
} from "~gql";
import { isNotNullish } from "~shared/nullish";

import { DashboardTopicCard } from "./TopicCard";

const topicFragment = gql`
  ${DashboardTopicCard.fragments.topic}
  fragment DashboardOpenTopic on topic {
    id
    updated_at
    ...DashboardTopicCard_topic
    messages {
      tasks {
        updated_at
      }
    }
  }
`;

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
        topics: topic(
          where: {
            _and: [
              $topicsFilter
              {
                _or: [
                  { updated_at: { _gt: $lastUpdatedAt } }
                  { messages: { tasks: { updated_at: { _gt: $lastUpdatedAt } } } }
                ]
              }
            ]
          }
        ) {
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
    getTimestamps: (items) =>
      items
        .flatMap((topic) => [topic, ...topic.messages.flatMap((message) => message.tasks)])
        .map((t) => t.updated_at)
        .filter(isNotNullish),
  });

  return topics;
};

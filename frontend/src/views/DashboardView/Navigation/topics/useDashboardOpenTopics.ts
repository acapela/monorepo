import gql from "graphql-tag";

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

import { DashboardTopicCard } from "./TopicCard";

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
      ${DashboardTopicCard.fragments.topic}
      query DashboardOpenTopics($topicsFilter: topic_bool_exp!) {
        topics: topic(where: $topicsFilter) {
          ...DashboardTopicCard_topic
          id
        }
      }
    `,
    updateSubscriptionDocument: gql`
      ${DashboardTopicCard.fragments.topic}
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
          ...DashboardTopicCard_topic
          id
          updated_at
          messages {
            tasks {
              updated_at
            }
          }
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

  return topics;
};

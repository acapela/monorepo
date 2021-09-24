import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { DashboardOpenTopicsSubscription, DashboardOpenTopicsSubscriptionVariables } from "~gql";

import { DashboardTopicCard } from "./TopicCard";

export const useDashboardOpenTopics = () => {
  const teamId = useAssertCurrentTeamId();
  const currentUser = useAssertCurrentUser();

  const { data } = useSubscription<DashboardOpenTopicsSubscription, DashboardOpenTopicsSubscriptionVariables>(
    gql`
      ${DashboardTopicCard.fragments.topic}
      subscription DashboardTopics($teamId: uuid!, $userId: uuid!) {
        topic(
          where: {
            team_id: { _eq: $teamId }
            closed_at: { _is_null: true }
            _not: {
              messages: {
                tasks: {
                  done_at: { _is_null: true }
                  _or: [{ user_id: { _eq: $userId } }, { message: { user_id: { _eq: $userId } } }]
                }
              }
            }
          }
        ) {
          ...DashboardTopicCard_topic
          id
        }
      }
    `,
    { variables: { teamId, userId: currentUser.id } }
  );

  return data?.topic || [];
};

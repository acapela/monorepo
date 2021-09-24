import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RouteLink, routes } from "~frontend/router";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { DashboardTopicsSubscription, DashboardTopicsSubscriptionVariables } from "~gql";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";

import { DashboardTopicCard } from "./TopicCard";

export const TopicList = () => {
  const teamId = useAssertCurrentTeamId();
  const currentUser = useAssertCurrentUser();

  const { data } = useSubscription<DashboardTopicsSubscription, DashboardTopicsSubscriptionVariables>(
    gql`
      ${DashboardTopicCard.fragments.topic}
      subscription DashboardTopics($teamId: uuid!, $userId: uuid!) {
        topic(
          where: {
            team_id: { _eq: $teamId }
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

  const topics = data?.topic || [];

  if (!topics.length) {
    return <EmptyStatePlaceholder description="No topics to show" />;
  }

  return (
    <UITopicsHolder>
      {topics.map((topic) => {
        return (
          <RouteLink key={topic.id} passHref route={routes.dashboardTopic} params={{ topicId: topic.id }}>
            <a>
              <DashboardTopicCard topic={topic} />
            </a>
          </RouteLink>
        );
      })}
    </UITopicsHolder>
  );
};

const UITopicsHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

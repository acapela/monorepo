import React from "react";

import { RouteLink, routes } from "~frontend/router";
import { DashboardTopicCard_TopicFragment } from "~gql";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";

import { DashboardTopicCard } from "./TopicCard";

interface Props {
  topics: DashboardTopicCard_TopicFragment[];
}

export const TopicList = ({ topics }: Props) => {
  if (!topics.length) {
    return <EmptyStatePlaceholder description="No topics to show" />;
  }

  return (
    <>
      {topics.map((topic) => {
        return (
          <RouteLink key={topic.id} passHref route={routes.legacyTopic} params={{ topicId: topic.id }}>
            <a>
              <DashboardTopicCard topic={topic} />
            </a>
          </RouteLink>
        );
      })}
    </>
  );
};

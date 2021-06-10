import React from "react";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { UIScrollContainer, UITopicsList, UITopic } from ".";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  topics: TopicDetailedInfoFragment[];
  activeTopicId?: string;
}

export const StaticTopicsList = ({ topics, activeTopicId }: Props) => (
  <UIScrollContainer>
    <UITopicsList>
      {topics.map((topic) => (
        <UITopic isDragging={false}>
          <TopicMenuItem topic={topic} isActive={activeTopicId === topic.id} />
        </UITopic>
      ))}
    </UITopicsList>
  </UIScrollContainer>
);

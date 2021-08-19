import React from "react";

import { TopicDetailedInfoFragment } from "~gql";

import { UITopic, UITopicsList } from "./shared";
import { TopicMenuItem } from "./TopicMenuItem";

interface Props {
  topics: TopicDetailedInfoFragment[];
  activeTopicId: string | null;
}

export const StaticTopicsList = ({ topics, activeTopicId }: Props) => (
  <UITopicsList>
    {topics.map((topic) => (
      <UITopic key={topic.id}>
        <TopicMenuItem topic={topic} isActive={activeTopicId === topic.id} isEditingDisabled={true} />
      </UITopic>
    ))}
  </UITopicsList>
);

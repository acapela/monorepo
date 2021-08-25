import { gql } from "@apollo/client";
import React from "react";

import { withFragments } from "~frontend/gql/utils";
import { byIndexAscending } from "~frontend/topics/utils";
import { StaticTopicList_RoomFragment } from "~gql";

import { UITopic, UITopicsList } from "./shared";
import { TopicMenuItem } from "./TopicMenuItem";

export const topicListTopicFragment = gql`
  ${TopicMenuItem.fragments.topic}

  fragment TopicList_topic on topic {
    id
    index
    ...TopicMenuItem_topic
  }
`;

const fragments = {
  room: gql`
    ${TopicMenuItem.fragments.room}
    ${topicListTopicFragment}

    fragment StaticTopicList_room on room {
      ...TopicMenuItem_room
      topics {
        ...TopicList_topic
      }
    }
  `,
};

type Props = { room: StaticTopicList_RoomFragment; activeTopicId: string | null };

export const StaticTopicsList = withFragments(fragments, ({ room, activeTopicId }: Props) => (
  <UITopicsList>
    {room.topics
      .slice()
      .sort(byIndexAscending)
      .map((topic) => (
        <UITopic key={topic.id}>
          <TopicMenuItem room={room} topic={topic} isActive={activeTopicId === topic.id} isEditingDisabled />
        </UITopic>
      ))}
  </UITopicsList>
));

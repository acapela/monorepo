import { gql } from "@apollo/client";
import React from "react";

import { withFragments } from "~frontend/gql/utils";
import { byIndexAscending } from "~frontend/topics/utils";
import { StaticTopicList_RoomFragment } from "~gql";

import { UITopic, UITopicsList } from "./shared";
import { TopicMenuItem } from "./TopicMenuItem";

export const StaticTopicsList = withFragments(
  {
    room: gql`
      ${TopicMenuItem.fragments.room}
      ${TopicMenuItem.fragments.topic}

      fragment StaticTopicList_room on room {
        ...TopicMenuItem_room
        topics {
          id
          index
          ...TopicMenuItem_topic
        }
      }
    `,
  },
  ({ room, activeTopicId }: { room: StaticTopicList_RoomFragment; activeTopicId: string | null }) => (
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
  )
);

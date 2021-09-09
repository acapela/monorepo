import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";

import { RoomEntity } from "~frontend/clientdb/room";
import { withFragments } from "~frontend/gql/utils";
import { byIndexAscending } from "~frontend/topics/utils";
import { StaticTopicList_RoomFragment } from "~gql";

import { UITopic, UITopicsList } from "./shared";
import { TopicMenuItem } from "./TopicMenuItem";

type Props = { room: RoomEntity; activeTopicId: string | null };

export const StaticTopicsList = observer(({ room, activeTopicId }: Props) => (
  <UITopicsList>
    {room.topics.all
      .slice()
      .sort(byIndexAscending)
      .map((topic) => (
        <UITopic key={topic.id}>
          <TopicMenuItem room={room} topic={topic} isActive={activeTopicId === topic.id} isEditingDisabled />
        </UITopic>
      ))}
  </UITopicsList>
));

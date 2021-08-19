import { gql, useSubscription } from "@apollo/client";
import React, { Suspense } from "react";

import { withFragments } from "~frontend/gql/utils";
import { LazyTopicList_RoomFragment, TopicListSubscription, TopicListSubscriptionVariables } from "~gql";
import { namedLazy } from "~shared/namedLazy";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { StaticTopicsList } from "./StaticTopicsList";

const SortableTopicsList = namedLazy(() => import("./SortableTopicsList"), "SortableTopicsList");

interface Props {
  room: LazyTopicList_RoomFragment;
  activeTopicId: string | null;
  isStatic: boolean;
  isDisabled?: boolean;
}

export const LazyTopicsList = withFragments(
  {
    room: gql`
      ${StaticTopicsList.fragments.room}

      fragment LazyTopicList_room on room {
        id
        ...StaticTopicList_room
      }
    `,
  },
  ({ room, activeTopicId, isStatic, isDisabled }: Props) => {
    useSubscription<TopicListSubscription, TopicListSubscriptionVariables>(
      gql`
        subscription TopicList_room($roomId: uuid!) {
          room_by_pk(id: $roomId) {
            id
            topics {
              id
              index
            }
          }
        }
      `,
      { variables: { roomId: room.id } }
    );

    const staticTopicsList = <StaticTopicsList {...{ room, activeTopicId }} />;

    if (isStatic) {
      return staticTopicsList;
    }

    SortableTopicsList.preload();

    return (
      <ClientSideOnly fallback={staticTopicsList}>
        <Suspense fallback={staticTopicsList}>
          <SortableTopicsList {...{ room, activeTopicId, isDisabled }} />
        </Suspense>
      </ClientSideOnly>
    );
  }
);

import { gql } from "@apollo/client";
import React, { Suspense } from "react";

import { withFragments } from "~frontend/gql/utils";
import { LazyTopicList_RoomFragment } from "~gql";
import { namedLazy } from "~shared/namedLazy";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { StaticTopicsList } from "./StaticTopicsList";

const SortableTopicsList = namedLazy(() => import("./SortableTopicsList"), "SortableTopicsList");

interface Props {
  room: LazyTopicList_RoomFragment;
  activeTopicId: string | null;
  isDisabled?: boolean;
}

export const LazyTopicsList = withFragments(
  {
    room: gql`
      ${StaticTopicsList.fragments.room}
      fragment LazyTopicList_room on room {
        ...StaticTopicList_room
      }
    `,
  },
  ({ room, activeTopicId, isDisabled }: Props) => {
    SortableTopicsList.preload();

    return (
      <ClientSideOnly fallback={<StaticTopicsList room={room} activeTopicId={activeTopicId} />}>
        <Suspense fallback={<StaticTopicsList room={room} activeTopicId={activeTopicId} />}>
          <SortableTopicsList room={room} activeTopicId={activeTopicId} isDisabled={isDisabled} />
        </Suspense>
      </ClientSideOnly>
    );
  }
);

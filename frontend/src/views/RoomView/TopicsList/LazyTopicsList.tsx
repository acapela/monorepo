import { observer } from "mobx-react";
import React, { Suspense } from "react";

import { RoomEntity } from "~frontend/clientdb/room";
import { namedLazy } from "~shared/namedLazy";
import { ClientSideOnly } from "~ui/ClientSideOnly";

import { StaticTopicsList } from "./StaticTopicsList";

const SortableTopicsList = namedLazy(() => import("./SortableTopicsList"), "SortableTopicsList");

interface Props {
  room: RoomEntity;
  activeTopicId: string | null;
  isStatic: boolean;
  isDisabled?: boolean;
}

export const LazyTopicsList = observer(({ room, activeTopicId, isStatic, isDisabled }: Props) => {
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
});

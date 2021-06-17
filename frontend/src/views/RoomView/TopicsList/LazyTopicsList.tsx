import React, { Suspense } from "react";
import { TopicDetailedInfoFragment } from "~frontend/../../gql";
import { namedLazy } from "~frontend/../../shared/namedLazy";
import { ClientSideOnly } from "~frontend/../../ui/ClientSideOnly";
import { StaticTopicsList } from "./StaticTopicsList";

const SortableTopicsList = namedLazy(() => import("./SortableTopicsList"), "SortableTopicsList");

interface Props {
  topics: TopicDetailedInfoFragment[];
  activeTopicId: string | null;
  isDisabled?: boolean;
  onMoveToStart: (toMove: TopicDetailedInfoFragment) => void;
  onMoveToEnd: (toMove: TopicDetailedInfoFragment) => void;
  onMoveBetween: (
    toMove: TopicDetailedInfoFragment,
    start: TopicDetailedInfoFragment,
    end: TopicDetailedInfoFragment
  ) => void;
}

export const LazyTopicsList = ({
  topics,
  activeTopicId,
  isDisabled,
  onMoveToStart,
  onMoveBetween,
  onMoveToEnd,
}: Props) => {
  SortableTopicsList.preload();

  return (
    <ClientSideOnly>
      <Suspense fallback={<StaticTopicsList topics={topics} activeTopicId={activeTopicId} />}>
        <SortableTopicsList
          topics={topics}
          activeTopicId={activeTopicId}
          isDisabled={isDisabled}
          onMoveToStart={onMoveToStart}
          onMoveBetween={onMoveBetween}
          onMoveToEnd={onMoveToEnd}
        />
      </Suspense>
    </ClientSideOnly>
  );
};

import { useEffect, useState } from "react";
import { usePrevious } from "react-use";

import { TopicEntity } from "~frontend/clientdb/topic";
import { TopicList_RoomFragment } from "~gql";

import { TopicsFilter } from "./TopicsFilter";

interface UseTopicsFilterParams {
  topics: TopicEntity[];
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

export const useTopicsFilter = ({ topics, activeTopicId, isRoomOpen }: UseTopicsFilterParams) => {
  const isActiveTopicArchived = !!topics.find(({ id }) => id === activeTopicId)?.archived_at;

  const previousActiveTopicId = usePrevious(activeTopicId);
  const isPreviousActiveTopicIdArchived = usePrevious(isActiveTopicArchived);

  const [topicsFilter, setTopicsFilter] = useState<TopicsFilter>(isActiveTopicArchived ? "archived" : "present");

  useEffect(() => {
    //When the room gets reopened - hide archived topics.
    if (topicsFilter === "all" && isRoomOpen) {
      setTopicsFilter("present");
    }

    // When the room gets closed - show all topics.
    if (!isRoomOpen && topicsFilter !== "all") {
      setTopicsFilter("all");
    }
  }, [isRoomOpen, topicsFilter]);

  useEffect(() => {
    // When the topic gets archived - show archived topics to make active one present in the list.
    // Vice-versa on "Restore" action.

    if (topicsFilter === "all") return;

    if (activeTopicId !== previousActiveTopicId) return;

    if (isPreviousActiveTopicIdArchived === isActiveTopicArchived) return;

    setTopicsFilter(isActiveTopicArchived ? "archived" : "present");
  }, [activeTopicId, isActiveTopicArchived, isPreviousActiveTopicIdArchived, previousActiveTopicId, topicsFilter]);

  return {
    topicsFilter,
    requestChangeTopicsFilter: setTopicsFilter,
  };
};

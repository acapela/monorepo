import { useEffect, useState } from "react";
import { usePrevious } from "react-use";

import { TopicList_RoomFragment } from "~gql";

import { TopicsFilter } from "./TopicsFilter";

interface UseTopicsFilterParams {
  topics: TopicList_RoomFragment["topics"];
  activeTopicId: string | null;
  isRoomOpen: boolean;
}

export const useTopicsFilter = ({ topics, activeTopicId, isRoomOpen }: UseTopicsFilterParams) => {
  const isActiveTopicArchived = !!topics.find(({ id }) => id === activeTopicId)?.archived_at;

  const [topicsFilter, setTopicsFilter] = useState<TopicsFilter>(isActiveTopicArchived ? "archived" : "present");
  const previousTopicsFilter = usePrevious(topicsFilter);

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
    if (isActiveTopicArchived && topicsFilter === "present" && previousTopicsFilter === "present") {
      setTopicsFilter("archived");
    } else if (!isActiveTopicArchived && topicsFilter === "archived" && previousTopicsFilter === "archived") {
      setTopicsFilter("present");
    }
  }, [isActiveTopicArchived, previousTopicsFilter, topicsFilter]);

  return {
    topicsFilter,
    requestChangeTopicsFilter: setTopicsFilter,
  };
};

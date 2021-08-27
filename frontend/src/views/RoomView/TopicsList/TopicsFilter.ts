import { TopicList_RoomFragment } from "~gql";

export type TopicsFilter = "open" | "archived" | "all";

export const getRoomWithFilteredTopics = (room: TopicList_RoomFragment, filter: TopicsFilter) => {
  const topics = room.topics.filter((topic) => {
    if (filter === "open") {
      return topic.archived_at === null;
    }
    if (filter === "archived") {
      return topic.archived_at !== null;
    }

    return true;
  });

  return {
    ...room,
    topics,
  };
};

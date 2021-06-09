import { useState, useEffect } from "react";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useSingleRoomQuery } from "~frontend/gql/rooms";
import { useReorderTopicMutation } from "~frontend/gql/topics";
import { getIndexBetweenCurrentAndLast, getIndexBetweenFirstAndCurrent, getIndexBetweenItems } from "./order";

interface UseRoomTopicListProps {
  topics: TopicDetailedInfoFragment[];
  moveBetween: (
    toMove: TopicDetailedInfoFragment,
    betweenStart: TopicDetailedInfoFragment,
    betweenEnd: TopicDetailedInfoFragment
  ) => void;
  moveToEnd: (toMove: TopicDetailedInfoFragment) => void;
  moveToStart: (toMove: TopicDetailedInfoFragment) => void;
  isReordering: boolean;
  currentLastIndex?: string;
}

export function useRoomTopicList(roomId: string): UseRoomTopicListProps {
  const [roomData] = useSingleRoomQuery({ id: roomId });
  const currentTopics = roomData?.room?.topics ?? [];
  const [reorderTopic, { loading: isReordering }] = useReorderTopicMutation();

  const [topics, setTopicsToShow] = useState<TopicDetailedInfoFragment[]>([...currentTopics]);

  useEffect(() => {
    if (currentTopics.length !== topics.length) {
      setTopicsToShow([...currentTopics]);
    } else {
      // Prevents cases were single room query subscription flashes an wrongly ordered list with correct index
      setTopicsToShow([...currentTopics].sort(byIndexAscending));
    }
  }, [currentTopics]);

  function byIndexAscending(a: TopicDetailedInfoFragment, b: TopicDetailedInfoFragment) {
    if (a.index < b.index) return -1;
    if (a.index > b.index) return 1;
    return 0;
  }

  function moveTo(toMove: TopicDetailedInfoFragment, index: string) {
    const topicId = toMove.id;
    reorderTopic({ topicId, index });

    const allExceptMovedTopic = ({ id }: TopicDetailedInfoFragment) => id !== topicId;
    setTopicsToShow([...currentTopics.filter(allExceptMovedTopic), { ...toMove, index }].sort(byIndexAscending));
  }

  function moveBetween(
    toMove: TopicDetailedInfoFragment,
    betweenStart: TopicDetailedInfoFragment,
    betweenEnd: TopicDetailedInfoFragment
  ) {
    moveTo(toMove, getIndexBetweenItems(betweenStart.index, betweenEnd.index));
  }

  function moveToStart(toMove: TopicDetailedInfoFragment) {
    const firstTopicInList = topics[0];
    moveTo(toMove, getIndexBetweenFirstAndCurrent(firstTopicInList.index));
  }

  function moveToEnd(toMove: TopicDetailedInfoFragment) {
    const lastTopicInList = topics[topics.length - 1];
    moveTo(toMove, getIndexBetweenCurrentAndLast(lastTopicInList.index));
  }

  return {
    topics,
    moveBetween,
    moveToStart,
    moveToEnd,
    isReordering,
    currentLastIndex: topics.length > 0 ? topics[topics.length - 1].index : undefined,
  };
}

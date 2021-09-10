import { observer } from "mobx-react";
import { useEffect } from "react";
import styled from "styled-components";

import { RoomEntity } from "~frontend/clientdb/room";
import { routes } from "~frontend/router";

import { RoomView } from "./RoomView";
import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  room: RoomEntity;
  topicId: null | string;
}

export const RoomTopicView = observer(function RoomTopicView({ room, topicId }: Props) {
  const openTopics = room.topics.query((topic) => !topic.archived_at).all;
  const firstTopic = openTopics?.[0] ?? null;

  const selectedTopicId = topicId ?? firstTopic?.id ?? null;

  const selectedTopic = selectedTopicId ? room.topics.findById(selectedTopicId) : null;

  /*
    Routing on changes to topic

    We verify that a topic provided by the url exists within the topics of the room.
    This handle cases of deleted topics, and a "soft-catch" to potential 404 scenarios.

    Empty rooms will be route to their path without topicId.
    Topic ids given through url that are not found in the room, route to the first topic in room.
  */
  useEffect(() => {
    const topicsInRoom = room?.topics.all;

    // Newly created room stores topics as `null`
    if (!room || !topicsInRoom) {
      return;
    }

    const roomHasTopics = topicsInRoom.length > 0;
    const isFoundInRoom = (toFind: string) => topicsInRoom.find(({ id }) => id === toFind);

    const { id: roomId, space_id: spaceId } = room;

    const routeToRoomUrl = () =>
      routes.spaceRoom.replace({
        roomId,
        spaceId,
      });

    const routeToFirstTopicUrl = () =>
      routes.spaceRoomTopic.replace({
        topicId: firstTopic?.id,
        roomId,
        spaceId,
      });

    const topicIdGivenByUrl = topicId;
    if (topicIdGivenByUrl) {
      if (!roomHasTopics) {
        routeToRoomUrl();
      } else if (roomHasTopics && !isFoundInRoom(topicIdGivenByUrl)) {
        routeToFirstTopicUrl();
      }
    } else {
      if (openTopics.length > 0) {
        routeToFirstTopicUrl();
      }
    }
  }, [topicId, firstTopic, room, openTopics]);

  return (
    <RoomView roomId={room.id} selectedTopicId={selectedTopicId}>
      {selectedTopic && <TopicWithMessages key={selectedTopicId} room={room} topic={selectedTopic} />}
    </RoomView>
  );
});

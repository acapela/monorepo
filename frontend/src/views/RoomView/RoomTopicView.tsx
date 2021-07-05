import { useEffect } from "react";
import { routes } from "~frontend/routes";

import { TopicView } from "../topic/TopicView";
import { RoomView } from "./RoomView";
import { RoomDetailedInfoFragment } from "~frontend/../../gql";

interface Props {
  room: RoomDetailedInfoFragment;
  topicId: string | null;
}

export function RoomTopicView({ room, topicId }: Props) {
  const firstTopic = room?.topics?.[0] ?? null;

  function getSelectedTopicId() {
    if (topicId) return topicId;

    return firstTopic?.id ?? null;
  }

  const selectedTopicId = getSelectedTopicId();

  /*
    Routing on changes to topic

    We verify that a topic provided by the url exists within the topics of the room.
    This handle cases of deleted topics, and a "soft-catch" to potential 404 scenarios.

    Empty rooms will be route to their path without topicId.
    Topic ids given through url that are not found in the room, route to the first topic in room.
  */
  useEffect(() => {
    const topicsInRoom = room?.topics;

    // Newly created room stores topics as `null`
    if (!room || !topicsInRoom) {
      return;
    }

    const topicIdGivenByUrl = topicId;
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

    if (topicIdGivenByUrl) {
      if (!roomHasTopics) {
        routeToRoomUrl();
      } else if (roomHasTopics && !isFoundInRoom(topicIdGivenByUrl)) {
        routeToFirstTopicUrl();
      }
    } else {
      if (roomHasTopics) {
        routeToFirstTopicUrl();
      }
    }
  }, [topicId, firstTopic, room?.topics]);

  return (
    <RoomView room={room} selectedTopicId={selectedTopicId}>
      {selectedTopicId && <TopicView topicId={selectedTopicId} />}
    </RoomView>
  );
}

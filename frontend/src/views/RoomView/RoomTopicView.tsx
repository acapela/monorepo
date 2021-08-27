import { gql } from "@apollo/client";
import { useEffect, useMemo } from "react";

import { withFragments } from "~frontend/gql/utils";
import { routes } from "~frontend/router";
import { RoomTopicView_RoomFragment } from "~gql";

import { RoomView } from "./RoomView";
import { TopicWithMessages } from "./TopicWithMessages";

const fragments = {
  room: gql`
    ${RoomView.fragments.room}
    ${TopicWithMessages.fragments.room}
    ${TopicWithMessages.fragments.topic}

    fragment RoomTopicView_room on room {
      id
      space_id
      topics {
        id
        ...TopicWithMessages_topic
      }
      ...RoomView_room
      ...TopicWithMessages_room
    }
  `,
};

interface Props {
  room: RoomTopicView_RoomFragment;
  topicId: null | string;
}

export const RoomTopicView = withFragments(fragments, function RoomTopicView({ room, topicId }: Props) {
  const firstTopic = room.topics?.[0] ?? null;

  const selectedTopicId = topicId ?? firstTopic?.id ?? null;
  const selectedTopic = useMemo(
    () => room.topics.find((topic) => topic.id == selectedTopicId) ?? null,
    [room, selectedTopicId]
  );

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
      if (roomHasTopics) {
        routeToFirstTopicUrl();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, firstTopic, room.topics]);

  return (
    <RoomView room={room} selectedTopicId={selectedTopicId}>
      {selectedTopic && <TopicWithMessages key={selectedTopicId} room={room} topic={selectedTopic} />}
    </RoomView>
  );
});

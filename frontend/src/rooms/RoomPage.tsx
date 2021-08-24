import { gql, useQuery } from "@apollo/client";
import React from "react";

import { AppLayout } from "~frontend/layouts/AppLayout";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";
import { RoomPageQuery, RoomPageQueryVariables } from "~gql";

interface Props {
  spaceId: string;
  roomId: string;
  topicId: string | null;
}

export const RoomPage = ({ topicId, spaceId, roomId }: Props) => {
  const { data, previousData, loading } = useQuery<RoomPageQuery, RoomPageQueryVariables>(
    gql`
      ${RoomTopicView.fragments.room}
      ${RoomTopicView.fragments.topic}

      query RoomPage($roomId: uuid!, $topicId: uuid, $hasTopicId: Boolean!) {
        room: room_by_pk(id: $roomId) {
          id
          is_private
          ...RoomTopicView_room
        }
        topics: topic(where: { id: { _eq: $topicId } }) @include(if: $hasTopicId) {
          ...RoomTopicView_topic
        }
      }
    `,
    { variables: { roomId, topicId: topicId, hasTopicId: !!topicId } }
  );

  const hasRoom = Boolean(data && data.room);

  useRoomWithClientErrorRedirects({
    spaceId,
    roomId,
    hasRoom,
    loading,
  });

  if (!data || !data.room) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  const { room, topics } = data;
  const topic = topics && topics[0];

  return (
    <AppLayout>
      <RoomTopicView room={room} topic={topic} />
    </AppLayout>
  );
};

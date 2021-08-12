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
  const { data, loading } = useQuery<RoomPageQuery, RoomPageQueryVariables>(
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

  useRoomWithClientErrorRedirects({ spaceId, roomId, hasRoom: Boolean(data && data.room), loading });

  if (!data) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  const { room, topics } = data;
  const topic = topics && topics[0];

  return (
    <AppLayout>
      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
      <RoomTopicView room={room!} topic={topic} />
    </AppLayout>
  );
};

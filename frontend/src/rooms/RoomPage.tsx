import { gql, useQuery } from "@apollo/client";
import React from "react";

import { AppLayout } from "~frontend/layouts/AppLayout";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";
import { RoomPage_RoomQuery, RoomPage_RoomQueryVariables } from "~gql";

interface Props {
  spaceId: string;
  roomId: string;
  topicId: string | null;
}

export const RoomPage = ({ topicId, spaceId, roomId }: Props) => {
  const { data, loading } = useQuery<RoomPage_RoomQuery, RoomPage_RoomQueryVariables>(
    gql`
      ${RoomTopicView.fragments.room}

      query RoomPage_room($roomId: uuid!) {
        room: room_by_pk(id: $roomId) {
          id
          is_private
          ...RoomTopicView_room
        }
      }
    `,
    { variables: { roomId } }
  );

  const hasRoom = Boolean(data && data.room);

  useRoomWithClientErrorRedirects({ spaceId, roomId, hasRoom, loading });

  if (!data || !data.room) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  const { room } = data;

  return (
    <AppLayout>
      <RoomTopicView room={room} topicId={topicId} />
    </AppLayout>
  );
};

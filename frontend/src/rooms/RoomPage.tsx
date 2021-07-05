import React from "react";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";
import { AppLayout } from "../layouts/AppLayout";

interface Props {
  spaceId: string;
  roomId: string;
  topicId: string | null;
}

export const RoomPage = ({ topicId, spaceId, roomId }: Props) => {
  const { room } = useRoomWithClientErrorRedirects({ spaceId, roomId });

  if (!room) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  return (
    <AppLayout>
      <RoomTopicView room={room} topicId={topicId} />
    </AppLayout>
  );
};

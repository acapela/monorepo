import React from "react";
import { routes } from "~frontend/routes";
import { RoomPage } from "~frontend/rooms/RoomPage";

export function RoomOrTopicPage() {
  const topicParams = routes.spaceRoomTopic.useParams()?.route;
  const roomParams = routes.spaceRoom.useParams()?.route;

  // We're on topic route
  if (topicParams) {
    const { spaceId, roomId, topicId } = topicParams;
    return <RoomPage spaceId={spaceId} roomId={roomId} topicId={topicId} />;
  }

  // We're on main room route (room has no topics yet)
  if (roomParams) {
    const { roomId, spaceId } = roomParams;
    return <RoomPage spaceId={spaceId} roomId={roomId} topicId={null} />;
  }

  throw new Error(`RoomOrTopicPage used for other route than single room or single topic`);
}

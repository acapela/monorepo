import React from "react";

import { singleTopicQueryManager, topicMessagesQueryManager } from "~frontend/gql/topics";
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

  if (topicId) {
    /**
     * As we're returning null early in case there is no room, let's manually inform next what queries we want to pre-fetch
     * to have full data ready on initial render
     */
    singleTopicQueryManager.requestPrefetch({ id: topicId });
    topicMessagesQueryManager.requestPrefetch({ topicId });
  }

  if (!room) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  return (
    <AppLayout>
      <RoomTopicView room={room} topicId={topicId} />
    </AppLayout>
  );
};

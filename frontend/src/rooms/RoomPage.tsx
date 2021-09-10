import { observer } from "mobx-react";
import React from "react";

import { clientdb } from "~frontend/clientdb";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";

interface Props {
  spaceId: string;
  roomId: string;
  topicId: string | null;
}

export const RoomPage = observer(({ topicId, spaceId, roomId }: Props) => {
  // TODOC
  // useRoomWithClientErrorRedirects({ spaceId, roomId, hasRoom, loading });

  const room = clientdb.room.findById(roomId);

  console.log({ room });
  if (!room) return null;

  return (
    <AppLayout>
      <RoomTopicView room={room} topicId={topicId} />
    </AppLayout>
  );
});

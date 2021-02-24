import Head from "next/head";
import React from "react";
import { authenticated } from "../../../../src/authentication/authenticated";
import { useRoom } from "../../../../src/rooms/Room";
import { RoomLayout } from "../../../../src/rooms/RoomLayout";
import { Thread } from "../../../../src/thread/Thread";
import { usePathParameter } from "../../../../src/utils";

export default authenticated(() => {
  const roomId = usePathParameter("roomId");
  const threadId = usePathParameter("threadId");
  const { loading, room } = useRoom(roomId);

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <RoomLayout room={room}>
      <Head>
        <title>{room.name} | Acapela</title>
      </Head>
      <Thread room={room} id={threadId} />
    </RoomLayout>
  );
});

import { useGetSingleRoomQuery } from "@acapela/frontend/gql";
import Head from "next/head";
import React from "react";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { RoomLayout } from "@acapela/frontend/rooms/RoomLayout";
import { ThreadView } from "@acapela/frontend/views/thread/ThreadView";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";

export default authenticated(() => {
  const roomId = usePathParameter("roomId");
  const threadId = usePathParameter("threadId");

  assert(roomId, "Room ID Required");
  assert(threadId, "Room ID Required");

  const { loading, data } = useGetSingleRoomQuery({ variables: { id: roomId } });

  const room = data?.room;

  if (loading) {
    return <span>Loading...</span>;
  }

  if (!room) {
    return <>No room</>;
  }

  return (
    <RoomLayout roomId={roomId}>
      <Head>
        <title>{room.name} | Acapela</title>
      </Head>
      <ThreadView id={threadId} />
    </RoomLayout>
  );
});

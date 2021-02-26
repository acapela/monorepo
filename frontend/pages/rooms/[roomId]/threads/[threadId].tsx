import { useGetSingleRoomQuery } from "@acapela/frontend/gql";
import Head from "next/head";
import React from "react";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { RoomLayout } from "@acapela/frontend/rooms/RoomLayout";
import { Thread } from "@acapela/frontend/thread/Thread";
import { usePathParameter } from "@acapela/frontend/utils";

export default authenticated(() => {
  const roomId = usePathParameter("roomId");
  const threadId = usePathParameter("threadId");
  const { loading, data } = useGetSingleRoomQuery({ variables: { id: roomId } });

  const room = data?.room;

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

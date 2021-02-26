import { useGetSingleRoomQuery } from "@acapela/frontend/gql";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { RoomLayout, ThreadCreationButton } from "@acapela/frontend/rooms/RoomLayout";
import { usePathParameter } from "@acapela/frontend/utils";

export default authenticated(() => {
  const { replace } = useRouter();
  const roomId = usePathParameter("roomId");
  const {
    loading,
    data: { room },
  } = useGetSingleRoomQuery({ variables: { id: roomId } });

  useEffect(() => {
    if (room && room.threads && room.threads.length) {
      replace(`/rooms/${room.id}/threads/${room.threads[0].id}`);
    }
  }, [room]);

  // TODO: use a proper loader here
  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <RoomLayout room={room}>
      <Head>
        <title>{room.name} | Acapela</title>
      </Head>
      <div className="max-w-md mx-auto">
        <div className="mb-4">This room has no agenda points yet.</div>
        <ThreadCreationButton roomId={room.id} />
      </div>
    </RoomLayout>
  );
});

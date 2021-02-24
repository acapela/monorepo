import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { authenticated } from "../../src/authentication/authenticated";
import { useRoom } from "../../src/rooms/Room";
import { RoomLayout, ThreadCreationButton } from "../../src/rooms/RoomLayout";
import { usePathParameter } from "../../src/utils";

export default authenticated(() => {
  const { replace } = useRouter();
  const roomId = usePathParameter("roomId");
  const { loading, room } = useRoom(roomId);

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

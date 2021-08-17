import { useEffect } from "react";

import { fetchPrivateRoom, useSingleRoomQuery } from "~frontend/gql/rooms";
import { routes } from "~frontend/router";
import { openForbiddenAccessModal } from "~frontend/utils/accessForbidden";
import { openNotFoundModal } from "~frontend/utils/notFound";

interface Props {
  spaceId: string;
  roomId: string;
}

/*
  We're using different `x-hasura-role`s to determine if a room has been locked or not.

  Hasura doesn't provide us with an out-of-the-box way to differentiate between a non-existing room or 
  a room that can't be accessed, i.e. our queries will return `null` instead of an equivalent error to a 404 or 401

  In order to get around this, we've introduced the `visitor` role, which can see a very limited parts of the
  room as long as that `visitor` is a member of the team. Fetching a private room uses the `visitor` role.

  So, whenever a `user` gets a "null" room, the `visitor` can check if the room has private access
  or if the room is not found.
*/
async function isRoomPrivate(roomId: string) {
  const { privateRoom } = await fetchPrivateRoom({ id: roomId }, { fetchPolicy: "no-cache" });
  return privateRoom?.is_private ?? false;
}

export const useRoomWithClientErrorRedirects = ({ roomId, spaceId }: Props) => {
  const [room, { loading }] = useSingleRoomQuery({ id: roomId });

  useEffect(() => {
    async function redirectOnClientError() {
      const isRoomViewableByUser = !!room;
      if (!isRoomViewableByUser && (await isRoomPrivate(roomId))) {
        await openForbiddenAccessModal({ place: "room" });
        routes.space.replace({ spaceId });
      } else if (!isRoomViewableByUser) {
        await openNotFoundModal({ place: "room" });
        routes.space.replace({ spaceId });
      }
    }
    if (!loading) redirectOnClientError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, loading]);

  return { room } as const;
};

import { useEffect } from "react";

import { fetchPrivateRoom } from "~frontend/gql/rooms";
import { routes } from "~frontend/router";
import { openForbiddenAccessModal } from "~frontend/utils/accessForbidden";
import { openNotFoundModal } from "~frontend/utils/notFound";

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

type Props = {
  roomId: string;
  spaceId: string;
  hasRoom: boolean;
  loading: boolean;
};

export const useRoomWithClientErrorRedirects = ({ roomId, spaceId, hasRoom, loading }: Props) => {
  useEffect(() => {
    async function redirectOnClientError() {
      if (hasRoom) {
        return;
      }
      if (await isRoomPrivate(roomId)) {
        await openForbiddenAccessModal({ place: "room" });
      } else {
        await openNotFoundModal({ place: "room" });
      }
      routes.space.replace({ spaceId });
    }
    if (!loading) redirectOnClientError();
  }, [hasRoom, loading, roomId, spaceId]);
};

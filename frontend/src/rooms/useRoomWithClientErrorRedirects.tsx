import { useEffect } from "react";
import { routes } from "~frontend/../routes";
import { useSingleRoomQuery, fetchPrivateRoom } from "~frontend/gql/rooms";

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
  const [room] = useSingleRoomQuery({ id: roomId });

  useEffect(() => {
    async function redirectOnClientError() {
      const isRoomViewableByUser = !!room;
      if (!isRoomViewableByUser && (await isRoomPrivate(roomId))) {
        // TODO: Pass `locked-room` info as query param. Show that access is forbidden
        routes.space.replace({ spaceId });
      } else if (!isRoomViewableByUser) {
        // TODO: 404 page
        routes.space.replace({ spaceId });
      }
    }

    redirectOnClientError();
  }, [room]);

  return { room } as const;
};

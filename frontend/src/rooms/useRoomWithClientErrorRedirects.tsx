import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

import { routes } from "~frontend/router";
import { openNotFoundModal } from "~frontend/utils/notFound";
import { PrivateRoomExistenceQuery, PrivateRoomExistenceQueryVariables } from "~gql";

import { openForbiddenAccessModal } from "./accessForbiddenModal";

type Props = {
  roomId: string;
  spaceId: string;
  hasRoom: boolean;
  loading: boolean;
};

export const useRoomWithClientErrorRedirects = ({ roomId, spaceId, hasRoom, loading }: Props) => {
  const { data: privateRoomResult } = useQuery<PrivateRoomExistenceQuery, PrivateRoomExistenceQueryVariables>(
    gql`
      query PrivateRoomExistence($roomId: uuid!) {
        privateRooms: private_room(where: { id: { _eq: $roomId } }) {
          id
        }
      }
    `,
    loading || hasRoom ? { skip: true } : { variables: { roomId } }
  );
  useEffect(() => {
    async function redirectOnClientError() {
      if (hasRoom) {
        return;
      }
      if (privateRoomResult?.privateRooms?.length) {
        await openForbiddenAccessModal({ place: "room" });
      } else {
        await openNotFoundModal({ place: "room" });
      }
      routes.home.push({});
    }
    if (!loading) redirectOnClientError();
  }, [hasRoom, loading, privateRoomResult, roomId, spaceId]);
};

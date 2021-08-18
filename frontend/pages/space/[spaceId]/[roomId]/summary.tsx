import { gql, useQuery } from "@apollo/client";
import React from "react";

import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";
import { routes } from "~frontend/router";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomSummaryView } from "~frontend/views/RoomView/RoomSummaryView";
import { RoomSummaryPageQuery, RoomSummaryPageQueryVariables } from "~gql";

const Page = () => {
  const { roomId, spaceId } = routes.spaceRoomSummary.useAssertParams().route;
  const { data, loading } = useQuery<RoomSummaryPageQuery, RoomSummaryPageQueryVariables>(
    gql`
      ${RoomSummaryView.fragments.room}

      query RoomSummaryPage($roomId: uuid!) {
        room: room_by_pk(id: $roomId) {
          ...RoomSummaryView_room
        }
      }
    `,
    { variables: { roomId } }
  );
  useRoomWithClientErrorRedirects({ spaceId, roomId, hasRoom: Boolean(data && data.room), loading });

  if (!data) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  return <RoomSummaryView room={data.room} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

import { gql, useQuery } from "@apollo/client";
import React from "react";

import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { clientdb } from "~frontend/clientdb";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";
import { routes } from "~frontend/router";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomSummaryView } from "~frontend/views/RoomView/RoomSummaryView";
import { RoomSummaryPageQuery, RoomSummaryPageQueryVariables } from "~gql";

const Page = () => {
  const { roomId, spaceId } = routes.spaceRoomSummary.useAssertParams().route;

  // TODOC
  // useRoomWithClientErrorRedirects({ spaceId, roomId, hasRoom: Boolean(data && data.room), loading });

  const room = clientdb.room.findById(roomId);

  // TODOC
  if (!room) return <div>no room</div>;

  return <RoomSummaryView room={room} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

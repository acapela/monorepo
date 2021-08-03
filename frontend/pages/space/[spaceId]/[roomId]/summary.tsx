import React from "react";
import { routes } from "~frontend/router";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomSummaryView } from "~frontend/views/RoomView/RoomSummaryView";
import { useRoomWithClientErrorRedirects } from "~frontend/rooms/useRoomWithClientErrorRedirects";

const Page = () => {
  const { roomId, spaceId } = routes.spaceRoomSummary.useAssertParams().route;
  const { room } = useRoomWithClientErrorRedirects({ spaceId, roomId });

  if (!room) {
    return null; // Left blank on purpose. Won't render for clients.
  }

  return <RoomSummaryView room={room} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

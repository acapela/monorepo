import React from "react";
import { routes } from "~frontend/routes";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomSummaryView } from "~frontend/views/RoomView/RoomSummaryView";

const Page = () => {
  const { roomId } = routes.spaceRoomSummary.useParams().route;

  return <RoomSummaryView roomId={roomId} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

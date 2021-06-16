import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { routes } from "~frontend/routes";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";

const SpaceRoomPage = () => {
  const { roomId } = routes.spaceRoom.useParams();

  return <RoomTopicView roomId={roomId} topicId={null} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpaceRoomPage, AppLayout);

export default SpaceRoomPage;

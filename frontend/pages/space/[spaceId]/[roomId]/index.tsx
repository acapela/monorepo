import React from "react";
import { routes } from "~frontend/routes";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";
import { useRoomAccessCheck } from "~frontend/rooms/useRoomAccessCheck";

const SpaceRoomPage = () => {
  const { roomId, spaceId } = routes.spaceRoom.useParams();

  const { room } = useRoomAccessCheck({ spaceId, roomId });

  if (!room) {
    return <></>;
  }

  return <RoomTopicView room={room} topicId={null} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(SpaceRoomPage, AppLayout);

export default SpaceRoomPage;

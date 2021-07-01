import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { RoomPage } from "~frontend/rooms/RoomPage";
import { routes } from "~frontend/routes";

const SpaceRoomPage = () => {
  const { roomId, spaceId } = routes.spaceRoom.useParams();

  return <RoomPage spaceId={spaceId} roomId={roomId} topicId={null} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

export default SpaceRoomPage;

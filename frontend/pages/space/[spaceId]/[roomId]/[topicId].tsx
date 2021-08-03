import React from "react";
import { routes } from "~frontend/router";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";

import { RoomPage } from "~frontend/rooms/RoomPage";

const Page = () => {
  const { spaceId, roomId, topicId } = routes.spaceRoomTopic.useAssertParams().route;

  return <RoomPage spaceId={spaceId} roomId={roomId} topicId={topicId} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

export default Page;

import React from "react";
import { routes } from "~frontend/routes";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomView } from "~frontend/views/RoomView";

const Page = () => {
  const { roomId, topicId } = routes.spaceRoomTopic.useParams();

  return <RoomView topicId={topicId} roomId={roomId} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

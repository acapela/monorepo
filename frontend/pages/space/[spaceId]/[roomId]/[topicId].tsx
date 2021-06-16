import React from "react";
import { routes } from "~frontend/routes";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { RoomTopicView } from "~frontend/views/RoomView/RoomTopicView";

const Page = () => {
  const { roomId, topicId } = routes.spaceRoomTopic.useParams();

  return <RoomTopicView roomId={roomId} topicId={topicId} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;

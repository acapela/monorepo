import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { RoomLayout } from "~frontend/rooms/RoomLayout";
import { usePathParameter } from "~frontend/utils";
import { TopicView } from "~frontend/views/topic/TopicView";
import { assert } from "~shared/assert";

const Page = () => {
  const topicId = usePathParameter("topicId");

  assert(topicId, "Topic ID Required");

  return (
    <RoomLayout>
      <TopicView id={topicId} />
    </RoomLayout>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

export default Page;

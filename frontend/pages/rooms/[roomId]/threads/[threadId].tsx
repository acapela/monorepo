import React from "react";
import { RoomLayout } from "@acapela/frontend/rooms/RoomLayout";
import { ThreadView } from "@acapela/frontend/views/thread/ThreadView";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";
import { withServerSideAuthRedirect } from "@acapela/frontend/authentication/withServerSideAuthRedirect";

const Page = () => {
  const threadId = usePathParameter("threadId");

  assert(threadId, "Room ID Required");

  return (
    <RoomLayout>
      <ThreadView id={threadId} />
    </RoomLayout>
  );
};

export const getServerSideProps = withServerSideAuthRedirect();

export default Page;

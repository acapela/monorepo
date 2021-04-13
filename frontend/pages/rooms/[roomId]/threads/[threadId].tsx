import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { RoomLayout } from "~frontend/rooms/RoomLayout";
import { usePathParameter } from "~frontend/utils";
import { ThreadView } from "~frontend/views/thread/ThreadView";
import { assert } from "~shared/assert";

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

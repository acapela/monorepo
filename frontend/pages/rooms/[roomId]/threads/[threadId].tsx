import React from "react";
import { authenticated } from "@acapela/frontend/authentication/authenticated";
import { RoomLayout } from "@acapela/frontend/rooms/RoomLayout";
import { ThreadView } from "@acapela/frontend/views/thread/ThreadView";
import { usePathParameter } from "@acapela/frontend/utils";
import { assert } from "@acapela/shared/assert";
import { assignPageLayout } from "@acapela/frontend/utils/pageLayout";

const Page = authenticated(() => {
  const threadId = usePathParameter("threadId");

  assert(threadId, "Room ID Required");

  return <ThreadView id={threadId} />;
});

assignPageLayout(Page, RoomLayout);

export default Page;

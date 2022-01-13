import React, { useState } from "react";

import { SidebarLayout } from "./sidebar";

type PageType = "settings" | "notification";

export const TestRouter = function TestRouter() {
  const [page, setPage] = useState<{ type: PageType; props?: Notification }>({ type: "settings" });

  function handleShowSettings() {
    setPage({ type: "settings" });
  }

  function handleShowNotification(props: Notification) {
    setPage({ type: "notification", props });
  }

  return (
    <SidebarLayout onShowSettings={handleShowSettings} onShowNotification={handleShowNotification}>
      {page.type === "settings" && <>Settings</>}
      {page.type === "notification" && <>Notification</>}
    </SidebarLayout>
  );
};

import React, { useState } from "react";

import { SettingsView } from "./settings";
import { SidebarLayout } from "./sidebar";

type PageType = "settings" | "notification";

// TODO: Refactor the whole thing with appropriate router
export const TestRouter = function TestRouter() {
  const [page] = useState<{ type: PageType; props?: Notification }>({ type: "settings" });

  return (
    <SidebarLayout>
      {page.type === "settings" && <SettingsView />}
      {page.type === "notification" && <>Notification</>}
    </SidebarLayout>
  );
};

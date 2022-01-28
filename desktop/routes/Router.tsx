import React from "react";

import { allRouteNames, desktopRouter } from "@aca/desktop/routes";
import { FocusModeView } from "@aca/desktop/views/FocusMode/FocusModeView";
import { ListView } from "@aca/desktop/views/ListView/ListView";
import { NotificationView } from "@aca/desktop/views/NotificationView";
import { SettingsView } from "@aca/desktop/views/settings";

import { Redirect } from "./Redirect";

export function Router() {
  const activeRoute = desktopRouter.useRoute(allRouteNames);

  if (!activeRoute) {
    return <>"404"</>;
  }

  switch (activeRoute.name) {
    case "home":
      return <Redirect to={desktopRouter.createURL("list", { listId: "inbox" })} />;
    case "settings":
      return <SettingsView />;
    case "notification":
      return <NotificationView notificationId={activeRoute.params.notificationId} />;
    case "list":
      return <ListView listId={activeRoute.params.listId} />;
    case "focus":
      return <FocusModeView notificationId={activeRoute.params.notificationId} />;
  }

  return <>"404"</>;
}
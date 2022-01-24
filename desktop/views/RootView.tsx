import React from "react";

import { restartApp } from "@aca/desktop/bridge/system";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { allRouteNames, desktopRouter } from "../routes";
import { FocusModeView } from "./FocusMode/FocusModeView";
import { HomeView } from "./HomeView";
import { NotificationView } from "./NotificationView";
import { SettingsView } from "./settings";

function Routes() {
  const activeRoute = desktopRouter.useRoute(allRouteNames);

  if (!activeRoute) {
    return <>"404"</>;
  }

  switch (activeRoute.name) {
    case "home":
      return <HomeView />;
    case "settings":
      return <SettingsView />;
    case "notification":
      return <NotificationView notificationId={activeRoute.params.notificationId} />;
    case "focus":
      return <FocusModeView />;
  }

  return <>"404"</>;
}

export function RootView() {
  useShortcut(["Mod", "Shift", "D"], () => {
    restartApp();
  });

  return (
    <div>
      <Routes />
    </div>
  );
}

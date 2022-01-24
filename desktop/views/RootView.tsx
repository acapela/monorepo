import React from "react";

import { clearAllData, restartApp } from "@aca/desktop/bridge/system";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { useCurrentUser } from "../client/auth/useCurrentUser";
import { allRouteNames, desktopRouter } from "../routes";
import { FocusModeView } from "./FocusMode/FocusModeView";
import { HomeView } from "./HomeView";
import { LoginView } from "./LoginView";
import { NotificationView } from "./NotificationView";
import { SettingsView } from "./settings";
import { SidebarLayout } from "./sidebar";

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

  useShortcut(["Mod", "Shift", "C"], () => {
    clearAllData();
  });

  const user = useCurrentUser();

  if (!user) {
    return <LoginView />;
  }

  return (
    <SidebarLayout>
      <Routes />
    </SidebarLayout>
  );
}

import React from "react";

import { allNotificationsList } from "@aca/desktop/domains/list/all";
import { Redirect, allRouteNames, desktopRouter } from "@aca/desktop/routes";
import { FocusModeView } from "@aca/desktop/views/FocusMode/FocusModeView";
import { ListView } from "@aca/desktop/views/ListView/ListView";
import { NotificationView } from "@aca/desktop/views/NotificationView";
import { SettingsView } from "@aca/desktop/views/SettingsView";

import { LoginView } from "../views/LoginView";
import { ConnectToolsView } from "../views/OnboardingView/ConnectToolsView";
import { OnboardingView } from "../views/OnboardingView/OnboardingView";

export function Router() {
  const activeRoute = desktopRouter.useRoute(allRouteNames);

  if (!activeRoute) {
    return <Redirect to="list" params={{ listId: allNotificationsList.id }} />;
  }

  switch (activeRoute.name) {
    case "home":
      return <Redirect to="list" params={{ listId: allNotificationsList.id }} />;
    case "settings":
      return <SettingsView sectionId={activeRoute.params.section} />;
    case "notification":
      return <NotificationView notificationId={activeRoute.params.notificationId} />;
    case "list":
      return <ListView listId={activeRoute.params.listId} />;
    case "focus":
      return <FocusModeView notificationId={activeRoute.params.notificationId} listId={activeRoute.params.listId} />;
    case "onboarding":
      return <OnboardingView />;
    case "connect":
      return <ConnectToolsView />;
    case "login":
      return <LoginView />;
  }

  return <Redirect to="list" params={{ listId: allNotificationsList.id }} />;
}

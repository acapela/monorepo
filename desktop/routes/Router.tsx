import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect } from "react";

import { allNotificationsList } from "@aca/desktop/domains/list/all";
import { AppRedirect, desktopRouter } from "@aca/desktop/routes";
import { FocusModeView } from "@aca/desktop/views/FocusMode/FocusModeView";
import { ListView } from "@aca/desktop/views/ListView/ListView";
import { NotificationView } from "@aca/desktop/views/NotificationView";
import { SettingsView } from "@aca/desktop/views/SettingsView";

import { requestNavigateToList, requestOpenRoute } from "../bridge/navigation";
import { focusSessionStore } from "../store/focus";
import { historyStore } from "../store/history";
import { ComposeView } from "../views/ComposeView";
import { LoginView } from "../views/LoginView";
import { ConnectToolsView } from "../views/OnboardingView/ConnectToolsView";
import { OnboardingView } from "../views/OnboardingView/OnboardingView";

export const Router = observer(function Router() {
  const activeRoute = desktopRouter.activeRoute;

  useLayoutEffect(() => {
    const { lastOpenedListId } = historyStore;

    if (!lastOpenedListId) return;

    desktopRouter.replace("list", { listId: lastOpenedListId });
  }, []);

  useEffect(() => {
    return requestNavigateToList.subscribe(({ listId }) => {
      desktopRouter.navigate("list", { listId });
    });
  });

  useEffect(() => {
    return requestOpenRoute.subscribe(({ path }) => {
      desktopRouter.navigateByPath(path);
    });
  });

  if (!activeRoute) {
    return <AppRedirect to="list" params={{ listId: allNotificationsList.id }} />;
  }

  switch (activeRoute.name) {
    case "home":
      return <AppRedirect to="list" params={{ listId: allNotificationsList.id }} />;
    case "settings":
      return <SettingsView sectionId={activeRoute.params.section} />;
    case "notification":
      return <NotificationView notificationId={activeRoute.params.notificationId} />;
    case "list":
      return <ListView key={activeRoute.params.listId} listId={activeRoute.params.listId} />;
    case "focus":
      if (!focusSessionStore.session) {
        return <AppRedirect to="list" params={{ listId: allNotificationsList.id }} />;
      }

      return <FocusModeView session={focusSessionStore.session} />;
    case "onboarding":
      return <OnboardingView />;
    case "connect":
      return <ConnectToolsView />;
    case "login":
      return <LoginView />;
    case "compose":
      return <ComposeView />;
  }

  return <AppRedirect to="list" params={{ listId: allNotificationsList.id }} />;
});

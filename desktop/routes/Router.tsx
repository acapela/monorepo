import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect } from "react";

import { allNotificationsList, getListById } from "@aca/desktop/domains/list/all";
import { AppRedirect, desktopRouter } from "@aca/desktop/routes";
import { FocusModeView } from "@aca/desktop/views/FocusMode/FocusModeView";
import { ListView } from "@aca/desktop/views/ListView/ListView";
import { NotificationView } from "@aca/desktop/views/NotificationView";
import { SettingsView } from "@aca/desktop/views/SettingsView";

import { goToList } from "../actions/lists";
import { openFocusMode } from "../actions/notification";
import { requestNavigateToList, requestOpenFocusMode } from "../bridge/navigation";
import { runActionWithTarget } from "../domains/runAction";
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
      const list = getListById(listId);

      if (!list) return;

      runActionWithTarget(goToList, list);
    });
  });

  useEffect(() => {
    return requestOpenFocusMode.subscribe(({ listId }) => {
      const list = getListById(listId);

      if (!list) return;

      runActionWithTarget(openFocusMode, list);
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
      return <FocusModeView notificationId={activeRoute.params.notificationId} listId={activeRoute.params.listId} />;
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

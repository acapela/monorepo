import React from "react";

import { Button } from "@aca/ui/buttons/Button";

import { allRouteNames, desktopRouter } from "../routes";
import { HomeView } from "./HomeView";
import { NotificationView } from "./NotificationView";
import { SettingsView } from "./SettingsView";

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
  }

  return <>"404"</>;
}

export function RootView() {
  return (
    <div>
      App
      <Button
        kind="primary"
        onClick={() => {
          desktopRouter.navigate("home");
        }}
      >
        Home
      </Button>
      <Button
        kind="primary"
        onClick={() => {
          desktopRouter.navigate("settings");
        }}
      >
        Settings
      </Button>
      <Button
        kind="primary"
        onClick={() => {
          desktopRouter.navigate("notification", { notificationId: "foo" });
        }}
      >
        Notification
      </Button>
      <div>
        <Routes />
      </div>
    </div>
  );
}

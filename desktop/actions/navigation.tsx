import React from "react";

// import { trackingEvent } from "@aca/desktop/analytics";
import { openLinkRequest } from "@aca/desktop/bridge/system";
import { resolvedList, savedNotificationsList } from "@aca/desktop/domains/list/all";
import { desktopRouter } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { settingsSections } from "@aca/desktop/views/SettingsView";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconCross,
  IconHome,
  IconListUnordered4,
  IconMonitor,
  IconSlidersHoriz,
} from "@aca/ui/icons";

import { createAnalyticsEvent } from "../analytics";
import { defineAction } from "./action";
import { defineGroup } from "./action/group";

export const navigationActionsGroup = defineGroup({ name: "Navigation" });

export const goToMainScreen = defineAction({
  name: "Go to main screen",
  supplementaryLabel: "Inbox",
  group: navigationActionsGroup,
  keywords: ["home", "return", "back"],
  shortcut: ["Mod", "Shift", "H"],
  icon: <IconHome />,
  handler() {
    desktopRouter.navigate("home");
  },
});

export const openAcapelaWebsite = defineAction({
  name: "Open Acapela website",
  group: navigationActionsGroup,
  keywords: ["info", "help", "feedback"],
  icon: <IconMonitor />,
  handler() {
    openLinkRequest({ url: "https://acapela.com" });
  },
});

export const openNavigationMenu = defineAction({
  name: "Toggle navigation menu",
  group: navigationActionsGroup,
  keywords: ["sidebar"],
  shortcut: ["Meta", "/"],
  icon: () => (uiStore.isSidebarOpened ? <IconChevronLeft /> : <IconChevronRight />),
  handler() {
    uiStore.isSidebarOpened = !uiStore.isSidebarOpened;
  },
});

export const closeNavigationMenu = defineAction({
  name: "Close navigation menu",
  group: navigationActionsGroup,
  keywords: ["sidebar"],
  icon: <IconCross />,
  canApply: () => uiStore.isSidebarOpened,
  handler() {
    uiStore.isSidebarOpened = false;
  },
});

export const goToSettings = defineAction({
  name: "Settings",
  group: navigationActionsGroup,
  icon: <IconSlidersHoriz />,
  analyticsEvent: "Settings Opened",
  keywords: ["options"],
  canApply: () => !desktopRouter.getIsRouteActive("settings"),
  shortcut: ["Mod", ","],
  handler() {
    desktopRouter.navigate("settings", { section: Object.keys(settingsSections)[0] });
  },
});

export const goToSettingSectionsActions = Object.entries(settingsSections)
  .filter(([, { isHidden }]) => !isHidden)
  .map(([id, { label }]) =>
    defineAction({
      name: "Settings",
      supplementaryLabel: label,
      group: navigationActionsGroup,
      icon: <IconSlidersHoriz />,
      keywords: ["options"],
      analyticsEvent: "Settings Opened",
      canApply: () => !desktopRouter.getIsRouteActive("settings", { section: id }),
      handler() {
        desktopRouter.navigate("settings", { section: id });
      },
    })
  );

export const goToResolved = defineAction({
  name: "Show resolved notifications",
  group: navigationActionsGroup,
  icon: <IconListUnordered4 />,
  analyticsEvent: createAnalyticsEvent("Resolved Notifications Opened"),
  canApply: () => !desktopRouter.getIsRouteActive("list", { listId: resolvedList.id }),
  handler() {
    desktopRouter.navigate("list", { listId: resolvedList.id });
  },
});

export const goToSaved = defineAction({
  name: "Show saved notifications",
  group: navigationActionsGroup,
  icon: <IconClock />,
  analyticsEvent: createAnalyticsEvent("Saved Notifications Opened"),
  canApply: () => !desktopRouter.getIsRouteActive("list", { listId: savedNotificationsList.id }),
  handler() {
    desktopRouter.navigate("list", { listId: savedNotificationsList.id });
  },
});

export const exitSettings = defineAction({
  name: "Exit settings",
  group: navigationActionsGroup,
  icon: <IconArrowLeft />,
  canApply: () => desktopRouter.getIsRouteActive("settings"),
  shortcut: ["Esc"],
  handler() {
    desktopRouter.navigate("home");
  },
});

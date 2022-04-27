import React from "react";

import { defineAction } from "@aca/desktop/actions/action";
import { currentNotificationActionsGroup } from "@aca/desktop/actions/groups";
import { desktopRouter, getIsRouteActive } from "@aca/desktop/routes";
import { IconArrowLeft } from "@aca/ui/icons";

export const exitComposeMode = defineAction({
  name: "Back",
  group: currentNotificationActionsGroup,
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: () => getIsRouteActive("compose"),
  handler() {
    desktopRouter.goBack();
  },
});

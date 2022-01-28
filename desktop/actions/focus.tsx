import React from "react";

import { navigateToList } from "@aca/desktop/domains/lists";
import { IconArrowBottom, IconArrowLeft, IconArrowTop } from "@aca/ui/icons";

import { getIsRouteActive } from "../routes";
import { defineAction } from "./action";

export const exitFocusMode = defineAction({
  name: "Exit focus mode",
  icon: <IconArrowLeft />,
  shortcut: "Esc",
  canApply: () => getIsRouteActive("focus"),
  handler() {
    navigateToList("inbox");
  },
});

export const goToNextNotification = defineAction({
  icon: <IconArrowBottom />,
  name: "Go to previous notification",
  shortcut: "ArrowDown",
  canApply: () => getIsRouteActive("focus"),
  handler() {
    alert("Not supported yet");
  },
});

export const goToPreviousNotification = defineAction({
  icon: <IconArrowTop />,
  name: "Go to previous notification",
  shortcut: "ArrowUp",
  canApply: () => getIsRouteActive("focus"),
  handler() {
    alert("Not supported yet");
  },
});

import React from "react";

import { clearAllData, restartApp } from "@aca/desktop/bridge/system";
import { useCurrentUser } from "@aca/desktop/client/auth/useCurrentUser";
import { Router } from "@aca/desktop/routes/Router";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { LoginView } from "./LoginView";

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

  return <Router />;
}

import React, { useEffect } from "react";

import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { useCurrentUser } from "@aca/desktop/client/auth/useCurrentUser";
import { Router } from "@aca/desktop/routes/Router";

import { allActions } from "../actions/all";
import { LoginView } from "./LoginView";

export function RootView() {
  useEffect(() => {
    attachActionsShortcutsHandler(allActions);
  }, []);

  const user = useCurrentUser();

  if (!user) {
    return <LoginView />;
  }

  return <Router />;
}

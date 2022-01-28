import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { Router } from "@aca/desktop/routes/Router";

import { allActions } from "../actions/all";
import { getNullableDb } from "../clientdb";
import { authStore } from "../store/authStore";
import { LoginView } from "./LoginView";

export const RootView = observer(function RootView() {
  const db = getNullableDb();
  useEffect(() => {
    attachActionsShortcutsHandler(allActions);
  }, []);

  const user = authStore.nullableUser;

  if (!user) {
    return <LoginView />;
  }

  if (!db) {
    return <>Clientdb loading</>;
  }

  return <Router />;
});

import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { allActions } from "@aca/desktop/actions/all";
import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { getNullableDb } from "@aca/desktop/clientdb";
import { Router } from "@aca/desktop/routes/Router";
import { authStore } from "@aca/desktop/store/authStore";

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

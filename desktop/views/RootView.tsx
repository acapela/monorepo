import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { allActions } from "@aca/desktop/actions/all";
import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { getNullableDb } from "@aca/desktop/clientdb";
import { Router } from "@aca/desktop/routes/Router";
import { authStore } from "@aca/desktop/store/authStore";

import { ErrorRecoveryButtons } from "../domains/errorRecovery/ErrorRecoveryButtons";
import { LoadingScreen } from "./LoadingView";
import { LoginView } from "./LoginView";

export const RootView = observer(function RootView() {
  const db = getNullableDb();
  useEffect(() => {
    attachActionsShortcutsHandler(allActions);
  }, []);

  const user = authStore.nullableUser;

  if (!authStore.isReady) {
    return (
      <LoadingScreen
        longLoadingFallback={{
          timeout: 5000,
          fallbackNode: <ErrorRecoveryButtons />,
          hint: "Seems it is taking too long...",
        }}
      />
    );
  }

  if (!user) {
    return <LoginView />;
  }

  if (!db) {
    return (
      <LoadingScreen
        longLoadingFallback={{
          timeout: 5000,
          fallbackNode: <ErrorRecoveryButtons />,
          hint: "Seems it is taking too long...",
        }}
      />
    );
  }

  return <Router />;
});

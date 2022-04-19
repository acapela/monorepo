import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { allActions } from "@aca/desktop/actions/all";
import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { getNullableDb } from "@aca/desktop/clientdb";
import { ErrorRecoveryButtons } from "@aca/desktop/domains/errorRecovery/ErrorRecoveryButtons";
import { UsersnapProvider } from "@aca/desktop/domains/feedbackWidget";
import { Router } from "@aca/desktop/routes/Router";
import { authStore } from "@aca/desktop/store/auth";

import { setAppVibrancyRequest } from "../bridge/system";
import { Redirect } from "../routes";
import { LoadingScreen } from "./LoadingView";

export const RootView = observer(function RootView() {
  const db = getNullableDb();

  useEffect(() => {
    attachActionsShortcutsHandler(allActions);
  }, []);

  const user = authStore.userTokenData;

  useEffect(() => {
    if (!user || !db) return;
    setAppVibrancyRequest("sidebar");
  }, [user, db]);

  if (!user) {
    return <Redirect to="login" />;
  }

  return (
    <UsersnapProvider initParams={{ user: { userId: user.id, email: user.email } }}>
      <AnimatePresence>
        {!db && (
          <LoadingScreen
            key="db-initializing"
            longLoadingFallback={{
              timeout: 5000,
              fallbackNode: <ErrorRecoveryButtons />,
              hint: "Seems it is taking too long...",
            }}
          />
        )}
        {db && <Router />}
      </AnimatePresence>
    </UsersnapProvider>
  );
});

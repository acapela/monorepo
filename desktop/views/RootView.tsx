import { AnimatePresence } from "framer-motion";
import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { allActions } from "@aca/desktop/actions/all";
import { attachActionsShortcutsHandler } from "@aca/desktop/actions/shortcutsHandler/actionsShortcutsHandler";
import { getNullableDb } from "@aca/desktop/clientdb";
import { ErrorRecoveryButtons } from "@aca/desktop/domains/errorRecovery/ErrorRecoveryButtons";
import { Router } from "@aca/desktop/routes/Router";
import { authStore } from "@aca/desktop/store/auth";

import { setAppVibrancyRequest } from "../bridge/system";
import { desktopRouter } from "../routes";
import { LoadingScreen } from "./LoadingView";

export const RootView = observer(function RootView() {
  const db = getNullableDb();
  /**
   * If user is not logged in - we want to redirect to /login before we render Router
   */
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    attachActionsShortcutsHandler(allActions);
  }, []);

  const user = authStore.userTokenData;

  useEffect(() => {
    if (!user || !db) return;
    setAppVibrancyRequest("sidebar");
  }, [user, db]);

  useLayoutEffect(() => {
    const stop = autorun(() => {
      if (!authStore.userTokenData) {
        desktopRouter.navigate("login");
      }
    });

    setIsReady(true);

    return () => {
      stop();
    };
  }, []);

  /**
   * We can render app when:
   * - there is no user (log in)
   * - there is user and db is ready
   */
  const shouldRenderApp = isReady && (!user || !!db);

  return (
    <AnimatePresence>
      {!shouldRenderApp && (
        <LoadingScreen
          key="db-initializing"
          longLoadingFallback={{
            timeout: 5000,
            fallbackNode: <ErrorRecoveryButtons />,
            hint: "Seems it is taking too long...",
          }}
        />
      )}
      {shouldRenderApp && <Router />}
    </AnimatePresence>
  );
});

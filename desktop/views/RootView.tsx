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
import { onboardingStore } from "@aca/desktop/store/onboarding";

import { setAppVibrancyRequest } from "../bridge/system";
import { LoadingScreen } from "./LoadingView";
import { LoginView } from "./LoginView";
import { InitialIntegrationsView } from "./onboarding/InitialIntegrations";

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

  function renderApp() {
    if (!user) {
      return <LoginView />;
    }

    if (!db) {
      return (
        <LoadingScreen
          key="db-initializing"
          longLoadingFallback={{
            timeout: 5000,
            fallbackNode: <ErrorRecoveryButtons />,
            hint: "Seems it is taking too long...",
          }}
        />
      );
    }

    if (onboardingStore.onboardingStatus === "ongoing") {
      return <InitialIntegrationsView />;
    }

    return (
      <UsersnapProvider initParams={{ user: { userId: user.id, email: user.email } }}>
        <Router />
      </UsersnapProvider>
    );
  }

  return <AnimatePresence>{renderApp()}</AnimatePresence>;
});

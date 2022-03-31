import "@aca/desktop/analytics";

import { ApolloProvider } from "@apollo/client";
import * as Sentry from "@sentry/electron/renderer";
import { autorun } from "mobx";
import React, { useEffect } from "react";
import { render } from "react-dom";

import { apolloClient } from "@aca/desktop/apolloClient";
import { CommandMenuManager } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { RootErrorBoundary } from "@aca/desktop/domains/errorRecovery/RootErrorBoundary";
import { SystemMenuManager } from "@aca/desktop/domains/systemMenu/SystemMenuManager";
import { initializeListNotificationsScheduling } from "@aca/desktop/domains/systemNotifications/listScheduler";
import { accountStore } from "@aca/desktop/store/account";
import { DebugView } from "@aca/desktop/views/debug/DebugView";
import { GlobalShortcutsManager } from "@aca/desktop/views/GlobalShortcutsManager";
import { PeekView } from "@aca/desktop/views/PeekView";
import { RootView } from "@aca/desktop/views/RootView";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";

import { logStorage } from "../bridge/logger";
import { registerLogEntryHandler } from "../domains/dev/makeLogger";
import { BadgeCountManager } from "../views/BadgeCountManager";
import { AppStyleProvider } from "./AppStyleProvider";
import { LoggerWindowManager } from "./LoggerWindow";
import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";

const appEnv = window.electronBridge.env;

if (!appEnv.isDev) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: appEnv.version,
    environment: process.env.STAGE,
    // we can safely ignore this error: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    ignoreErrors: ["ResizeObserver loop limit exceeded"],
    maxValueLength: 1000,
  });

  autorun(() => {
    const { user } = accountStore;
    if (user) {
      Sentry.setUser({ id: user.id, email: user.email, name: user.name });
    }
  });
}

registerLogEntryHandler((entry) => {
  logStorage.send(entry);
});

const rootElement = document.getElementById("root");

function App() {
  useEffect(() => {
    return initializeListNotificationsScheduling();
  }, []);

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <AppStyleProvider>
          <GlobalShortcutsManager />
          <PromiseUIRenderer />
          <TooltipsRenderer />

          <ServiceWorkerConsolidation />
          <RootErrorBoundary>
            <LoggerWindowManager />
            <BadgeCountManager />
            <PeekView />
            <SystemMenuManager />
            <CommandMenuManager />
            <RootView />
            <DebugView />
          </RootErrorBoundary>
        </AppStyleProvider>
      </ApolloProvider>
    </>
  );
}

// Main app
render(<App />, rootElement);

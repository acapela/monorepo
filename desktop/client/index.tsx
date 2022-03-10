import "@aca/desktop/analytics";

import { ApolloProvider } from "@apollo/client";
import * as Sentry from "@sentry/electron/renderer";
import { MotionConfig } from "framer-motion";
import React, { useEffect } from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { apolloClient } from "@aca/desktop/apolloClient";
import { CommandMenuManager } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { RootErrorBoundary } from "@aca/desktop/domains/errorRecovery/RootErrorBoundary";
import { initializeListNotificationsScheduling } from "@aca/desktop/domains/systemNotifications/listScheduler";
import { DesktopThemeProvider } from "@aca/desktop/styles/DesktopThemeProvider";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { DebugView } from "@aca/desktop/views/debug/DebugView";
import { GlobalShortcutsManager } from "@aca/desktop/views/GlobalShortcutsManager";
import { PeekView } from "@aca/desktop/views/PeekView";
import { RootView } from "@aca/desktop/views/RootView";
import { ToastsAndCommunicatesView } from "@aca/desktop/views/ToastsAndCommunicates";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { globalStyles } from "@aca/ui/styles/global";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { LoggerWindow } from "./LoggerWindow";
import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";

const appEnv = window.electronBridge.env;

if (!appEnv.isDev) {
  Sentry.init({
    dsn: appEnv.sentryDsn,
    release: appEnv.version,
    debug: true,
  });
}

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${globalStyles}
`;

function App() {
  useEffect(() => {
    return initializeListNotificationsScheduling();
  }, []);

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
          <DesktopThemeProvider>
            <BuiltInStyles />
            <GlobalDesktopStyles />
            <GlobalShortcutsManager />
            <PromiseUIRenderer />
            <TooltipsRenderer />
            <ToastsRenderer />
            <ServiceWorkerConsolidation />
            <RootErrorBoundary>
              <ToastsAndCommunicatesView />
              <PeekView />
              <CommandMenuManager />
              <RootView />
              <DebugView />
            </RootErrorBoundary>
          </DesktopThemeProvider>
        </MotionConfig>
      </ApolloProvider>
    </>
  );
}

if (appEnv.windowName === "Logger") {
  render(
    <>
      <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
        <DesktopThemeProvider>
          <BuiltInStyles />
          <GlobalDesktopStyles />
          <LoggerWindow />
        </DesktopThemeProvider>
      </MotionConfig>
    </>,
    rootElement
  );
} else {
  // Main app
  render(<App />, rootElement);
}

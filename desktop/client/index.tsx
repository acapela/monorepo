import * as Sentry from "@sentry/electron/dist/renderer";
import { MotionConfig } from "framer-motion";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { CommandMenuManager } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { DebugView } from "@aca/desktop/views/debug/DebugView";
import { RootView } from "@aca/desktop/views/RootView";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { globalStyles } from "@aca/ui/styles/global";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { DesktopThemeProvider } from "../styles/DesktopThemeProvider";
import { LoggerWindow, isLoggerWindow } from "./LoggerWindow";
import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";
import { SystemBar } from "./SystemBar";

if (!window.electronBridge.env.isDev) {
  Sentry.init({
    dsn: window.electronBridge.env.sentryDsn,
    release: window.electronBridge.env.version,
  });
}

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${globalStyles}
`;

if (isLoggerWindow()) {
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
  render(
    <>
      <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
        <DesktopThemeProvider>
          <BuiltInStyles />
          <GlobalDesktopStyles />
          <LoggerWindow />
          <PromiseUIRenderer />
          <TooltipsRenderer />
          <ToastsRenderer />
          <ServiceWorkerConsolidation />
          <SystemBar />
          <CommandMenuManager />
          <RootView />
          <DebugView />
        </DesktopThemeProvider>
      </MotionConfig>
    </>,
    rootElement
  );
}

import "@aca/desktop/analytics";

import { MotionConfig } from "framer-motion";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { CommandMenuManager } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { RootErrorBoundary } from "@aca/desktop/domains/errorRecovery/RootErrorBoundary";
import { DesktopThemeProvider } from "@aca/desktop/styles/DesktopThemeProvider";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { DebugView } from "@aca/desktop/views/debug/DebugView";
import { RootView } from "@aca/desktop/views/RootView";
import { ToastsAndCommunicatesView } from "@aca/desktop/views/ToastsAndCommunicates";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { globalStyles } from "@aca/ui/styles/global";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { LoggerWindow } from "./LoggerWindow";
import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";
import { SystemBar } from "./SystemBar";

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${globalStyles}
`;

if (window.electronBridge.env.windowName === "Logger") {
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
          <PromiseUIRenderer />
          <TooltipsRenderer />
          <ToastsRenderer />
          <ServiceWorkerConsolidation />
          <SystemBar />

          <RootErrorBoundary>
            <ToastsAndCommunicatesView />
            <CommandMenuManager />
            <RootView />
            <DebugView />
          </RootErrorBoundary>
        </DesktopThemeProvider>
      </MotionConfig>
    </>,
    rootElement
  );
}

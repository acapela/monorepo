import * as Sentry from "@sentry/electron/dist/renderer";
import { MotionConfig } from "framer-motion";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { CommandMenuManager } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { RootView } from "@aca/desktop/views/RootView";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { globalStyles } from "@aca/ui/styles/global";
import { AppThemeProvider, theme } from "@aca/ui/theme";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

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

render(
  <>
    <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
      <AppThemeProvider theme={theme}>
        <BuiltInStyles />
        <GlobalDesktopStyles />
        <PromiseUIRenderer />
        <TooltipsRenderer />
        <ToastsRenderer />
        <ServiceWorkerConsolidation />
        <SystemBar />
        <CommandMenuManager />
        <RootView />
      </AppThemeProvider>
    </MotionConfig>
  </>,
  rootElement
);

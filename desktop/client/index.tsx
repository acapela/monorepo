import * as Sentry from "@sentry/electron/dist/renderer";
import { MotionConfig } from "framer-motion";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { RootView } from "@aca/desktop/views/RootView";
import { globalDesktopStyles } from "@aca/frontend/styles/global";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "@aca/ui/theme";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

import { ServiceWorkerConsolidation } from "./ServiceWorkerConsolidation";
import { SystemBar } from "./SystemBar";

if (!window.electronBridge.isDev) {
  Sentry.init({
    dsn: window.electronBridge.sentryDsn,
    release: window.electronBridge.version,
  });
}

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${globalDesktopStyles}
`;

render(
  <>
    <BuiltInStyles />
    <GlobalDesktopStyles />
    <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
      <AppThemeProvider theme={theme}>
        <PromiseUIRenderer />
        <TooltipsRenderer />
        <ToastsRenderer />
        <ServiceWorkerConsolidation />
        <SystemBar />
        <RootView />
      </AppThemeProvider>
    </MotionConfig>
  </>,
  rootElement
);

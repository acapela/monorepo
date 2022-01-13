import { MotionConfig } from "framer-motion";
import React from "react";
import { render } from "react-dom";
import { createGlobalStyle } from "styled-components";

import { SidebarView } from "@aca/desktop/views/SidebarView";
import { global } from "@aca/frontend/styles/global";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { PromiseUIRenderer } from "@aca/ui/createPromiseUI";
import { TooltipsRenderer } from "@aca/ui/popovers/TooltipsRenderer";
import { AppThemeProvider, theme } from "@aca/ui/theme";
import { ToastsRenderer } from "@aca/ui/toasts/ToastsRenderer";

const rootElement = document.getElementById("root");

const BuiltInStyles = createGlobalStyle`
  ${global}
`;

render(
  <>
    <BuiltInStyles />
    <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
      <AppThemeProvider theme={theme}>
        <PromiseUIRenderer />
        <TooltipsRenderer />
        <ToastsRenderer />
        <SidebarView />
      </AppThemeProvider>
    </MotionConfig>
  </>,
  rootElement
);

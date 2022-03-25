import { MotionConfig } from "framer-motion";
import React, { PropsWithChildren } from "react";
import { createGlobalStyle } from "styled-components";

import { DesktopThemeProvider } from "@aca/desktop/styles/DesktopThemeProvider";
import { GlobalDesktopStyles } from "@aca/desktop/styles/GlobalDesktopStyles";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { globalStyles } from "@aca/ui/styles/global";

const BuiltInStyles = createGlobalStyle`
  ${globalStyles};
`;

export function AppStyleProvider({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <MotionConfig transition={{ ...POP_ANIMATION_CONFIG }}>
        <DesktopThemeProvider>
          <BuiltInStyles />
          <GlobalDesktopStyles />
          {children}
        </DesktopThemeProvider>
      </MotionConfig>
    </>
  );
}

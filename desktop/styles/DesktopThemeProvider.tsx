import { observer } from "mobx-react";
import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

import { uiStore } from "@aca/desktop/store/ui";
import { useDependencyChangeLayoutEffect } from "@aca/shared/hooks/useChangeEffect";
import { darkTheme, defaultTheme } from "@aca/ui/theme";

export const DesktopThemeProvider = observer(function AppThemeProvider({ children }: PropsWithChildren<{}>) {
  const selectedTheme = uiStore.isInDarkMode ? darkTheme : defaultTheme;

  useDependencyChangeLayoutEffect(() => {
    document.body.classList.add("no-transitions");

    setTimeout(() => {
      document.body.classList.remove("no-transitions");
    }, 30);
  }, [selectedTheme]);

  return <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>;
});

export function DarkModeThemeProvider({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}

import { observer } from "mobx-react";
import React from "react";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

import { uiStore } from "@aca/desktop/store/ui";
import { darkTheme, defaultTheme } from "@aca/ui/theme";

export const DesktopThemeProvider = observer(function AppThemeProvider({ children }: PropsWithChildren<{}>) {
  const selectedTheme = uiStore.isInDarkMode || uiStore.isDisplayingZenImage ? darkTheme : defaultTheme;

  return <ThemeProvider theme={selectedTheme}>{children}</ThemeProvider>;
});

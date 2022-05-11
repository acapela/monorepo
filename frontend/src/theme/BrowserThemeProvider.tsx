import React, { PropsWithChildren, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { darkTheme, defaultTheme } from "@aca/ui/theme";

import { getIsBrowserDarkModeEnabled, watchIsBrowserDarkModeEnabled } from "./browserDarkMode";

export function BrowserThemeProvider({ children }: PropsWithChildren<{}>) {
  const [isDarkMode, setIsDarkMode] = useState(getIsBrowserDarkModeEnabled);

  useEffect(() => {
    return watchIsBrowserDarkModeEnabled(setIsDarkMode);
  }, []);

  return <ThemeProvider theme={isDarkMode ? darkTheme : defaultTheme}>{children}</ThemeProvider>;
}

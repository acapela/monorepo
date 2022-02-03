import React from "react";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

import { radius } from "./borderRadius";
import { box } from "./box";
import { darkThemeColors, defaultColors } from "./colors";
import { common } from "./common";
import { gradients } from "./gradients";
import { shadow } from "./shadow";
import { spacing } from "./spacing";
import { transitions } from "./transitions";
import { typo } from "./typo";
import { buildStyledTheme } from "./utils/buildStyledTheme";
import { font } from "./utils/font";
import { zIndexValues } from "./zIndex";

export const defaultTheme = {
  font: font(),
  typo,
  spacing,
  colors: defaultColors,
  transitions,
  shadow,
  radius,
  zIndex: zIndexValues,
  box,
  gradients,
  common: common,
} as const;

export const darkTheme: typeof defaultTheme = {
  ...defaultTheme,
  colors: darkThemeColors,
};

export function AppThemeProvider<T extends object>({ theme, children }: PropsWithChildren<{ theme: T }>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export const theme = buildStyledTheme(defaultTheme);

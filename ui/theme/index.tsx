import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

import { animations } from "./animations";
import { radius } from "./borderRadius";
import { box } from "./box";
import { darkThemeColors, defaultColors } from "./colors";
import { common } from "./common";
import { gradients } from "./gradients";
import { layout } from "./layout";
import { shadow } from "./shadow";
import { spacing } from "./spacing";
import { transitions } from "./transitions";
import { typo } from "./typo";
import { buildStyledTheme } from "./utils/buildStyledTheme";
import { font } from "./utils/font";
import { gradient } from "./utils/gradient";
import { zIndexValues } from "./zIndex";

export const defaultTheme = {
  font: font(),
  typo,
  spacing,
  colors: defaultColors,
  transitions,
  animations,
  shadow,
  radius,
  zIndex: zIndexValues,
  box,
  gradients,
  common,
  layout,
} as const;

export const darkTheme: typeof defaultTheme = {
  ...defaultTheme,
  gradients: {
    actionPageBg: gradient({
      steps: [
        { color: "#111", progress: 0 },
        { color: "#222", progress: 1 },
      ],
      direction: 135,
    }),
  },
  colors: darkThemeColors,
};

export function AppThemeProvider({ children }: PropsWithChildren<{}>) {
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}

export const theme = buildStyledTheme(defaultTheme);

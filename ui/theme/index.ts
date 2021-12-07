import { radius } from "./borderRadius";
import { box } from "./box";
import { colors } from "./colors";
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
  colors,
  transitions,
  shadow,
  radius,
  zIndex: zIndexValues,
  box,
  gradients,
  common: common,
};

export const [theme, AppThemeProvider] = buildStyledTheme(defaultTheme);

import { radius } from "./borderRadius";
import { colors } from "./colors";
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
  shadow: shadow,
  radius: radius,
  zIndex: zIndexValues,
};

export const [theme, AppThemeProvider] = buildStyledTheme(defaultTheme);

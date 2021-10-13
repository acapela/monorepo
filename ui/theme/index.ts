import { radius } from "./borderRadius";
import { colors } from "./colors";
import { shadow } from "./shadow";
import { spacing } from "./spacing";
import { transitions } from "./transitions";
import { typo } from "./typo";
import { buildStyledTheme } from "./utils/buldStyledTheme";
import { font } from "./utils/font";

const themeRoot = {
  font: font(),
  typo,
  spacing,
  colors,
  transitions,
  shadow: shadow,
  radius: radius,
};

export const [theme, AppThemeProvider] = buildStyledTheme(themeRoot);

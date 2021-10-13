import { colors } from "./colors";
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
};

export const [theme, AppThemeProvider] = buildStyledTheme(themeRoot);

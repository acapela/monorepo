import { ActionStateInterpolations, variantToStyles } from "./actions/styleBuilder";
import { getColorTheme, ThemeColors, ThemeColorScheme, Variant } from "./colors";
import { Font, font } from "./font";
import { BorderRadius, Shadow, shadow } from "~ui/baseStyles";
import { borderRadius } from "~ui/baseStyles";
import { zIndex } from "~ui/zIndex";
import { hoverTransition } from "~ui/transitions";
import { spacer } from "~ui/spacer";
import { FlattenSimpleInterpolation } from "styled-components";

interface Theme {
  colors: {
    base: ThemeColors;
    actions: Record<Variant, ActionStateInterpolations>;
  };
  font: Font;
  shadow: Shadow;
  borderRadius: BorderRadius;
  zIndex: typeof zIndex;
  transitions: Record<string, () => FlattenSimpleInterpolation>;
  spacer: typeof spacer;
}

export function getTheme(colorScheme: ThemeColorScheme): Theme {
  const themeColors = getColorTheme(colorScheme);

  return {
    colors: {
      base: themeColors,
      actions: {
        primary: variantToStyles(themeColors.interactive.actions.primary),
        secondary: variantToStyles(themeColors.interactive.actions.secondary),
        tertiary: variantToStyles(themeColors.interactive.actions.tertiary),
      },
    },
    font: font(),
    shadow,
    borderRadius,
    zIndex,
    transitions: {
      hover: hoverTransition,
    },
    spacer,
  };
}

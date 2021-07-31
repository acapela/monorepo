import { StylesPart } from "styled-components";
import { borderRadius, shadow } from "~ui/baseStyles";
import { spacer } from "~ui/spacer";
import { hoverTransition } from "~ui/transitions";
import { zIndex } from "~ui/zIndex";
import { ActionStateInterpolations, variantToStyles } from "./actions/styleBuilder";
import { getColorTheme, ThemeColorScheme, ThemeColorSchemeName } from "./colors";
import { Font, font } from "./font";
import { buildThemeProxy } from "./proxy";

export type Variant = "primary" | "secondary" | "tertiary";

// Using explicit interface instead of a `defaultTheme as const` in order to prevent circular reference
// errors when extending the styled.DefaultTheme
export interface Theme {
  colors: ExtendedThemeColors;
  shadow: typeof shadow;
  font: Font;
  borderRadius: typeof borderRadius;
  zIndex: typeof zIndex;
  transitions: Record<string, () => StylesPart>;
  spacer: typeof spacer;
}

type ExtendedThemeColors = ThemeColorScheme & { actions: Record<Variant, ActionStateInterpolations> };

// Allows `${props => props.theme...}` to be typed properly
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface StyledTheme extends Theme {}
}

export const defaultTheme: Theme = getTheme("default");

export function getTheme(colorScheme: ThemeColorSchemeName): Theme {
  const themeColors = getColorTheme(colorScheme);
  const themeColorsForActions = themeColors.interactive.actions;

  return {
    colors: {
      ...themeColors,
      actions: {
        primary: variantToStyles(themeColorsForActions.primary),
        secondary: variantToStyles(themeColorsForActions.secondary),
        tertiary: variantToStyles(themeColorsForActions.tertiary),
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
  } as const;
}

// 👀 buildThemeProxy for docs on how to use
export const theme = buildThemeProxy(defaultTheme);

import { get, isFunction, isPlainObject } from "lodash";
import DeepProxy from "proxy-deep";
import { borderRadius, shadow } from "~ui/baseStyles";
import { spacer } from "~ui/spacer";
import { hoverTransition } from "~ui/transitions";
import { zIndex } from "~ui/zIndex";
import { variantToStyles } from "./actions/styleBuilder";
import { getColorTheme, ThemeColorSchemeName } from "./colors";
import { font } from "./font";

export type Variant = "primary" | "secondary" | "tertiary";

export function getTheme(colorScheme: ThemeColorSchemeName) {
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

export const defaultTheme = getTheme("default");

type Theme = typeof defaultTheme;

/*
 * Creates a proxy that allows us to use the theme provided to the styled-components context. It looks for
 * all of the leafs in a provided object of type Theme and proxies to a function that returns the value
 * as found in the styled-components context.
 *
 * Before:
 * const UIComponent = styled.div`
 *   background: ${props => props.theme.colors.status.error};
 * `;
 *
 * After:
 * const UIComponent = styled.div`
 *   // `themeStyles.colors.status.error` returns `props => props.theme.colors.status.error`
 *   background: ${themeStyles.colors.status.error};
 * `;
 *
 */
export const themeStyles = new DeepProxy(getTheme("default"), {
  get(target, propertyName, receiver) {
    const value = Reflect.get(target, propertyName, receiver);
    if (isPlainObject(value)) {
      // Creates a nested DeepProxy
      return this.nest(value);
    } else if (isFunction(value)) {
      return (...args: unknown[]) =>
        (props: { theme: Theme }) => {
          const theme = props.theme;

          const fn = get(theme, [...this.path, propertyName]);

          return fn.call(null, ...args);
        };
    } else {
      return (props: { theme: Theme }) => {
        const theme = props.theme;
        return get(theme, [...this.path, propertyName]);
      };
    }
  },
});

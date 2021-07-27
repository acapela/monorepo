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

export const defaultTheme = getTheme("default");

type Theme = typeof defaultTheme;

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

/*
 * Creates an access layer that allows us to easily use the theme provided to the styled-components context.
 * It looks for all of the leafs in a provided object of type Theme and proxies them to a function that returns the value
 * as found in the styled-components context.
 *
 * Before:
 * const UIComponent = styled.div`
 *   background: ${props => props.theme.colors.status.error};
 * `;
 *
 * After:
 * const UIComponent = styled.div`
 *   // `theme.colors.status.error` returns `props => props.theme.colors.status.error`
 *   background: ${theme.colors.status.error};
 * `;
 *
 */
export const theme = new DeepProxy(defaultTheme, {
  get(target, propertyName, receiver) {
    const value = Reflect.get(target, propertyName, receiver);

    if (isPlainObject(value)) {
      // Creates a nested DeepProxy
      // Calling nest with the value allows DeepProxy to build the `path` (👀 this.path) to nested props
      return this.nest(value);
    }

    if (isFunction(value)) {
      /* 
      First function returned is the outer layer of the utility function that's being called. 
      We use this to grab the arguments from that util and pass them as a closure to the equivalent theme function.

      This way:
      `style.utilityFunction(1,2,3)` becomes `props => props.theme.utilityFunction(1,2,3)`
      */
      return (...args: unknown[]) =>
        (props: { theme: Theme }) => {
          const fn = get(props.theme, [...this.path, propertyName]);
          return fn.call(null, ...args);
        };
    }

    return (props: { theme: Theme }) => {
      return get(props.theme, [...this.path, propertyName]);
    };
  },
});

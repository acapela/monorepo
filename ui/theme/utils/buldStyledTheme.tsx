import { get, isFunction, isPlainObject } from "lodash";
import DeepProxy from "proxy-deep";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";

/*
 * Creates an access layer that allows us to easily use the theme provided to the styled-components context.
 * It looks for all of the leafs in a provided object of type Theme and proxies them to a function that returns the value
 * as found in the styled-components context.
 *
 * Before:
 * const UIComponent = styled.div<{}>`
 *   background: ${props => props.theme.colors.status.error()};
 * `;
 *
 * After:
 * const UIComponent = styled.div<{}>`
 *   // `theme.colors.status.error()` returns `props => props.theme.colors.status.error()`
 *   background: ${theme.colors.status.error()};
 * `;
 *
 */
export function buildStyledProxy<T extends object>(theme: T) {
  const themeProxy = new DeepProxy(theme, {
    get(target, propertyName, receiver) {
      const value = Reflect.get(target, propertyName, receiver);

      if (isPlainObject(value)) {
        // Creates a nested DeepProxy
        // Calling nest with the value allows DeepProxy to build the `path` (👀 this.path) to nested props
        return this.nest(value);
      }

      if (isFunction(value)) {
        /* 
          There's functions inside the theme tree that are used inside chainable/builder patterns.
          These functions should return a chainable/builder object instead of being proxied.
    
          Since these are exceptional, they should be marked as non terminal.
          Now: `style.font.withExceptionalSize("123px").spezia.build` still works
          */
        // if (!getIsTerminal(value)) {
        //   return (...args: unknown[]) => {
        //     return value.call(target, ...args);
        //   };
        // }

        /* 
          First function returned is the outer layer of the utility function that's being called. 
          We use this to grab the arguments from that util and pass them as a closure to the equivalent theme function.
    
          This way:
          `style.utilityFunction(1,2,3)` becomes `props => props.theme.utilityFunction(1,2,3)`
          */
        return (...args: unknown[]) =>
          (props: { theme: Theme }) => {
            const fullPath = [...this.path, propertyName];
            const fn = get(props.theme, fullPath);
            try {
              return fn.call(target, ...args);
            } catch (e) {
              const pathJoinedByDots = fullPath.join(".");
              throw new Error(
                `[Theme] Failed to run utility function "theme.${pathJoinedByDots}". Possible solution: Add a function call, e.g. \`\${theme.${pathJoinedByDots}()}\``
              );
            }
          };
      }

      return (props: { theme: Theme }) => {
        return get(props.theme, [...this.path, propertyName]);
      };
    },
  });

  function StyledThemeProvider({ theme, children }: PropsWithChildren<{ theme: T }>) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return [themeProxy, StyledThemeProvider] as const;
}

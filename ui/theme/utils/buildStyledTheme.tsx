import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";
import { isPrimitive } from "utility-types";

import { AccessAction, replayAccess } from "./accessRecorder";
import { DeepProxyThisArgument, createDeepProxy } from "./DeepProxy";

interface AccessContext {
  accessPath: AccessAction[];
}

/**
 * There are bunch of properties that might be accessed from theme (eg. by styled-components or react).
 *
 * We don't need to provide proxy for them
 */

// All common symbols like Symbol.isPrimitive etc.
const wellKnownSymbols = Object.getOwnPropertyNames(Symbol)
  .filter((propertyName) => {
    return typeof Reflect.get(Symbol, propertyName) === "symbol";
  })
  .map((symbolName) => {
    return Reflect.get(Symbol, symbolName) as symbol;
  });

// Special properties we know for sure are not part of the theme.
const ignoredSpecialProperties: string[] = ["$$prototypeOf", "$$typeof", "styledComponentId", "prototype"];

const allPropertiesToIgnoreForProxy = [...wellKnownSymbols, ...ignoredSpecialProperties];

/*
 * Creates an access layer that allows us to easily use the theme provided to the styled-components context.
 * It looks for all of the leafs in a provided object of type Theme and proxies them to a function that returns the value
 * as found in the styled-components context.
 *
 * Before:
 * const UIComponent = styled.div<{}>`
 *   background: ${props => props.theme.colors.primary.opacity(0.5).asColor};
 * `;
 *
 * After:
 * const UIComponent = styled.div<{}>`
 *   // `theme.colors.primary.opacity(0.5).asColor` returns `props => props.theme.colors.primary.opacity(0.5).asColor`
 *   ${theme.colors.primary.opacity(0.5).asColor}
 * `;
 *
 */
export function buildStyledTheme<T extends object>(theme: T) {
  /**
   * Under the hood, proxy works by simply recording your access in theme proxy and then replaying this access when
   * rendering actual components
   */

  // Having access recording - it creates ${props => props.somehow.get.it} like callback that 'replays' this recording.
  function createFromThemePropsGetter(accessRecord: AccessAction[]) {
    return function getFromProvidedTheme(props: { theme: T }) {
      if (!props?.theme) {
        return null;
      }
      try {
        const valueFromTheme = replayAccess(theme, accessRecord);

        return valueFromTheme;
      } catch (error) {
        console.error(`Failed to get value from theme`, { accessRecord });
      }
    };
  }

  /**
   * When accessing theme proxy, we decide if this is 'end' of the access, or if we should continue nesting.
   *
   * By end we consider 'styled' value. 'styled' value is either primitive value or css`` result (which is array of styles)
   */
  function convertProxyValueToThemeGetterOrNestedProxy(
    trap: DeepProxyThisArgument<T, AccessContext>,
    value: unknown,
    valuePositionInParent: AccessAction
  ) {
    const parentAccessPath = trap.parentContext.accessPath ?? [];
    const newAccessPath = [...parentAccessPath, valuePositionInParent];

    // This is end leaf - it returns styles - convert to theme getter from props.
    if (isResultsStyles(value)) {
      return createFromThemePropsGetter(newAccessPath);
    }

    // Continue nesting, also provide how did we access this value till this point.
    const nextTrap = trap.nest(value, { accessPath: newAccessPath });

    return nextTrap;
  }

  const themeProxy = createDeepProxy<T, AccessContext>(
    theme,
    {
      /**
       * We currently support theme proxy with getters and function apply.
       *
       * eg. theme.foo.bar or theme.foo(5).bar.baz(10) etc
       */
      apply(target, thisArg, args) {
        const result = Reflect.apply(target as Function, thisArg, args);

        // No part of the theme should return undefined at any point.
        if (result === undefined) {
          return result;
        }

        return convertProxyValueToThemeGetterOrNestedProxy(this, result, { type: "apply", args });
      },
      get(target, propertyName, receiver) {
        if (!Reflect.getOwnPropertyDescriptor(target, propertyName)) {
          return undefined;
        }

        const result = Reflect.get(target, propertyName, receiver);

        // No part of the theme should return undefined at any point.
        if (result === undefined) {
          return result;
        }

        if (allPropertiesToIgnoreForProxy.includes(propertyName as string)) {
          return result;
        }

        return convertProxyValueToThemeGetterOrNestedProxy(this, result, { type: "get", property: propertyName });
      },
    },
    // It is root of the theme, so start with empty 'access record'
    { accessPath: [] }
  );

  function StyledThemeProvider({ theme, children }: PropsWithChildren<{ theme: T }>) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
  }

  return [themeProxy, StyledThemeProvider] as const;
}

/**
 * Returns if given value is 'end' value for styled component.
 *
 * It can be primitive like
 *
 * css`
 *   color: ${theme.red} <-- assuming theme.red is string
 * `
 *
 * or css`` result (array)
 *
 * css`
 *   ${theme.font.big} <-- assuming theme.font.big is returning css`font-family: foo` etc.
 * `
 */
function isResultsStyles(maybeStyles: unknown) {
  if (isPrimitive(maybeStyles)) return true;

  if (Array.isArray(maybeStyles)) return true;

  return false;
}

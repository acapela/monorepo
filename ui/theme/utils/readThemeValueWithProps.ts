import { ThemeProps } from "styled-components";

/**
 * In rare cases, we need to get raw value from theme proxy using props.
 */
export function readThemeValueWithProps<T>(themeProxyValue: T, props: ThemeProps): T {
  if (typeof themeProxyValue !== "function") {
    throw new Error(`Cannot use readThemeValueWithProps on value that is not end leaf of the theme`);
  }

  const value = themeProxyValue(props) as T;

  return value;
}

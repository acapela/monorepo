import { StylesPart } from "styled-components";
import { isPrimitive } from "utility-types";

import { FunctionWithProps, createFunctionWithProps } from "@aca/shared/functions";

export type ThemeTarget<P> = FunctionWithProps<() => StylesPart, P>;

const themeTargets = new WeakSet<ThemeTarget<unknown>>();

export function getIsThemeTarget(itemToCheck: unknown): itemToCheck is ThemeTarget<unknown> {
  if (isPrimitive(itemToCheck)) return false;

  return themeTargets.has(itemToCheck as ThemeTarget<unknown>);
}

export function createThemeTarget<P>(stylesGetter: () => StylesPart, props: P): ThemeTarget<P> {
  const themeTarget = createFunctionWithProps<() => StylesPart, P>(stylesGetter, props);

  themeTargets.add(themeTarget);

  return themeTarget;
}

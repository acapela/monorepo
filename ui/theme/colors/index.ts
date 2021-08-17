import { ColorGetter } from "./createColor";
import { defaultTheme } from "./default";
import { Variant } from "..";

export interface VariantStates {
  regular: ColorTargetOptions;
  hover?: Partial<ColorTargetOptions>;
  disabled?: Partial<ColorTargetOptions>;
  active?: Partial<ColorTargetOptions>;
}

export interface ColorTargetOptions {
  background: ColorGetter;
  text: ColorGetter;
  icon: ColorGetter;
  border?: ColorGetter;
}

export interface ThemeColorScheme {
  layout: {
    background: ColorGetter;
    foreground: ColorGetter;
    softLine: ColorGetter;
    strongLine: ColorGetter;
    bodyText: ColorGetter;
    supportingText: ColorGetter;
    headingText: ColorGetter;
    link: ColorGetter;
  };
  interactive: {
    notification: ColorGetter;
    active: ColorGetter;
    inactive: ColorGetter;
    selected: ColorGetter;
    actions: Record<Variant, VariantStates>;
  };
  status: {
    error: ColorGetter;
    warning: ColorGetter;
    success: ColorGetter;
  };
}

export type ThemeColorSchemeName = "default";

export function getColorTheme(scheme: ThemeColorSchemeName): ThemeColorScheme {
  switch (scheme) {
    default:
      return defaultTheme;
  }
}

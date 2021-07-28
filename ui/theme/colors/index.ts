import { Variant } from "..";
import { defaultTheme } from "./default";

export interface VariantStates {
  regular: ColorTargetOptions;
  hover?: Partial<ColorTargetOptions>;
  disabled?: Partial<ColorTargetOptions>;
  active?: Partial<ColorTargetOptions>;
}

export interface ColorTargetOptions {
  background: string;
  text: string;
  icon: string;
  border?: string;
}

export interface ThemeColorScheme {
  layout: {
    background: string;
    foreground: string;
    softLine: string;
    strongLine: string;
    bodyText: string;
    supportingText: string;
    headingText: string;
    link: string;
  };
  interactive: {
    notification: string;
    active: string;
    inactive: string;
    selected: string;
    actions: Record<Variant, VariantStates>;
  };
  status: {
    error: string;
    warning: string;
    success: string;
  };
}

export type ThemeColorSchemeName = "default";

export const getColorTheme = (scheme: ThemeColorSchemeName) => {
  switch (scheme) {
    default:
      return defaultTheme;
  }
};

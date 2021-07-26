import { defaultTheme } from "./default";

export type Variant = "primary" | "secondary" | "tertiary";

export interface VariantStates {
  regular: InteractiveProps;
  hover?: Partial<InteractiveProps>;
  disabled?: Partial<InteractiveProps>;
  active?: Partial<InteractiveProps>;
}

export interface InteractiveProps {
  background: string;
  text: string;
  icon: string;
  border?: string;
}

export interface ThemeColors {
  layout: {
    background: string;
    foreground: string;
    softLine: string;
    strongLine: string;
    bodyText: string;
    headingText: string;
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

export type ThemeColorScheme = "default";

export const getColorTheme = (scheme: ThemeColorScheme) => {
  switch (scheme) {
    default:
      return defaultTheme;
  }
};

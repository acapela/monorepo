export type Variant = "primary" | "secondary" | "tertiary";

export interface VariantStates<ColorGetter> {
  default: InteractiveProps<ColorGetter>;
  hover: Partial<InteractiveProps<ColorGetter>>;
  disabled: Partial<InteractiveProps<ColorGetter>>;
}

export interface InteractiveProps<ColorGetter> {
  background: ColorGetter;
  text: ColorGetter;
  icon: ColorGetter;
}

export interface Theme<ColorGetter> {
  layout: {
    background: ColorGetter;
    foreground: ColorGetter;
    softLine: ColorGetter;
    strongLine: ColorGetter;
    bodyText: ColorGetter;
    headingText: ColorGetter;
  };
  interactive: {
    notification: ColorGetter;
    active: ColorGetter;
    inactive: ColorGetter;
    selected: ColorGetter;
    actions: Record<Variant, VariantStates<ColorGetter>>;
  };
  status: {
    error: ColorGetter;
    warning: ColorGetter;
    success: ColorGetter;
  };
}

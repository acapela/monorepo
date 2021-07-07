interface ThemeActionProps {
  background: string;
  hover: string;
  text: string;
  icon: string;
  disabled: string;
}

export type InteractiveAction = "primary" | "secondary" | "tertiary";

export interface Theme {
  colors: {
    layout: {
      background: string;
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
      actions: Record<InteractiveAction, ThemeActionProps>;
    };
    status: {
      error: string;
      warning: string;
      success: string;
      disabled: string;
    };
  };
}

import { color } from "./utils/color";

const white = color("hsl(0, 0%, 100%)", {
  hover: color("hsl(220, 33%, 98%)"),
  active: color("hsl(220, 33%, 95%)"),
});

const black = color("hsl(0, 0%, 0%)", {
  hover: color("hsl(0, 0%, 5%)"),
  active: color("hsl(0, 0%, 10%)"),
});

const primary = color("hsl(310, 100%, 67%)", {
  hover: color("hsl(310, 79%, 57%)"),
  active: color("hsl(310, 79%, 40%)"),
  readableText: white,
});

const lightGray = color("#F9FAFC", {
  hover: color("hsla(0, 0%, 0%, 0.05)"),
  active: color("hsla(0, 0%, 0%, 0.075)"),
});

export const colors = {
  primary,
  text: black,
  action: {
    // Used for buttons
    primary,
    link: primary,
    // Used for secondary buttons
    secondary: white,
    // Used eg. for icon buttons in composer
    icon: color("hsla(0, 0%, 0%, 0.4)", {
      hover: color("hsla(0, 0%, 0%, 0.5)"),
      active: color("hsla(0, 0%, 0%, 0.6)"),
    }),
  },
  layout: {
    // Root background of the app
    background: white,
    // Used eg. for app sidebar
    backgroundAccent: lightGray,
  },
  panels: {
    popover: black,
    tooltip: black,
    notification: primary,
    modal: white,
  },
  status: {
    // TODO: Adjust
    danger: primary,
    warning: primary,
    success: primary,
  },
  tags: {
    primary,
    secondary: primary,
    tertiary: primary,
  },
};

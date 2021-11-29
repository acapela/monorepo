import { color } from "./utils/color";

const white = color("hsl(0, 0%, 100%)", {
  hover: color("hsl(220, 33%, 97%)"),
  active: color("hsl(220, 33%, 94%)"),
});

const black = color("hsl(0, 0%, 0%)", {
  hover: color("hsl(0, 0%, 25%)"),
  active: color("hsl(0, 0%, 30%)"),
});

const primary = color("hsl(310, 100%, 67%)", {
  hover: color("hsl(310, 79%, 57%)"),
  active: color("hsl(310, 79%, 40%)"),
  readableText: white,
});

const secondary = color("hsl(34, 100%, 68%)", {
  hover: color("hsl(34, 100%, 63%)"),
  active: color("hsl(34, 100%, 46 %)"),
  readableText: black,
});

const lightGray = color("hsl(220, 33%, 98%)", {
  hover: color("hsla(0, 0%, 0%, 0.03)"),
  active: color("hsla(0, 0%, 0%, 0.075)"),
});

const blue = color("hsl(204, 100%, 50%)");

const divider = color("#E0E0E0");

export const colors = {
  primary,
  secondary,
  text: black,
  action: {
    // Used for buttons
    primary,
    transparent: color("hsla(0, 0%, 100%, 0.0)", {
      hover: color("hsla(0, 0%, 0%, 0.05)"),
      active: color("hsla(0, 0%, 0%, 0.075)"),
    }),
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
    divider,
  },
  panels: {
    popover: black,
    secondaryPopover: white,
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
    action: primary,
    feedback: secondary,
    read: blue,
    observe: black.opacity(0.5),
  },
  functional: {
    userAvatar: blue,
  },
};

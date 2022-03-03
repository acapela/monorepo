import { deepMerge } from "@aca/shared/object";

import { color } from "./utils/color";

const white = color("hsl(0, 0%, 100%)", {
  hover: color("hsl(220, 33%, 97%)"),
  active: color("hsl(220, 33%, 94%)"),
});

const black = color("hsl(0, 0%, 0%)", {
  hover: color("hsl(0, 0%, 25%)"),
  active: color("hsl(0, 0%, 30%)"),
});

const darkGrey = color("hsl(213, 15%, 13%)");

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
  hover: color("hsla(0, 0%, 0%, 0.05)"),
  active: color("hsla(0, 0%, 0%, 0.075)"),
});

const blue = color("hsl(204, 100%, 50%)");

const green = color("hsl(169,100%,37%)");

const divider = color("#8882");

const selectedTab = color("#f3f4f6");

const inverted = color("#111827");

export const defaultColors = {
  primary,
  secondary,
  text: darkGrey,
  inverted,
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
    actionPanel: inverted,
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
    selectedTab,
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
    decision: green,
    observe: black.opacity(0.5),
  },
  functional: {
    userAvatar: blue,
  },
} as const;

const darkBgBase = color("hsl(0, 0%, 11%)");

export const darkThemeColors = deepMerge(defaultColors, {
  text: white,
  layout: {
    actionPanel: darkBgBase.hover,
    // Root background of the app
    background: darkBgBase,
    // Used eg. for app sidebar
    backgroundAccent: darkBgBase.hover,
    divider,
  },
  panels: {
    popover: darkBgBase.hover,
    secondaryPopover: darkBgBase,
    notification: primary,
    modal: darkBgBase,
    selectedTab: darkBgBase.hover,
  },
  action: {
    transparent: darkBgBase,
    secondary: darkBgBase.hover,
  },
});

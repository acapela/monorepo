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

const primary = color("hsl(330, 100%, 55%)", {
  hover: color("hsl(330, 100%, 45%)"),
  active: color("hsl(330, 100%, 40%)"),
  readableText: white,
});

const secondary = color("hsl(200, 100%, 60%)", {
  hover: color("hsl(200, 100%, 50%)"),
  active: color("hsl(200, 100%, 45%)"),
  readableText: black,
});

const danger = color("hsl(350, 80%, 55%)", {
  hover: color("hsl(350, 80%, 45%)"),
  active: color("hsl(350, 80%, 40%)"),
  readableText: white,
});

const lightGray = color("hsl(220, 33%, 98%)", {
  hover: color("hsla(0, 0%, 0%, 0.05)"),
  active: color("hsla(0, 0%, 0%, 0.075)"),
});

const transparent = color("hsla(0, 0%, 0%, .0)", {
  hover: color("hsla(0, 0%, 0%, 0.05)"),
  active: color("hsla(0, 0%, 0%, 0.075)"),
});

const darkModeTransparent = color("hsla(0, 0%, 100%, 0.0)", {
  hover: color("hsla(0, 0%, 100%, 0.05)"),
  active: color("hsla(0, 0%, 100%, 0.075)"),
});

const icon = color("hsla(0, 0%, 0%, 0.4)", {
  hover: color("hsla(0, 0%, 0%, 0.5)"),
  active: color("hsla(0, 0%, 0%, 0.6)"),
});

const blue = color("hsl(204, 100%, 50%)");

const success = color("hsl(163, 73%, 47%)");

const warning = color("hsl(25, 100%, 45%)", {
  readableText: white,
});

const divider = color("hsla(0, 0%, 53%, 0.13)");

const selectedTab = color("hsl(220, 14%, 96%)");

const inverted = color("hsl(221, 39%, 11%)");

const darkBgBase = color("hsl(0, 0%, 11%)");

export const defaultColors = {
  primary,
  success,
  secondary,
  text: darkGrey,
  inverted,
  action: {
    // Used for buttons
    primary,
    transparent,
    link: primary,
    // Used for secondary buttons
    secondary: white,
    // Used eg. for icon buttons in composer
    icon,
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
    danger,
    warning,
    success,
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
} as const;

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
    transparent: darkModeTransparent,
    secondary: darkBgBase.hover,
  },
});

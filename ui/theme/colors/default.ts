import { setColorOpacity } from "~shared/colors";

import * as colors from "./base";
import { createColor } from "./createColor";
import { ThemeColorScheme } from ".";

export const defaultTheme: ThemeColorScheme = {
  layout: {
    background: createColor("hsl(220, 33%, 98%)"),
    foreground: createColor(colors.WHITE),
    softLine: createColor(colors.BASE_GREY_5),
    strongLine: createColor(colors.BASE_GREY_4),
    bodyText: createColor(colors.BASE_GREY_1),
    supportingText: createColor(colors.BASE_GREY_3),
    headingText: createColor(colors.BASE_GREY_1),
    link: createColor(colors.PRIMARY_PINK_3),
  },
  interactive: {
    notification: createColor(colors.PRIMARY_PINK_1),
    active: createColor(colors.PRIMARY_PINK_1),
    inactive: createColor(colors.BASE_GREY_4),
    selected: createColor(colors.BASE_GREY_7),
    actions: {
      primary: {
        regular: {
          background: createColor(colors.PRIMARY_PURPLE_1),
          text: createColor(colors.WHITE),
          icon: createColor(colors.BASE_GREY_4),
        },
        hover: {
          background: createColor(colors.PRIMARY_PURPLE_2),
        },
        disabled: {
          background: createColor(setColorOpacity(colors.PRIMARY_PURPLE_1, 0.25)),
        },
      },
      secondary: {
        regular: {
          background: createColor(colors.WHITE),
          text: createColor(colors.BASE_GREY_1),
          icon: createColor(colors.PRIMARY_PINK_1),
          border: createColor(colors.BASE_GREY_4),
        },
        hover: {
          background: createColor(colors.BASE_GREY_6),
        },
        disabled: {
          icon: createColor(colors.BASE_GREY_4),
          text: createColor(colors.BASE_GREY_4),
          background: createColor(setColorOpacity(colors.BASE_GREY_7, 0.5)),
          border: createColor(colors.BASE_GREY_5),
        },
        active: {
          border: createColor(colors.PRIMARY_PINK_1),
        },
      },
      tertiary: {
        regular: {
          background: createColor(colors.BASE_GREY_6),
          text: createColor(colors.BASE_GREY_1),
          icon: createColor(colors.BASE_GREY_1),
        },
        hover: {
          background: createColor(colors.BASE_GREY_4),
        },
        disabled: {
          icon: createColor(colors.BASE_GREY_4),
          text: createColor(colors.BASE_GREY_4),
          background: createColor(setColorOpacity(colors.BASE_GREY_7, 0.5)),
        },
        active: {
          border: createColor(colors.PRIMARY_PINK_1),
        },
      },
    },
  },
  status: {
    error: createColor(colors.SUPPORT_RED),
    warning: createColor(colors.SECONDARY_ORANGE_2),
    success: createColor(colors.SUPPORT_GREEN),
  },
  tags: {
    shareInformation: {
      foreground: createColor(colors.SHARE_INFO),
      background: createColor(setColorOpacity(colors.SHARE_INFO, 0.1)),
    },
    discussion: {
      foreground: createColor(colors.DISCUSSION),
      background: createColor(setColorOpacity(colors.DISCUSSION, 0.1)),
    },
    empty: {
      foreground: createColor(colors.BASE_GREY_4),
      background: createColor(setColorOpacity(colors.BASE_GREY_4, 0.1)),
    },
    decision: {
      foreground: createColor(colors.SUPPORT_GREEN),
      background: createColor(setColorOpacity(colors.SUPPORT_GREEN, 0.1)),
    },
    action: {
      foreground: createColor(colors.ACTION),
      background: createColor(setColorOpacity(colors.ACTION, 0.1)),
    },
    default: {
      foreground: createColor(colors.BASE_GREY_3),
      background: createColor(setColorOpacity(colors.BASE_GREY_3, 0.1)),
    },
    private: {
      foreground: createColor(colors.PRIMARY_PINK_3),
      background: createColor(setColorOpacity(colors.PRIMARY_PINK_3, 0.1)),
    },
  },
};

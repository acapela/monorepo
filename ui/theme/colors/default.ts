import { ThemeColors } from ".";
import { setColorOpacity } from "~shared/colors";
import * as colors from "./base";

export const defaultTheme: ThemeColors<string> = {
  layout: {
    background: colors.BASE_GREY_7,
    foreground: colors.WHITE,
    softLine: colors.BASE_GREY_5,
    strongLine: colors.BASE_GREY_4,
    bodyText: colors.BASE_GREY_1,
    headingText: colors.BASE_GREY_1,
  },
  interactive: {
    notification: colors.PRIMARY_PINK_1,
    active: colors.PRIMARY_PINK_1,
    inactive: colors.BASE_GREY_7,
    selected: colors.BASE_GREY_7,
    actions: {
      primary: {
        default: {
          background: colors.PRIMARY_PURPLE_1,
          text: colors.WHITE,
          icon: colors.BASE_GREY_4,
        },
        hover: {
          background: colors.PRIMARY_PURPLE_2,
        },
        disabled: {
          background: setColorOpacity(colors.PRIMARY_PURPLE_1, 0.25),
        },
      },
      secondary: {
        default: {
          background: colors.WHITE,
          text: colors.BASE_GREY_1,
          icon: colors.PRIMARY_PINK_1,
          border: colors.BASE_GREY_4,
        },
        hover: {
          background: colors.BASE_GREY_6,
        },
        disabled: {
          icon: colors.BASE_GREY_4,
          text: colors.BASE_GREY_4,
          background: setColorOpacity(colors.BASE_GREY_7, 0.5),
          border: colors.BASE_GREY_5,
        },
        active: {
          border: colors.PRIMARY_PINK_1,
        },
      },
      tertiary: {
        default: {
          background: colors.BASE_GREY_6,
          text: colors.BASE_GREY_1,
          icon: colors.BASE_GREY_1,
        },
        hover: {
          background: colors.BASE_GREY_4,
        },
        disabled: {
          icon: colors.BASE_GREY_4,
          text: colors.BASE_GREY_4,
          background: setColorOpacity(colors.BASE_GREY_7, 0.5),
        },
        active: {
          border: colors.PRIMARY_PINK_1,
        },
      },
    },
  },
  status: {
    error: colors.SUPPORT_RED,
    warning: colors.SECONDARY_ORANGE_2,
    success: colors.SUPPORT_GREEN,
  },
};

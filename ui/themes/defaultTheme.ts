import { brandColors } from "../brandColors";
import { setColorOpacity } from "~shared/colors";

export const defaultTheme = {
  colors: {
    layout: {
      background: brandColors.base.grey[7],
      softLine: brandColors.base.grey[5],
      strongLine: brandColors.base.grey[4],
      bodyText: brandColors.base.grey[1],
      headingText: brandColors.base.grey[1],
    },
    interactive: {
      notification: brandColors.primary.pink[1],
      active: brandColors.primary.pink[1],
      inactive: brandColors.base.grey[7],
      selected: brandColors.base.grey[7],
      actions: {
        primary: {
          background: brandColors.primary.purple[1],
          hover: brandColors.primary.purple[2],
          text: brandColors.base.white,
          icon: brandColors.base.grey[4],
          disabled: setColorOpacity(brandColors.primary.purple[1], 0.25),
        },
        secondary: {
          background: brandColors.base.white,
          hover: brandColors.base.grey[6],
          text: brandColors.base.grey[1],
          icon: brandColors.primary.pink[1],
          disabled: setColorOpacity(brandColors.base.grey[7], 0.5),
        },
        tertiary: {
          background: brandColors.base.grey[6],
          hover: brandColors.base.grey[4],
          text: brandColors.base.grey[1],
          icon: brandColors.primary.pink[1],
          disabled: setColorOpacity(brandColors.base.grey[6], 0.25),
        },
      },
    },
    status: {
      error: brandColors.support.red,
      warning: brandColors.secondary.orange[2],
      success: brandColors.support.green,
      disabled: brandColors.base.grey[5],
    },
  },
};

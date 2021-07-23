import { css } from "styled-components";
import { BASE_GREY_6, PRIMARY_COLOR } from "~ui/colors";
import { color } from "./color";
import { font } from "./font";

const PRIMARY = "#301E31";

const primaryColor = color(PRIMARY);

export const theme = {
  colors: {
    transparent: color("#fff0"),
    actions: {
      primary: color(PRIMARY_COLOR),
      secondary: color(BASE_GREY_6),
    },
  },
  font: font(),
  transitions: {
    quickHover: css``,
  },
  interactivity: {
    disabled: css``,
  },
  shadow: {
    button: css``,
  },
  radius: {
    circle: css``,
  },
} as const;

export type Theme = typeof theme;

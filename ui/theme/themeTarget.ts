import { StylesPart } from "styled-components";

export type ThemeTarget = {
  getStyles(): StylesPart;
};

export function createThemeTarget(styles: StylesPart): ThemeTarget {
  return {
    getStyles() {
      return styles;
    },
  };
}

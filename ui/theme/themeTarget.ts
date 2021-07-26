import { FlattenSimpleInterpolation } from "styled-components";

export type ThemeTarget = {
  getStyles(): FlattenSimpleInterpolation;
  [key: string]: any;
};

export function createThemeTarget(styles: FlattenSimpleInterpolation): ThemeTarget {
  return {
    ...styles,
    getStyles() {
      return styles;
    },
  };
}

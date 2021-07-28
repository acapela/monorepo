import { FlattenSimpleInterpolation } from "styled-components";

export type ThemeTarget = {
  getStyles(): FlattenSimpleInterpolation;
};

export function createThemeTarget(styles: FlattenSimpleInterpolation): ThemeTarget {
  return {
    getStyles() {
      return styles;
    },
  };
}

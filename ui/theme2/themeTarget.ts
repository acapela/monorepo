import { FlattenSimpleInterpolation, Interpolation, InterpolationValue } from "styled-components";

export type ThemeTarget = {
  getStyles(): FlattenSimpleInterpolation;
  [key: string]: any;
};

export function createThemeTarget(styles: FlattenSimpleInterpolation): ThemeTarget {
  return {
    getStyles() {
      return styles;
    },
  };
}

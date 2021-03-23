import { css, FlattenSimpleInterpolation } from "styled-components";

export function propValueStyles<P, K extends keyof P>(
  name: K,
  value: P[K],
  styles: FlattenSimpleInterpolation | string
) {
  return function applied(props: P): FlattenSimpleInterpolation | undefined {
    if (props[name] === value) {
      return css`
        ${styles}
      `;
    }
  };
}

export function boolPropStyles<P>(name: keyof P, styles: FlattenSimpleInterpolation | string) {
  return function applied(props: P): FlattenSimpleInterpolation | undefined {
    if (props[name]) {
      return css`
        ${styles}
      `;
    }
  };
}

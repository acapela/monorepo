import { css, SimpleInterpolation } from "styled-components";

export function propValueStyles<P, K extends keyof P>(name: K, value: P[K], styles: SimpleInterpolation | string) {
  return function applied(props: P): SimpleInterpolation | undefined {
    if (props[name] === value) {
      return css`
        ${styles}
      `;
    }
  };
}

export function boolPropStyles<P>(name: keyof P, styles: SimpleInterpolation | string) {
  return function applied(props: P): SimpleInterpolation | undefined {
    if (props[name]) {
      return css`
        ${styles}
      `;
    }
  };
}

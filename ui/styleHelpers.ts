import { StaticInterpolation, css } from "styled-components";

export function propValueStyles<P, K extends keyof P>(name: K, value: P[K], styles: StaticInterpolation | string) {
  return function applied(props: P): StaticInterpolation | undefined {
    if (props[name] === value) {
      return css`
        ${styles}
      `;
    }
  };
}

export function boolPropStyles<P>(name: keyof P, styles: StaticInterpolation | string) {
  return function applied(props: P): StaticInterpolation | undefined {
    if (props[name]) {
      return css`
        ${styles}
      `;
    }
  };
}

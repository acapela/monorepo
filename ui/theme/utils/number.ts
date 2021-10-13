import { StylesPart, css } from "styled-components";

import { Direction, resolveDirection } from "./direction";
import { ThemeTarget, createThemeTarget } from "./themeTarget";

type NumberVariants = {
  value: number;

  asGap: StylesPart;

  asPadding(horizontalRatio?: number): StylesPart;
  asMargin(direction: Direction): StylesPart;

  multiply(by: number): Number;
};

export type Number = ThemeTarget<NumberVariants>;

export function number(input: number): Number {
  const styleWithUnit = css`
    ${input + "px"}
  `;

  const self: Number = createThemeTarget<NumberVariants>(
    () =>
      css`
        ${input}
      `,
    {
      get value() {
        return input;
      },
      get asGap() {
        return css`
          gap: ${styleWithUnit};
        `;
      },
      asPadding(horizontalRatio = 1) {
        return css`
          padding: ${input}px ${input * horizontalRatio}px;
        `;
      },
      asMargin(direction) {
        const directions = resolveDirection(direction);

        return css`
          ${directions.map((direction) => `margin-${direction}: ${input}px`)}
        `;
      },
      multiply(by) {
        return number(input * by);
      },
    }
  );

  return self;
}

import { css } from "styled-components";

import { phone } from "@aca/ui/responsive";

import { ThemeTarget, createThemeTarget } from "./themeTarget";

type BoxVariants = {
  horizontalOnly: Box;
  verticalOnly: Box;
};

export type Box = ThemeTarget<BoxVariants>;

export function box(x: number, y = x, mobileX = x, mobileY = y): Box {
  const self: Box = createThemeTarget<BoxVariants>(
    () =>
      css`
        padding: ${y}px ${x}px;

        ${phone(css`
          padding: ${mobileX}px ${mobileY}px;
        `)}
      `,
    {
      get horizontalOnly() {
        return box(x, 0);
      },
      get verticalOnly() {
        return box(0, y);
      },
    }
  );

  return self;
}

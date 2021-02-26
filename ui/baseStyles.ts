import { css } from "styled-components";
import { setColorOpacity } from "@acapela/shared/colors";

const BLACK = "#000";

function createShadowCss(size: number, opacity = 0.2) {
  const shadowColor = setColorOpacity(BLACK, opacity);

  return css`
    box-shadow: 0 0 ${size}rem ${shadowColor};
  `;
}

export const shadow = {
  small: createShadowCss(1),
  medium: createShadowCss(2),
  large: createShadowCss(4),
};

function createBorderRadiusCss(size: number) {
  return css`
    border-radius: ${size}rem;
  `;
}

export const borderRadius = {
  small: createBorderRadiusCss(0.25),
  medium: createBorderRadiusCss(0.5),
  large: createBorderRadiusCss(1),
};

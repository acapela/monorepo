import { css } from "styled-components";

function buildBorderRadiusStyle(sizeInPx: number) {
  return css`
    border-radius: ${sizeInPx}px;
  `;
}

const primaryItem = buildBorderRadiusStyle(10);
const secondaryItem = buildBorderRadiusStyle(6);

export const radius = {
  button: secondaryItem,
  secondaryItem: secondaryItem,
  primaryItem: primaryItem,
  panel: primaryItem,
  circle: buildBorderRadiusStyle(1000),
};

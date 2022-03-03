import { css } from "styled-components";

function buildBorderRadiusStyle(sizeInPx: number) {
  return css`
    border-radius: ${sizeInPx}px;
  `;
}

const primaryItem = buildBorderRadiusStyle(6);
const secondaryItem = buildBorderRadiusStyle(6);

export const radius = {
  button: secondaryItem,
  badge: buildBorderRadiusStyle(3),
  secondaryItem: secondaryItem,
  primaryItem: primaryItem,
  panel: primaryItem,
  circle: buildBorderRadiusStyle(1000),
};

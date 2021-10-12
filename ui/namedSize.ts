import { css } from "styled-components";

const namedSize = {
  "extra-small": 16,
  small: 24,
  regular: 30,
  medium: 40,
};

export type NamedSize = keyof typeof namedSize;

export function getNamedSizeValue(sizeName: NamedSize) {
  return namedSize[sizeName];
}

export function getNamedSizeSquareStyles(sizeName: NamedSize) {
  const sizeValue = getNamedSizeValue(sizeName);
  return css`
    width: ${sizeValue}px;
    height: ${sizeValue}px;
  `;
}

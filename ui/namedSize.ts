import { css } from "styled-components";

const namedSize = {
  small: 24,
  regular: 32,
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

import styled, { css } from "styled-components";
import { pickNArrayItemsWithSeed } from "~shared/array";
import { COLORS_PALETTE } from "~ui/colors";

const PALETTE_LIST = [...Object.values(COLORS_PALETTE)];

export function getSpaceColors(spaceId: string) {
  return pickNArrayItemsWithSeed(PALETTE_LIST, 2, spaceId);
}

export function getSpaceBackgroundGradientStyle(spaceId: string) {
  return css`
    background-image: linear-gradient(to right bottom, ${getSpaceColors(spaceId).join(",")});
  `;
}

export const SpaceGradient = styled.div<{ spaceId: string }>`
  ${(props) => getSpaceBackgroundGradientStyle(props.spaceId)}
`;

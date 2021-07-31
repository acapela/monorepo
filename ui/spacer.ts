import { css } from "styled-components";

const SIZE_OF_SPACE_UNIT_IN_PX = 8;

export function spacer(prop: string, units: number) {
  const sanitizedUnits = Math.floor(units);

  return css`
    ${`${prop}: ${sanitizedUnits * SIZE_OF_SPACE_UNIT_IN_PX}px;`}
  `;
}

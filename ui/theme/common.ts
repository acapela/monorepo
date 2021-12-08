import { css } from "styled-components";

export const common = {
  // Converts normal display: block to flex, without modifying its display flow.
  // Useful when stacking nested flex elements eg. to have dynamic height that does not overflow the screen.
  flexDiv: css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: 0;
  `,
};
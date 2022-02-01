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
  clickable: css`
    cursor: var(--pointer);
    -webkit-app-region: no-drag;
    user-select: none;
  `,
  stretchPosition: css`
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
};

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
  ellipsisText: css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  transparentInput: css`
    font: inherit;
    background: transparent;
    color: inherit;
    border: none;
    outline: none;
  `,
  dragWindow: css`
    /* 'drag' mode prevents some mouse events to occur making it impossible to detect mouse being out of embed view */
    body:not(.embed-focused) & {
      -webkit-app-region: drag;
    }
  `,
  selectable: css`
    user-select: auto;
  `,
  capLines(lines: number) {
    return css`
      -webkit-line-clamp: ${lines};
      -webkit-box-orient: vertical;
      overflow: hidden;
      display: -webkit-box;
    `;
  },
};

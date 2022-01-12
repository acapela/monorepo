import { css } from "styled-components";

import { theme } from "@aca/ui/theme";

export const baseInputStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  /* TODO PR */
  padding: 16px;
  width: 100%;

  /* TODO PR */
  border: 1px solid hsla(0, 0%, 75%, 0.25);
  box-sizing: border-box;
  ${theme.radius.secondaryItem}

  outline: none;
`;

export function onEnterPressed(fn: () => void) {
  return function keyPressMonitor(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      fn();
    }
  };
}

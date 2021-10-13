import styled, { css } from "styled-components";

import { theme } from "~ui/theme";

export const CardBase = styled.div<{ isClickable?: boolean }>`
  padding: 24px 20px;
  background: ${theme.colors.layout.backgroundAccent};
  border: 1px solid ${theme.colors.layout.background.border};
  box-sizing: border-box;

  ${theme.radius.panel}
  ${theme.shadow.modal}

  ${theme.transitions.hover()}

  ${(props) => {
    if (!props.isClickable) return;

    return css`
      cursor: pointer;
      &:hover {
        background-color: ${theme.colors.layout.background.hover};
      }
    `;
  }}
`;

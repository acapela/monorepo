import styled, { css } from "styled-components";
import { theme } from "~ui/theme";

export const CardBase = styled.div<{ isClickable?: boolean }>`
  padding: 24px 20px;
  background: ${theme.colors.layout.foreground()};
  border: 1px solid ${theme.colors.layout.softLine()};
  box-sizing: border-box;

  ${theme.borderRadius.card}
  ${theme.shadow.card}

  ${theme.transitions.hover()}

  ${(props) => {
    if (!props.isClickable) return;

    return css`
      cursor: pointer;
      &:hover {
        background-color: ${theme.colors.interactive.selected()};
      }
    `;
  }}
`;

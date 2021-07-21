import styled, { css } from "styled-components";
import { borderRadius, shadow } from "~ui/baseStyles";
import { WHITE, BACKGROUND_ACCENT_WEAK } from "~ui/colors";
import { getColorHoverVariant } from "~ui/transitions";

export const CardBase = styled.div<{ isClickable?: boolean }>`
  padding: 24px 20px;
  background: ${WHITE};
  border: 1px solid ${BACKGROUND_ACCENT_WEAK};
  box-sizing: border-box;
  ${borderRadius.card}
  ${shadow.card}

  ${(props) => {
    if (!props.isClickable) return;

    return css`
      cursor: pointer;
      &:hover {
        background-color: ${getColorHoverVariant(WHITE)};
      }
    `;
  }}
`;

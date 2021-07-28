import styled from "styled-components";
import { borderRadius, shadow } from "~ui/baseStyles";
import { BACKGROUND_ACCENT_WEAK } from "~ui/theme/colors/base";
import { hoverActionCss } from "~ui/transitions";

export const UICardListItem = styled.div`
  padding: 16px 16px 16px 32px;

  position: relative;

  ${borderRadius.button}

  ${shadow.cardItem}

  ${hoverActionCss}
  cursor: pointer;

  border: 1px solid ${BACKGROUND_ACCENT_WEAK};
`;

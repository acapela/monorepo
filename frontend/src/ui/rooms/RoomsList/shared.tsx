import styled from "styled-components";
import { borderRadius } from "~frontend/../../ui/baseStyles";
import { BACKGROUND_ACCENT_WEAK } from "~ui/colors";
import { hoverActionCss } from "~ui/transitions";

export const UICardListItem = styled.div`
  padding: 16px 16px 16px 32px;

  position: relative;

  ${borderRadius.button}

  ${hoverActionCss}
  cursor: pointer;

  border: 1px solid ${BACKGROUND_ACCENT_WEAK};
`;

import styled from "styled-components";
import { BACKGROUND_ACCENT_WEAK } from "~ui/colors";
import { hoverActionCss } from "~ui/transitions";

export const UICardListItem = styled.div`
  padding: 16px 16px 16px 32px;

  position: relative;

  ${hoverActionCss}
  cursor: pointer;

  border: 1px solid ${BACKGROUND_ACCENT_WEAK};
`;

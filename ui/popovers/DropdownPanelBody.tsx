import styled from "styled-components";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius, shadow } from "~ui/baseStyles";
import { BASE_GREY_5, WHITE } from "~ui/colors";

export const UIDropdownPanelBody = styled(PopPresenceAnimator)`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: ${WHITE};
  border: 1px solid ${BASE_GREY_5};
  box-sizing: border-box;
  ${shadow.popover};
  ${borderRadius.menu}
  min-width: 200px;
`;

import styled from "styled-components";

import { PopPresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";

export const UIDropdownPanelBody = styled(PopPresenceAnimator)<{}>`
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  ${theme.colors.layout.background.asBg};
  /* TODO PR: easier api for border */
  border: 1px solid ${theme.colors.layout.background.border};
  box-sizing: border-box;
  ${theme.shadow.popover};
  ${theme.radius.panel};
  min-width: 200px;
`;

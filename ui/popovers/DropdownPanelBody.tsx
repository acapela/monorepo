import styled from "styled-components";

import { PopPresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

export const UIDropdownPanelBody = styled(PopPresenceAnimator)<{}>`
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  ${theme.colors.panels.popover.withBorder.asBgWithReadableText};
  box-sizing: border-box;
  ${theme.shadow.popover};
  ${theme.radius.panel};
  min-width: 200px;
`;

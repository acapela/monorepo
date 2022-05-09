import React from "react";
import styled from "styled-components";

import { FadePresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

export function ZeroNotifications() {
  return (
    <UIHolder>
      <UIUnderlined>No notifications in this list.</UIUnderlined>
    </UIHolder>
  );
}

const UIHolder = styled(FadePresenceAnimator)`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
`;

const UIUnderlined = styled.span`
  ${theme.typo.content.semibold.opacity(0.5)};
`;

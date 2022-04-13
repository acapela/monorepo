import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

const commonCardStyles = css`
  padding: 30px;
  ${theme.colors.layout.backgroundAccent.asBgWithReadableText};
  border-radius: 6px;
  border: 1px solid #fff1;
  display: flex;
  flex-direction: column;
`;

export const UIOnboardingCard = styled.div`
  ${commonCardStyles};
`;

interface OnboardingClickableCardProps {
  $isActive?: boolean;
}

export const UIOnboardingClickableCard = styled.div<OnboardingClickableCardProps>`
  ${commonCardStyles};
  ${theme.transitions.hover()};
  border-width: 1.5px;

  &:hover {
    border-color: ${theme.colors.primary.opacity(0.5).value};
  }
`;

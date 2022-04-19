import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

const commonCardStyles = css`
  padding: 30px;
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  border-radius: 6px;
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
  border-width: 1px;

  &:hover {
    border-color: ${theme.colors.primary.opacity(0.5).value};
    box-shadow: 0 0 20px ${theme.colors.primary.opacity(0.15).value};
  }

  ${(props) =>
    props.$isActive &&
    css`
      border-color: ${theme.colors.primary.opacity(0.5).value};
    `}
`;

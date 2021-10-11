import styled, { keyframes } from "styled-components";

import { Logo } from "~frontend/ui/Logo";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { theme } from "~ui/theme";

export function LoadingScreen() {
  return (
    <UIHolder presenceStyles={{ opacity: [0, 1] }} initial={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      <Logo />
    </UIHolder>
  );
}

const scaleDown = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.66)
  }
`;

const UIHolder = styled(PresenceAnimator)`
  background-color: ${theme.colors.layout.background()};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Logo} {
    font-size: 64px;
    animation: ${scaleDown} 7s ease-out;
    animation-fill-mode: both;
  }
`;

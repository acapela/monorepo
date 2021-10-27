import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

import { Logo } from "~frontend/ui/Logo";
import { useUnmountPresence } from "~frontend/ui/presence";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { theme } from "~ui/theme";

export function LoadingScreen() {
  const isMounted = useUnmountPresence(200);

  return (
    <UIHolder isVisible={isMounted}>
      <Logo />
      <UILoadingLabel presenceStyles={{ opacity: [0, 0.6] }} transition={{ delay: 1, duration: 1 }}>
        Acapela is loading...
      </UILoadingLabel>
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

const UIHolder = styled(motion.div)<{ isVisible: boolean }>`
  background-color: ${theme.colors.layout.background()};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${theme.spacing.close.multiply(2).asGap};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.isVisible ? "all" : "none")};
  will-change: opacity;
  transition: 0.2s all;

  ${Logo} {
    font-size: 64px;
    animation: ${scaleDown} 7s ease-out;
    animation-fill-mode: both;
    will-change: transform;
  }
`;

const UILoadingLabel = styled(PresenceAnimator)`
  ${theme.typo.label.medium};
`;

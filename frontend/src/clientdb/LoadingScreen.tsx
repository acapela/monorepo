import { motion } from "framer-motion";
import { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

import { useWait } from "@aca/shared/hooks/useWait";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { Logo } from "@aca/ui/icons/logos/AcapelaLogo";
import { useUnmountPresence } from "@aca/ui/presence";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

interface Props {
  loadingNotice?: string;
  longLoadingFallback?: {
    timeout: number;
    fallbackNode: ReactNode;
    hint?: string;
  };
}

export function LoadingScreen({ loadingNotice, longLoadingFallback }: Props) {
  const isTakingTooLong = useWait(longLoadingFallback?.timeout ?? 5000, !!longLoadingFallback);

  const isMounted = useUnmountPresence(200);

  const shouldShowNoticeInstantly = !!loadingNotice;

  function getNoticeToShow() {
    if (isTakingTooLong && longLoadingFallback?.hint) {
      return longLoadingFallback.hint;
    }

    return loadingNotice ?? "Acapela is loading...";
  }

  const loadingNoticeToShow = getNoticeToShow();

  return (
    <BodyPortal>
      <UIHolder $isVisible={isMounted}>
        <UIMain layout="position">
          <Logo />
          <UILoadingLabel
            presenceStyles={{ opacity: [0, 0.6] }}
            transition={{ delay: shouldShowNoticeInstantly ? 0 : 1, duration: 1 }}
          >
            {loadingNoticeToShow}
          </UILoadingLabel>
        </UIMain>

        {isTakingTooLong && longLoadingFallback?.fallbackNode}
      </UIHolder>
    </BodyPortal>
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

const UIHolder = styled(motion.div)<{ $isVisible: boolean }>`
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
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? "all" : "none")};
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

const UIMain = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
`;

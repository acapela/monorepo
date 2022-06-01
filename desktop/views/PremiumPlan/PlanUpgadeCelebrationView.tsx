import confetti from "canvas-confetti";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { getCurrentPlan } from "@aca/desktop/domains/plan/api";
import { uiStore } from "@aca/desktop/store/ui";
import { styledObserver } from "@aca/shared/component";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";
import { zIndexValues } from "@aca/ui/theme/zIndex";

import illustration from "./upgrade-illustration.svg";

async function pushConfettiForTime(durationMs: number) {
  const end = Date.now() + durationMs;

  const colors = ["#FF1A8C", "#ef3f97", "#e965a7", "#98074f"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      zIndex: zIndexValues.top,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      zIndex: zIndexValues.top,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export const PlanUpgadeCelebrationView = styledObserver(() => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const isAppFocused = uiStore.isAppFocused;

  const currentPlan = getCurrentPlan();

  useDependencyChangeEffect(() => {
    if (currentPlan === "BUSINESS") {
      setIsCelebrating(true);
    }
  }, [currentPlan]);

  useEffect(() => {
    if (!isAppFocused || !isCelebrating) return;

    pushConfettiForTime(2000);
  }, [isCelebrating, isAppFocused]);

  return (
    <BodyPortal>
      <AnimatePresence>
        {isCelebrating && (
          <UIHolder
            onClick={() => {
              pushConfettiForTime(300);
            }}
          >
            <UIPanel>
              <UIIllustration src={illustration} />
              <UIContent>
                <UITitle>Upgrade successful!</UITitle>
                <UIMessage>
                  We are thrilled, that you decided to take your notification-game to the next level. You now have
                  access to all Acapela Ultimate features.
                </UIMessage>
              </UIContent>
              <Button
                kind="primary"
                isWide
                size="primary"
                onClick={(event) => {
                  event?.stopPropagation();
                  setIsCelebrating(false);
                }}
              >
                Get started
              </Button>
            </UIPanel>
          </UIHolder>
        )}
      </AnimatePresence>
    </BodyPortal>
  );
})``;

const UIHolder = styled(FadePresenceAnimator)`
  display: flex;
  position: fixed;
  inset: 0;
  ${theme.colors.layout.background.asBgWithReadableText};
  z-index: ${theme.zIndex.top};
  align-items: center;
  justify-content: center;
`;

const UIPanel = styled.div`
  background: conic-gradient(
      from 180deg at 50% 25.96%,
      rgba(38, 38, 38, 0) -50.97deg,
      rgba(38, 38, 38, 0.4) 48.03deg,
      #ff1a8c 180.43deg,
      rgba(38, 38, 38, 0) 309.03deg,
      rgba(38, 38, 38, 0.4) 408.03deg
    ),
    #262626;
  box-shadow: 0px 20px 50px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 50px;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
`;

const UIContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const UITitle = styled.div`
  font-weight: 600;
  font-size: 24px;
`;

const UIMessage = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5em;
  opacity: 0.8;
`;

const UIIllustration = styled.img`
  width: 200px;
`;

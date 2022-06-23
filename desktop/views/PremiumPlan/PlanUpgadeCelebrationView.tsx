import confetti from "canvas-confetti";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

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
    if (currentPlan === "ULTIMATE") {
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
                  You are currently on a free trial and will not be charged for the next 30 days. You now have access to
                  all Acapela Ultimate features.
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

const gradientSemiTransparent = theme.colors.layout.backgroundAccent.opacity(0.4);
const gradientTransparent = theme.colors.layout.backgroundAccent.opacity(0);

const accentGradientBackground = css`
  background: conic-gradient(
      from 180deg at 50% 25.96%,
      ${gradientTransparent.value} -50.97deg,
      ${gradientSemiTransparent.value} 48.03deg,
      #ff1a8c 180.43deg,
      ${gradientTransparent.value} 309.03deg,
      ${gradientSemiTransparent.value} 408.03deg
    ),
    ${theme.colors.layout.backgroundAccent.value};
`;

const UIPanel = styled.div`
  ${accentGradientBackground};

  box-shadow: 0px 20px 50px 10px ${theme.colors.layout.background.opacity(0.2).value};
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
  ${theme.typo.pageSubtitle};
`;

const UIMessage = styled.div`
  ${theme.typo.body.secondary};
`;

const UIIllustration = styled.img`
  width: 200px;
`;

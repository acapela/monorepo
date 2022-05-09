import { AnimatePresence, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

const COUNT_COUNTDOWN_FROM = 30;

export function NewListViewZenOverlay() {
  const [notificationsCount, setNotificationsCount] = useState(COUNT_COUNTDOWN_FROM);

  const notificationsMotionValue = useSpring(COUNT_COUNTDOWN_FROM, { duration: 2500, bounce: 0 });

  useEffect(() => {
    const stop = notificationsMotionValue.onChange((value) => {
      setNotificationsCount(Math.floor(value));
    });

    notificationsMotionValue.set(0);

    return stop;
  }, []);
  return (
    <UIHolder
      presenceStyles={{ opacity: [0, 1], scale: [1.2, 1] }}
      transition={{ type: "spring", duration: 5, bounce: 0 }}
    >
      <UIBowlHolder>
        <UIBall>
          <AnimatePresence>
            <UINotificationsCount style={{ opacity: notificationsCount / COUNT_COUNTDOWN_FROM }}>
              {notificationsCount}
            </UINotificationsCount>
          </AnimatePresence>
        </UIBall>
        <UIBowl>
          <UIShade />
        </UIBowl>
      </UIBowlHolder>
      <UINotificationZeroPanel
        presenceStyles={{ opacity: [0, 1] }}
        transition={{ type: "spring", duration: 5, bounce: 0, delay: 1.5 }}
      >
        You've reached notification zero.
      </UINotificationZeroPanel>
    </UIHolder>
  );
}

const UIHolder = styled(PresenceAnimator)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${theme.colors.layout.background.asBgWithReadableText};
  will-change: transform;
`;

const UINotificationZeroPanel = styled(PresenceAnimator)`
  align-items: center;
  justify-content: center;
  text-align: center;
  display: inline-flex;
  padding: 30px 45px;
  ${theme.typo.secondaryTitle.semibold}
`;

const BOWL_SIZE = 300;

const fallingBall = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-160px);
  }

  50% {
    opacity: 1;
    transform: translateY(30px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const impactedBowl = keyframes`
  0% {
    opacity: 0;

    transform: translateY(0);
  }

  12.5% {
    opacity: 0;
  }

  25% {
    opacity: 1;
  }

  50% {

    transform: translateY(20px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const ANIMATION_DURATION_S = 2;
const ANIMATION_DELAY_S = 0.5;

const animationDelay = css`
  animation-delay: ${ANIMATION_DELAY_S}s;
`;

const UIBowlHolder = styled.div`
  height: ${BOWL_SIZE}px;
  width: ${BOWL_SIZE}px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const UIBowl = styled.div`
  ${theme.colors.layout.backgroundAccent.hover.opacity(0.4).asBg}
  border: 1px solid #fff2;
  backdrop-filter: blur(48px);
  width: ${BOWL_SIZE}px;
  height: ${BOWL_SIZE / 2}px;
  border-bottom-left-radius: ${BOWL_SIZE / 2}px;
  border-bottom-right-radius: ${BOWL_SIZE / 2}px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  will-change: transform;
  z-index: 2;
  animation: ${impactedBowl} ${ANIMATION_DURATION_S}s both ease-in-out;
  ${animationDelay}
`;

const BALL_SIZE = BOWL_SIZE * 0.6;

const UIBall = styled.div`
  position: absolute;
  width: ${BALL_SIZE}px;
  height: ${BALL_SIZE}px;
  ${theme.colors.primary.asBgWithReadableText};
  border-radius: 1000px;
  top: ${(BOWL_SIZE - BALL_SIZE) / 2}px;
  left: ${(BOWL_SIZE - BALL_SIZE) / 2}px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${BALL_SIZE / 3}px;
  font-weight: 600;

  animation: ${fallingBall} ${ANIMATION_DURATION_S}s both ease-in-out;
  ${animationDelay};
`;

const UIShade = styled.div`
  background: radial-gradient(27.76% 27.76% at 72.5% 72.24%, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0) 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  mix-blend-mode: normal;
  position: absolute;
  inset: -100px;
  top: -${BOWL_SIZE / 2}px;
  z-index: 2;
`;

const UINotificationsCount = styled.div`
  transition: 0.2s all;
`;

import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { desktopRouter } from "@aca/desktop/routes";
import { systemBarPlaceholder } from "@aca/desktop/ui/systemTopBar/ui";
import { getNextItemInArray } from "@aca/shared/array";
import { getObjectKey } from "@aca/shared/object";
import { createTimeout } from "@aca/shared/time";
import { fadeInKeyframes } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

import { startOnboardingFinishedAnimation } from "./OnboardingFinishedAnimationManager";
import { OnboardingStage, onboardingStages } from "./stage";
import { BulletsBar } from "./ui/BulletsBar";
import { OnboardingAnimationsOrchestrator } from "./ui/enterAnimations";

export const OnboardingView = observer(function OnboardingView() {
  const [currentStage, setCurrentStage] = useState<OnboardingStage | null>(onboardingStages[0]);

  function goToNextStage() {
    const nextStage = getNextItemInArray(onboardingStages, currentStage);

    setCurrentStage(nextStage);
  }

  useEffect(() => {
    if (currentStage) return;
    return createTimeout(() => {
      startOnboardingFinishedAnimation();
      desktopRouter.navigate("home");
    }, 150);
  }, [currentStage]);

  return (
    <UIHolder>
      <UIWindowDragger
        onDoubleClick={() => {
          toggleMaximizeRequest();
        }}
      />
      <UIFader>
        <AnimatePresence exitBeforeEnter>
          {currentStage && (
            <OnboardingAnimationsOrchestrator key={getObjectKey(currentStage)}>
              <currentStage.Component onContinue={goToNextStage} />
            </OnboardingAnimationsOrchestrator>
          )}
        </AnimatePresence>
      </UIFader>
      <UIBullets>
        <BulletsBar
          items={onboardingStages}
          activeItem={currentStage}
          onActivateRequest={setCurrentStage}
          allowMovingForward={false}
        />
      </UIBullets>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  ${theme.colors.layout.background.asBgWithReadableText}
`;

export const welcomeAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const UIFader = styled.div`
  animation: ${welcomeAnimation} 3s ease-out both;
  animation-delay: 0.2s;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UIWindowDragger = styled.div`
  ${systemBarPlaceholder};
  ${theme.common.dragWindow};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
`;

const UIBullets = styled.div`
  animation: ${fadeInKeyframes} 3s ease-out both;
`;

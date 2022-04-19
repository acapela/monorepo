import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled, { keyframes } from "styled-components";

import { Logo } from "@aca/desktop/ui/Logo";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingHero } from "./ui/typo";

export const StageWelcome = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingAnimationItem key="foo">
          <UILogoHolder>
            <UILogo />
            <UIShadowAnimator />
          </UILogoHolder>
        </OnboardingAnimationItem>

        <OnboardingHero title="Welcome to Acapela" description="All your work notifications in one inbox." />
        <OnboardingContinueButton label="Let’s get started" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UILogoHolder = styled.div`
  display: flex;
  position: relative;
`;

const LOGO_SIZE = 64;

const UILogo = styled(Logo)`
  font-size: ${LOGO_SIZE}px;
  z-index: 1;
`;

const waveAnimation = keyframes`
  0% {
    opacity: 0;
    box-shadow: 0 0 ${LOGO_SIZE / 2}px ${LOGO_SIZE / 2}px #cb7e9488;
  }

  80% {
    opacity: 1;
  }


  100% {
    box-shadow: 0 0 ${LOGO_SIZE * 3}px ${LOGO_SIZE * 3}px #cb7e9400;
  }
`;

const UIShadowAnimator = styled(motion.div)`
  position: absolute;
  inset: ${LOGO_SIZE / 2}px;
  border-radius: ${LOGO_SIZE / 2}px;
  animation: ${waveAnimation} 8s both ease-out;
`;

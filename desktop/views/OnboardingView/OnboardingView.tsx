import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { getNextItemInArray } from "@aca/shared/array";
import { theme } from "@aca/ui/theme";

import { onboardingStages } from "./stage";
import { BulletsBar } from "./ui/BulletsBar";

export const OnboardingView = observer(function OnboardingView() {
  const [currentStage, setCurrentStage] = useState(onboardingStages[0]);

  function goToNextStage() {
    const nextStage = getNextItemInArray(onboardingStages, currentStage) ?? onboardingStages[0];

    setCurrentStage(nextStage);
  }

  const { Component: CurrentStageComponent } = currentStage;

  return (
    <UIHolder>
      <CurrentStageComponent onContinue={goToNextStage} />
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

const UIBullets = styled.div``;

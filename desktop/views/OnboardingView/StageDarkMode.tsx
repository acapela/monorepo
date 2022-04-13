import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { darkTheme, lightTheme } from "./assets";
import { OnboardingStageProps } from "./stage";
import { UIOnboardingClickableCard } from "./ui/cards";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageDarkMode = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="First things first"
          description="Pick app theme. You can switch it in the settings later."
        />
        <UIModes>
          <UIModeCard>
            <UIModeIllustration src={lightTheme} />
            <UIModeLabel>Light</UIModeLabel>
          </UIModeCard>
          <UIModeCard>
            <UIModeIllustration src={darkTheme} />
            <UIModeLabel>Dark</UIModeLabel>
          </UIModeCard>
        </UIModes>
        <OnboardingContinueButton label="Continue" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UIModes = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const UIModeCard = styled(UIOnboardingClickableCard)`
  align-items: center;
  gap: 10px;
`;

const UIModeIllustration = styled.img`
  width: 200px;
`;

const UIModeLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

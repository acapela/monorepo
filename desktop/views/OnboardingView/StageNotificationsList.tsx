import { observer } from "mobx-react";
import React from "react";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageNotificationsList = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Resolve your first notifications"
          description="Here are some basic actions you can perform on any notification."
        />
        <OnboardingContinueButton label="Continue" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

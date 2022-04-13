import { observer } from "mobx-react";
import React from "react";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageReadyToGo = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Ready to go!"
          description="You’re all set now. We hope your experience with your work notifications will be entirely different after this very moment."
        />
        <OnboardingContinueButton label="Open Acapela" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

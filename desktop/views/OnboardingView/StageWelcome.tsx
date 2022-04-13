import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { Logo } from "@aca/desktop/ui/Logo";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingHero } from "./ui/typo";

export const StageWelcome = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <UILogo />
        <OnboardingHero title="Welcome to Acapela" description="All your work notifications in one inbox." />
        <OnboardingContinueButton label="Let’s get started" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UILogo = styled(Logo)`
  font-size: 64px;
`;

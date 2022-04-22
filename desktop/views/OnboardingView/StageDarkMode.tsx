import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { useShortcuts } from "@aca/ui/keyboard/useShortcut";

import { darkTheme, lightTheme } from "./assets";
import { OnboardingStageProps } from "./stage";
import { UIOnboardingClickableCard } from "./ui/cards";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageDarkMode = observer(({ onContinue }: OnboardingStageProps) => {
  const currentTheme = uiSettingsBridge.get().theme;
  function toggleMode() {
    uiSettingsBridge.update({ theme: currentTheme === "dark" ? "light" : "dark" });
  }

  useShortcuts(["Left", "Right"], () => {
    toggleMode();
  });

  return (
    <OnboardingStageContainer>
      {/* TODO: nicely animate dark mode switch in this view */}
      {/* <ForceTransitions /> */}
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="First things first"
          description="Pick your favorite theme. You can switch it in the settings later."
        />
        <UIModes>
          <UIModeCard
            $isActive={currentTheme === "light"}
            onClick={() => {
              uiSettingsBridge.update({ theme: "light" });
            }}
          >
            <UIModeIllustration src={lightTheme} />
            <UIModeLabel>Light</UIModeLabel>
          </UIModeCard>
          <UIModeCard
            $isActive={currentTheme === "dark"}
            onClick={() => {
              uiSettingsBridge.update({ theme: "dark" });
            }}
          >
            <UIModeIllustration src={darkTheme} />
            <UIModeLabel>Dark</UIModeLabel>
          </UIModeCard>
        </UIModes>
        <OnboardingContinueButton label="Continue" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UIModes = styled(OnboardingAnimationItem)`
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

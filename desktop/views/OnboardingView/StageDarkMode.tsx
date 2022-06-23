import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { AppTheme, uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { Button } from "@aca/ui/buttons/Button";
import { useShortcuts } from "@aca/ui/keyboard/useShortcut";
import { theme } from "@aca/ui/theme";

import { darkTheme, lightTheme } from "./assets";
import { OnboardingStageProps } from "./stage";
import { UIOnboardingClickableCard } from "./ui/cards";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageDarkMode = observer(({ onContinue }: OnboardingStageProps) => {
  const currentTheme = uiSettingsBridge.get().theme;

  function handleThemeSelection(theme: AppTheme) {
    trackEvent("App Theme Changed", { theme });
    uiSettingsBridge.update({ theme });
  }

  function handleAutoThemeSelection() {
    handleThemeSelection("auto");
    onContinue();
  }

  useShortcuts(["Left", "Right"], () => {
    handleThemeSelection(currentTheme === "dark" ? "light" : "dark");
  });

  return (
    <OnboardingStageContainer>
      {/* TODO: nicely animate dark mode switch in this view */}
      {/* <ForceTransitions /> */}
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="First things first"
          description="Pick your app theme. You can change it later in your settings."
        />
        <UIModes>
          <UIModeCard
            $isActive={currentTheme === "light"}
            onClick={() => {
              handleThemeSelection("light");
            }}
          >
            <UIModeIllustration src={lightTheme} />
            <UIModeLabel>Light</UIModeLabel>
          </UIModeCard>
          <UIModeCard
            $isActive={currentTheme === "dark"}
            onClick={() => {
              handleThemeSelection("dark");
            }}
          >
            <UIModeIllustration src={darkTheme} />
            <UIModeLabel>Dark</UIModeLabel>
          </UIModeCard>
        </UIModes>
        <OnboardingAnimationItem>
          <Button kind="transparent" onClick={handleAutoThemeSelection}>
            Sync theme with system settings
          </Button>
        </OnboardingAnimationItem>
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
  ${theme.typo.bodyTitle};
`;

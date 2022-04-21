import { shell } from "electron";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { openCommandMenu } from "@aca/desktop/domains/commandMenu/CommandMenuManager";
import { Button } from "@aca/ui/buttons/Button";
import { IconArrowBottom } from "@aca/ui/icons";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";
import { theme } from "@aca/ui/theme";

import { OnboardingStageProps } from "./stage";
import { UIOnboardingCard } from "./ui/cards";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

const handleFeedbackCallButtonClick = () => {
  shell.openExternal("https://calendly.com/acapela/feedback");
  trackEvent("Onboarding Completed");
};

export const StageReadyToGo = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Ready to go!"
          description="You’re all set now. We hope your experience with your work notifications will be entirely different with Acapela."
        />
        <OnboardingAnimationItem>
          <UISummaryCard>
            <UISummaryItem>
              <UICopySection>
                <UITitle>Feedback</UITitle>
                <UIDescription>Did we miss your favorite tool? Let us know!</UIDescription>
              </UICopySection>
              <UICopySection>
                <div
                  onClick={() => {
                    openCommandMenu("Send feedback");
                  }}
                >
                  <PrimaryShortcut shortcut={["Mod", "K"]} />
                </div>
                <IconArrowBottom />
                <UIScenarioCTA>“Send feedback”</UIScenarioCTA>
              </UICopySection>
            </UISummaryItem>
            <UILimiter />

            <UISummaryItem>
              <UICopySection>
                <UITitle>Give us feedback :)</UITitle>
                <UIDescription>Book a call to ask any questions or request new features.</UIDescription>
              </UICopySection>
              <Button kind="secondary" size="primary" onClick={handleFeedbackCallButtonClick}>
                Schedule a call
              </Button>
            </UISummaryItem>
          </UISummaryCard>
        </OnboardingAnimationItem>

        <OnboardingContinueButton
          label="Open Acapela"
          onClick={() => {
            onContinue();
          }}
        />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UISummaryCard = styled(UIOnboardingCard)`
  display: flex;
  flex-direction: row;
  gap: 32px;
`;

const UISummaryItem = styled.div`
  max-width: 260px;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
`;

const UITitle = styled.div`
  font-weight: 600;
  font-size: 16px;
`;
const UIDescription = styled.div`
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.5em;
`;

const UILimiter = styled.div`
  width: 1px;
  ${theme.colors.layout.divider.asBg}
`;

const shortcutBgColor = theme.colors.layout.backgroundAccent.hover;

const PrimaryShortcut = styled(ShortcutDescriptor)`
  font-size: 24px;
  gap: 10px;

  .key {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    ${shortcutBgColor.asBgWithReadableText};
    transition: 0.35s all;
  }

  &:hover {
    .key {
      transition: 0.075s all;
      ${shortcutBgColor.hover.asBgWithReadableText};
    }
  }
`;

const UICopySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  svg {
    font-size: 24px;
  }
`;

const UIScenarioCTA = styled.div`
  font-weight: 600;
`;

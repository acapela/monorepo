import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { openFeedbackWidget } from "@aca/desktop/domains/feedbackWidget";
import { getEnabledIntegrationClientList } from "@aca/desktop/domains/integrations";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { getCurrentPlan } from "@aca/desktop/domains/plan/api";
import { onboardingStore } from "@aca/desktop/store/onboarding";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { Button } from "@aca/ui/buttons/Button";
import { IconCheck } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { UpgradePlanBadge } from "./plan/UpgradePlanBadge";
import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageConnectTools = observer(({ onContinue, continueLabel = "Continue" }: OnboardingStageProps) => {
  const currentPlan = getCurrentPlan();
  const canContinue = onboardingStore.hasLinkedApps;
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Connect your work tools"
          description="Collect all your notifications in one place, without checking multiple apps or dealing with email spam."
        />
        <UIIntegrationsButtons>
          {getEnabledIntegrationClientList().map((integration) => {
            return (
              <UIIntegrationBox key={integration.name}>
                <UIIntegrationButton
                  onClick={() => {
                    if (integration.getIsConnected()) return;

                    integration.connect();
                  }}
                  $forceHighlight={integration.getIsConnected()}
                >
                  <UIIntegrationIcon>
                    <IntegrationIcon integrationClient={integration} />
                  </UIIntegrationIcon>
                </UIIntegrationButton>
                <UICheckPlaceholder>
                  {integration.getIsConnected() && (
                    <PopPresenceAnimator>
                      <IconCheck />
                    </PopPresenceAnimator>
                  )}
                </UICheckPlaceholder>
              </UIIntegrationBox>
            );
          })}
        </UIIntegrationsButtons>
        <UIButtons>
          <OnboardingContinueButton
            label={continueLabel}
            onClick={onContinue}
            kind={canContinue ? "primary" : "disabled"}
          />
          <OnboardingAnimationItem>
            <Button kind="transparent" onClick={openFeedbackWidget}>
              Missing an integration?
            </Button>
          </OnboardingAnimationItem>
        </UIButtons>
        {currentPlan !== "BUSINESS" && (
          <OnboardingAnimationItem>
            <UpgradePlanBadge />
          </OnboardingAnimationItem>
        )}
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UIIntegrationsButtons = styled(OnboardingAnimationItem)`
  display: flex;
  gap: 10px;
`;

const UIIntegrationBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const UICheckPlaceholder = styled.div`
  font-size: 24px;
  height: 1em;
  max-height: 1em;
  line-height: 1em;
  ${theme.colors.success.asColor};
`;

const buttonHighlight = css`
  border-color: ${theme.colors.primary.opacity(0.5).value};
  box-shadow: 0 0 20px ${theme.colors.primary.opacity(0.15).value};
`;

const UIIntegrationButton = styled.div<{ $forceHighlight: boolean }>`
  ${theme.colors.layout.backgroundAccent.interactive};
  ${theme.transitions.hover()}
  padding: 20px;
  border-radius: 6px;

  border: 1px solid #0000;

  &:hover {
    ${buttonHighlight}
  }

  ${(prop) => prop.$forceHighlight && buttonHighlight}
`;

const UIIntegrationIcon = styled.div`
  font-size: 32px;
`;

const UIButtons = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

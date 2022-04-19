import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { IconCheck } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageConnectTools = observer(({ onContinue, continueLabel = "Continue" }: OnboardingStageProps) => {
  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Connect your work tools"
          description="Acapela will stay on top of notifications from tools you connect."
        />
        <UIIntegrationsButtons>
          {integrationClientList.map((integration) => {
            return (
              <UIIntegrationBox key={integration.name}>
                <UIIntegrationButton
                  onClick={() => {
                    if (integration.getIsConnected()) return;

                    integration.connect();
                  }}
                  $forceHighlight={integration.getIsConnected()}
                >
                  <UIIntegrationIcon>{integration.icon}</UIIntegrationIcon>
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
          <OnboardingContinueButton label={continueLabel} onClick={onContinue} />
          {/* <OnboardingAnimationItem>
            <Button kind="transparent">Missing integration?</Button>
          </OnboardingAnimationItem> */}
        </UIButtons>
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
  color: #16d96e;
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

import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";
import { theme } from "@aca/ui/theme";

import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageConnectTools = observer(({ onContinue }: OnboardingStageProps) => {
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
              <UIIntegrationButton key={integration.name}>
                <UIIntegrationIcon>{integration.icon}</UIIntegrationIcon>
              </UIIntegrationButton>
            );
          })}
        </UIIntegrationsButtons>
        <OnboardingContinueButton label="Continue" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

const UIIntegrationsButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const UIIntegrationButton = styled.div`
  ${theme.colors.layout.backgroundAccent.interactive};
  ${theme.transitions.hover()}
  padding: 20px;
  border-radius: 6px;
`;

const UIIntegrationIcon = styled.div`
  font-size: 32px;
`;

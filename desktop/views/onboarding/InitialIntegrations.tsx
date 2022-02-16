import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { onboardingStore } from "@aca/desktop/store/onboarding";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { IconArrowRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

const completeOnboarding = defineAction({
  name: "Continue",
  icon: <IconArrowRight />,
  private: true,
  canApply: () => !!onboardingStore.hasLinkedApps,
  handler() {
    onboardingStore.onboardingStatus = "complete";
  },
});

export const InitialIntegrationsView = observer(function InitialIntegrationsView() {
  return (
    <UIHolder>
      <UIHead>
        <UIHeader>Setup Integrations</UIHeader>
        <UIDescription>
          To help you stay on top of things, and make the most of the tools you already use.
        </UIDescription>
      </UIHead>

      <IntegrationsManager />
      <UIActionButton action={completeOnboarding} kind="primary" iconAtStart={false} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  padding: 80px;
  ${theme.layout.settingsPageMaxWidth};

  gap: 32px;

  display: flex;
  flex-direction: column;
`;

const UIHead = styled.div`
  gap: 16px;

  display: flex;
  flex-direction: column;
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.medium};
`;

const UIDescription = styled.div`
  ${theme.typo.content};
  max-width: 300px;
`;

const UIActionButton = styled(ActionButton)`
  width: 160px;
`;

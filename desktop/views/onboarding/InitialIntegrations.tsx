import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { onboardingStore } from "@aca/desktop/store/onboarding";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { IconArrowRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { SettingsLayout } from "../SettingsView/shared";

const completeOnboarding = defineAction({
  name: "Continue",
  icon: <IconArrowRight />,
  private: true,
  analyticsEvent: "Onboarding Completed",
  canApply: () => !!onboardingStore.hasLinkedApps,
  handler() {
    onboardingStore.onboardingStatus = "complete";
  },
});

export const InitialIntegrationsView = observer(function InitialIntegrationsView() {
  return (
    <SettingsLayout
      isUserMenuIncluded={false}
      headerTitle="Setup Integrations"
      navItems={
        <>
          <UIDescription>
            To help you stay on top of things, and make the most of the tools you already use.
          </UIDescription>
          <UIActionButton action={completeOnboarding} kind="primary" iconAtStart={false} />
        </>
      }
      body={<IntegrationsManager />}
    />
  );
});

const UIDescription = styled.div`
  ${theme.typo.content};
  padding-bottom: 24px;
`;

const UIActionButton = styled(ActionButton)`
  width: 100%;
`;

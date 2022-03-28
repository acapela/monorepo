import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { onboardingStore } from "@aca/desktop/store/onboarding";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IntegrationsManager } from "@aca/desktop/ui/IntegrationsManager";
import { SystemTopBar } from "@aca/desktop/ui/systemTopBar";
import { IconArrowRight } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

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
    <AppLayout>
      <SystemTopBar isFullWidth isUserMenuIncluded={false} />
      <UIHolder>
        <UIBody>
          <UINav>
            <UIHeader>
              <UIHeaderMain>Setup Integrations</UIHeaderMain>
            </UIHeader>

            <UIDescription>
              To help you stay on top of things, and make the most of the tools you already use.
            </UIDescription>
            <UIActionButton action={completeOnboarding} kind="primary" iconAtStart={false} />
          </UINav>
          <UIActiveSection>
            <IntegrationsManager />
          </UIActiveSection>
        </UIBody>
      </UIHolder>
    </AppLayout>
  );
});

const UIHolder = styled.div<{}>`
  ${appViewContainerStyles};
  display: flex;
  flex-direction: column;
  ${theme.layout.settingsPageMaxWidth}

  ${theme.spacing.pageSections.asGap}
  overflow: hidden;
`;

const UINav = styled.nav`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 240px;
  flex-grow: 1;
  width: 100%;
`;

const UIBody = styled.div`
  display: flex;
  gap: 24px;
  overflow: auto;
`;

const UIActiveSection = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  /* Visually appears at same heigh of first nav item */
  padding-top: 80px;
  padding-bottom: 80px;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.medium};
`;

const UIHeaderMain = styled.div``;

const UIDescription = styled.div`
  ${theme.typo.content};
`;

const UIActionButton = styled(ActionButton)`
  width: 100%;
`;

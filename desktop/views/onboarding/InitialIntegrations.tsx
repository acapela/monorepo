import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { connectFigma, connectLinear, connectNotion } from "@aca/desktop/actions/auth";
import { onboardingStore } from "@aca/desktop/store/onboardingStore";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IconArrowRight, IconAtom } from "@aca/ui/icons";
import FigmaLogo from "@aca/ui/icons/default/FigmaLogo";
import NotionLogo from "@aca/ui/icons/default/NotionLogo";
import { SlackLogo } from "@aca/ui/icons/logos/SlackLogo";
import { theme } from "@aca/ui/theme";

import { NotionSpaceSelector } from "../settings/NotionSpaceSelector";
import { SlackActions } from "../settings/SlackActions";

type ServiceIntegration = {
  name: string;
  icon: ReactNode;
  description: string;
  actions: ReactNode[];
};

const integrations: ServiceIntegration[] = [
  {
    name: "Slack",
    icon: <SlackLogo />,
    description: "Important or urgent conversations.",
    actions: [<SlackActions />],
  },
  {
    name: "Notion",
    icon: <NotionLogo />,
    description: "Comments, mentions and page invitations.",
    actions: [<ActionButton action={connectNotion} notApplicableMode="hide" />, <NotionSpaceSelector />],
  },
  {
    name: "Figma",
    icon: <FigmaLogo />,
    description: "File Comments and mentions.",
    actions: [<ActionButton action={connectFigma} />],
  },
  {
    name: "Linear",
    icon: <IconAtom />,
    description: "New issues, task assignments and comments.",
    actions: [<ActionButton action={connectLinear} />],
  },
];

const completeOnboarding = defineAction({
  name: "Continue",
  icon: <IconArrowRight />,
  private: true,
  canApply: () => !!onboardingStore.linkedAppsStatus,
  handler() {
    onboardingStore.onboardingStatus = "complete";
  },
});

export const InitialIntegrationsView = observer(function InitialIntegrationsView() {
  return (
    <UIHolder>
      <UIHeader>Setup Integrations</UIHeader>
      <UIDescription>To help you stay on top of things, and make the most of the tools you already use.</UIDescription>

      <UIIntegrationsTable>
        <UIIntegrationsTitle>Available integrations</UIIntegrationsTitle>
        {integrations.map(({ name, description, icon, actions }) => (
          <UIIntegrationRow key={name}>
            <UIIntegrationIcon>{icon}</UIIntegrationIcon>
            <UIIntegrationText>
              <h3>{name}</h3>
              <div>{description}</div>
            </UIIntegrationText>
            <UIIntegrationActions>{actions}</UIIntegrationActions>
          </UIIntegrationRow>
        ))}
      </UIIntegrationsTable>
      <UIActionButton action={completeOnboarding} kind="primary" iconAtStart={false} />
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  padding: 80px;
  width: 60vw;

  display: flex;
  flex-direction: column;
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.medium};
  margin-bottom: 16px;
`;

const UIDescription = styled.div`
  ${theme.typo.content};
  margin-bottom: 48px;
  max-width: 300px;
`;

const UIIntegrationsTitle = styled.h2`
  ${theme.typo.secondaryTitle.medium};
`;

const UIIntegrationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;

  /* Using instead of flex gap in order to display border line in better way */
  padding-top: 16px;
  padding-bottom: 16px;
`;

const UIIntegrationsTable = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 540px;
  max-width: 800px;

  margin-bottom: 40px;

  flex-direction: column;

  ${UIIntegrationRow} + ${UIIntegrationRow} {
    border-top: 1px solid ${theme.colors.layout.divider.withBorder};
  }
`;

const UIIntegrationIcon = styled.div`
  border: 1px solid ${theme.colors.layout.divider.withBorder};
  box-sizing: border-box;
  border-radius: 9px;

  padding: 8px;

  svg {
    height: 40px;
    width: 40px;
  }
`;

const UIIntegrationText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  gap: 4px;

  h3 {
    display: block;
    ${theme.typo.content.bold}
  }
  flex-grow: 1;
`;

const UIIntegrationActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const UIActionButton = styled(ActionButton)`
  width: 160px;
`;

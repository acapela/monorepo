import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { connectFigma, connectLinear, connectNotion } from "@aca/desktop/actions/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IconAtom } from "@aca/ui/icons";
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
    actions: [<ActionButton action={connectNotion} />, <NotionSpaceSelector />],
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

export const InitialIntegrationsView = observer(function InitialIntegrationsView() {
  return (
    <UIHolder>
      <UIHeader>Setup Integrations</UIHeader>
      <UIDescription>To help you stay on top of things, and make the most of the tools you already use.</UIDescription>

      <UIIntegrationsTitle>Available integrations</UIIntegrationsTitle>

      <UIIntegrationsTable>
        {integrations.map(({ name, description, icon, actions }) => (
          <UIIntegrationRow>
            <UIIntegrationIcon>{icon}</UIIntegrationIcon>
            <UIIntegrationText>
              <h3>{name}</h3>
              <div>{description}</div>
            </UIIntegrationText>
            <UIIntegrationActions>{actions}</UIIntegrationActions>
          </UIIntegrationRow>
        ))}
      </UIIntegrationsTable>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  padding: 80px;
  width: 50vw;

  display: flex;
  flex-direction: column;

  ${theme.spacing.pageSections.asGap}
`;

const UIHeader = styled.div<{}>`
  ${theme.typo.pageTitle.medium};
`;

const UIDescription = styled.div``;

const UIIntegrationsTitle = styled.h2`
  ${theme.typo.secondaryTitle};
`;

const UIIntegrationRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const UIIntegrationsTable = styled.div`
  display: flex;
  flex-grow: 1;
  min-width: 540px;

  flex-direction: column;
  gap: 16px;

  ${UIIntegrationRow}:last-child {
    border: 0;
  }
`;

const UIIntegrationIcon = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.12);
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

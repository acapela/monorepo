import React from "react";
import styled from "styled-components";

import { connectIntegration, disconnectIntegration } from "@aca/desktop/actions/auth";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { theme } from "@aca/ui/theme";

interface Props {
  service: IntegrationClient;
}

export function IntegrationCard({ service }: Props) {
  const { name, description, icon, additionalSettings } = service;
  return (
    <UIHolder>
      <UILogo>{icon}</UILogo>
      <UIBody>
        <UIHead>
          <UIInfoAboutIntegration>
            <UIName>{name}</UIName>
            <UIDescription>{description}</UIDescription>
          </UIInfoAboutIntegration>
          <UIConnectAction>
            <ActionButton
              action={connectIntegration}
              target={service}
              notApplicableLabel="Connected"
              notApplicableMode={service.disconnect && "hide"}
            />
            <ActionButton
              action={disconnectIntegration}
              target={service}
              notApplicableMode="hide"
              kind="primarySubtle"
            />
          </UIConnectAction>
        </UIHead>
        {additionalSettings && <UIAdditionalSettings>{additionalSettings}</UIAdditionalSettings>}
      </UIBody>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 16px;
  border: 1px solid #cdcdcd3b;
  padding: 16px;
  border-radius: 8px;
`;

const UILogo = styled.div`
  font-size: 40px;
`;

const UIBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-grow: 1;
`;

const UIHead = styled.div`
  display: flex;
`;

const UIInfoAboutIntegration = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
`;

const UIName = styled.div`
  ${theme.typo.item.title};
`;

const UIDescription = styled.div`
  ${theme.typo.item.subtitle.medium.secondary};
`;

const UIConnectAction = styled.div``;

const UIAdditionalSettings = styled.div``;
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { connectIntegration } from "@aca/desktop/actions/auth";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { Button, ButtonProps } from "@aca/ui/buttons/Button";
import { IconCross } from "@aca/ui/icons";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

interface Props {
  service: IntegrationClient;
}

const DisconnectButton = ({ onClick }: Pick<ButtonProps, "onClick">) => (
  <Button kind="primarySubtle" icon={<IconCross />} onClick={onClick}>
    Disconnect
  </Button>
);

export const IntegrationCard = observer(({ service }: Props) => {
  const { name, description, icon, additionalSettings } = service;
  const workspaces = service.getAccounts();
  const isSingularConnection = workspaces.length == 1 && !service.getCanConnect?.();

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
              aria-label={`Connect ${name}`}
            />
            {isSingularConnection && <DisconnectButton onClick={() => service.disconnect?.(workspaces[0].id)} />}
          </UIConnectAction>
        </UIHead>
        {!isSingularConnection &&
          workspaces.map(({ id, name }) => (
            <HStack key={id} justifyContent="space-between" alignItems="center">
              {name}
              <UIConnectAction>
                <DisconnectButton onClick={() => service.disconnect?.(id)} />
              </UIConnectAction>
            </HStack>
          ))}
        {additionalSettings && workspaces.length > 0 && (
          <UIAdditionalSettings>{additionalSettings}</UIAdditionalSettings>
        )}
      </UIBody>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  gap: 16px;
  border: 1px solid #8882;
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

import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { connectIntegration } from "@aca/desktop/actions/auth";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { switchSubscription } from "@aca/desktop/views/SettingsView/Subscription";
import { Button, ButtonProps } from "@aca/ui/buttons/Button";
import { IconCross } from "@aca/ui/icons";
import { HStack } from "@aca/ui/Stack";
import { theme } from "@aca/ui/theme";

interface Props {
  service: IntegrationClient;
}

const DisconnectButton = ({ onClick }: Pick<ButtonProps, "onClick">) => (
  <Button kind="secondary" icon={<IconCross />} onClick={onClick}>
    Disconnect
  </Button>
);

export const IntegrationCard = observer(({ service }: Props) => {
  const { name, description, additionalSettings } = service;
  const workspaces = service.getAccounts();
  const isSingularConnection = workspaces.length == 1 && !service.getCanConnect?.();

  const showUpsellButton = Boolean(accountStore.user?.subscription_plan !== "business" && service.isForBusinessUsers);

  if (showUpsellButton && process.env.STAGE == "production") {
    // TODO For now we hide the business-upsell in production
    return null;
  }

  return (
    <UIHolder>
      <UILogo>
        <IntegrationIcon integrationClient={service} />
      </UILogo>
      <UIBody>
        <UIHead>
          <UIInfoAboutIntegration>
            <UIName>{name}</UIName>
            <UIDescription>{description}</UIDescription>
          </UIInfoAboutIntegration>
          {showUpsellButton ? (
            <Button
              kind="primarySubtle"
              onClick={async () => {
                await switchSubscription("BUSINESS");
              }}
            >
              Upgrade to our business plan
            </Button>
          ) : (
            <UIConnectAction>
              <ActionButton
                action={connectIntegration}
                target={service}
                notApplicableLabel="Connected"
                notApplicableMode={service.disconnect && "hide"}
                aria-label={`Connect ${name}`}
                kind="primarySubtle"
              />
              {isSingularConnection && <DisconnectButton onClick={() => service.disconnect?.(workspaces[0].id)} />}
            </UIConnectAction>
          )}
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

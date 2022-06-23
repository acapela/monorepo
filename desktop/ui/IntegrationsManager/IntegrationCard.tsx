import { observer } from "mobx-react";
import React, { useState } from "react";
import styled from "styled-components";

import { connectIntegration } from "@aca/desktop/actions/auth";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { desktopRouter } from "@aca/desktop/routes";
import { accountStore } from "@aca/desktop/store/account";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SubscriptionPlan } from "@aca/gql";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
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
  const [isLoadingCheckout, setIsloadingCheckout] = useState(false);
  const { name, description, additionalSettings } = service;
  const workspaces = service.getAccounts();
  const isSingularConnection = workspaces.length == 1 && !service.getCanConnect?.();

  const subscriptionPlan = accountStore.user?.subscription_plan as Lowercase<SubscriptionPlan>;
  const showUpsellButton = Boolean(subscriptionPlan !== "ultimate" && service.isForUltimateUsers);

  // Whenever the subscription plan changes, we consider checkout having been loaded
  useDependencyChangeEffect(() => {
    setIsloadingCheckout(false);
  }, [subscriptionPlan]);

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
              isDisabled={isLoadingCheckout}
              onClick={async () => {
                desktopRouter.navigate("settings", { section: "subscription" });
              }}
            >
              Upgrade to our ultimate plan
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
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText};
  padding: 16px;
  border-radius: 8px;
`;

const UILogo = styled.div`
  ${theme.iconSize.section};
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
  ${theme.typo.bodyTitle};
`;

const UIDescription = styled.div`
  ${theme.typo.noteTitle.secondary};
`;

const UIConnectAction = styled.div``;

const UIAdditionalSettings = styled.div``;

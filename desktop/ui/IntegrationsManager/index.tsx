import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";
import { accountStore } from "@aca/desktop/store/account";
import { isInGmailPricingTier } from "@aca/shared/google";

import { IntegrationCard } from "./IntegrationCard";

export const IntegrationsManager = observer(() => (
  <UIHolder>
    {integrationClientList
      .filter((integration) => integration.name !== "Gmail" || isInGmailPricingTier(accountStore.user?.pricing_tier))
      .map((integration) => (
        <IntegrationCard key={integration.name} service={integration} />
      ))}
  </UIHolder>
));

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

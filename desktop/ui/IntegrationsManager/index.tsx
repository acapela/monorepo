import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";

import { IntegrationCard } from "./IntegrationCard";

export function IntegrationsManager() {
  return (
    <UIHolder>
      {integrationClientList
        .filter((integration) => process.env.STAGE !== "production" || integration.name !== "Gmail")
        .map((integration) => (
          <IntegrationCard key={integration.name} service={integration} />
        ))}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

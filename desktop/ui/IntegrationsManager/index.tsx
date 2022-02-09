import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";

import { IntegrationCard } from "./IntegrationCard";

export function IntegrationsManager() {
  return (
    <UIHolder>
      {integrationClientList.map((integration) => {
        return <IntegrationCard service={integration} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

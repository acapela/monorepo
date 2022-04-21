import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";

import { IntegrationCard } from "./IntegrationCard";

export const IntegrationsManager = observer(() => (
  <UIHolder>
    {integrationClientList
      .filter((integration) => !integration.getIsDisabled?.())
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

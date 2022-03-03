import React from "react";
import styled from "styled-components";

import { integrationClientList } from "@aca/desktop/domains/integrations";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { theme } from "@aca/ui/theme";

import { IntegrationHeader } from "./IntergrationHeader";

interface Props {
  onPicked: (integration: IntegrationClient) => void;
}

export function FilterIntegrationPicker({ onPicked }: Props) {
  return (
    <UIHolder>
      {integrationClientList.map((integration) => {
        return (
          <UIClient
            key={integration.name}
            onClick={() => {
              onPicked(integration);
            }}
          >
            <IntegrationHeader service={integration} />
          </UIClient>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  ${theme.spacing.actions.asGap}
`;

const UIClient = styled.div`
  display: flex;
  ${theme.spacing.actions.asGap}
  ${theme.colors.layout.background.interactive}
  ${theme.transitions.hover()}
  ${theme.box.items.heroItem.padding.radius};

  align-items: center;
`;

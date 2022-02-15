import React from "react";
import styled from "styled-components";

import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { theme } from "@aca/ui/theme";

interface Props {
  service: IntegrationClient;
}

export function IntegrationHeader({ service }: Props) {
  const { name, description, icon } = service;
  return (
    <UIHolder>
      <UILogo>{icon}</UILogo>
      <UIBody>
        <UIHead>
          <UIInfoAboutIntegration>
            <UIName>{name}</UIName>
            <UIDescription>{description}</UIDescription>
          </UIInfoAboutIntegration>
        </UIHead>
      </UIBody>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 16px;
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

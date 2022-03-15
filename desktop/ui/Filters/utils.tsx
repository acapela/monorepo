import React from "react";
import styled from "styled-components";

import { NotificationFilter } from "@aca/desktop/clientdb/list";
import { integrationClientList } from "@aca/desktop/domains/integrations";
import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";
import { injectProps } from "@aca/shared/components/injectProps";
import { theme } from "@aca/ui/theme";

export function getFilterIntegration(filter: NotificationFilter) {
  const targetIntegration = integrationClientList.find(
    (integration) => integration.notificationTypename === filter.__typename
  );

  return targetIntegration ?? null;
}

export const FILTER_EDITOR_OPTION_WIDTH = 220;

export const FilterSettingRow = injectProps(SettingRow, { fixedOptionWidth: FILTER_EDITOR_OPTION_WIDTH });

export function getWorkspaceLabel(integrationClient: IntegrationClient, id?: string) {
  const accounts = integrationClient.getAccounts();
  const label = id && accounts.length > 1 && accounts.find((c) => c.id == id)?.name;
  return label ? ` (${label})` : "";
}

export const UserFilterDisclaimer = styled((props) => (
  <div {...props}>This filter currently only shows people from whom you have already received a notification.</div>
))`
  ${theme.colors.text.opacity(0.8).asColor};
`;
